import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserJob } from '../../user-jobs/entities/user-job.entity';
import { Employer } from '../../employer/entities/employer.entity';
import {
  JobType,
  JobAvailability,
  Status,
} from '../../utils/constants/constants';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base/base.entity';
import { SavedJob } from '../../user-jobs/entities/saved-job.entity';
import { Notification } from '../../notifications/entities/notification.entity';

@Entity()
export class JobPost extends BaseEntity {
  @ApiProperty({
    example: 'Software Engineer',
    description: 'Job title',
  })
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false })
  title: string;

  @ApiProperty({ example: 'full_time', description: 'Job type' })
  @IsString()
  @Column({ type: 'enum', enum: JobType, default: JobType.FullTime })
  type: JobType;

  @ApiProperty({
    example: 'We are looking for a software engineer',
    description: 'Job description',
  })
  @IsString()
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    example: 'USA',
    description: 'Location of the job post',
  })
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: true })
  location: string;

  @ApiProperty({
    example: '10$ per hour',
    description: 'Salary for the job',
  })
  @IsNotEmpty()
  @IsNumber()
  @Column({ nullable: false })
  salary: number;

  @ApiProperty({ example: 'On-site', description: 'Job availability type' })
  @Column({
    type: 'enum',
    enum: JobAvailability,
    default: JobAvailability.OnSite,
  })
  availability: JobAvailability;

  @IsNotEmpty()
  @Column({ nullable: false })
  employerId: number;

  @ApiProperty({
    example: 'Hiring',
    description: 'Job status',
  })
  @Column({ type: 'enum', enum: Status, default: Status.Hiring })
  status: Status;

  @ManyToOne(() => Employer, (employer) => employer.jobPosts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employer_id' })
  employer: Employer;

  @OneToMany(() => UserJob, (userJob) => userJob.jobPost, {
    onDelete: 'CASCADE',
  })
  userJobs: UserJob[];

  @OneToMany(() => SavedJob, (savedJob) => savedJob.jobPost)
  savedBy: SavedJob[];
  
  @OneToMany(() => Notification, (notification) => notification.jobPost)
  notifications: Notification[];

  @ApiProperty({ example: 0 })
  @Column({ default: 0 })
  applicationCount: number;
}
