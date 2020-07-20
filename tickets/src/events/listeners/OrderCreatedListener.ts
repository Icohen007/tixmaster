import { Listener, OrderCreatedEvent, Subjects } from '@tixmaster/common';
import { Message } from 'node-nats-streaming';
import { ticketsService } from './consts';
import Ticket from '../../models/Ticket';

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = ticketsService;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: data.id });
    await ticket.save();

    msg.ack();
  }
}

export default OrderCreatedListener;
