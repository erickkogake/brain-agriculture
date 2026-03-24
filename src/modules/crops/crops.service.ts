import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Crop } from './entities/crop.entity';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { CropRepository } from './repositories/crop.repository';
import { HarvestsService } from '../harvests/harvests.service';

@Injectable()
export class CropsService {
  constructor(
    private readonly cropRepository: CropRepository,
    private readonly harvestsService: HarvestsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(dto: CreateCropDto): Promise<Crop> {
    this.logger.log('Creating crop', { context: 'CropsService', type: dto.type });

    await this.harvestsService.findOne(dto.harvestId);

    const crop = this.cropRepository.create(dto);
    const saved = await this.cropRepository.save(crop);

    this.logger.log('Crop created', { context: 'CropsService', id: saved.id });
    return saved;
  }

  async findAll(): Promise<Crop[]> {
    return this.cropRepository.findAll();
  }

  async findByHarvest(harvestId: string): Promise<Crop[]> {
    await this.harvestsService.findOne(harvestId);
    return this.cropRepository.findByHarvestId(harvestId);
  }

  async findOne(id: string): Promise<Crop> {
    const crop = await this.cropRepository.findById(id);
    if (!crop) {
      throw new NotFoundException(`Cultura com ID ${id} não encontrada.`);
    }
    return crop;
  }

  async update(id: string, dto: UpdateCropDto): Promise<Crop> {
    this.logger.log('Updating crop', { context: 'CropsService', id });
    const crop = await this.findOne(id);

    Object.assign(crop, dto);

    const updated = await this.cropRepository.save(crop);
    this.logger.log('Crop updated', { context: 'CropsService', id });
    return updated;
  }

  async remove(id: string): Promise<void> {
    this.logger.log('Deleting crop', { context: 'CropsService', id });
    const crop = await this.findOne(id);
    await this.cropRepository.remove(crop);
    this.logger.log('Crop deleted', { context: 'CropsService', id });
  }
}
