import { Inject, Injectable } from '@nestjs/common';
import { Patient } from '../../domain/entities/patient.entity';
import { PatientRepository } from '../../domain/repositories/patient.repository';
import { PATIENT_REPOSITORY } from '../../domain/repositories/tokens';
import { CreatePatientDTO } from '../dtos/create-patient.dto';
import { EmailAlreadyInUseError } from '../../domain/errors/patient-errors';

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
      throw new EmailAlreadyInUseError(data.email);
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