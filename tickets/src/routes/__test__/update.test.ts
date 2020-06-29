import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import { createTicket, generateMongooseId, updateTicket } from '../../test/helpers';

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

});

it('when valid params, update the ticket', async () => {

});
