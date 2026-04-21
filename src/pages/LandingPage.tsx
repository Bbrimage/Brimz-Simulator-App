import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import BrimzNav from '../components/shared/BrimzNav';

export default function LandingPage() {
  const [whyVideoPlaying, setWhyVideoPlaying] = useState(false);
  const whyVideoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll('.lp-reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  function playWhyVideo() {
    if (whyVideoRef.current) {
      whyVideoRef.current.muted = false;
      whyVideoRef.current.play();
      setWhyVideoPlaying(true);
    }
  }

  const tickerItems = [
    { color: '#1CF4EA', text: '2.4M FANS ACTIVATED' },
    { color: '#FFB612', text: '340% ENGAGEMENT LIFT' },
    { color: '#1CF4EA', text: '48 VENUE PARTNERS' },
    { color: '#FFB612', text: '$12M REWARDS ISSUED' },
    { color: '#1CF4EA', text: 'NFL · NBA · NHL · MLS' },
    { color: '#FFB612', text: 'REAL HARDWARE. REAL SCORES.' },
    { color: '#1CF4EA', text: 'FREE FOR FANS' },
  ];

  return (
    <div className="lp">

      {/* NAV */}
      <BrimzNav showMarketingLinks />

      {/* HERO */}
      <section className="lp-hero">

        {/* Left: video + text overlay */}
        <div className="lp-hero-left">
          <video autoPlay muted loop playsInline>
            <source src="/videos/BRIMZ_video.mp4" type="video/mp4" />
          </video>
          <div className="lp-hero-overlay" />
          <div className="lp-hero-content">
            <div className="lp-hero-kicker">🏟 Fan Engagement Platform</div>
            <h1 className="lp-hero-h1">
              THE<br />CROWD<br />IS THE<br /><span className="teal">GAME.</span>
            </h1>
            <p className="lp-hero-sub">
              Brimz turns every fan in the seats into a living part of the game.
              Smart wristbands. Real-time energy scoring. Rewards that hit different.
            </p>
            <div className="lp-hero-btns">
              <a href="#demo" className="lp-btn-white">BOOK A DEMO</a>
              <Link to="/admin/login" className="lp-btn-signin">SIGN IN</Link>
            </div>
            <div className="lp-hero-free">FREE FOR FANS · DOWNLOAD THE APP · STRAP IN</div>
          </div>
        </div>

        {/* Right: teal panel + ConnectScreen phone */}
        <div className="lp-hero-right">
          <div className="lp-deco-1" />
          <div className="lp-deco-2" />

          {/* Column: phone + badges stacked */}
          <div className="lp-phone-col">

          {/* Entire phone is a Link to /simulator */}
          <Link to="/simulator" className="lp-phone-wrap">
            <div className="lp-phone-shell">

              {/* ambient glow */}
              <div className="lp-cs-glow" />

              {/* status bar */}
              <div className="lp-cs-bar">
                <span className="lp-cs-bar-time">9:41</span>
                <div className="lp-cs-sig">
                  <span style={{ height: '3px' }} />
                  <span style={{ height: '5px' }} />
                  <span style={{ height: '7px' }} />
                  <span style={{ height: '9px' }} />
                </div>
              </div>

              {/* logo + tagline */}
              <div className="lp-cs-header">
                <div className="lp-cs-logo-row">
                  <div className="lp-cs-logo-mark">
                    <img src="/images/brimz-logo-02-white.jpg" alt="Brimz" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <span className="lp-cs-logo-text">BRIMZ</span>
                </div>
                <span className="lp-cs-tagline">ARENA FAN EXPERIENCE</span>
              </div>

              {/* tap zone */}
              <div className="lp-cs-tapzone">
                <div className="lp-cs-rings">
                  <div className="lp-cs-ring" />
                  <div className="lp-cs-ring" />
                  <div className="lp-cs-ring" />
                  <div className="lp-cs-circle">
                    <img src="/images/brimz-logo-07-black.jpg" alt="Brimz" style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
                  </div>
                </div>
                <div className="lp-cs-status">
                  <div className="lp-cs-status-main">TAP TO SIMULATE<br />THE EXPERIENCE</div>
                  <div className="lp-cs-status-sub">Try the full fan experience<br />before game day</div>
                </div>
              </div>

              {/* button */}
              <div className="lp-cs-btn-wrap">
                <div className="lp-cs-btn">TAP TO SIMULATE</div>
              </div>

              {/* legal */}
              <div className="lp-cs-legal">
                <a href="/privacy.html" onClick={e => e.stopPropagation()}>Privacy Policy</a>
                <span className="lp-cs-legal-dot">·</span>
                <a href="/terms.html" onClick={e => e.stopPropagation()}>Terms of Service</a>
              </div>

            </div>
          </Link>

          {/* Download badges below phone */}
          <div className="lp-hero-download">
            <a href="#" style={{ display: 'block', lineHeight: 0 }}>
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                style={{ height: 44, width: 'auto', display: 'block' }}
              />
            </a>
            <a href="#" style={{ display: 'block', lineHeight: 0 }}>
              <img
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play"
                style={{ height: 64, width: 'auto', display: 'block', marginTop: -10, marginBottom: -10 }}
              />
            </a>
          </div>

          </div>{/* /lp-phone-col */}

        </div>

      </section>

      {/* TICKER */}
      <div className="lp-ticker" aria-hidden="true">
        <div className="lp-ticker-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="lp-ticker-item">
              <div className="lp-ticker-dot" style={{ background: item.color }} />
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="lp-stats">
        <div className="lp-stat lp-reveal"><div className="lp-stat-num">2.4M</div><div className="lp-stat-lbl">Fans Activated</div></div>
        <div className="lp-stat lp-reveal lp-reveal-d1"><div className="lp-stat-num">340%</div><div className="lp-stat-lbl">Engagement Lift</div></div>
        <div className="lp-stat lp-reveal lp-reveal-d2"><div className="lp-stat-num">48+</div><div className="lp-stat-lbl">Venue Partners</div></div>
        <div className="lp-stat lp-reveal lp-reveal-d3"><div className="lp-stat-num">$12M</div><div className="lp-stat-lbl">Rewards Issued</div></div>
      </div>

      {/* HOW IT WORKS */}
      <section className="lp-hiw" id="how-it-works">
        <div className="lp-hiw-head">
          <div>
            <div className="lp-tag lp-reveal">// HOW IT WORKS</div>
            <h2 className="lp-h2 lp-reveal">THREE STEPS.<br />INFINITE NOISE.</h2>
          </div>
          <div className="lp-hiw-right">
            <p className="lp-sub lp-reveal">From gate to final buzzer — Brimz keeps every fan in the game, not just watching it.</p>
          </div>
        </div>
        <div className="lp-steps lp-reveal">
          <div className="lp-step">
            <div className="lp-step-accent" />
            <div className="lp-step-num">01</div>
            <div className="lp-step-title">STRAP IN AT THE GATE</div>
            <div className="lp-step-body">Fans grab their Brimz wristband at the entry gate. One NFC tap to their phone and they're live — biometrics, motion, and crowd energy all syncing in real time.</div>
          </div>
          <div className="lp-step">
            <div className="lp-step-accent" />
            <div className="lp-step-num">02</div>
            <div className="lp-step-title">SCORE EVERY REACTION</div>
            <div className="lp-step-body">Jump, chant, cheer, react — it all counts. Every motion and crowd surge is scored live every 30 seconds. The louder the section, the bigger the multiplier.</div>
          </div>
          <div className="lp-step">
            <div className="lp-step-accent" />
            <div className="lp-step-num">03</div>
            <div className="lp-step-title">EARN REAL REWARDS</div>
            <div className="lp-step-body">Points become tokens. Tokens unlock real rewards — food, merch, field access, VIP experiences. Earned by showing up loud. Not random. Not gimmicky. Earned.</div>
          </div>
        </div>
      </section>

      {/* FAN EXPERIENCE */}
      <section className="lp-fanexp" id="fan-experience">
        <div className="lp-fanexp-head lp-reveal">
          <div className="lp-tag">// THE FAN EXPERIENCE</div>
          <h2 className="lp-h2">FEEL IT. <span>SCORE IT.</span> WIN IT.</h2>
          <p className="lp-sub">Three layers that make every game personal — and every fan feel like part of the show.</p>
        </div>
        <div className="lp-fanexp-grid">

          {/* Energy Score */}
          <div className="lp-fanexp-card lp-reveal">
            <div className="lp-fanexp-card-top" />
            <div className="lp-fanexp-icon">⚡</div>
            <div className="lp-fanexp-title">Live Energy Score</div>
            <div className="lp-fanexp-body">Your wristband tracks every reaction — motion, biometrics, and crowd energy stack into your personal score. Big plays and crowd surges trigger multipliers that explode your points in seconds.</div>
            <div className="lp-score-mini">
              <div className="lp-score-num">14,820</div>
              <div className="lp-score-lbl">YOUR ENERGY SCORE</div>
              <div className="lp-score-bars">
                {[
                  { name: 'TOUCHDOWN FRENZY', pts: '+420', w: '88%' },
                  { name: 'CHANT CHALLENGE 2X', pts: '+280', w: '62%' },
                  { name: 'CROWD SURGE BONUS', pts: '+680', w: '100%' },
                ].map(b => (
                  <div key={b.name} className="lp-score-bar-row">
                    <div className="lp-score-bar-top">
                      <span className="lp-score-bar-name">{b.name}</span>
                      <span className="lp-score-bar-pts">{b.pts}</span>
                    </div>
                    <div className="lp-score-bar-track">
                      <div className="lp-score-bar-fill" style={{ width: b.w }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="lp-fanexp-card lp-reveal lp-reveal-d1">
            <div className="lp-fanexp-card-top" />
            <div className="lp-fanexp-icon">🏆</div>
            <div className="lp-fanexp-title">Live Leaderboards</div>
            <div className="lp-fanexp-body">Compete against every fan in the building in real time. Global rankings, section battles, and season-long standings mean the competition never stops — even when the clock does.</div>
            <div className="lp-lb">
              <div className="lp-lb-head">
                <span className="lp-lb-head-lbl">TONIGHT'S TOP FANS</span>
                <span className="lp-lb-live">LIVE</span>
              </div>
              {[
                { rank: '1', name: '@ravens_super_fan', score: '24,810', grad: 'linear-gradient(135deg,#1CF4EA40,#FFB61240)' },
                { rank: '2', name: '@purple_and_black',  score: '21,440', grad: 'linear-gradient(135deg,#FFB61240,#ffffff10)' },
                { rank: '3', name: '@section_c_rowdy',   score: '19,220', grad: 'linear-gradient(135deg,#10B98130,#1CF4EA20)' },
                { rank: '4', name: '@loud_and_proud',    score: '17,080', grad: 'linear-gradient(135deg,#ffffff10,#1CF4EA15)' },
              ].map(r => (
                <div key={r.rank} className="lp-lb-row">
                  <span className="lp-lb-rank">{r.rank}</span>
                  <div className="lp-lb-av" style={{ background: r.grad }} />
                  <span className="lp-lb-name">{r.name}</span>
                  <span className="lp-lb-score">{r.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards */}
          <div className="lp-fanexp-card lp-reveal lp-reveal-d2">
            <div className="lp-fanexp-card-top" />
            <div className="lp-fanexp-icon">🎁</div>
            <div className="lp-fanexp-title">Rewards & Recognition</div>
            <div className="lp-fanexp-body">Points convert to tokens — tokens unlock real things. Concessions, merch drops, field access, and fan recognition that makes showing up loud actually worth it.</div>
            <div className="lp-reward-list">
              {[
                { emoji: '🍺', name: 'Free Concession Drink',   type: 'CONCESSIONS · 500 TOKENS',      cost: '500',  color: '#1CF4EA' },
                { emoji: '👕', name: 'Merch Discount — 25% Off', type: 'MERCHANDISE · 800 TOKENS',      cost: '800',  color: '#FFB612' },
                { emoji: '🏟', name: 'Field Access Pass',        type: 'VIP EXPERIENCE · 5,000 TOKENS', cost: '5K',   color: '#10B981' },
                { emoji: '⭐', name: 'Fan of the Game Badge',    type: 'RECOGNITION · TOP LEADERBOARD', cost: '#1',   color: '#FFB612' },
              ].map(r => (
                <div key={r.name} className="lp-reward-item">
                  <div className="lp-reward-emoji">{r.emoji}</div>
                  <div className="lp-reward-info">
                    <div className="lp-reward-name">{r.name}</div>
                    <div className="lp-reward-type">{r.type}</div>
                  </div>
                  <div className="lp-reward-cost" style={{ color: r.color }}>{r.cost}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* WHY BRIMZ */}
      <section className="lp-why" id="why-brimz">
        <div className="lp-why-grid">
          <div>
            <div className="lp-tag lp-reveal">// WHY BRIMZ</div>
            <h2 className="lp-h2 lp-reveal">BUILT<br />DIFFERENT.</h2>
            <div className="lp-why-items">
              {[
                { n: '01', title: 'Hardware + Software Stack',     body: 'NFC + BLE + biometric wristbands built from the ground up. Not a phone app bolt-on. A real physical-to-digital loop that no one else has.' },
                { n: '02', title: 'Venue-Controlled Everything',   body: 'Your colors. Your challenges. Your reward catalog. Brimz is the engine — your venue drives it. Fully white-labeled, fully yours.', d: 'lp-reveal-d1' },
                { n: '03', title: 'Data From Physical Interaction', body: 'Real-time fan heat maps, sponsor ROI, and engagement analytics — from actual movement, not clicks. Data your sponsors will pay for.', d: 'lp-reveal-d2' },
                { n: '04', title: 'Servant-Led, Transparent Team', body: "We build in public. Our partners know exactly what we're building and why. No black boxes, no surprises, no fine print.", d: 'lp-reveal-d3' },
              ].map(w => (
                <div key={w.n} className={`lp-why-item lp-reveal ${w.d || ''}`}>
                  <div className="lp-why-num">{w.n}</div>
                  <div>
                    <div className="lp-why-title">{w.title}</div>
                    <div className="lp-why-body">{w.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lp-why-video lp-reveal" onClick={playWhyVideo}>
            <video ref={whyVideoRef} muted loop>
              <source src="/videos/BRIMZ_video.mp4" type="video/mp4" />
            </video>
            {!whyVideoPlaying && (
              <div className="lp-why-video-overlay">
                <div className="lp-play-btn">▶</div>
                <div className="lp-play-lbl">WATCH THE BRIMZ EXPERIENCE</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAN CTA */}
      <section className="lp-fan-cta" id="fans">
        <div className="lp-reveal">
          <h2 className="lp-fan-cta-h2">FOR FANS.<br />IT'S FREE.</h2>
          <p className="lp-fan-cta-p">Download the app, tap your wristband at the gate, and play. No subscription. No fee. Just bring the noise.</p>
        </div>
        <div className="lp-fan-cta-right lp-reveal lp-reveal-d1">
          <div className="lp-free-badge">100% FREE FOR FANS</div>
          <div className="lp-store-btns">
            <a href="#" style={{ display: 'block', lineHeight: 0 }}>
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                style={{ height: 44, width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }}
              />
            </a>
            <a href="#" style={{ display: 'block', lineHeight: 0 }}>
              <img
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play"
                style={{ height: 64, width: 'auto', display: 'block', marginTop: -10, marginBottom: -10 }}
              />
            </a>
          </div>
          <div className="lp-store-note">AVAILABLE ON IOS AND ANDROID</div>
        </div>
      </section>

      {/* VENUE CTA */}
      <section className="lp-venue-cta" id="demo">
        <h2>GAME ON.<br /><span>LET'S GO.</span></h2>
        <p>Join the venues turning up the volume on fan experience. Book a demo and see Brimz live at your arena.</p>
        <a href="mailto:hello@brimz.tech" className="lp-venue-cta-btn">BOOK YOUR DEMO</a>
        <div className="lp-venue-cta-sub">NO COMMITMENT · WE'LL BRING THE WRISTBANDS</div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-logo">BRIMZ<span>.</span></div>
        <div className="lp-footer-links">
          <a href="/privacy.html">Privacy</a>
          <a href="/terms.html">Terms</a>
          <a href="/delete.html">Delete Data</a>
          <a href="mailto:hello@brimz.tech">Contact</a>
          <Link to="/simulator">Simulator</Link>
        </div>
        <div className="lp-footer-copy">© 2025 BRIMZ</div>
      </footer>

    </div>
  );
}
