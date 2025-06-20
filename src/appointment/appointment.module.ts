import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentController } from './infra/entrypoint/web/appointment.controller';
import { CreateAppointmentUseCase } from './application/use-cases/create-appointment.use-case';
import { ListAppointmentsUseCase } from './application/use-cases/list-appointments.use-case';
import { GetAppointmentByIdUseCase } from './application/use-cases/get-appointment-by-id.use-case';
import { UpdateAppointmentUseCase } from './application/use-cases/update-appointment.use-case';
import { ConfirmAppointmentUseCase } from './application/use-cases/confirm-appointment.use-case';
import { CancelAppointmentUseCase } from './application/use-cases/cancel-appointment.use-case';
import { CompleteAppointmentUseCase } from './application/use-cases/complete-appointment.use-case';
import { TypeOrmAppointmentRepository } from './infra/database/typeorm/repositories/appointment.repository';
import { AppointmentTypeOrmEntity } from './infra/database/typeorm/entities/appointment.entity';
import { APPOINTMENT_REPOSITORY } from './domain/repositories/tokens';
import { CommunicationModule } from '../shared/infra/communication/communication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentTypeOrmEntity]),
    CommunicationModule,
  ],
  controllers: [AppointmentController],
  providers: [
    CreateAppointmentUseCase,
    ListAppointmentsUseCase,
    GetAppointmentByIdUseCase,
    UpdateAppointmentUseCase,
    ConfirmAppointmentUseCase,
    CancelAppointmentUseCase,
    CompleteAppointmentUseCase,
    {
      provide: APPOINTMENT_REPOSITORY,
      useClass: TypeOrmAppointmentRepository,
    },
  ],
})
export class AppointmentModule {}
