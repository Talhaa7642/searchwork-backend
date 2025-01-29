import { Body, Controller, Get, HttpStatus, Post, Query, UseGuards } from "@nestjs/common";
import { FeedbackService } from "./feedback.service";
import { CreateFeedbackDto } from "./dto/feedback.dto";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { User } from "./entities/user.entity";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../utils/constants/constants";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

@ApiTags('feedback')
@ApiBearerAuth('JWT-auth')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee, Role.Employer)
  @ApiOperation({ summary: 'Create feedback for this app' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated users',
  })
  async createFeedback(@Body() createFeedbackDto: CreateFeedbackDto, @GetUser() user: User) {
    return await this.feedbackService.createFeedback(createFeedbackDto, user?.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all ufeedbacks of the users (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated users',
  })
  @Roles(Role.Admin)
  async getAllFeedback(@Query('page') page = 1, @Query('limit') limit = 10) {
    return await this.feedbackService.getAllFeedback(page, limit);
  }
}
