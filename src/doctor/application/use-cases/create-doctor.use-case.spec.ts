import { Test, TestingModule } from '@nestjs/testing';
import { CreateDoctorUseCase } from './create-doctor.use-case';
import { DoctorRepositoryMock } from '../../test/mocks/doctor-repository.mock';
import { Doctor } from '../../domain/entities/doctor.entity';
import { ConflictException } from '@nestjs/common';

describe('CreateDoctorUseCase', () => {
  let useCase: CreateDoctorUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDoctorUseCase,
        {
          provide: 'DOCTOR_REPOSITORY',
          useClass: DoctorRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<CreateDoctorUseCase>(CreateDoctorUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create a new doctor', async () => {
    const doctorData = {
      name: 'Dr. John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      specialty: 'Cardiology',
      crm: '12345',
    };

    const doctor = await useCase.execute(doctorData);

    expect(doctor).toBeInstanceOf(Doctor);
    expect(doctor.getName()).toBe(doctorData.name);
    expect(doctor.getEmail()).toBe(doctorData.email);
    expect(doctor.getPhone()).toBe(doctorData.phone);
    expect(doctor.getSpecialty()).toBe(doctorData.specialty);
    expect(doctor.getCrm()).toBe(doctorData.crm);
  });

  it('should throw ConflictException if email already exists', async () => {
    const doctorData = {
      name: 'Dr. John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      specialty: 'Cardiology',
      crm: '12345',
    };

    await useCase.execute(doctorData);

    await expect(useCase.execute(doctorData)).rejects.toThrow(
      ConflictException,
    );
  });
});
