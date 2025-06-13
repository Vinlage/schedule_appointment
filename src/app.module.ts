import { Module } from '@nestjs/common';
import { AppointmentModule } from './appointment/appointment.module';
import { PatientModule } from './patient/patient.module';

@Module({
  imports: [AppointmentModule, PatientModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
