import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_KEY_SECRET,
  });

  async uploadFile(file) {
    if (file.imageObject) {
      const thisObject = file.imageObject;
      return await this.s3_upload(thisObject, this.AWS_S3_BUCKET);
    } else {
      return await this.s3_upload(file, this.AWS_S3_BUCKET);
    }
  }

  async s3_upload(file, bucket) {
    const params = {
      Bucket: bucket,
      Key: String(file.path),
      Body: Buffer.from(file.data, 'base64'),
      ACL: 'public-read',
      ContentType: file.mime,
      ContentDisposition: 'inline',
    };

    try {
      return await this.s3.upload(params).promise();
    } catch (e) {
      console.log(e);
    }
  }
}
