import { Test, TestingModule } from '@nestjs/testing';
import { GetPatientByIdUseCase } from './get-patient-by-id.use-case';
import { PatientRepositoryMock } from '../../test/mocks/patient-repository.mock';
import { PATIENT_REPOSITORY } from '../../domain/repositories/tokens';
import { Patient } from '../../domain/entities/patient.entity';
import { PatientNotFoundError } from '../../domain/errors/patient-errors';

describe('GetPatientByIdUseCase', () => {
  let useCase: GetPatientByIdUseCase;
  let repository: PatientRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPatientByIdUseCase,
        {
          provide: PATIENT_REPOSITORY,
          useClass: PatientRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<GetPatientByIdUseCase>(GetPatientByIdUseCase);
    repository = module.get<PatientRepositoryMock>(PATIENT_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw PatientNotFoundError when patient does not exist', async () => {
    await expect(useCase.execute('non-existent-id')).rejects.toThrow(PatientNotFoundError);
  });

  it('should return patient by id', async () => {
    const now = new Date();
    const patient = Patient.reconstruct(
      '1',
      'John Doe',
      'john@example.com',
      '1234567890',
      new Date('1990-01-01'),
      now,
      now,
    );

    await repository.create(patient);

    const foundPatient = await useCase.execute('1');

    expect(foundPatient).toBeDefined();
    expect(foundPatient.getId()).toBe('1');
    expect(foundPatient.getName()).toBe('John Doe');
    expect(foundPatient.getEmail()).toBe('john@example.com');
    expect(foundPatient.getPhone()).toBe('1234567890');
    expect(foundPatient.getBirthDate()).toEqual(new Date('1990-01-01'));
  });
}); 