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
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { EmployerService } from './employer.service';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto, UpdateToggleProfileVisibility } from './dto/update-employer.dto';
import { EmployerFilterDto } from './dto/employer-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../utils/constants/constants';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { EmployerResponseDto } from './dto/employer-response.dto';

@ApiTags('Employers')
@ApiBearerAuth('JWT-auth')
@Controller('employers')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer)
  @ApiOperation({ summary: 'Create a new employer profile' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Employer profile created successfully.',
    type: EmployerResponseDto,
  })
  createEmployer(
    @Body(ValidationPipe) createEmployerDto: CreateEmployerDto,
    @GetUser() user: User,
  ) {
    return this.employerService.create(user.id, createEmployerDto);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer)
  @ApiOperation({ summary: 'Retrieve a list of employers with filters and pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of employers retrieved successfully.',
    type: EmployerResponseDto,
  })
  getEmployers(@Query(ValidationPipe) filterDto: EmployerFilterDto) {
    return this.employerService.findAll(filterDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer)
  @ApiOperation({ summary: 'Get details of a specific employer by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employer details retrieved successfully.',
    type: EmployerResponseDto,
  })
  getEmployerById(@Param('id') id: number) {
    return this.employerService.findOne(+id);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer)
  @ApiOperation({ summary: 'Update employer profile details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employer profile updated successfully.',
    type: EmployerResponseDto,
  })
  updateEmployer(
    @Param('id') id: number,
    @Body(ValidationPipe) updateEmployerDto: UpdateEmployerDto,
    @GetUser() user: User,
  ) {
    return this.employerService.update(+id, updateEmployerDto, user);
  }

  @Patch('toggle-visibility')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer)
  @ApiOperation({ summary: 'Toggle visibility of employer profile data' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employer profile visibility updated successfully.',
    type: EmployerResponseDto,
  })
  toggleEmployerVisibility(
    // @Param('id') id: number,
    @GetUser() user: User,
    @Body(ValidationPipe) updateToggleProfileVisibility: UpdateToggleProfileVisibility,
  ) {
    return this.employerService.updateEmployer(user.id, updateToggleProfileVisibility);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer)
  @ApiOperation({ summary: 'Delete an employer profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employer profile deleted successfully.',
  })
  deleteEmployer(@Param('id') id: number, @GetUser() user: User) {
    return this.employerService.remove(+id, user);
  }
}
