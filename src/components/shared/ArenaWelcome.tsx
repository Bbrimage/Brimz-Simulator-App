import React, { useState, useEffect } from 'react';
import './ArenaWelcome.css';

interface ArenaWelcomeProps {
  onEnter: () => void;
}

const STEPS = [
  {
    icon: '📡',
    num: '01',
    title: 'CONNECT YOUR BRACELET',
    body: 'Tap "TAP TO CONNECT" on the phone screen to simulate your wristband pairing. One tap and you\'re live.',
  },
  {
    icon: '🔥',
    num: '02',
    title: 'FEEL THE GAME',
    body: 'Every cheer, jump, and crowd surge registers on your band. Your energy score climbs in real time — every 30 seconds.',
  },
  {
    icon: '⚡',
    num: '03',
    title: 'HUNT THE CHALLENGES',
    body: 'Watch for live challenges dropping during the game. Hit them for massive XP multipliers. The louder your section, the bigger the bonus.',
  },
  {
    icon: '🏆',
    num: '04',
    title: 'EARN. CLIMB. WIN.',
    body: 'Points become tokens. Tokens unlock real rewards — food, merch, field access. Show up loud. Get rewarded.',
  },
];

// Glitch chars used during reveal
const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#_$%@&~ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function useGlitchReveal(text: string, trigger: boolean, delay = 0) {
  const [display, setDisplay] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    const totalFrames = text.length * 4; // frames per char * chars
    let timeout: ReturnType<typeof setTimeout>;

    timeout = setTimeout(() => {
      const interval = setInterval(() => {
        frame++;
        const revealed = Math.floor(frame / 4);
        const scrambled = text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < revealed) return char;
            if (i === revealed) return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join('');
        setDisplay(scrambled);
        if (frame >= totalFrames) {
          setDisplay(text);
          setDone(true);
          clearInterval(interval);
        }
      }, 35);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [trigger]);

  return { display, done };
}

export default function ArenaWelcome({ onEnter }: ArenaWelcomeProps) {
  const [started, setStarted] = useState(false);
  const [stepsVisible, setStepsVisible] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Start reveal sequence after mount
    const t1 = setTimeout(() => setStarted(true), 300);
    const t2 = setTimeout(() => setStepsVisible(true), 1800);
    const t3 = setTimeout(() => setBtnVisible(true), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const line1 = useGlitchReveal('WELCOME TO',           started, 0);
  const line2 = useGlitchReveal('THE ARENA.',           started, 200);
  const sub   = useGlitchReveal('YOU\'RE LIVE. STRAP IN.', started, 800);

  function handleEnter() {
    setExiting(true);
    setTimeout(onEnter, 600);
  }

  return (
    <div className={`aw-root${exiting ? ' aw-exit' : ''}`}>

      {/* Scanline overlay */}
      <div className="aw-scanlines" />

      {/* Ambient glow blobs */}
      <div className="aw-glow aw-glow-1" />
      <div className="aw-glow aw-glow-2" />

      {/* Corner brackets */}
      <div className="aw-corner aw-tl" />
      <div className="aw-corner aw-tr" />
      <div className="aw-corner aw-bl" />
      <div className="aw-corner aw-br" />

      {/* HUD top bar */}
      <div className="aw-hud-top">
        <span className="aw-hud-label">BRIMZ ARENA SYSTEM</span>
        <span className="aw-hud-status">
          <span className="aw-live-dot" />
          LIVE
        </span>
      </div>

      {/* Main content */}
      <div className="aw-content">

        {/* Headline */}
        <div className="aw-headline">
          <div className="aw-kicker">// FAN EXPERIENCE ACTIVATED</div>
          <h1 className="aw-h1">
            <span className="aw-h1-line1">{line1.display || '\u00A0'}</span>
            <br />
            <span className={`aw-h1-line2${line2.done ? ' aw-teal' : ''}`}>{line2.display || '\u00A0'}</span>
          </h1>
          <p className="aw-sub">{sub.display || '\u00A0'}</p>
        </div>

        {/* Steps */}
        <div className={`aw-steps${stepsVisible ? ' visible' : ''}`}>
          {STEPS.map((step, i) => (
            <div key={step.num} className="aw-step" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="aw-step-num">{step.num}</div>
              <div className="aw-step-body">
                <div className="aw-step-title">{step.title}</div>
                <div className="aw-step-text">{step.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Enter button */}
        <div className={`aw-btn-wrap${btnVisible ? ' visible' : ''}`}>
          <button className="aw-btn" onClick={handleEnter}>
            <span className="aw-btn-text">ENTER THE ARENA</span>
            <span className="aw-btn-arrow">→</span>
          </button>
          <p className="aw-btn-sub">This is a simulator — no real hardware required</p>
        </div>

      </div>

      {/* HUD bottom bar */}
      <div className="aw-hud-bottom">
        <span className="aw-hud-label">NFC · BLE · BIOMETRIC</span>
        <span className="aw-hud-label">ENERGY SCORING SYSTEM v2.0</span>
      </div>

    </div>
  );
}
