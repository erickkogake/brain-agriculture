import { DocumentType } from '../../../common/types';

export interface IProducer {
  id: string;
  document: string;
  documentType: DocumentType;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProducer {
  document: string;
  name: string;
}

export interface IUpdateProducer {
  document?: string;
  name?: string;
}

export interface IProducerService {
  create(dto: ICreateProducer): Promise<IProducer>;
  findAll(): Promise<IProducer[]>;
  findOne(id: string): Promise<IProducer>;
  update(id: string, dto: IUpdateProducer): Promise<IProducer>;
  remove(id: string): Promise<void>;
}
