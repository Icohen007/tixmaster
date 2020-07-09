import { Publisher, Subjects, TicketUpdatedEvent } from '@tixmaster/common';

export default class TicketUpdatedEventPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
