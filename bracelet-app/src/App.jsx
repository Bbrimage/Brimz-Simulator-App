import React, { useState } from 'react';
import { Menu as MenuIcon, PlayCircle, StopCircle, History, X } from 'lucide-react';
import { AppProvider, useAppContext } from './context/AppContext';
import FanView from './components/FanView';
import AdminView from './components/AdminView';
import LandingPage from './components/LandingPage';
import HowItWorks from './components/HowItWorks';

function AppContent() {
  const { 
    themeData, 
    isConnected, 
    currentMainView, 
    setCurrentMainView,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    isSimulating,
    simulationProgress,
    simulationHistory,
    startSimulation,
    stopSimulation
  } = useAppContext();

  const [showMenu, setShowMenu] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedFanType, setSelectedFanType] = useState('engaged');
  const [selectedCrowdLevel, setSelectedCrowdLevel] = useState('energized');
  const [selectedDuration, setSelectedDuration] = useState('2min');
  const [showLanding, setShowLanding] = useState(true);
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const bgColor = isConnected ? themeData.primaryColor : '#0f172a';

  const handleNavigate = (view) => {
    setShowLanding(false);
    setCurrentMainView(view);
  };

  // Fan Type Options
  const fanTypes = [
    { id: 'super', emoji: '🔥', label: 'Super Fan', desc: 'Always engaged, high energy' },
    { id: 'engaged', emoji: '⚡', label: 'Engaged Fan', desc: 'Participates regularly' },
    { id: 'casual', emoji: '😐', label: 'Casual Fan', desc: 'Moderate participation' },
    { id: 'distracted', emoji: '😴', label: 'Distracted Fan', desc: 'Low engagement' }
  ];

  // Crowd Level Options
  const crowdLevels = [
    { id: 'electric', emoji: '🔥', label: 'Electric Crowd', desc: '90%+ attendance, loud' },
    { id: 'energized', emoji: '⚡', label: 'Energized Crowd', desc: '75-85% turnout, active' },
    { id: 'average', emoji: '😐', label: 'Average Crowd', desc: '60-70% moderate energy' },
    { id: 'quiet', emoji: '😴', label: 'Quiet Crowd', desc: '40-55% low energy' }
  ];

  // Duration Options
  const durations = [
    { id: 'instant', emoji: '⚡', label: 'Instant', desc: 'See results immediately' },
    { id: '2min', emoji: '🏃', label: '2 Minutes', desc: 'Fast playback' },
    { id: '5min', emoji: '🎯', label: '5 Minutes', desc: 'Realistic speed' }
  ];

  const handleStartSimulation = () => {
    startSimulation({
      fanType: selectedFanType,
      crowdLevel: selectedCrowdLevel,
      duration: selectedDuration
    });
    setShowSimulator(false);
  };

  return (
    <div className="h-screen flex items-center justify-center p-0 md:py-6 md:px-4 overflow-hidden" style={{ background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)` }}>
      {/* Phone Frame */}
      <div className="relative w-full h-full md:w-[390px] md:h-[calc(100vh-3rem)] md:max-h-[844px]">
        {/* Phone Mockup Container */}
        <div className="bg-white rounded-none md:rounded-[3rem] shadow-none md:shadow-2xl overflow-hidden h-full">
          {/* App Content */}
          <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden rounded-none md:rounded-[3rem] h-full">
            
            {/* Show Landing Page or App Content */}
            {showLanding ? (
              <LandingPage onNavigate={handleNavigate} />
            ) : (
              <>
            {/* Header Bar */}
            <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-4 bg-white/90 backdrop-blur-sm md:relative md:rounded-t-[3rem]" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
              <div className="flex items-center gap-2">
                <img 
                  src="/images/Icon_Brimz_Logo.png" 
                  alt="Brimz Logo" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              
              {isConnected && (
                <div className="flex gap-2">
                  {isSimulating ? (
                    <button 
                      onClick={stopSimulation}
                      className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition shadow-md flex items-center gap-1"
                    >
                      <StopCircle className="w-3 h-3" />
                      STOP
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowSimulator(true)}
                      className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition shadow-md flex items-center gap-1"
                    >
                      <PlayCircle className="w-3 h-3" />
                      SIMULATOR
                    </button>
                  )}
                  <button 
                    onClick={() => setShowHistory(true)}
                    className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition shadow-md"
                  >
                    <History className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <MenuIcon className="w-6 h-6 text-slate-900" strokeWidth={2} />
              </button>
            </div>

            {/* Simulation Progress Bar */}
            {isSimulating && simulationProgress > 0 && (
              <div className="absolute top-[72px] left-0 right-0 z-40 px-5">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">Simulation Running...</span>
                    <span className="text-xs font-bold text-cyan-600">{Math.round(simulationProgress)}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full transition-all duration-300"
                      style={{ width: `${simulationProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Menu Dropdown */}
            {showMenu && (
              <div className="absolute top-20 right-5 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                <button 
                  onClick={() => {
                    setShowLanding(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-6 py-3 text-left text-sm font-semibold hover:bg-slate-50 transition border-b border-slate-100"
                >
                  ← Back to Home
                </button>
                <button 
                  onClick={() => {
                    setCurrentMainView('fan');
                    setShowMenu(false);
                  }}
                  className={`w-full px-6 py-3 text-left text-sm font-semibold hover:bg-slate-50 transition border-b border-slate-100 ${
                    currentMainView === 'fan' ? 'bg-slate-50' : ''
                  }`}
                >
                  Fan View
                </button>
                <button 
                  onClick={() => {
                    if (isAdminAuthenticated) {
                      setCurrentMainView('admin');
                      setShowMenu(false);
                    } else {
                      setShowAdminPasswordModal(true);
                      setShowMenu(false);
                    }
                  }}
                  className={`w-full px-6 py-3 text-left text-sm font-semibold hover:bg-slate-50 transition border-b border-slate-100 ${
                    currentMainView === 'admin' ? 'bg-slate-50' : ''
                  }`}
                >
                  Admin View
                </button>
                <button 
                  onClick={() => {
                    setCurrentMainView('howItWorks');
                    setShowMenu(false);
                  }}
                  className={`w-full px-6 py-3 text-left text-sm font-semibold hover:bg-slate-50 transition ${
                    currentMainView === 'howItWorks' ? 'bg-slate-50' : ''
                  }`}
                >
                  How It Works
                </button>
              </div>
            )}

            {/* SIMULATOR SETUP MODAL */}
            {showSimulator && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 md:rounded-[3rem]">
                <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black text-slate-900">🎮 GAME SIMULATOR</h3>
                    <button onClick={() => setShowSimulator(false)} className="p-1 hover:bg-slate-100 rounded-lg transition">
                      <X className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>

                  {/* Fan Type Selection */}
                  <div className="mb-5">
                    <h4 className="text-sm font-black text-slate-900 mb-3">YOUR FAN TYPE:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {fanTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedFanType(type.id)}
                          className={`p-3 rounded-xl border-2 transition text-left ${
                            selectedFanType === type.id
                              ? 'border-cyan-500 bg-cyan-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{type.emoji}</div>
                          <p className="text-xs font-bold text-slate-900">{type.label}</p>
                          <p className="text-[10px] text-slate-600 mt-0.5">{type.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Crowd Level Selection */}
                  <div className="mb-5">
                    <h4 className="text-sm font-black text-slate-900 mb-3">CROWD ENERGY LEVEL:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {crowdLevels.map((level) => (
                        <button
                          key={level.id}
                          onClick={() => setSelectedCrowdLevel(level.id)}
                          className={`p-3 rounded-xl border-2 transition text-left ${
                            selectedCrowdLevel === level.id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{level.emoji}</div>
                          <p className="text-xs font-bold text-slate-900">{level.label}</p>
                          <p className="text-[10px] text-slate-600 mt-0.5">{level.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration Selection */}
                  <div className="mb-5">
                    <h4 className="text-sm font-black text-slate-900 mb-3">SIMULATION DURATION:</h4>
                    <div className="space-y-2">
                      {durations.map((dur) => (
                        <button
                          key={dur.id}
                          onClick={() => setSelectedDuration(dur.id)}
                          className={`w-full p-3 rounded-xl border-2 transition text-left flex items-center gap-3 ${
                            selectedDuration === dur.id
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-2xl">{dur.emoji}</div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-slate-900">{dur.label}</p>
                            <p className="text-[10px] text-slate-600">{dur.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 mb-5 border border-slate-200">
                    <p className="text-xs font-bold text-slate-700 mb-2">SIMULATION PREVIEW:</p>
                    <div className="space-y-1 text-[11px] text-slate-600">
                      <p>• Fan: <span className="font-bold text-slate-900">{fanTypes.find(t => t.id === selectedFanType)?.label}</span></p>
                      <p>• Crowd: <span className="font-bold text-slate-900">{crowdLevels.find(l => l.id === selectedCrowdLevel)?.label}</span></p>
                      <p>• Duration: <span className="font-bold text-slate-900">{durations.find(d => d.id === selectedDuration)?.label}</span></p>
                    </div>
                  </div>

                  {/* Start Button */}
                  <button 
                    onClick={handleStartSimulation}
                    className="w-full py-4 rounded-xl font-black text-white transition shadow-lg hover:scale-[1.02] bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-5 h-5" />
                    START SIMULATION
                  </button>
                </div>
              </div>
            )}

            {/* SIMULATION HISTORY MODAL */}
            {showHistory && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 md:rounded-[3rem]">
                <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black text-slate-900">📊 SIMULATION HISTORY</h3>
                    <button onClick={() => setShowHistory(false)} className="p-1 hover:bg-slate-100 rounded-lg transition">
                      <X className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>

                  {simulationHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <History className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-600">No simulations run yet</p>
                      <p className="text-xs text-slate-500 mt-1">Start a simulation to see results here</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {simulationHistory.map((event) => (
                        <div key={event.id} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-xs font-black text-slate-900">
                                {fanTypes.find(t => t.id === event.fanType)?.emoji} {fanTypes.find(t => t.id === event.fanType)?.label}
                              </p>
                              <p className="text-[10px] text-slate-600 mt-0.5">
                                {crowdLevels.find(l => l.id === event.crowdLevel)?.label}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-cyan-600">{event.duration}</p>
                              <p className="text-[9px] text-slate-500">{event.timestamp}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white rounded-lg p-2">
                              <p className="text-[9px] text-slate-500 mb-0.5">Fan Energy</p>
                              <p className="text-sm font-black text-slate-900">{event.finalStats.fanEnergy.toLocaleString()}</p>
                            </div>
                            <div className="bg-white rounded-lg p-2">
                              <p className="text-[9px] text-slate-500 mb-0.5">Tokens</p>
                              <p className="text-sm font-black text-slate-900">{event.finalStats.fanTokens}</p>
                            </div>
                            <div className="bg-white rounded-lg p-2">
                              <p className="text-[9px] text-slate-500 mb-0.5">Total Fans</p>
                              <p className="text-sm font-black text-slate-900">{event.finalStats.crowdFans.toLocaleString()}</p>
                            </div>
                            <div className="bg-white rounded-lg p-2">
                              <p className="text-[9px] text-slate-500 mb-0.5">Avg Energy</p>
                              <p className="text-sm font-black text-slate-900">{event.finalStats.avgEnergy.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {simulationHistory.length > 0 && (
                    <button 
                      onClick={() => setShowHistory(false)}
                      className="w-full py-3 mt-4 bg-slate-100 rounded-xl font-bold text-slate-700 hover:bg-slate-200 transition text-sm"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ADMIN PASSWORD MODAL */}
            {showAdminPasswordModal && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50 md:rounded-[3rem]">
                <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-sm w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Admin Access</h3>
                  </div>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        if (adminPassword === 'admin2024') {
                          setIsAdminAuthenticated(true);
                          setShowAdminPasswordModal(false);
                          setAdminPassword('');
                          setCurrentMainView('admin');
                        } else {
                          alert('Incorrect password');
                          setAdminPassword('');
                        }
                      }
                    }}
                    placeholder="Enter password"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowAdminPasswordModal(false);
                        setAdminPassword('');
                      }}
                      className="flex-1 bg-slate-700 text-white rounded-xl py-3 font-semibold hover:bg-slate-600 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (adminPassword === 'admin2024') {
                          setIsAdminAuthenticated(true);
                          setShowAdminPasswordModal(false);
                          setAdminPassword('');
                          setCurrentMainView('admin');
                        } else {
                          alert('Incorrect password');
                          setAdminPassword('');
                        }
                      }}
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

            {/* Render Current View */}
            <div className={currentMainView === 'fan' ? 'block h-full' : 'hidden'}>
              <FanView />
            </div>
            <div className={currentMainView === 'admin' ? 'block h-full' : 'hidden'}>
              <AdminView />
            </div>
            {currentMainView === 'howItWorks' && <HowItWorks />}
            </>
            )}

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideFromBehind {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideFromBehind {
          animation: slideFromBehind 0.6s ease-out forwards;
        }

        /* Hide scrollbar for simulator modals */
        .overflow-y-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-y-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}