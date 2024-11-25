// auth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { MailService } from 'src/services/mailService';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/create-user.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, name, role } = registerDto;

    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // const user = this.userRepository.create({
    //   email,
    //   name,
    //   password: hashedPassword,
    //   role,
    // });

    const user = this.userRepository.create({
      email: 'user@example.com',
      fullName: 'John Doe',
      password: 'hashedPassword',
      phoneNumber: '+1234567890',
      role: 'Employee', // or 'Employer'
      gender: 'Male',
    });    

    await this.userRepository.save(user);
    await this.sendVerificationOtp(user.email);

    return user;
  }

  async sendVerificationOtp(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.userRepository.update({ email }, { otp });
    await this.mailService.sendVerificationEmail(email, otp);
  }

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });
    if (user && await bcrypt.compare(loginDto.password, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { userId: user.id, role: user.role };
    return { accessToken: this.jwtService.sign(payload) };
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

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      await this.mailService.sendPasswordResetEmail(email);
    }
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
}
