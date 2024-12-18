import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerService } from './employer.service';
import { EmployerController } from './employer.controller';
import { Employer } from './entities/employer.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { JobSeeker } from '../job-seeker/entities/job-seeker.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employer, User, JobSeeker]),
    UserModule,
    AuthModule,
  ],
  controllers: [EmployerController],
  providers: [EmployerService],
})
export class EmployerModule {}
