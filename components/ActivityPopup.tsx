export default function ActivityPopup({ name, amount, plan, isVisible }) {
  return (
    <div style={{
      position: 'fixed',
      // --- CHANGED ---
      top: '80px',    // Position it below the header
      right: '20px',  // On the right side
      // --- END CHANGED ---
      backgroundColor: '#1e293b',
      color: 'white',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #334155',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      zIndex: 50,
      transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
      opacity: isVisible ? 1 : 0,
      // We change the transform to slide in from the top
      transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
      pointerEvents: isVisible ? 'auto' : 'none', 
    }}>
      <p style={{ margin: 0, fontWeight: 'bold', color: '#67e8f9' }}>New Investment!</p>
      <p style={{ margin: '0.25rem 0 0 0', color: '#e2e8f0' }}>
        {name} just invested ${amount} in the {plan} Plan.
      </p>
    </div>
  );
}