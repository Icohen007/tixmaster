import { ExpirationCompleteEvent, OrderStatus } from '@tixmaster/common';
import { Message } from 'node-nats-streaming';
import natsWrapper from '../../../NatsWrapper';
import { generateMongooseId } from '../../../test/helpers';
import Ticket from '../../../models/Ticket';
import Order from '../../../models/Order';
import ExpirationCompleteListener from '../ExpirationCompleteListener';

const setupTest = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: generateMongooseId(),
    title: 'title',
    price: 10,
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: generateMongooseId(),
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return {
    listener, data, msg, order,
  };
};

it('updates the order status to cancelled, emit an OrderCancelledEvent, and ack the message', async () => {
  const {
    listener, data, msg, order,
  } = await setupTest();

  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  expect(natsWrapper.client.publish).toBeCalled();
  const orderUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(orderUpdatedData.id).toEqual(order.id);
  expect(msg.ack).toBeCalled();
});
