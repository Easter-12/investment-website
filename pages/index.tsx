import { useState, useEffect } from 'react';
import TradingViewWidget from '../components/TradingViewWidget';
import NewsFeedWidget from '../components/NewsFeedWidget';
import TestimonialCard from '../components/TestimonialCard';
import ActivityPopup from '../components/ActivityPopup';
import TechImage from '../components/TechImage';
import HowItWorks from '../components/HowItWorks';
import FadeInSection from '../components/FadeInSection'; // Import our new animation component

// ... (allTestimonials and fakeInvestments data stays the same)
const allTestimonials = [ { name: 'Sarah J.', country: 'USA', flag: '🇺🇸', comment: 'This platform is a game-changer! My portfolio has never looked better.', imageUrl: 'https://i.pravatar.cc/150?img=1' }, { name: 'Kenji T.', country: 'Japan', flag: '🇯🇵', comment: 'The user interface is clean and the live data is incredibly fast.', imageUrl: 'https://i.pravatar.cc/150?img=5' }, { name: 'Maria G.', country: 'Germany', flag: '🇩🇪', comment: 'Excellent customer support and a wide variety of investment plans.', imageUrl: 'https://i.pravatar.cc/150?img=3' }, { name: 'David L.', country: 'Australia', flag: '🇦🇺', comment: 'I was new to investing, but this platform made it easy to get started.', imageUrl: 'https://i.pravatar.cc/150?img=7' }, { name: 'Fatima A.', country: 'UAE', flag: '🇦🇪', comment: 'The ROI on the Platinum Plan has exceeded all my expectations.', imageUrl: 'https://i.pravatar.cc/150?img=8' }, { name: 'Carlos R.', country: 'Brazil', flag: '🇧🇷', comment: 'QuantumLeap has provided consistent returns and their support team is always helpful.', imageUrl: 'https://i.pravatar.cc/150?img=11' }, { name: 'Chloe B.', country: 'France', flag: '🇫🇷', comment: 'Secure, reliable, and profitable. What more could you ask for in an investment platform?', imageUrl: 'https://i.pravatar.cc/150?img=12' }, { name: 'Wei Z.', country: 'China', flag: '🇨🇳', comment: 'The market analysis tools are incredibly insightful.', imageUrl: 'https://i.pravatar.cc/150?img=14' }, { name: 'Olivia P.', country: 'Canada', flag: '🇨🇦', comment: 'I have tried many platforms, and this is by far the most user-friendly and effective.', imageUrl: 'https://i.pravatar.cc/150?img=15' }, ];
const plans = ['Silver', 'Gold', 'Platinum', 'Diamond'];
const amounts = [500, 1200, 2500, 5000, 10000, 750, 15000];

export default function HomePage() {
  const [investors, setInvestors] = useState([]);
  const [currentInvestment, setCurrentInvestment] = useState({ name: '', amount: '', plan: '' });
  const [dailyTestimonials, setDailyTestimonials] = useState([]);
  useEffect(() => { fetch('https://randomuser.me/api/?results=10&nat=us,gb,ca,au,de,fr,jp,br').then(res => res.json()).then(data => { const formattedUsers = data.results.map((user: any) => ({ name: `${user.name.first} ${user.name.last.charAt(0)}. from ${user.location.country}` })); setInvestors(formattedUsers); }); }, []);
  useEffect(() => { const getDaySeed = () => { const date = new Date(); return date.getFullYear() * 1000 + date.getMonth() * 100 + date.getDate(); }; const shuffle = (array: any[], seed: number) => { let currentIndex = array.length, temporaryValue, randomIndex; let random = () => { var x = Math.sin(seed++) * 10000; return x - Math.floor(x); }; while (0 !== currentIndex) { randomIndex = Math.floor(random() * currentIndex); currentIndex -= 1; temporaryValue = array[currentIndex]; array[currentIndex] = array[randomIndex]; array[randomIndex] = temporaryValue; } return array; }; const seed = getDaySeed(); const shuffled = shuffle([...allTestimonials], seed); setDailyTestimonials(shuffled.slice(0, 3)); }, []);
  useEffect(() => { if (investors.length === 0) return; const interval = setInterval(() => { const randomInvestor = investors[Math.floor(Math.random() * investors.length)]; const randomAmount = amounts[Math.floor(Math.random() * amounts.length)]; const randomPlan = plans[Math.floor(Math.random() * plans.length)]; setCurrentInvestment({ name: randomInvestor.name, amount: randomAmount.toLocaleString(), plan: randomPlan, }); }, 5000); return () => clearInterval(interval); }, [investors]);

  return (
    <div style={{ backgroundColor: '#111827', color: 'white', overflowX: 'hidden' }}> {/* Add overflowX to prevent horizontal scrollbars */}
      <div className="hero-section">
        <h1 className="hero-heading">QuantumLeap Investments</h1>
        <p className="hero-subheading">Your future, secured. Real-time market data at your fingertips.</p>
      </div>

      <FadeInSection><HowItWorks /></FadeInSection>
      <FadeInSection><TechImage /></FadeInSection>

      <FadeInSection>
        <div className="section-container">
          <div className="content-wrapper">
            <h2 className="section-heading">Live Market Overview</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
                <div style={{ height: '400px', width: '100%', maxWidth: '550px' }}><TradingViewWidget symbol="BINANCE:BTCUSDT" containerId="tradingview_chart_1" /></div>
                <div style={{ height: '400px', width: '100%', maxWidth: '550px' }}><TradingViewWidget symbol="BINANCE:ETHUSDT" containerId="tradingview_chart_2" /></div>
                <div style={{ height: '400px', width: '100%', maxWidth: '550px' }}><TradingViewWidget symbol="BINANCE:SOLUSDT" containerId="tradingview_chart_3" /></div>
                <div style={{ height: '400px', width: '100%', maxWidth: '550px' }}><TradingViewWidget symbol="BINANCE:XRPUSDT" containerId="tradingview_chart_4" /></div>
            </div>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection>
        <div className="section-container" style={{paddingTop: 0, paddingBottom: 0}}>
          <div className="content-wrapper">
            <h2 className="section-heading">Latest Market News</h2>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}><NewsFeedWidget /></div>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection>
        <div className="section-container">
          <div className="content-wrapper">
            <h2 className="section-heading">What Our Users Say</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
              {dailyTestimonials.map((testimonial: any) => (<TestimonialCard key={testimonial.name} name={testimonial.name} country={testimonial.country} flag={testimonial.flag} comment={testimonial.comment} imageUrl={testimonial.imageUrl} />))}
            </div>
          </div>
        </div>
      </FadeInSection>

      {currentInvestment.name && ( <ActivityPopup name={currentInvestment.name} amount={currentInvestment.amount} plan={currentInvestment.plan} /> )}
    </div>
  );
}