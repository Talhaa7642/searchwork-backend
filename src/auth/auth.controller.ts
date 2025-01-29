import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyOtpDto,
  SocialLoginDto,
  VerifyPhoneNumberDto,
  VerifyPhoneNumberOtpDto,
  ResendOtpDto,
} from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { D7NetworksService } from '../utils/d7-networks/d7.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly d7NetworksService: D7NetworksService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      throw new BadRequestException(error.message || 'Registration failed');
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login an existing user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 400, description: 'Invalid credentials.' })
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.authService.validateUser(loginDto);
      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }
      return this.authService.login(user);
    } catch (error) {
      console.error('Login error:', error.message);
      throw new BadRequestException(error.message || 'Login failed');
    }
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP for email' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ status: 200, description: 'OTP verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid OTP or email.' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    try {
      return await this.authService.verifyOtp(
        verifyOtpDto.email,
        verifyOtpDto.otp,
      );
    } catch (error) {
      throw new BadRequestException(error.message || 'OTP verification failed');
    }
  }

  @Post('register-phone-number')
  @ApiOperation({ summary: 'Register user phone number' })
  @ApiBody({ type: VerifyPhoneNumberDto })
  @ApiResponse({ status: 200, description: 'Otp successfully send to Phone Number.' })
  @ApiResponse({ status: 400, description: 'Invalid phone number.' })
  async verifyPhoneNumber(@Body() verifyPhoneNumberDto: VerifyPhoneNumberDto) {
    try {
      return await this.authService.sendOtpToPhoneNumber(
        verifyPhoneNumberDto
      );
    } catch (error) {
      throw new BadRequestException(error.message || 'Phone verification failed');
    }
  }

  @Post('verify-phone-number-otp')
  @ApiOperation({ summary: 'Verify phone number using OTP' })
  @ApiBody({ type: VerifyPhoneNumberOtpDto })
  @ApiResponse({ status: 200, description: 'Phone verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid OTP or phone number.' })
  async verifyPhoneNumberByOtp(@Body() verifyPhoneNumberOtpDto: VerifyPhoneNumberOtpDto) {
    return this.authService.verifyPhoneNumberByOtp(verifyPhoneNumberOtpDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request OTP for password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'OTP sent to email.' })
  @ApiResponse({ status: 400, description: 'Email not found.' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      await this.authService.forgotPassword(forgotPasswordDto.email);
      return { message: 'OTP sent to email' };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to send OTP');
    }
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset the user password using OTP' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid OTP or password.' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      return await this.authService.resetPassword(resetPasswordDto);
    } catch (error) {
      throw new BadRequestException(error.message || 'Password reset failed');
    }
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP to the user email or phone number' })
  @ApiBody({ type: ResendOtpDto })
  @ApiResponse({ status: 200, description: 'OTP resent successfully.' })
  @ApiResponse({ status: 400, description: 'Failed to resend OTP.' })
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    try {
      if (resendOtpDto.email) {
        await this.authService.resendOtpToEmail(resendOtpDto.email);
      } else if (resendOtpDto.phoneNumber) {
        await this.authService.resendOtpToPhoneNumber(resendOtpDto.phoneNumber);
      } else {
        throw new BadRequestException('Email or phone number must be provided');
      }
      return { message: 'OTP resent successfully' };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to resend OTP');
    }
  }

  @Post('social-login')
  @ApiOperation({ summary: 'Login with social media (e.g., Google, Apple)' })
  @ApiBody({ type: SocialLoginDto })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 400, description: 'Invalid social login data.' })
  async socialLogin(@Body() userData: SocialLoginDto) {
    try {
      const result = await this.authService.socialLogin(userData);
      return { data: result.user, token: result.token };
    } catch (error) {
      throw new BadRequestException(error.message || 'Social login failed');
    }
  }
}
