import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';

export const generateMongooseId = () => new mongoose.Types.ObjectId().toHexString();

export const createTicket = (ticketParams: { price?: number; title?: string }, cookie?: string[]) => (
  request(app)
    .post('/api/tickets')
    .set('Cookie', cookie || global.signin())
    .send(ticketParams)
);

export const updateTicket = (ticketId: string, ticketParams: { price?: number; title?: string }, cookie?: string[]) => (
  request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie || global.signin())
    .send(ticketParams)
);
