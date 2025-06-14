import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePatientUseCase } from './update-patient.use-case';
import { PatientRepositoryMock } from '../../test/mocks/patient-repository.mock';
import { PATIENT_REPOSITORY } from '../../domain/repositories/tokens';
import { Patient } from '../../domain/entities/patient.entity';
import { PatientNotFoundError, EmailAlreadyInUseError } from '../../domain/errors/patient-errors';
import { UpdatePatientDTO } from '../dtos/update-patient.dto';

describe('UpdatePatientUseCase', () => {
  let useCase: UpdatePatientUseCase;
  let repository: PatientRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePatientUseCase,
        {
          provide: PATIENT_REPOSITORY,
          useClass: PatientRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<UpdatePatientUseCase>(UpdatePatientUseCase);
    repository = module.get<PatientRepositoryMock>(PATIENT_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw PatientNotFoundError when patient does not exist', async () => {
    const updateData: UpdatePatientDTO = {
      name: 'John Updated',
      phone: '9876543210',
    };

    await expect(useCase.execute('non-existent-id', updateData)).rejects.toThrow(PatientNotFoundError);
  });

  it('should update patient', async () => {
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

    const updateData: UpdatePatientDTO = {
      name: 'John Updated',
      phone: '9876543210',
    };

    const updatedPatient = await useCase.execute('1', updateData);

    expect(updatedPatient).toBeDefined();
    expect(updatedPatient.getId()).toBe('1');
    expect(updatedPatient.getName()).toBe('John Updated');
    expect(updatedPatient.getPhone()).toBe('9876543210');
    expect(updatedPatient.getEmail()).toBe('john@example.com'); // email não foi atualizado

    const foundPatient = await repository.findById('1');
    expect(foundPatient).toBeDefined();
    expect(foundPatient?.getName()).toBe('John Updated');
    expect(foundPatient?.getPhone()).toBe('9876543210');
  });

  it('should throw EmailAlreadyInUseError when email is already in use', async () => {
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

    const updateData: UpdatePatientDTO = {
      email: 'jane@example.com',
    };

    await expect(useCase.execute('1', updateData)).rejects.toThrow(EmailAlreadyInUseError);
  });
}); 