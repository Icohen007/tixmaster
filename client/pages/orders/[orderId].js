import { useEffect, useRef, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/useRequest';
import ErrorMessage from '../../components/ErrorMessage';

const OrderDetails = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const timerId = useRef(null);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => console.log(payment),
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    calculateTimeLeft();
    timerId.current = setInterval(calculateTimeLeft, 1000);

    return () => {
      clearInterval(timerId.current);
    };
  }, [order]);

  if (timeLeft < 0) {
    clearInterval(timerId.current);
    return <div>Order Expired</div>;
  }

  return (
    <div>
      {`Time left to pay: ${timeLeft} seconds`}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_8HkOtV2i3ql6AXqHVDO6RDim00xze9gBKa"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors.length > 0 && <ErrorMessage errors={errors} />}
    </div>
  );
};

OrderDetails.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderDetails;
