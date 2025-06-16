import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PatientTypeOrmEntity } from '../src/patient/infra/database/typeorm/entities/patient.entity';

export const testDatabaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'schedule_appointment_test',
  entities: [PatientTypeOrmEntity],
  synchronize: true,
  dropSchema: true, // Isso garante que o banco de dados seja limpo antes de cada teste
};
