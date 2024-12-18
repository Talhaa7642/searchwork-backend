import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserJob } from './entities/user-job.entity';
import { CreateUserJobDto } from './dto/create-user-job.dto';
import { UpdateUserJobDto } from './dto/update-user-job.dto';
import { User } from '../user/entities/user.entity';
import { JobPost } from '../job-post/entities/job-post.entity';
import { UserJobFilterDto } from './dto/user-job-filter.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { Role, Status } from '../utils/constants/constants';
import { SortOrder } from '../common/dto/pagination.dto';

@Injectable()
export class UserJobsService {
  constructor(
    @InjectRepository(UserJob)
    private readonly userJobRepository: Repository<UserJob>,
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
  ) {}

  async create(
    createUserJobDto: CreateUserJobDto,
    user: User,
  ): Promise<UserJob> {
    // Profile check is handled by guard
    const jobPost = await this.jobPostRepository.findOne({
      where: { id: createUserJobDto.jobPostId },
    });

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    // Check if user has already applied
    const existingApplication = await this.userJobRepository.findOne({
      where: {
        jobPost: { id: createUserJobDto.jobPostId },
        user: { id: user.id },
      },
    });

    if (existingApplication) {
      throw new UnauthorizedException('You have already applied for this job');
    }

    const userJob = this.userJobRepository.create({
      ...createUserJobDto,
      user,
      jobPost,
      status: Status.Applied,
      appliedAt: new Date(),
    });

    return await this.userJobRepository.save(userJob);
  }

  async findAll(
    filterDto: UserJobFilterDto,
    user: User,
  ): Promise<PaginatedResponse<UserJob>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
      status,
      jobPostId,
      appliedAfter,
      appliedBefore,
    } = filterDto;

    const queryBuilder = this.userJobRepository
      .createQueryBuilder('userJob')
      .leftJoinAndSelect('userJob.jobPost', 'jobPost')
      .leftJoinAndSelect('userJob.user', 'user')
      .leftJoinAndSelect('jobPost.employer', 'employer');

    console.log('Filter DTO:', filterDto);
    console.log('Logged-in User:', user);

    // Apply role-based filters
    switch (user.role) {
      case Role.Employee:
        // Employees can only see their own applications
        queryBuilder.andWhere('user.id = :userId', { userId: user.id });
        break;

      case Role.Employer:
        // Employers can only see applications for their jobs
        queryBuilder.andWhere('employer.user.id = :employerId', {
          employerId: user.id,
        });
        break;

      case Role.Admin:
        // Admin can see all applications
        break;

      default:
        throw new UnauthorizedException(
          'Invalid role for viewing applications',
        );
    }

    // Apply additional filters
    if (status) {
      queryBuilder.andWhere('userJob.status = :status', { status });
    }

    if (jobPostId) {
      queryBuilder.andWhere('jobPost.id = :jobPostId', { jobPostId });
    }

    if (appliedAfter) {
      queryBuilder.andWhere('userJob.appliedAt >= :appliedAfter', {
        appliedAfter,
      });
    }

    if (appliedBefore) {
      queryBuilder.andWhere('userJob.appliedAt <= :appliedBefore', {
        appliedBefore,
      });
    }

    const skip = (page - 1) * limit;

    const [items, total] = await queryBuilder
      .orderBy(`userJob.${sortBy}`, sortOrder)
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    console.log('Generated SQL:', queryBuilder.getSql());
    console.log('Result Items:', items);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, user: User): Promise<UserJob> {
    const userJob = await this.userJobRepository.findOne({
      where: { id },
      relations: [
        'jobPost',
        'user',
        'user.jobSeekerProfile',
        'jobPost.employer',
        'jobPost.employer.user',
      ],
    });

    if (!userJob) {
      throw new NotFoundException('Job application not found');
    }

    // Check permissions based on role
    switch (user.role) {
      case Role.Employee:
        // Employees can only view their own applications
        if (userJob.user.id !== user.id) {
          throw new UnauthorizedException(
            'You can only view your own applications',
          );
        }
        break;

      case Role.Employer:
        // Employers can only view applications for their jobs
        if (userJob.jobPost.employer.user.id !== user.id) {
          throw new UnauthorizedException(
            'You can only view applications for your own job posts',
          );
        }
        break;

      case Role.Admin:
        break;

      default:
        throw new UnauthorizedException(
          'Invalid role for viewing applications',
        );
    }

    return userJob;
  }

  async update(
    id: number,
    updateUserJobDto: UpdateUserJobDto,
    user: User,
  ): Promise<UserJob> {
    const userJob = await this.userJobRepository.findOne({
      where: { id },
      relations: ['jobPost', 'jobPost.employer', 'jobPost.employer.user'],
    });

    if (!userJob) {
      throw new NotFoundException('Job application not found');
    }

    // Check permissions based on role
    switch (user.role) {
      case Role.Employer:
        // Employers can only update applications for their jobs
        if (userJob.jobPost.employer.user.id !== user.id) {
          throw new UnauthorizedException(
            'You can only update applications for your own job posts',
          );
        }
        break;

      case Role.Admin:
        break;

      default:
        throw new UnauthorizedException(
          'You do not have permission to update applications',
        );
    }

    Object.assign(userJob, updateUserJobDto);
    return await this.userJobRepository.save(userJob);
  }

  async remove(id: number, user: User): Promise<{ message: string }> {
    const userJob = await this.userJobRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!userJob) {
      throw new NotFoundException('Job application not found');
    }

    // Check permissions based on role
    switch (user.role) {
      case Role.Employee:
        // Employees can only withdraw their own applications
        if (userJob.user.id !== user.id) {
          throw new UnauthorizedException(
            'You can only withdraw your own applications',
          );
        }
        break;

      case Role.Admin:
        break;

      default:
        throw new UnauthorizedException(
          'You do not have permission to delete applications',
        );
    }

    await this.userJobRepository.remove(userJob);
    return { message: 'Application withdrawn successfully' };
  }

  async findByJobPost(jobPostId: number, user: User): Promise<UserJob[]> {
    const jobPost = await this.jobPostRepository.findOne({
      where: { id: jobPostId },
      relations: ['employer', 'employer.user', 'userJobs', 'userJobs.user'],
    });

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    // Check permissions based on role
    switch (user.role) {
      case Role.Employer:
        // Employers can only view applications for their jobs
        if (jobPost.employer.user.id !== user.id) {
          throw new UnauthorizedException(
            'You can only view applications for your own job posts',
          );
        }
        break;

      case Role.Admin:
        // Admin can view applications for any job post
        break;

      default:
        throw new UnauthorizedException(
          'You do not have permission to view these applications',
        );
    }

    return jobPost.userJobs;
  }
}
