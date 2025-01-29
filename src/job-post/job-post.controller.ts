import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  ValidationPipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../utils/constants/constants';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { JobPostResponseDto } from './dto/job-post-response.dto';
import { JobPostFilterDto } from './dto/job-post-filter.dto';
import { DuplicateJobPostException } from '../utils/exceptions/jobPostException';

@ApiTags('job-posts')
@ApiBearerAuth('JWT-auth')
@Controller('job-posts')
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer)
  @ApiOperation({
    summary: 'Create a new job post',
    description:
      'Access levels:\n' +
      '- Employers: Can create job posts\n' +
      '- Others: No access',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Job post created successfully',
    type: JobPostResponseDto,
  })
  async create(
    @Body(ValidationPipe) createJobPostDto: CreateJobPostDto,
    @GetUser() user: User,
  ) {
    try {
      return await this.jobPostService.create(createJobPostDto, user);
    } catch (error) {
      if (error instanceof DuplicateJobPostException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Employee)
  @ApiOperation({
    summary: 'Get all job posts with pagination and filters',
    description: 'Public endpoint - Anyone can view job posts',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated job posts',
    type: JobPostResponseDto,
  })
  findAll(@Query(ValidationPipe) filterDto: JobPostFilterDto, @GetUser() user: User,) {
    return this.jobPostService.findAll(filterDto, user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get job post by ID',
    description: 'Public endpoint - Anyone can view a job post',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the job post',
    type: JobPostResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobPostService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer, Role.Admin)
  @ApiOperation({
    summary: 'Update a job post',
    description:
      'Access levels:\n' +
      '- Employers: Can update their own job posts\n' +
      '- Admin: Can update any job post\n' +
      '- Others: No access',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Job post updated successfully',
    type: JobPostResponseDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateJobPostDto: UpdateJobPostDto,
    @GetUser() user: User,
  ) {
    return this.jobPostService.update(id, updateJobPostDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer, Role.Admin)
  @ApiOperation({
    summary: 'Delete a job post',
    description:
      'Access levels:\n' +
      '- Employers: Can delete their own job posts\n' +
      '- Admin: Can delete any job post\n' +
      '- Others: No access',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Job post deleted successfully',
  })
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.jobPostService.remove(id, user);
  }
}
