import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Preferences } from './entities/preferences.entity';
import { UpdatePreferencesDto } from './dto/preferences.dto';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(Preferences)
    private readonly preferencesRepository: Repository<Preferences>,
  ) {}

  async getPreferences(userId: number): Promise<Preferences> {
    const preferences = await this.preferencesRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!preferences) {
      throw new NotFoundException('Preferences not found for this user');
    }
    return preferences;
  }

  async updatePreferences(
    userId: number,
    updatePreferencesDto: UpdatePreferencesDto,
  ): Promise<Preferences> {
    const preferences = await this.preferencesRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!preferences) {
      throw new NotFoundException('Preferences not found for this user');
    }

    Object.assign(preferences, updatePreferencesDto);
    return await this.preferencesRepository.save(preferences);
  }
}
