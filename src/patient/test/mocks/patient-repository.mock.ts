import { Patient } from '../../domain/entities/patient.entity';
import { PatientRepository } from '../../domain/repositories/patient.repository';

export class PatientRepositoryMock implements PatientRepository {
  private patients: Patient[] = [];

  async create(patient: Patient): Promise<void> {
    this.patients.push(patient);
  }

  async findById(id: string): Promise<Patient | null> {
    const patient = this.patients.find((p) => p.getId() === id);
    return patient || null;
  }

  async findByEmail(email: string): Promise<Patient | null> {
    const patient = this.patients.find((p) => p.getEmail() === email);
    return patient || null;
  }

  async update(patient: Patient): Promise<void> {
    const index = this.patients.findIndex((p) => p.getId() === patient.getId());
    if (index === -1) {
      throw new Error('Patient not found');
    }
    this.patients[index] = patient;
  }

  async delete(id: string): Promise<void> {
    const index = this.patients.findIndex((p) => p.getId() === id);
    if (index === -1) {
      throw new Error('Patient not found');
    }
    this.patients.splice(index, 1);
  }

  async list(): Promise<Patient[]> {
    return [...this.patients];
  }
} 