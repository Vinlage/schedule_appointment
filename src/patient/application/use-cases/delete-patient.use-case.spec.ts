import { Test, TestingModule } from '@nestjs/testing';
import { DeletePatientUseCase } from './delete-patient.use-case';
import { PatientRepositoryMock } from '../../test/mocks/patient-repository.mock';
import { PATIENT_REPOSITORY } from '../../domain/repositories/tokens';
import { Patient } from '../../domain/entities/patient.entity';
import { PatientNotFoundError } from '../../domain/errors/patient-errors';

describe('DeletePatientUseCase', () => {
  let useCase: DeletePatientUseCase;
  let repository: PatientRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeletePatientUseCase,
        {
          provide: PATIENT_REPOSITORY,
          useClass: PatientRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<DeletePatientUseCase>(DeletePatientUseCase);
    repository = module.get<PatientRepositoryMock>(PATIENT_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw PatientNotFoundError when patient does not exist', async () => {
    await expect(useCase.execute('non-existent-id')).rejects.toThrow(
      PatientNotFoundError,
    );
  });

  it('should delete patient', async () => {
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

    await expect(useCase.execute('1')).resolves.not.toThrow();

    const foundPatient = await repository.findById('1');
    expect(foundPatient).toBeNull();
  });
});
