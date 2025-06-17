import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorController } from './infra/entrypoint/web/doctor.controller';
import { CreateDoctorUseCase } from './application/use-cases/create-doctor.use-case';
import { ListDoctorsUseCase } from './application/use-cases/list-doctors.use-case';
import { GetDoctorByIdUseCase } from './application/use-cases/get-doctor-by-id.use-case';
import { UpdateDoctorUseCase } from './application/use-cases/update-doctor.use-case';
import { DeleteDoctorUseCase } from './application/use-cases/delete-doctor.use-case';
import { TypeOrmDoctorRepository } from './infra/database/typeorm/repositories/doctor.repository';
import { DoctorTypeOrmEntity } from './infra/database/typeorm/entities/doctor.entity';
import { DOCTOR_REPOSITORY } from './domain/repositories/tokens';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorTypeOrmEntity])],
  controllers: [DoctorController],
  providers: [
    CreateDoctorUseCase,
    ListDoctorsUseCase,
    GetDoctorByIdUseCase,
    UpdateDoctorUseCase,
    DeleteDoctorUseCase,
    {
      provide: DOCTOR_REPOSITORY,
      useClass: TypeOrmDoctorRepository,
    },
  ],
  exports: [DOCTOR_REPOSITORY],
})
export class DoctorModule {}
