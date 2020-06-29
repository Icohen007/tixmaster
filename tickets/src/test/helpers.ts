import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';

export const generateMongooseId = () => new mongoose.Types.ObjectId().toHexString();

export const createTicket = (ticketParams: { price: number; title: string }) => (
  request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(ticketParams)
    .expect(201)
);
