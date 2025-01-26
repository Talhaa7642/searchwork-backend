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
import { UserService } from 'src/user/user.service';
import { D7NetworksService } from 'src/utils/d7-networks/d7.service';
import { S3Service } from 'src/utils/s3Services/s3Services';
import { Preferences } from 'src/user/entities/preferences.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Employer, JobSeeker, Preferences]),
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
  providers: [AuthService, JwtStrategy, MailService, RolesGuard, UserService, D7NetworksService, S3Service],
  controllers: [AuthController],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}
