import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationFilterDto } from './dto/location-filter.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { SortOrder } from '../common/dto/pagination.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const existingLocation = await this.locationRepository.findOne({
      where: {
        city: createLocationDto.city,
        state: createLocationDto.state,
        country: createLocationDto.country,
        address: createLocationDto.address,
        postalCode: createLocationDto.postalCode,
        latitude: createLocationDto.latitude,
        longitude: createLocationDto.longitude,
      },
    });

    if (existingLocation) {
      return existingLocation;
    }

    const location = this.locationRepository.create({
      ...createLocationDto,
    });

    return await this.locationRepository.save(location);
  }

  async findAll(
    filterDto: LocationFilterDto,
  ): Promise<PaginatedResponse<Location>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
      city,
      state,
      country,
      search,
    } = filterDto;

    const queryBuilder = this.locationRepository.createQueryBuilder('location');

    if (city) {
      queryBuilder.andWhere('LOWER(location.city) LIKE LOWER(:city)', {
        city: `%${city}%`,
      });
    }

    if (state) {
      queryBuilder.andWhere('LOWER(location.state) LIKE LOWER(:state)', {
        state: `%${state}%`,
      });
    }

    if (country) {
      queryBuilder.andWhere('LOWER(location.country) LIKE LOWER(:country)', {
        country: `%${country}%`,
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(location.city) LIKE LOWER(:search) OR LOWER(location.state) LIKE LOWER(:search) OR LOWER(location.country) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const skip = (page - 1) * limit;

    const [items, total] = await queryBuilder
      .orderBy(`location.${sortBy}`, sortOrder)
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return location;
  }

  async update(
    id: number,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.findOne(id);

    if (
      updateLocationDto.city ||
      updateLocationDto.state ||
      updateLocationDto.country ||
      updateLocationDto.address ||
      updateLocationDto.latitude ||
      updateLocationDto.longitude
    ) {
      const existingLocation = await this.locationRepository.findOne({
        where: {
          city: updateLocationDto.city || location.city,
          state: updateLocationDto.state || location.state,
          country: updateLocationDto.country || location.country,
          address: updateLocationDto.address || location.address,
          latitude: updateLocationDto.latitude || location.latitude,
          longitude: updateLocationDto.longitude || location.longitude,
          postalCode: updateLocationDto.postalCode || location.postalCode,
        },
      });

      if (existingLocation && existingLocation.id !== id) {
        return existingLocation;
      }
    }

    Object.assign(location, updateLocationDto);
    return await this.locationRepository.save(location);
  }

  async remove(id: number): Promise<{ message: string }> {
    const location = await this.findOne(id);
    await this.locationRepository.remove(location);
    return { message: 'Location deleted successfully' };
  }
}
