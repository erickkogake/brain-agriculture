import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { IsValidDocument } from '../../../common/decorators/is-valid-document.decorator';

export class CreateProducerDto {
  @ApiProperty({
    description: 'CPF ou CNPJ do produtor (com ou sem formatação)',
    example: '123.456.789-09',
  })
  @IsString()
  @IsNotEmpty({ message: 'Documento (CPF/CNPJ) é obrigatório' })
  @IsValidDocument()
  document: string;

  @ApiProperty({
    description: 'Nome completo do produtor',
    example: 'João da Silva',
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'Nome do produtor é obrigatório' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
  name: string;
}
