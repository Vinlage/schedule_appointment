import { Injectable, Inject } from '@nestjs/common';
import { DoctorServiceInterface } from '../../domain/services/doctor-service.interface';
import { DoctorInfoDto } from '../../domain/dtos/doctor-info.dto';
import { DoctorRepository } from '../../../doctor/domain/repositories/doctor.repository';
import { DOCTOR_REPOSITORY } from '../../../doctor/domain/repositories/tokens';

@Injectable()
export class DoctorService implements DoctorServiceInterface {
  constructor(
    @Inject(DOCTOR_REPOSITORY)
    private readonly doctorRepository: DoctorRepository,
  ) {}

  async findById(id: string): Promise<DoctorInfoDto | null> {
    const doctor = await this.doctorRepository.findById(id);

    if (!doctor) {
      return null;
    }

    return DoctorInfoDto.create(
      doctor.getId(),
      doctor.getName(),
      doctor.getEmail(),
      doctor.getSpecialty(),
      doctor.isActive(),
    );
  }

  async isActive(id: string): Promise<boolean> {
    const doctor = await this.doctorRepository.findById(id);
    return doctor?.isActive() ?? false;
  }
}
