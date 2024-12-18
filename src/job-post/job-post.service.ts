import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPost } from './entities/job-post.entity';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { User } from '../user/entities/user.entity';
import { Role } from '../utils/constants/constants';
import { Location } from '../location/entities/location.entity';
import { SortOrder } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { JobPostFilterDto } from './dto/job-post-filter.dto';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPost)
    private jobPostRepository: Repository<JobPost>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async create(createJobPostDto: CreateJobPostDto, user: User) {
    const jobPost = new JobPost();
    jobPost.title = createJobPostDto.title;
    jobPost.salary = createJobPostDto.salary;
    jobPost.description = createJobPostDto.description;
    jobPost.requirements = createJobPostDto.requirements;
    jobPost.type = createJobPostDto.type;
    jobPost.availability = createJobPostDto.availability;
    jobPost.experienceLevel = createJobPostDto.experienceLevel;
    jobPost.duration = createJobPostDto.duration;
    jobPost.employerId = user.employerProfile.id;

    if (createJobPostDto.locationId) {
      const location = await this.locationRepository.findOne({
        where: { id: createJobPostDto.locationId },
      });
      if (!location) {
        throw new NotFoundException('Location not found');
      }
      jobPost.locationId = createJobPostDto.locationId;
    }
    return await this.jobPostRepository.save(jobPost);
  }

  async findAll(
    filterDto: JobPostFilterDto,
    user?: User,
  ): Promise<PaginatedResponse<JobPost>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
      type,
      availability,
      minSalary,
      maxSalary,
      experienceLevel,
      duration,
      status,
      search,
      locationId,
      radius,
    } = filterDto;

    const queryBuilder = this.jobPostRepository
      .createQueryBuilder('jobPost')
      .leftJoinAndSelect('jobPost.employer', 'employer')
      .leftJoinAndSelect('employer.user', 'user')
      .leftJoinAndSelect('jobPost.location', 'location');

    // Apply filters without role-based restrictions
    if (type) {
      queryBuilder.andWhere('jobPost.type = :type', { type });
    }

    if (availability) {
      queryBuilder.andWhere('jobPost.availability = :availability', {
        availability,
      });
    }

    if (minSalary) {
      queryBuilder.andWhere('jobPost.salary >= :minSalary', { minSalary });
    }

    if (maxSalary) {
      queryBuilder.andWhere('jobPost.salary <= :maxSalary', { maxSalary });
    }

    if (experienceLevel) {
      queryBuilder.andWhere('jobPost.experienceLevel = :experienceLevel', {
        experienceLevel,
      });
    }

    if (duration) {
      queryBuilder.andWhere('jobPost.duration = :duration', { duration });
    }

    if (status) {
      queryBuilder.andWhere('jobPost.status = :status', { status });
    }

    if (locationId) {
      queryBuilder.andWhere('jobPost.location.id = :locationId', {
        locationId,
      });
    }

    if (search) {
      queryBuilder.andWhere('jobPost.title ILIKE :search', { search });
    }

    // Add radius search if radius is provided and user has a location
    if (radius && user.location) {
      // Haversine formula for calculating distance
      queryBuilder
        .addSelect(
          `(
          6371 * acos(
            cos(radians(:latitude)) * cos(radians(location.latitude)) *
            cos(radians(location.longitude) - radians(:longitude)) +
            sin(radians(:latitude)) * sin(radians(location.latitude))
          )
        )`,
          'distance',
        )
        .having('distance <= :radius')
        .setParameters({
          latitude: user.location.latitude,
          longitude: user.location.longitude,
          radius,
        })
        .orderBy('distance', 'ASC');
    }

    const [items, total] = await queryBuilder
      .orderBy(`jobPost.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

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

  async findOne(id: number): Promise<JobPost> {
    const jobPost = await this.jobPostRepository.findOne({
      where: { id },
      relations: ['employer', 'employer.user', 'location'],
    });

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    return jobPost;
  }

  async update(id: number, updateJobPostDto: UpdateJobPostDto, user: User) {
    const jobPost = await this.findOne(id);

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    // Only employer who owns the post or admin can update
    if (user.role === Role.Employer && jobPost.employer.user.id !== user.id) {
      throw new UnauthorizedException('You can only update your own job posts');
    } else if (user.role !== Role.Admin && user.role !== Role.Employer) {
      throw new UnauthorizedException(
        'You do not have permission to update job posts',
      );
    }

    await this.jobPostRepository.update(id, updateJobPostDto);
    return this.findOne(id);
  }

  async remove(id: number, user: User) {
    const jobPost = await this.findOne(id);

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    // Only employer who owns the post or admin can delete
    if (user.role === Role.Employer && jobPost.employer.user.id !== user.id) {
      throw new UnauthorizedException('You can only delete your own job posts');
    } else if (user.role !== Role.Admin && user.role !== Role.Employer) {
      throw new UnauthorizedException(
        'You do not have permission to delete job posts',
      );
    }

    await this.jobPostRepository.remove(jobPost);
    return { message: 'Job post deleted successfully' };
  }
}
