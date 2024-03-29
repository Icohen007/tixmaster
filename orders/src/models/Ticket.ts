import mongoose from 'mongoose';
import {OrderStatus} from '@tixmaster/common';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';
import Order from './Order';

interface TicketAttributes {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attributes: TicketAttributes): TicketDoc;
  findByEvent(event: { id: string, version: number}): Promise<TicketDoc | null>;
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
    },
  },
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

// eslint-disable-next-line @typescript-eslint/no-use-before-define
ticketSchema.statics.findByEvent = (event: { id: string, version: number}) => Ticket.findOne({
  _id: event.id,
  version: event.version - 1,
});

// eslint-disable-next-line @typescript-eslint/no-use-before-define
ticketSchema.statics.build = (attributes: TicketAttributes) => new Ticket({
  _id: attributes.id,
  title: attributes.title,
  price: attributes.price,
});
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
