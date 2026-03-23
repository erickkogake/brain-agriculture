import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsNumber, IsUUID, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CropType } from '../entities/crop.entity';

export class CreateCropDto {
  @ApiProperty({ description: 'ID da safra', example: 'uuid-v4' })
  @IsUUID(4, { message: 'ID da safra deve ser um UUID válido' })
  @IsNotEmpty()
  harvestId: string;

  @ApiProperty({ enum: CropType, description: 'Tipo de cultura plantada', example: CropType.SOJA })
  @IsEnum(CropType, { message: `Tipo de cultura deve ser um dos valores: ${Object.values(CropType).join(', ')}` })
  @IsNotEmpty()
  type: CropType;

  @ApiProperty({ description: 'Descrição adicional', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Área plantada em hectares', example: 200, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  plantedArea?: number;
}
