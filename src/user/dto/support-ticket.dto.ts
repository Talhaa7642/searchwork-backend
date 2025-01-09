import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSupportTicketDto {
  @IsNotEmpty()
  @IsString()
  issueTitle: string;

  @IsNotEmpty()
  @IsString()
  issueDescription: string;

  @IsOptional()
  @IsString()
  priority?: string;
}

export class UpdateSupportTicketDto {
  @IsNotEmpty()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  priority?: string;
}
