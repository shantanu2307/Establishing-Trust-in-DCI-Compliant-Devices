import '../styles/globals.css'
import AppContext from '../contexts/AppContext'

function MyApp({ Component, pageProps }) {
  return (
    <AppContext.Provider value={{
      user: {
        loggedIn: false,
        role: 'guest'
      }
    }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp
