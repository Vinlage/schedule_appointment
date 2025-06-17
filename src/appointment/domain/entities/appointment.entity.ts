import { AppointmentId } from '../value-objects/appointment-id.value-object';
import { DoctorInfoDto } from '../dtos/doctor-info.dto';
import { PatientInfoDto } from '../dtos/patient-info.dto';

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export class Appointment {
  private constructor(
    private readonly id: AppointmentId,
    private readonly doctorInfo: DoctorInfoDto,
    private readonly patientInfo: PatientInfoDto,
    private readonly date: Date,
    private readonly status: AppointmentStatus,
    private readonly reason: string,
    private readonly notes: string | null,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  static create(
    doctorInfo: DoctorInfoDto,
    patientInfo: PatientInfoDto,
    date: Date,
    reason: string,
    notes?: string,
  ): Appointment {
    const now = new Date();
    return new Appointment(
      AppointmentId.create(),
      doctorInfo,
      patientInfo,
      date,
      AppointmentStatus.SCHEDULED,
      reason,
      notes ?? null,
      now,
      now,
    );
  }

  static reconstruct(
    id: AppointmentId,
    doctorInfo: DoctorInfoDto,
    patientInfo: PatientInfoDto,
    date: Date,
    status: AppointmentStatus,
    reason: string,
    notes: string | null,
    createdAt: Date,
    updatedAt: Date,
  ): Appointment {
    return new Appointment(
      id,
      doctorInfo,
      patientInfo,
      date,
      status,
      reason,
      notes,
      createdAt,
      updatedAt,
    );
  }

  // Getters
  getId(): AppointmentId {
    return this.id;
  }

  getDoctorInfo(): DoctorInfoDto {
    return this.doctorInfo;
  }

  getPatientInfo(): PatientInfoDto {
    return this.patientInfo;
  }

  getDate(): Date {
    return this.date;
  }

  getStatus(): AppointmentStatus {
    return this.status;
  }

  getReason(): string {
    return this.reason;
  }

  getNotes(): string | null {
    return this.notes;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business rules
  confirm(): Appointment {
    if (this.status !== AppointmentStatus.SCHEDULED) {
      throw new Error('Only scheduled appointments can be confirmed');
    }

    return Appointment.reconstruct(
      this.id,
      this.doctorInfo,
      this.patientInfo,
      this.date,
      AppointmentStatus.CONFIRMED,
      this.reason,
      this.notes,
      this.createdAt,
      new Date(),
    );
  }

  cancel(): Appointment {
    if (this.status === AppointmentStatus.CANCELLED) {
      throw new Error('Appointment is already cancelled');
    }

    if (this.status === AppointmentStatus.COMPLETED) {
      throw new Error('Cannot cancel a completed appointment');
    }

    return Appointment.reconstruct(
      this.id,
      this.doctorInfo,
      this.patientInfo,
      this.date,
      AppointmentStatus.CANCELLED,
      this.reason,
      this.notes,
      this.createdAt,
      new Date(),
    );
  }

  complete(): Appointment {
    if (this.status !== AppointmentStatus.CONFIRMED) {
      throw new Error('Only confirmed appointments can be completed');
    }

    return Appointment.reconstruct(
      this.id,
      this.doctorInfo,
      this.patientInfo,
      this.date,
      AppointmentStatus.COMPLETED,
      this.reason,
      this.notes,
      this.createdAt,
      new Date(),
    );
  }

  update(date?: Date, reason?: string, notes?: string | null): Appointment {
    if (this.status !== AppointmentStatus.SCHEDULED) {
      throw new Error('Only scheduled appointments can be updated');
    }

    return Appointment.reconstruct(
      this.id,
      this.doctorInfo,
      this.patientInfo,
      date ?? this.date,
      this.status,
      reason ?? this.reason,
      notes ?? this.notes,
      this.createdAt,
      new Date(),
    );
  }

  isScheduled(): boolean {
    return this.status === AppointmentStatus.SCHEDULED;
  }

  isConfirmed(): boolean {
    return this.status === AppointmentStatus.CONFIRMED;
  }

  isCancelled(): boolean {
    return this.status === AppointmentStatus.CANCELLED;
  }

  isCompleted(): boolean {
    return this.status === AppointmentStatus.COMPLETED;
  }

  isInThePast(): boolean {
    return this.date < new Date();
  }

  isInTheFuture(): boolean {
    return this.date > new Date();
  }
}
