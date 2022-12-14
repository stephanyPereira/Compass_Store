import { Types } from 'mongoose';

export interface IFiltersRegex {
  $regex?: string | undefined;
  $options?: string;
  $gte?: number;
  $lte?: number;
}

export interface IMatchData {
  [key: string]:
    | IFiltersRegex
    | Date
    | number
    | string
    | undefined
    | Types.ObjectId;
}

export interface IFilter {
  field: string;
  value: string | Date | number | undefined;
  regex: IFiltersRegex | Date | number | string | undefined | Types.ObjectId;
}

export interface IFiltersProductRepository {
  name?: IFiltersRegex;
  category?: IFiltersRegex;
  currency?: IFiltersRegex;
  price?: { $gte: number; $lte: number } | { $gte: number } | { $lte: number };
}
