import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import WalletCard from '../components/WalletCard'; // Import our new component

type Wallet = {
  id: number;
  crypto_name: string;
  crypto_symbol: string;
  wallet_address: string;
};

export default function DepositPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const { data, error } = await supabase.from('wallets').select('*').order('crypto_name');
        if (error) throw error;
        if (data) setWallets(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWallets();
  }, []);

  return (
    <div style={{
      backgroundColor: '#111827',
      minHeight: 'calc(100vh - 142px)',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#22d3ee', marginBottom: '1rem' }}>
          Fund Your Account
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#d1d5db', marginBottom: '4rem', maxWidth: '800px' }}>
          To start investing, please deposit cryptocurrency into one of our official wallets below. Copy the address and send the desired amount from your personal wallet.
        </p>

        {loading && <p>Loading wallet addresses...</p>}
        {error && <p style={{ color: '#f87171' }}>Error: {error}</p>}

        {!loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            {/* Loop through the wallets and display a card for each one */}
            {wallets.length > 0 ? (
              wallets.map((wallet) => <WalletCard key={wallet.id} wallet={wallet} />)
            ) : (
              <p>No deposit wallets have been configured by the administrator yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}