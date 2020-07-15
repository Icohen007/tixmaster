import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import Ticket from '../models/Ticket';

export const generateMongooseId = () => new mongoose.Types.ObjectId().toHexString();

export const createOrder = (orderParams: { ticketId: string }, cookie?: string[]) => (
  request(app)
    .post('/api/orders')
    .set('Cookie', cookie || global.signin())
    .send(orderParams)
);

export const insertTicketToDb = async () => {
  const ticket = Ticket.build({
    title: 'validTitle',
    price: 20,
  });

  await ticket.save();

  return ticket;
};
