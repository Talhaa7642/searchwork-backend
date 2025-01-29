import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
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
import { SavedJob } from './entities/saved-job.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { MailService } from '../services/mailService';

@Injectable()
export class UserJobsService {
  constructor(
    @InjectRepository(UserJob)
    private readonly userJobRepository: Repository<UserJob>,
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
    @InjectRepository(SavedJob)
    private readonly savedJobRepository: Repository<SavedJob>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly mailService: MailService,

  ) {}

  async create(
    createUserJobDto: CreateUserJobDto,
    user: User,
  ): Promise<UserJob> {
    // Profile check is handled by guard
    const jobPost = await this.jobPostRepository.findOne({
      where: { id: createUserJobDto.jobPostId },
      relations: ['employer', 'employer.user'],
    });
  
    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }
  
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
  
    const employerAsUser = jobPost?.employer?.user;
    await this.notificationRepository.save({
      jobPost,
      user: employerAsUser,
      message: `User ${user.fullName} has applied to your job post "${jobPost.title}".`,
      isRead: false,
    });
  
    const savedUserJob = await this.userJobRepository.save(userJob);
  
    await this.updateJobPostApplicationCount(jobPost.id);
  
    // Send email notifications
    const employerEmail = employerAsUser?.email;
    const jobSeekerEmail = user.email;
  
    try {
      if (employerEmail) {
        await this.mailService.sendEmployerNotificationEmail(
          employerEmail,
          jobPost.title,
          user.fullName,
        );
      }
  
      if (jobSeekerEmail) {
        await this.mailService.sendJobSeekerConfirmationEmail(
          jobSeekerEmail,
          jobPost.title,
        );
      }
    } catch (error) {
      console.error('Error sending email notifications:', error.message);
    }
  
    return savedUserJob;
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
      .leftJoinAndSelect('jobPost.employer', 'employer')
      .leftJoinAndSelect('user.jobSeekerProfile', 'jobSeeker');

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
      relations: ['user', 'jobPost'],
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

    const jobPostId = userJob.jobPost.id;
    await this.userJobRepository.remove(userJob);

    await this.updateJobPostApplicationCount(jobPostId);

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

  async saveJob(jobPostId: number, user: User): Promise<SavedJob> {
    const jobPost = await this.jobPostRepository.findOne({
      where: { id: jobPostId },
    });

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    const existingSave = await this.savedJobRepository.findOne({
      where: {
        jobPost: { id: jobPostId },
        user: { id: user.id },
      },
    });

    if (existingSave) {
      throw new ConflictException('Job already saved');
    }

    const savedJob = this.savedJobRepository.create({
      user,
      jobPost,
    });

    return await this.savedJobRepository.save(savedJob);
  }

  async unsaveJob(jobPostId: number, user: User): Promise<void> {
    const savedJob = await this.savedJobRepository.findOne({
      where: {
        jobPost: { id: jobPostId },
        user: { id: user.id },
      },
    });

    if (!savedJob) {
      throw new NotFoundException('Saved job not found');
    }

    await this.savedJobRepository.remove(savedJob);
  }

  async getSavedJobs(user: User): Promise<SavedJob[]> {
    return await this.savedJobRepository.find({
      where: { user: { id: user.id } },
      relations: ['jobPost', 'jobPost.employer'],
    });
  }

  async getApplicationsByStatus(
    user: User,
    status: Status,
  ): Promise<UserJob[]> {
    console.log(user,'====user------', status)
    return await this.userJobRepository.find({
      where: {
        user: { id: user.id },
        status,
      },
      relations: ['jobPost', 'jobPost.employer'],
    });
  }

  async clearJobHistory(user: User): Promise<void> {
    await this.savedJobRepository.delete({ user: { id: user.id } });
  }

  async getJobApplicationCount(jobPostId: number): Promise<number> {
    return await this.userJobRepository.count({
      where: { jobPost: { id: jobPostId } },
    });
  }

  private async updateJobPostApplicationCount(
    jobPostId: number,
  ): Promise<void> {
    const count = await this.userJobRepository.count({
      where: { jobPost: { id: jobPostId } },
    });

    await this.jobPostRepository.update(
      { id: jobPostId },
      { applicationCount: count },
    );
  }

  async markAsViewed(id: number, user: User): Promise<UserJob> {
    const userJob = await this.userJobRepository.findOne({
      where: { id },
      relations: ['jobPost', 'jobPost.employer', 'jobPost.employer.user', 'user'],
    });
  
    if (!userJob) {
      throw new NotFoundException('Application not found');
    }
  
    if (!userJob.jobPost?.employer?.user) {
      throw new NotFoundException('Employer user data not found');
    }
  
    if (user.role !== Role.Admin && userJob.jobPost.employer.user.id !== user.id) {
      throw new UnauthorizedException('You do not have permission to view this application');
    }
  
    if (userJob.isViewed) {
      return userJob;
    }
  
    userJob.isViewed = true;
  
    await this.notificationRepository.save({
      jobPost: userJob.jobPost,
      user: userJob.user,
      message: `Your application for the job "${userJob.jobPost.title}" has been viewed by the employer.`,
      isRead: false,
    });
  
    try {
      if (userJob.user.email) {
        await this.mailService.sendApplicationViewedNotification(
          userJob.user.email,
          userJob.jobPost.title,
        );
      }
    } catch (error) {
      console.error('Error sending application viewed email notification:', error.message);
    }
  
    return this.userJobRepository.save(userJob);
  }
  
  
  
}
