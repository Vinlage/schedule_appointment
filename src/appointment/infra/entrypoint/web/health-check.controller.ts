import { Controller, Get } from '@nestjs/common';

@Controller('appointments/health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      module: 'appointments',
      timestamp: new Date().toISOString(),
    };
  }
}
