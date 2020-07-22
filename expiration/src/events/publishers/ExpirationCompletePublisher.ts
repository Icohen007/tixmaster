import { ExpirationCompleteEvent, Publisher, Subjects } from '@tixmaster/common';

class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

export default ExpirationCompletePublisher;
