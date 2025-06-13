import { Module } from '@nestjs/common';
import { PatientController } from './infra/entrypoint/web/patient.controller';
import { CreatePatientUseCase } from './application/use-cases/create-patient.use-case';

@Module({
  controllers: [PatientController],
  providers: [CreatePatientUseCase],
})
export class PatientModule {} 