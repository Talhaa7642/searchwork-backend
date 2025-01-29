import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateEmployerDto {
  @ApiProperty({
    example: 'Hegemonic Inc.',
    description: 'Updated company name of the employer',
    required: false,
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({
    example: 'IT',
    description: 'Updated industry sector of the company',
    required: false,
  })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiProperty({
    example: '50-100',
    description: 'Updated company size',
    required: false,
  })
  @IsOptional()
  @IsString()
  companySize?: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Updated company registration number',
    required: false,
  })
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiProperty({
    example: 'Write something about your company',
    description: 'Write about your company',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;
}

export class UpdateToggleProfileVisibility {
  @ApiProperty({
  example: true,
  description: 'Toggle profile visibility',
  required: false,
})
  @IsOptional()
  @IsBoolean()
  hideProfileData?: boolean;
}