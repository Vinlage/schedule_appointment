import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DoctorRepository } from '../../domain/repositories/doctor.repository';
import { DOCTOR_REPOSITORY } from '../../domain/repositories/tokens';

@Injectable()
export class DeleteDoctorUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY)
    private readonly doctorRepository: DoctorRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }

    await this.doctorRepository.delete(id);
  }
}
