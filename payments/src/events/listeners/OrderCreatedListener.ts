import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@tixmaster/common';
import { paymentsService } from './consts';
import Order from '../../models/Order';

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated ;

  queueGroupName = paymentsService;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    await order.save();

    msg.ack();
  }
}

export default OrderCreatedListener;
