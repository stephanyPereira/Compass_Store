import { format } from 'date-fns';
import ObjectId from 'mongoose';
import FormatPrice from '../../utils/FormatPrice';
import AppError from '../../errors/AppError';
import validateDate from '../../utils/ValidateDate';
import {
  ISale,
  ISaleFilters,
  ISaleItems,
  ISaleResponse,
  ISaleResponsePageable,
  ISaleUpdate,
} from '../interfaces/ISale';
import SaleRepository from '../repository/SaleRepository';
import ClientService from './ClientService';
import ProductService from './ProductService';
import QuotationRepository from '../repository/QuotationRepository';

class SaleService {
  async create(payload: ISale): Promise<ISaleResponse> {
    await ClientService.findById(payload.client.toString());

    const date = validateDate(payload.date.toString());

    const hasDuplicatedProducts: string[] = [];
    const products: ISaleItems[] = [];
    let total = 0;

    for (let i = 0; i < payload.items.length; i++) {
      const { price } = await ProductService.findById(
        payload.items[i].product.toString(),
      );

      hasDuplicatedProducts.push(payload.items[i].product.toString());

      total += payload.items[i].qtd * price;
      products.push({
        ...payload.items[i],
        unitValue: price,
      });
    }

    if (new Set(hasDuplicatedProducts).size !== hasDuplicatedProducts.length) {
      throw new AppError(
        'Please double-check your shipped items. Because duplicate products were sent',
      );
    }

    const sale = await SaleRepository.create({
      ...payload,
      date,
      items: products,
      total,
    });

    return this.findById(sale._id.toString());
  }

  async find(filters: ISaleFilters): Promise<ISaleResponsePageable> {
    const sale = await SaleRepository.find({
      page: filters.page ? +filters.page : 1,
      size: filters.size ? +filters.size : 10,
      minTotal: filters.minTotal ? +filters.minTotal : filters.minTotal,
      maxTotal: filters.maxTotal ? +filters.maxTotal : filters.maxTotal,
      date: filters.date ? validateDate(filters.date.toString()) : filters.date,
      client: filters.client ? filters.client.trim() : filters.client,
      product: filters.product ? filters.product.trim() : filters.product,
      clientCurrency: filters.clientCurrency
        ? filters.clientCurrency.trim()
        : filters.clientCurrency,
    });

    if (sale.docs.length === 0) {
      throw new AppError('No data found for your search');
    }

    const sales: ISaleResponse[] = [];

    for (let i = 0; i < sale.docs.length; i++) {
      const ask = await QuotationRepository.find(sale.docs[i].clientCurrency);

      const totalClient = FormatPrice(
        ask * sale.docs[i].total,
        sale.docs[i].clientCurrency,
      );

      sales.push({
        _id: sale.docs[i]._id,
        client: sale.docs[i].client,
        clientCurrency: sale.docs[i].clientCurrency,
        date: format(new Date(sale.docs[i].date), 'dd/MM/yyyy'),
        items: sale.docs[i].items,
        total: sale.docs[i].total,
        totalClient,
      });
    }

    return {
      sales,
      currentPage: sale.page,
      pageSize: sale.limit,
      totalCount: sale.totalDocs,
      totalPages: sale.totalPages,
    };
  }

  async findById(id: string): Promise<ISaleResponse> {
    const sale = await this.validateIDSale(id);

    const ask = await QuotationRepository.find(sale.clientCurrency);

    const totalClient = FormatPrice(ask * sale.total, sale.clientCurrency);

    return {
      _id: sale._id,
      client: sale.client,
      clientCurrency: sale.clientCurrency,
      date: format(new Date(sale.date), 'dd/MM/yyyy'),
      items: sale.items,
      total: sale.total,
      totalClient,
    };
  }

  async update(
    id: string,
    { clientCurrency, items }: ISaleUpdate,
  ): Promise<ISaleResponse> {
    await this.validateIDSale(id);

    const sale: ISaleUpdate = {};
    const products: ISaleItems[] = [];
    let total = 0;

    if (clientCurrency) {
      sale.clientCurrency = clientCurrency;
    }

    if (items && items.length !== 0) {
      const hasDuplicatedProducts: string[] = [];

      for (let i = 0; i < items.length; i++) {
        if (items[i].product) {
          const { price } = await ProductService.findById(
            items[i].product.toString(),
          );

          hasDuplicatedProducts.push(items[i].product.toString());

          total += items[i].qtd * price;
          products.push({
            ...items[i],
            unitValue: price,
          });
        }
      }

      if (products.length > 0) {
        sale.items = products;
      }

      if (total !== 0) {
        sale.total = total;
      }

      if (
        new Set(hasDuplicatedProducts).size !== hasDuplicatedProducts.length
      ) {
        throw new AppError(
          'Please double-check your shipped items. Because duplicate products were sent',
        );
      }
    }

    sale.date = new Date();

    await SaleRepository.update(id, sale);

    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.validateIDSale(id);

    await SaleRepository.delete(id);
  }

  private async validateIDSale(id: string): Promise<ISaleResponse> {
    if (!ObjectId.isValidObjectId(id)) {
      throw new AppError('Id entered is not valid');
    }
    const sale = await SaleRepository.findById(id);

    if (!sale) {
      throw new AppError('Sale not found', 404, 'Not Found');
    }

    return sale;
  }
}

export default new SaleService();
