import { OrderStatus } from '@tixmaster/common';
import { createPayment, createPaymentWithUserId, generateMongooseId } from '../../test/helpers';
import Order from '../../models/Order';

it('when order does not exist, returns 404', async () => {
  const paymentParams = { token: 'token', orderId: generateMongooseId() };
  await createPayment(paymentParams).expect(404);
});

it('when order does not match user, returns 401', async () => {
  const order = await Order.build({
    id: generateMongooseId(),
    userId: generateMongooseId(),
    version: 0,
    status: OrderStatus.Created,
    price: 15,
  });
  await order.save();

  const paymentParams = { token: 'token', orderId: order.id };

  await createPayment(paymentParams).expect(401);
});

it('when order already cancelled, returns 400', async () => {
  const userId = generateMongooseId();
  const order = await Order.build({
    id: generateMongooseId(),
    userId,
    version: 0,
    status: OrderStatus.Cancelled,
    price: 15,
  });
  await order.save();

  const paymentParams = { token: 'token', orderId: order.id };

  await createPaymentWithUserId(userId, paymentParams).expect(400);
});
