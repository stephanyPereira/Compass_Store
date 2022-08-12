import mongoose, { PaginateModel, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IProduct } from '../interfaces/IProduct';

const schema = new Schema<IProduct>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  currency: { type: String, required: true, default: 'USD' },
  price: { type: Number, required: true },
});

schema.plugin(mongoosePaginate);

const User = mongoose.model<IProduct, PaginateModel<IProduct>>(
  'Product',
  schema,
);

export default User;
