import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserProfile } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { SortOrder } from '../common/dto/pagination.dto';
import { Role } from '../utils/constants/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(filterDto: UserFilterDto): Promise<PaginatedResponse<User>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
      role,
      gender,
      isEmailVerified,
      search,
    } = filterDto;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.jobSeekerProfile', 'jobSeeker')
      .leftJoinAndSelect('user.employerProfile', 'employer');

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (gender) {
      queryBuilder.andWhere('user.gender = :gender', { gender });
    }

    if (isEmailVerified !== undefined) {
      queryBuilder.andWhere('user.isEmailVerified = :isEmailVerified', {
        isEmailVerified,
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(user.fullName) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const skip = (page - 1) * limit;

    const [items, total] = await queryBuilder
      .orderBy(`user.${sortBy}`, sortOrder)
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

  async findOne(id: number, currentUser: User): Promise<User> {
    // Users can view their own profile or admin can view any profile
    if (currentUser.id !== id && currentUser.role !== Role.Admin) {
      throw new UnauthorizedException('You can only view your own profile');
    }

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['jobSeekerProfile', 'employerProfile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['jobSeekerProfile', 'employerProfile'],
    });
  }

  async updateProfile(
    id: number,
    updateUserDto: UpdateUserProfile,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['jobSeekerProfile', 'employerProfile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (
      updateUserDto.email &&
      updateUserDto.email !== user.email &&
      (await this.findOneByEmail(updateUserDto.email))
    ) {
      throw new ConflictException('Email already exists');
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['jobSeekerProfile', 'employerProfile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }
}
