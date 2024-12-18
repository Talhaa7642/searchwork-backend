import { ApiProperty } from '@nestjs/swagger';

export class LocationResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'New York' })
  city: string;

  @ApiProperty({ example: 'NY' })
  state: string;

  @ApiProperty({ example: 'USA' })
  country: string;

  @ApiProperty({ example: '10001' })
  postalCode?: string;

  @ApiProperty({ example: 40.7128 })
  latitude: number;

  @ApiProperty({ example: -74.006 })
  longitude: number;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  updatedAt: Date;
}
