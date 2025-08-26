import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script'; // Import the Script component
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="page-background">
      <Head>
        <title>QuantumLeap Investments</title>
        {/* ... (all your other Head tags remain the same) ... */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2" />
        <link rel="manifest" href="/site.webmanifest?v=2" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* This hidden div is where Google Translate will place its widget */}
      <div id="google_translate_element" style={{display: 'none'}}></div>

      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
      <ChatWidget />

      {/* These scripts load the Google Translate API */}
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <Script id="google-translate-init" strategy="afterInteractive">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
          }
        `}
      </Script>
    </div>
  );
}

export default MyApp;