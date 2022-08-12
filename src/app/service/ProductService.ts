import AppError from '../../errors/AppError';
import { IProduct, IProductResponse } from '../interfaces/IProduct';
import ProductRepository from '../repository/ProductRepository';

class ProductService {
  async create(payload: IProduct): Promise<IProductResponse> {
    if (payload.price <= 0) {
      throw new AppError('Reported price is less than or equal to zero');
    }

    const result = await ProductRepository.create(payload);

    return result;
  }

  // async find() {}

  // async findById() {}

  // async update() {}

  // async remove() {}
}

export default new ProductService();
