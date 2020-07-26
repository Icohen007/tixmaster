import { PaymentCreatedEvent, Publisher, Subjects } from '@tixmaster/common';

export default class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
