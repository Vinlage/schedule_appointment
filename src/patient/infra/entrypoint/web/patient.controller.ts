import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreatePatientUseCase } from '../../../application/use-cases/create-patient.use-case';
import { ListPatientsUseCase } from '../../../application/use-cases/list-patients.use-case';
import { GetPatientByIdUseCase } from '../../../application/use-cases/get-patient-by-id.use-case';
import { UpdatePatientUseCase } from '../../../application/use-cases/update-patient.use-case';
import { DeletePatientUseCase } from '../../../application/use-cases/delete-patient.use-case';
import { CreatePatientDTO } from '../../../application/dtos/create-patient.dto';
import { UpdatePatientDTO } from '../../../application/dtos/update-patient.dto';

@Controller('patients')
export class PatientController {
  constructor(
    private readonly createPatientUseCase: CreatePatientUseCase,
    private readonly listPatientsUseCase: ListPatientsUseCase,
    private readonly getPatientByIdUseCase: GetPatientByIdUseCase,
    private readonly updatePatientUseCase: UpdatePatientUseCase,
    private readonly deletePatientUseCase: DeletePatientUseCase,
  ) {}

  @Post()
  async create(@Body() data: CreatePatientDTO) {
    const patient = await this.createPatientUseCase.execute(data);
    return {
      id: patient.getId(),
      name: patient.getName(),
      email: patient.getEmail(),
      phone: patient.getPhone(),
      birthDate: patient.getBirthDate(),
      isAdult: patient.isAdult(),
    };
  }

  @Get()
  async list() {
    const patients = await this.listPatientsUseCase.execute();
    return patients.map(patient => ({
      id: patient.getId(),
      name: patient.getName(),
      email: patient.getEmail(),
      phone: patient.getPhone(),
      birthDate: patient.getBirthDate(),
      isAdult: patient.isAdult(),
    }));
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const patient = await this.getPatientByIdUseCase.execute(id);
    return {
      id: patient.getId(),
      name: patient.getName(),
      email: patient.getEmail(),
      phone: patient.getPhone(),
      birthDate: patient.getBirthDate(),
      isAdult: patient.isAdult(),
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdatePatientDTO) {
    const patient = await this.updatePatientUseCase.execute(id, data);
    return {
      id: patient.getId(),
      name: patient.getName(),
      email: patient.getEmail(),
      phone: patient.getPhone(),
      birthDate: patient.getBirthDate(),
      isAdult: patient.isAdult(),
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.deletePatientUseCase.execute(id);
    return { message: 'Patient deleted successfully' };
  }
} 