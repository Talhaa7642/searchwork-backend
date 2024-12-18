import { ApiProperty } from '@nestjs/swagger';
import { Role, Gender } from '../../utils/constants/constants';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: '+1234567890' })
  phoneNumber: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ enum: Role, example: Role.Employee })
  role: Role;

  @ApiProperty({ enum: Gender, example: Gender.Male })
  gender: Gender;

  @ApiProperty({ example: true })
  isEmailVerified: boolean;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ example: { id: 1, skills: 'JavaScript, TypeScript' } })
  jobSeekerProfile?: {
    id: number;
    skills: string;
  };

  @ApiProperty({ example: { id: 1, companyName: 'Tech Corp' } })
  employerProfile?: {
    id: number;
    companyName: string;
  };
} 