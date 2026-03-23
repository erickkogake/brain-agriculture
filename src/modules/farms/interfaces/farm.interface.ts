export interface IFarm {
  id: string;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  producerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateFarm {
  producerId: string;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
}

export interface IUpdateFarm {
  name?: string;
  city?: string;
  state?: string;
  totalArea?: number;
  arableArea?: number;
  vegetationArea?: number;
}

export interface IFarmAreaValidation {
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
}

export interface IFarmService {
  create(dto: ICreateFarm): Promise<IFarm>;
  findAll(): Promise<IFarm[]>;
  findByProducer(producerId: string): Promise<IFarm[]>;
  findOne(id: string): Promise<IFarm>;
  update(id: string, dto: IUpdateFarm): Promise<IFarm>;
  remove(id: string): Promise<void>;
}
