import { useState } from 'react';
import NavMenu from './NavMenu';
import Link from 'next/link'; // <-- Import Link

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
      padding: '1rem 2rem',
      backgroundColor: '#1a2233',
      color: 'white',
      borderBottom: '1px solid #334155'
    }}>
      {/* This is the new part. The title is now a link to the homepage ("/") */}
      <Link href="/">
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
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