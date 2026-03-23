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
import { Farm } from '../../farms/entities/farm.entity';
import { Crop } from '../../crops/entities/crop.entity';

@Entity('harvests')
export class Harvest {
  @ApiProperty({ description: 'ID único da safra' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nome/ano da safra', example: 'Safra 2024' })
  @Column()
  @Index()
  name: string;

  @ApiProperty({ description: 'Ano da safra', example: 2024 })
  @Column({ type: 'int' })
  year: number;

  @ApiProperty({ description: 'Data de criação do registro' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização do registro' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'ID da fazenda' })
  @Column()
  farmId: string;

  @ManyToOne(() => Farm, (farm) => farm.harvests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farmId' })
  farm: Farm;

  @ApiProperty({ type: () => [Crop], description: 'Culturas plantadas nesta safra' })
  @OneToMany(() => Crop, (crop) => crop.harvest, { cascade: true })
  crops: Crop[];
}
