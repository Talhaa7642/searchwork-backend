export interface AwsConfigOptions {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
}

export class AwsConfig {
  static createConfig(): () => { aws: AwsConfigOptions } {
    return () => ({
      aws: {
        accessKeyId: <string>process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: <string>process.env.AWS_SECRET_ACCESS_KEY,
        region: <string>process.env.AWS_REGION,
        bucketName: <string>process.env.AWS_PUBLIC_BUCKET_NAME,
      },
    });
  }
}
