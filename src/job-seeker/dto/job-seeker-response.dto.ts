import { ApiProperty } from '@nestjs/swagger';

export class JobSeekerResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'JavaScript, TypeScript, Node.js' })
  skills: string;

  @ApiProperty({ example: '5 years of web development' })
  professionalExperience: string;

  @ApiProperty({ example: 'Bachelor in Computer Science' })
  qualification: string;

  @ApiProperty({ example: 'Computer Science' })
  majorSubjects: string;

  @ApiProperty({ example: '2' })
  certificates: string;

  @ApiProperty({ example: 'AWS Certified, Google Cloud Certified' })
  certificatesData: string;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  updatedAt: Date;
} 