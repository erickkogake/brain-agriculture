import { Injectable } from '@nestjs/common';
import { Producer } from '../entities/producer.entity';

export interface ProducerResponse {
  id: string;
  document: string;
  documentType: 'CPF' | 'CNPJ';
  name: string;
  farmsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProducerDetailResponse extends ProducerResponse {
  farms: Array<{
    id: string;
    name: string;
    city: string;
    state: string;
    totalArea: number;
    arableArea: number;
    vegetationArea: number;
  }>;
}

@Injectable()
export class ProducerMapper {
  toResponse(producer: Producer): ProducerDetailResponse {
    return {
      id: producer.id,
      document: producer.document,
      documentType: producer.documentType,
      name: producer.name,
      farmsCount: producer.farms?.length ?? 0,
      createdAt: producer.createdAt,
      updatedAt: producer.updatedAt,
      farms: (producer.farms ?? []).map((farm) => ({
        id: farm.id,
        name: farm.name,
        city: farm.city,
        state: farm.state,
        totalArea: Number(farm.totalArea),
        arableArea: Number(farm.arableArea),
        vegetationArea: Number(farm.vegetationArea),
      })),
    };
  }

  toResponseList(producers: Producer[]): ProducerDetailResponse[] {
    return producers.map((p) => this.toResponse(p));
  }
}
