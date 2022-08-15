import mongoose, { PaginateModel, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IClient } from '../interfaces/IClient';

const schema = new Schema<IClient>({
  name: { type: String, required: true },
  cpf: { type: String, required: true },
  birthday: { type: Date, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, min: 6 },
  cep: { type: String, required: true },
  uf: { type: String, required: true, min: 2, max: 2 },
  city: { type: String, required: true },
  address: { type: String, required: true },
  number: { type: Number, required: true },
  complement: { type: String, required: false },
  neighborhood: { type: String, required: true },
});

schema.plugin(mongoosePaginate);

const Client = mongoose.model<IClient, PaginateModel<IClient>>(
  'Client',
  schema,
);

export default Client;
