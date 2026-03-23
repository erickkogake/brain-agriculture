import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HarvestsController } from './harvests.controller';
import { HarvestsService } from './harvests.service';
import { Harvest } from './entities/harvest.entity';
import { HarvestRepository } from './repositories/harvest.repository';
import { HarvestMapper } from './mappers/harvest.mapper';
import { FarmsModule } from '../farms/farms.module';

@Module({
  imports: [TypeOrmModule.forFeature([Harvest]), FarmsModule],
  controllers: [HarvestsController],
  providers: [HarvestsService, HarvestRepository, HarvestMapper],
  exports: [HarvestsService],
})
export class HarvestsModule {}
