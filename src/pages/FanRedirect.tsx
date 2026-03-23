import { Link } from 'react-router-dom';
import { BRAND, COLORS } from '../constants';

export default function FanRedirect() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: COLORS.bg }}>

      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none rounded-full"
           style={{ background: `radial-gradient(circle, ${BRAND.teal}08 0%, transparent 70%)` }} />

      <div className="w-full max-w-[400px] text-center">

        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-10">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden"
               style={{ background: BRAND.teal }}>
            <img src="/images/Icon_Brimz_Logo.png" alt="Brimz" className="w-full h-full object-contain" />
          </div>
          <div className="font-display font-black text-2xl tracking-[0.3em] text-white">BRIMZ</div>
        </div>

        {/* Main message */}
        <div className="rounded-xl border p-8 mb-6" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
          <div className="font-mono text-[10px] font-black tracking-[3px] mb-4" style={{ color: BRAND.teal }}>
            WRONG DOOR
          </div>
          <h1 className="font-display font-black text-2xl text-white mb-3 leading-tight">
            This is the<br />Venue Operator Portal.
          </h1>
          <p className="text-sm leading-relaxed mb-6" style={{ color: COLORS.muted }}>
            Fan accounts and energy scores live in the Brimz app. Download it to track your score, complete challenges, and earn rewards at the game.
          </p>

          {/* App store badges */}
          <div className="flex flex-col gap-3 items-center">
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"
               style={{ display: 'block', lineHeight: 0 }}>
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                style={{ height: 44, width: 'auto' }}
              />
            </a>
            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer"
               style={{ display: 'block', lineHeight: 0 }}>
              <img
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play"
                style={{ height: 64, width: 'auto', marginTop: -10, marginBottom: -10 }}
              />
            </a>
          </div>
        </div>

        {/* Admin link */}
        <p className="font-mono text-[10px]" style={{ color: COLORS.muted }}>
          Are you a venue operator?{' '}
          <Link to="/admin/login" style={{ color: BRAND.teal }}>Sign in here →</Link>
        </p>

      </div>
    </div>
  );
}
