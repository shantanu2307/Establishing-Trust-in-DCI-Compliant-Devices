import '../styles/globals.css'
import AppContextProvider from '../contexts/AppContext';
import Footer from '../components/Footer';
function MyApp({ Component, pageProps }) {
  return (
    <AppContextProvider>
      <Component {...pageProps} />
    </AppContextProvider>
  );
}

export default MyApp
