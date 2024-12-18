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
  ValidationPipe,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JobSeekerService } from './job-seeker.service';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';
import { JobSeekerFilterDto } from './dto/job-seeker-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../utils/constants/constants';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { JobSeekerResponseDto } from './dto/job-seeker-response.dto';

@ApiTags('job-seekers')
@ApiBearerAuth('JWT-auth')
@Controller('job-seekers')
export class JobSeekerController {
  constructor(private readonly jobSeekerService: JobSeekerService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee)
  @ApiOperation({
    summary: 'Create a job seeker profile',
    description:
      'Access levels:\n' +
      '- Employees: Can create their profile\n' +
      '- Others: No access',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Profile created successfully',
    type: JobSeekerResponseDto,
  })
  create(
    @Body(ValidationPipe) createJobSeekerDto: CreateJobSeekerDto,
    @GetUser() user: User,
  ) {
    return this.jobSeekerService.create(createJobSeekerDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all job seekers with pagination and filters',
    description: 'Public endpoint - Anyone can view job seeker profiles',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated job seekers',
    type: JobSeekerResponseDto,
  })
  findAll(@Query(ValidationPipe) filterDto: JobSeekerFilterDto) {
    return this.jobSeekerService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get job seeker by ID',
    description: 'Public endpoint - Anyone can view a job seeker profile',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the job seeker profile',
    type: JobSeekerResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobSeekerService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee, Role.Admin)
  @ApiOperation({
    summary: 'Update job seeker profile',
    description:
      'Access levels:\n' +
      '- Employees: Can update their own profile\n' +
      '- Admin: Can update any profile\n' +
      '- Others: No access',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile updated successfully',
    type: JobSeekerResponseDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateJobSeekerDto: UpdateJobSeekerDto,
    @GetUser() user: User,
  ) {
    return this.jobSeekerService.update(id, updateJobSeekerDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee, Role.Admin)
  @ApiOperation({
    summary: 'Delete job seeker profile',
    description:
      'Access levels:\n' +
      '- Employees: Can delete their own profile\n' +
      '- Admin: Can delete any profile\n' +
      '- Others: No access',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile deleted successfully',
  })
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.jobSeekerService.remove(id, user);
  }
}
