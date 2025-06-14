import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('patients')
export class PatientTypeOrmEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  birthDate: Date;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
} 