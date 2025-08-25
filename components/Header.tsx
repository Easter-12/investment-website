import { useState } from 'react';
import NavMenu from './NavMenu';
import Link from 'next/link';
import Image from 'next/image'; // Import the Image component
import logoFile from '../public/logo.gif'; // Import the logo file

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
      padding: '0.5rem 1rem', // Reduced padding for a tighter look
      backgroundColor: '#1a2233',
      color: 'white',
      borderBottom: '1px solid #334155'
    }}>
      {/* The title is now a link containing the logo image */}
      <Link href="/">
        <div style={{ cursor: 'pointer' }}>
          <Image 
            src={logoFile} 
            alt="QuantumLeap Logo" 
            height={60} // Control the height of the logo
            width={180} // Control the width of the logo
            priority // Tells Next.js to load the logo first
          />
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