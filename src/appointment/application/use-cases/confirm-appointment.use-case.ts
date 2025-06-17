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
export class ConfirmAppointmentUseCase {
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

    if (!appointment.isScheduled()) {
      throw new BadRequestException(
        'Only scheduled appointments can be confirmed',
      );
    }

    if (appointment.isInThePast()) {
      throw new BadRequestException('Cannot confirm past appointments');
    }

    const confirmedAppointment = appointment.confirm();
    return this.appointmentRepository.update(confirmedAppointment);
  }
}
