import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crop } from '../entities/crop.entity';

@Injectable()
export class CropRepository {
  constructor(
    @InjectRepository(Crop)
    private readonly repository: Repository<Crop>,
  ) {}

  findAll(): Promise<Crop[]> {
    return this.repository.find({
      relations: ['harvest', 'harvest.farm', 'harvest.farm.producer'],
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: string): Promise<Crop | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['harvest', 'harvest.farm'],
    });
  }

  findByHarvestId(harvestId: string): Promise<Crop[]> {
    return this.repository.find({
      where: { harvestId },
      order: { type: 'ASC' },
    });
  }

  save(crop: Crop): Promise<Crop> {
    return this.repository.save(crop);
  }

  create(data: Partial<Crop>): Crop {
    return this.repository.create(data);
  }

  remove(crop: Crop): Promise<Crop> {
    return this.repository.remove(crop);
  }
}
