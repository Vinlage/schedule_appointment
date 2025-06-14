import { Inject, Injectable } from '@nestjs/common';
import { Patient } from '../../domain/entities/patient.entity';
import { PatientRepository } from '../../domain/repositories/patient.repository';
import { PATIENT_REPOSITORY } from '../../domain/repositories/tokens';
import { PatientNotFoundError } from '../../domain/errors/patient-errors';

@Injectable()
export class GetPatientByIdUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: PatientRepository,
  ) {}

  async execute(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new PatientNotFoundError(id);
    }
    return patient;
  }
} 