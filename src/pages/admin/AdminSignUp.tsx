import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { supabase } from '../../lib/supabase';
import { BRAND, COLORS } from '../../constants';

const LEAGUES    = ['NFL', 'NBA', 'NHL', 'MLB', 'MLS', 'NCAA', 'WWE / Wrestling', 'Esports', 'Other'];
const CAPACITIES = ['Under 5,000', '5,000 – 15,000', '15,000 – 30,000', '30,000 – 60,000', '60,000+'];

const COMPLIANCE_ITEMS = [
  { id: 0, label: 'I will not sell, share, or transfer fan data to any third party without that fan\'s express written consent.' },
  { id: 1, label: 'I will not use fan data collected through Brimz for any purpose outside of fan engagement on the Brimz platform.' },
  { id: 2, label: 'I will ensure our organization complies with all applicable data protection laws, including GDPR and CCPA where applicable.' },
  { id: 3, label: 'I acknowledge that Brimz owns and operates the platform infrastructure. Fan data is processed under Brimz\'s Privacy Policy and Terms of Service.' },
  { id: 4, label: 'I will notify Brimz immediately upon discovery of any data breach, unauthorized access, or misuse involving fan data.' },
  { id: 5, label: 'I understand that misuse of fan data or violation of these terms will result in immediate suspension of our venue\'s platform access.' },
  { id: 6, label: 'I confirm I am authorized to enter into this agreement on behalf of my organization.' },
];

const inputCls   = 'w-full px-3.5 py-3 rounded border text-sm text-white outline-none transition-colors bg-transparent';
const inputStyle = { borderColor: COLORS.border, background: COLORS.bg + '80' };
const labelCls   = 'font-mono text-[10px] font-bold tracking-[1.5px] block mb-1.5';

export default function AdminSignUp() {
  const { signUp }  = useAdminAuth();
  const navigate    = useNavigate();
  const [tab, setTab] = useState<'access' | 'inquiry'>('access');

  // ── Access request form ────────────────────────────────────────────────────
  const [access, setAccess]         = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [agreed, setAgreed]         = useState<Record<number, boolean>>({});
  const [accessErr, setAccessErr]   = useState('');
  const [accessBusy, setAccessBusy] = useState(false);

  const allAgreed = COMPLIANCE_ITEMS.every(item => agreed[item.id]);

  function toggleAgreed(id: number) {
    setAgreed(prev => ({ ...prev, [id]: !prev[id] }));
  }

  async function submitAccess(e: React.FormEvent) {
    e.preventDefault();
    if (access.password !== access.confirm) { setAccessErr('Passwords do not match.'); return; }
    if (access.password.length < 8)         { setAccessErr('Password must be at least 8 characters.'); return; }
    if (!allAgreed)                         { setAccessErr('You must agree to all data protection terms before submitting.'); return; }
    setAccessErr(''); setAccessBusy(true);
    const err = await signUp(access.fullName, access.email, access.password);
    setAccessBusy(false);
    if (err) { setAccessErr(err); return; }
    navigate('/admin/pending');
  }

  // ── Inquiry / demo form ────────────────────────────────────────────────────
  const [inq, setInq]           = useState({ org_name: '', league: '', capacity: '', contact_name: '', email: '', phone: '', message: '' });
  const [inqErr, setInqErr]     = useState('');
  const [inqBusy, setInqBusy]   = useState(false);
  const [inqDone, setInqDone]   = useState(false);

  async function submitInquiry(e: React.FormEvent) {
    e.preventDefault();
    setInqErr(''); setInqBusy(true);
    const { error } = await supabase.from('venue_inquiries').insert({
      org_name:     inq.org_name,
      league:       inq.league   || null,
      capacity:     inq.capacity || null,
      contact_name: inq.contact_name,
      email:        inq.email,
      phone:        inq.phone    || null,
      message:      inq.message  || null,
    });
    setInqBusy(false);
    if (error) { setInqErr(error.message); return; }
    setInqDone(true);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: COLORS.bg }}>
      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none rounded-full"
           style={{ background: `radial-gradient(circle, ${BRAND.teal}08 0%, transparent 70%)` }} />

      <div className="w-full max-w-[440px] animate-fade-in">

        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
               style={{ background: BRAND.teal }}>
            <img src="/images/Icon_Brimz_Logo.png" alt="Brimz" className="w-full h-full object-contain" />
          </div>
          <div className="font-display font-black text-2xl tracking-[0.3em] text-white">BRIMZ</div>
          <div className="font-mono text-[10px] tracking-[3px]" style={{ color: COLORS.muted }}>ADMIN PORTAL</div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg p-1 mb-6"
             style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
          {[
            { id: 'access',  label: 'REQUEST ACCESS' },
            { id: 'inquiry', label: 'BOOK A DEMO'    },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
              className="flex-1 py-2 rounded font-mono text-[10px] font-bold tracking-[1px] transition-all"
              style={{ background: tab === t.id ? BRAND.teal : 'transparent', color: tab === t.id ? COLORS.bg : COLORS.muted }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── REQUEST ACCESS ─────────────────────────────────────── */}
        {tab === 'access' && (
          <div className="rounded-xl border p-7" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
            <h1 className="font-body font-black text-xl text-white mb-1">Request Admin Access</h1>
            <p className="text-xs mb-6" style={{ color: COLORS.muted }}>
              For Brimz venue operators only. Your account will be reviewed before access is granted.
            </p>

            <form onSubmit={submitAccess} className="flex flex-col gap-4">

              <div>
                <label className={labelCls} style={{ color: COLORS.muted }}>FULL NAME</label>
                <input value={access.fullName} onChange={e => setAccess(f => ({ ...f, fullName: e.target.value }))}
                  placeholder="Jane Smith" required className={inputCls} style={inputStyle} />
              </div>

              <div>
                <label className={labelCls} style={{ color: COLORS.muted }}>EMAIL</label>
                <input type="email" value={access.email} onChange={e => setAccess(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@venue.com" required className={inputCls} style={inputStyle} />
              </div>

              <div>
                <label className={labelCls} style={{ color: COLORS.muted }}>PASSWORD</label>
                <input type="password" value={access.password} onChange={e => setAccess(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 8 characters" required className={inputCls} style={inputStyle} />
              </div>

              <div>
                <label className={labelCls} style={{ color: COLORS.muted }}>CONFIRM PASSWORD</label>
                <input type="password" value={access.confirm} onChange={e => setAccess(f => ({ ...f, confirm: e.target.value }))}
                  placeholder="••••••••" required className={inputCls} style={inputStyle} />
              </div>

              {/* Data Protection Agreement */}
              <div className="rounded-lg border overflow-hidden" style={{ borderColor: COLORS.border }}>
                <div className="px-4 py-2.5 border-b" style={{ background: BRAND.teal + '0A', borderColor: COLORS.border }}>
                  <span className="font-mono text-[9px] font-black tracking-[2px]" style={{ color: BRAND.teal }}>
                    DATA PROTECTION AGREEMENT
                  </span>
                </div>
                <div className="px-4 py-3 flex flex-col gap-3" style={{ background: COLORS.bg + '60' }}>
                  <p className="font-mono text-[9px] leading-relaxed" style={{ color: COLORS.muted }}>
                    By submitting this request you agree to the following on behalf of your organization:
                  </p>
                  {COMPLIANCE_ITEMS.map(item => (
                    <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                      <div
                        onClick={() => toggleAgreed(item.id)}
                        className="mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center transition-all"
                        style={{
                          background:   agreed[item.id] ? BRAND.teal : 'transparent',
                          border:       `1.5px solid ${agreed[item.id] ? BRAND.teal : COLORS.border}`,
                          cursor:       'pointer',
                        }}>
                        {agreed[item.id] && (
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                            <path d="M1 3.5L3.5 6L8 1" stroke="#080810" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span
                        onClick={() => toggleAgreed(item.id)}
                        className="text-[11px] leading-relaxed select-none"
                        style={{ color: agreed[item.id] ? '#fff' : COLORS.muted }}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {accessErr && <p className="font-mono text-xs" style={{ color: '#F87171' }}>{accessErr}</p>}

              <button type="submit" disabled={accessBusy || !allAgreed}
                className="w-full py-3 rounded-lg font-mono text-xs font-bold tracking-[2px] transition-opacity"
                style={{
                  background: !allAgreed || accessBusy ? BRAND.teal + '40' : BRAND.teal,
                  color: COLORS.bg,
                  cursor: !allAgreed || accessBusy ? 'default' : 'pointer',
                }}>
                {accessBusy ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
              </button>
            </form>
          </div>
        )}

        {/* ── BOOK A DEMO ────────────────────────────────────────── */}
        {tab === 'inquiry' && (
          <div className="rounded-xl border p-7" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
            {inqDone ? (
              <div className="text-center py-4">
                <div className="font-mono text-[10px] tracking-[2px] mb-3" style={{ color: BRAND.teal }}>
                  ✓ REQUEST RECEIVED
                </div>
                <h2 className="font-body font-black text-xl text-white mb-3">We'll be in touch.</h2>
                <p className="text-sm leading-relaxed" style={{ color: COLORS.muted }}>
                  A member of the Brimz team will reach out within 1–2 business days to discuss your venue's needs.
                </p>
              </div>
            ) : (
              <>
                <h1 className="font-body font-black text-xl text-white mb-1">Book a Demo</h1>
                <p className="text-xs mb-6" style={{ color: COLORS.muted }}>
                  Interested in bringing Brimz to your venue? Tell us about your team and we'll reach out.
                </p>

                <form onSubmit={submitInquiry} className="flex flex-col gap-4">

                  <div>
                    <label className={labelCls} style={{ color: COLORS.muted }}>ORGANIZATION / TEAM NAME</label>
                    <input value={inq.org_name} onChange={e => setInq(f => ({ ...f, org_name: e.target.value }))}
                      placeholder="Baltimore Ravens" required className={inputCls} style={inputStyle} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls} style={{ color: COLORS.muted }}>LEAGUE / SPORT</label>
                      <select value={inq.league} onChange={e => setInq(f => ({ ...f, league: e.target.value }))} required
                        className={inputCls} style={{ ...inputStyle, appearance: 'none' as any }}>
                        <option value="">Select...</option>
                        {LEAGUES.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: COLORS.muted }}>VENUE CAPACITY</label>
                      <select value={inq.capacity} onChange={e => setInq(f => ({ ...f, capacity: e.target.value }))} required
                        className={inputCls} style={{ ...inputStyle, appearance: 'none' as any }}>
                        <option value="">Select...</option>
                        {CAPACITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls} style={{ color: COLORS.muted }}>CONTACT NAME</label>
                    <input value={inq.contact_name} onChange={e => setInq(f => ({ ...f, contact_name: e.target.value }))}
                      placeholder="Your name" required className={inputCls} style={inputStyle} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls} style={{ color: COLORS.muted }}>EMAIL</label>
                      <input type="email" value={inq.email} onChange={e => setInq(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@team.com" required className={inputCls} style={inputStyle} />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: COLORS.muted }}>PHONE (OPT.)</label>
                      <input type="tel" value={inq.phone} onChange={e => setInq(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+1 555 000 0000" className={inputCls} style={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls} style={{ color: COLORS.muted }}>TELL US ABOUT YOUR NEEDS</label>
                    <textarea value={inq.message} onChange={e => setInq(f => ({ ...f, message: e.target.value }))}
                      placeholder="What are you hoping Brimz can do for your fans?" rows={3}
                      className={inputCls} style={{ ...inputStyle, resize: 'none' }} />
                  </div>

                  {inqErr && <p className="font-mono text-xs" style={{ color: '#F87171' }}>{inqErr}</p>}

                  <button type="submit" disabled={inqBusy}
                    className="w-full py-3 rounded-lg font-mono text-xs font-bold tracking-[2px] transition-opacity"
                    style={{ background: inqBusy ? BRAND.teal + '60' : BRAND.teal, color: COLORS.bg,
                             cursor: inqBusy ? 'default' : 'pointer' }}>
                    {inqBusy ? 'SENDING...' : 'SEND INQUIRY'}
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        <p className="text-center mt-5 font-mono text-[10px]" style={{ color: COLORS.muted }}>
          Already have access?{' '}
          <Link to="/admin/login" style={{ color: BRAND.teal }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
