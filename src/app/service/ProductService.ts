import ObjectId from 'mongoose';
import AppError from '../../errors/AppError';
import { IProduct, IProductResponse } from '../interfaces/IProduct';
import ProductRepository from '../repository/ProductRepository';

class ProductService {
  async create(payload: IProduct): Promise<IProductResponse> {
    if (payload.price <= 0) {
      throw new AppError('Reported price is less than or equal to zero');
    }

    const result = await ProductRepository.create(payload);

    return this.findById(result._id.toString());
  }

  // async find() {}

  async findById(id: string): Promise<IProductResponse> {
    return this.validateProductId(id);
  }

  // async update() {}

  // async remove() {}

  async validateProductId(id: string): Promise<IProductResponse> {
    if (!ObjectId.isValidObjectId(id)) {
      throw new AppError('Id entered is not valid');
    }
    const product = await ProductRepository.findById(id);

    if (product.length === 0) {
      throw new AppError('Product not found', 404, 'Not Found');
    }

    return product[0];
  }
}

export default new ProductService();