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
  total: number;
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
  date: string | Date;
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

export interface ISaleResponsePageable {
  sales: ISaleResponse[];
  currentPage: number | undefined;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ISaleFilters {
  page: number;
  size: number;
  client: string;
  clientCurrency?: string;
  date: string | Date;
  product: string;
  minTotal: number;
  maxTotal: number;
}
