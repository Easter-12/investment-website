import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import styles from '../styles/TrustSection.module.css'; // Import our new CSS module

function FeatureCard({ title, description, icon }) {
  return (
    <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', border: '1px solid #334155' }}>
      <div style={{ marginBottom: '1rem', color: '#22d3ee', fontSize: '1.5rem' }}>{icon}</div>
      <h3 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '1.25rem' }}>{title}</h3>
      <p style={{ margin: 0, color: '#9ca3af', lineHeight: '1.6' }}>{description}</p>
    </div>
  );
}

export default function TrustSection() {
  const [userCount, setUserCount] = useState(400);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        if (error) throw error;
        if (count !== null) setUserCount(count + 400);
      } catch (error) {
        console.error("Error fetching user count:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserCount();
  }, []);

  return (
    <div className={`section-container ${styles.container}`}>
      <div className="content-wrapper">
        <div className={styles.grid}>

          <div className={styles.titleBlock}>
            <p className={styles.titleLabel}>Worldwide Trust</p>
            <h2 className={`section-heading ${styles.titleHeading}`}>
              Trusted and built on security
            </h2>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <p className={styles.statNumber}>{loading ? '...' : `${(userCount / 1000).toFixed(1)}k+`}</p>
              <p className={styles.statLabel}>Registered Users</p>
            </div>
            <div className={styles.statBox}>
              <p className={styles.statNumber}>$150m+</p>
              <p className={styles.statLabel}>In Trades</p>
            </div>
          </div>

          <div className={styles.featuresGrid}>
            <FeatureCard icon="🛡️" title="Security" description="Leveraging cutting-edge encryption and two-factor authentication, your financial data is safeguarded with bank-level security measures." />
            <FeatureCard icon="🔒" title="Privacy" description="We prioritize your privacy and adhere to modern data regulations, ensuring your data is handled with the utmost confidentiality and care." />
            <FeatureCard icon="📜" title="Compliance" description="Our trading accounts and partners are registered and compliant with stringent global regulatory standards, ensuring a safe trading environment." />
            <FeatureCard icon="🏦" title="Protection" description="With insurance covering your portfolio and 24/7 account monitoring, rest assured that your investments are protected against unforeseen circumstances." />
          </div>
        </div>
      </div>
    </div>
  );
}