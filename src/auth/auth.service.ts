import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { MailService } from '../services/mailService';
import { RegisterDto, LoginDto, ResetPasswordDto, SocialLoginDto, VerifyPhoneNumberDto } from './dto/auth.dto';
import { generateRandomEmail } from '../services/generateRandomEmail';
import { Role } from '../utils/constants/constants';
import { Employer } from '../employer/entities/employer.entity';
import { JobSeeker } from '../job-seeker/entities/job-seeker.entity';
import { UserService } from '../user/user.service';
import { D7NetworksService } from '../utils/d7-networks/d7.service';
import { S3Service } from '../utils/s3Services/s3Services';
import { Preferences } from '../user/entities/preferences.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Employer) private readonly employerRepository: Repository<Employer>,
    @InjectRepository(JobSeeker) private readonly jobSeekerRepository: Repository<JobSeeker>,
    @InjectRepository(Preferences) private readonly preferencesRepository: Repository<Preferences>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly d7NetworksService: D7NetworksService,
    private readonly s3Service: S3Service,

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
    const preferences = this.preferencesRepository.create({
      user, // Associate preferences with the user
      hideProfileData: false,
      notificationsEnabled: true,
      theme: 'light', // Default theme can be 'light' or any other value
      showEmail: true,
      showPhoneNumber: true,
      showLocation: true,
      contactViaEmail: true,
      contactViaPhoneNumber: true,
      contactViaMessage: true,
    });
    await this.preferencesRepository.save(preferences);
  

    await this.generateAndSendOtp(user.email);

    return user;
  }

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'password', 'isEmailVerified', 'role'],
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
  
    await this.generateAndSendOtp(email);
    return { success: true, message: 'OTP sent to email' };
  }

  async resendOtpToPhoneNumber(phoneNumber: string) {
    const user = await this.userRepository.findOneBy({ phoneNumber });
    if (!user) {
      throw new BadRequestException('Phone number not found');
    }

    await this.generateAndSendOtp(undefined, phoneNumber);
    return { success: true, message: 'OTP sent to phone number' };
  }
  async forgotPassword(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('Email not found');
    }
    const otp = await this.generateAndSendOtp(email);
    await this.userRepository.update({ email }, { otp });

    await this.mailService.sendPasswordResetEmail(email, otp);
  }

  async resetPassword(resetDto: ResetPasswordDto) {
    const { email, newPassword } = resetDto;
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      user.password = await bcrypt.hash(newPassword, 10);
      await this.userRepository.save(user);
      return true;
    }
    throw new BadRequestException('Invalid OTP');
  }

  async socialLogin(userData: SocialLoginDto) {
    const { email, platform, platform_token, fullName, image } = userData;
    console.log("userData", userData);
    if (!platform || !platform_token) {
      throw new BadRequestException('Platform and platform_token are required');
    }

    const generatedEmail = email || generateRandomEmail(userData);
    const generatedFullName = fullName || 'Anonymous User';

    let user = await this.userRepository.findOne({
      where: { platform, platform_token },
    });

    let imageUrl: string | null = null;

    if (image) {

      const file = {
        path: `social-login-images/${Date.now()}.jpg`,
        data: image,
        mime: 'image/jpeg',
      };
      const uploadResult = await this.s3Service.uploadFile(file);
      imageUrl = uploadResult?.Location;
    }
    console.log("imageUrl", imageUrl);
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
        profileImageUrl: imageUrl,
      });

      await this.userRepository.save(newUser);
      const token = this.jwtService.sign({ userId: newUser.id, platform: newUser.platform });
      return { user: newUser, token };
    }
  }
  
  async sendOtpToPhoneNumber(verifyPhoneNumberDto : VerifyPhoneNumberDto) {
    const { phoneNumber, userId } = verifyPhoneNumberDto;
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const existingUser = await this.userRepository.findOneBy({ phoneNumber });
    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException('Phone number is already associated with another user');
    }

    await this.generateAndSendOtp(undefined, phoneNumber);
    return { success: true, message: 'OTP sent to phone number' };
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
  
  private async generateAndSendOtp(email?: string, phoneNumber?: string) {
    console.log("email", email, "phoneNumber", phoneNumber);
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    if (phoneNumber) {
      console.log("phoneNumber", phoneNumber);
      await this.userRepository.update({ phoneNumber }, { otp });
      await this.d7NetworksService.sendOTP(phoneNumber, otp);
    } else {
      console.log("email", email);
      await this.userRepository.update({ email }, { otp });
      await this.mailService.sendVerificationEmail(email, otp);
    }
    return otp;
  }}
