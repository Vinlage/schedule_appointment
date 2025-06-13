import { Module } from '@nestjs/common';
import { HealthController } from './infra/entrypoint/web/health-check.controller';

@Module({
  controllers: [HealthController],
  providers: [],
})
export class AppointmentModule {}