import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
  Length,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFarmDto {
  @ApiProperty({ description: 'ID do produtor proprietário', example: 'uuid-v4' })
  @IsUUID(4, { message: 'ID do produtor deve ser um UUID válido' })
  @IsNotEmpty()
  producerId: string;

  @ApiProperty({ description: 'Nome da fazenda', example: 'Fazenda Santa Maria' })
  @IsString()
  @IsNotEmpty({ message: 'Nome da fazenda é obrigatório' })
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Cidade', example: 'Ribeirão Preto' })
  @IsString()
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @MaxLength(255)
  city: string;

  @ApiProperty({ description: 'Estado (sigla com 2 letras)', example: 'SP' })
  @IsString()
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @Length(2, 2, { message: 'Estado deve ser a sigla com 2 letras (ex: SP, MG, GO)' })
  state: string;

  @ApiProperty({ description: 'Área total da fazenda em hectares', example: 1000, minimum: 0.01 })
  @Type(() => Number)
  @IsNumber({}, { message: 'Área total deve ser um número' })
  @IsPositive({ message: 'Área total deve ser maior que zero' })
  totalArea: number;

  @ApiProperty({ description: 'Área agricultável em hectares', example: 600, minimum: 0 })
  @Type(() => Number)
  @IsNumber({}, { message: 'Área agricultável deve ser um número' })
  @Min(0, { message: 'Área agricultável não pode ser negativa' })
  arableArea: number;

  @ApiProperty({ description: 'Área de vegetação em hectares', example: 300, minimum: 0 })
  @Type(() => Number)
  @IsNumber({}, { message: 'Área de vegetação deve ser um número' })
  @Min(0, { message: 'Área de vegetação não pode ser negativa' })
  vegetationArea: number;
}
