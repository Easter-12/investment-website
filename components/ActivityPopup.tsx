// We now accept a new property called 'isVisible'
export default function ActivityPopup({ name, amount, plan, isVisible }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      backgroundColor: '#1e293b',
      color: 'white',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #334155',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      zIndex: 50,
      // --- ANIMATION STYLES ---
      transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
      opacity: isVisible ? 1 : 0, // If visible, opacity is 1, otherwise 0
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)', // Slides up when visible
      // This makes it invisible to clicks when hidden
      pointerEvents: isVisible ? 'auto' : 'none', 
    }}>
      <p style={{ margin: 0, fontWeight: 'bold', color: '#67e8f9' }}>New Investment!</p>
      <p style={{ margin: '0.25rem 0 0 0', color: '#e2e8f0' }}>
        {name} just invested ${amount} in the {plan} Plan.
      </p>
    </div>
  );
}