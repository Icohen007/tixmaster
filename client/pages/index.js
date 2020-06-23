import axiosFactory from '../api/axiosFactory';

const LandingPage = ({ currentUser }) => (
  currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  ));

export async function getServerSideProps(context) {
  const axios = axiosFactory(context);
  const { data } = await axios.get('/api/users/currentuser');

  return { props: data };
}

export default LandingPage;
