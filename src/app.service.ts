import { Injectable } from '@nestjs/common';
import { S3Service } from './utils/s3Services/s3Services';
import { BaseService } from './common/base/base.service';
import { UploadFileResponse } from './user/dto/upload-file.dto';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';
import { User } from './user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService extends BaseService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  ping(): string {
    return 'Never been better!';
  }

  async uploadFile(id: number, file: Express.Multer.File): Promise<UploadFileResponse> {
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
  
    const existingUser = await this.userRepository.findOne({
      where: { id },
    });
  
    if (!existingUser) {
      throw new Error('User not found');
    }
  
    existingUser.profileImageUrl = result.Location;
  
    await this.userRepository.save(existingUser);
  
    return new UploadFileResponse(result.Key, result.Location);
  }
  
}
