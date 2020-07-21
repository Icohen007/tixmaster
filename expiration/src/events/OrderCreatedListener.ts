import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@tixmaster/common';
import expirationQueue from '../queues/expirationQueue';
import { expirationService } from './consts';

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated ;

  queueGroupName = expirationService;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    await expirationQueue.add({
      orderId: data.id,
    }, { delay });

    msg.ack();
  }
}

export default OrderCreatedListener;
