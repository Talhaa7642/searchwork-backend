import {
    Controller,
    Get,
    Patch,
    Body,
    UseGuards,
    HttpStatus,
    Post,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiBody,
  } from '@nestjs/swagger';
  import { PreferencesService } from './preferences.service';
  import { UpdatePreferencesDto } from './dto/preferences.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { GetUser } from '../auth/decorators/get-user.decorator';
  import { User } from '../user/entities/user.entity';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { Role } from '../utils/constants/constants';
  
  @ApiTags('Preferences')
  @ApiBearerAuth('JWT-auth')
  @Controller('preferences')
  @UseGuards(JwtAuthGuard)
  export class PreferencesController {
    constructor(private readonly preferencesService: PreferencesService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(Role.Employee, Role.Employer)
    @ApiOperation({ summary: 'Create preferences for the authenticated user' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns the user’s preferences.',
      schema: {
        example: {
          hideProfileData: false,
          notificationsEnabled: true,
          theme: 'dark',
          showEmail: true,
          showPhoneNumber: true,
          showLocation: true,
          contactViaEmail: true,
          contactViaPhoneNumber: true,
          contactViaMessage: true,
        },
      },
    })
    @ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized access.',
    })
    async createPreferences(@GetUser() user: User) {
      return await this.preferencesService.createPreferences(user.id);
    }
   
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(Role.Employee, Role.Employer)
    @ApiOperation({ summary: 'Get preferences for the authenticated user' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns the user’s preferences.',
      schema: {
        example: {
          hideProfileData: false,
          notificationsEnabled: true,
          theme: 'dark',
          showEmail: true,
          showPhoneNumber: true,
          showLocation: true,
          contactViaEmail: true,
          contactViaPhoneNumber: true,
          contactViaMessage: true,
        },
      },
    })
    @ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized access.',
    })
    async getPreferences(@GetUser() user: User) {
      return await this.preferencesService.getPreferences(user.id);
    }
  
    @Patch()
    @ApiOperation({
      summary: 'Update preferences for the authenticated user',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Successfully updated preferences.',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid request body.',
    })
    @ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized access.',
    })
    @ApiBody({
      type: UpdatePreferencesDto,
      description: 'The updated preferences data',
      examples: {
        validRequest: {
          value: {
            hideProfileData: true,
            notificationsEnabled: false,
            theme: 'light',
            showEmail: false,
            showPhoneNumber: false,
            showLocation: false,
            contactViaEmail: true,
            contactViaPhoneNumber: false,
            contactViaMessage: false,
          },
          description: 'A valid update preferences request.',
        },
      },
    })
    async updatePreferences(
      @GetUser() user: User,
      @Body() updatePreferencesDto: UpdatePreferencesDto,
    ) {
      return await this.preferencesService.updatePreferences(
        user.id,
        updatePreferencesDto,
      );
    }
  }
  