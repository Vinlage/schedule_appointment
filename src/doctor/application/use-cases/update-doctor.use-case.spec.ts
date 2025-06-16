import { Test, TestingModule } from '@nestjs/testing';
import { UpdateDoctorUseCase } from './update-doctor.use-case';
import { DoctorRepositoryMock } from '../../test/mocks/doctor-repository.mock';
import { Doctor } from '../../domain/entities/doctor.entity';
import { NotFoundException } from '@nestjs/common';

describe('UpdateDoctorUseCase', () => {
  let useCase: UpdateDoctorUseCase;
  let repository: DoctorRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateDoctorUseCase,
        {
          provide: 'DOCTOR_REPOSITORY',
          useClass: DoctorRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<UpdateDoctorUseCase>(UpdateDoctorUseCase);
    repository = module.get<DoctorRepositoryMock>('DOCTOR_REPOSITORY');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should update a doctor', async () => {
    const doctor = Doctor.create(
      'Dr. John Doe',
      'john.doe@example.com',
      '1234567890',
      'Cardiology',
      '12345',
    );

    await repository.create(doctor);

    const updateData = {
      name: 'Dr. John Smith',
      phone: '0987654321',
      specialty: 'Neurology',
    };

    const updatedDoctor = await useCase.execute(doctor.getId(), updateData);

    expect(updatedDoctor).toBeInstanceOf(Doctor);
    expect(updatedDoctor.getId()).toBe(doctor.getId());
    expect(updatedDoctor.getName()).toBe(updateData.name);
    expect(updatedDoctor.getEmail()).toBe(doctor.getEmail());
    expect(updatedDoctor.getPhone()).toBe(updateData.phone);
    expect(updatedDoctor.getSpecialty()).toBe(updateData.specialty);
    expect(updatedDoctor.getCrm()).toBe(doctor.getCrm());
  });

  it('should throw NotFoundException when doctor is not found', async () => {
    const updateData = {
      name: 'Dr. John Smith',
    };

    await expect(useCase.execute('non-existent-id', updateData)).rejects.toThrow(NotFoundException);
  });
}); 