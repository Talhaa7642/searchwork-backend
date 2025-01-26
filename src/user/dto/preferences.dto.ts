import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString } from 'class-validator';

export class UpdatePreferencesDto {
  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  hideProfileData?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  notificationsEnabled?: boolean;

  @ApiProperty({ example: 'dark' })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  showEmail?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  showPhoneNumber?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  showLocation?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  contactViaEmail?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  contactViaPhoneNumber?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  contactViaMessage?: boolean;
}
