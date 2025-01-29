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
import { Role, Status } from '../utils/constants/constants';
import { Location } from '../location/entities/location.entity';
import { SortOrder } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { JobPostFilterDto } from './dto/job-post-filter.dto';
import { DuplicateJobPostException } from '../utils/exceptions/jobPostException';
import { UserJob } from '../user-jobs/entities/user-job.entity';
import { SavedJob } from '../user-jobs/entities/saved-job.entity';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPost)
    private jobPostRepository: Repository<JobPost>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(UserJob)
    private userJobRepository: Repository<UserJob>,
    @InjectRepository(SavedJob)
    private savedJobRepository: Repository<SavedJob>,
  ) {}

  // async create(createJobPostDto: CreateJobPostDto, user: User) {
  //   const jobPost = new JobPost();
  //   jobPost.title = createJobPostDto.title;
  //   jobPost.salary = createJobPostDto.salary;
  //   jobPost.description = createJobPostDto.description;
  //   // jobPost.requirements = createJobPostDto.requirements;
  //   jobPost.type = createJobPostDto.type;
  //   jobPost.availability = createJobPostDto.availability;
  //   // jobPost.experienceLevel = createJobPostDto.experienceLevel;
  //   // jobPost.duration = createJobPostDto.duration;
  //   jobPost.employerId = user.employerProfile.id;
  //   jobPost.location= createJobPostDto.location;

  //   // if (createJobPostDto.locationId) {
  //   //   const location = await this.locationRepository.findOne({
  //   //     where: { id: createJobPostDto.locationId },
  //   //   });
  //   //   if (!location) {
  //   //     throw new NotFoundException('Location not found');
  //   //   }
  //   //   jobPost.locationId = createJobPostDto.locationId;
  //   // }
  //   return await this.jobPostRepository.save(jobPost);
  // }

  async create(createJobPostDto: CreateJobPostDto, user: User) {
    // Check if the employer already has a job post with the same title and status 'hiring'
    const existingJobPost = await this.jobPostRepository.findOne({
      where: {
        title: createJobPostDto.title,
        location: createJobPostDto.location,
        status: Status.Hiring,
        employerId: user.employerProfile.id, // Ensure the employer is the same
      },
    });
  
    if (existingJobPost) {
      throw new DuplicateJobPostException();  // Throw the custom exception
    }
  
    const jobPost = new JobPost();
    jobPost.title = createJobPostDto.title;
    jobPost.salary = createJobPostDto.salary;
    jobPost.description = createJobPostDto.description;
    jobPost.type = createJobPostDto.type;
    jobPost.availability = createJobPostDto.availability;
    jobPost.employerId = user.employerProfile.id;
    jobPost.location = createJobPostDto.location;
  
    // Save the new job post
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
      // experienceLevel,
      // duration,
      status,
      search,
      location,
      // radius,
    } = filterDto;

    const queryBuilder = this.jobPostRepository
      .createQueryBuilder('jobPost')
      .leftJoinAndSelect('jobPost.employer', 'employer')
      .leftJoinAndSelect('employer.user', 'user');
    // .leftJoinAndSelect('jobPost.location', 'location');

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

    // if (experienceLevel) {
    //   queryBuilder.andWhere('jobPost.experienceLevel = :experienceLevel', {
    //     experienceLevel,
    //   });
    // }

    // if (duration) {
    //   queryBuilder.andWhere('jobPost.duration = :duration', { duration });
    // }

    if (status) {
      queryBuilder.andWhere('jobPost.status = :status', { status });
    }

    if (location) {
      queryBuilder.andWhere('jobPost.location = :location', {
        location,
      });
    }

    if (search) {
      queryBuilder.andWhere('jobPost.title ILIKE :search', { search });
    }

    // Add radius search if radius is provided and user has a location
    // if (radius && user.location) {
    //   // Haversine formula for calculating distance
    //   queryBuilder
    //     .addSelect(
    //       `(
    //       6371 * acos(
    //         cos(radians(:latitude)) * cos(radians(location.latitude)) *
    //         cos(radians(location.longitude) - radians(:longitude)) +
    //         sin(radians(:latitude)) * sin(radians(location.latitude))
    //       )
    //     )`,
    //       'distance',
    //     )
    //     .having('distance <= :radius')
    //     .setParameters({
    //       latitude: user.location.latitude,
    //       longitude: user.location.longitude,
    //       radius,
    //     })
    //     .orderBy('distance', 'ASC');
    // }

    const [items, total] = await queryBuilder
      .orderBy(`jobPost.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    // Check if the user has saved jobs
    const appliedJobIds = user
    ? await this.userJobRepository
        .find({
          where: { user: { id: user.id } },
          relations: ['jobPost'],
        })
        .then((appliedJobs) =>
          appliedJobs.map((appliedJob) => appliedJob.jobPost.id),
        )
    : [];

  // Check if the user has saved jobs
  const savedJobIds = user
    ? await this.savedJobRepository
        .find({
          where: { user: { id: user.id } },
          relations: ['jobPost'],
        })
        .then((savedJobs) => savedJobs.map((savedJob) => savedJob.jobPost.id))
    : [];

  console.log('Applied Job IDs:', appliedJobIds);
  console.log('Saved Job IDs:', savedJobIds);

  const itemsWithStatuses = items.map((item) => {
    const jobPostWithStatuses = new JobPost();
    Object.assign(jobPostWithStatuses, item, {
      isApplied: appliedJobIds.includes(item.id), // Add application status
      isSaved: savedJobIds.includes(item.id), // Add saved status
    });
    return jobPostWithStatuses;
  });

  return {
    items: itemsWithStatuses,
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
      relations: ['employer', 'employer.user'],
    });

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    // Get application count
    const applicationCount = await this.userJobRepository.count({
      where: { jobPost: { id } },
    });

    // Create a new instance of JobPost with the application count
    const jobPostWithCount = Object.assign(new JobPost(), {
      ...jobPost,
      applicationCount,
    });

    return jobPostWithCount;
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
