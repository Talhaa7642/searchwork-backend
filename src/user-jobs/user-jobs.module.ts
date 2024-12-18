import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserJobsController } from './user-jobs.controller';
import { UserJob } from './entities/user-job.entity';
import { UserJobsService } from './user-jobs.service';
import { JobPost } from '../job-post/entities/job-post.entity';
import { User } from '../user/entities/user.entity';
import { JobSeeker } from '../job-seeker/entities/job-seeker.entity';
import { AuthModule } from '../auth/auth.module';
import { Employer } from '../employer/entities/employer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserJob, JobPost, User, JobSeeker, Employer]),
    AuthModule,
  ],
  controllers: [UserJobsController],
  providers: [UserJobsService],
  exports: [UserJobsService],
})
export class UserJobsModule {}
