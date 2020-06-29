import request from 'supertest';
import app from '../../app';
import { createTicket } from '../../test/helpers';

it('when tickets are available is not found, returns them', async () => {
  const validParams = { title: 'title', price: 10 };

  await createTicket(validParams);
  await createTicket(validParams);

  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
});
