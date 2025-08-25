// We need to import 'useState' and 'useEffect' from React
import { useState, useEffect } from 'react';

import TradingViewWidget from '../components/TradingViewWidget';
import NewsFeedWidget from '../components/NewsFeedWidget';
import TestimonialCard from '../components/TestimonialCard';
import ActivityPopup from '../components/ActivityPopup';
import TechImage from '../components/TechImage';
import HowItWorks from '../components/HowItWorks';

// --- FAKE DATA for testimonials (no change) ---
const testimonials = [
  { name: 'Sarah J.', country: 'USA', flag: '🇺🇸', comment: 'This platform is a game-changer! My portfolio has never looked better.', imageUrl: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Kenji T.', country: 'Japan', flag: '🇯🇵', comment: 'The user interface is clean and the live data is incredibly fast.', imageUrl: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Maria G.', country: 'Germany', flag: '🇩🇪', comment: 'Excellent customer support and a wide variety of investment plans.', imageUrl: 'https://i.pravatar.cc/150?img=3' }
];

// --- NEW FAKE DATA for the pop-up notifications ---
const fakeInvestments = [
    { name: 'Michael B. from 🇬🇧', amount: '2,500', plan: 'Gold' },
    { name: 'Isabella L. from 🇧🇷', amount: '750', plan: 'Silver' },
    { name: 'David C. from 🇦🇺', amount: '10,000', plan: 'Platinum' },
    { name: 'Sophia R. from 🇨🇦', amount: '1,200', plan: 'Silver' },
    { name: 'Liam P. from 🇮🇪', amount: '5,500', plan: 'Gold' },
];

export default function HomePage() {
  // --- NEW DYNAMIC LOGIC ---
  const [currentPopup, setCurrentPopup] = useState(fakeInvestments[0]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the first notification shortly after the page loads
    const initialTimeout = setTimeout(() => {
        setIsVisible(true);
    }, 2000); // 2 seconds delay

    // Set up a timer (interval) to cycle through notifications
    const interval = setInterval(() => {
      // 1. Fade out the current notification
      setIsVisible(false);

      // 2. After the fade-out is complete, pick a new one and fade it in
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * fakeInvestments.length);
        setCurrentPopup(fakeInvestments[randomIndex]);
        setIsVisible(true);
      }, 500); // Must match the transition time in ActivityPopup.tsx

    }, 7000); // Show a new notification every 7 seconds

    // Clean up timers when the user leaves the page to prevent errors
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []); // The empty array [] means this effect runs only once

  return (
    <div style={{ backgroundColor: '#111827', color: 'white' }}>
      {/* All your other sections remain exactly the same */}
      <div style={{ textAlign: 'center', padding: '8rem 2rem', backgroundColor: '#111827', backgroundImage: `radial-gradient(at 50% 30%, hsla(190, 80%, 30%, 0.4) 0px, transparent 50%), radial-gradient(at 50% 70%, hsla(190, 80%, 20%, 0.3) 0px, transparent 50%)` }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#22d3ee' }}>QuantumLeap Investments</h1>
        <p style={{ fontSize: '1.25rem', color: '#d1d5db' }}>Your future, secured. Real-time market data at your fingertips.</p>
      </div>
      <HowItWorks />
      <TechImage />
      <div style={{ padding: '4rem 2rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>Live Market Overview</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
            <div style={{ height: '400px', width: '100%', maxWidth: '550px' }}><TradingViewWidget symbol="BINANCE:BTCUSDT" containerId="tradingview_chart_1" /></div>
            <div style={{ height: '400px', width: '100%', maxWidth: '550px' }}><TradingViewWidget symbol="BINANCE:ETHUSDT" containerId="tradingview_chart_2" /></div>
            <div style={{ height: '400px', width: '100%', maxWidth: '550px' }}><TradingViewWidget symbol="BINANCE:SOLUSDT" containerId="tradingview_chart_3" /></div>
            <div style={{ height: '400px', width: '100%', maxWidth: '550px' }}><TradingViewWidget symbol="BINANCE:XRPUSDT" containerId="tradingview_chart_4" /></div>
        </div>
      </div>
      <div style={{ padding: '0 2rem 4rem 2rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>Latest Market News</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}><NewsFeedWidget /></div>
      </div>
      <div style={{ padding: '0 2rem 4rem 2rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>What Our Users Say</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
          {testimonials.map((testimonial) => (<TestimonialCard key={testimonial.name} name={testimonial.name} country={testimonial.country} flag={testimonial.flag} comment={testimonial.comment} imageUrl={testimonial.imageUrl} />))}
        </div>
      </div>

      {/* --- RENDER THE DYNAMIC POP-UP --- */}
      <ActivityPopup
        isVisible={isVisible}
        name={currentPopup.name}
        amount={currentPopup.amount}
        plan={currentPopup.plan}
      />
    </div>
  );
}