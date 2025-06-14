import { Inject, Injectable } from '@nestjs/common';
import { PatientRepository } from '../../domain/repositories/patient.repository';
import { PATIENT_REPOSITORY } from '../../domain/repositories/tokens';
import { PatientNotFoundError } from '../../domain/errors/patient-errors';

@Injectable()
export class DeletePatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: PatientRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new PatientNotFoundError(id);
    }

    await this.patientRepository.delete(id);
  }
} 