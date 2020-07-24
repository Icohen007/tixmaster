import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';

export const generateMongooseId = () => new mongoose.Types.ObjectId().toHexString();

export const createPayment = (paymentParams: { orderId?: string; token?: string }, cookie?: string[]) => (
  request(app)
    .post('/api/payments')
    .set('Cookie', cookie || global.signin())
    .send(paymentParams)
);

export const createPaymentWithUserId = (userId: string, paymentParams: { orderId?: string; token?: string }, cookie?: string[]) => (
  request(app)
    .post('/api/payments')
    .set('Cookie', cookie || global.signin(userId))
    .send(paymentParams)
);
