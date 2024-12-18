// eslint-disable-next-line max-classes-per-file
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Max } from 'class-validator';

export class PaginatedQuery {
  @IsOptional()
  @Transform(({ value }) => parseInt(<string>value, 10))
  @IsInt()
  @IsPositive()
  @Max(1000)
  limit?: number = 10;

  @IsOptional()
  @Transform(({ value }) => parseInt(<string>value, 10))
  @IsInt()
  offset?: number = 0;
}

export class PaginatedResponse<T> {
  @ApiProperty()
  next?: string;

  @ApiProperty()
  previous?: string;

  @ApiProperty()
  count!: number;

  @ApiProperty()
  records!: T[];

  constructor(records: T[]) {
    this.records = records;
    this.count = records.length;
  }
}
