import axiosFactory from '../api/axiosFactory';

const LandingPage = ({ currentUser }) => (
  currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  ));

LandingPage.getInitialProps = async (ctx, client, currentUser) => ({});

export default LandingPage;
