import { Doctor } from '../../domain/entities/doctor.entity';
import { DoctorRepository } from '../../domain/repositories/doctor.repository';

export class DoctorRepositoryMock implements DoctorRepository {
  private doctors: Doctor[] = [];

  async create(doctor: Doctor): Promise<Doctor> {
    this.doctors.push(doctor);
    return doctor;
  }

  async findById(id: string): Promise<Doctor | null> {
    const doctor = this.doctors.find((d) => d.getId() === id);
    return doctor || null;
  }

  async findByEmail(email: string): Promise<Doctor | null> {
    const doctor = this.doctors.find((d) => d.getEmail() === email);
    return doctor || null;
  }

  async findBySpecialty(specialty: string): Promise<Doctor[]> {
    return this.doctors.filter((d) => d.getSpecialty() === specialty);
  }

  async update(doctor: Doctor): Promise<Doctor> {
    const index = this.doctors.findIndex((d) => d.getId() === doctor.getId());
    if (index === -1) {
      throw new Error('Doctor not found');
    }
    this.doctors[index] = doctor;
    return doctor;
  }

  async delete(id: string): Promise<void> {
    const index = this.doctors.findIndex((d) => d.getId() === id);
    if (index === -1) {
      throw new Error('Doctor not found');
    }
    this.doctors.splice(index, 1);
  }

  async findAll(): Promise<Doctor[]> {
    return [...this.doctors];
  }
} 