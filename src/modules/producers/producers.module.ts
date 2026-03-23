import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';
import { Producer } from './entities/producer.entity';
import { ProducerRepository } from './repositories/producer.repository';
import { ProducerFactory } from './factories/producer.factory';
import { ProducerMapper } from './mappers/producer.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Producer])],
  controllers: [ProducersController],
  providers: [ProducersService, ProducerRepository, ProducerFactory, ProducerMapper],
  exports: [ProducersService],
})
export class ProducersModule {}
