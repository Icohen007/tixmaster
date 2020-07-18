import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketCreatedEvent } from '@tixmaster/common';
import Ticket from '../../models/Ticket';
import { ordersService } from './consts';

class TicktCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;

  queueGroupName = ordersService; // any time event goes to ticket:created channel the event will go to ONLY one of the members of queueGroup

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({ id, title, price });
    await ticket.save();

    msg.ack();
  }
}

export default TicktCreatedListener;
