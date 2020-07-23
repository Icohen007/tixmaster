import mongoose from 'mongoose';
import { OrderStatus } from '@tixmaster/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttributes {
  id: string;
  userId: string;
  status: OrderStatus;
  version: number;
  price: number;
}
// id not included, already defined in mongoose
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  version: number;
  price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attributes: OrderAttributes): OrderDoc;
}
// version not included, automatically added by mongoose.
const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created,
  },
  price: {
    type: Number,
    required: true,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
});

OrderSchema.set('versionKey', 'version');
OrderSchema.plugin(updateIfCurrentPlugin);

// eslint-disable-next-line @typescript-eslint/no-use-before-define
OrderSchema.statics.build = (attributes: OrderAttributes) => new Order({
  _id: attributes.id,
  version: attributes.version,
  price: attributes.price,
  userId: attributes.userId,
  status: attributes.status,
});

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema);

export default Order;
