import { Test, TestingModule } from '@nestjs/testing';
import { CreatePatientUseCase } from './create-patient.use-case';
import { PatientRepositoryMock } from '../../test/mocks/patient-repository.mock';
import { PATIENT_REPOSITORY } from '../../domain/repositories/tokens';
import { EmailAlreadyInUseError } from '../../domain/errors/patient-errors';
import { CreatePatientDTO } from '../dtos/create-patient.dto';

describe('CreatePatientUseCase', () => {
  let useCase: CreatePatientUseCase;
  let repository: PatientRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePatientUseCase,
        {
          provide: PATIENT_REPOSITORY,
          useClass: PatientRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<CreatePatientUseCase>(CreatePatientUseCase);
    repository = module.get<PatientRepositoryMock>(PATIENT_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create a new patient', async () => {
    const patientData: CreatePatientDTO = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      birthDate: new Date('1990-01-01'),
    };

    const patient = await useCase.execute(patientData);

    expect(patient).toBeDefined();
    expect(patient.getName()).toBe(patientData.name);
    expect(patient.getEmail()).toBe(patientData.email);
    expect(patient.getPhone()).toBe(patientData.phone);
    expect(patient.getBirthDate()).toEqual(patientData.birthDate);
    expect(patient.isAdult()).toBe(true);

    const foundPatient = await repository.findByEmail(patientData.email);
    expect(foundPatient).toBeDefined();
    expect(foundPatient?.getName()).toBe(patientData.name);
  });

  it('should throw EmailAlreadyInUseError when email is already in use', async () => {
    const patientData: CreatePatientDTO = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      birthDate: new Date('1990-01-01'),
    };

    await useCase.execute(patientData);

    await expect(useCase.execute(patientData)).rejects.toThrow(
      EmailAlreadyInUseError,
    );
  });
});
