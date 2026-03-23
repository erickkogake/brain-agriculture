import { detectDocumentType, IsValidDocumentConstraint } from '../decorators/is-valid-document.decorator';
import { CpfValidationStrategy } from '../strategies/cpf-validation.strategy';
import { CnpjValidationStrategy } from '../strategies/cnpj-validation.strategy';
import { DocumentValidatorContext } from '../strategies/document-validator.context';

describe('CpfValidationStrategy', () => {
  const strategy = new CpfValidationStrategy();

  it('should return CPF as type', () => {
    expect(strategy.getType()).toBe('CPF');
  });

  it('should validate a correct CPF', () => {
    expect(strategy.validate('52998224725')).toBe(true);
  });

  it('should reject CPF with wrong check digits', () => {
    expect(strategy.validate('12345678900')).toBe(false);
  });

  it('should reject repeated-digit CPF', () => {
    expect(strategy.validate('11111111111')).toBe(false);
  });

  it('should reject CPF with wrong length', () => {
    expect(strategy.validate('123456789')).toBe(false);
  });
});

describe('CnpjValidationStrategy', () => {
  const strategy = new CnpjValidationStrategy();

  it('should return CNPJ as type', () => {
    expect(strategy.getType()).toBe('CNPJ');
  });

  it('should validate a correct CNPJ', () => {
    expect(strategy.validate('11222333000181')).toBe(true);
  });

  it('should reject CNPJ with wrong check digits', () => {
    expect(strategy.validate('11222333000100')).toBe(false);
  });

  it('should reject repeated-digit CNPJ', () => {
    expect(strategy.validate('11111111111111')).toBe(false);
  });

  it('should reject CNPJ with wrong length', () => {
    expect(strategy.validate('1122233300018')).toBe(false);
  });
});

describe('DocumentValidatorContext', () => {
  const context = new DocumentValidatorContext();

  it('should detect CPF from clean number', () => {
    expect(context.detect('52998224725')).toBe('CPF');
  });

  it('should detect CPF with formatting', () => {
    expect(context.detect('529.982.247-25')).toBe('CPF');
  });

  it('should detect CNPJ from clean number', () => {
    expect(context.detect('11222333000181')).toBe('CNPJ');
  });

  it('should detect CNPJ with formatting', () => {
    expect(context.detect('11.222.333/0001-81')).toBe('CNPJ');
  });

  it('should return null for invalid document', () => {
    expect(context.detect('000000000')).toBeNull();
  });

  it('should return true for valid document via isValid', () => {
    expect(context.isValid('529.982.247-25')).toBe(true);
  });

  it('should return false for invalid document via isValid', () => {
    expect(context.isValid('123.456.789-00')).toBe(false);
  });
});

describe('detectDocumentType (decorator helper)', () => {
  it('should detect valid CPF', () => {
    expect(detectDocumentType('529.982.247-25')).toBe('CPF');
  });

  it('should detect valid CNPJ', () => {
    expect(detectDocumentType('11.222.333/0001-81')).toBe('CNPJ');
  });

  it('should return null for invalid document', () => {
    expect(detectDocumentType('123.456.789-00')).toBeNull();
  });
});

describe('IsValidDocumentConstraint', () => {
  const validator = new IsValidDocumentConstraint();

  it('should validate correct CPF', () => {
    expect(validator.validate('529.982.247-25')).toBe(true);
  });

  it('should validate correct CNPJ', () => {
    expect(validator.validate('11.222.333/0001-81')).toBe(true);
  });

  it('should reject invalid document', () => {
    expect(validator.validate('000.000.000-00')).toBe(false);
  });

  it('should reject null', () => {
    expect(validator.validate(null)).toBe(false);
  });

  it('should reject undefined', () => {
    expect(validator.validate(undefined)).toBe(false);
  });

  it('should return correct default message', () => {
    expect(validator.defaultMessage()).toContain('CPF ou CNPJ inválido');
  });
});
