import TradingViewWidget from '../components/TradingViewWidget';
import NewsFeedWidget from '../components/NewsFeedWidget'; // Step 1: Import our new component

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#111827', color: 'white' }}>

      {/* Welcome Section (No changes here) */}
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#22d3ee' }}>
          QuantumLeap Investments
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#d1d5db' }}>
          Your future, secured. Real-time market data at your fingertips.
        </p>
      </div>

      {/* Live Market Charts Section (No changes here) */}
      <div style={{ padding: '0 2rem 4rem 2rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
            Live Market Overview
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
            <div style={{ height: '400px', width: '100%', maxWidth: '550px' }}>
                <TradingViewWidget symbol="BINANCE:BTCUSDT" containerId="tradingview_chart_1" />
            </div>
            <div style={{ height: '400px', width: '100%', maxWidth: '550px' }}>
                <TradingViewWidget symbol="BINANCE:ETHUSDT" containerId="tradingview_chart_2" />
            </div>
            <div style={{ height: '400px', width: '100%', maxWidth: '550px' }}>
                <TradingViewWidget symbol="BINANCE:SOLUSDT" containerId="tradingview_chart_3" />
            </div>
            <div style={{ height: '400px', width: '100%', maxWidth: '550px' }}>
                <TradingViewWidget symbol="BINANCE:XRPUSDT" containerId="tradingview_chart_4" />
            </div>
        </div>
      </div>

      {/* === NEW SECTION: Live Trade News === */}
      <div style={{ padding: '0 2rem 4rem 2rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
            Latest Market News
        </h2>
        {/* We center the news feed and give it a max width so it looks good on large screens */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <NewsFeedWidget /> {/* Step 2: Place the component here */}
        </div>
      </div>

    </div>
  );
}