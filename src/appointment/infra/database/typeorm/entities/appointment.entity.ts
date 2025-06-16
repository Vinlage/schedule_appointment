import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DoctorTypeOrmEntity } from '../../../../../doctor/infra/database/typeorm/entities/doctor.entity';
import { PatientTypeOrmEntity } from '../../../../../patient/infra/database/typeorm/entities/patient.entity';
import { AppointmentStatus } from '../../../../../appointment/domain/entities/appointment.entity';

@Entity('appointments')
export class AppointmentTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DoctorTypeOrmEntity)
  @JoinColumn({ name: 'doctor_id' })
  doctor: DoctorTypeOrmEntity;

  @ManyToOne(() => PatientTypeOrmEntity)
  @JoinColumn({ name: 'patient_id' })
  patient: PatientTypeOrmEntity;

  @Column({ name: 'appointment_date' })
  appointmentDate: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column()
  reason: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;
} 