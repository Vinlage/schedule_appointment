import { Test, TestingModule } from '@nestjs/testing';
import { ListDoctorsUseCase } from './list-doctors.use-case';
import { DoctorRepositoryMock } from '../../test/mocks/doctor-repository.mock';
import { Doctor } from '../../domain/entities/doctor.entity';

describe('ListDoctorsUseCase', () => {
  let useCase: ListDoctorsUseCase;
  let repository: DoctorRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListDoctorsUseCase,
        {
          provide: 'DOCTOR_REPOSITORY',
          useClass: DoctorRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<ListDoctorsUseCase>(ListDoctorsUseCase);
    repository = module.get<DoctorRepositoryMock>('DOCTOR_REPOSITORY');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return an empty array when no doctors exist', async () => {
    const doctors = await useCase.execute();
    expect(doctors).toEqual([]);
  });

  it('should return all doctors', async () => {
    const doctor1 = Doctor.create(
      'Dr. John Doe',
      'john.doe@example.com',
      '1234567890',
      'Cardiology',
      '12345',
    );

    const doctor2 = Doctor.create(
      'Dr. Jane Smith',
      'jane.smith@example.com',
      '0987654321',
      'Neurology',
      '54321',
    );

    await repository.create(doctor1);
    await repository.create(doctor2);

    const doctors = await useCase.execute();

    expect(doctors).toHaveLength(2);
    expect(doctors[0]).toBeInstanceOf(Doctor);
    expect(doctors[1]).toBeInstanceOf(Doctor);
    expect(doctors[0].getName()).toBe(doctor1.getName());
    expect(doctors[1].getName()).toBe(doctor2.getName());
  });
}); 