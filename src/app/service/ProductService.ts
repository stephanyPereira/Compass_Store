import ObjectId from 'mongoose';
import AppError from '../../errors/AppError';
import {
  IProduct,
  IProductFilters,
  IProductResponse,
  IProductResponsePageable,
  IProductUpdate,
} from '../interfaces/IProduct';
import ProductRepository from '../repository/ProductRepository';

class ProductService {
  async create(payload: IProduct): Promise<IProductResponse> {
    const result = await ProductRepository.create(payload);

    return this.findById(result._id.toString());
  }

  async find(payload: IProductFilters): Promise<IProductResponsePageable> {
    const result = await ProductRepository.find({
      name: payload.name ? payload.name.trim() : payload.name,
      category: payload.category ? payload.category.trim() : payload.category,
      currency: payload.currency ? payload.currency.trim() : payload.currency,
      minPrice: payload.minPrice ? +payload.minPrice : payload.minPrice,
      maxPrice: payload.maxPrice ? +payload.maxPrice : payload.maxPrice,
      page: payload.page ? +payload.page : 1,
      size: payload.size ? +payload.size : 10,
    });

    if (result.docs.length === 0) {
      throw new AppError('No data found for your search');
    }

    return {
      products: result.docs,
      currentPage: result.page,
      pageSize: result.limit,
      totalCount: result.totalDocs,
      totalPages: result.totalPages,
    };
  }

  async findById(id: string): Promise<IProductResponse> {
    return this.validateProductId(id);
  }

  async update(
    id: string,
    { name, category, currency, price }: IProduct,
  ): Promise<IProductResponse> {
    await this.validateProductId(id);

    const product: IProductUpdate = {};

    if (name) {
      product.name = name;
    }
    if (category) {
      product.category = category;
    }

    if (currency) {
      product.currency = currency;
    }

    if (price) {
      product.price = price;
    }

    await ProductRepository.update(id, product);

    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.validateProductId(id);

    await ProductRepository.remove(id);
  }

  private async validateProductId(id: string): Promise<IProductResponse> {
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
