import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class LocationFilterDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Filter by city name',
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by state/province',
    example: 'NY',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by country',
    example: 'USA',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    required: false,
    description: 'Search in city, state, and country',
    example: 'york',
  })
  @IsOptional()
  @IsString()
  search?: string;
} 