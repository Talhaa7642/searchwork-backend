import { Injectable } from '@nestjs/common';
import { S3Service } from './utils/s3Services/s3Services';
import { BaseService } from './common/base/base.service';
import { UploadFileResponse } from './user/dto/upload-file.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AppService extends BaseService {
  constructor(private s3Service: S3Service) {
    super();
  }

  ping(): string {
    return 'Never been better!';
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadFileResponse> {
    const fileKey = `${uuid()}-${file.originalname}`;

    const fileObject = {
      data: file.buffer.toString('base64'),
      path: fileKey,
      mime: file.mimetype,
    };

    const result = await this.s3Service.uploadFile(fileObject);

    if (!result) {
      throw new Error('File upload failed');
    }

    return new UploadFileResponse(result.Key, result.Location);
  }
}
