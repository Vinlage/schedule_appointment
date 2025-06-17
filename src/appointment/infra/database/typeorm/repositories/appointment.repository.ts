import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, DataSource } from 'typeorm';
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
    private readonly dataSource: DataSource,
  ) {}

  async create(appointment: Appointment): Promise<Appointment> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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

      await queryRunner.manager.save(appointmentEntity);
      await queryRunner.commitTransaction();
      return appointment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointmentEntity = await this.repository.findOne({
      where: { id },
      relations: ['doctor', 'patient'],
      lock: { mode: 'pessimistic_write' },
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
    const where: Record<string, unknown> = { doctor: { id: doctor.getId() } };

    if (startDate && endDate) {
      where['appointmentDate'] = Between(startDate, endDate);
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
    const where: Record<string, unknown> = { patient: { id: patient.getId() } };

    if (startDate && endDate) {
      where['appointmentDate'] = Between(startDate, endDate);
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(
        AppointmentTypeOrmEntity,
        appointment.getId(),
        {
          appointmentDate: appointment.getDate(),
          status: appointment.getStatus(),
          reason: appointment.getReason(),
          notes: appointment.getNotes() ?? undefined,
          updatedAt: appointment.getUpdatedAt(),
        },
      );
      await queryRunner.commitTransaction();
      return appointment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(AppointmentTypeOrmEntity, id);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
