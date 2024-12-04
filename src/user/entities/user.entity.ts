import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNotEmpty, IsPhoneNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '+971123456789', description: 'User phone number in international format' })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber(null)
  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @ApiProperty({ example: 'Talha Shabbir', description: 'Full name of the user' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  fullName: string;

  @ApiProperty({ example: 'Gulberg Lahore', description: 'User address' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  address: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsOptional()
  @IsString()
  @Column({ unique: true, nullable: true })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: true })
  password: string;

  @ApiProperty({ example: 'Employee', description: 'Role of the user, either Employee or Employer' })
  @IsEnum(['Employee', 'Employer'])
  @Column({ type: 'enum', enum: ['Employee', 'Employer'], nullable: true })
  role: 'Employee' | 'Employer';

  @ApiProperty({ example: 'someDeviceToken123', description: 'Device token for push notifications' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  deviceToken: string;

  @ApiProperty({ example: 'Male', description: 'Gender of the user' })
  @IsEnum(['Male', 'Female', 'Other'])
  @Column({ type: 'enum', enum: ['Male', 'Female', 'Other'], nullable: true })
  gender: 'Male' | 'Female' | 'Other' |null;

  @ApiProperty({ example: '123456', description: 'OTP for email verification or password reset' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  otp: string;

  @ApiProperty({ example: false, description: 'Email verification status' })
  @Column({ default: false })
  isEmailVerified: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
