import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BrimzNav.css';

interface BrimzNavProps {
  /** Show the full marketing links (Platform, For Venues, For Fans) — landing page only */
  showMarketingLinks?: boolean;
}

export default function BrimzNav({ showMarketingLinks = false }: BrimzNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="bz-nav">
        <Link to="/" className="bz-nav-logo">BRIMZ<span>.</span></Link>

        <div className="bz-nav-links">
          {showMarketingLinks && (
            <>
              <a href="#how-it-works">Platform</a>
              <a href="#why-brimz">For Venues</a>
              <a href="#fans">For Fans</a>
            </>
          )}
          {!showMarketingLinks && (
            <Link to="/simulator" className="bz-nav-sim">SIMULATOR</Link>
          )}
          <a href="#demo" className="bz-nav-cta">BOOK A DEMO</a>
          <Link to="/admin/login" className="bz-nav-login">LOGIN</Link>
        </div>

        <button className="bz-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      <div className={`bz-mobile-menu${menuOpen ? ' open' : ''}`}>
        {showMarketingLinks && (
          <>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>Platform</a>
            <a href="#why-brimz"    onClick={() => setMenuOpen(false)}>For Venues</a>
            <a href="#fans"         onClick={() => setMenuOpen(false)}>For Fans</a>
          </>
        )}
        {!showMarketingLinks && (
          <Link to="/simulator" onClick={() => setMenuOpen(false)}>Simulator</Link>
        )}
        <a href="#demo" onClick={() => setMenuOpen(false)}>Book a Demo</a>
        <Link to="/admin/login" className="bz-mobile-login" onClick={() => setMenuOpen(false)}>LOGIN</Link>
      </div>
    </>
  );
}
