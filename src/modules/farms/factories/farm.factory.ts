import { Injectable } from '@nestjs/common';
import { Farm } from '../entities/farm.entity';
import { FarmRepository } from '../repositories/farm.repository';
import { CreateFarmDto } from '../dto/create-farm.dto';

@Injectable()
export class FarmFactory {
  constructor(private readonly farmRepository: FarmRepository) {}

  build(dto: CreateFarmDto): Farm {
    return this.farmRepository.create({
      ...dto,
      state: dto.state.toUpperCase(),
    });
  }
}
