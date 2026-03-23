export interface IHarvest {
  id: string;
  name: string;
  year: number;
  farmId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateHarvest {
  farmId: string;
  name: string;
  year: number;
}

export interface IUpdateHarvest {
  name?: string;
  year?: number;
}

export interface IHarvestService {
  create(dto: ICreateHarvest): Promise<IHarvest>;
  findAll(): Promise<IHarvest[]>;
  findByFarm(farmId: string): Promise<IHarvest[]>;
  findOne(id: string): Promise<IHarvest>;
  update(id: string, dto: IUpdateHarvest): Promise<IHarvest>;
  remove(id: string): Promise<void>;
}
