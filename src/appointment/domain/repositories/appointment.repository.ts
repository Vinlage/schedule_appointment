import { Appointment } from '../entities/appointment.entity';
import { Doctor } from '../../../doctor/domain/entities/doctor.entity';
import { Patient } from '../../../patient/domain/entities/patient.entity';

export interface AppointmentRepository {
  create(appointment: Appointment): Promise<Appointment>;
  findById(id: string): Promise<Appointment | null>;
  findAll(): Promise<Appointment[]>;
  findByDoctor(
    doctor: Doctor,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Appointment[]>;
  findByPatient(
    patient: Patient,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Appointment[]>;
  update(appointment: Appointment): Promise<Appointment>;
  delete(id: string): Promise<void>;
}
