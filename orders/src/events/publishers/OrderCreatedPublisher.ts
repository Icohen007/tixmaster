import { OrderCreatedEvent, Publisher, Subjects } from '@tixmaster/common';

export default class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
