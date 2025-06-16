import {
  IsString,
  IsEmail,
  IsDateString,
  MinLength,
  Matches,
} from 'class-validator';

export class CreatePatientDTO {
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international format',
  })
  phone: string;

  @IsDateString()
  birthDate: Date;
}
