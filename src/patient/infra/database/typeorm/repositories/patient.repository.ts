import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../../../../domain/entities/patient.entity';
import { PatientRepository } from '../../../../domain/repositories/patient.repository';
import { PatientTypeOrmEntity } from '../entities/patient.entity';

@Injectable()
export class TypeOrmPatientRepository implements PatientRepository {
  constructor(
    @InjectRepository(PatientTypeOrmEntity)
    private readonly repository: Repository<PatientTypeOrmEntity>,
  ) {}

  async create(patient: Patient): Promise<void> {
    const patientEntity = new PatientTypeOrmEntity();
    patientEntity.id = patient.getId();
    patientEntity.name = patient.getName();
    patientEntity.email = patient.getEmail();
    patientEntity.phone = patient.getPhone();
    patientEntity.birthDate = patient.getBirthDate();
    patientEntity.createdAt = patient.getCreatedAt();
    patientEntity.updatedAt = patient.getUpdatedAt();

    await this.repository.save(patientEntity);
  }

  async findById(id: string): Promise<Patient | null> {
    const patientEntity = await this.repository.findOne({ where: { id } });
    if (!patientEntity) return null;

    return Patient.reconstruct(
      patientEntity.id,
      patientEntity.name,
      patientEntity.email,
      patientEntity.phone,
      patientEntity.birthDate,
      patientEntity.createdAt,
      patientEntity.updatedAt,
    );
  }

  async findByEmail(email: string): Promise<Patient | null> {
    const patientEntity = await this.repository.findOne({ where: { email } });
    if (!patientEntity) return null;

    return Patient.reconstruct(
      patientEntity.id,
      patientEntity.name,
      patientEntity.email,
      patientEntity.phone,
      patientEntity.birthDate,
      patientEntity.createdAt,
      patientEntity.updatedAt,
    );
  }

  async update(patient: Patient): Promise<void> {
    const patientEntity = await this.repository.findOne({
      where: { id: patient.getId() },
    });
    if (!patientEntity) throw new Error('Patient not found');

    patientEntity.name = patient.getName();
    patientEntity.email = patient.getEmail();
    patientEntity.phone = patient.getPhone();
    patientEntity.birthDate = patient.getBirthDate();
    patientEntity.updatedAt = new Date();

    await this.repository.save(patientEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async list(): Promise<Patient[]> {
    const patients = await this.repository.find();
    return patients.map((patient) =>
      Patient.reconstruct(
        patient.id,
        patient.name,
        patient.email,
        patient.phone,
        patient.birthDate,
        patient.createdAt,
        patient.updatedAt,
      ),
    );
  }
}
