import { useState } from 'react';
import NavMenu from './NavMenu';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header style={{
      position: 'relative', 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 1.5rem', // Restored comfortable padding
      backgroundColor: '#1a2233',
      color: 'white',
      borderBottom: '1px solid #334155'
    }}>
      {/* The title is now back to simple text inside a link */}
      <Link href="/">
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', color: 'white' }}>
          QuantumLeap
        </div>
      </Link>

      <button onClick={toggleMenu} style={{
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '2rem',
        cursor: 'pointer'
      }}>
        &#x22EE;
      </button>

      {isMenuOpen && <NavMenu />}
    </header>
  );
}