import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobSeeker } from './entities/job-seeker.entity';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';
import { User } from '../user/entities/user.entity';
import { JobSeekerFilterDto } from './dto/job-seeker-filter.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { SortOrder } from '../common/dto/pagination.dto';
import { Role } from '../utils/constants/constants';
import { S3Service } from '../utils/s3Services/s3Services';

@Injectable()
export class JobSeekerService {
  constructor(
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly s3Service: S3Service,
  ) {}

  async findAll(
    filterDto: JobSeekerFilterDto,
    user?: User,
  ): Promise<PaginatedResponse<JobSeeker>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
      skills,
      qualification,
      majorSubjects,
      userId,
      search,
    } = filterDto;

    const queryBuilder = this.jobSeekerRepository
      .createQueryBuilder('jobSeeker')
      .leftJoinAndSelect('jobSeeker.user', 'user')
      .leftJoinAndSelect('user.userJobs', 'userJobs');

    if (skills) {
      queryBuilder.andWhere('LOWER(jobSeeker.skills) LIKE LOWER(:skills)', {
        skills: `%${skills}%`,
      });
    }

    if (qualification) {
      queryBuilder.andWhere(
        'LOWER(jobSeeker.qualification) = LOWER(:qualification)',
        {
          qualification,
        },
      );
    }

    if (majorSubjects) {
      queryBuilder.andWhere(
        'LOWER(jobSeeker.majorSubjects) = LOWER(:majorSubjects)',
        {
          majorSubjects,
        },
      );
    }

    if (userId) {
      queryBuilder.andWhere('user.id = :userId', { userId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(jobSeeker.skills) LIKE LOWER(:search) OR  LOWER(jobSeeker.professionalExperience) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const skip = (page - 1) * limit;

    const [items, total] = await queryBuilder
      .orderBy(`jobSeeker.${sortBy}`, sortOrder)
      .skip(skip)
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

  async findOne(id: number): Promise<JobSeeker> {
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { id },
      relations: ['user', 'user.userJobs'],
    });

    if (!jobSeeker) {
      throw new NotFoundException('Job seeker profile not found');
    }

    return jobSeeker;
  }

  async create(
    createJobSeekerDto: CreateJobSeekerDto,
    user: User,
  ): Promise<JobSeeker> {
    if (user.role !== Role.Employee) {
      throw new UnauthorizedException(
        'Only employees can create job seeker profiles',
      );
    }

    const existingProfile = await this.jobSeekerRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (existingProfile) {
      throw new UnauthorizedException('User already has a job seeker profile');
    }
  
    // let profileImageUrl: string | undefined;
    // if (createJobSeekerDto.image) {
    //   const uploadResult = await this.s3Service.uploadFile({
    //     imageObject: {
    //       path: `users/${user.id}/profile.jpg`,
    //       data: createJobSeekerDto.image,
    //       mime: 'image/jpeg',
    //     },
    //   });
  
    //   profileImageUrl = uploadResult.Location;
    // }
  
    // if (profileImageUrl) {
    //   user.profileImageUrl = profileImageUrl;
    //   await this.userRepository.save(user);
    // }
  
    const newJobSeeker = this.jobSeekerRepository.create({
      ...createJobSeekerDto,
      user,
    });
  
    return await this.jobSeekerRepository.save(newJobSeeker);
  }
  

  async update(
    id: number,
    updateJobSeekerDto: UpdateJobSeekerDto,
    user: User,
  ): Promise<JobSeeker> {
    const jobSeeker = await this.findOne(id);

    if (user.role === Role.Employee && jobSeeker.user.id !== user.id) {
      throw new UnauthorizedException('You can only update your own profile');
    } else if (user.role !== Role.Admin && user.role !== Role.Employee) {
      throw new UnauthorizedException(
        'You do not have permission to update profiles',
      );
    }

    Object.assign(jobSeeker, updateJobSeekerDto);
    return await this.jobSeekerRepository.save(jobSeeker);
  }

  async remove(id: number, user: User): Promise<{ message: string }> {
    const jobSeeker = await this.findOne(id);

    if (user.role === Role.Employee && jobSeeker.user.id !== user.id) {
      throw new UnauthorizedException('You can only delete your own profile');
    } else if (user.role !== Role.Admin && user.role !== Role.Employee) {
      throw new UnauthorizedException(
        'You do not have permission to delete profiles',
      );
    }

    await this.jobSeekerRepository.remove(jobSeeker);
    return { message: 'Job seeker profile removed successfully' };
  }
}
