import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from './roles.guard';
import { Employer } from '../../employer/entities/employer.entity';
import { JobSeeker } from '../../job-seeker/entities/job-seeker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employer, JobSeeker])],
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class GuardsModule {}
