import { Test, TestingModule } from '@nestjs/testing';
import { ListPatientsUseCase } from './list-patients.use-case';
import { PatientRepositoryMock } from '../../test/mocks/patient-repository.mock';
import { PATIENT_REPOSITORY } from '../../domain/repositories/tokens';
import { Patient } from '../../domain/entities/patient.entity';

describe('ListPatientsUseCase', () => {
  let useCase: ListPatientsUseCase;
  let repository: PatientRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListPatientsUseCase,
        {
          provide: PATIENT_REPOSITORY,
          useClass: PatientRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<ListPatientsUseCase>(ListPatientsUseCase);
    repository = module.get<PatientRepositoryMock>(PATIENT_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return an empty array when no patients exist', async () => {
    const patients = await useCase.execute();
    expect(patients).toEqual([]);
  });

  it('should return all patients', async () => {
    const now = new Date();
    const patient1 = Patient.reconstruct(
      '1',
      'John Doe',
      'john@example.com',
      '1234567890',
      new Date('1990-01-01'),
      now,
      now,
    );

    const patient2 = Patient.reconstruct(
      '2',
      'Jane Doe',
      'jane@example.com',
      '0987654321',
      new Date('1992-01-01'),
      now,
      now,
    );

    await repository.create(patient1);
    await repository.create(patient2);

    const patients = await useCase.execute();

    expect(patients).toHaveLength(2);
    expect(patients[0].getName()).toBe('John Doe');
    expect(patients[1].getName()).toBe('Jane Doe');
  });
});
