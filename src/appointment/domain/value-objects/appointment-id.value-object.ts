import { IdValueObject } from '../../../shared/domain/value-objects/id.value-object';

export class AppointmentId extends IdValueObject {
  constructor(value: string) {
    super(value);
  }

  static create(): AppointmentId {
    return new AppointmentId(IdValueObject.generate());
  }

  static fromString(value: string): AppointmentId {
    return new AppointmentId(value);
  }
}
