import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardMapper } from './mappers/dashboard.mapper';
import { Farm } from '../farms/entities/farm.entity';
import { Crop } from '../crops/entities/crop.entity';
import { Producer } from '../producers/entities/producer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Farm, Crop, Producer])],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardMapper],
})
export class DashboardModule {}
