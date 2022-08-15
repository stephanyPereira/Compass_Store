import { Types } from 'mongoose';
import {
  ISale,
  ISaleResponse,
  ISaleResponseCreate,
  ISaleUpdate,
} from '../interfaces/ISale';
import SaleSchema from '../schema/SaleSchema';

class SaleRepository {
  async create(payload: ISale): Promise<ISaleResponseCreate> {
    return SaleSchema.create(payload);
  }
  // async find(): Promise<any> {}

  async findById(id: string): Promise<ISaleResponse | null> {
    return SaleSchema.findById(id);
  }

  async update(id: string, payload: ISaleUpdate): Promise<void> {
    await SaleSchema.findOneAndUpdate({ _id: new Types.ObjectId(id) }, payload);
  }

  // async delete(id: string): Promise<void> {}
}

export default new SaleRepository();
