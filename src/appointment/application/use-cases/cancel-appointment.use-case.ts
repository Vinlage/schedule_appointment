import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../domain/repositories/appointment.repository';
import { APPOINTMENT_REPOSITORY } from '../../domain/repositories/tokens';
import { AppointmentId } from '../../domain/value-objects/appointment-id.value-object';

@Injectable()
export class CancelAppointmentUseCase {
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

    if (appointment.isCancelled()) {
      throw new BadRequestException('Appointment is already cancelled');
    }

    if (appointment.isCompleted()) {
      throw new BadRequestException('Cannot cancel a completed appointment');
    }

    if (appointment.isInThePast()) {
      throw new BadRequestException('Cannot cancel past appointments');
    }

    const cancelledAppointment = appointment.cancel();
    return this.appointmentRepository.update(cancelledAppointment);
  }
}
