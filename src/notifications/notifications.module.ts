import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobSeeker } from 'src/job-seeker/entities/job-seeker.entity';
import { User } from 'src/user/entities/user.entity';
import { JobPost } from 'src/job-post/entities/job-post.entity';
import { Notification } from './entities/notification.entity';
import { Employer } from 'src/employer/entities/employer.entity';

@Module({
})

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, Employer, JobSeeker, User, JobPost]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})


export class NotificationsModule {}
