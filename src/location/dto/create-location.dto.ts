import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLocationDto {
  @ApiProperty({ example: 'New York' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'NY' })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ example: 'USA' })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({ example: '123 Main St' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: '10001', required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ example: 40.7128 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: -74.006 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}
