import { Appointment } from '../entities/appointment.entity';
import { AppointmentId } from '../value-objects/appointment-id.value-object';

export interface AppointmentRepository {
  create(appointment: Appointment): Promise<Appointment>;
  findById(id: AppointmentId): Promise<Appointment | null>;
  findAll(): Promise<Appointment[]>;
  findByDoctorId(
    doctorId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Appointment[]>;
  findByPatientId(
    patientId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Appointment[]>;
  update(appointment: Appointment): Promise<Appointment>;
  delete(id: AppointmentId): Promise<void>;
}
