import {
  IsDate,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
