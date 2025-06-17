import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../domain/repositories/appointment.repository';
import { APPOINTMENT_REPOSITORY } from '../../domain/repositories/tokens';
import { AppointmentId } from '../../domain/value-objects/appointment-id.value-object';

@Injectable()
export class GetAppointmentByIdUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(id: string): Promise<Appointment> {
    const appointmentId = AppointmentId.fromString(id);
    const appointment =
      await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }
}
