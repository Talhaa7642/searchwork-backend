import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Feedback } from "./entities/feedback.entity";
import { Repository } from "typeorm";
import { CreateFeedbackDto } from "./dto/feedback.dto";
import { SupportTicket } from "./entities/supportTicket.entity";
import { CreateSupportTicketDto, UpdateSupportTicketDto } from "./dto/support-ticket.dto";



@Injectable()
export class SupportTicketService {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly supportTicketRepository: Repository<SupportTicket>,
  ) {}

  async createSupportTicket(createSupportTicketDto: CreateSupportTicketDto, userId?: number) {
    const ticket = this.supportTicketRepository.create({
      ...createSupportTicketDto,
      user: userId ? { id: userId } : null,
    });
    return await this.supportTicketRepository.save(ticket);
  }

  async getAllSupportTickets(page: number, limit: number, filters?: any) {
    const query = this.supportTicketRepository.createQueryBuilder('ticket');

    if (filters.status) query.andWhere('ticket.status = :status', { status: filters.status });
    if (filters.userId) query.andWhere('ticket.userId = :userId', { userId: filters.userId });

    query.take(limit).skip((page - 1) * limit);
    return await query.getMany();
  }

  async updateSupportTicket(id: string, updateDto: UpdateSupportTicketDto) {
    const ticket = await this.supportTicketRepository.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Support ticket not found');

    Object.assign(ticket, updateDto);
    return await this.supportTicketRepository.save(ticket);
  }
}
