import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }

      setMessage('Login successful! Redirecting...');
      // Redirect to the dashboard after a successful login
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);

    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
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
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#334155', border: '1px solid #475569', borderRadius: '8px', color: 'white' }}
              required
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            opacity: loading ? 0.6 : 1
          }}>
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        {message && <p style={{ textAlign: 'center', marginTop: '1.5rem', color: message.startsWith('Error') ? '#f87171' : '#34d399' }}>{message}</p>}
      </div>
    </div>
  );
}