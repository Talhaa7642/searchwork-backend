import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobSeekerService } from './job-seeker.service';
import { JobSeekerController } from './job-seeker.controller';
import { JobSeeker } from './entities/job-seeker.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { Employer } from '../employer/entities/employer.entity';
import { S3Service } from '../utils/s3Services/s3Services';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobSeeker, User, Employer]),
    UserModule,
    AuthModule,
  ],
  controllers: [JobSeekerController],
  providers: [JobSeekerService, S3Service],
})
export class JobSeekerModule {}
