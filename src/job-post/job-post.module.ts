import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPostService } from './job-post.service';
import { JobPostController } from './job-post.controller';
import { JobPost } from './entities/job-post.entity';
import { AuthModule } from '../auth/auth.module';
import { Employer } from '../employer/entities/employer.entity';
import { Location } from '../location/entities/location.entity';
import { JobSeeker } from '../job-seeker/entities/job-seeker.entity';
import { UserJob } from '../user-jobs/entities/user-job.entity';
import { SavedJob } from '../user-jobs/entities/saved-job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobPost,
      Employer,
      Location,
      JobSeeker,
      UserJob,
      SavedJob,
    ]),
    AuthModule,
  ],
  controllers: [JobPostController],
  providers: [JobPostService],
  exports: [JobPostService],
})
export class JobPostModule {}
