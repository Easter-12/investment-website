import { useState, useEffect } from 'react';
import TradingViewWidget from '../components/TradingViewWidget';
import NewsFeedWidget from '../components/NewsFeedWidget';
import TestimonialCard from '../components/TestimonialCard';
import ActivityPopup from '../components/ActivityPopup';
import TechImage from '../components/TechImage';
import HowItWorks from '../components/HowItWorks';

const testimonials = [
    { name: 'Sarah J.', country: 'USA', flag: '🇺🇸', comment: 'This platform is a game-changer! My portfolio has never looked better.', imageUrl: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Kenji T.', country: 'Japan', flag: '🇯🇵', comment: 'The user interface is clean and the live data is incredibly fast.', imageUrl: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Maria G.', country: 'Germany', flag: '🇩🇪', comment: 'Excellent customer support and a wide variety of investment plans.', imageUrl: 'https://i.pravatar.cc/150?img=3' }
];

const fakeInvestments = [
    { name: 'Michael B. from 🇬🇧', amount: '2,500', plan: 'Gold' },
    { name: 'Isabella L. from 🇧🇷', amount: '750', plan: 'Silver' },
    { name: 'David C. from 🇦🇺', amount: '10,000', plan: 'Platinum' },
    { name: 'Sophia R. from 🇨🇦', amount: '1,200', plan: 'Silver' },
    { name: 'Liam P. from 🇮🇪', amount: '5,500', plan: 'Gold' },
];

export default function HomePage() {
  const [currentPopup, setCurrentPopup] = useState(fakeInvestments[0]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showAndCyclePopup = () => {
      // Pick a random investment for the next cycle
      const randomIndex = Math.floor(Math.random() * fakeInvestments.length);
      setCurrentPopup(fakeInvestments[randomIndex]);

      // Make it visible to start the animation
      setIsVisible(true);

      // After the animation duration (7s), hide it to reset
      setTimeout(() => {
        setIsVisible(false);
      }, 7000);
    };

    // Start the first pop-up after a short delay
    const initialTimeout = setTimeout(showAndCyclePopup, 2000);

    // Set an interval to show a new pop-up every 8 seconds (7s for animation + 1s pause)
    const interval = setInterval(showAndCyclePopup, 8000);

    // Cleanup function to prevent memory leaks
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#111827', color: 'white' }}>
      <div className="hero-section">
        <h1 className="hero-heading">QuantumLeap Investments</h1>
        <p className="hero-subheading">Your future, secured. Real-time market data at your fingertips.</p>
      </div>
      <HowItWorks />
      <TechImage />
      <div className="section-container">
        <h2 className="section-heading">Live Market Overview</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
            <div style={{ height: '400px', width: '100%', maxWidth: '550px' }}><TradingViewWidget symbol="BINANCE:BTCUSDT" containerId="tradingview_chart_1" /></div>
            <div style={{ height: '400px', width: '100%', maxWidth: '550px' }}><TradingViewWidget symbol="BINANCE:ETHUSDT" containerId="tradingview_chart_2" /></div>
            <div style={{ height: '400px', width: '100%', maxWidth: '550px' }}><TradingViewWidget symbol="BINANCE:SOLUSDT" containerId="tradingview_chart_3" /></div>
            <div style={{ height: '400px', width: '100%', maxWidth: '550px' }}><TradingViewWidget symbol="BINANCE:XRPUSDT" containerId="tradingview_chart_4" /></div>
        </div>
      </div>
      <div className="section-container" style={{paddingTop: 0, paddingBottom: 0}}>
        <h2 className="section-heading">Latest Market News</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}><NewsFeedWidget /></div>
      </div>
      <div className="section-container">
        <h2 className="section-heading">What Our Users Say</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
          {testimonials.map((testimonial) => (<TestimonialCard key={testimonial.name} name={testimonial.name} country={testimonial.country} flag={testimonial.flag} comment={testimonial.comment} imageUrl={testimonial.imageUrl} />))}
        </div>
      </div>
      <ActivityPopup isVisible={isVisible} name={currentPopup.name} amount={currentPopup.amount} plan={currentPopup.plan} />
    </div>
  );
}