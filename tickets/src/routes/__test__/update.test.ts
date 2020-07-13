import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import { createTicket, generateMongooseId, updateTicket } from '../../test/helpers';
import natsWrapper from '../../NatsWrapper';

it('when user does not signed in, returns 401', async () => {
  const id = generateMongooseId();
  const validParams = { title: 'title', price: 10 };

  await request(app)
    .put(`/api/tickets/${id}`)
    .send(validParams)
    .expect(401);
});

it('when id does not exist, returns 404', async () => {
  const id = generateMongooseId();
  const validParams = { title: 'title', price: 10 };

  await updateTicket(id, validParams).expect(404);
});

it('when user does not own the ticket, returns 401', async () => {
  const validParams = { title: 'title', price: 10 };
  const updatedParams = { title: 'title2', price: 20 };
  const response = await createTicket(validParams);

  await updateTicket(response.body.id, updatedParams).expect(401);
});

it('when user does not exist, returns 404', async () => {
});

it('when invalid title or price, returns 400', async () => {
  const validParams = { title: 'title', price: 10 };
  const invalidTitle = { title: '', price: 10 };
  const invalidPrice = { title: 'title', price: -10 };
  const cookie = global.signin();
  const response = await createTicket(validParams, cookie);

  await updateTicket(response.body.id, invalidTitle, cookie).expect(400);
  await updateTicket(response.body.id, invalidPrice, cookie).expect(400);
});

it('when valid params, update the ticket', async () => {
  const validParams = { title: 'title', price: 10 };
  const updatedParams = { title: 'title2', price: 20 };
  const cookie = global.signin();
  const response = await createTicket(validParams, cookie);

  await updateTicket(response.body.id, updatedParams, cookie).expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual(updatedParams.title);
  expect(ticketResponse.body.price).toEqual(updatedParams.price);
  expect(natsWrapper.client.publish).toBeCalled();
});
