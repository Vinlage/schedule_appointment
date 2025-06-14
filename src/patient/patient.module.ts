import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientController } from './infra/entrypoint/web/patient.controller';
import { CreatePatientUseCase } from './application/use-cases/create-patient.use-case';
import { TypeOrmPatientRepository } from './infra/database/typeorm/repositories/patient.repository';
import { PatientTypeOrmEntity } from './infra/database/typeorm/entities/patient.entity';
import { PATIENT_REPOSITORY } from './domain/repositories/tokens';

@Module({
  imports: [TypeOrmModule.forFeature([PatientTypeOrmEntity])],
  controllers: [PatientController],
  providers: [
    CreatePatientUseCase,
    {
      provide: PATIENT_REPOSITORY,
      useClass: TypeOrmPatientRepository,
    },
  ],
})
export class PatientModule {} 