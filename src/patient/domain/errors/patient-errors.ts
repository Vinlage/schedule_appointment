import { DomainError } from '../../../shared/errors/domain-error';

export class PatientNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Patient with ID ${id} not found`);
  }
}

export class EmailAlreadyInUseError extends DomainError {
  constructor(email: string) {
    super(`Email ${email} is already in use by another patient`);
  }
}

export class InvalidPatientDataError extends DomainError {
  constructor(message: string) {
    super(`Invalid patient data: ${message}`);
  }
} 