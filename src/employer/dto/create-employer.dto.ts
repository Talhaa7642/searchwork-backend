import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateEmployerDto {
  @ApiProperty({
    example: 'Hegemonic Inc.',
    description: 'Company Name of the employer',
  })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty({ example: 'IT', description: 'Industry sector of the company' })
  @IsNotEmpty()
  @IsString()
  industry: string;

  @ApiProperty({
    example: '50-100',
    description: 'Number of employees in the company',
  })
  @IsOptional()
  @IsString()
  companySize: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Company registration number',
  })
  @IsOptional()
  @IsString()
  registrationNumber: string;
}
