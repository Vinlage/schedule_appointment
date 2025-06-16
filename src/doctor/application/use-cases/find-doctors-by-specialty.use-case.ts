import { Injectable } from '@nestjs/common';
import { Doctor } from '../../domain/entities/doctor.entity';
import { DoctorRepository } from '../../domain/repositories/doctor.repository';

@Injectable()
export class FindDoctorsBySpecialtyUseCase {
  constructor(private readonly doctorRepository: DoctorRepository) {}

  async execute(specialty: string): Promise<Doctor[]> {
    return this.doctorRepository.findBySpecialty(specialty);
  }
} 