import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../utils/constants/constants';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@ApiTags('notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer)
  @ApiOperation({ summary: 'Create a new notification for employer' })
  create(
    @GetUser() user: User,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer)
  @ApiOperation({ summary: 'Get notifications for employer' })
  async getNotifications(@GetUser() user: User) {
    return this.notificationsService.getNotificationsForEmployer(user.id);
  }

  @Patch('read-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@GetUser() user: User) {
    return this.notificationsService.markAllNotificationsAsRead(user.id);
  }

  @Patch('read/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer)
  @ApiOperation({ summary: 'Mark a single notification as read by ID' })
  async markAsRead(@Param('id') id: number) {
    return this.notificationsService.markNotificationAsRead(+id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single notification by ID' })
  findOne(@Param('id') id: number) {
    return this.notificationsService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: number,
  //   @Body() updateNotificationDto: UpdateNotificationDto,
  // ) {
  //   return this.notificationsService.update(id, updateNotificationDto);
  // }
  

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.notificationsService.remove(+id);
  }
}
