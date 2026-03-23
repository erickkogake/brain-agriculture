import { Injectable } from '@nestjs/common';
import { Farm } from '../entities/farm.entity';

export interface FarmResponse {
  id: string;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  usagePercent: number;
  producerId: string;
  producerName?: string;
  harvestsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class FarmMapper {
  toResponse(farm: Farm): FarmResponse {
    const total = Number(farm.totalArea);
    const arable = Number(farm.arableArea);
    const vegetation = Number(farm.vegetationArea);
    const usagePercent = total > 0 ? Math.round(((arable + vegetation) / total) * 10000) / 100 : 0;

    return {
      id: farm.id,
      name: farm.name,
      city: farm.city,
      state: farm.state,
      totalArea: total,
      arableArea: arable,
      vegetationArea: vegetation,
      usagePercent,
      producerId: farm.producerId,
      producerName: farm.producer?.name,
      harvestsCount: farm.harvests?.length ?? 0,
      createdAt: farm.createdAt,
      updatedAt: farm.updatedAt,
    };
  }

  toResponseList(farms: Farm[]): FarmResponse[] {
    return farms.map((f) => this.toResponse(f));
  }
}
