import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { Employer } from '../employer/entities/employer.entity';
import { JobSeeker } from '../job-seeker/entities/job-seeker.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Employer, JobSeeker]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
