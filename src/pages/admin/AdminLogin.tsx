import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BRAND, COLORS } from '../../constants';

export default function AdminLogin() {
  const { signIn } = useAdminAuth();
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
    navigate('/admin/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: COLORS.bg }}>
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none rounded-full"
           style={{ background: `radial-gradient(circle, ${BRAND.teal}08 0%, transparent 70%)` }} />

      <div className="w-full max-w-[380px] animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-10">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-2xl"
               style={{ background: BRAND.teal, color: COLORS.bg }}>B</div>
          <div className="font-display font-black text-2xl tracking-[0.3em] text-white">BRIMZ</div>
          <div className="font-mono text-[10px] tracking-[3px]" style={{ color: COLORS.muted }}>ADMIN PORTAL</div>
        </div>

        {/* Card */}
        <div className="rounded-xl border p-7" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
          <h1 className="font-body font-black text-xl text-white mb-1">Sign In</h1>
          <p className="text-xs mb-6" style={{ color: COLORS.muted }}>
            Venue operator access only.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-mono text-[10px] font-bold tracking-[1.5px] block mb-1.5" style={{ color: COLORS.muted }}>
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@venue.com"
                required
                className="w-full px-3.5 py-3 rounded border text-sm text-white placeholder-opacity-40 outline-none transition-colors focus:border-opacity-80"
                style={{
                  background:   COLORS.surface2,
                  borderColor:  COLORS.border,
                  fontFamily:   '"Barlow", sans-serif',
                }}
                onFocus={e => e.target.style.borderColor = BRAND.teal + '60'}
                onBlur={e  => e.target.style.borderColor = COLORS.border}
              />
            </div>
            <div>
              <label className="font-mono text-[10px] font-bold tracking-[1.5px] block mb-1.5" style={{ color: COLORS.muted }}>
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-3 rounded border text-sm text-white outline-none transition-colors"
                style={{ background: COLORS.surface2, borderColor: COLORS.border, fontFamily: '"Barlow", sans-serif' }}
                onFocus={e => e.target.style.borderColor = BRAND.teal + '60'}
                onBlur={e  => e.target.style.borderColor = COLORS.border}
              />
            </div>

            {error && (
              <p className="text-xs px-3 py-2 rounded border"
                 style={{ color: BRAND.red, background: BRAND.red + '10', borderColor: BRAND.red + '30' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded font-mono font-black text-xs tracking-[2px] transition-opacity disabled:opacity-60"
              style={{ background: BRAND.teal, color: COLORS.bg }}>
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] mt-6" style={{ color: COLORS.dim }}>
          Not a venue operator?{' '}
          <a href="https://brimz.tech" className="underline" style={{ color: COLORS.muted }}>
            Back to brimz.tech
          </a>
        </p>
      </div>
    </div>
  );
}
