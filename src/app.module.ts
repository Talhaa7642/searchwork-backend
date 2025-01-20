import { Logger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-source';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JobPostModule } from './job-post/job-post.module';
import { JobSeekerModule } from './job-seeker/job-seeker.module';
import { EmployerModule } from './employer/employer.module';
import { UserJobsModule } from './user-jobs/user-jobs.module';
import { LocationModule } from './location/location.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3Service } from './utils/s3Services/s3Services';
import { NotificationsModule } from './notifications/notifications.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UserModule,
    JobPostModule,
    JobSeekerModule,
    EmployerModule,
    UserJobsModule,
    LocationModule,
    NotificationsModule,
  ],
  controllers: [AppController],

  providers: [
    AppService,
    S3Service,
    { provide: APP_INTERCEPTOR, useClass: Logger },
  ],
})
export class AppModule {}
