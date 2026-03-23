import { IDocumentValidationStrategy } from './document-validation.strategy';

export class CpfValidationStrategy implements IDocumentValidationStrategy {
  validate(document: string): boolean {
    const cleaned = document.replace(/\D/g, '');
    if (cleaned.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleaned)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += +cleaned[i] * (10 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== +cleaned[9]) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += +cleaned[i] * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === +cleaned[10];
  }

  getType(): 'CPF' {
    return 'CPF';
  }
}
