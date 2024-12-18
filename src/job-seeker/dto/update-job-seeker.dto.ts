import { PartialType } from '@nestjs/swagger';
import { CreateJobSeekerDto } from './create-job-seeker.dto';

export class UpdateJobSeekerDto extends PartialType(CreateJobSeekerDto) {}
