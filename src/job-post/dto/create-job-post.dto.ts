import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  JobType,
  JobAvailability,
  ExperienceLevel,
  // JobDuration,
} from '../../utils/constants/constants';

export class CreateJobPostDto {
  @ApiProperty({
    example: 'Senior Software Engineer',
    description: 'Job title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    enum: JobType,
    example: JobType.FullTime,
    description: 'Type of job',
  })
  @IsEnum(JobType)
  @IsNotEmpty()
  type: JobType;

  @ApiProperty({
    example: 'We are looking for an experienced software engineer...',
    description: 'Job description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  // @ApiProperty({
  //   example: '5+ years experience in Node.js...',
  //   description: 'Job requirements',
  // })
  // @IsString()
  // @IsOptional()
  // requirements?: string;

  @ApiProperty({
    example: "USA",
    description: 'Location where the job is based',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example: 100000,
    description: 'Annual salary',
  })
  @IsNumber()
  @IsNotEmpty()
  salary: number;

  @ApiProperty({
    enum: JobAvailability,
    example: JobAvailability.OnSite,
    description: 'Job availability type',
  })
  @IsEnum(JobAvailability)
  @IsNotEmpty()
  availability: JobAvailability;

  // @ApiProperty({
  //   enum: ExperienceLevel,
  //   example: ExperienceLevel.Senior,
  //   description: 'Required experience level',
  // })
  // @IsEnum(ExperienceLevel)
  // @IsNotEmpty()
  // experienceLevel: ExperienceLevel;

  // @ApiProperty({
  //   enum: JobDuration,
  //   example: JobDuration.Permanent,
  //   description: 'Job duration type',
  // })
  // @IsEnum(JobDuration)
  // @IsNotEmpty()
  // duration: JobDuration;
}
