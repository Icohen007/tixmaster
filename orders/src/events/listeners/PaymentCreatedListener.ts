import {
  Listener, OrderStatus, PaymentCreatedEvent, Subjects,
} from '@tixmaster/common';
import { Message } from 'node-nats-streaming';
import { ordersService } from './consts';
import Order from '../../models/Order';

class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

  queueGroupName = ordersService;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();

    // no need to publish order:updated because after 'Complete' there are no updates

    msg.ack();
  }
}

export default PaymentCreatedListener;
