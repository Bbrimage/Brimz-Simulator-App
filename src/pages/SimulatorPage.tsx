import React from 'react';
import { useSim } from '../context/SimulatorContext';
import ConnectScreen  from '../components/simulator/screens/ConnectScreen';
import HomeScreen     from '../components/simulator/screens/HomeScreen';
import EnergyScreen   from '../components/simulator/screens/EnergyScreen';
import StatsScreen    from '../components/simulator/screens/StatsScreen';
import RewardsScreen  from '../components/simulator/screens/RewardsScreen';
import SettingsScreen from '../components/simulator/screens/SettingsScreen';
import BottomNav      from '../components/simulator/BottomNav';
import BrimzNav       from '../components/shared/BrimzNav';
import ArenaWelcome   from '../components/shared/ArenaWelcome';
import { BRAND, COLORS } from '../constants';
import type { FanType, CrowdLevel, SimDuration } from '../types';
import './SimulatorPage.css';

const FAN_TYPES: { id: FanType; label: string; desc: string }[] = [
  { id: 'super',      label: 'SUPER FAN',  desc: '+28 pts/tick' },
  { id: 'engaged',    label: 'ENGAGED',    desc: '+18 pts/tick' },
  { id: 'casual',     label: 'CASUAL',     desc: '+10 pts/tick' },
  { id: 'distracted', label: 'DISTRACTED', desc: '+4 pts/tick'  },
];
const CROWD_LEVELS: { id: CrowdLevel; label: string; multi: string }[] = [
  { id: 'electric',  label: 'ELECTRIC',  multi: '1.4x' },
  { id: 'energized', label: 'ENERGIZED', multi: '1.0x' },
  { id: 'average',   label: 'AVERAGE',   multi: '0.7x' },
  { id: 'quiet',     label: 'QUIET',     multi: '0.4x' },
];
const DURATIONS: { id: SimDuration; label: string }[] = [
  { id: 'instant', label: 'INSTANT' },
  { id: '2min',    label: '2 MIN'   },
  { id: '5min',    label: '5 MIN'   },
];

const mono = "'DM Mono', monospace";
const cond = "'Barlow Condensed', sans-serif";

export default function SimulatorPage() {
  const { state, startSimulation, stopSimulation } = useSim();
  const [fanType,    setFanType]    = React.useState<FanType>('engaged');
  const [crowdLevel, setCrowdLevel] = React.useState<CrowdLevel>('energized');
  const [duration,   setDuration]   = React.useState<SimDuration>('2min');
  const [welcomed,   setWelcomed]   = React.useState(false);

  const currentScreen = () => {
    if (!state.connected) return <ConnectScreen />;
    switch (state.screen) {
      case 'home':     return <HomeScreen />;
      case 'energy':   return <EnergyScreen />;
      case 'stats':    return <StatsScreen />;
      case 'rewards':  return <RewardsScreen />;
      case 'settings': return <SettingsScreen />;
      default:         return <EnergyScreen />;
    }
  };

  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Arena welcome overlay — shown until user enters */}
      {!welcomed && <ArenaWelcome onEnter={() => setWelcomed(true)} />}

      {/* ── Nav bar (same as landing page) ───────────────── */}
      <BrimzNav showMarketingLinks={false} />

      {/* ── Body ─────────────────────────────────────────── */}
      <div className="sim-body">
        <div className="sim-row">

          {/* ── SIDE PANEL — DOM first = top on mobile ──── */}
          <div className="sim-side">

            {state.connected && (
              <>
                <div>
                  <p style={{ fontFamily: cond, fontWeight: 900, fontSize: 22, letterSpacing: 4, color: '#fff', marginBottom: 4 }}>SIMULATOR</p>
                  <p style={{ fontFamily: mono, fontSize: 10, color: COLORS.muted }}>Configure fan + crowd to generate sample data</p>
                </div>

                <ControlSection title="FAN TYPE">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {FAN_TYPES.map(f => (
                      <button key={f.id} onClick={() => setFanType(f.id)} style={{
                        display: 'flex', flexDirection: 'column', padding: 12, borderRadius: 6,
                        border: `1px solid ${fanType === f.id ? BRAND.teal : COLORS.border}`,
                        background: fanType === f.id ? BRAND.teal + '18' : COLORS.surface,
                        cursor: 'pointer', textAlign: 'left',
                      }}>
                        <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: 1, color: fanType === f.id ? BRAND.teal : '#fff' }}>{f.label}</span>
                        <span style={{ fontFamily: mono, fontSize: 9, color: COLORS.muted, marginTop: 2 }}>{f.desc}</span>
                      </button>
                    ))}
                  </div>
                </ControlSection>

                <ControlSection title="CROWD ENERGY">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {CROWD_LEVELS.map(c => (
                      <button key={c.id} onClick={() => setCrowdLevel(c.id)} style={{
                        display: 'flex', flexDirection: 'column', padding: 12, borderRadius: 6,
                        border: `1px solid ${crowdLevel === c.id ? BRAND.gold : COLORS.border}`,
                        background: crowdLevel === c.id ? BRAND.gold + '18' : COLORS.surface,
                        cursor: 'pointer', textAlign: 'left',
                      }}>
                        <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: 1, color: crowdLevel === c.id ? BRAND.gold : '#fff' }}>{c.label}</span>
                        <span style={{ fontFamily: mono, fontSize: 9, color: COLORS.muted, marginTop: 2 }}>{c.multi}</span>
                      </button>
                    ))}
                  </div>
                </ControlSection>

                <ControlSection title="DURATION">
                  <div style={{ display: 'flex', gap: 8 }}>
                    {DURATIONS.map(d => (
                      <button key={d.id} onClick={() => setDuration(d.id)} style={{
                        flex: 1, padding: '10px 0', borderRadius: 6,
                        border: `1px solid ${duration === d.id ? BRAND.teal : COLORS.border}`,
                        background: duration === d.id ? BRAND.teal + '18' : COLORS.surface,
                        color: duration === d.id ? BRAND.teal : COLORS.muted,
                        fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: 1,
                        cursor: 'pointer',
                      }}>{d.label}</button>
                    ))}
                  </div>
                </ControlSection>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => startSimulation({ fanType, crowdLevel, duration })}
                    disabled={state.isSimulating}
                    style={{
                      flex: 1, padding: '14px 0', borderRadius: 6,
                      background: state.isSimulating ? BRAND.teal + '60' : BRAND.teal,
                      color: COLORS.bg, border: 'none',
                      fontFamily: mono, fontSize: 12, fontWeight: 700, letterSpacing: 2,
                      cursor: state.isSimulating ? 'default' : 'pointer',
                    }}>
                    {state.isSimulating ? 'RUNNING...' : 'RUN SIM'}
                  </button>
                  {state.isSimulating && (
                    <button onClick={stopSimulation} style={{
                      padding: '14px 20px', borderRadius: 6,
                      border: `1px solid ${BRAND.red}50`, background: COLORS.surface, color: BRAND.red,
                      fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 1, cursor: 'pointer',
                    }}>STOP</button>
                  )}
                </div>

                {state.isSimulating && (
                  <div style={{ height: 3, borderRadius: 2, background: COLORS.border, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${state.simulationProgress}%`,
                      background: BRAND.teal, borderRadius: 2, transition: 'width 0.3s',
                    }} />
                  </div>
                )}
              </>
            )}

            {!state.connected && (
              <>
                <div>
                  <h2 style={{ fontFamily: cond, fontWeight: 900, fontSize: 32, letterSpacing: 3, color: '#fff', lineHeight: 1, marginBottom: 10 }}>
                    TAP TO<br />CONNECT
                  </h2>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: COLORS.muted, lineHeight: 1.7 }}>
                    Tap the circle on the phone screen to simulate your wristband NFC pairing. Once connected, configure your fan type and run the sim.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {([
                    ['Real-time energy tracking',     BRAND.teal ],
                    ['Live challenges + crowd hype',  BRAND.gold ],
                    ['Token-gated reward redemption', BRAND.green],
                  ] as [string, string][]).map(([text, color]) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: COLORS.muted }}>{text}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>{/* /sim-side */}

          {/* ── PHONE + DOWNLOAD — DOM second = bottom on mobile ── */}
          <div className="sim-phone-col">

            <div style={{ position: 'relative', width: 300 }}>
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                zIndex: 20, width: 100, height: 24,
                borderBottomLeftRadius: 16, borderBottomRightRadius: 16, background: '#000',
              }} />
              <div style={{
                borderRadius: 44, padding: 8, position: 'relative',
                background: '#1a1a2e',
                boxShadow: '0 0 0 1px #2d2d4a, 0 32px 80px rgba(0,0,0,0.8), 0 0 60px rgba(28,244,234,0.06)',
              }}>
                <div style={{ borderRadius: 38, overflow: 'hidden', height: 600, background: COLORS.bg }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 24px 4px', height: 44, background: COLORS.bg,
                  }}>
                    <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: '#fff' }}>9:41</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {[2.5, 3, 4, 4].map((h, i) => (
                        <div key={i} style={{ width: 4, height: h, borderRadius: 2, background: '#fff', opacity: 0.4 + i * 0.2 }} />
                      ))}
                      <div style={{ width: 20, height: 10, borderRadius: 3, border: '1px solid rgba(255,255,255,0.4)', marginLeft: 2, position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: 2, borderRadius: 2, background: '#fff' }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ position: 'relative', height: 556 - (state.connected ? 56 : 0) }}>
                    {currentScreen()}
                  </div>
                  {state.connected && <BottomNav />}
                </div>
              </div>
              {[
                { side: 'right' as const, top: 80,  h: 48 },
                { side: 'right' as const, top: 144, h: 32 },
                { side: 'left'  as const, top: 96,  h: 40 },
                { side: 'left'  as const, top: 152, h: 40 },
                { side: 'left'  as const, top: 208, h: 40 },
              ].map((b, i) => (
                <div key={i} style={{
                  position: 'absolute', [b.side]: -6, top: b.top,
                  width: 4, height: b.h, borderRadius: 4, background: '#1a1a2e',
                }} />
              ))}
            </div>

            {/* Download badges */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
              <a href="#" style={{ display: 'block', textDecoration: 'none', lineHeight: 0 }}>
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on the App Store"
                  style={{ height: 44, width: 'auto', display: 'block' }}
                />
              </a>
              <a href="#" style={{ display: 'block', textDecoration: 'none', lineHeight: 0 }}>
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  style={{ height: 64, width: 'auto', display: 'block', marginTop: -10, marginBottom: -10 }}
                />
              </a>
            </div>

          </div>{/* /sim-phone-col */}

        </div>{/* /sim-row */}
      </div>{/* /sim-body */}

    </div>
  );
}

function ControlSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, color: COLORS.muted, marginBottom: 8 }}>{title}</p>
      {children}
    </div>
  );
}