import request from 'supertest';
import app from '../../app';
import Ticket from '../../models/Ticket';
import { createOrder } from '../../test/helpers';

const insertTicketToDb = async () => {
  const ticket = Ticket.build({
    title: 'validTitle',
    price: 20,
  });

  await ticket.save();

  return ticket;
};

it('when orders created for two users, get only user own orders', async () => {
  const ticket1 = await insertTicketToDb();
  const ticket2 = await insertTicketToDb();
  const ticket3 = await insertTicketToDb();
  const cookie1 = global.signin();
  const cookie2 = global.signin();
  await createOrder({ ticketId: ticket1.id }, cookie1);
  const { body: order2 } = await createOrder({ ticketId: ticket2.id }, cookie2);
  const { body: order3 } = await createOrder({ ticketId: ticket3.id }, cookie2);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', cookie2)
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order2.id);
  expect(response.body[1].id).toEqual(order3.id);
  expect(response.body[0].ticket.id).toEqual(ticket2.id);
  expect(response.body[1].ticket.id).toEqual(ticket3.id);
});
