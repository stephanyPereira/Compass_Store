import { PaginateResult, Types } from 'mongoose';
import filterData from '../../utils/FilterData';
import { IFilter } from '../interfaces/IFilters';
import {
  ISale,
  ISaleFilters,
  ISaleResponse,
  ISaleResponseCreate,
  ISaleUpdate,
} from '../interfaces/ISale';
import SaleSchema from '../schema/SaleSchema';

class SaleRepository {
  async create(payload: ISale): Promise<ISaleResponseCreate> {
    return SaleSchema.create(payload);
  }

  async find({
    page,
    size,
    client,
    clientCurrency,
    date,
    maxTotal,
    minTotal,
    product,
  }: ISaleFilters): Promise<PaginateResult<ISaleResponse>> {
    const options = {
      page,
      limit: size,
    };

    const parsedFilters: IFilter[] = [
      {
        field: 'client',
        value: client,
        regex: new Types.ObjectId(client),
      },
      {
        field: 'clientCurrency',
        value: clientCurrency,
        regex: { $regex: clientCurrency, $options: 'i' },
      },
      {
        field: 'date',
        value: date,
        regex: date,
      },
      {
        field: 'items.product',
        value: product,
        regex: new Types.ObjectId(product),
      },
    ];

    if (minTotal && maxTotal) {
      parsedFilters.push({
        field: 'total',
        value: minTotal,
        regex: { $gte: minTotal, $lte: maxTotal },
      });
    } else if (minTotal) {
      parsedFilters.push({
        field: 'total',
        value: minTotal,
        regex: { $gte: minTotal },
      });
    } else if (maxTotal) {
      parsedFilters.push({
        field: 'total',
        value: maxTotal,
        regex: { $lte: maxTotal },
      });
    }

    const filter = filterData(parsedFilters);

    return SaleSchema.paginate(filter, options);
  }

  async findById(id: string): Promise<ISaleResponse | null> {
    return SaleSchema.findById(id);
  }

  async update(id: string, payload: ISaleUpdate): Promise<void> {
    await SaleSchema.findOneAndUpdate({ _id: new Types.ObjectId(id) }, payload);
  }

  async delete(id: string): Promise<void> {
    await SaleSchema.findByIdAndDelete(id);
  }
}

export default new SaleRepository();
