import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { MailService } from '../services/mailService';
import { Employer } from '../employer/entities/employer.entity';
import { JobSeeker } from '../job-seeker/entities/job-seeker.entity';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Employer, JobSeeker]),
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, MailService, RolesGuard],
  controllers: [AuthController],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}
