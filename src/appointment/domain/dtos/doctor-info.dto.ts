export class DoctorInfoDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly specialty: string,
    public readonly active: boolean,
  ) {}

  static create(
    id: string,
    name: string,
    email: string,
    specialty: string,
    active: boolean,
  ): DoctorInfoDto {
    return new DoctorInfoDto(id, name, email, specialty, active);
  }
}
