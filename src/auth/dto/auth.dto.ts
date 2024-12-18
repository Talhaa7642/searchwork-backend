import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  MinLength,
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

export class ResetPasswordDto {
  @ApiProperty({
    example: 'talhashabir0@gmail.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'OTP sent to the user for verification',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;

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
    example: '123456',
    description: 'OTP sent to the user for verification',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
