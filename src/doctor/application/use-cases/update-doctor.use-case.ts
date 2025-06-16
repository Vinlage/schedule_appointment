import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Doctor } from '../../domain/entities/doctor.entity';
import { DoctorRepository } from '../../domain/repositories/doctor.repository';
import { DOCTOR_REPOSITORY } from '../../domain/repositories/tokens';
import { UpdateDoctorDto } from '../../infra/entrypoint/web/dtos/update-doctor.dto';

@Injectable()
export class UpdateDoctorUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY)
    private readonly doctorRepository: DoctorRepository,
  ) {}

  async execute(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }

    const updatedDoctor = doctor.update(
      updateDoctorDto.name,
      updateDoctorDto.email,
      updateDoctorDto.phone,
      updateDoctorDto.specialty,
      updateDoctorDto.crm,
      updateDoctorDto.active,
    );

    return this.doctorRepository.update(updatedDoctor);
  }
}
