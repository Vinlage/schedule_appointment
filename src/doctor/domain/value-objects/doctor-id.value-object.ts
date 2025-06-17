import { IdValueObject } from '../../../shared/domain/value-objects/id.value-object';

export class DoctorId extends IdValueObject {
  constructor(value: string) {
    super(value);
  }

  static create(): DoctorId {
    return new DoctorId(IdValueObject.generate());
  }

  static fromString(value: string): DoctorId {
    return new DoctorId(value);
  }
}
