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
