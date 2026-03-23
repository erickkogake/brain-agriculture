import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Producer } from '../../producers/entities/producer.entity';
import { Harvest } from '../../harvests/entities/harvest.entity';

@Entity('farms')
export class Farm {
  @ApiProperty({ description: 'ID único da fazenda' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nome da fazenda', example: 'Fazenda Santa Maria' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Cidade onde a fazenda está localizada', example: 'Ribeirão Preto' })
  @Column()
  @Index()
  city: string;

  @ApiProperty({ description: 'Estado onde a fazenda está localizada', example: 'SP' })
  @Column({ length: 2 })
  @Index()
  state: string;

  @ApiProperty({ description: 'Área total da fazenda em hectares', example: 1000 })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalArea: number;

  @ApiProperty({ description: 'Área agricultável em hectares', example: 600 })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  arableArea: number;

  @ApiProperty({ description: 'Área de vegetação em hectares', example: 300 })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vegetationArea: number;

  @ApiProperty({ description: 'Data de criação do registro' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização do registro' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'ID do produtor proprietário' })
  @Column()
  producerId: string;

  @ManyToOne(() => Producer, (producer) => producer.farms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producerId' })
  producer: Producer;

  @ApiProperty({ type: () => [Harvest], description: 'Safras da fazenda' })
  @OneToMany(() => Harvest, (harvest) => harvest.farm, { cascade: true })
  harvests: Harvest[];
}
