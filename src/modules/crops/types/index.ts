import { CropType } from '../entities/crop.entity';

export type CropDistribution = {
  type: CropType;
  count: number;
  percentage: number;
};

export type CropAreaSummary = {
  type: CropType;
  totalPlantedArea: number;
};
