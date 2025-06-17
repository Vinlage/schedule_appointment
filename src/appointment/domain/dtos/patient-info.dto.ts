export class PatientInfoDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly birthDate: Date,
  ) {}

  static create(
    id: string,
    name: string,
    email: string,
    birthDate: Date,
  ): PatientInfoDto {
    return new PatientInfoDto(id, name, email, birthDate);
  }
}
