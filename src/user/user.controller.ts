import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    description: 'A successful hit can return user object',
    summary: 'Register User',
  })
  @ApiResponse({ status: 201, description: ' Successfully created user.', type: User })
  @Post('/register')
  async create(@Body() body: CreateUserDto): Promise<User> {
    try {
      const consumer = await this.userService.findOneByPhoneNumber(body.phoneNumber);
      if (!consumer) {
        return this.userService.create(body);
      }
      return consumer;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @ApiOperation({
    description: 'A successful hit can return All users',
    summary: 'Get All Users',
  })
  @ApiResponse({ status: 201, description: ' Users data successfully fetched.', type: User })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsumerDto: UpdateUserDto) {
    return this.userService.update(+id, updateConsumerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
