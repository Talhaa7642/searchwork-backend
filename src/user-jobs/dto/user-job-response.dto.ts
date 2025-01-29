import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../../utils/constants/constants';

export class UserJobResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  jobPostId: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ enum: Status, example: Status.Applied })
  status: Status;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  appliedAt: Date;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ example: { id: 1, title: 'Software Engineer' } })
  jobPost: {
    id: number;
    title: string;
  };

  @ApiProperty({ example: { id: 1, fullName: 'John Doe' } })
  user: {
    id: number;
    fullName: string;
  };
} 