import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateUserDto {
  @ApiProperty({
    example: '+971123456789',
    description: 'The phone number of the account',
    format: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    example: 'Talha Shabbir',
    description: 'Name of consumer',
    format: 'string',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'Paragon City, Lahore',
    description: 'Address of consumer',
    format: 'string',
  })
  @IsString()
  address: string;
}



// dto/auth.dto.ts
export class RegisterDto {
  email: string;
  password: string;
  name: string;
  role: 'Employee' | 'Employer';
}

export class LoginDto {
  email: string;
  password: string;
}

export class ForgotPasswordDto {
  email: string;
}

export class ResetPasswordDto {
  email: string;
  otp: string;
  newPassword: string;
}
