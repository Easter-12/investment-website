import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head'; // Import the Head component

import Header from '../components/Header';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      {/* This Head component adds things to the <head> of our HTML */}
      <Head>
        <title>QuantumLeap Investments</title>
        {/* THIS IS THE CRUCIAL LINE FOR MOBILE DEVICES */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

export default MyApp;