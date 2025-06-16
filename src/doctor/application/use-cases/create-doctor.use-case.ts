import { Injectable, Inject } from '@nestjs/common';
import { Doctor } from '../../domain/entities/doctor.entity';
import { DoctorRepository } from '../../domain/repositories/doctor.repository';
import { DOCTOR_REPOSITORY } from '../../domain/repositories/tokens';
import { CreateDoctorDto } from '../../infra/entrypoint/web/dtos/create-doctor.dto';

@Injectable()
export class CreateDoctorUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY)
    private readonly doctorRepository: DoctorRepository,
  ) {}

  async execute(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const doctor = Doctor.create(
      createDoctorDto.name,
      createDoctorDto.email,
      createDoctorDto.phone,
      createDoctorDto.specialty,
      createDoctorDto.crm,
      createDoctorDto.active,
    );

    return this.doctorRepository.create(doctor);
  }
}
