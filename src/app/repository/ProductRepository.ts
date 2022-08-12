import { PaginateResult, Types } from 'mongoose';
import {
  IProduct,
  IProductFilters,
  IProductResponse,
} from '../interfaces/IProduct';

import ProductSchema from '../schema/ProductSchema';

class ProductRepository {
  async create(payload: IProduct): Promise<IProductResponse> {
    return ProductSchema.create(payload);
  }

  async find(
    payload: IProductFilters,
  ): Promise<PaginateResult<IProductResponse>> {
    const filter = this.filtersWithRegex(payload);

    const options = {
      select: {
        _id: '$_id',
        name: '$name',
        category: '$category',
        currency: '$currency',
        price: '$price',
      },

      page: payload.page,
      limit: payload.size,
    };

    return ProductSchema.paginate(filter, options);
  }

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

  filtersWithRegex({
    name,
    category,
    currency,
    minPrice,
    maxPrice,
  }: IProductFilters): Promise<any> {
    const filter: any = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (currency) {
      filter.currency = { $regex: currency, $options: 'i' };
    }

    if (minPrice && maxPrice) {
      filter.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      filter.price = { $gte: minPrice };
    } else if (maxPrice) {
      filter.price = { $lte: maxPrice };
    }

    return filter;
  }
}

export default new ProductRepository();
