import { Doctor } from '../entities/doctor.entity';

export interface DoctorRepository {
  create(doctor: Doctor): Promise<Doctor>;
  findById(id: string): Promise<Doctor | null>;
  findAll(): Promise<Doctor[]>;
  update(doctor: Doctor): Promise<Doctor>;
  delete(id: string): Promise<void>;
} 