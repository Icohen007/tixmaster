import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@tixmaster/common';
import natsWrapper from '../../../NatsWrapper';
import Order from '../../../models/Order';
import { generateMongooseId } from '../../../test/helpers';
import OrderCreatedListener from '../OrderCreatedListener';

const setupTest = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: generateMongooseId(),
    version: 0,
    expiresAt: 'someDate',
    userId: generateMongooseId(),
    status: OrderStatus.Created,
    ticket: {
      id: generateMongooseId(),
      price: 10,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('replicates the order info, and ack the message', async () => {
  const { listener, data, msg } = await setupTest();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
  expect(order!.id).toEqual(data.id);
  expect(msg.ack).toHaveBeenCalled();
});
