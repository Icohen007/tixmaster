import request from 'supertest';
import app from '../../app';
import Ticket from '../../models/Ticket';

it('has route handler listening to POST /api/tickets', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('when user is not signed in, returns 401', async () => {
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401);
});

it('when empty title, returns error', async () => {
  const emptyTitle = { title: '', price: 10 };

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(emptyTitle)
    .expect(400);
});

it('when without title, returns error', async () => {
  const withoutTitle = { price: 10 };

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(withoutTitle)
    .expect(400);
});

it('when negative price, returns error', async () => {
  const negativePrice = { title: 'title', price: -10 };

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(negativePrice)
    .expect(400);
});

it('when without price, returns error', async () => {
  const withoutPrice = { title: 'title' };

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(withoutPrice)
    .expect(400);
});

it('db init with no tickets', async () => {
  const tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
});

it('when vaild parameters, create ticket', async () => {
  const validParams = { title: 'title', price: 10 };

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(validParams)
    .expect(201);

  const tickets = await Ticket.find({ title: validParams.title });
  expect(tickets[0].title).toEqual(validParams.title);
  expect(tickets[0].price).toEqual(validParams.price);
});
