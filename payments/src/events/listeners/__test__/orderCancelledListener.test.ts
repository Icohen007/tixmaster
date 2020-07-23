import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@tixmaster/common';
import natsWrapper from '../../../NatsWrapper';
import Order from '../../../models/Order';
import { generateMongooseId } from '../../../test/helpers';
import OrderCancelledListener from '../OrderCancelledListener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: generateMongooseId(),
    status: OrderStatus.Created,
    price: 10,
    userId: generateMongooseId(),
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: generateMongooseId(),
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener, data, msg, order,
  };
};

it('updates the status of the order to cancelled, and ack the message', async () => {
  const {
    listener, data, msg, order,
  } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.id).toBe(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  expect(msg.ack).toHaveBeenCalled();
});
