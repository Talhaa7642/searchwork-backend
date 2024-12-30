import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { Status } from '../../utils/constants/constants';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class UserJobFilterDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Filter by job post ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  jobPostId?: number;

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
    enum: Status,
    required: false,
    description: 'Filter by application status',
    example: Status.Applied,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({
    required: false,
    description: 'Filter applications after date',
    example: '2024-03-01',
  })
  @IsOptional()
  @IsDateString()
  appliedAfter?: Date;

  @ApiProperty({
    required: false,
    description: 'Filter applications before date',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString()
  appliedBefore?: Date;
} 