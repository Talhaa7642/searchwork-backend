/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Query,
  Render,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiOkResponse, ApiTags, ApiConsumes, ApiCreatedResponse } from '@nestjs/swagger';
import type { Response } from 'express';

import type { PasswordResetDto } from '../views/password-reset.dto';
import { AppService } from './app.service';
import { CurrentUser, ValidatedUser } from './common/decorators/current-user.decorator';
import { JwtAuthGuard } from './modules/auth/strategies/jwt.strategy';
import { UploadFileResponse, UploadFileBody, UploadApkFileBody } from './modules/users/dtos/upload-file.dto';

@ApiTags('root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Never been better!',
  })
  @Get()
  checkHealth(): string {
    return this.appService.ping();
  }

  @ApiOperation({ summary: 'Get password reset page' })
  @ApiOkResponse({ description: 'Returns HTML page' })
  @UseGuards(JwtAuthGuard)
  @Get('password-reset')
  @Render('password-reset')
  passwordReset(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: ValidatedUser,
    @Query('token') token: string,
  ): PasswordResetDto {
    res.cookie('token', token);
    return {
      email: user.email,
      action: '/users/password',
    };
  }

  // File Upload
  @ApiOperation({ summary: 'Upload user files' })
  @ApiCreatedResponse({ description: 'Successful Operation', type: UploadFileResponse })
  @ApiConsumes('multipart/form-data')
  @Post('uploads')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body() _body: UploadFileBody,
    @UploadedFile(
      new ParseFilePipeBuilder().addMaxSizeValidator({ maxSize: 5000000 }).build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file: Express.Multer.File,
  ): Promise<UploadFileResponse> {
    return this.appService.uploadFile(file.buffer, file.originalname);
  }

  @ApiOperation({ summary: 'Upload apk file!!...' })
  @ApiCreatedResponse({ description: 'Successful Operation', type: UploadFileResponse })
  @ApiConsumes('multipart/form-data')
  @Post('uploads/apk')
  @UseInterceptors(FileInterceptor('file'))
  async uploadApkFile(
    @Body() body: UploadApkFileBody,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 200 * 1024 * 1024 }) // Limit max file size to 200MB
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<UploadFileResponse> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!file || !file.originalname.match(/\.(apk)$/)) {
        throw new HttpException('Only APK files up to 200MB are allowed!', HttpStatus.BAD_REQUEST);
      }
      return await this.appService.uploadApkFile(file.buffer, file.originalname, body.key);
    } catch (error: any) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
