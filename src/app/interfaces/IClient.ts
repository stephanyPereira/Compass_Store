import { Types } from 'mongoose';

export interface IClient {
  name: string;
  cpf: string;
  birthday: Date;
  email: string;
  password: string;
  cep: string;
  uf: string;
  city: string;
  address: string;
  number: number;
  complement?: string;
  neighborhood: string;
}

export interface IClientResponse {
  name: string;
  cpf: string;
  birthday: string | Date;
  email: string;
  cep: string;
  uf: string;
  city: string;
  address: string;
  number: number;
  complement?: string;
  neighborhood: string;
  _id: Types.ObjectId;
}

export interface IClientBody {
  name: string;
  cpf: string;
  birthday: string;
  email: string;
  password: string;
  cep: string;
  number: number;
}
