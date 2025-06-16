import { Injectable, Inject } from '@nestjs/common';
import { Doctor } from '../../domain/entities/doctor.entity';
import { DoctorRepository } from '../../domain/repositories/doctor.repository';
import { DOCTOR_REPOSITORY } from '../../domain/repositories/tokens';

@Injectable()
export class ListDoctorsUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY)
    private readonly doctorRepository: DoctorRepository,
  ) {}

  async execute(): Promise<Doctor[]> {
    return this.doctorRepository.findAll();
  }
}
