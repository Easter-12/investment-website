import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import NavMenu from './NavMenu';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // NEW: State to hold the user's session information
  const [session, setSession] = useState<any>(null);

  // This runs once to check if the user is logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // This listens for changes in login state (e.g., user signs out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header style={{
      position: 'relative', 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1rem 1.5rem', backgroundColor: '#1a2233', color: 'white',
      borderBottom: '1px solid #334155'
    }}>
      <Link href="/">
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', color: 'white' }}>
          QuantumLeap
        </div>
      </Link>

      <button onClick={toggleMenu} style={{ background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }}>
        &#x22EE;
      </button>

      {/* We now pass the session info to the NavMenu */}
      {isMenuOpen && <NavMenu session={session} />}
    </header>
  );
}