import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Harvest } from '../entities/harvest.entity';

@Injectable()
export class HarvestRepository {
  constructor(
    @InjectRepository(Harvest)
    private readonly repository: Repository<Harvest>,
  ) {}

  findAll(): Promise<Harvest[]> {
    return this.repository.find({
      relations: ['farm', 'farm.producer', 'crops'],
      order: { year: 'DESC' },
    });
  }

  findById(id: string): Promise<Harvest | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['farm', 'farm.producer', 'crops'],
    });
  }

  findByFarmId(farmId: string): Promise<Harvest[]> {
    return this.repository.find({
      where: { farmId },
      relations: ['crops'],
      order: { year: 'DESC' },
    });
  }

  save(harvest: Harvest): Promise<Harvest> {
    return this.repository.save(harvest);
  }

  create(data: Partial<Harvest>): Harvest {
    return this.repository.create(data);
  }

  remove(harvest: Harvest): Promise<Harvest> {
    return this.repository.remove(harvest);
  }
}
