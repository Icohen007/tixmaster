import mongoose from 'mongoose';
import { OrderStatus } from '@tixmaster/common';
import Order from './Order';

interface TicketAttributes {
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attributes: TicketAttributes): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-use-before-define
ticketSchema.statics.build = (attributes: TicketAttributes) => new Ticket(attributes);
ticketSchema.methods.isReserved = async function () {
// this === the ticket document we called 'isReserved' on.
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete],
    },
  });

  return Boolean(existingOrder);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export default Ticket;
