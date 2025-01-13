import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SaveJobDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  jobPostId: number;
}
