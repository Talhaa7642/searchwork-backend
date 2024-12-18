import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  Index,
  ManyToOne,
} from 'typeorm';
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
import { Location } from '../../location/entities/location.entity';
import { BaseEntity } from '../../common/base/base.entity';

@Entity()
@Index(['email', 'phoneNumber'], { unique: true })
export class User extends BaseEntity {
  // User's phone number, optional for contact purposes
  @ApiProperty({ example: '+971123456789' })
  @IsOptional()
  @IsString()
  @IsPhoneNumber(null)
  @Column({ nullable: true })
  phoneNumber: string;

  // User's full name, required for identification
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false })
  fullName: string;

  // User's email, must be unique for authentication
  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  @Column({ nullable: false, unique: true })
  email: string;

  // User's password, stored securely and not selectable in queries
  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, select: false })
  password: string;

  // User's role, determines access level in the application
  @ApiProperty({ example: 'Employee' })
  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.Employee })
  role: Role;

  // User's gender, optional for demographic purposes
  @ApiProperty({ example: 'Male' })
  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender | null;

  // Indicates if the user's email has been verified
  @ApiProperty({ example: false })
  @Column({ default: false })
  isEmailVerified: boolean;

  // One-time password for additional security, optional
  @ApiProperty({ example: '123456' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  otp: string;

  // Table relations
  // One-to-One relationship with JobSeeker, allows a user to have a job seeker profile
  // If the user is deleted, the associated job seeker profile will also be deleted
  @OneToOne(() => JobSeeker, (jobSeeker) => jobSeeker.user, {
    onDelete: 'CASCADE',
    eager: true, // Automatically load the job seeker profile when the user is loaded
  })
  @JoinColumn()
  jobSeekerProfile: JobSeeker;

  // One-to-One relationship with Employer, allows a user to have an employer profile
  // If the user is deleted, the associated employer profile will also be deleted
  @OneToOne(() => Employer, (employer) => employer.user, {
    onDelete: 'CASCADE',
  })
  employerProfile: Employer;

  // Many-to-One relationship with Location, allows a user to be associated with a location
  // If the location is deleted, the user's location will be set to null
  @ManyToOne(() => Location, {
    onDelete: 'SET NULL', // Prevents deletion of user if location is deleted
  })
  @JoinColumn()
  location: Location;

  // One-to-Many relationship with UserJob, allows a user to have multiple job applications
  @OneToMany(() => UserJob, (userJob) => userJob.user)
  userJobs: UserJob[];
}
