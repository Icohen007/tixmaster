import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';

export const generateMongooseId = () => new mongoose.Types.ObjectId().toHexString();

export const createOrder = (orderParams: { ticketId: string }, cookie?: string[]) => (
  request(app)
    .post('/api/orders')
    .set('Cookie', cookie || global.signin())
    .send(orderParams)
);
