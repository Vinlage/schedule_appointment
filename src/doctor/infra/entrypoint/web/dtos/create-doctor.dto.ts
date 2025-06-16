import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  specialty: string;

  @IsString()
  @IsNotEmpty()
  crm: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean = true;
} 