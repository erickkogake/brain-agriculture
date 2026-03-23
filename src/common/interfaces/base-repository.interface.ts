export interface IBaseRepository<T> {
  findAll(): Promise<T[]>;
  findOne(id: string): Promise<T>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  remove(id: string): Promise<void>;
}
