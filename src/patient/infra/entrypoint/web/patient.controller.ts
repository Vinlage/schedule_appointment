import { Body, Controller, Post } from '@nestjs/common';
import { CreatePatientUseCase, CreatePatientDTO } from '../../../application/use-cases/create-patient.use-case';

@Controller('patients')
export class PatientController {
  constructor(private readonly createPatientUseCase: CreatePatientUseCase) {}

  @Post()
  async create(@Body() data: CreatePatientDTO) {
    const patient = await this.createPatientUseCase.execute(data);
    return {
      id: patient.getId(),
      name: patient.getName(),
      email: patient.getEmail(),
      phone: patient.getPhone(),
      birthDate: patient.getBirthDate(),
      isAdult: patient.isAdult(),
    };
  }
} 