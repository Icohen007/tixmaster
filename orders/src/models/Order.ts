import mongoose from 'mongoose';
import { OrderStatus } from '@tixmaster/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { TicketDoc } from './Ticket';

interface OrderAttributes {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attributes: OrderAttributes): OrderDoc;
}

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
  expiresAt: {
    type: mongoose.Schema.Types.Date, // not required, for example: after ticket has paid.
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
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
OrderSchema.statics.build = (attributes: OrderAttributes) => new Order(attributes);

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema);

export default Order;
