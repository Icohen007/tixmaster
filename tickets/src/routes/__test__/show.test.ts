import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';

it('when ticket is not found, returns 404', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});

it('when ticket is found, returns 200', async () => {
  const validParams = { title: 'title', price: 10 };

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(validParams)
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(validParams.title);
  expect(ticketResponse.body.price).toEqual(validParams.price);
});
