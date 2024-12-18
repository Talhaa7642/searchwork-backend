import { Logger } from '@nestjs/common';
import type {
  DataSource,
  EntityManager,
  EntityTarget,
  ObjectId,
} from 'typeorm';
import type { UpsertOptions } from 'typeorm/repository/UpsertOptions';

import { BaseEntity } from '../base/base.entity';

const isEntityCollection = (
  arr: BaseEntity[] | BaseEntity,
): arr is BaseEntity[] => 'length' in arr;
type Criteria =
  | string
  | string[]
  | number
  | number[]
  | Date
  | Date[]
  | ObjectId
  | ObjectId[]
  | any;

export enum TransactionAction {
  INSERT = 'insert',
  UPDATE = 'update',
  UPSERT = 'upsert',
  DELETE = 'delete',
  SOFT_DELETE = 'soft_delete',
  INCREMENT = 'increment',
  DECREMENT = 'decrement',
}

export enum TransactionObjectType {
  ENTITY,
  ENTITY_COLLECTION,
}

export interface TransactionObjectOptions {
  where?: Criteria;
  conflictPathsOrOptions?: string[] | UpsertOptions<BaseEntity>;
  counterColumn?: string;
}
export interface TransactionObject {
  type: TransactionObjectType;
  object?: BaseEntity[] | BaseEntity;
  target?: EntityTarget<BaseEntity>;
  action: TransactionAction;
  options?: TransactionObjectOptions;
}

export class TransactionManager {
  transactionObjects: TransactionObject[] = [];
  manager: EntityManager;

  constructor(dataSource: DataSource) {
    this.manager = dataSource.manager;
  }

  resetTransactionObjects(): void {
    this.transactionObjects = [];
  }

  add(object: BaseEntity | BaseEntity[]): void {
    this.transactionObjects.push({
      object,
      type: this.getObjectType(object),
      action: TransactionAction.INSERT,
    });
  }

  update(object: BaseEntity, where: Criteria): void {
    this.transactionObjects.push({
      object,
      type: this.getObjectType(object),
      action: TransactionAction.UPDATE,
      options: { where },
    });
  }

  upsert(
    object: BaseEntity | BaseEntity[],
    conflictPathsOrOptions: string[] | UpsertOptions<BaseEntity>,
  ): void {
    this.transactionObjects.push({
      object,
      type: this.getObjectType(object),
      action: TransactionAction.UPSERT,
      options: { conflictPathsOrOptions },
    });
  }

  delete(object: BaseEntity | BaseEntity[]): void {
    this.transactionObjects.push({
      object,
      type: this.getObjectType(object),
      action: TransactionAction.DELETE,
    });
  }

  softDelete(object: BaseEntity | BaseEntity[]): void {
    this.transactionObjects.push({
      object,
      type: this.getObjectType(object),
      action: TransactionAction.SOFT_DELETE,
    });
  }

  increment(
    target: EntityTarget<BaseEntity>,
    where: Criteria,
    counterColumn: string,
  ): void {
    this.transactionObjects.push({
      target,
      type: TransactionObjectType.ENTITY,
      action: TransactionAction.INCREMENT,
      options: { where, counterColumn },
    });
  }

  decrement(
    target: EntityTarget<BaseEntity>,
    where: Criteria,
    counterColumn: string,
  ): void {
    this.transactionObjects.push({
      target,
      type: TransactionObjectType.ENTITY,
      action: TransactionAction.DECREMENT,
      options: { where, counterColumn },
    });
  }

  async commit(): Promise<void> {
    try {
      await this.manager.transaction(async (transactionEntityManager) => {
        for (const tObject of this.transactionObjects) {
          switch (tObject.action) {
            case TransactionAction.INSERT:
              await transactionEntityManager.save(tObject.object);
              break;
            case TransactionAction.UPSERT: {
              const { object } = tObject;
              if (!object) return;
              if (isEntityCollection(object))
                await transactionEntityManager.upsert(
                  object[0].constructor.name,
                  object,
                  tObject.options?.conflictPathsOrOptions || [],
                );
              else
                await transactionEntityManager.upsert(
                  object.constructor.name,
                  object,
                  tObject.options?.conflictPathsOrOptions || [],
                );
              break;
            }
            case TransactionAction.UPDATE: {
              const entity = <BaseEntity>tObject.object;
              await transactionEntityManager.update(
                entity.constructor.name,
                tObject.options?.where,
                entity,
              );
              break;
            }
            case TransactionAction.DELETE:
              await transactionEntityManager.remove(tObject.object);
              break;
            case TransactionAction.SOFT_DELETE:
              await transactionEntityManager.softRemove(tObject.object);
              break;
            case TransactionAction.INCREMENT: {
              const { target, options } = tObject;
              if (!target || !options?.where || !options.counterColumn) return;
              await transactionEntityManager.increment(
                target,
                options.where,
                options.counterColumn,
                1,
              );
              break;
            }
            case TransactionAction.DECREMENT: {
              const { target, options } = tObject;
              if (!target || !options?.where || !options.counterColumn) return;
              await transactionEntityManager.decrement(
                target,
                options.where,
                options.counterColumn,
                1,
              );
              break;
            }
            default:
              break;
          }
        }
      });
    } catch (error) {
      Logger.error(error);
      throw error;
    } finally {
      this.resetTransactionObjects();
    }
  }

  private getObjectType(
    object: BaseEntity | BaseEntity[],
  ): TransactionObjectType {
    return Array.isArray(object)
      ? TransactionObjectType.ENTITY_COLLECTION
      : TransactionObjectType.ENTITY;
  }
}
