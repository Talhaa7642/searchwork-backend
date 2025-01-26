import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  jobPostId: number;

  @ApiProperty()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    required: false,
    example: false,
  })
  @IsBoolean()
  isRead: false;
}
