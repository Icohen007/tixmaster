import request from 'supertest';
import app from '../../app';

it('has route handler listening to /api/tickets', async () => {
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

it('when user is signed in, returns 200', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({})
    .expect(200);
});

it('when invalid title, returns error', async () => {

});

it('when invalid price, returns error', async () => {

});

it('when vaild parameters, create ticket', async () => {

});
