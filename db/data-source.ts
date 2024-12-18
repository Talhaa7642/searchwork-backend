import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { Location } from '../src/location/entities/location.entity';
import { User } from '../src/user/entities/user.entity';
import { JobSeeker } from '../src/job-seeker/entities/job-seeker.entity';
import { Employer } from '../src/employer/entities/employer.entity';
import { JobPost } from '../src/job-post/entities/job-post.entity';
import { UserJob } from '../src/user-jobs/entities/user-job.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Location, User, JobSeeker, Employer, JobPost, UserJob],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
