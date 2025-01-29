import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsBoolean } from 'class-validator';
import { Role, Gender } from '../../utils/constants/constants';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class UserFilterDto extends PaginationDto {
  @ApiProperty({
    enum: Role,
    required: false,
    description: 'Filter by user role',
    example: Role.Employee,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({
    enum: Gender,
    required: false,
    description: 'Filter by gender',
    example: Gender.Male,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({
    required: false,
    description: 'Filter by email verification status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @ApiProperty({
    required: false,
    description: 'Search in full name and email',
    example: 'john',
  })
  @IsOptional()
  @IsString()
  search?: string;
} 