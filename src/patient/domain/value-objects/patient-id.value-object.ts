import { IdValueObject } from '../../../shared/domain/value-objects/id.value-object';

export class PatientId extends IdValueObject {
  constructor(value: string) {
    super(value);
  }

  static create(): PatientId {
    return new PatientId(IdValueObject.generate());
  }

  static fromString(value: string): PatientId {
    return new PatientId(value);
  }
}
