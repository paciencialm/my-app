import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if the URL looks like a dashboard URL instead of an API URL
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const isWrongUrl = supabaseUrl.includes('supabase.com/dashboard');

  useEffect(() => {
    if (isWrongUrl) {
      setLoading(false);
      return;
    }

    async function fetchProfiles() {
      try {
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) throw error;
        if (data) setProfiles(data);
      } catch (err: any) {
        console.error('Error fetching profiles:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfiles();
  }, [isWrongUrl]);

  return (
    <div style={{ padding: '40px 20px' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '8px' }}>Project Database</h1>
        <p style={{ opacity: 0.7 }}>Real-time synchronization with Supabase</p>
      </header>

      {isWrongUrl && (
        <div className="warning-box">
          <strong>⚠️ Incorrect Project URL Detected</strong>
          <p>It looks like you pasted the <strong>Dashboard URL</strong> instead of the <strong>API Project URL</strong> in your <code>.env</code> file.</p>
          <p style={{ marginTop: '12px' }}>Please go to: <strong>Settings ⮕ API</strong> and copy the <strong>Project URL</strong> (e.g., <code>https://xyz.supabase.co</code>).</p>
        </div>
      )}

      {error && !isWrongUrl && (
        <div className="warning-box" style={{ borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="badge">Syncing data...</div>
        </div>
      ) : (
        <div className="profiles-grid">
          {profiles.length === 0 && !isWrongUrl && !error && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
              <p>No data found in the <code>profiles</code> table.</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>Make sure you ran the SQL script to create the table and insert dummy data.</p>
            </div>
          )}
          
          {profiles.map((profile) => (
            <div key={profile.id} className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  {profile.full_name?.charAt(0) || '?'}
                </div>
                <div className="profile-info">
                  <h3>{profile.full_name}</h3>
                  <p>@{profile.username}</p>
                </div>
              </div>
              
              <div className="badge">Active Profile</div>
              
              {profile.website && (
                <p style={{ fontSize: '13px', marginTop: '8px' }}>
                  🌐 <a href={profile.website} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>{profile.website}</a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;


