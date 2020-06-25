import axiosFactory from '../api/axiosFactory';

const LandingPage = ({ currentUser }) => (
  currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  ));

LandingPage.getInitialProps = async (ctx) => {
  const client = axiosFactory(ctx);
  const { data } = await client.get('/api/users/currentuser');

  return data;
};

export default LandingPage;
