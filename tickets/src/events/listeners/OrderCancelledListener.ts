import { Listener, OrderCancelledEvent, Subjects } from '@tixmaster/common';
import { Message } from 'node-nats-streaming';
import { ticketsService } from './consts';
import Ticket from '../../models/Ticket';
import TicketUpdatedPublisher from '../publishers/TicketUpdatedPublisher';

class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  queueGroupName = ticketsService;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: undefined });
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

export default OrderCancelledListener;
