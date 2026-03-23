import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Farm } from '../../farms/entities/farm.entity';

export enum DocumentType {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
}

@Entity('producers')
export class Producer {
  @ApiProperty({ description: 'ID único do produtor', example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'CPF ou CNPJ do produtor', example: '123.456.789-09' })
  @Column({ unique: true })
  @Index()
  document: string;

  @ApiProperty({ enum: DocumentType, description: 'Tipo do documento' })
  @Column({ type: 'enum', enum: DocumentType })
  documentType: DocumentType;

  @ApiProperty({ description: 'Nome completo do produtor', example: 'João da Silva' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Data de criação do registro' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização do registro' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => [Farm], description: 'Fazendas do produtor' })
  @OneToMany(() => Farm, (farm) => farm.producer, { cascade: true })
  farms: Farm[];
}
