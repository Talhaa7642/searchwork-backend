import { PartialType } from '@nestjs/swagger';
import { CreateUserJobDto } from './create-user-job.dto';

export class UpdateUserJobDto extends PartialType(CreateUserJobDto) {}
