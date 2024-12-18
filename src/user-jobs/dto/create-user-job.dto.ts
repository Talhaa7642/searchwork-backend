import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from '../../utils/constants/constants';

export class CreateUserJobDto {
  @ApiProperty()
  @IsNotEmpty()
  jobPostId: number;

  @ApiProperty()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ enum: Status, default: Status.Applied })
  @IsEnum(Status)
  status: Status;
}
