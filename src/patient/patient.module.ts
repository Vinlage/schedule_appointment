import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientController } from './infra/entrypoint/web/patient.controller';
import { CreatePatientUseCase } from './application/use-cases/create-patient.use-case';
import { ListPatientsUseCase } from './application/use-cases/list-patients.use-case';
import { GetPatientByIdUseCase } from './application/use-cases/get-patient-by-id.use-case';
import { UpdatePatientUseCase } from './application/use-cases/update-patient.use-case';
import { DeletePatientUseCase } from './application/use-cases/delete-patient.use-case';
import { TypeOrmPatientRepository } from './infra/database/typeorm/repositories/patient.repository';
import { PatientTypeOrmEntity } from './infra/database/typeorm/entities/patient.entity';
import { PATIENT_REPOSITORY } from './domain/repositories/tokens';

@Module({
  imports: [TypeOrmModule.forFeature([PatientTypeOrmEntity])],
  controllers: [PatientController],
  providers: [
    CreatePatientUseCase,
    ListPatientsUseCase,
    GetPatientByIdUseCase,
    UpdatePatientUseCase,
    DeletePatientUseCase,
    {
      provide: PATIENT_REPOSITORY,
      useClass: TypeOrmPatientRepository,
    },
  ],
  exports: [PATIENT_REPOSITORY],
})
export class PatientModule {}
