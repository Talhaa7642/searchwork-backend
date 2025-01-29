import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employer } from './entities/employer.entity';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto, UpdateToggleProfileVisibility } from './dto/update-employer.dto';
import { User } from '../user/entities/user.entity';
import { EmployerFilterDto } from './dto/employer-filter.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { SortOrder } from '../common/dto/pagination.dto';
import { Preferences } from '../user/entities/preferences.entity';

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(Employer)
    private readonly employerRepository: Repository<Employer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Preferences)
    private readonly preferencesRepository: Repository<Preferences>,
  ) {}

  async create(userId: number, createEmployerDto: CreateEmployerDto): Promise<Employer> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user already has an employer profile
    const existingProfile = await this.employerRepository.findOne({
      where: { user: { id: userId } },
    });

    if (existingProfile) {
      throw new UnauthorizedException('User already has an employer profile');
    }

    const newEmployer = this.employerRepository.create({
      ...createEmployerDto,
      user,
    });

    return await this.employerRepository.save(newEmployer);
  }

  async findAll(filterDto: EmployerFilterDto): Promise<PaginatedResponse<Employer>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
      companyName,
      industry,
      companySize,
      userId,
      search,
    } = filterDto;

    const queryBuilder = this.employerRepository
      .createQueryBuilder('employer')
      .leftJoinAndSelect('employer.user', 'user')
      .leftJoinAndSelect('employer.jobPosts', 'jobPosts');

    if (companyName) {
      queryBuilder.andWhere('LOWER(employer.companyName) LIKE LOWER(:companyName)', {
        companyName: `%${companyName}%`,
      });
    }

    if (industry) {
      queryBuilder.andWhere('LOWER(employer.industry) = LOWER(:industry)', {
        industry,
      });
    }

    if (companySize) {
      queryBuilder.andWhere('employer.companySize = :companySize', {
        companySize,
      });
    }

    if (userId) {
      queryBuilder.andWhere('employer.user.id = :userId', { userId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(employer.companyName) LIKE LOWER(:search) OR LOWER(employer.industry) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const skip = (page - 1) * limit;

    const [items, total] = await queryBuilder
      .orderBy(`employer.${sortBy}`, sortOrder)
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

  async findOne(id: number): Promise<Employer> {
    const employer = await this.employerRepository.findOne({
      where: { id },
      relations: ['user', 'jobPosts'],
    });

    if (!employer) {
      throw new NotFoundException('Employer profile not found');
    }

    return employer;
  }

  async update(
    id: number,
    updateEmployerDto: UpdateEmployerDto,
    user: User,
  ): Promise<Employer> {
    const employer = await this.findOne(id);

    if (employer.user.id !== user.id) {
      throw new UnauthorizedException('You can only update your own profile');
    }

    Object.assign(employer, updateEmployerDto);
    return await this.employerRepository.save(employer);
  }

  async updateEmployer(id: number, updateToggleProfileVisibility: UpdateToggleProfileVisibility) {
    console.log(id, updateToggleProfileVisibility, '----------------');
    const preferences = await this.preferencesRepository.findOne({
      where: {user: { id: id } },
      relations: ['user'],
    });
    console.log(preferences, '00000000');
    if (!preferences) {
      throw new NotFoundException('Preferences not found');
    }
    
    Object.assign(preferences, updateToggleProfileVisibility);
    console.log(preferences, updateToggleProfileVisibility);
    return this.preferencesRepository.save(preferences);
  }

  async remove(id: number, user: User): Promise<{ message: string }> {
    const employer = await this.findOne(id);

    if (employer.user.id !== user.id) {
      throw new UnauthorizedException('You can only delete your own profile');
    }

    await this.employerRepository.remove(employer);
    return { message: 'Employer profile removed successfully' };
  }
}
