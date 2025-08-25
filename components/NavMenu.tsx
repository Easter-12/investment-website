import Link from 'next/link'; // Step 1: We import the special Link component

export default function NavMenu() {
  return (
    <div style={{
      position: 'absolute',
      top: '70px',
      right: '2rem',
      backgroundColor: '#1e293b',
      borderRadius: '8px',
      border: '1px solid #334155',
      padding: '1rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      zIndex: 100
    }}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>

        {/* Step 2: We wrap the "Sign Up" button in a Link component */}
        <Link href="/signup">
          <li style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', color: 'white' }}>
            Sign Up
          </li>
        </Link>

        {/* We will also add a link for the Login button for the future */}
        <Link href="/login">
          <li style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', color: 'white' }}>
            Login
          </li>
        </Link>

      </ul>
    </div>
  );
}