import { Types } from 'mongoose';

export interface ISaleItems {
  product: Types.ObjectId;
  qtd: number;
}

export interface ISale {
  client: Types.ObjectId;
  clientCurrency: string;
  date: Date;
  items: ISaleItems[];
  total: number;
}
