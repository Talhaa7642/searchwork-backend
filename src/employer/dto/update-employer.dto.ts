import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';


export class UpdateEmployerDto {
  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  hideProfileData?: boolean;
}
