import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class EmployerFilterDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Filter by company name',
    example: 'Tech Corp',
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by industry',
    example: 'Technology',
  })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by company size',
    example: '50-100',
  })
  @IsOptional()
  @IsString()
  companySize?: string;

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
    description: 'Search in company name and industry',
    example: 'tech',
  })
  @IsOptional()
  @IsString()
  search?: string;
} 