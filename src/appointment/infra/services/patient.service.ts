import { Injectable, Inject } from '@nestjs/common';
import { PatientServiceInterface } from '../../domain/services/patient-service.interface';
import { PatientInfoDto } from '../../domain/dtos/patient-info.dto';
import { PatientRepository } from '../../../patient/domain/repositories/patient.repository';
import { PATIENT_REPOSITORY } from '../../../patient/domain/repositories/tokens';

@Injectable()
export class PatientService implements PatientServiceInterface {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: PatientRepository,
  ) {}

  async findById(id: string): Promise<PatientInfoDto | null> {
    const patient = await this.patientRepository.findById(id);

    if (!patient) {
      return null;
    }

    return PatientInfoDto.create(
      patient.getId(),
      patient.getName(),
      patient.getEmail(),
      patient.getBirthDate(),
    );
  }
}
