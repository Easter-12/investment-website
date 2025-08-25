import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget'; // 1. Import the new component

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>QuantumLeap Investments</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />

      {/* 2. Add the ChatWidget here, outside of the main content */}
      <ChatWidget />
    </div>
  );
}

export default MyApp;