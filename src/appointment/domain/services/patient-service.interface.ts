import { PatientInfoDto } from '../dtos/patient-info.dto';

export interface PatientServiceInterface {
  findById(id: string): Promise<PatientInfoDto | null>;
}
