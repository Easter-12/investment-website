export default function DashboardPage() {
  return (
    <div style={{
      backgroundColor: '#111827',
      minHeight: 'calc(100vh - 142px)', // Adjust height for header and footer
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#22d3ee',
        marginBottom: '1rem'
      }}>
        Welcome to Your Dashboard
      </h1>
      <p style={{
        fontSize: '1.25rem',
        color: '#d1d5db'
      }}>
        Your investment journey starts here. This area is under construction.
      </p>
    </div>
  );
}