import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../domain/repositories/appointment.repository';
import { APPOINTMENT_REPOSITORY } from '../../domain/repositories/tokens';
import { CreateAppointmentDto } from '../../infra/entrypoint/web/dtos/create-appointment.dto';
import { DoctorRepository } from '../../../doctor/domain/repositories/doctor.repository';
import { PatientRepository } from '../../../patient/domain/repositories/patient.repository';
import { DOCTOR_REPOSITORY } from '../../../doctor/domain/repositories/tokens';
import { PATIENT_REPOSITORY } from '../../../patient/domain/repositories/tokens';

@Injectable()
export class CreateAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: AppointmentRepository,
    @Inject(DOCTOR_REPOSITORY)
    private readonly doctorRepository: DoctorRepository,
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: PatientRepository,
  ) {}

  async execute(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const doctor = await this.doctorRepository.findById(
      createAppointmentDto.doctorId,
    );
    if (!doctor) {
      throw new NotFoundException(
        `Doctor with ID ${createAppointmentDto.doctorId} not found`,
      );
    }

    if (!doctor.isActive()) {
      throw new BadRequestException(
        'Cannot schedule appointment with inactive doctor',
      );
    }

    const patient = await this.patientRepository.findById(
      createAppointmentDto.patientId,
    );
    if (!patient) {
      throw new NotFoundException(
        `Patient with ID ${createAppointmentDto.patientId} not found`,
      );
    }

    // Check if doctor is available at the requested time
    const doctorAppointments =
      await this.appointmentRepository.findByDoctor(doctor);
    const hasConflict = doctorAppointments.some(
      (appointment) =>
        appointment.getDate().getTime() ===
          createAppointmentDto.date.getTime() && !appointment.isCancelled(),
    );

    if (hasConflict) {
      throw new BadRequestException(
        'Doctor is not available at the requested time',
      );
    }

    // Check if patient already has an appointment at the requested time
    const patientAppointments =
      await this.appointmentRepository.findByPatient(patient);
    const hasPatientConflict = patientAppointments.some(
      (appointment) =>
        appointment.getDate().getTime() ===
          createAppointmentDto.date.getTime() && !appointment.isCancelled(),
    );

    if (hasPatientConflict) {
      throw new BadRequestException(
        'Patient already has an appointment at the requested time',
      );
    }

    const appointment = Appointment.create(
      doctor,
      patient,
      createAppointmentDto.date,
      createAppointmentDto.reason,
      createAppointmentDto.notes,
    );

    return this.appointmentRepository.create(appointment);
  }
}
