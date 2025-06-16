import { Test, TestingModule } from '@nestjs/testing';
import { DeleteDoctorUseCase } from './delete-doctor.use-case';
import { DoctorRepositoryMock } from '../../test/mocks/doctor-repository.mock';
import { Doctor } from '../../domain/entities/doctor.entity';
import { NotFoundException } from '@nestjs/common';

describe('DeleteDoctorUseCase', () => {
  let useCase: DeleteDoctorUseCase;
  let repository: DoctorRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteDoctorUseCase,
        {
          provide: 'DOCTOR_REPOSITORY',
          useClass: DoctorRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<DeleteDoctorUseCase>(DeleteDoctorUseCase);
    repository = module.get<DoctorRepositoryMock>('DOCTOR_REPOSITORY');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should delete a doctor', async () => {
    const doctor = Doctor.create(
      'Dr. John Doe',
      'john.doe@example.com',
      '1234567890',
      'Cardiology',
      '12345',
    );

    await repository.create(doctor);
    await useCase.execute(doctor.getId());

    const doctors = await repository.findAll();
    expect(doctors).toHaveLength(0);
  });

  it('should throw NotFoundException when doctor is not found', async () => {
    await expect(useCase.execute('non-existent-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
