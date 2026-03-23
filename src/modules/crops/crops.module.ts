import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CropsController } from './crops.controller';
import { CropsService } from './crops.service';
import { Crop } from './entities/crop.entity';
import { CropRepository } from './repositories/crop.repository';
import { CropMapper } from './mappers/crop.mapper';
import { HarvestsModule } from '../harvests/harvests.module';

@Module({
  imports: [TypeOrmModule.forFeature([Crop]), HarvestsModule],
  controllers: [CropsController],
  providers: [CropsService, CropRepository, CropMapper],
  exports: [CropsService],
})
export class CropsModule {}
