import request from 'supertest';
import app from '../../app';

it('should response with current user', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  const { currentUser } = response.body;
  expect(currentUser.email).toEqual('test@test.com');
});

it('should response with null when not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body.currentUser).toBe(null);
});
