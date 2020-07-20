import { OrderStatus } from '@tixmaster/common';
import request from 'supertest';
import { createOrder, generateMongooseId } from '../../test/helpers';
import Ticket from '../../models/Ticket';
import Order from '../../models/Order';
import app from '../../app';
import natsWrapper from '../../NatsWrapper';

it('when user is not signed in, returns 401', async () => {
  await request(app)
    .post('/api/orders')
    .send({})
    .expect(401);
});

it('when empty ticketId, returns error', async () => {
  const emptyTicketId = { ticketId: '' };

  await createOrder(emptyTicketId).expect(400);
});

it('when not mongoose ticketId, returns error', async () => {
  const emptyTicketId = { ticketId: '123' };

  await createOrder(emptyTicketId).expect(400);
});

it('when ticket not exist, returns 404', async () => {
  await createOrder({ ticketId: generateMongooseId() })
    .expect(404);
});

it('when ticket already reserved, returns 400', async () => {
  const ticketParams = { id: generateMongooseId(), title: 'title', price: 10 };

  const ticket = Ticket.build(ticketParams);
  await ticket.save();

  const orderParams = {
    ticket,
    userId: 'userId',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  };

  const order = Order.build(orderParams);
  await order.save();

  await createOrder({ ticketId: ticket.id }).expect(400);
});

it('when correct parameters, order created and ticket reserved', async () => {
  const ticketParams = { id: generateMongooseId(), title: 'title', price: 10 };

  const ticket = Ticket.build(ticketParams);
  await ticket.save();

  const response = await createOrder({ ticketId: ticket.id }).expect(201);
  expect(response.body.status).toEqual(OrderStatus.Created);
  expect(response.body.ticket.id).toEqual(ticket.id);
});

it('emits an order created event', async () => {
  const ticketParams = { id: generateMongooseId(), title: 'title', price: 10 };

  const ticket = Ticket.build(ticketParams);
  await ticket.save();

  await createOrder({ ticketId: ticket.id }).expect(201);
  expect(natsWrapper.client.publish).toBeCalled();
});
