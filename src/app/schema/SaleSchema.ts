import mongoose, { PaginateModel, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ISale, ISaleItems } from '../interfaces/ISale';

const itemSchema = new Schema<ISaleItems>({
  product: { type: Schema.Types.ObjectId, ref: 'Product._id', required: true },
  qtd: { type: Number, required: true },
  unitValue: { type: Number, required: true },
});

const schema = new Schema<ISale>({
  client: { type: Schema.Types.ObjectId, ref: 'Client._id', required: true },
  clientCurrency: { type: String, required: true, default: 'BRL' },
  date: { type: Date, required: true, default: Date.now() },
  items: { type: [itemSchema], required: true },
  total: { type: Number, required: true },
});

schema.plugin(mongoosePaginate);

const Sale = mongoose.model<ISale, PaginateModel<ISale>>('Sale', schema);

export default Sale;
