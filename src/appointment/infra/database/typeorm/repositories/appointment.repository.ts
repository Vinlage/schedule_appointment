import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment } from '../../../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../../../domain/repositories/appointment.repository';
import { AppointmentTypeOrmEntity } from '../entities/appointment.entity';
import { Doctor } from '../../../../../doctor/domain/entities/doctor.entity';
import { Patient } from '../../../../../patient/domain/entities/patient.entity';

@Injectable()
export class TypeOrmAppointmentRepository implements AppointmentRepository {
  constructor(
    @InjectRepository(AppointmentTypeOrmEntity)
    private readonly repository: Repository<AppointmentTypeOrmEntity>,
  ) {}

  async create(appointment: Appointment): Promise<Appointment> {
    const appointmentEntity = this.repository.create({
      id: appointment.getId(),
      doctor: { id: appointment.getDoctor().getId() },
      patient: { id: appointment.getPatient().getId() },
      appointmentDate: appointment.getDate(),
      status: appointment.getStatus(),
      reason: appointment.getReason(),
      notes: appointment.getNotes() ?? undefined,
      createdAt: appointment.getCreatedAt(),
      updatedAt: appointment.getUpdatedAt(),
    });

    await this.repository.save(appointmentEntity);
    return appointment;
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointmentEntity = await this.repository.findOne({
      where: { id },
      relations: ['doctor', 'patient'],
    });

    if (!appointmentEntity) return null;

    return Appointment.reconstruct(
      appointmentEntity.id,
      appointmentEntity.doctor as unknown as Doctor,
      appointmentEntity.patient as unknown as Patient,
      appointmentEntity.appointmentDate,
      appointmentEntity.status,
      appointmentEntity.reason,
      appointmentEntity.notes,
      appointmentEntity.createdAt,
      appointmentEntity.updatedAt,
    );
  }

  async findAll(): Promise<Appointment[]> {
    const appointmentEntities = await this.repository.find({
      relations: ['doctor', 'patient'],
    });

    return appointmentEntities.map((entity) =>
      Appointment.reconstruct(
        entity.id,
        entity.doctor as unknown as Doctor,
        entity.patient as unknown as Patient,
        entity.appointmentDate,
        entity.status,
        entity.reason,
        entity.notes,
        entity.createdAt,
        entity.updatedAt,
      ),
    );
  }

  async findByDoctor(
    doctor: Doctor,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Appointment[]> {
    const where: any = { doctor: { id: doctor.getId() } };

    if (startDate && endDate) {
      where.appointmentDate = Between(startDate, endDate);
    }

    const appointmentEntities = await this.repository.find({
      where,
      relations: ['doctor', 'patient'],
    });

    return appointmentEntities.map((entity) =>
      Appointment.reconstruct(
        entity.id,
        entity.doctor as unknown as Doctor,
        entity.patient as unknown as Patient,
        entity.appointmentDate,
        entity.status,
        entity.reason,
        entity.notes,
        entity.createdAt,
        entity.updatedAt,
      ),
    );
  }

  async findByPatient(
    patient: Patient,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Appointment[]> {
    const where: any = { patient: { id: patient.getId() } };

    if (startDate && endDate) {
      where.appointmentDate = Between(startDate, endDate);
    }

    const appointmentEntities = await this.repository.find({
      where,
      relations: ['doctor', 'patient'],
    });

    return appointmentEntities.map((entity) =>
      Appointment.reconstruct(
        entity.id,
        entity.doctor as unknown as Doctor,
        entity.patient as unknown as Patient,
        entity.appointmentDate,
        entity.status,
        entity.reason,
        entity.notes,
        entity.createdAt,
        entity.updatedAt,
      ),
    );
  }

  async update(appointment: Appointment): Promise<Appointment> {
    await this.repository.update(appointment.getId(), {
      appointmentDate: appointment.getDate(),
      status: appointment.getStatus(),
      reason: appointment.getReason(),
      notes: appointment.getNotes() ?? undefined,
      updatedAt: appointment.getUpdatedAt(),
    });

    return appointment;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
} 