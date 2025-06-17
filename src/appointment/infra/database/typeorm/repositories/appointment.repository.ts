import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, DataSource } from 'typeorm';
import { Appointment } from '../../../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../../../domain/repositories/appointment.repository';
import { AppointmentTypeOrmEntity } from '../entities/appointment.entity';
import { AppointmentId } from '../../../../domain/value-objects/appointment-id.value-object';
import { DoctorInfoDto } from '../../../../domain/dtos/doctor-info.dto';
import { PatientInfoDto } from '../../../../domain/dtos/patient-info.dto';

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
        id: appointment.getId().getValue(),
        doctor: { id: appointment.getDoctorInfo().id },
        patient: { id: appointment.getPatientInfo().id },
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

  async findById(id: AppointmentId): Promise<Appointment | null> {
    const appointmentEntity = await this.repository.findOne({
      where: { id: id.getValue() },
      relations: ['doctor', 'patient'],
      lock: { mode: 'pessimistic_write' },
    });

    if (!appointmentEntity) return null;

    const doctorInfo = DoctorInfoDto.create(
      appointmentEntity.doctor.id,
      appointmentEntity.doctor.name,
      appointmentEntity.doctor.email,
      appointmentEntity.doctor.specialty,
      appointmentEntity.doctor.active,
    );

    const patientInfo = PatientInfoDto.create(
      appointmentEntity.patient.id,
      appointmentEntity.patient.name,
      appointmentEntity.patient.email,
      appointmentEntity.patient.birthDate,
    );

    return Appointment.reconstruct(
      AppointmentId.fromString(appointmentEntity.id),
      doctorInfo,
      patientInfo,
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

    return appointmentEntities.map((entity) => {
      const doctorInfo = DoctorInfoDto.create(
        entity.doctor.id,
        entity.doctor.name,
        entity.doctor.email,
        entity.doctor.specialty,
        entity.doctor.active,
      );

      const patientInfo = PatientInfoDto.create(
        entity.patient.id,
        entity.patient.name,
        entity.patient.email,
        entity.patient.birthDate,
      );

      return Appointment.reconstruct(
        AppointmentId.fromString(entity.id),
        doctorInfo,
        patientInfo,
        entity.appointmentDate,
        entity.status,
        entity.reason,
        entity.notes,
        entity.createdAt,
        entity.updatedAt,
      );
    });
  }

  async findByDoctorId(
    doctorId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Appointment[]> {
    const where: Record<string, unknown> = { doctor: { id: doctorId } };

    if (startDate && endDate) {
      where['appointmentDate'] = Between(startDate, endDate);
    }

    const appointmentEntities = await this.repository.find({
      where,
      relations: ['doctor', 'patient'],
    });

    return appointmentEntities.map((entity) => {
      const doctorInfo = DoctorInfoDto.create(
        entity.doctor.id,
        entity.doctor.name,
        entity.doctor.email,
        entity.doctor.specialty,
        entity.doctor.active,
      );

      const patientInfo = PatientInfoDto.create(
        entity.patient.id,
        entity.patient.name,
        entity.patient.email,
        entity.patient.birthDate,
      );

      return Appointment.reconstruct(
        AppointmentId.fromString(entity.id),
        doctorInfo,
        patientInfo,
        entity.appointmentDate,
        entity.status,
        entity.reason,
        entity.notes,
        entity.createdAt,
        entity.updatedAt,
      );
    });
  }

  async findByPatientId(
    patientId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Appointment[]> {
    const where: Record<string, unknown> = { patient: { id: patientId } };

    if (startDate && endDate) {
      where['appointmentDate'] = Between(startDate, endDate);
    }

    const appointmentEntities = await this.repository.find({
      where,
      relations: ['doctor', 'patient'],
    });

    return appointmentEntities.map((entity) => {
      const doctorInfo = DoctorInfoDto.create(
        entity.doctor.id,
        entity.doctor.name,
        entity.doctor.email,
        entity.doctor.specialty,
        entity.doctor.active,
      );

      const patientInfo = PatientInfoDto.create(
        entity.patient.id,
        entity.patient.name,
        entity.patient.email,
        entity.patient.birthDate,
      );

      return Appointment.reconstruct(
        AppointmentId.fromString(entity.id),
        doctorInfo,
        patientInfo,
        entity.appointmentDate,
        entity.status,
        entity.reason,
        entity.notes,
        entity.createdAt,
        entity.updatedAt,
      );
    });
  }

  async update(appointment: Appointment): Promise<Appointment> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(
        AppointmentTypeOrmEntity,
        appointment.getId().getValue(),
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

  async delete(id: AppointmentId): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(AppointmentTypeOrmEntity, id.getValue());
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
