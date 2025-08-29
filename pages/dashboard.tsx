import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import PlanCard from '../components/PlanCard';
import Link from 'next/link';
import styles from '../styles/Dashboard.module.css';
import FadeInSection from '../components/FadeInSection';

// Define types for our data
type Plan = { id: number; name: string; min_deposit: number; max_deposit: number; duration_days: number; roi_percentage: number; };
type UserProfile = { id: string; username: string; balance: number; withdrawal_wallet_address: string | null; };
type Withdrawal = { id: number; created_at: string; amount: number; wallet_address: string; status: 'pending' | 'approved' | 'rejected'; };

export default function DashboardPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]); // State for withdrawal history
  const [loading, setLoading] = useState(true);

  const [walletAddress, setWalletAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) { window.location.href = '/login'; return; }

    const user = session.user;

    // Fetch profile
    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (profileData) {
      setProfile(profileData);
      setWalletAddress(profileData.withdrawal_wallet_address || '');
    }

    // Fetch plans
    const { data: plansData } = await supabase.from('plans').select('*').order('min_deposit');
    setPlans(plansData || []);

    // Fetch withdrawal history
    const { data: withdrawalsData } = await supabase.from('withdrawals').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setWithdrawals(withdrawalsData || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- THIS IS THE NEW WITHDRAWAL LOGIC ---
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!profile) return;
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) { setMessage('Error: Please enter a valid amount.'); return; }
    if (amount > profile.balance) { setMessage('Error: Withdrawal amount exceeds your balance.'); return; }

    try {
      // 1. Save the user's wallet address to their profile for future use
      await supabase.from('profiles').update({ withdrawal_wallet_address: walletAddress }).eq('id', profile.id);

      // 2. Create a new row in the 'withdrawals' table with a 'pending' status
      const { error } = await supabase.from('withdrawals').insert({
        user_id: profile.id,
        amount: amount,
        wallet_address: walletAddress,
        status: 'pending'
      });

      if (error) throw error;

      setMessage(`Withdrawal request for $${amount.toFixed(2)} submitted successfully! It is now pending approval.`);
      setWithdrawAmount('');
      // Refresh the withdrawal history to show the new pending request
      fetchData();

    } catch (err: any) {
      setMessage("Error: " + err.message);
    }
  };

  if (loading) {
    return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827', color: 'white'}}>Loading Your Account...</div>;
  }

  const referralLink = profile ? `https://investment-website-orcin.vercel.app/signup?ref=${profile.username}` : '';

  return (
    <div style={{ backgroundColor: '#111827', minHeight: 'calc(100vh - 142px)', color: 'white', padding: '1rem', overflowX: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <FadeInSection>
          <h1 className={styles.dashboardHeading}>Welcome, {profile?.username || 'User'}!</h1>
        </FadeInSection>

        <FadeInSection>
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
              <h2 className={styles.cardTitle}>Request Withdrawal</h2>
              <form onSubmit={handleWithdraw}>
                <div style={{marginBottom: '1rem'}}><label style={{fontSize: '0.9rem'}}>Your Wallet Address</label><input type="text" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} required className={styles.referralInput} /></div>
                <div style={{marginBottom: '1rem'}}><label style={{fontSize: '0.9rem'}}>Amount ($)</label><input type="number" step="0.01" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} required placeholder="0.00" className={styles.referralInput} /></div>
                <button type="submit" className="pro-button">Submit Request</button>
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

        {/* --- NEW WITHDRAWAL HISTORY SECTION --- */}
        <FadeInSection>
            <div style={{marginTop: '4rem'}}>
                <h2 className={styles.dashboardSectionHeading} style={{borderTop: 'none', paddingTop: 0}}>Withdrawal History</h2>
                <div style={{backgroundColor: '#1e293b', borderRadius: '12px', padding: '1rem', marginTop: '2rem'}}>
                    {withdrawals.length > 0 ? (
                        withdrawals.map(w => (
                            <div key={w.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #374151'}}>
                                <div>
                                    <p style={{margin: 0, fontWeight: 'bold'}}>Amount: ${w.amount.toFixed(2)}</p>
                                    <p style={{margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#9ca3af'}}>To: {w.wallet_address}</p>
                                    <p style={{margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#9ca3af'}}>Date: {new Date(w.created_at).toLocaleDateString()}</p>
                                </div>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '99px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    backgroundColor: w.status === 'pending' ? '#ca8a04' : w.status === 'approved' ? '#16a34a' : '#dc2626',
                                    color: 'white'
                                }}>
                                    {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p style={{textAlign: 'center', color: '#9ca3af', padding: '1rem'}}>You have no withdrawal history.</p>
                    )}
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