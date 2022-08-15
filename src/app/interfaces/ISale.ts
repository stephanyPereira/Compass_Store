import { Types } from 'mongoose';

export interface ISaleItems {
  product: Types.ObjectId;
  qtd: number;
  unitValue?: number;
}

export interface ISale {
  client: Types.ObjectId;
  clientCurrency: string;
  date: Date;
  items: ISaleItems[];
  total?: number;
}

export interface ISaleItemsResponseCreate {
  product: Types.ObjectId;
  qtd: number;
}

export interface ISaleResponseCreate {
  _id: Types.ObjectId;
  client: Types.ObjectId;
  clientCurrency: string;
  date: Date;
  items: ISaleItemsResponseCreate[];
}

export interface ISaleItemsResponse {
  product: Types.ObjectId;
  qtd: number;
  unitValue: number;
}

export interface ISaleResponse {
  _id: Types.ObjectId;
  client: Types.ObjectId;
  clientCurrency: string;
  date: string;
  items: ISaleItemsResponseCreate[];
  total: number;
  totalClient?: string;
}

export interface ISaleUpdate {
  clientCurrency?: string;
  date?: Date;
  items?: ISaleItems[];
  total?: number;
}
