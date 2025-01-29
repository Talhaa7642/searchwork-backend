import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class JobSeekerFilterDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Filter by skills',
    example: 'JavaScript',
  })
  @IsOptional()
  @IsString()
  skills?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by qualification',
    example: 'Bachelor',
  })
  @IsOptional()
  @IsString()
  qualification?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by major subjects',
    example: 'Computer Science',
  })
  @IsOptional()
  @IsString()
  majorSubjects?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by user ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userId?: number;

  @ApiProperty({
    required: false,
    description: 'Search in skills and experience',
    example: 'developer',
  })
  @IsOptional()
  @IsString()
  search?: string;
} 