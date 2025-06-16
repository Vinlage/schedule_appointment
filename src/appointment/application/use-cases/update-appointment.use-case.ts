import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../domain/repositories/appointment.repository';
import { APPOINTMENT_REPOSITORY } from '../../domain/repositories/tokens';
import { UpdateAppointmentDto } from '../../infra/entrypoint/web/dtos/update-appointment.dto';

@Injectable()
export class UpdateAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    if (!appointment.isScheduled()) {
      throw new BadRequestException(
        'Only scheduled appointments can be updated',
      );
    }

    if (appointment.isInThePast()) {
      throw new BadRequestException('Cannot update past appointments');
    }

    const updatedAppointment = appointment.update(
      updateAppointmentDto.date,
      updateAppointmentDto.reason,
      updateAppointmentDto.notes,
    );

    return this.appointmentRepository.update(updatedAppointment);
  }
}
