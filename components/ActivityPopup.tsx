export default function ActivityPopup({ name, amount, plan, isVisible }) {
  return (
    <div style={{
      position: 'fixed',
      top: '80px',    // Position below the header
      right: '20px',  // On the right side
      width: 'calc(100% - 40px)', // Make it almost full width
      maxWidth: '350px', // But not too wide on desktop
      backgroundColor: '#1e293b',
      color: 'white',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #334155',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      zIndex: 50,
      // Apply the animation ONLY when it's visible
      animation: isVisible ? 'slideInAndOut 7s ease-in-out forwards' : 'none',
      // Hide it when not animating
      opacity: isVisible ? 1 : 0,
    }}>
      <p style={{ margin: 0, fontWeight: 'bold', color: '#67e8f9' }}>New Investment!</p>
      <p style={{ margin: '0.25rem 0 0 0', color: '#e2e8f0' }}>
        {name} just invested ${amount} in the {plan} Plan.
      </p>
    </div>
  );
}