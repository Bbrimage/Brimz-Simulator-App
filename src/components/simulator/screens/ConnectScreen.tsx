import { useState } from 'react';
import { useSim } from '../../../context/SimulatorContext';
import { BRAND } from '../../../constants';

type Status = 'idle' | 'scanning' | 'connecting' | 'success';

export default function ConnectScreen() {
  const { connect } = useSim();
  const [status, setStatus] = useState<Status>('idle');

  async function handleTap() {
    if (status !== 'idle') return;
    setStatus('scanning');
    await delay(1400);
    setStatus('connecting');
    await delay(1000);
    setStatus('success');
    await delay(800);
    connect();
  }

  const isActive = status === 'scanning' || status === 'connecting';

  return (
    <div className="flex flex-col items-center justify-between h-full px-7 pt-16 pb-10"
         style={{ background: '#080810' }}>

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] h-[280px] rounded-full pointer-events-none"
           style={{ background: `radial-gradient(circle, ${BRAND.tealDim} 0%, transparent 70%)`, filter: 'blur(40px)' }} />

      {/* Header */}
      <div className="flex flex-col items-center gap-2 z-10 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-xl"
               style={{ background: BRAND.teal, color: '#080810' }}>
            B
          </div>
          <span className="font-display text-3xl font-black tracking-[0.25em] text-white">BRIMZ</span>
        </div>
        <span className="font-mono text-[10px] font-bold tracking-[3px]" style={{ color: '#4B5563' }}>
          ARENA FAN EXPERIENCE
        </span>
      </div>

      {/* Tap zone */}
      <div className="relative flex items-center justify-center w-[240px] h-[240px] z-10">
        {/* Rings */}
        {isActive && (
          <>
            <div className="absolute w-[170px] h-[170px] rounded-full border animate-ring-1"
                 style={{ borderColor: BRAND.teal }} />
            <div className="absolute w-[210px] h-[210px] rounded-full border animate-ring-2"
                 style={{ borderColor: BRAND.teal }} />
            <div className="absolute w-[240px] h-[240px] rounded-full border animate-ring-3"
                 style={{ borderColor: BRAND.teal }} />
          </>
        )}

        {/* Main circle */}
        <button
          onClick={handleTap}
          disabled={isActive || status === 'success'}
          className="relative flex items-center justify-center w-[132px] h-[132px] rounded-full transition-transform select-none"
          style={{
            background: status === 'success' ? BRAND.green : BRAND.teal,
            boxShadow: `0 0 32px ${status === 'success' ? BRAND.green : BRAND.teal}80`,
            animation: status === 'idle' ? 'idle-pulse 3s ease-in-out infinite' : undefined,
          }}
        >
          {isActive ? (
            <Spinner />
          ) : (
            <span className="font-display font-black text-[52px] leading-none"
                  style={{ color: '#080810' }}>
              {status === 'success' ? '✓' : 'B'}
            </span>
          )}
        </button>
      </div>

      {/* Status text */}
      <div className="flex flex-col items-center gap-2 text-center z-10">
        {status === 'idle' && (
          <>
            <p className="font-display font-black text-lg tracking-widest text-white leading-tight">
              TAP YOUR WRISTBAND<br />TO CONNECT
            </p>
            <p className="text-xs" style={{ color: '#4B5563' }}>
              Hold the top of your phone to your bracelet
            </p>
          </>
        )}
        {status === 'scanning' && (
          <p className="font-display font-black text-lg tracking-widest text-white">SCANNING...</p>
        )}
        {status === 'connecting' && (
          <p className="font-display font-black text-lg tracking-widest text-white">CONNECTING TO THE GAME</p>
        )}
        {status === 'success' && (
          <p className="font-display font-black text-lg tracking-widest" style={{ color: BRAND.green }}>
            YOU'RE IN!
          </p>
        )}
      </div>

      {/* CTA button */}
      {status === 'idle' && (
        <button
          onClick={handleTap}
          className="w-full h-14 font-display font-black text-sm tracking-[3px] transition-opacity hover:opacity-90 z-10"
          style={{ background: BRAND.teal, color: '#080810', borderRadius: '4px', boxShadow: `0 4px 20px ${BRAND.teal}60` }}
        >
          TAP TO CONNECT
        </button>
      )}
      {status !== 'idle' && <div className="w-full h-14 z-10" />}

      {/* Legal */}
      <div className="flex items-center gap-2 z-10">
        <a href="/privacy" target="_blank" className="text-xs underline" style={{ color: '#374151' }}>Privacy Policy</a>
        <span className="text-xs" style={{ color: '#374151' }}>·</span>
        <a href="/terms" target="_blank" className="text-xs underline" style={{ color: '#374151' }}>Terms of Service</a>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
         style={{ borderColor: '#08081040', borderTopColor: '#080810' }} />
  );
}

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
