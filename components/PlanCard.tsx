// This component displays one investment plan card
export default function PlanCard({ plan }: { plan: any }) {
  return (
    <div style={{
      backgroundColor: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '12px',
      padding: '2rem',
      width: '100%',
      maxWidth: '350px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)' // Added a subtle shadow
    }}>
      <div>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#22d3ee', margin: '0 0 1rem 0' }}>
          {plan.name}
        </h3>
        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: 'white' }}>
          {plan.roi_percentage}%
        </p>
        <p style={{ color: '#9ca3af', margin: 0 }}>Return on Investment</p>
      </div>

      <div style={{ borderTop: '1px solid #334155', margin: '2rem 0' }}></div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ color: '#9ca3af' }}>Term</span>
          <span style={{ fontWeight: 'bold' }}>{plan.duration_days} Days</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ color: '#9ca3af' }}>Min Deposit</span>
          <span style={{ fontWeight: 'bold' }}>${plan.min_deposit.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#9ca3af' }}>Max Deposit</span>
          <span style={{ fontWeight: 'bold' }}>${plan.max_deposit.toLocaleString()}</span>
        </div>
      </div>

      {/* --- THIS IS THE UPDATED BUTTON --- */}
      <button className="pro-button" style={{ marginTop: '2rem', width: '100%' }}>
        Invest Now
      </button>
    </div>
  );
}