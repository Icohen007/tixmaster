import { OrderCancelledEvent, OrderStatus } from '@tixmaster/common';
import { Message } from 'node-nats-streaming';
import OrderCancelledListener from '../OrderCancelledListener';
import natsWrapper from '../../../NatsWrapper';
import Ticket from '../../../models/Ticket';
import { generateMongooseId } from '../../../test/helpers';

const setupTest = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const orderId = generateMongooseId();

  const ticket = Ticket.build({
    title: 'title',
    price: 10,
    userId: generateMongooseId(),
  });
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener, data, msg, orderId, ticket,
  };
};

it('sets the orderId of the ticket, publish an event and acks the message', async () => {
  const {
    listener, data, msg, ticket,
  } = await setupTest();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toBeCalled();
  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(ticketUpdatedData.orderId).not.toBeDefined();
});
