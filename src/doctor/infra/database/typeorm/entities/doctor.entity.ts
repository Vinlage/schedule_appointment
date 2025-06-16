import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('doctors')
export class DoctorTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  specialty: string;

  @Column({ unique: true })
  crm: string;

  @Column({ default: true })
  active: boolean;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;
}
