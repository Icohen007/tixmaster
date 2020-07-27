import PropTypes from 'prop-types';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';
import ErrorMessage from '../../components/ErrorMessage';

const TicketDetails = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>
        Price:
        {ticket.price}
      </h4>
      {errors.length > 0 && <ErrorMessage errors={errors} />}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

TicketDetails.getInitialProps = async (ctx, client) => {
  const { ticketId } = ctx.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

TicketDetails.propTypes = {
  ticket: PropTypes.shape({
    id: PropTypes.string,
    price: PropTypes.number,
    title: PropTypes.string,
  }).isRequired,
};

export default TicketDetails;
