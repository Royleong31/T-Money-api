import { ValueTransformer } from 'typeorm';

export class LowerCaseTransformer implements ValueTransformer {
  public from(value?: string) {
    if (typeof value === 'undefined' || value === null) {
      return value;
    }

    return value.toLowerCase();
  }

  public to(value?: string) {
    if (typeof value === 'undefined' || value === null) {
      return value;
    }

    return value.toLowerCase();
  }
}
