import request from 'supertest';
import app from '../../app';
import { createTicket, generateMongooseId } from '../../test/helpers';

it('when ticket is not found, returns 404', async () => {
  const id = generateMongooseId();

  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});

it('when ticket is found, returns 200', async () => {
  const validParams = { title: 'title', price: 10 };
  const response = await createTicket(validParams);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(validParams.title);
  expect(ticketResponse.body.price).toEqual(validParams.price);
});
