// eslint-disable-next-line max-classes-per-file
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadApkFileBody {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file!: Express.Multer.File;

  @IsString()
  @IsOptional()
  key?: string;
}

export class UploadFileBody {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file!: Express.Multer.File;
}
export class UploadFileResponse {
  key!: string;
  url!: string;

  constructor(key: string, url: string) {
    this.key = key;
    this.url = url;
  }
}
