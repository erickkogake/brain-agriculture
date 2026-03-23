import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmsController } from './farms.controller';
import { FarmsService } from './farms.service';
import { Farm } from './entities/farm.entity';
import { FarmRepository } from './repositories/farm.repository';
import { FarmFactory } from './factories/farm.factory';
import { FarmMapper } from './mappers/farm.mapper';
import { ProducersModule } from '../producers/producers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Farm]), ProducersModule],
  controllers: [FarmsController],
  providers: [FarmsService, FarmRepository, FarmFactory, FarmMapper],
  exports: [FarmsService],
})
export class FarmsModule {}
