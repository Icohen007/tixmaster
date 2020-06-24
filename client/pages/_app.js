import 'bootstrap/dist/css/bootstrap.css';
import axiosFactory from '../api/axiosFactory';
import Header from '../components/Header';

const AppComponent = ({ Component, pageProps, currentUser }) => (
  <div>
    <h1>
      <Header currentUser={currentUser} />
    </h1>
    <Component {...pageProps} currentUser={currentUser} />
  </div>
);

AppComponent.getInitialProps = async ({ Component, ctx }) => {
  const client = axiosFactory(ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
