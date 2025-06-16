import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateDoctorUseCase } from '../../../application/use-cases/create-doctor.use-case';
import { ListDoctorsUseCase } from '../../../application/use-cases/list-doctors.use-case';
import { GetDoctorByIdUseCase } from '../../../application/use-cases/get-doctor-by-id.use-case';
import { UpdateDoctorUseCase } from '../../../application/use-cases/update-doctor.use-case';
import { DeleteDoctorUseCase } from '../../../application/use-cases/delete-doctor.use-case';
import { CreateDoctorDto } from './dtos/create-doctor.dto';
import { UpdateDoctorDto } from './dtos/update-doctor.dto';

@Controller('doctors')
export class DoctorController {
  constructor(
    private readonly createDoctorUseCase: CreateDoctorUseCase,
    private readonly listDoctorsUseCase: ListDoctorsUseCase,
    private readonly getDoctorByIdUseCase: GetDoctorByIdUseCase,
    private readonly updateDoctorUseCase: UpdateDoctorUseCase,
    private readonly deleteDoctorUseCase: DeleteDoctorUseCase,
  ) {}

  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.createDoctorUseCase.execute(createDoctorDto);
  }

  @Get()
  findAll() {
    return this.listDoctorsUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getDoctorByIdUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.updateDoctorUseCase.execute(id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteDoctorUseCase.execute(id);
  }
} 