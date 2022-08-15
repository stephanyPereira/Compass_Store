import { formatCurrency } from '@brazilian-utils/brazilian-utils';
import axios from 'axios';
import { format } from 'date-fns';
import ObjectId from 'mongoose';
import AppError from '../../errors/AppError';
import validateDate from '../../utils/ValidateDate';
import { ISale, ISaleItems, ISaleResponse } from '../interfaces/ISale';
import SaleRepository from '../repository/SaleRepository';
import ClientService from './ClientService';
import ProductService from './ProductService';

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
      if (payload.items[i].qtd <= 0) {
        throw new AppError(
          `Value informed for qtd is less than or equal to zero in the product: ${payload.items[i].product}`,
        );
      }
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

  // async find(): Promise<any> {}

  async findById(id: string): Promise<ISaleResponse> {
    const sale = await this.validateIDSale(id);

    const { data } = await axios.get(
      `https://economia.awesomeapi.com.br/USD-${sale.clientCurrency}/1`,
    );

    return {
      _id: sale._id,
      client: sale.client,
      clientCurrency: sale.clientCurrency,
      date: format(new Date(sale.date), 'dd/MM/yyyy'),
      items: sale.items,
      total: sale.total,
      totalClient: formatCurrency(data[0].ask * sale.total, {
        precision: 2,
      }),
    };
  }

  // async update(): Promise<any> {}
  // async remove(): Promise<any> {}

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
