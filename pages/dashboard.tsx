import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import PlanCard from '../components/PlanCard';
import Link from 'next/link';
import styles from '../styles/Dashboard.module.css';
import FadeInSection from '../components/FadeInSection'; // Import animation component

type Plan = { id: number; name: string; min_deposit: number; max_deposit: number; duration_days: number; roi_percentage: number; };
type UserProfile = { username: string; balance: number; };

export default function DashboardPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { window.location.href = '/login'; return; }

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setProfile(profileData);

      const { data: plansData } = await supabase.from('plans').select('*').order('min_deposit');
      setPlans(plansData || []);

      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827', color: 'white'}}>Loading Your Account...</div>;
  }

  // IMPORTANT: Remember to replace this with your actual Vercel URL
  const referralLink = profile ? `https://investment-website-git-main-easter-12s-projects.vercel.app/signup?ref=${profile.username}` : '';

  return (
    <div style={{ backgroundColor: '#111827', minHeight: 'calc(100vh - 142px)', color: 'white', padding: '2rem', overflowX: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <FadeInSection>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '2rem' }}>
            Welcome, {profile?.username || 'User'}!
          </h1>
        </FadeInSection>

        <FadeInSection>
          <div className={styles.dashboardGrid}>
            <div className={styles.summaryCard}>
              <h2 className={styles.cardTitle}>Account Balance</h2>
              <p className={styles.balanceText}>${profile?.balance.toFixed(2)}</p>
            </div>

            <div className={styles.actionCard}>
              <h2 className={styles.cardTitle}>Quick Actions</h2>
              {/* --- THIS IS THE UPDATED DEPOSIT BUTTON LINK --- */}
              <Link href="/deposit" className="pro-button">
                Deposit Funds
              </Link>
            </div>

            <div className={styles.referralCard}>
               <h2 className={styles.cardTitle}>Your Referral Link</h2>
               <p style={{margin: '0', color: '#9ca3af'}}>Share this link to earn rewards!</p>
               <input type="text" readOnly value={referralLink} className={styles.referralInput} />
            </div>
          </div>
        </FadeInSection>

        <div style={{ marginTop: '4rem' }}>
          <FadeInSection>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', borderTop: '1px solid #334155', paddingTop: '3rem' }}>
              Choose an Investment Plan
            </h2>
          </FadeInSection>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
            {plans.map((plan) => ( 
              <FadeInSection key={plan.id}>
                <PlanCard plan={plan} /> 
              </FadeInSection>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}