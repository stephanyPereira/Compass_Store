import { Types } from 'mongoose';

export interface IProduct {
  name: string;
  category: string;
  currency: string;
  price: number;
}

export interface IProductResponse {
  _id: Types.ObjectId;
  name: string;
  category: string;
  currency: string;
  price: number;
}

export interface IProductResponsePageable {
  products: IProductResponse[];
  currentPage: number | undefined;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface IProductFilters {
  name: string;
  category: string;
  currency: string;
  minPrice: number;
  maxPrice: number;
  page: number;
  size: number;
}

export interface IProductUpdate {
  name?: string;
  category?: string;
  currency?: string;
  price?: number;
}
