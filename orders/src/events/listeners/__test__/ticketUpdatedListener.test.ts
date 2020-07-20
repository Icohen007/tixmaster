import {TicketUpdatedEvent} from '@tixmaster/common';
import {Message} from 'node-nats-streaming';
import natsWrapper from '../../../NatsWrapper';
import Ticket from '../../../models/Ticket';
import {generateMongooseId} from '../../../test/helpers';
import TicketUpdatedListener from '../TicketUpdatedListener';

const setupTest = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: generateMongooseId(),
    title: 'title',
    price: 10,
  });
  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'title2',
    price: 15,
    userId: generateMongooseId(),
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg };
};

it('finds, updates, and saves a ticket', async () => {
  const { listener, data, msg } = await setupTest();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(data.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setupTest();

  await listener.onMessage(data, msg);

  expect(msg.ack).toBeCalled();
});

it('does not ack if event version is not match', async () => {
  const { listener, data, msg } = await setupTest();
  data.version = 10;

  await expect(listener.onMessage(data, msg)).rejects.toThrow();
  expect(msg.ack).not.toBeCalled();
});
