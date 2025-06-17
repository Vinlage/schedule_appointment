import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorTypeOrmEntity } from '../../../doctor/infra/database/typeorm/entities/doctor.entity';
import { PatientTypeOrmEntity } from '../../../patient/infra/database/typeorm/entities/patient.entity';
import { TypeOrmDoctorRepository } from '../../../doctor/infra/database/typeorm/repositories/doctor.repository';
import { TypeOrmPatientRepository } from '../../../patient/infra/database/typeorm/repositories/patient.repository';
import { DOCTOR_REPOSITORY } from '../../../doctor/domain/repositories/tokens';
import { PATIENT_REPOSITORY } from '../../../patient/domain/repositories/tokens';
import { DoctorService } from '../../../appointment/infra/services/doctor.service';
import { PatientService } from '../../../appointment/infra/services/patient.service';
import { DOCTOR_SERVICE } from '../../../appointment/domain/services/tokens';
import { PATIENT_SERVICE } from '../../../appointment/domain/services/tokens';

@Module({
  imports: [
    TypeOrmModule.forFeature([DoctorTypeOrmEntity, PatientTypeOrmEntity]),
  ],
  providers: [
    {
      provide: DOCTOR_REPOSITORY,
      useClass: TypeOrmDoctorRepository,
    },
    {
      provide: PATIENT_REPOSITORY,
      useClass: TypeOrmPatientRepository,
    },
    {
      provide: DOCTOR_SERVICE,
      useClass: DoctorService,
    },
    {
      provide: PATIENT_SERVICE,
      useClass: PatientService,
    },
  ],
  exports: [DOCTOR_SERVICE, PATIENT_SERVICE],
})
export class CommunicationModule {}
