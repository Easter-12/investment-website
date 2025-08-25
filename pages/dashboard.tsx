import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import PlanCard from '../components/PlanCard';
import Link from 'next/link';

// Define types for our data
type Plan = { id: number; name: string; min_deposit: number; max_deposit: number; duration_days: number; roi_percentage: number; };
type UserProfile = {
  username: string;
  balance: number;
  withdrawal_wallet_address: string | null;
};

export default function DashboardPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the withdrawal form
  const [walletAddress, setWalletAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [message, setMessage] = useState('');

  // This useEffect fetches BOTH the user's profile and the investment plans
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the logged-in user's session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session?.user) {
          // If no user is logged in, redirect to the login page
          window.location.href = '/login';
          return;
        }

        // Fetch the user's profile from our 'profiles' table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profileError) throw profileError;
        setProfile(profileData);
        setWalletAddress(profileData.withdrawal_wallet_address || '');

        // Fetch the investment plans
        const { data: plansData, error: plansError } = await supabase.from('plans').select('*').order('min_deposit');
        if (plansError) throw plansError;
        setPlans(plansData || []);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- WITHDRAWAL LOGIC ---
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!profile) return;
    const amount = parseFloat(withdrawAmount);
    if (amount > profile.balance) {
      setMessage('Error: Withdrawal amount cannot exceed your balance.');
      return;
    }

    // In a real app, this would trigger a backend process.
    // For this simulation, we will:
    // 1. Update the user's wallet address if they changed it.
    // 2. Subtract the amount from their balance.
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Update wallet address and balance in one go
      const { error } = await supabase
        .from('profiles')
        .update({ 
          withdrawal_wallet_address: walletAddress,
          balance: profile.balance - amount 
        })
        .eq('id', user.id);

      if (error) throw error;

      setMessage(`Withdrawal request for $${amount} successful!`);
      // Refresh the profile data to show the new balance
      setProfile({ ...profile, balance: profile.balance - amount });
      setWithdrawAmount('');

    } catch (err: any) {
      setMessage("Error: " + err.message);
    }
  };

  if (loading) {
    return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827', color: 'white'}}>Loading Dashboard...</div>;
  }

  const referralLink = profile ? `https://investment-website-git-main-[your-vercel-project].vercel.app/signup?ref=${profile.username}` : '';

  return (
    <div style={{ backgroundColor: '#111827', minHeight: 'calc(100vh - 142px)', color: 'white', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* --- HEADER SECTION --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#22d3ee', margin: 0 }}>
              Welcome, {profile?.username || 'User'}!
            </h1>
          </div>
          <div style={{backgroundColor: '#1f2937', padding: '1rem 1.5rem', borderRadius: '12px'}}>
            <span style={{color: '#9ca3af'}}>Your Balance:</span>
            <span style={{fontSize: '1.5rem', fontWeight: 'bold', marginLeft: '1rem'}}>${profile?.balance.toFixed(2)}</span>
          </div>
        </div>

        {/* --- REFERRAL LINK SECTION --- */}
        <div style={{marginBottom: '4rem', backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px'}}>
            <h3 style={{marginTop: 0}}>Your Referral Link</h3>
            <p style={{color: '#9ca3af'}}>Share this link to earn rewards!</p>
            <input type="text" readOnly value={referralLink} style={{width: '100%', padding: '0.75rem', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '8px', color: 'white'}}/>
        </div>

        {/* --- WITHDRAWAL SECTION --- */}
        <div style={{marginBottom: '4rem'}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: 'bold'}}>Withdraw Funds</h2>
            <form onSubmit={handleWithdraw} style={{backgroundColor: '#1f2937', padding: '2rem', borderRadius: '12px', marginTop: '1rem', maxWidth: '600px'}}>
                <div style={{marginBottom: '1.5rem'}}>
                    <label>Your Withdrawal Wallet Address (BTC, ETH, etc.)</label>
                    <input type="text" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} required style={{width: '100%', padding: '0.75rem', marginTop: '0.5rem', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '8px', color: 'white'}}/>
                </div>
                <div style={{marginBottom: '1.5rem'}}>
                    <label>Amount ($)</label>
                    <input type="number" step="0.01" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} required placeholder="0.00" style={{width: '100%', padding: '0.75rem', marginTop: '0.5rem', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '8px', color: 'white'}}/>
                </div>
                <button type="submit" style={{backgroundColor: '#10b981', color: 'white', fontWeight: 'bold', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer'}}>Request Withdrawal</button>
                {message && <p style={{ marginTop: '1rem', color: message.startsWith('Error') ? '#f87171' : '#34d399' }}>{message}</p>}
            </form>
        </div>

        {/* --- PLANS SECTION --- */}
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', borderTop: '1px solid #334151', paddingTop: '2rem' }}>
          Our Investment Plans
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
          {plans.map((plan) => ( <PlanCard key={plan.id} plan={plan} /> ))}
        </div>
      </div>
    </div>
  );
}