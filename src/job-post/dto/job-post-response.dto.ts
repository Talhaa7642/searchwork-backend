import { ApiProperty } from '@nestjs/swagger';
import {
  JobType,
  JobAvailability,
  ExperienceLevel,
  JobDuration,
  Status,
} from '../../utils/constants/constants';

export class JobPostResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Senior Software Engineer' })
  title: string;

  @ApiProperty({ enum: JobType, example: JobType.FullTime })
  type: JobType;

  @ApiProperty({ example: 'We are looking for an experienced developer...' })
  description: string;

  @ApiProperty({ example: '5+ years of experience in Node.js...' })
  requirements: string;

  @ApiProperty({ example: 120000 })
  salary: number;

  @ApiProperty({ enum: JobAvailability, example: JobAvailability.Remote })
  availability: JobAvailability;

  @ApiProperty({ enum: ExperienceLevel, example: ExperienceLevel.Senior })
  experienceLevel: ExperienceLevel;

  @ApiProperty({ enum: JobDuration, example: JobDuration.Permanent })
  duration: JobDuration;

  @ApiProperty({ enum: Status, example: Status.Hiring })
  status: Status;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  updatedAt: Date;
}
