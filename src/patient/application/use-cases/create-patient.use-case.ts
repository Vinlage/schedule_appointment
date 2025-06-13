import { Injectable } from '@nestjs/common';
import { Patient } from '../../domain/entities/patient.entity';
import { PatientRepository } from '../../domain/repositories/patient.repository';

export interface CreatePatientDTO {
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
}

@Injectable()
export class CreatePatientUseCase {
  constructor(private readonly patientRepository: PatientRepository) {}

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
      data.birthDate,
    );

    // Salvar no repositório
    await this.patientRepository.create(patient);

    return patient;
  }
} 