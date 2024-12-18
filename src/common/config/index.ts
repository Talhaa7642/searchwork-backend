import type { ConfigFactory } from '@nestjs/config';

import { AwsConfig } from './configs/aws.config';
import { JwtConfig } from './configs/jwt.config';

export const createConfig = (): Array<ConfigFactory> => [
  JwtConfig.createConfig(),
  AwsConfig.createConfig(),
];
