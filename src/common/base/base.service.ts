import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { TransactionManager } from '../util/transaction-manager';

@Injectable()
export abstract class BaseService {
  @Inject()
  protected dataSource!: DataSource;

  protected getTransactionManager(): TransactionManager {
    return new TransactionManager(this.dataSource);
  }
}
