import { Doctor } from '../entities/doctor.entity';

export interface DoctorRepository {
  create(doctor: Doctor): Promise<Doctor>;
  findById(id: string): Promise<Doctor | null>;
  findByEmail(email: string): Promise<Doctor | null>;
  findBySpecialty(specialty: string): Promise<Doctor[]>;
  update(doctor: Doctor): Promise<Doctor>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Doctor[]>;
} 