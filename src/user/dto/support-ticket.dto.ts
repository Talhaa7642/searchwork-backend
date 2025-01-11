import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSupportTicketDto {
  @ApiProperty({
    description: 'The title of the issue reported in the support ticket',
    example: 'Login issue',
  })
  @IsNotEmpty()
  @IsString()
  issueTitle: string;

  @ApiProperty({
    description: 'Detailed description of the issue reported in the support ticket',
    example: 'Unable to log in with the provided credentials, showing an incorrect password error.',
  })
  @IsNotEmpty()
  @IsString()
  issueDescription: string;

  @ApiPropertyOptional({
    description: 'Priority level of the support ticket',
    example: 'high',
    enum: ['low', 'medium', 'high'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['low', 'medium', 'high'], {
    message: 'Priority must be one of the following: low, medium, high',
  })
  priority?: string;
}

export class UpdateSupportTicketDto {
  @ApiProperty({
    description: 'Current status of the support ticket',
    example: 'in-progress',
    enum: ['open', 'in-progress', 'resolved', 'closed'],
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['open', 'in-progress', 'resolved', 'closed'], {
    message: 'Status must be one of the following: open, in-progress, resolved, closed',
  })
  status: string;

  @ApiPropertyOptional({
    description: 'Updated priority level of the support ticket',
    example: 'medium',
    enum: ['low', 'medium', 'high'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['low', 'medium', 'high'], {
    message: 'Priority must be one of the following: low, medium, high',
  })
  priority?: string;
}
