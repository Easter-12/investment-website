import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// A small component for each feature box
function FeatureCard({ title, description, icon }) {
  return (
    <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', border: '1px solid #334155' }}>
      <div style={{ marginBottom: '1rem', color: '#22d3ee' }}>
        {/* We will use simple text icons for now, but can upgrade to real icons later */}
        {icon}
      </div>
      <h3 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '1.25rem' }}>{title}</h3>
      <p style={{ margin: 0, color: '#9ca3af', lineHeight: '1.6' }}>{description}</p>
    </div>
  );
}

export default function TrustSection() {
  // State to hold the live user count
  const [userCount, setUserCount] = useState(400); // Start with a default number
  const [loading, setLoading] = useState(true);

  // Fetch the real user count from the database
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (error) throw error;

        // We add a base number to make it look more impressive
        if (count !== null) {
          setUserCount(count + 400); // Your real count + a starting number
        }
      } catch (error) {
        console.error("Error fetching user count:", error);
        // If there's an error, it will just show the default 400
      } finally {
        setLoading(false);
      }
    };
    fetchUserCount();
  }, []);

  return (
    <div className="section-container" style={{ backgroundColor: '#111827' }}>
      <div className="content-wrapper">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

          {/* Left Side: Main Title */}
          <div style={{ gridColumn: '1 / -1', marginBottom: '2rem' }}>
            <p style={{ color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>Worldwide Trust</p>
            <h2 className="section-heading" style={{ textAlign: 'left', margin: 0 }}>
              Trusted and built on security
            </h2>
          </div>

          {/* Right Side: Stat Boxes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', gridColumn: '1 / -1' }}>
            <div style={{ border: '2px solid #10b981', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>{loading ? '...' : `${(userCount / 1000).toFixed(1)}k+`}</p>
              <p style={{ color: '#9ca3af', margin: '0.25rem 0 0 0' }}>Registered Users</p>
            </div>
            <div style={{ border: '2px solid #10b981', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>$150m+</p>
              <p style={{ color: '#9ca3af', margin: '0.25rem 0 0 0' }}>In Trades</p>
            </div>
          </div>

          {/* Bottom Row: Feature Cards */}
          <FeatureCard 
            icon="🛡️" 
            title="Security" 
            description="Leveraging cutting-edge encryption and two-factor authentication, your financial data is safeguarded with bank-level security measures." 
          />
          <FeatureCard 
            icon="🔒" 
            title="Privacy" 
            description="We prioritize your privacy and adhere to modern data regulations, ensuring your data is handled with the utmost confidentiality and care." 
          />
          <FeatureCard 
            icon="📜" 
            title="Compliance" 
            description="Our trading accounts and partners are registered and compliant with stringent global regulatory standards, ensuring a safe trading environment." 
          />
          <FeatureCard 
            icon="🏦" 
            title="Protection" 
            description="With insurance covering your portfolio and 24/7 account monitoring, rest assured that your investments are protected against unforeseen circumstances." 
          />
        </div>
      </div>
    </div>
  );
}