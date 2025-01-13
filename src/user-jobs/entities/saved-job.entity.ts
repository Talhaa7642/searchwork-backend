import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { JobPost } from '../../job-post/entities/job-post.entity';
import { BaseEntity } from '../../common/base/base.entity';

@Entity()
export class SavedJob extends BaseEntity {
  @ManyToOne(() => User, (user) => user.savedJobs, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => JobPost, (jobPost) => jobPost.savedBy, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'job_post_id' })
  jobPost: JobPost;
}
