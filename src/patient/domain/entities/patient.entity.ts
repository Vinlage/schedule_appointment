import { randomUUID } from 'crypto';

export class Patient {
  private constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly email: string,
    private readonly phone: string,
    private readonly birthDate: Date,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  static create(
    name: string,
    email: string,
    phone: string,
    birthDate: Date,
  ): Patient {
    const now = new Date();
    return new Patient(
      randomUUID(),
      name,
      email,
      phone,
      birthDate,
      now,
      now,
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

  getBirthDate(): Date {
    return this.birthDate;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business rules
  isAdult(): boolean {
    const today = new Date();
    const age = today.getFullYear() - this.birthDate.getFullYear();
    const monthDiff = today.getMonth() - this.birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.birthDate.getDate())) {
      return age - 1 >= 18;
    }
    
    return age >= 18;
  }
} 