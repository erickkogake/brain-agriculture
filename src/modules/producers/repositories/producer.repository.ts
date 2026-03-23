import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from '../entities/producer.entity';

@Injectable()
export class ProducerRepository {
  constructor(
    @InjectRepository(Producer)
    private readonly repository: Repository<Producer>,
  ) {}

  findAll(): Promise<Producer[]> {
    return this.repository.find({
      relations: ['farms', 'farms.harvests', 'farms.harvests.crops'],
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: string): Promise<Producer | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['farms', 'farms.harvests', 'farms.harvests.crops'],
    });
  }

  findByDocument(document: string): Promise<Producer | null> {
    return this.repository.findOne({ where: { document } });
  }

  save(producer: Producer): Promise<Producer> {
    return this.repository.save(producer);
  }

  create(data: Partial<Producer>): Producer {
    return this.repository.create(data);
  }

  remove(producer: Producer): Promise<Producer> {
    return this.repository.remove(producer);
  }
}
