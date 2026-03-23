import { Injectable } from '@nestjs/common';
import { Harvest } from '../entities/harvest.entity';

export interface HarvestResponse {
  id: string;
  name: string;
  year: number;
  farmId: string;
  farmName?: string;
  producerName?: string;
  cropsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class HarvestMapper {
  toResponse(harvest: Harvest): HarvestResponse {
    return {
      id: harvest.id,
      name: harvest.name,
      year: harvest.year,
      farmId: harvest.farmId,
      farmName: harvest.farm?.name,
      producerName: harvest.farm?.producer?.name,
      cropsCount: harvest.crops?.length ?? 0,
      createdAt: harvest.createdAt,
      updatedAt: harvest.updatedAt,
    };
  }

  toResponseList(harvests: Harvest[]): HarvestResponse[] {
    return harvests.map((h) => this.toResponse(h));
  }
}
