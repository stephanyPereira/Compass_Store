import { ISale, ISaleResponse, ISaleResponseCreate } from '../interfaces/ISale';
import SaleSchema from '../schema/SaleSchema';

class SaleRepository {
  async create(payload: ISale): Promise<ISaleResponseCreate> {
    return SaleSchema.create(payload);
  }
  // async find(): Promise<any> {}

  async findById(id: string): Promise<ISaleResponse | null> {
    return SaleSchema.findById(id);
  }

  // async update(): Promise<any> {}
  // async delete(id: string): Promise<void> {}
}

export default new SaleRepository();
