import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { JobPost } from '../../job-post/entities/job-post.entity';
import { BaseEntity } from '../../common/base/base.entity';

@Entity()
export class Employer extends BaseEntity {
  @ApiProperty({
    example: 'Hegemonic Inc.',
    description: 'Company Name of the employer',
  })
  @Column({ nullable: false, unique: true })
  companyName: string;

  @ApiProperty({ example: 'IT', description: 'Industry sector of the company' })
  @Column({ nullable: false })
  industry: string;

  @ApiProperty({
    example: '50-100',
    description: 'Number of employees in the company',
  })
  @Column({ nullable: true })
  companySize: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Company registration number',
  })
  @Column({ nullable: true, unique: true })
  registrationNumber: string;

  @ApiProperty({
    example: "Write something about your company",
    description: 'Indicates whether the employer wants to hide their profile data in job posts',
  })
  @Column({ nullable: true })
  bio: string;

  // Table relations
  // One-to-Many relationship with JobPost, allows an employer to have multiple job postings
  // If the employer is deleted, all associated job posts will also be deleted
  @OneToMany(() => JobPost, (jobPost) => jobPost.employer, {
    onDelete: 'CASCADE',
  })
  jobPosts: JobPost[];

  // One-to-One relationship with User, allows an employer to be associated with a user
  // If the user is deleted, the associated employer profile will also be deleted
  @OneToOne(() => User, (user) => user.employerProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
