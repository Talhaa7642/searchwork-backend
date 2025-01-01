// auth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { MailService } from '../services/mailService';
import { RegisterDto, LoginDto, ResetPasswordDto, SocialLoginDto, VerifyPhoneNumberDto } from './dto/auth.dto';
import { generateRandomEmail } from 'src/services/generateRandonEmail';
import { Role } from 'src/utils/constants/constants';
import { Employer } from 'src/employer/entities/employer.entity';
import { JobSeeker } from 'src/job-seeker/entities/job-seeker.entity';
import { UserService } from 'src/user/user.service';
import { D7NetworksService } from 'src/utils/d7-networks/d7.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(User) private readonly employerRepository: Repository<Employer>,
    @InjectRepository(User) private readonly jobSeekerRepository: Repository<JobSeeker>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly d7NetworksService: D7NetworksService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, fullName, role, gender } = registerDto;

    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      throw new BadRequestException('Error hashing password');
    }

    const user = this.userRepository.create({
      email,
      fullName,
      password: hashedPassword,
      role,
      gender,
    });

    await this.userRepository.save(user);
    await this.sendVerificationOtp(user.email);

    return user;
  }

  async sendVerificationOtp(email: string) {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await this.userRepository.update({ email }, { otp });
    await this.mailService.sendVerificationEmail(email, otp);
  }

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'password', 'isEmailVerified', 'role'], // Explicitly include the password
    });

    if (!user || !user.password) {
      throw new BadRequestException('Invalid email or password');
    }

    if (await bcrypt.compare(loginDto.password, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      userId: user.id,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };
  
    const userData = await this.userService.findOne(user.id, user);
  
    return {
      accessToken: this.jwtService.sign(payload),
      user: userData,
    };
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user && user.otp === otp) {
      user.isEmailVerified = true;
      user.otp = null;
      await this.userRepository.save(user);
      return true;
    }
    throw new BadRequestException('Invalid OTP');
  }

  async resendOtpToEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('Email not found');
    }
  
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await this.userRepository.update({ email }, { otp });
  
    await this.mailService.sendVerificationEmail(email, otp);
  }

  async resendOtpToPhoneNumber(phoneNumber: string) {
    const user = await this.userRepository.findOneBy({ phoneNumber });
    if (!user) {
      throw new BadRequestException('Phone number not found');
    }
  
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await this.userRepository.update({ phoneNumber }, { otp });
  
    await this.d7NetworksService.sendOTP(phoneNumber, otp);
  }
  
  
  async forgotPassword(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('Email not found');
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.userRepository.update({ email }, { otp });

    await this.mailService.sendPasswordResetEmail(email, otp);
  }

  async resetPassword(resetDto: ResetPasswordDto) {
    const { email, otp, newPassword } = resetDto;
    const user = await this.userRepository.findOneBy({ email });
    if (user && user.otp === otp) {
      user.password = await bcrypt.hash(newPassword, 10);
      user.otp = null;
      await this.userRepository.save(user);
      return true;
    }
    throw new BadRequestException('Invalid OTP');
  }

  async sendOtpToPhoneNumber(verifyPhoneNumberDto : VerifyPhoneNumberDto) {
    const { phoneNumber, userId } = verifyPhoneNumberDto;
    const user = await this.userRepository.findOneBy({ id: verifyPhoneNumberDto.userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const existingUser = await this.userRepository.findOneBy({ phoneNumber });
    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException('Phone number is already associated with another user');
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.otp = otp;
    user.phoneNumber = phoneNumber;
    user.otpExpiresAt = (new Date(Date.now() + 1 * 60 * 1000)).toISOString();
    await this.userRepository.save(user);

    try {
      const response = await this.d7NetworksService.sendOTP(phoneNumber, otp);
      return { success: true, message: response.message };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to send OTP');
    }
  }

  async verifyPhoneNumberByOtp({
    phoneNumber,
    userId,
    otp,
  }: {
    phoneNumber: string;
    userId: number;
    otp: string;
  }) {
    const user = await this.userRepository.findOneBy({ id: userId, phoneNumber });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.otp !== otp || !user.otp || !user.otpExpiresAt || new Date() > new Date(user.otpExpiresAt)) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    user.isPhoneNumberVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await this.userRepository.save(user);

    return { success: true, message: 'Phone verified successfully' };
  }

  async socialLogin(userData: SocialLoginDto) {
    const { email, platform, platform_token, fullName, image } = userData;
  
    if (!platform || !platform_token) {
      throw new BadRequestException('Platform and platform_token are required');
    }
  
    const generatedEmail = email || generateRandomEmail(userData);
  
    const generatedFullName = fullName || "Anonymous User";
  
    let user = await this.userRepository.findOne({
      where: { platform, platform_token },
    });
  
    if (user) {
      const token = this.jwtService.sign({ userId: user.id, platform: user.platform });
      return { user, token };
    } else {
      const newUser = this.userRepository.create({
        email: generatedEmail,
        fullName: generatedFullName,
        platform,
        platform_token,
        isEmailVerified: true,
      });
  
      await this.userRepository.save(newUser);
      const token = this.jwtService.sign({ userId: newUser.id, platform: newUser.platform });
      return { user: newUser, token };
    }
  }
  
  
}