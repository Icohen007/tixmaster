import { Publisher, Subjects, TicketCreatedEvent } from '@tixmaster/common';

export default class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
