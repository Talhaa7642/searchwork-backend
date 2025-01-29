import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerService } from './employer.service';
import { EmployerController } from './employer.controller';
import { Employer } from './entities/employer.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { JobSeeker } from '../job-seeker/entities/job-seeker.entity';
import { Preferences } from '../user/entities/preferences.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employer, User, JobSeeker, Preferences]),
    UserModule,
    AuthModule,
  ],
  controllers: [EmployerController],
  providers: [EmployerService],
})
export class EmployerModule {}
