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
    <div className="min-h-screen p-6 md:p-12 lg:p-20">
      <header className="max-w-4xl mx-auto mb-20 text-center space-y-4">
        <div className="inline-block px-4 py-1.5 rounded-full bg-brand-500/10 text-brand-500 text-sm font-bold tracking-widest uppercase mb-2 animate-fade-in">
          Supabase Ecosystem
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-brand-950 tracking-tighter">
          Project <span className="text-brand-500">Database</span>
        </h1>
        <p className="text-xl md:text-2xl opacity-50 font-medium max-w-2xl mx-auto">
          Experience seamless real-time synchronization with our high-performance architecture.
        </p>
      </header>

      {isWrongUrl && (
        <div className="max-w-3xl mx-auto mb-12 p-8 glass-card border-amber-200/50 bg-amber-50/30 text-amber-900 shadow-xl">
          <div className="flex items-start gap-4">
            <span className="text-3xl">⚠️</span>
            <div>
              <strong className="block text-xl mb-2 font-bold">Incorrect Project URL</strong>
              <p className="mb-4 opacity-80 leading-relaxed">It looks like you pasted the <strong>Dashboard URL</strong> instead of the <strong>API Project URL</strong> in your <code>.env</code> file.</p>
              <div className="p-4 bg-white/50 rounded-xl border border-amber-200/50 text-sm font-medium">
                Please go to: <strong>Settings ⮕ API</strong> and copy the <strong>Project URL</strong> (e.g., <code>https://xyz.supabase.co</code>).
              </div>
            </div>
          </div>
        </div>
      )}

      {error && !isWrongUrl && (
        <div className="max-w-3xl mx-auto mb-12 p-8 glass-card border-red-200/50 bg-red-50/30 text-red-900 shadow-xl">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🔴</span>
            <div>
              <strong className="block text-lg font-bold">System Error</strong> 
              <p className="opacity-80 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col justify-center items-center py-32 space-y-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-brand-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-brand-500 font-bold tracking-widest uppercase text-sm animate-pulse">
            Establishing Secure Connection...
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {profiles.length === 0 && !isWrongUrl && !error && (
            <div className="col-span-full glass-card py-32 text-center space-y-6">
              <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto text-4xl">
                📂
              </div>
              <div>
                <p className="text-2xl text-brand-950 font-extrabold mb-2">No Records Found</p>
                <p className="text-brand-500 font-medium opacity-60 max-w-md mx-auto">
                  The <code>profiles</code> table is currently empty. Run your SQL migration scripts to populate the database.
                </p>
              </div>
            </div>
          )}
          
          {profiles.map((profile, idx) => (
            <div 
              key={profile.id} 
              className="glass-card group p-8 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 flex flex-col justify-between h-full"
              style={{ animationDelay: `${idx * 100}ms` } as any}
            >
              <div>
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-950 text-white flex items-center justify-center text-2xl font-black shadow-xl shadow-brand-500/30 group-hover:rotate-6 transition-transform">
                    {profile.full_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-950 group-hover:text-brand-500 transition-colors">{profile.full_name}</h3>
                    <p className="text-brand-500/60 font-bold text-sm tracking-tight">@{profile.username}</p>
                  </div>
                </div>
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-950 text-[10px] font-black tracking-widest uppercase mb-8 ring-1 ring-brand-950/5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Identity Verified
                </div>
              </div>
              
              {profile.website && (
                <div className="pt-6 border-t border-brand-950/5">
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-between group/link"
                  >
                    <span className="text-sm font-bold text-brand-950/40 group-hover/link:text-accent transition-colors flex items-center">
                      <span className="mr-2">🌍</span>
                      {profile.website.replace(/^https?:\/\//, '')}
                    </span>
                    <span className="text-brand-950/20 group-hover/link:text-accent group-hover/link:translate-x-1 transition-all">→</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <footer className="mt-32 text-center py-10 border-t border-brand-950/5 text-brand-950/30 text-xs font-bold tracking-[0.2em] uppercase">
        Built with Antigravity & Supabase
      </footer>
    </div>
  );
}

export default App;


