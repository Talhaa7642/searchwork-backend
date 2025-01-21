import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateJobSeekerDto {
  @ApiProperty({
    example: 'Software Engineer',
    description: 'Please enter your skills',
  })
  @IsOptional()
  @IsString()
  skills: string;

  @ApiProperty({
    example: 'Full Stack Developer',
    description: 'Professional Experience of the user',
  })
  @IsOptional()
  @IsString()
  professionalExperience: string;

  @ApiProperty({ example: 'Bachelors', description: 'User qualification' })
  @IsOptional()
  @IsString()
  qualification: string;

  @ApiProperty({
    example: 'Computer Science',
    description: 'User degree major subjects',
  })
  @IsOptional()
  @IsString()
  majorSubjects: string;

  @ApiProperty({
    example: '2',
    description: 'How many certificates the user has',
  })
  @IsOptional()
  @IsString()
  certificates: string;

  @ApiProperty({
    example: 'Picture of certificates',
    description: 'Upload certificates if user has any',
  })
  @IsOptional()
  @IsString()
  certificatesData: string;
}
