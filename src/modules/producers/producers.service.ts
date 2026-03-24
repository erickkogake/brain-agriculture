import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Producer } from './entities/producer.entity';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { ProducerRepository } from './repositories/producer.repository';
import { ProducerFactory } from './factories/producer.factory';
import { detectDocumentType } from '../../common/decorators/is-valid-document.decorator';

@Injectable()
export class ProducersService {
  constructor(
    private readonly producerRepository: ProducerRepository,
    private readonly producerFactory: ProducerFactory,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(dto: CreateProducerDto): Promise<Producer> {
    this.logger.log('Creating producer', { context: 'ProducersService' });

    const cleaned = dto.document.replace(/\D/g, '');
    const existing = await this.producerRepository.findByDocument(cleaned);
    if (existing) {
      throw new ConflictException(`Produtor com documento ${dto.document} já está cadastrado.`);
    }

    const producer = this.producerFactory.build(dto.document, dto.name);
    const saved = await this.producerRepository.save(producer);

    this.logger.log('Producer created', { context: 'ProducersService', id: saved.id });
    return saved;
  }

  async findAll(): Promise<Producer[]> {
    this.logger.log('Fetching all producers', { context: 'ProducersService' });
    return this.producerRepository.findAll();
  }

  async findOne(id: string): Promise<Producer> {
    this.logger.log('Fetching producer', { context: 'ProducersService', id });
    const producer = await this.producerRepository.findById(id);
    if (!producer) {
      throw new NotFoundException(`Produtor com ID ${id} não encontrado.`);
    }
    return producer;
  }

  async update(id: string, dto: UpdateProducerDto): Promise<Producer> {
    this.logger.log('Updating producer', { context: 'ProducersService', id });
    const producer = await this.findOne(id);

    if (dto.document) {
      const cleaned = dto.document.replace(/\D/g, '');
      const existing = await this.producerRepository.findByDocument(cleaned);
      if (existing && existing.id !== id) {
        throw new ConflictException(`Documento ${dto.document} já está em uso por outro produtor.`);
      }
      producer.document = cleaned;
      producer.documentType = detectDocumentType(dto.document) as any;
    }

    if (dto.name) producer.name = dto.name;

    const updated = await this.producerRepository.save(producer);
    this.logger.log('Producer updated', { context: 'ProducersService', id });
    return updated;
  }

  async remove(id: string): Promise<void> {
    this.logger.log('Deleting producer', { context: 'ProducersService', id });
    const producer = await this.findOne(id);
    await this.producerRepository.remove(producer);
    this.logger.log('Producer deleted', { context: 'ProducersService', id });
  }
}
