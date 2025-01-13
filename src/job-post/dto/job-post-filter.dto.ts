import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  IsString,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  JobType,
  JobAvailability,
  // ExperienceLevel,
  // JobDuration,
  Status,
} from '../../utils/constants/constants';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class JobPostFilterDto extends PaginationDto {
  @ApiProperty({
    enum: JobType,
    required: false,
    description: 'Filter by job type',
    example: JobType.FullTime,
  })
  @IsOptional()
  @IsEnum(JobType)
  type?: JobType;

  @ApiProperty({
    enum: JobAvailability,
    required: false,
    description: 'Filter by job availability',
    example: JobAvailability.Remote,
  })
  @IsOptional()
  @IsEnum(JobAvailability)
  availability?: JobAvailability;

  @ApiProperty({
    required: false,
    description: 'Filter by minimum salary',
    example: 50000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minSalary?: number;

  @ApiProperty({
    required: false,
    description: 'Filter by maximum salary',
    example: 100000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxSalary?: number;

  // @ApiProperty({
  //   enum: ExperienceLevel,
  //   required: false,
  //   description: 'Filter by experience level',
  //   example: ExperienceLevel.Intermediate,
  // })
  // @IsOptional()
  // @IsEnum(ExperienceLevel)
  // experienceLevel?: ExperienceLevel;

  // @ApiProperty({
  //   enum: JobDuration,
  //   required: false,
  //   description: 'Filter by job duration',
  //   example: JobDuration.Permanent,
  // })
  // @IsOptional()
  // @IsEnum(JobDuration)
  // duration?: JobDuration;

  @ApiProperty({
    enum: Status,
    required: false,
    description: 'Filter by job status',
    example: Status.Hiring,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({
    required: false,
    description: 'Search in title',
    example: 'developer',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by location',
    example: 'USA',
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  location?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by employer ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  employerId?: number;

  @ApiProperty({
    required: false,
    description: 'Filter jobs posted after this date',
    example: '2024-12-01',
  })
  @IsOptional()
  @IsDateString()
  postedAfter?: Date;

  @ApiProperty({
    required: false,
    description: 'Filter jobs posted before this date',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString()
  postedBefore?: Date;

  // @ApiProperty({
  //   required: false,
  //   description: 'Search radius in kilometers from user location',
  //   example: 50,
  // })
  // @IsOptional()
  // @Type(() => Number)
  // @IsNumber()
  // @Min(0)
  // radius?: number;
}
