import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/base/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity()
export class Location extends BaseEntity {
  @ApiProperty({ example: 'New York' })
  @IsNotEmpty()
  @IsString()
  @Column()
  city: string;

  @ApiProperty({ example: 'NY' })
  @IsNotEmpty()
  @IsString()
  @Column()
  state: string;

  @ApiProperty({ example: 'USA' })
  @IsNotEmpty()
  @IsString()
  @Column()
  country: string;

  @ApiProperty({ example: '123 Main St' })
  @IsNotEmpty()
  @IsString()
  @Column()
  address: string;

  @ApiProperty({ example: '10001' })
  @IsString()
  @Column({ nullable: true })
  postalCode?: string;

  @ApiProperty({ example: 40.7128 })
  @Column({ type: 'decimal', precision: 10, scale: 7 })
  @Index()
  latitude: number;

  @ApiProperty({ example: -74.006 })
  @Column({ type: 'decimal', precision: 10, scale: 7 })
  @Index()
  longitude: number;
}
