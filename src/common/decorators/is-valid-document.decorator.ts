import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { documentValidator } from '../strategies/document-validator.context';

export function detectDocumentType(document: string): 'CPF' | 'CNPJ' | null {
  return documentValidator.detect(document);
}

@ValidatorConstraint({ async: false })
export class IsValidDocumentConstraint implements ValidatorConstraintInterface {
  validate(document: string): boolean {
    if (!document) return false;
    return documentValidator.isValid(document);
  }

  defaultMessage(): string {
    return 'CPF ou CNPJ inválido. Verifique o documento informado.';
  }
}

export function IsValidDocument(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDocumentConstraint,
    });
  };
}
