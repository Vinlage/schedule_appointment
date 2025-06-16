import { IsEmail, IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateDoctorDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  specialty?: string;

  @IsString()
  @IsOptional()
  crm?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
