export interface IFiltersRegex {
  $regex: string;
  $options: string;
}

export interface IFiltersClientRepository {
  name?: IFiltersRegex;
  cpf?: IFiltersRegex;
  birthday?: string | Date;
  email?: IFiltersRegex;
  cep?: IFiltersRegex;
  uf?: IFiltersRegex;
  city?: IFiltersRegex;
  address?: IFiltersRegex;
  number?: number;
  complement?: IFiltersRegex;
  neighborhood?: IFiltersRegex;
}

export interface IFiltersClientService {
  name?: string;
  cpf?: IFiltersRegex;
  birthday?: string | Date;
  password?: string;
  email?: string;
  cep?: string;
  uf?: string;
  city?: string;
  address?: string;
  number?: number;
  complement?: string;
  neighborhood?: string;
}

export interface IFiltersProductRepository {
  name?: IFiltersRegex;
  category?: IFiltersRegex;
  currency?: IFiltersRegex;
  price?: { $gte: number; $lte: number } | { $gte: number } | { $lte: number };
}
