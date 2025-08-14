import { Types } from "mongoose";

export interface IRepository<T> {
  create(item: T): Promise<T>;
  findById(id: Types.ObjectId | string): Promise<T | null>;
  findAll(
    filter?: any,
    options?: {
      limit?: number;
      take?: number;
      sort?: { [key: string]: 1 | -1 };
    }
  ): Promise<T[]>;
  update(id: Types.ObjectId, item: Partial<T>): Promise<T | null>;
  delete(id: Types.ObjectId): Promise<boolean>;
}
