import { IDocumentValidationStrategy } from './document-validation.strategy';

export class CnpjValidationStrategy implements IDocumentValidationStrategy {
  validate(document: string): boolean {
    const cleaned = document.replace(/\D/g, '');
    if (cleaned.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cleaned)) return false;

    const calcDigit = (str: string, weights: number[]): number => {
      const sum = str.split('').reduce((acc, digit, i) => acc + +digit * weights[i], 0);
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const d1 = calcDigit(cleaned.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    if (d1 !== +cleaned[12]) return false;

    const d2 = calcDigit(cleaned.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    return d2 === +cleaned[13];
  }

  getType(): 'CNPJ' {
    return 'CNPJ';
  }
}
