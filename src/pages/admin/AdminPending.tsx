import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BRAND, COLORS } from '../../constants';
import { Clock, ShieldOff } from 'lucide-react';

export default function AdminPending() {
  const { adminUser, signOut } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (adminUser?.status === 'approved') navigate('/admin/dashboard', { replace: true });
  }, [adminUser, navigate]);

  async function handleSignOut() {
    await signOut();
    navigate('/admin/login');
  }

  const suspended = adminUser?.status === 'suspended';

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: COLORS.bg }}>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none rounded-full"
           style={{ background: `radial-gradient(circle, ${suspended ? BRAND.gold : BRAND.teal}08 0%, transparent 70%)` }} />

      <div className="w-full max-w-[400px] text-center animate-fade-in">

        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
               style={{ background: BRAND.teal }}>
            <img src="/images/Icon_Brimz_Logo.png" alt="Brimz" className="w-full h-full object-contain" />
          </div>
          <div className="font-display font-black text-2xl tracking-[0.3em] text-white">BRIMZ</div>
          <div className="font-mono text-[10px] tracking-[3px]" style={{ color: COLORS.muted }}>ADMIN PORTAL</div>
        </div>

        <div className="rounded-xl border p-8" style={{ background: COLORS.surface, borderColor: COLORS.border }}>

          {/* Icon */}
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
               style={{
                 background: (suspended ? BRAND.gold : BRAND.teal) + '15',
                 border: `1px solid ${(suspended ? BRAND.gold : BRAND.teal)}30`,
               }}>
            {suspended
              ? <ShieldOff size={20} color={BRAND.gold} />
              : <Clock size={20} color={BRAND.teal} />
            }
          </div>

          {suspended ? (
            <>
              <h1 className="font-body font-black text-xl text-white mb-2">Access Suspended</h1>
              <p className="text-sm leading-relaxed mb-6" style={{ color: COLORS.muted }}>
                Your admin account has been suspended. Please contact the Brimz team for assistance.
              </p>
              <p className="text-xs mb-6" style={{ color: COLORS.muted }}>
                Email <span style={{ color: BRAND.gold }}>access@brimz.tech</span>
              </p>
            </>
          ) : (
            <>
              <h1 className="font-body font-black text-xl text-white mb-2">Access Pending</h1>
              <p className="text-sm leading-relaxed mb-6" style={{ color: COLORS.muted }}>
                Your account has been submitted and is awaiting review by the Brimz team. Once approved, you'll have full access to your venue's admin portal.
              </p>

              <div className="rounded-lg p-4 mb-6 text-left"
                   style={{ background: BRAND.teal + '08', border: `1px solid ${BRAND.teal}20` }}>
                <div className="font-mono text-[9px] font-black tracking-[2px] mb-3" style={{ color: BRAND.teal }}>
                  WHAT HAPPENS NEXT
                </div>
                {[
                  'The Brimz team reviews your request',
                  'We assign your venue and configure access',
                  'You receive confirmation and can log in',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
                    <span className="font-mono text-[9px] font-black mt-0.5 shrink-0" style={{ color: BRAND.teal }}>0{i + 1}</span>
                    <span className="text-xs" style={{ color: COLORS.muted }}>{step}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs mb-6" style={{ color: COLORS.muted }}>
                Questions? Email <span style={{ color: BRAND.teal }}>access@brimz.tech</span>
              </p>
            </>
          )}

          <button onClick={handleSignOut}
            className="w-full py-2.5 rounded-lg font-mono text-xs font-bold tracking-[1px] transition-opacity hover:opacity-70"
            style={{ background: COLORS.border, color: COLORS.muted }}>
            SIGN OUT
          </button>
        </div>

        <p className="mt-5 font-mono text-[10px]" style={{ color: COLORS.muted }}>
          <Link to="/admin/signup" style={{ color: BRAND.teal }}>Back to sign up</Link>
          {' · '}
          <Link to="/" style={{ color: COLORS.muted }}>Home</Link>
        </p>
      </div>
    </div>
  );
}
