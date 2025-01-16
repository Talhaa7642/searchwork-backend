import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from 'src/user/entities/user.entity';
import { JobPost } from 'src/job-post/entities/job-post.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const jobPost = await this.jobPostRepository.findOne({
      where: { id: createNotificationDto.jobPostId },
    });

    const user = await this.userRepository.findOne({
      where: { id: createNotificationDto.userId },
    });

    if (!jobPost) {
      throw new Error('Job post not found');
    }

    if (!user) {
      throw new Error('User not found');
    }

    const notification = this.notificationRepository.create({
      jobPost,
      user,
      message: createNotificationDto.message,
      isRead: createNotificationDto.isRead,
    });

    return this.notificationRepository.save(notification);
  }

  async getNotificationsForEmployer(
    employerId: number,
  ): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: {
        jobPost: {
          employer: {
            id: employerId,
          },
        },
      },
      relations: ['jobPost', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number): Promise<Notification> {
    return this.notificationRepository.findOne({
      where: { id },
      relations: ['jobPost', 'user'],
    });
  }

  async update(
    id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    await this.notificationRepository.update(id, updateNotificationDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.notificationRepository.delete(id);
  }
}
