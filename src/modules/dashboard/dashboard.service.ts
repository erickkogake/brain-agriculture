import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Farm } from '../farms/entities/farm.entity';
import { Crop } from '../crops/entities/crop.entity';
import { Producer } from '../producers/entities/producer.entity';
import { DashboardMapper } from './mappers/dashboard.mapper';
import { IDashboardStats } from './interfaces';

export type DashboardStats = IDashboardStats;

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
    private readonly dashboardMapper: DashboardMapper,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getStats(): Promise<DashboardStats> {
    this.logger.log('Fetching dashboard stats', { context: 'DashboardService' });

    const [totalProducers, farms, crops] = await Promise.all([
      this.producerRepository.count(),
      this.farmRepository.find(),
      this.cropRepository.find(),
    ]);

    return this.dashboardMapper.toStats(totalProducers, farms, crops);
  }
}
