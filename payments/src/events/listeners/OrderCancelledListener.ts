import {
  Listener, OrderCancelledEvent, OrderStatus, Subjects,
} from '@tixmaster/common';
import { Message } from 'node-nats-streaming';
import Order from '../../models/Order';
import { paymentsService } from './consts';

class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  queueGroupName = paymentsService;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findByEvent(data);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}

export default OrderCancelledListener;
