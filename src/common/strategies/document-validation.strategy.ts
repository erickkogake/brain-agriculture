export interface IDocumentValidationStrategy {
  validate(document: string): boolean;
  getType(): 'CPF' | 'CNPJ';
}
