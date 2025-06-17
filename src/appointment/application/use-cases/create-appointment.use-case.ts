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
import { DoctorServiceInterface } from '../../domain/services/doctor-service.interface';
import { PatientServiceInterface } from '../../domain/services/patient-service.interface';
import { DOCTOR_SERVICE } from '../../domain/services/tokens';
import { PATIENT_SERVICE } from '../../domain/services/tokens';

@Injectable()
export class CreateAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: AppointmentRepository,
    @Inject(DOCTOR_SERVICE)
    private readonly doctorService: DoctorServiceInterface,
    @Inject(PATIENT_SERVICE)
    private readonly patientService: PatientServiceInterface,
  ) {}

  async execute(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const doctorInfo = await this.doctorService.findById(
      createAppointmentDto.doctorId,
    );
    if (!doctorInfo) {
      throw new NotFoundException(
        `Doctor with ID ${createAppointmentDto.doctorId} not found`,
      );
    }

    if (!doctorInfo.active) {
      throw new BadRequestException(
        'Cannot schedule appointment with inactive doctor',
      );
    }

    const patientInfo = await this.patientService.findById(
      createAppointmentDto.patientId,
    );
    if (!patientInfo) {
      throw new NotFoundException(
        `Patient with ID ${createAppointmentDto.patientId} not found`,
      );
    }

    // Check if doctor is available at the requested time
    const doctorAppointments = await this.appointmentRepository.findByDoctorId(
      createAppointmentDto.doctorId,
    );
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
      await this.appointmentRepository.findByPatientId(
        createAppointmentDto.patientId,
      );
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
      doctorInfo,
      patientInfo,
      createAppointmentDto.date,
      createAppointmentDto.reason,
      createAppointmentDto.notes,
    );

    return this.appointmentRepository.create(appointment);
  }
}
