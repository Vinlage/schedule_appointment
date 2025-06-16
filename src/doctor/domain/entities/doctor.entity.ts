import { randomUUID } from 'crypto';

export class Doctor {
  private constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly email: string,
    private readonly phone: string,
    private readonly specialty: string,
    private readonly crm: string,
    private readonly active: boolean,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  static create(
    name: string,
    email: string,
    phone: string,
    specialty: string,
    crm: string,
    active: boolean = true,
  ): Doctor {
    const now = new Date();
    return new Doctor(
      randomUUID(),
      name,
      email,
      phone,
      specialty,
      crm,
      active,
      now,
      now,
    );
  }

  static reconstruct(
    id: string,
    name: string,
    email: string,
    phone: string,
    specialty: string,
    crm: string,
    active: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): Doctor {
    return new Doctor(
      id,
      name,
      email,
      phone,
      specialty,
      crm,
      active,
      createdAt,
      updatedAt,
    );
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getPhone(): string {
    return this.phone;
  }

  getSpecialty(): string {
    return this.specialty;
  }

  getCrm(): string {
    return this.crm;
  }

  isActive(): boolean {
    return this.active;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business rules
  deactivate(): Doctor {
    return Doctor.reconstruct(
      this.id,
      this.name,
      this.email,
      this.phone,
      this.specialty,
      this.crm,
      false,
      this.createdAt,
      new Date(),
    );
  }

  activate(): Doctor {
    return Doctor.reconstruct(
      this.id,
      this.name,
      this.email,
      this.phone,
      this.specialty,
      this.crm,
      true,
      this.createdAt,
      new Date(),
    );
  }

  update(
    name?: string,
    email?: string,
    phone?: string,
    specialty?: string,
    crm?: string,
    active?: boolean,
  ): Doctor {
    return Doctor.reconstruct(
      this.id,
      name ?? this.name,
      email ?? this.email,
      phone ?? this.phone,
      specialty ?? this.specialty,
      crm ?? this.crm,
      active ?? this.active,
      this.createdAt,
      new Date(),
    );
  }
}
