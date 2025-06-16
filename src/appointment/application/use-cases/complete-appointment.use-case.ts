import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../domain/repositories/appointment.repository';
import { APPOINTMENT_REPOSITORY } from '../../domain/repositories/tokens';

@Injectable()
export class CompleteAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    if (!appointment.isConfirmed()) {
      throw new BadRequestException(
        'Only confirmed appointments can be completed',
      );
    }

    const completedAppointment = appointment.complete();
    return this.appointmentRepository.update(completedAppointment);
  }
}
