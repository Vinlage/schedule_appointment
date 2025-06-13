import { Patient } from '../entities/patient.entity';

export interface PatientRepository {
  create(patient: Patient): Promise<void>;
  findById(id: string): Promise<Patient | null>;
  findByEmail(email: string): Promise<Patient | null>;
  update(patient: Patient): Promise<void>;
  delete(id: string): Promise<void>;
  list(): Promise<Patient[]>;
} 