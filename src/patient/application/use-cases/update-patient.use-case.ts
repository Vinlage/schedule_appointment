import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Patient } from '../../domain/entities/patient.entity';
import { PatientRepository } from '../../domain/repositories/patient.repository';
import { PATIENT_REPOSITORY } from '../../domain/repositories/tokens';

export interface UpdatePatientDTO {
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: Date;
}

@Injectable()
export class UpdatePatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: PatientRepository,
  ) {}

  async execute(id: string, data: UpdatePatientDTO): Promise<Patient> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    // Se o email está sendo atualizado, verificar se já existe
    if (data.email && data.email !== patient.getEmail()) {
      const existingPatient = await this.patientRepository.findByEmail(data.email);
      if (existingPatient) {
        throw new Error('Email already in use by another patient');
      }
    }

    // Criar uma nova instância do paciente com os dados atualizados
    const updatedPatient = Patient.reconstruct(
      patient.getId(),
      data.name ?? patient.getName(),
      data.email ?? patient.getEmail(),
      data.phone ?? patient.getPhone(),
      data.birthDate ?? patient.getBirthDate(),
      patient.getCreatedAt(),
      new Date(),
    );

    await this.patientRepository.update(updatedPatient);
    return updatedPatient;
  }
} 