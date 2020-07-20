import { OrderCreatedEvent, OrderStatus } from '@tixmaster/common';
import { Message } from 'node-nats-streaming';
import OrderCreatedListener from '../OrderCreatedListener';
import natsWrapper from '../../../NatsWrapper';
import Ticket from '../../../models/Ticket';
import { generateMongooseId } from '../../../test/helpers';

const setupTest = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'title',
    price: 10,
    userId: generateMongooseId(),
  });
  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: generateMongooseId(),
    version: 0,
    status: OrderStatus.Created,
    userId: generateMongooseId(),
    expiresAt: 'date',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener, data, msg, ticket,
  };
};

it('sets the orderId of the ticket', async () => {
  const {
    listener, data, msg, ticket,
  } = await setupTest();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const {
    listener, data, msg,
  } = await setupTest();

  await listener.onMessage(data, msg);

  expect(msg.ack).toBeCalled();
});

it('publish ticket update event', async () => {
  const { listener, data, msg } = await setupTest();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toBeCalled();

  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(ticketUpdatedData.orderId).toEqual(data.id);
});
