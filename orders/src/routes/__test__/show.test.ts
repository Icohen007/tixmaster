import request from 'supertest';
import app from '../../app';
import { createOrder, generateMongooseId, insertTicketToDb } from '../../test/helpers';

it('when user is not authenticated, return 401', async () => {
  await request(app)
    .get(`/api/orders/${generateMongooseId()}`)
    .send()
    .expect(401);
});

it('when order is not exist, return 404', async () => {
  const cookie = global.signin();

  await request(app)
    .get(`/api/orders/${generateMongooseId()}`)
    .set('Cookie', cookie)
    .send()
    .expect(404);
});

it('when one user try to fetch another user order, returns 401', async () => {
  const ticket = await insertTicketToDb();
  const cookie1 = global.signin();
  const { body: order } = await createOrder({ ticketId: ticket.id }, cookie1).expect(201);

  const cookie2 = global.signin();
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', cookie2)
    .send()
    .expect(401);
});

it('when order is exist, fetch the order', async () => {
  const ticket = await insertTicketToDb();
  const cookie = global.signin();
  const { body: order } = await createOrder({ ticketId: ticket.id }, cookie).expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});
