import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { UserJobResponseDto } from './dto/user-job-response.dto';
import { SaveJobDto } from './dto/save-job.dto';
import { Role, Status } from '../utils/constants/constants';
import {
  Controller,
  Post,
  UseGuards,
  HttpStatus,
  Body,
  ValidationPipe,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateUserJobDto } from './dto/create-user-job.dto';
import { UpdateUserJobDto } from './dto/update-user-job.dto';
import { UserJobFilterDto } from './dto/user-job-filter.dto';
import { UserJobsService } from './user-jobs.service';

@ApiTags('user-jobs')
@ApiBearerAuth('JWT-auth')
@Controller('user-jobs')
export class UserJobsController {
  constructor(private readonly userJobsService: UserJobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee)
  @ApiOperation({
    summary: 'Apply for a job',
    description: 'Allows employees to submit job applications',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Application submitted successfully',
    type: UserJobResponseDto,
  })
  create(
    @Body(ValidationPipe) createUserJobDto: CreateUserJobDto,
    @GetUser() user: User,
  ) {
    return this.userJobsService.create(createUserJobDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee, Role.Employer, Role.Admin)
  @ApiOperation({
    summary: 'Get job applications with pagination and filters',
    description:
      'Access levels:\n' +
      '- Employees: Can only view their own applications\n' +
      '- Employers: Can only view applications for their posted jobs\n' +
      '- Admin: Can view all applications in the system',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated job applications based on user role access',
    type: UserJobResponseDto,
  })
  findAll(
    @Query(ValidationPipe) filterDto: UserJobFilterDto,
    @GetUser() user: User,
  ) {
    return this.userJobsService.findAll(filterDto, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee, Role.Employer, Role.Admin)
  @ApiOperation({
    summary: 'Get job application by ID',
    description:
      'Access levels:\n' +
      '- Employees: Can only view their own application\n' +
      '- Employers: Can only view applications for their posted jobs\n' +
      '- Admin: Can view any application',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the job application if user has permission',
    type: UserJobResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.userJobsService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer, Role.Admin)
  @ApiOperation({
    summary: 'Update job application status',
    description:
      'Access levels:\n' +
      '- Employers: Can only update applications for their posted jobs\n' +
      '- Admin: Can update any application status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Application status updated successfully',
    type: UserJobResponseDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserJobDto: UpdateUserJobDto,
    @GetUser() user: User,
  ) {
    return this.userJobsService.update(id, updateUserJobDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee, Role.Admin)
  @ApiOperation({
    summary: 'Withdraw/Delete job application',
    description:
      'Access levels:\n' +
      '- Employees: Can only withdraw their own applications\n' +
      '- Admin: Can delete any application',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Application withdrawn/deleted successfully',
  })
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.userJobsService.remove(id, user);
  }

  @Get('job/:jobId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer, Role.Admin)
  @ApiOperation({
    summary: 'Get all applications for a specific job post',
    description:
      'Access levels:\n' +
      '- Employers: Can only view applications for their own job posts\n' +
      '- Admin: Can view applications for any job post',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Returns all applications for the job post if user has permission',
    type: [UserJobResponseDto],
  })
  findByJobPost(
    @Param('jobId', ParseIntPipe) jobId: number,
    @GetUser() user: User,
  ) {
    return this.userJobsService.findByJobPost(jobId, user);
  }

  @Post('save')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee)
  @ApiOperation({ summary: 'Save a job for later' })
  saveJob(@Body(ValidationPipe) saveJobDto: SaveJobDto, @GetUser() user: User) {
    return this.userJobsService.saveJob(saveJobDto.jobPostId, user);
  }

  @Delete('save/:jobPostId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee)
  @ApiOperation({ summary: 'Remove a saved job' })
  unsaveJob(
    @Param('jobPostId', ParseIntPipe) jobPostId: number,
    @GetUser() user: User,
  ) {
    return this.userJobsService.unsaveJob(jobPostId, user);
  }

  @Get('saved')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee)
  @ApiOperation({ summary: 'Get all saved jobs' })
  getSavedJobs(@GetUser() user: User) {
    return this.userJobsService.getSavedJobs(user);
  }

  @Get('applications/status/:status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee)
  @ApiOperation({ summary: 'Get applications by status' })
  getApplicationsByStatus(
    @Param('status') status: Status,
    @GetUser() user: User,
  ) {
    return this.userJobsService.getApplicationsByStatus(user, status);
  }

  @Delete('history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee)
  @ApiOperation({ summary: 'Clear saved jobs history' })
  clearJobHistory(@GetUser() user: User) {
    return this.userJobsService.clearJobHistory(user);
  }
}
