import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Doctor } from '../../domain/entities/doctor.entity';
import { DoctorRepository } from '../../domain/repositories/doctor.repository';
import { DOCTOR_REPOSITORY } from '../../domain/repositories/tokens';

@Injectable()
export class GetDoctorByIdUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY)
    private readonly doctorRepository: DoctorRepository,
  ) {}

  async execute(id: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }
} 