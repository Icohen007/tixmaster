import {TicketCreatedEvent} from '@tixmaster/common';
import {Message} from 'node-nats-streaming';
import natsWrapper from '../../../NatsWrapper';
import Ticket from '../../../models/Ticket';
import {generateMongooseId} from '../../../test/helpers';
import TicketCreatedListener from '../TicketCreatedListener';

const setupTest = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: generateMongooseId(),
    title: 'title',
    price: 10,
    userId: generateMongooseId(),
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setupTest();
  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setupTest();

  await listener.onMessage(data, msg);

  expect(msg.ack).toBeCalled();
});
