import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from '../entities/farm.entity';

@Injectable()
export class FarmRepository {
  constructor(
    @InjectRepository(Farm)
    private readonly repository: Repository<Farm>,
  ) {}

  findAll(): Promise<Farm[]> {
    return this.repository.find({
      relations: ['producer', 'harvests', 'harvests.crops'],
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: string): Promise<Farm | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['producer', 'harvests', 'harvests.crops'],
    });
  }

  findByProducerId(producerId: string): Promise<Farm[]> {
    return this.repository.find({
      where: { producerId },
      relations: ['harvests', 'harvests.crops'],
      order: { createdAt: 'DESC' },
    });
  }

  save(farm: Farm): Promise<Farm> {
    return this.repository.save(farm);
  }

  create(data: Partial<Farm>): Farm {
    return this.repository.create(data);
  }

  remove(farm: Farm): Promise<Farm> {
    return this.repository.remove(farm);
  }
}
