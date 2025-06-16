import { FindDoctorsBySpecialtyUseCase } from './find-doctors-by-specialty.use-case';
import { DoctorRepositoryMock } from '../../test/mocks/doctor-repository.mock';
import { Doctor } from '../../domain/entities/doctor.entity';

describe('FindDoctorsBySpecialtyUseCase', () => {
  let useCase: FindDoctorsBySpecialtyUseCase;
  let repository: DoctorRepositoryMock;

  beforeEach(() => {
    repository = new DoctorRepositoryMock();
    useCase = new FindDoctorsBySpecialtyUseCase(repository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return doctors by specialty', async () => {
    const doctor1 = Doctor.create(
      'Dr. A',
      'a@a.com',
      '123',
      'Cardiology',
      '123',
    );
    const doctor2 = Doctor.create(
      'Dr. B',
      'b@b.com',
      '456',
      'Cardiology',
      '456',
    );
    const doctor3 = Doctor.create(
      'Dr. C',
      'c@c.com',
      '789',
      'Neurology',
      '789',
    );
    await repository.create(doctor1);
    await repository.create(doctor2);
    await repository.create(doctor3);

    const result = await useCase.execute('Cardiology');
    expect(result.length).toBe(2);
    expect(result[0].getSpecialty()).toBe('Cardiology');
    expect(result[1].getSpecialty()).toBe('Cardiology');
  });

  it('should return empty array when no doctors found for specialty', async () => {
    const result = await useCase.execute('NonExistentSpecialty');
    expect(result).toEqual([]);
  });
});
