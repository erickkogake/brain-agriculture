import { IDocumentValidationStrategy } from './document-validation.strategy';
import { CpfValidationStrategy } from './cpf-validation.strategy';
import { CnpjValidationStrategy } from './cnpj-validation.strategy';

export class DocumentValidatorContext {
  private readonly strategies: IDocumentValidationStrategy[] = [
    new CpfValidationStrategy(),
    new CnpjValidationStrategy(),
  ];

  detect(document: string): 'CPF' | 'CNPJ' | null {
    const cleaned = document.replace(/\D/g, '');
    for (const strategy of this.strategies) {
      if (strategy.validate(cleaned)) {
        return strategy.getType();
      }
    }
    return null;
  }

  isValid(document: string): boolean {
    return this.detect(document) !== null;
  }
}

export const documentValidator = new DocumentValidatorContext();
