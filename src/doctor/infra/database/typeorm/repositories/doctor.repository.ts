import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../../../../domain/entities/doctor.entity';
import { DoctorRepository } from '../../../../domain/repositories/doctor.repository';
import { DoctorTypeOrmEntity } from '../entities/doctor.entity';

@Injectable()
export class TypeOrmDoctorRepository implements DoctorRepository {
  constructor(
    @InjectRepository(DoctorTypeOrmEntity)
    private readonly repository: Repository<DoctorTypeOrmEntity>,
  ) {}

  async create(doctor: Doctor): Promise<Doctor> {
    const doctorEntity = this.repository.create({
      id: doctor.getId(),
      name: doctor.getName(),
      email: doctor.getEmail(),
      phone: doctor.getPhone(),
      specialty: doctor.getSpecialty(),
      crm: doctor.getCrm(),
      active: doctor.isActive(),
      createdAt: doctor.getCreatedAt(),
      updatedAt: doctor.getUpdatedAt(),
    });

    await this.repository.save(doctorEntity);
    return doctor;
  }

  async findById(id: string): Promise<Doctor | null> {
    const doctorEntity = await this.repository.findOne({ where: { id } });
    if (!doctorEntity) return null;

    return Doctor.reconstruct(
      doctorEntity.id,
      doctorEntity.name,
      doctorEntity.email,
      doctorEntity.phone,
      doctorEntity.specialty,
      doctorEntity.crm,
      doctorEntity.active,
      doctorEntity.createdAt,
      doctorEntity.updatedAt,
    );
  }

  async findByEmail(email: string): Promise<Doctor | null> {
    const doctorEntity = await this.repository.findOne({
      where: { email },
    });

    if (!doctorEntity) return null;

    return Doctor.reconstruct(
      doctorEntity.id,
      doctorEntity.name,
      doctorEntity.email,
      doctorEntity.phone,
      doctorEntity.specialty,
      doctorEntity.crm,
      doctorEntity.active,
      doctorEntity.createdAt,
      doctorEntity.updatedAt,
    );
  }

  async findBySpecialty(specialty: string): Promise<Doctor[]> {
    const doctorEntities = await this.repository.find({
      where: { specialty },
    });

    return doctorEntities.map((entity) =>
      Doctor.reconstruct(
        entity.id,
        entity.name,
        entity.email,
        entity.phone,
        entity.specialty,
        entity.crm,
        entity.active,
        entity.createdAt,
        entity.updatedAt,
      ),
    );
  }

  async findAll(): Promise<Doctor[]> {
    const doctorEntities = await this.repository.find();
    return doctorEntities.map((entity) =>
      Doctor.reconstruct(
        entity.id,
        entity.name,
        entity.email,
        entity.phone,
        entity.specialty,
        entity.crm,
        entity.active,
        entity.createdAt,
        entity.updatedAt,
      ),
    );
  }

  async update(doctor: Doctor): Promise<Doctor> {
    await this.repository.update(doctor.getId(), {
      name: doctor.getName(),
      email: doctor.getEmail(),
      phone: doctor.getPhone(),
      specialty: doctor.getSpecialty(),
      crm: doctor.getCrm(),
      active: doctor.isActive(),
      updatedAt: doctor.getUpdatedAt(),
    });

    return doctor;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
