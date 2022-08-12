import { IProduct, IProductResponse } from '../interfaces/IProduct';

import ProductSchema from '../schema/ProductSchema';

class ProductRepository {
  async create(payload: IProduct): Promise<IProductResponse> {
    return ProductSchema.create(payload);
  }

  // async find() {}

  // async findById() {}

  // async update() {}

  // async remove() {}
}

export default new ProductRepository();
