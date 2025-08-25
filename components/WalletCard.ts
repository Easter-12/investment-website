import { useState } from 'react';

// This component displays one wallet address card
export default function WalletCard({ wallet }) {
  const [copied, setCopied] = useState(false);

  // Function to copy the address to the clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.wallet_address);
    setCopied(true);
    // Reset the "Copied!" message after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      backgroundColor: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '12px',
      padding: '2rem',
      width: '100%',
      maxWidth: '500px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* We can add a logo here in the future if we have logo_url */}
        <div>
          <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{wallet.crypto_name} ({wallet.crypto_symbol})</h3>
          <p style={{ margin: '0.25rem 0 0 0', color: '#9ca3af' }}>Official Deposit Address</p>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#111827', padding: '1rem', borderRadius: '8px', 
        fontFamily: 'monospace', wordBreak: 'break-all', marginBottom: '1rem' 
      }}>
        {wallet.wallet_address}
      </div>

      <button onClick={handleCopy} style={{
        backgroundColor: copied ? '#10b981' : '#22d3ee', // Change color on copy
        color: '#111827', fontWeight: 'bold',
        padding: '0.75rem', borderRadius: '8px', border: 'none',
        cursor: 'pointer', fontSize: '1rem', width: '100%',
        transition: 'background-color 0.2s'
      }}>
        {copied ? 'Copied!' : 'Copy Address'}
      </button>
    </div>
  );
}