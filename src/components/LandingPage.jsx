import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  // Detect if running as installed PWA
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  // Capture the install prompt
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Detect iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // Handle download button click
  const handleDownloadClick = async () => {
    if (isStandalone) {
      // Already installed, just go to fan view
      onNavigate('fan');
      return;
    }

    if (deferredPrompt) {
      // Android/Chrome - trigger install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      // iOS - show manual instructions
      setShowIOSPrompt(true);
    } else {
      // Fallback - browser doesn't support install or already installed
      onNavigate('fan');
    }
  };

  const handleAdminClick = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = () => {
    if (password === 'admin2024') {
      setShowPasswordModal(false);
      setPassword('');
      onNavigate('admin');
    } else {
      alert('Incorrect password');
      setPassword('');
    }
  };

  const handleFanClick = () => {
    onNavigate('fan');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  return (
    <div className="relative overflow-hidden flex flex-col h-[100dvh]">
      {/* VIDEO BACKGROUND */}
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-100">
        <source src="/videos/BRIMZ_video.mp4" type="video/mp4" />
      </video>

      {/* Content Container - flex-1 to fill available space, justify-between to spread content */}
      <div
        className="relative z-10 w-full px-4 py-4 flex flex-col flex-1 min-h-0"
        style={{
          paddingTop: isStandalone ? 'calc(env(safe-area-inset-top) + 16px)' : '16px',
          justifyContent: isStandalone ? 'center' : 'space-between',
          gap: isStandalone ? '2rem' : '0'
        }}
      >

        {/* Logo Section */}
        <div className="flex items-center gap-2 shrink-0">
          <img
            src="/images/Full_Brimz_Logo.png"
            alt="Brimz Logo"
            className={isStandalone ? "h-12 object-contain" : "h-8 object-contain"}
          />
        </div>

        {/* Headline - shrinks if needed */}
        <div className="shrink min-h-0 py-2">
          <h1
            className="font-bold text-white leading-tight mb-2"
            style={{ fontSize: isStandalone ? 'clamp(2.5rem, 10vw, 4rem)' : 'clamp(1.75rem, 8vw, 3rem)' }}
          >
            FAN ENERGY
          </h1>
          <p
            className="text-slate-300 leading-snug"
            style={{ fontSize: isStandalone ? 'clamp(1rem, 4.5vw, 1.5rem)' : 'clamp(0.75rem, 3.5vw, 1.125rem)' }}
          >
            <span className="font-semibold text-white">Energy → Rewards → Upsell → ROI</span>
            <br />Get a <span className="font-semibold text-white">clear vision</span> of fan engagement.
            <br />Supercharge <span className="font-semibold text-white">fan excitement</span> and <span className="font-semibold text-white">energy.</span>
            <br />Turn energy into <span className="font-semibold text-white">rewards</span> and <span className="font-semibold text-white">revenue.</span>
          </p>
        </div>

        {/* Two Rectangle Boxes Side by Side */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          {/* Fan View Box */}
          <button
            onClick={handleFanClick}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 hover:bg-white transition-all duration-300 hover:scale-105 group flex flex-col items-center justify-center"
            style={{ aspectRatio: '1 / 1', maxHeight: isStandalone ? '45vw' : '35vw' }}
          >
            <div className="mb-1">
              <div
                className="relative"
                style={{ width: 'clamp(2.5rem, 10vw, 4rem)', height: 'clamp(2.5rem, 10vw, 4rem)' }}
              >
                <div className="absolute inset-0 rounded-full border-4 border-orange-400 opacity-30"></div>
                <div className="absolute inset-1 rounded-full border-4 border-orange-500 opacity-50"></div>
                <div className="absolute inset-2 rounded-full bg-slate-900 flex items-center justify-center">
                  <img
                    src="/images/Icon_Brimz_Logo.png"
                    alt="Brimz Icon"
                    className="w-1/2 h-1/2 object-contain"
                  />
                </div>
              </div>
            </div>
            <div
              className="text-slate-900 font-bold"
              style={{ fontSize: 'clamp(1.25rem, 5vw, 1.875rem)' }}
            >
              Fan
            </div>
            <div
              className="text-slate-900 font-bold"
              style={{ fontSize: 'clamp(0.625rem, 2.5vw, 0.875rem)' }}
            >
              Energy Portal
            </div>
          </button>

          {/* Admin View Box */}
          <button
            onClick={handleAdminClick}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 hover:bg-white transition-all duration-300 hover:scale-105 group flex flex-col items-center justify-center"
            style={{ aspectRatio: '1 / 1', maxHeight: isStandalone ? '45vw' : '35vw' }}
          >
            <div
              className="text-slate-900 font-bold"
              style={{ fontSize: 'clamp(1.25rem, 5vw, 1.875rem)' }}
            >
              Admin
            </div>
            <div
              className="text-slate-900 font-bold"
              style={{ fontSize: 'clamp(0.625rem, 2.5vw, 0.875rem)' }}
            >
              Controls Portal
            </div>
            <div className="flex -space-x-1 mt-2">
              <div
                className="rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white"
                style={{ width: 'clamp(1.25rem, 5vw, 1.75rem)', height: 'clamp(1.25rem, 5vw, 1.75rem)' }}
              ></div>
              <div
                className="rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-white"
                style={{ width: 'clamp(1.25rem, 5vw, 1.75rem)', height: 'clamp(1.25rem, 5vw, 1.75rem)' }}
              ></div>
              <div
                className="rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"
                style={{ width: 'clamp(1.25rem, 5vw, 1.75rem)', height: 'clamp(1.25rem, 5vw, 1.75rem)' }}
              ></div>
            </div>
          </button>
        </div>

        {/* Get Started Button - always visible at bottom */}
        {!isStandalone && (
          <button
            onClick={handleDownloadClick}
            className="relative bg-slate-900 text-white rounded-full py-3 px-6 font-bold hover:bg-slate-800 transition-all duration-300 shadow-2xl overflow-hidden group shrink-0 mt-3"
            style={{ fontSize: 'clamp(0.875rem, 4vw, 1.125rem)' }}
          >
            <span className="relative flex items-center justify-center gap-2">
              📲 Install App
            </span>
          </button>
        )}
      </div>

      {/* iOS Install Instructions Modal */}
      {showIOSPrompt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full mb-4">
            <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">Install Brimz App</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-lg">1</div>
                <p className="text-sm text-slate-700">Tap the <span className="font-bold">Share</span> button <span className="text-lg">⬆️</span> at the bottom of your screen</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-lg">2</div>
                <p className="text-sm text-slate-700">Scroll down and tap <span className="font-bold">"Add to Home Screen"</span></p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-lg">3</div>
                <p className="text-sm text-slate-700">Tap <span className="font-bold">"Add"</span> in the top right corner</p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSPrompt(false)}
              className="w-full bg-slate-900 text-white rounded-xl py-3 font-semibold hover:bg-slate-800 transition"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-bold text-white">Admin Access</h3>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter password"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                }}
                className="flex-1 bg-slate-700 text-white rounded-xl py-3 font-semibold hover:bg-slate-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl py-3 font-semibold hover:from-orange-600 hover:to-orange-700 transition"
              >
                Enter
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">
              Demo password: admin2024
            </p>
          </div>
        </div>
      )}
    </div>
  );
}