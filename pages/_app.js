import '../styles/globals.css';
import AppContextProvider from '../contexts/AppContext';
import { SWRConfig } from 'swr';
import instance from '../axios.config';

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url) =>
          instance.get(url).then((res) => {
            console.log(res.data);
            return res.data;
          }),
      }}
    >
      <AppContextProvider>
        <Component {...pageProps} />
      </AppContextProvider>
    </SWRConfig>
  );
}

export default MyApp;
