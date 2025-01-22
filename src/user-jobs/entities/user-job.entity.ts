import { Column, Entity, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { JobPost } from '../../job-post/entities/job-post.entity';
import { Status } from '../../utils/constants/constants';
import { BaseEntity } from '../../common/base/base.entity';

@Entity()
@Unique(['user', 'jobPost'])
export class UserJob extends BaseEntity {
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Applied,
  })
  status: Status;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  appliedAt: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  isViewed: boolean;
  

  // Table relations
  // Many-to-One relationship with JobPost, allows a user job to be associated with a job post
  // If the job post is deleted, the user job will also be deleted
  @ManyToOne(() => JobPost, (jobPost) => jobPost.userJobs, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'job_post_id' })
  jobPost: JobPost;

  // Many-to-One relationship with User, allows a user job to be associated with a user
  // If the user is deleted, the user job will also be deleted
  @ManyToOne(() => User, (user) => user.userJobs, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
