import { Injectable } from '@nestjs/common';
import { Crop, CropType } from '../entities/crop.entity';

export interface CropResponse {
  id: string;
  type: CropType;
  description: string | null;
  plantedArea: number | null;
  harvestId: string;
  harvestName?: string;
  farmName?: string;
  producerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CropMapper {
  toResponse(crop: Crop): CropResponse {
    return {
      id: crop.id,
      type: crop.type,
      description: crop.description ?? null,
      plantedArea: crop.plantedArea != null ? Number(crop.plantedArea) : null,
      harvestId: crop.harvestId,
      harvestName: crop.harvest?.name,
      farmName: crop.harvest?.farm?.name,
      producerName: crop.harvest?.farm?.producer?.name,
      createdAt: crop.createdAt,
      updatedAt: crop.updatedAt,
    };
  }

  toResponseList(crops: Crop[]): CropResponse[] {
    return crops.map((c) => this.toResponse(c));
  }
}
