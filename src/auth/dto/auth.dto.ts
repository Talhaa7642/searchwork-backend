import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  MinLength,
  IsPhoneNumber,
  IsNumber,
} from 'class-validator';
import { Role, Gender } from '../../utils/constants/constants';

export class RegisterDto {
  @ApiProperty({
    example: 'talhashabir0@gmail.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password for the user account',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    enum: Role,
    example: Role.Employee,
    description: 'Role of the user',
  })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @ApiProperty({
    enum: Gender,
    example: Gender.Male,
    description: 'Gender of the user',
    required: false,
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;
}

export class LoginDto {
  @ApiProperty({
    example: 'talhashabir0@gmail.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password for the user account',
  })
  @IsString()
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'talhashabir0@gmail.com',
    description: 'Email address of the user requesting password reset',
  })
  @IsEmail()
  email: string;
}
export class ResendOtpDto {
  @ApiProperty({
    example: 'talhashabir0@gmail.com',
    description: 'Email address of the user requesting password reset',
  })
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: '+923202919700',
    description: 'Phone number of the user requesting password reset',
  })
  @IsPhoneNumber()
  phoneNumber?: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    example: 'talhashabir0@gmail.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'New password for the user account',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    example: 'talhashabir0@gmail.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '1234',
    description: 'OTP sent to the user for verification',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
export class VerifyPhoneNumberDto {
  @ApiProperty({
    example: '1',
    description: 'User ID of the user to verify',
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: '+923202919700',
    description: 'Phone number of the user to verify',
  })
  @IsPhoneNumber()
  phoneNumber: string;
}
export class VerifyPhoneNumberOtpDto {
  @ApiProperty({
    example: '+923202919700',
    description: 'Phone number to verify.',
  })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    example: '1',
    description: 'User ID of the user.',
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: '1234',
    description: 'OTP sent to the user.',
  })
  @IsString()
  otp: string;
}



export class SocialLoginDto {
  @ApiProperty({
    enum: Role,
    example: Role.Employee,
    description: 'Role of the user',
  })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @ApiProperty({
    example: 'talhashabir0@gmail.com',
    description: 'Email address of the user',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'google',
    description: 'Email address of the user',
  })
  @IsString({ message: 'Platform must be a string' })
  @IsNotEmpty({ message: 'Platform is required' })
  platform: string;

  @ApiProperty({
    example: 'gytg627f67f276',
    description: 'Email address of the user',
  })
  @IsString({ message: 'Platform token must be a string' })
  @IsNotEmpty({ message: 'Platform token is required' })
  platform_token: string;
  
  @ApiProperty({
    example: 'talha',
    description: 'Name of the user',
  })
  @IsString({ message: 'Full name must be a string' })
  @IsOptional()
  fullName?: string;
  
  @ApiProperty({
    example:  'https://img.freepik.com/premium-photo/trees-growing-forest_1048944-30368869.jpg?w=2000',
    description: 'Profile image of the user',
  })
  @IsString({ message: 'Image must' })
  @IsOptional()
  image?: string;
}