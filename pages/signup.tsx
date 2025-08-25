import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // 1. Import the router to read the URL
import { supabase } from '../lib/supabaseClient';

export default function SignUpPage() {
  const router = useRouter(); // 2. Initialize the router

  // State variables for the form data
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 3. Add new state to hold the referrer's username
  const [referrer, setReferrer] = useState<string | null>(null);

  // State variables for loading and messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 4. This new block of code runs when the page loads to check the URL
  useEffect(() => {
    // router.isReady ensures we can safely read the URL parameters
    if (router.isReady) {
      // Check if a 'ref' parameter exists in the URL (e.g., ?ref=john123)
      if (router.query.ref) {
        // If it exists, save it to our state
        setReferrer(router.query.ref as string);
      }
    }
  }, [router.isReady, router.query]);


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      // 5. Update the signUp call to include the referrer
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username,
            // We add the referrer here. If no one referred, this will be null.
            referrer: referrer, 
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        setMessage('Sign up successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      }

    } catch (error: any) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // The rest of the file (the form) is the same
  return (
    <div style={{
      backgroundColor: '#111827', minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#1e293b', padding: '2.5rem', borderRadius: '12px',
        border: '1px solid #334155', width: '100%', maxWidth: '450px', color: 'white'
      }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#22d3ee', marginBottom: '2rem' }}>
          Create Your Account
        </h1>
        {/* If a referrer is found, show a message! */}
        {referrer && (
          <p style={{textAlign: 'center', backgroundColor: '#1e40af', padding: '0.75rem', borderRadius: '8px'}}>
            You were referred by: <strong>{referrer}</strong>
          </p>
        )}
        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
          {/* ... input fields for username, email, password ... */}
          <div><label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Username</label><input type="text" id="username" placeholder="e.g., john_doe" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#334155', border: '1px solid #475569', borderRadius: '8px', color: 'white' }} required /></div>
          <div><label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Email Address</label><input type="email" id="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#334155', border: '1px solid #475569', borderRadius: '8px', color: 'white' }} required /></div>
          <div><label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Password</label><input type="password" id="password" placeholder="•••••••• (min. 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#334155', border: '1px solid #475569', borderRadius: '8px', color: 'white' }} required /></div>
          <button type="submit" disabled={loading} style={{ backgroundColor: '#22d3ee', color: '#111827', fontWeight: 'bold', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem', marginTop: '1rem', opacity: loading ? 0.6 : 1 }}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
        </form>
        {message && <p style={{ textAlign: 'center', marginTop: '1.5rem', color: message.startsWith('Error') ? '#f87171' : '#34d399' }}>{message}</p>}
      </div>
    </div>
  );
}