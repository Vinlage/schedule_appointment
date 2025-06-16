import { Test, TestingModule } from '@nestjs/testing';
import { FindDoctorsBySpecialtyUseCase } from './find-doctors-by-specialty.use-case';
import { DoctorRepositoryMock } from '../../test/mocks/doctor-repository.mock';
import { Doctor } from '../../domain/entities/doctor.entity';

describe('FindDoctorsBySpecialtyUseCase', () => {
  let useCase: FindDoctorsBySpecialtyUseCase;
  let repository: DoctorRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindDoctorsBySpecialtyUseCase,
        {
          provide: 'DOCTOR_REPOSITORY',
          useClass: DoctorRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<FindDoctorsBySpecialtyUseCase>(FindDoctorsBySpecialtyUseCase);
    repository = module.get<DoctorRepositoryMock>('DOCTOR_REPOSITORY');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return doctors by specialty', async () => {
    const cardiologist1 = Doctor.create(
      'Dr. John Doe',
      'john.doe@example.com',
      '1234567890',
      'Cardiology',
      '12345',
    );

    const cardiologist2 = Doctor.create(
      'Dr. Jane Smith',
      'jane.smith@example.com',
      '0987654321',
      'Cardiology',
      '54321',
    );

    const neurologist = Doctor.create(
      'Dr. Bob Wilson',
      'bob.wilson@example.com',
      '5555555555',
      'Neurology',
      '67890',
    );

    await repository.create(cardiologist1);
    await repository.create(cardiologist2);
    await repository.create(neurologist);

    const cardiologists = await useCase.execute('Cardiology');

    expect(cardiologists).toHaveLength(2);
    expect(cardiologists[0]).toBeInstanceOf(Doctor);
    expect(cardiologists[1]).toBeInstanceOf(Doctor);
    expect(cardiologists[0].getSpecialty()).toBe('Cardiology');
    expect(cardiologists[1].getSpecialty()).toBe('Cardiology');
  });

  it('should return empty array when no doctors found for specialty', async () => {
    const doctors = await useCase.execute('NonExistentSpecialty');
    expect(doctors).toEqual([]);
  });
}); 