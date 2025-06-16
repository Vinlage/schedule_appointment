import { Test, TestingModule } from '@nestjs/testing';
import { GetDoctorByIdUseCase } from './get-doctor-by-id.use-case';
import { DoctorRepositoryMock } from '../../test/mocks/doctor-repository.mock';
import { Doctor } from '../../domain/entities/doctor.entity';
import { NotFoundException } from '@nestjs/common';

describe('GetDoctorByIdUseCase', () => {
  let useCase: GetDoctorByIdUseCase;
  let repository: DoctorRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDoctorByIdUseCase,
        {
          provide: 'DOCTOR_REPOSITORY',
          useClass: DoctorRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<GetDoctorByIdUseCase>(GetDoctorByIdUseCase);
    repository = module.get<DoctorRepositoryMock>('DOCTOR_REPOSITORY');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return a doctor by id', async () => {
    const doctor = Doctor.create(
      'Dr. John Doe',
      'john.doe@example.com',
      '1234567890',
      'Cardiology',
      '12345',
    );

    await repository.create(doctor);
    const foundDoctor = await useCase.execute(doctor.getId());

    expect(foundDoctor).toBeInstanceOf(Doctor);
    expect(foundDoctor.getId()).toBe(doctor.getId());
    expect(foundDoctor.getName()).toBe(doctor.getName());
    expect(foundDoctor.getEmail()).toBe(doctor.getEmail());
    expect(foundDoctor.getPhone()).toBe(doctor.getPhone());
    expect(foundDoctor.getSpecialty()).toBe(doctor.getSpecialty());
    expect(foundDoctor.getCrm()).toBe(doctor.getCrm());
  });

  it('should throw NotFoundException when doctor is not found', async () => {
    await expect(useCase.execute('non-existent-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
