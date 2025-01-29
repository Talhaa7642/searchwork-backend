import { Entity, Column, OneToOne, OneToMany, Index } from 'typeorm';
import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role } from '../../utils/constants/constants';
import { JobSeeker } from '../../job-seeker/entities/job-seeker.entity';
import { Employer } from '../../employer/entities/employer.entity';
import { UserJob } from '../../user-jobs/entities/user-job.entity';
// import { Location } from '../../location/entities/location.entity';
import { BaseEntity } from '../../common/base/base.entity';
import { Feedback } from './feedback.entity';
import { SupportTicket } from './supportTicket.entity';
import { SavedJob } from '../../user-jobs/entities/saved-job.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { Preferences } from './preferences.entity';

@Entity()
@Index(['email', 'phoneNumber'], { unique: true })
export class User extends BaseEntity {
  @ApiProperty({ example: '+971123456789' })
  @IsOptional()
  @IsString()
  @IsPhoneNumber(null)
  @Column({ nullable: true })
  phoneNumber: string;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsString()
  @Column({ default: false })
  isPhoneNumberVerified: boolean;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false })
  fullName: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  @Column({ nullable: false, unique: true })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true, select: false })
  password: string;

  @ApiProperty({ example: 'Employee' })
  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.Employee })
  role: Role;

  @ApiProperty({ example: 'Male' })
  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender | null;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isEmailVerified: boolean;

  @ApiProperty({ example: '123456' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  otp: string;

  @ApiProperty({
    example: '2025-01-01T00:00:00Z',
    description: 'Expiration date of the OTP',
  })
  @IsOptional()
  @IsString()
  @Column({ nullable: true, type: 'timestamp', default: null })
  otpExpiresAt: string | null;

  @ApiProperty({ example: 'apple' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  platform: string;

  @ApiProperty({ example: 'apple-token' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  platform_token: string;

  @ApiProperty({
    example:
      'https://img.freepik.com/premium-photo/trees-growing-forest_1048944-30368869.jpg?w=2000',
  })
  @IsOptional()
  @IsString()
  @Column({ default: null })
  profileImageUrl: string;

  @OneToOne(() => JobSeeker, (jobSeeker) => jobSeeker.user, {
    onDelete: 'CASCADE',
    eager: true,
  })
  jobSeekerProfile: JobSeeker;

  @OneToOne(() => Employer, (employer) => employer.user, {
    onDelete: 'CASCADE',
  })
  employerProfile: Employer;

  @OneToOne(() => Preferences, (userPreferences) => userPreferences.user, {
    onDelete: 'CASCADE',
  })
  userPreferences: Preferences;

  //  @ManyToOne(() => Location, {
  //   onDelete: 'SET NULL',
  // })
  // @JoinColumn()
  // location: Location;

  @OneToMany(() => UserJob, (userJob) => userJob.user)
  userJobs: UserJob[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedback: Feedback[];

  @OneToMany(() => SupportTicket, (supportTicket) => supportTicket.user)
  supportTickets: SupportTicket[];

  @OneToMany(() => SavedJob, (savedJob) => savedJob.user)
  savedJobs: SavedJob[];
 
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
