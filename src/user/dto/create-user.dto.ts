import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Role, Gender } from '../../utils/constants/constants';

export class CreateUserDto {
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
    example: '+1234567890',
    description: 'Phone number of the user',
  })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;

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
