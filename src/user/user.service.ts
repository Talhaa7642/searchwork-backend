import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  @InjectRepository(User) private userRepository: Repository<User>

  async create(body: CreateUserDto): Promise<User> {
    const consumer= await this.userRepository.save(this.userRepository.create(body)).catch((err: any) => {
      throw new HttpException(
        {
          message: `${err}`,
        },
        HttpStatus.CONFLICT,
      );
    });
    return consumer;
  }

  findAll(): Promise<User[]> {
    try {
      return this.userRepository.find();
    } catch (e) {
      throw new HttpException(e.message, e.statusCode);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} consumer`;
  }

  update(id: number, updateConsumerDto: UpdateUserDto) {
    return `This action updates a #${id} consumer`;
  }

  remove(id: number) {
    return `This action removes a #${id} consumer`;
  }

  async findOneByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const consumer = await this.userRepository.findOne({
      where: {
        phoneNumber,
      },
    })

    if (consumer) {
      return consumer;
    }

    return null;
  }
}
