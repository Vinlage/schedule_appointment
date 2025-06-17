import { randomUUID } from 'crypto';

export abstract class IdValueObject {
  protected constructor(private readonly value: string) {
    this.validate(value);
  }

  private validate(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error('ID cannot be empty');
    }

    // Validar se é um UUID válido
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('ID must be a valid UUID');
    }
  }

  static generate(): string {
    return randomUUID();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: IdValueObject): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
