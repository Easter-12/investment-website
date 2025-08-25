import '../styles/globals.css';
import type { AppProps } from 'next/app';

// Import our Header and Footer components
import Header from '../components/Header';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // This is the main container for the entire app
    <div>
      {/* The Header will now be at the top of EVERY page */}
      <Header />

      {/* This 'main' section holds the content of the current page (e.g., homepage or signup page) */}
      <main>
        <Component {...pageProps} />
      </main>

      {/* The Footer will now be at the bottom of EVERY page */}
      <Footer />
    </div>
  );
}

export default MyApp;