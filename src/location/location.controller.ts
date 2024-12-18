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
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationFilterDto } from './dto/location-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../utils/constants/constants';
import { LocationResponseDto } from './dto/location-response.dto';

@ApiTags('locations')
@ApiBearerAuth('JWT-auth')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new location' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Location created successfully',
    type: LocationResponseDto,
  })
  create(@Body(ValidationPipe) createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all locations with pagination and filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated locations',
    type: LocationResponseDto,
  })
  findAll(@Query(ValidationPipe) filterDto: LocationFilterDto) {
    return this.locationService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get location by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the location',
    type: LocationResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update a location (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Location updated successfully',
    type: LocationResponseDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete a location (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Location deleted successfully',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.remove(id);
  }
}
