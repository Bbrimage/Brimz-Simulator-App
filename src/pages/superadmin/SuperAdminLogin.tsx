import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext';
import { BRAND, COLORS } from '../../constants';
import { Shield } from 'lucide-react';

export default function SuperAdminLogin() {
  const { signIn } = useSuperAdminAuth();
  const navigate   = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const err = await signIn(email, password);
    setLoading(false);
    if (err) { setError(err); return; }
    navigate('/superadmin/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: COLORS.bg }}>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none rounded-full"
           style={{ background: `radial-gradient(circle, ${BRAND.gold}06 0%, transparent 70%)` }} />

      <div className="w-full max-w-[380px] animate-fade-in">
        <div className="flex flex-col items-center gap-2 mb-10">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
               style={{ background: BRAND.gold + '20', border: `1px solid ${BRAND.gold}40` }}>
            <Shield size={24} color={BRAND.gold} />
          </div>
          <div className="font-display font-black text-2xl tracking-[0.3em] text-white">BRIMZ</div>
          <div className="font-mono text-[10px] tracking-[3px]" style={{ color: BRAND.gold }}>SUPER ADMIN</div>
        </div>

        <div className="rounded-xl border p-7" style={{ background: COLORS.surface, borderColor: BRAND.gold + '30' }}>
          <h1 className="font-body font-black text-xl text-white mb-1">Internal Access</h1>
          <p className="text-xs mb-6" style={{ color: COLORS.muted }}>Brimz team members only.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-mono text-[10px] font-bold tracking-[1.5px] block mb-1.5" style={{ color: COLORS.muted }}>EMAIL</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                     className="w-full px-3.5 py-3 rounded border text-sm text-white outline-none"
                     style={{ background: COLORS.surface2, borderColor: COLORS.border, fontFamily: '"Barlow", sans-serif' }} />
            </div>
            <div>
              <label className="font-mono text-[10px] font-bold tracking-[1.5px] block mb-1.5" style={{ color: COLORS.muted }}>PASSWORD</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                     className="w-full px-3.5 py-3 rounded border text-sm text-white outline-none"
                     style={{ background: COLORS.surface2, borderColor: COLORS.border, fontFamily: '"Barlow", sans-serif' }} />
            </div>
            {error && (
              <p className="text-xs px-3 py-2 rounded border" style={{ color: BRAND.red, background: BRAND.red + '10', borderColor: BRAND.red + '30' }}>{error}</p>
            )}
            <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded font-mono font-black text-xs tracking-[2px] disabled:opacity-60"
                    style={{ background: BRAND.gold, color: COLORS.bg }}>
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
