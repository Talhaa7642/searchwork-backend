/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiOkResponse,
  ApiTags,
  ApiConsumes,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { AppService } from './app.service';
import { UploadFileResponse, UploadFileBody } from './user/dto/upload-file.dto';

@ApiTags('root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({
    description: 'Never been better!',
  })
  @Get()
  checkHealth(): string {
    return this.appService.ping();
  }

  @ApiOperation({ summary: 'Upload user files' })
  @ApiCreatedResponse({
    description: 'Successful Operation',
    type: UploadFileResponse,
  })
  @ApiConsumes('multipart/form-data')
  @Post('uploads')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body() _body: UploadFileBody,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5000000 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<UploadFileResponse> {
    return this.appService.uploadFile(file);
  }
}
