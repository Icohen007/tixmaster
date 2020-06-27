import request from 'supertest';
import app from '../../app';

it('has route handler listening to /api/tickets', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('user should be signed in', async () => {

});

it('when invalid title, returns error', async () => {

});

it('when invalid price, returns error', async () => {

});

it('when vaild parameters, create ticket', async () => {

});
