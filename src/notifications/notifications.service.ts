import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../user/entities/user.entity';
import { JobPost } from '../job-post/entities/job-post.entity';

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

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {

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
  

  async getNotificationsForEmployer(employerId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user: { id: employerId } },
      relations: ['jobPost', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async markAllNotificationsAsRead(employerId: number): Promise<void> {
    await this.notificationRepository.update(
      { user: { id: employerId }, isRead: false }, // Update only unread notifications
      { isRead: true },
    );
  }

  async markNotificationAsRead(notificationId: number): Promise<Notification> {
    await this.notificationRepository.update(
      { id: notificationId, isRead: false },
      { isRead: true },
    );
    return this.findOne(notificationId);
  }

  findOne(id: number): Promise<Notification> {
    return this.notificationRepository.findOne({
      where: { id },
      relations: ['jobPost', 'user'],
    });
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const { jobPostId, userId, ...otherUpdates } = updateNotificationDto;
  
    // Find the existing notification
    const notification = await this.findOne(id);
    if (!notification) {
      throw new Error('Notification not found');
    }
  
    // Update related entities if provided
    if (jobPostId) {
      const jobPost = await this.jobPostRepository.findOne({ where: { id: jobPostId } });
      if (!jobPost) {
        throw new Error('Job post not found');
      }
      notification.jobPost = jobPost;
    }
  
    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }
      notification.user = user;
    }
  
    // Update other fields
    Object.assign(notification, otherUpdates);
  
    // Save updated notification
    return this.notificationRepository.save(notification);
  }
  

  async remove(id: number): Promise<void> {
    await this.notificationRepository.delete(id);
  }
}
