import { Types } from "mongoose";
import { ReturnModelType } from "@typegoose/typegoose";

import { IRepository } from "./i-repository";

export class Repository<T> implements IRepository<T> {
  private readonly model: ReturnModelType<any>;

  constructor(model: ReturnModelType<any>) {
    this.model = model;
  }

  async create(item: T): Promise<T> {
    return await this.model.create(item);
  }

  async findById(id: Types.ObjectId): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async findAll(
    filter = {},
    options: {
      limit?: number;
      skip?: number;
      take?: number;
      sort?: { [key: string]: 1 | -1 };
    } = {}
  ): Promise<T[]> {
    try {
      const query = this.model.find(filter);
      if (options.sort) query.sort(options.sort);
      if (options.skip) query.skip(options.skip);
      if (options.take) query.limit(options.take);
      else if (options.limit) query.limit(options.limit);
      return await query.exec();
    } catch (error) {
      throw error;
    }
  }

  async update(id: Types.ObjectId, item: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, item, { new: true }).exec();
  }

  async delete(id: Types.ObjectId): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
