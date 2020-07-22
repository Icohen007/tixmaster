import { Message } from 'node-nats-streaming';
import {
  Listener, Subjects, ExpirationCompleteEvent, OrderStatus,
} from '@tixmaster/common';
import Order from '../../models/Order';
import natsWrapper from '../../NatsWrapper';
import OrderCancelledublisher from '../publishers/OrderCancelledPublisher';
import { ordersService } from './consts';

class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  queueGroupName = ordersService;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const { orderId } = data;
    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    await new OrderCancelledublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: { id: order.ticket.id },
    });

    msg.ack();
  }
}

export default ExpirationCompleteListener;
