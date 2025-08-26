import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Script from 'next/script'; // THIS IS THE MISSING LINE THAT FIXES THE ERROR

export default function NavMenu({ session }: { session: any }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
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
        {session ? (
          <>
            <li><Link href="/dashboard"><div style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', color: 'white' }}>Dashboard</div></Link></li>
            <li><Link href="/profile"><div style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', color: 'white' }}>Profile Settings</div></Link></li>
          </>
        ) : (
          <>
            <li><Link href="/signup"><div style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', color: 'white' }}>Sign Up</div></Link></li>
            <li><Link href="/login"><div style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', color: 'white' }}>Login</div></Link></li>
          </>
        )}

        <li style={{ padding: '0.75rem 1.5rem' }}>
            <div id="google_translate_element_nav"></div>
        </li>

        {session && (
          <li>
            <div onClick={handleSignOut} style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', color: '#f87171', borderTop: '1px solid #334155', marginTop: '0.5rem' }}>
              Sign Out
            </div>
          </li>
        )}
      </ul>
      <Script id="move-google-translate" strategy="lazyOnload">
        {`
            const gtElement = document.getElementById('google_translate_element');
            const navElement = document.getElementById('google_translate_element_nav');
            if (gtElement && navElement && gtElement.firstChild) {
                if (!navElement.hasChildNodes()) {
                    navElement.appendChild(gtElement.firstChild);
                }
            }
        `}
      </Script>
    </div>
  );
}