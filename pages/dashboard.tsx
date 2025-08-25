import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import PlanCard from '../components/PlanCard';
import Link from 'next/link'; // Import the Link component

type Plan = { id: number; name: string; min_deposit: number; max_deposit: number; duration_days: number; roi_percentage: number; };

export default function DashboardPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase.from('plans').select('*').order('min_deposit');
        if (error) throw error;
        if (data) setPlans(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div style={{ backgroundColor: '#111827', minHeight: 'calc(100vh - 142px)', color: 'white', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#22d3ee', margin: 0 }}>
              Welcome to Your Dashboard
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#d1d5db', margin: '0.5rem 0 0 0' }}>
              Your investment journey starts here.
            </p>
          </div>
          {/* --- NEW DEPOSIT BUTTON --- */}
          <Link href="/deposit">
            <div style={{
              backgroundColor: '#10b981', color: 'white', fontWeight: 'bold',
              padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer',
              textAlign: 'center'
            }}>
              Deposit Funds
            </div>
          </Link>
        </div>

        <p style={{ fontSize: '1.25rem', color: '#d1d5db', marginBottom: '4rem', borderTop: '1px solid #334155', paddingTop: '2rem', marginTop: '2rem' }}>
          Choose a plan to get started.
        </p>

        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', borderBottom: '1px solid #334155', paddingBottom: '1rem', marginBottom: '2rem' }}>
          Our Investment Plans
        </h2>

        {loading && <p>Loading plans...</p>}
        {error && <p style={{ color: '#f87171' }}>Error: {error}</p>}

        {!loading && !error && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
            {plans.map((plan) => ( <PlanCard key={plan.id} plan={plan} /> ))}
          </div>
        )}
      </div>
    </div>
  );
}