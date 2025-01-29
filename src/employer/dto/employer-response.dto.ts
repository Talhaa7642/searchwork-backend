import { ApiProperty } from '@nestjs/swagger';

export class EmployerResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Tech Corp Inc.' })
  companyName: string;

  @ApiProperty({ example: 'Technology' })
  industry: string;

  @ApiProperty({ example: '50-100' })
  companySize: string;

  @ApiProperty({ example: '1234567890' })
  registrationNumber: string;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  updatedAt: Date;
} 