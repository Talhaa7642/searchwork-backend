import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { Employer } from '../employer/entities/employer.entity';
import { JobSeeker } from '../job-seeker/entities/job-seeker.entity';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { Feedback } from './entities/feedback.entity';
import { SupportTicketController } from './support-ticket.controller';
import { SupportTicketService } from './support-ticket.service';
import { SupportTicket } from './entities/supportTicket.entity';
import { PreferencesController } from './preferences.controller';
import { Preferences } from './entities/preferences.entity';
import { PreferencesService } from './preferences.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Employer, JobSeeker, Feedback, SupportTicket, Preferences]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController, FeedbackController, SupportTicketController, PreferencesController],
  providers: [UserService, FeedbackService, SupportTicketService, PreferencesService],
  exports: [UserService],
})
export class UserModule {}
