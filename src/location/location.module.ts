import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { Location } from './entities/location.entity';
import { AuthModule } from '../auth/auth.module';
import { Employer } from '../employer/entities/employer.entity';
import { JobSeeker } from '../job-seeker/entities/job-seeker.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Employer, JobSeeker]),
    AuthModule,
  ],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
