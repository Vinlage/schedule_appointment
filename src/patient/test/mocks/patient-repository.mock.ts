import { Patient } from '../../domain/entities/patient.entity';
import { PatientRepository } from '../../domain/repositories/patient.repository';

export class PatientRepositoryMock implements PatientRepository {
  private patients: Patient[] = [];

  create(patient: Patient): Promise<void> {
    this.patients.push(patient);
    return Promise.resolve();
  }

  findById(id: string): Promise<Patient | null> {
    const patient = this.patients.find((p) => p.getId() === id);
    return Promise.resolve(patient || null);
  }

  findByEmail(email: string): Promise<Patient | null> {
    const patient = this.patients.find((p) => p.getEmail() === email);
    return Promise.resolve(patient || null);
  }

  update(patient: Patient): Promise<void> {
    const index = this.patients.findIndex((p) => p.getId() === patient.getId());
    if (index === -1) {
      return Promise.reject(new Error('Patient not found'));
    }
    this.patients[index] = patient;
    return Promise.resolve();
  }

  delete(id: string): Promise<void> {
    const index = this.patients.findIndex((p) => p.getId() === id);
    if (index === -1) {
      return Promise.reject(new Error('Patient not found'));
    }
    this.patients.splice(index, 1);
    return Promise.resolve();
  }

  list(): Promise<Patient[]> {
    return Promise.resolve([...this.patients]);
  }
}
