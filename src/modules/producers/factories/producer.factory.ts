import { Injectable } from '@nestjs/common';
import { Producer, DocumentType } from '../entities/producer.entity';
import { ProducerRepository } from '../repositories/producer.repository';
import { detectDocumentType } from '../../../common/decorators/is-valid-document.decorator';

@Injectable()
export class ProducerFactory {
  constructor(private readonly producerRepository: ProducerRepository) {}

  build(document: string, name: string): Producer {
    const cleaned = document.replace(/\D/g, '');
    const documentType = detectDocumentType(document) as DocumentType;
    return this.producerRepository.create({ document: cleaned, documentType, name });
  }
}
