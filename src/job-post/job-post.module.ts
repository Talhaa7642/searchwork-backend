import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPostService } from './job-post.service';
import { JobPostController } from './job-post.controller';
import { JobPost } from './entities/job-post.entity';
import { AuthModule } from '../auth/auth.module';
import { Employer } from '../employer/entities/employer.entity';
import { Location } from '../location/entities/location.entity';
import { JobSeeker } from '../job-seeker/entities/job-seeker.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobPost, Employer, Location, JobSeeker]),
    AuthModule,
  ],
  controllers: [JobPostController],
  providers: [JobPostService],
  exports: [JobPostService],
})
export class JobPostModule {}
