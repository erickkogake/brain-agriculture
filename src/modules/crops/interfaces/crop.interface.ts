import { CropType } from '../entities/crop.entity';

export interface ICrop {
  id: string;
  type: CropType;
  description?: string;
  plantedArea?: number;
  harvestId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCrop {
  harvestId: string;
  type: CropType;
  description?: string;
  plantedArea?: number;
}

export interface IUpdateCrop {
  type?: CropType;
  description?: string;
  plantedArea?: number;
}

export interface ICropService {
  create(dto: ICreateCrop): Promise<ICrop>;
  findAll(): Promise<ICrop[]>;
  findByHarvest(harvestId: string): Promise<ICrop[]>;
  findOne(id: string): Promise<ICrop>;
  update(id: string, dto: IUpdateCrop): Promise<ICrop>;
  remove(id: string): Promise<void>;
}
