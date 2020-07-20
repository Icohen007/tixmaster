import { Listener, OrderCreatedEvent, Subjects } from '@tixmaster/common';
import { Message } from 'node-nats-streaming';
import { ticketsService } from './consts';
import Ticket from '../../models/Ticket';
import TicketUpdatedPublisher from '../publishers/TicketUpdatedPublisher';

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

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    msg.ack();
  }
}

export default OrderCreatedListener;
