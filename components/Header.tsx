export default function Header() {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#1a2233', // A slightly lighter dark blue
      color: 'white',
      borderBottom: '1px solid #334155'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        QuantumLeap
      </div>
      <button style={{
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '2rem',
        cursor: 'pointer'
      }}>
        &#x22EE;
      </button>
    </header>
  );
}