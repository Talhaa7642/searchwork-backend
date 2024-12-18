import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity as EntityBase,
} from 'typeorm';

export class BaseEntity extends EntityBase {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public id!: number;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt!: Date;

  @ApiProperty()
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', select: false })
  public deletedAt!: Date;
}
