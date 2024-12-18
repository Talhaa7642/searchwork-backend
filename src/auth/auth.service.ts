// auth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { MailService } from '../services/mailService';
import { RegisterDto, LoginDto, ResetPasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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
}
