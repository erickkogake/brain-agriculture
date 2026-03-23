import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Harvest } from '../../harvests/entities/harvest.entity';

export enum CropType {
  SOJA = 'Soja',
  MILHO = 'Milho',
  ALGODAO = 'Algodão',
  CAFE = 'Café',
  CANA_DE_ACUCAR = 'Cana de Açúcar',
  TRIGO = 'Trigo',
  ARROZ = 'Arroz',
  FEIJAO = 'Feijão',
  MANDIOCA = 'Mandioca',
  SORGO = 'Sorgo',
  OTHER = 'Outros',
}

@Entity('crops')
export class Crop {
  @ApiProperty({ description: 'ID único da cultura' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ enum: CropType, description: 'Tipo de cultura plantada', example: CropType.SOJA })
  @Column({ type: 'enum', enum: CropType })
  @Index()
  type: CropType;

  @ApiProperty({ description: 'Nome customizado ou descrição adicional da cultura', required: false })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Área plantada desta cultura em hectares', example: 200, required: false })
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  plantedArea: number;

  @ApiProperty({ description: 'Data de criação do registro' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização do registro' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'ID da safra' })
  @Column()
  harvestId: string;

  @ManyToOne(() => Harvest, (harvest) => harvest.crops, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'harvestId' })
  harvest: Harvest;
}
