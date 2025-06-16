import { Inject, Injectable } from '@nestjs/common';
import { Patient } from '../../domain/entities/patient.entity';
import { PatientRepository } from '../../domain/repositories/patient.repository';
import { PATIENT_REPOSITORY } from '../../domain/repositories/tokens';

@Injectable()
export class ListPatientsUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: PatientRepository,
  ) {}

  async execute(): Promise<Patient[]> {
    return this.patientRepository.list();
  }
}
