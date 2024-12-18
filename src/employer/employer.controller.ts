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
import { UpdateEmployerDto } from './dto/update-employer.dto';
import { EmployerFilterDto } from './dto/employer-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../utils/constants/constants';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { EmployerResponseDto } from './dto/employer-response.dto';

@ApiTags('employers')
@ApiBearerAuth('JWT-auth')
@Controller('employers')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer)
  @ApiOperation({ summary: 'Create an employer profile' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Profile created successfully',
    type: EmployerResponseDto,
  })
  create(
    @Body(ValidationPipe) createEmployerDto: CreateEmployerDto,
    @GetUser() user: User,
  ) {
    return this.employerService.create(user.id, createEmployerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employers with pagination and filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated employers',
    type: EmployerResponseDto,
  })
  findAll(@Query(ValidationPipe) filterDto: EmployerFilterDto) {
    return this.employerService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employer by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the employer profile',
    type: EmployerResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.employerService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update employer profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile updated successfully',
    type: EmployerResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateEmployerDto: UpdateEmployerDto,
    @GetUser() user: User,
  ) {
    return this.employerService.update(+id, updateEmployerDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete employer profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile deleted successfully',
  })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.employerService.remove(+id, user);
  }
}
