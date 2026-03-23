import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min, Max, IsUUID, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHarvestDto {
  @ApiProperty({ description: 'ID da fazenda', example: 'uuid-v4' })
  @IsUUID(4, { message: 'ID da fazenda deve ser um UUID válido' })
  @IsNotEmpty()
  farmId: string;

  @ApiProperty({ description: 'Nome da safra', example: 'Safra 2024' })
  @IsString()
  @IsNotEmpty({ message: 'Nome da safra é obrigatório' })
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Ano da safra', example: 2024, minimum: 1900, maximum: 2100 })
  @Type(() => Number)
  @IsInt({ message: 'Ano deve ser um número inteiro' })
  @Min(1900, { message: 'Ano não pode ser anterior a 1900' })
  @Max(2100, { message: 'Ano não pode ser superior a 2100' })
  year: number;
}
