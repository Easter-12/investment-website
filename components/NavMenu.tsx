import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function NavMenu({ session }: { session: any }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // After signing out, redirect to the homepage
    router.push('/');
  };

  return (
    <div style={{
      position: 'absolute', top: '70px', right: '1.5rem',
      backgroundColor: '#1e293b', borderRadius: '8px',
      border: '1px solid #334155', padding: '0.5rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', zIndex: 100
    }}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {/* If the user IS logged in, show these options */}
        {session ? (
          <>
            <li>
              <Link href="/dashboard">
                <div style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', color: 'white' }}>
                  Dashboard
                </div>
              </Link>
            </li>
            <li>
              <Link href="/profile">
                <div style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', color: 'white' }}>
                  Profile Settings
                </div>
              </Link>
            </li>
            <li>
              {/* This is not a link, it's a button that calls the handleSignOut function */}
              <div onClick={handleSignOut} style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', color: '#f87171' }}>
                Sign Out
              </div>
            </li>
          </>
        ) : (
          /* If the user is NOT logged in, show these options */
          <>
            <li>
              <Link href="/signup">
                <div style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', color: 'white' }}>
                  Sign Up
                </div>
              </Link>
            </li>
            <li>
              <Link href="/login">
                <div style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', color: 'white' }}>
                  Login
                </div>
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}