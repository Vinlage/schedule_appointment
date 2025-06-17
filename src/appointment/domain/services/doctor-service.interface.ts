import { DoctorInfoDto } from '../dtos/doctor-info.dto';

export interface DoctorServiceInterface {
  findById(id: string): Promise<DoctorInfoDto | null>;
  isActive(id: string): Promise<boolean>;
}
