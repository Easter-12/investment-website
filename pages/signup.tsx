import { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Import our Supabase helper

export default function SignUpPage() {
  // State variables to hold the form data
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State variables for loading and messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // This function will run when the user clicks the "Sign Up" button
  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page

    // Reset message and start loading
    setMessage('');
    setLoading(true);

    try {
      // Step 1: Sign up the user in Supabase Authentication
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          // We store the username here temporarily
          data: {
            username: username,
          }
        }
      });

      if (authError) {
        throw authError; // If there's an error, stop and go to the catch block
      }

      // If sign up is successful, authData.user will exist
      if (authData.user) {
        setMessage('Sign up successful! Redirecting...');

        // Redirect the user to the dashboard after a short delay
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500); // 1500 milliseconds = 1.5 seconds
      }

    } catch (error) {
      // Show a user-friendly error message
      setMessage('Error: ' + error.message);
    } finally {
      // Stop loading, whether it succeeded or failed
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#111827',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        padding: '2.5rem',
        borderRadius: '12px',
        border: '1px solid #334155',
        width: '100%',
        maxWidth: '450px',
        color: 'white'
      }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#22d3ee', marginBottom: '2rem' }}>
          Create Your Account
        </h1>

        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Username</label>
            <input
              type="text"
              id="username"
              placeholder="e.g., john_doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update state on change
              style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#334155', border: '1px solid #475569', borderRadius: '8px', color: 'white' }}
              required
            />
          </div>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update state on change
              style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#334155', border: '1px solid #475569', borderRadius: '8px', color: 'white' }}
              required
            />
          </div>
          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Password</label>
            <input
              type="password"
              id="password"
              placeholder="•••••••• (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update state on change
              style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#334155', border: '1px solid #475569', borderRadius: '8px', color: 'white' }}
              required
            />
          </div>
          <button type="submit" disabled={loading} style={{
            backgroundColor: '#22d3ee',
            color: '#111827',
            fontWeight: 'bold',
            padding: '0.75rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            marginTop: '1rem',
            opacity: loading ? 0.6 : 1 // Dim the button when loading
          }}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        {/* Display success or error messages here */}
        {message && <p style={{ textAlign: 'center', marginTop: '1.5rem', color: message.startsWith('Error') ? '#f87171' : '#34d399' }}>{message}</p>}
      </div>
    </div>
  );
}