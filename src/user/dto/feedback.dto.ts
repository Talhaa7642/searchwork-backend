import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({
    example: 'I have a suggestion for the app',
    description: 'The feedback text',
  })
  @IsNotEmpty()
  @IsString()
  feedbackText: string;
}
