import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile({ ...user, ...profileData });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading profile...</div>;
  }

  if (!profile) {
    return <div style={{ color: 'white', padding: '2rem' }}>Could not load profile. Please log in again.</div>;
  }

  return (
    <div style={{ backgroundColor: '#111827', minHeight: 'calc(100vh - 142px)', color: 'white', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="section-heading" style={{ textAlign: 'left', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
          Profile Settings
        </h1>
        <div style={{ marginTop: '2rem', backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: '#9ca3af', margin: '0 0 0.5rem 0' }}>Username</p>
            <p style={{ margin: 0, fontSize: '1.2rem' }}>{profile.username}</p>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: '#9ca3af', margin: '0 0 0.5rem 0' }}>Email Address</p>
            <p style={{ margin: 0, fontSize: '1.2rem' }}>{profile.email}</p>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: '#9ca3af', margin: '0 0 0.5rem 0' }}>User Since</p>
            <p style={{ margin: 0, fontSize: '1.2rem' }}>{new Date(profile.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}