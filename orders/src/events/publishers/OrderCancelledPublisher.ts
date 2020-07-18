import { OrderCancelledEvent, Publisher, Subjects } from '@tixmaster/common';

export default class OrderCancelledublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
