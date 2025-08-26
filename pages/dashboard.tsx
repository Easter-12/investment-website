import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import PlanCard from '../components/PlanCard';
import Link from 'next/link';
import styles from '../styles/Dashboard.module.css';
import FadeInSection from '../components/FadeInSection';

type Plan = { id: number; name: string; min_deposit: number; max_deposit: number; duration_days: number; roi_percentage: number; };
type UserProfile = { id: string; username: string; balance: number; withdrawal_wallet_address: string | null; };

export default function DashboardPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { window.location.href = '/login'; return; }
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (profileData) { setProfile(profileData); setWalletAddress(profileData.withdrawal_wallet_address || ''); }
      const { data: plansData } = await supabase.from('plans').select('*').order('min_deposit');
      setPlans(plansData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault(); setMessage(''); if (!profile) return;
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) { setMessage('Error: Please enter a valid amount.'); return; }
    if (amount > profile.balance) { setMessage('Error: Withdrawal amount exceeds your balance.'); return; }
    try {
      const newBalance = profile.balance - amount;
      const { error } = await supabase.from('profiles').update({ withdrawal_wallet_address: walletAddress, balance: newBalance }).eq('id', profile.id);
      if (error) throw error;
      setMessage(`Withdrawal request for $${amount.toFixed(2)} submitted successfully!`);
      setProfile({ ...profile, balance: newBalance });
      setWithdrawAmount('');
    } catch (err: any) { setMessage("Error: " + err.message); }
  };

  if (loading) {
    return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827', color: 'white'}}>Loading Your Account...</div>;
  }

  const referralLink = profile ? `https://investment-website-git-main-easter-12s-projects.vercel.app/signup?ref=${profile.username}` : '';

  return (
    <div style={{ backgroundColor: '#111827', minHeight: 'calc(100vh - 142px)', color: 'white', padding: '1rem', overflowX: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <FadeInSection>
          <h1 className={styles.dashboardHeading}>Welcome, {profile?.username || 'User'}!</h1>
        </FadeInSection>

        <FadeInSection>
          {/* --- THIS IS THE CORRECTED STRUCTURE --- */}
          {/* All cards are now inside the single grid container */}
          <div className={styles.dashboardGrid}>
            <div className={styles.summaryCard}>
              <h2 className={styles.cardTitle}>Account Balance</h2>
              <p className={styles.balanceText}>${profile?.balance.toFixed(2)}</p>
            </div>
            <div className={styles.actionCard}>
              <h2 className={styles.cardTitle}>Quick Actions</h2>
              <Link href="/deposit" className="pro-button">Deposit Funds</Link>
            </div>
            <div className={styles.withdrawalCard}>
              <h2 className={styles.cardTitle}>Withdraw Funds</h2>
              <form onSubmit={handleWithdraw}>
                <div style={{marginBottom: '1rem'}}>
                  <label style={{fontSize: '0.9rem'}}>Your Wallet Address</label>
                  <input type="text" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} required className={styles.referralInput} />
                </div>
                <div style={{marginBottom: '1rem'}}>
                  <label style={{fontSize: '0.9rem'}}>Amount ($)</label>
                  <input type="number" step="0.01" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} required placeholder="0.00" className={styles.referralInput} />
                </div>
                <button type="submit" className="pro-button">Submit Withdrawal</button>
                {message && <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: message.startsWith('Error') ? '#f87171' : '#34d399' }}>{message}</p>}
              </form>
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
            <h2 className={styles.dashboardSectionHeading}>Choose an Investment Plan</h2>
          </FadeInSection>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
            {plans.map((plan) => ( <FadeInSection key={plan.id}><PlanCard plan={plan} /></FadeInSection>))}
          </div>
        </div>
      </div>
    </div>
  );
}