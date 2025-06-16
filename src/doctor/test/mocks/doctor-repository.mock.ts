import { Doctor } from '../../domain/entities/doctor.entity';
import { DoctorRepository } from '../../domain/repositories/doctor.repository';
import { ConflictException } from '@nestjs/common';

export class DoctorRepositoryMock implements DoctorRepository {
  private doctors: Doctor[] = [];

  create(doctor: Doctor): Promise<Doctor> {
    const exists = this.doctors.some((d) => d.getEmail() === doctor.getEmail());
    if (exists) {
      return Promise.reject(new ConflictException('Email already in use'));
    }
    this.doctors.push(doctor);
    return Promise.resolve(doctor);
  }

  findById(id: string): Promise<Doctor | null> {
    const doctor = this.doctors.find((d) => d.getId() === id);
    return Promise.resolve(doctor || null);
  }

  findByEmail(email: string): Promise<Doctor | null> {
    const doctor = this.doctors.find((d) => d.getEmail() === email);
    return Promise.resolve(doctor || null);
  }

  findBySpecialty(specialty: string): Promise<Doctor[]> {
    return Promise.resolve(
      this.doctors.filter((d) => d.getSpecialty() === specialty),
    );
  }

  update(doctor: Doctor): Promise<Doctor> {
    const index = this.doctors.findIndex((d) => d.getId() === doctor.getId());
    if (index === -1) {
      return Promise.reject(new Error('Doctor not found'));
    }
    this.doctors[index] = doctor;
    return Promise.resolve(doctor);
  }

  delete(id: string): Promise<void> {
    const index = this.doctors.findIndex((d) => d.getId() === id);
    if (index === -1) {
      return Promise.reject(new Error('Doctor not found'));
    }
    this.doctors.splice(index, 1);
    return Promise.resolve();
  }

  findAll(): Promise<Doctor[]> {
    return Promise.resolve([...this.doctors]);
  }
}
