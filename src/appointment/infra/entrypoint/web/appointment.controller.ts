import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateAppointmentUseCase } from '../../../application/use-cases/create-appointment.use-case';
import { ListAppointmentsUseCase } from '../../../application/use-cases/list-appointments.use-case';
import { GetAppointmentByIdUseCase } from '../../../application/use-cases/get-appointment-by-id.use-case';
import { UpdateAppointmentUseCase } from '../../../application/use-cases/update-appointment.use-case';
import { CancelAppointmentUseCase } from '../../../application/use-cases/cancel-appointment.use-case';
import { ConfirmAppointmentUseCase } from '../../../application/use-cases/confirm-appointment.use-case';
import { CompleteAppointmentUseCase } from '../../../application/use-cases/complete-appointment.use-case';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(
    private readonly createAppointmentUseCase: CreateAppointmentUseCase,
    private readonly listAppointmentsUseCase: ListAppointmentsUseCase,
    private readonly getAppointmentByIdUseCase: GetAppointmentByIdUseCase,
    private readonly updateAppointmentUseCase: UpdateAppointmentUseCase,
    private readonly cancelAppointmentUseCase: CancelAppointmentUseCase,
    private readonly confirmAppointmentUseCase: ConfirmAppointmentUseCase,
    private readonly completeAppointmentUseCase: CompleteAppointmentUseCase,
  ) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.createAppointmentUseCase.execute(createAppointmentDto);
  }

  @Get()
  findAll() {
    return this.listAppointmentsUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getAppointmentByIdUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.updateAppointmentUseCase.execute(id, updateAppointmentDto);
  }

  @Post(':id/cancel')
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.cancelAppointmentUseCase.execute(id);
  }

  @Post(':id/confirm')
  confirm(@Param('id', ParseUUIDPipe) id: string) {
    return this.confirmAppointmentUseCase.execute(id);
  }

  @Post(':id/complete')
  complete(@Param('id', ParseUUIDPipe) id: string) {
    return this.completeAppointmentUseCase.execute(id);
  }
}
