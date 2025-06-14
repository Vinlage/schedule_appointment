import { Inject, Injectable } from '@nestjs/common';
import { Patient } from '../../domain/entities/patient.entity';
import { PatientRepository } from '../../domain/repositories/patient.repository';
import { PATIENT_REPOSITORY } from '../../domain/repositories/tokens';
import { CreatePatientDTO } from '../dtos/create-patient.dto';

@Injectable()
export class CreatePatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: PatientRepository,
  ) {}

  async execute(data: CreatePatientDTO): Promise<Patient> {
    // Verificar se já existe um paciente com o mesmo email
    const existingPatient = await this.patientRepository.findByEmail(data.email);
    if (existingPatient) {
      throw new Error('Patient with this email already exists');
    }

    // Criar novo paciente
    const patient = Patient.create(
      data.name,
      data.email,
      data.phone,
      new Date(data.birthDate),
    );

    // Salvar no repositório
    await this.patientRepository.create(patient);

    return patient;
  }
} 