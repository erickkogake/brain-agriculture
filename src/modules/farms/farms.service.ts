import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Farm } from './entities/farm.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { FarmRepository } from './repositories/farm.repository';
import { FarmFactory } from './factories/farm.factory';
import { ProducersService } from '../producers/producers.service';

@Injectable()
export class FarmsService {
  constructor(
    private readonly farmRepository: FarmRepository,
    private readonly farmFactory: FarmFactory,
    private readonly producersService: ProducersService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  private assertAreasValid(totalArea: number, arableArea: number, vegetationArea: number): void {
    if (arableArea + vegetationArea > totalArea) {
      throw new BadRequestException(
        `A soma das áreas agricultável (${arableArea}ha) e de vegetação (${vegetationArea}ha) não pode ultrapassar a área total (${totalArea}ha) da fazenda.`,
      );
    }
  }

  async create(dto: CreateFarmDto): Promise<Farm> {
    this.logger.info('Creating farm', { context: 'FarmsService', name: dto.name });

    await this.producersService.findOne(dto.producerId);
    this.assertAreasValid(dto.totalArea, dto.arableArea, dto.vegetationArea);

    const farm = this.farmFactory.build(dto);
    const saved = await this.farmRepository.save(farm);

    this.logger.info('Farm created', { context: 'FarmsService', id: saved.id });
    return saved;
  }

  async findAll(): Promise<Farm[]> {
    return this.farmRepository.findAll();
  }

  async findByProducer(producerId: string): Promise<Farm[]> {
    await this.producersService.findOne(producerId);
    return this.farmRepository.findByProducerId(producerId);
  }

  async findOne(id: string): Promise<Farm> {
    const farm = await this.farmRepository.findById(id);
    if (!farm) {
      throw new NotFoundException(`Fazenda com ID ${id} não encontrada.`);
    }
    return farm;
  }

  async update(id: string, dto: UpdateFarmDto): Promise<Farm> {
    this.logger.info('Updating farm', { context: 'FarmsService', id });
    const farm = await this.findOne(id);

    const newTotal = Number(dto.totalArea ?? farm.totalArea);
    const newArable = Number(dto.arableArea ?? farm.arableArea);
    const newVegetation = Number(dto.vegetationArea ?? farm.vegetationArea);
    this.assertAreasValid(newTotal, newArable, newVegetation);

    Object.assign(farm, {
      ...dto,
      state: dto.state ? dto.state.toUpperCase() : farm.state,
    });

    const updated = await this.farmRepository.save(farm);
    this.logger.info('Farm updated', { context: 'FarmsService', id });
    return updated;
  }

  async remove(id: string): Promise<void> {
    this.logger.info('Deleting farm', { context: 'FarmsService', id });
    const farm = await this.findOne(id);
    await this.farmRepository.remove(farm);
    this.logger.info('Farm deleted', { context: 'FarmsService', id });
  }
}
