import { PaginateResult, Types } from 'mongoose';
import filterData from '../../utils/FilterData';
import { IFilter } from '../interfaces/IFilters';
import {
  IProduct,
  IProductFilters,
  IProductResponse,
  IProductUpdate,
} from '../interfaces/IProduct';

import ProductSchema from '../schema/ProductSchema';

class ProductRepository {
  async create(payload: IProduct): Promise<IProductResponse> {
    return ProductSchema.create(payload);
  }

  async find({
    name,
    category,
    currency,
    minPrice,
    maxPrice,
    page,
    size,
  }: IProductFilters): Promise<PaginateResult<IProductResponse>> {
    const parsedFilters: IFilter[] = [
      {
        field: 'name',
        value: name,
        regex: { $regex: name, $options: 'i' },
      },
      {
        field: 'category',
        value: category,
        regex: { $regex: category, $options: 'i' },
      },
      {
        field: 'currency',
        value: currency,
        regex: { $regex: currency, $options: 'i' },
      },
    ];

    if (minPrice && maxPrice) {
      parsedFilters.push({
        field: 'price',
        value: minPrice,
        regex: { $gte: minPrice, $lte: maxPrice },
      });
    } else if (minPrice) {
      parsedFilters.push({
        field: 'price',
        value: minPrice,
        regex: { $gte: minPrice },
      });
    } else if (maxPrice) {
      parsedFilters.push({
        field: 'price',
        value: maxPrice,
        regex: { $lte: maxPrice },
      });
    }

    const filter = filterData(parsedFilters);

    const options = {
      select: {
        _id: '$_id',
        name: '$name',
        category: '$category',
        currency: '$currency',
        price: '$price',
      },
      page,
      limit: size,
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

  async update(id: string, payload: IProductUpdate): Promise<void> {
    await ProductSchema.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      payload,
    );
  }

  async remove(id: string): Promise<void> {
    await ProductSchema.deleteOne({ _id: new Types.ObjectId(id) });
  }
}

export default new ProductRepository();
