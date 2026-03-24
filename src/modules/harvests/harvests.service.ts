import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Harvest } from './entities/harvest.entity';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { HarvestRepository } from './repositories/harvest.repository';
import { FarmsService } from '../farms/farms.service';

@Injectable()
export class HarvestsService {
  constructor(
    private readonly harvestRepository: HarvestRepository,
    private readonly farmsService: FarmsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(dto: CreateHarvestDto): Promise<Harvest> {
    this.logger.log('Creating harvest', { context: 'HarvestsService', name: dto.name });

    await this.farmsService.findOne(dto.farmId);

    const harvest = this.harvestRepository.create(dto);
    const saved = await this.harvestRepository.save(harvest);

    this.logger.log('Harvest created', { context: 'HarvestsService', id: saved.id });
    return saved;
  }

  async findAll(): Promise<Harvest[]> {
    return this.harvestRepository.findAll();
  }

  async findByFarm(farmId: string): Promise<Harvest[]> {
    await this.farmsService.findOne(farmId);
    return this.harvestRepository.findByFarmId(farmId);
  }

  async findOne(id: string): Promise<Harvest> {
    const harvest = await this.harvestRepository.findById(id);
    if (!harvest) {
      throw new NotFoundException(`Safra com ID ${id} não encontrada.`);
    }
    return harvest;
  }

  async update(id: string, dto: UpdateHarvestDto): Promise<Harvest> {
    this.logger.log('Updating harvest', { context: 'HarvestsService', id });
    const harvest = await this.findOne(id);

    Object.assign(harvest, dto);

    const updated = await this.harvestRepository.save(harvest);
    this.logger.log('Harvest updated', { context: 'HarvestsService', id });
    return updated;
  }

  async remove(id: string): Promise<void> {
    this.logger.log('Deleting harvest', { context: 'HarvestsService', id });
    const harvest = await this.findOne(id);
    await this.harvestRepository.remove(harvest);
    this.logger.log('Harvest deleted', { context: 'HarvestsService', id });
  }
}
