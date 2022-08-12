import { Types } from 'mongoose';
import { IProduct, IProductResponse } from '../interfaces/IProduct';

import ProductSchema from '../schema/ProductSchema';

class ProductRepository {
  async create(payload: IProduct): Promise<IProductResponse> {
    return ProductSchema.create(payload);
  }

  // async find() {}

  async findById(id: string): Promise<IProductResponse[]> {
    return ProductSchema.aggregate()
      .match({
        _id: new Types.ObjectId(id),
      })
      .project({
        _id: '$_id',
        name: '$name',
        category: '$category',
        currency: '$currency',
        price: '$price',
      });
  }

  // async update() {}

  // async remove() {}
}

export default new ProductRepository();
