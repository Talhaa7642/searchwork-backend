import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Feedback } from "./entities/feedback.entity";
import { Repository } from "typeorm";
import { CreateFeedbackDto } from "./dto/feedback.dto";

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  async createFeedback(createFeedbackDto: CreateFeedbackDto, userId?: number) {
    const feedback = this.feedbackRepository.create({
      ...createFeedbackDto,
      user: userId ? { id: userId } : null,
    });
    return await this.feedbackRepository.save(feedback);
  }

  async getAllFeedback(page: number, limit: number) {
    return await this.feedbackRepository.find({
      take: limit,
      skip: (page - 1) * limit,
      relations: ['user'],
    });
  }
}
