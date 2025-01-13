import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('support_ticket')
export class SupportTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  issueTitle: string;

  @Column()
  issueDescription: string;

  @Column({ default: 'open' }) // Default status
  status: string;

  @Column({ nullable: true })
  priority: string;

  @ManyToOne(() => User, (user) => user.supportTickets, { nullable: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
