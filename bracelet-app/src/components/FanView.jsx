import React, { useState, useEffect } from 'react';
import { Home, BarChart3, Gift, Settings, Zap, Users, MessageSquare, TrendingUp, X, MoreVertical } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function FanView() {
  const { 
    themeData, 
    isConnected, 
    setIsConnected,
    fanData,
    setFanData,
    fanSettings,
    toggleFanSetting,
    rewardsCatalog,
    notifications,
    activeChallenges
  } = useAppContext();

    // Detect if running as installed PWA
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  
  const [connectionStep, setConnectionStep] = useState('initial');
  const [showExplainer, setShowExplainer] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentView, setCurrentView] = useState('home');
  const [showSettingWarning, setShowSettingWarning] = useState(null);
  // eslint-disable-next-line no-unused-vars
const [showBadgeInfo, setShowBadgeInfo] = useState(null);
  
  // NEW: Challenge hover state and completion counters
  const [hoveredChallengeIndex, setHoveredChallengeIndex] = useState(null);
  const [challengeCompletions, setChallengeCompletions] = useState({});

  // Auto-swipe carousel
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % themeData.slides.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isConnected, themeData.slides.length]);

  // Don't reset connection when component mounts
  useEffect(() => {
    if (isConnected && connectionStep === 'initial') {
      setConnectionStep('complete');
    }
  }, [isConnected, connectionStep]);

  // Track challenge completions
  useEffect(() => {
    activeChallenges.forEach((challenge) => {
      if (challenge.status === 'ended' && !challengeCompletions[challenge.id]) {
        setChallengeCompletions(prev => ({
          ...prev,
          [challenge.id]: (prev[challenge.id] || 0) + 1
        }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChallenges]);

  const handleConnect = () => {
    setConnectionStep('connecting');
    setTimeout(() => {
      setConnectionStep('congrats');
      setTimeout(() => {
        setConnectionStep('graphic');
        setTimeout(() => {
          setConnectionStep('complete');
          setIsConnected(true);
        }, 1000);
      }, 1500);
    }, 1500);
  };

  // Get challenge status/icon for the 4 buttons
  const getChallengeIcon = (index) => {
    const icons = [
      { Icon: Zap, color: 'orange' },
      { Icon: Users, color: 'purple' },
      { Icon: MessageSquare, color: 'blue' },
      { Icon: TrendingUp, color: 'green' }
    ];
    
    const challenge = activeChallenges[index];
    const iconData = icons[index] || icons[0];
    const isActive = challenge && challenge.status === 'active';
    const isCompleted = challenge && challenge.status === 'ended';
    const completionCount = challenge ? (challengeCompletions[challenge.id] || 0) : 0;
    
    return {
      ...iconData,
      isActive,
      isCompleted,
      challenge,
      completionCount
    };
  };

  // Get time remaining for a challenge
  const getTimeRemaining = (challenge) => {
    if (!challenge) return null;
    const elapsed = Date.now() - challenge.startTime;
    const remaining = Math.max(0, challenge.duration - elapsed);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get the challenge to display in the header
  const getDisplayChallenge = () => {
    // If hovering, show that challenge
    if (hoveredChallengeIndex !== null) {
      const hoveredChallenge = activeChallenges[hoveredChallengeIndex];
      if (hoveredChallenge && hoveredChallenge.status === 'active') {
        return hoveredChallenge;
      }
    }
    
    // Otherwise show first active challenge
    return activeChallenges.find(c => c.status === 'active');
  };

  // Badge display helper
  const getBadgeDisplay = (badgeKey) => {
    const tier = fanData.badges[badgeKey];
    const configs = {
      streakMaster: {
        Icon: Zap,
        label: 'STREAK',
        sublabel: 'MASTER'
      },
      mvpSection: {
        Icon: () => (
          <svg className="w-7 h-7 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ),
        label: 'MVP',
        sublabel: 'SECTION'
      },
      topFan: {
        Icon: Users,
        label: 'TOP',
        sublabel: 'FAN'
      },
      cheerMaster: {
        Icon: MessageSquare,
        label: 'CHEER',
        sublabel: 'MASTER'
      }
    };

    const config = configs[badgeKey];
    
    const gradients = {
      gold: 'from-yellow-400 via-amber-500 to-yellow-600',
      silver: 'from-slate-300 via-slate-400 to-slate-500',
      bronze: 'from-orange-500 via-amber-600 to-orange-700',
      locked: 'from-slate-200 to-slate-300'
    };

    const borderColors = {
      gold: 'border-yellow-300/30',
      silver: 'border-slate-200/30',
      bronze: 'border-orange-400/30',
      locked: 'border-slate-200/40'
    };

    const starColors = {
      gold: 'text-yellow-200',
      silver: 'text-slate-100',
      bronze: 'text-amber-200',
      locked: 'text-slate-300/60'
    };

    const labelColors = {
      gold: 'text-white/90',
      silver: 'text-white/90',
      bronze: 'text-white/90',
      locked: 'text-slate-500/60'
    };

    const tierLabels = {
      gold: 'GOLD',
      silver: 'SILVER',
      bronze: 'BRONZE',
      locked: 'LOCKED'
    };

    const tierLabelBg = {
      gold: 'bg-yellow-300/30 border-yellow-200/50',
      silver: 'bg-slate-200/30 border-slate-100/50',
      bronze: 'bg-orange-300/30 border-orange-200/50',
      locked: 'bg-slate-200/40 border-slate-300/40'
    };

    const stars = tier === 'gold' ? 3 : tier === 'silver' ? 2 : tier === 'bronze' ? 1 : 0;

    return {
      ...config,
      tier,
      gradient: gradients[tier] || gradients.locked,
      borderColor: borderColors[tier] || borderColors.locked,
      starColor: starColors[tier] || starColors.locked,
      labelColor: labelColors[tier] || labelColors.locked,
      tierLabel: tierLabels[tier] || tierLabels.locked,
      tierLabelBg: tierLabelBg[tier] || tierLabelBg.locked,
      stars,
      isLocked: tier === 'locked'
    };
  };

  const displayChallenge = getDisplayChallenge();

  return (
    <>
      {/* Main Content Area */}
      <div 
          className="relative z-10 px-5 h-full flex flex-col"
          style={{ 
            paddingTop: isStandalone ? 'calc(env(safe-area-inset-top) + 80px)' : '',
            paddingBottom: isConnected ? '80px' : '20px'
          }}
        >
        
        {/* HOME VIEW */}
        {currentView === 'home' && (
          <div>
            {/* Background Logo */}
            {!isConnected && (
              <div className="absolute left-1/2 -translate-x-1/2 z-0 opacity-20" style={{ top: '280px' }}>
                <Zap className="w-32 h-32 text-white" strokeWidth={1.5} />
              </div>
            )}

            {isConnected && (
              <div className="absolute left-1/2 -translate-x-1/2 z-0 opacity-15" style={{ top: '280px', color: themeData.secondaryColor }}>
                <svg className="w-32 h-32" viewBox="0 0 100 100" fill="currentColor">
                  <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" />
                </svg>
              </div>
            )}
            
            {/* Connection/Game Card */}
            <div className={`relative z-20 bg-gradient-to-br shadow-2xl overflow-hidden transition-all duration-700 flex-shrink-0 ${
              connectionStep === 'complete' ? 'h-44' : 'h-56'
            }`} style={{ 
              background: isConnected 
                ? `linear-gradient(135deg, ${themeData.primaryColor} 0%, ${themeData.primaryColor}dd 100%)`
                : 'linear-gradient(135deg, #334155 0%, #475569 100%)',
              borderRadius: '2rem'
            }}>
              
              {/* Initial State */}
              {connectionStep === 'initial' && (
                <div className="h-full flex flex-col items-center justify-center p-6">
                  <button
                    onClick={handleConnect}
                    className="relative w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600 shadow-2xl hover:scale-105 transition-all duration-300 group"
                    style={{ boxShadow: '0 0 40px rgba(6, 182, 212, 0.4), inset 0 0 20px rgba(255,255,255,0.2)' }}
                  >
                    <div className="absolute inset-0 rounded-full border-4 border-white/30 border-dashed animate-spin" style={{ animationDuration: '8s' }}></div>
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex flex-col items-center justify-center">
                      <Zap className="w-12 h-12 text-white mb-2 group-hover:animate-pulse" strokeWidth={2.5} />
                      <span className="text-white font-black text-sm tracking-wider">CONNECT</span>
                      <span className="text-cyan-200 font-bold text-xs">DEVICE</span>
                    </div>
                  </button>
                </div>
              )}

              {/* Connecting State */}
              {connectionStep === 'connecting' && (
                <div className="h-full flex flex-col items-center justify-center p-6">
                  <div className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-white font-bold text-lg">Connecting...</p>
                </div>
              )}

              {/* Congratulations State */}
              {connectionStep === 'congrats' && (
                <div className="h-full flex flex-col items-center justify-center p-6">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white font-black text-2xl">Congratulations!</p>
                  <p className="text-white/80 text-sm mt-1">You're Connected</p>
                </div>
              )}

              {/* Game Graphic State */}
              {(connectionStep === 'graphic' || connectionStep === 'complete') && (
                <div className="h-full flex flex-col justify-between p-5 relative overflow-hidden">
                  {/* Background Images */}
                  {themeData.slides.map((slide, idx) => (
                    <div
                      key={idx}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        currentSlide === idx ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <img 
                        src={slide.image} 
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    </div>
                  ))}
                  
                  <div className="inline-block relative z-10">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold border border-white/30">
                      LIVE GAME
                    </span>
                  </div>
                  
                  <div className="relative z-10">
                    {themeData.slides.map((slide, idx) => (
                      <div
                        key={idx}
                        className={`transition-opacity duration-500 ${
                          currentSlide === idx ? 'opacity-100' : 'opacity-0 absolute inset-0'
                        }`}
                      >
                        <h2 className="text-4xl font-black text-white leading-tight mb-1" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                          {slide.title}
                        </h2>
                        <h3 className="text-3xl font-black leading-tight mb-2" style={{ color: themeData.secondaryColor, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                          {slide.subtitle}
                        </h3>
                      </div>
                    ))}
                    <p className="text-white/90 text-sm font-semibold">{themeData.teamName} vs {themeData.opponent}</p>
                    <p className="text-white/70 text-xs">{themeData.gameDate} • {themeData.gameTime}</p>
                  </div>

                  <div className="flex gap-1.5 absolute bottom-5 right-5 z-10">
                    {themeData.slides.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all ${
                          currentSlide === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* HOW IT WORKS - Only show before connection */}
            {connectionStep === 'initial' && (
              <div className="mt-4 bg-white rounded-2xl shadow-lg p-4">
                <h3 className="text-slate-900 font-black text-sm mb-3 text-center">HOW IT WORKS</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">📱</span>
                    <div className="flex-1">
                      <p className="text-slate-900 font-bold text-xs mb-0.5">CONNECT YOUR BRACELET</p>
                      <p className="text-slate-600 text-[10px] mb-1">Tap the button to sync with your device</p>
                      <p className="text-cyan-600 text-[9px] italic">(Click the CONNECT button to get started)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">⚡</span>
                    <div className="flex-1">
                      <p className="text-slate-900 font-bold text-xs mb-0.5">BRING THE ENERGY</p>
                      <p className="text-slate-600 text-[10px] mb-1">Cheer, clap, and complete challenges</p>
                      <p className="text-cyan-600 text-[9px] italic">(Click SIMULATOR MODE to simulate a live game)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">🎁</span>
                    <div className="flex-1">
                      <p className="text-slate-900 font-bold text-xs mb-0.5">EARN REWARDS</p>
                      <p className="text-slate-600 text-[10px] mb-1">Convert energy into tokens for prizes</p>
                      <p className="text-cyan-600 text-[9px] italic">(Toggle between Fan & Admin views to see both sides)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content after connection */}
            {connectionStep === 'complete' && (
              <div className="relative z-10 flex-1 flex flex-col mt-3">
                <div className="bg-white rounded-3xl shadow-xl py-6 px-4 flex-shrink-0 relative">
                  
                  {/* DYNAMIC CHALLENGE HEADER */}
                  <div className="mb-6">
                    {displayChallenge ? (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <h3 className="text-base font-black text-slate-900 tracking-tight uppercase">
                            {displayChallenge.name}
                          </h3>
                          {displayChallenge.emoji && (
                            <span className="text-xl animate-bounce">{displayChallenge.emoji}</span>
                          )}
                        </div>
                        <div className="inline-block px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse">
                          <p className="text-white font-black text-xs">
                            Time Remaining: {getTimeRemaining(displayChallenge)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <h3 className="text-base font-black text-slate-900 tracking-tight">BRING THE ENERGY</h3>
                      </div>
                    )}
                    
                    <button 
                      className="absolute top-3 right-3 p-1 hover:bg-slate-100 rounded-lg transition" 
                      onClick={() => setShowExplainer(true)}
                    >
                      <MoreVertical className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                  
                  {/* Dynamic Challenge Icons with Counters */}
                  <div className="flex justify-center gap-2 -mb-8">
                    {[0, 1, 2, 3].map((index) => {
                      const challengeIcon = getChallengeIcon(index);
                      const { Icon, color, isActive, isCompleted, challenge, completionCount } = challengeIcon;
                      
                      return (
                        <div key={index} className="relative flex flex-col items-center">
                          <button 
                            className={`w-14 h-14 bg-white rounded-xl flex items-center justify-center transition-all shadow-lg relative ${
                              isActive 
                                ? `border-2 border-${color}-500 bg-${color}-50 animate-pulse` 
                                : isCompleted
                                ? 'border-2 border-green-500 bg-green-50'
                                : 'border-2 border-slate-200 hover:border-slate-300'
                            } ${hoveredChallengeIndex === index && isActive ? 'ring-2 ring-offset-2' : ''}`}
                            style={hoveredChallengeIndex === index && isActive ? { ringColor: `var(--${color}-500)` } : {}}
                            title={challenge?.name || 'No challenge'}
                            onMouseEnter={() => isActive && setHoveredChallengeIndex(index)}
                            onMouseLeave={() => setHoveredChallengeIndex(null)}
                          >
                            {isCompleted ? (
                              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <Icon 
                                className={`w-6 h-6 transition ${
                                  isActive ? `text-${color}-500` : 'text-slate-400'
                                }`} 
                                strokeWidth={2.5} 
                              />
                            )}
                            
                            {/* Live indicator */}
                            {isActive && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                            )}
                          </button>
                          
                          {/* Completion Counter */}
                          {completionCount > 0 && (
                            <div className="mt-1 px-2 py-0.5 bg-slate-900 rounded-full">
                              <p className="text-[9px] font-black text-white">{completionCount}x</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ENERGY TRACKER - LIVE NOTIFICATION FEED */}
                <div className="mt-6 rounded-3xl p-4 flex-1 overflow-hidden flex flex-col">
                  <h3 className="text-base font-black text-slate-900 mb-3 tracking-tight">ENERGY TRACKER!</h3>
                  
                  {/* Scrollable Notification Feed */}
                  <div className="overflow-y-auto space-y-2 pr-1 pb-1 max-h-[160px] overscroll-contain touch-pan-y">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Zap className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-sm text-slate-500 font-semibold">Waiting for game action...</p>
                        <p className="text-xs text-slate-400 mt-1">Start a simulation to see live updates!</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          className="flex items-center justify-between py-2 px-3 rounded-xl border bg-white shadow-sm animate-slideIn"
                          style={{ 
                            borderColor: `${themeData.primaryColor}20`
                          }}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center shadow-md text-xl flex-shrink-0" 
                              style={{ background: `linear-gradient(135deg, ${themeData.primaryColor}, ${themeData.secondaryColor})` }}
                            >
                              {notif.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-900 text-xs truncate">{notif.title}</p>
                              <p className="text-xs text-slate-500 truncate">{notif.message}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-[9px] text-slate-400">{notif.timestamp}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STATS VIEW - CONNECTED TO CONTEXT */}
        {currentView === 'stats' && isConnected && (
          <div className="flex-1 overflow-auto pb-24">

            {/* Hero Card - Energy Score & Tokens */}
            <div className="rounded-3xl shadow-2xl p-5 mb-4" style={{ 
              background: `linear-gradient(135deg, ${themeData.secondaryColor} 0%, ${themeData.secondaryColor}dd 100%)`
            }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-slate-900 text-sm font-bold mb-1 opacity-80">ENERGY SCORE</p>
                  <h2 className="text-6xl font-black text-slate-900">{fanData.energy.toLocaleString()}</h2>
                </div>
                <div className="text-right">
                  <p className="text-slate-900 text-sm font-bold mb-1 opacity-80">TOKENS</p>
                  <h3 className="text-4xl font-black text-slate-900">{fanData.tokens}</h3>
                </div>
              </div>
              {/* Milestone Tracker */}
              <div className="bg-slate-900/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-900 font-bold text-sm">{fanData.milestone.reward}</p>
                  <p className="text-slate-900 font-bold text-xs">{fanData.milestone.current.toLocaleString()} / {fanData.milestone.target.toLocaleString()}</p>
                </div>
                <div className="h-3 bg-slate-900/20 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-slate-900 rounded-full transition-all duration-500" 
                    style={{ width: `${(fanData.milestone.current / fanData.milestone.target) * 100}%` }}
                  ></div>
                </div>
                <p className="text-slate-900 text-xs font-semibold">
                  🎁 {fanData.milestone.current >= fanData.milestone.target 
                    ? 'Milestone Reached!' 
                    : `Only ${fanData.milestone.target - fanData.milestone.current} points away!`}
                </p>
              </div>
            </div>

            {/* Gameday Badges Section - DYNAMIC */}
            <div className="mb-4">
              <h3 className="text-base font-black text-slate-900 mb-3 px-1">GAMEDAY BADGES</h3>
              <div className="grid grid-cols-2 gap-3">
                
                {['streakMaster', 'mvpSection', 'topFan', 'cheerMaster'].map((badgeKey) => {
                  const badge = getBadgeDisplay(badgeKey);
                  const { Icon } = badge;
                  
                  return (
                    <div key={badgeKey} className="relative">
                      <button 
                        onClick={() => setShowBadgeInfo(badgeKey)}
                        className="absolute top-2 right-2 z-10 text-white/80 hover:text-white transition"
                      >
                        <span className="text-sm">ℹ</span>
                      </button>
                      
                      {/* Blur effect for unlocked badges */}
                      {!badge.isLocked && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${badge.gradient} rounded-2xl blur-md opacity-50`}></div>
                      )}
                      
                      {/* Badge card */}
                      <div className={`relative bg-gradient-to-br ${badge.gradient} rounded-2xl p-4 shadow-xl border-2 ${badge.borderColor} ${
                        badge.isLocked ? 'bg-white/40 backdrop-blur-sm' : ''
                      }`}>
                        {/* Stars */}
                        <div className="flex justify-center gap-1 mb-2">
                          {[1, 2, 3].map((star) => (
                            <span 
                              key={star}
                              className={`text-lg ${star <= badge.stars ? badge.starColor : 'text-slate-300/40'}`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                        
                        {/* Icon */}
                        <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center backdrop-blur-sm border-2 ${
                          badge.isLocked 
                            ? 'bg-slate-100/50 border-slate-200/40' 
                            : 'bg-gradient-to-br from-white/40 to-white/20 border-white/30'
                        }`}>
                          {typeof Icon === 'function' ? (
                            <Icon />
                          ) : (
                            <Icon className={`w-7 h-7 drop-shadow-lg ${badge.isLocked ? 'text-slate-400/50' : 'text-white'}`} strokeWidth={3} />
                          )}
                        </div>
                        
                        {/* Label */}
                        <p className={`text-[10px] font-black text-center mb-1 tracking-wider ${badge.labelColor}`}>
                          {badge.label}
                        </p>
                        <p className={`text-[10px] font-black text-center tracking-wider ${badge.labelColor}`}>
                          {badge.sublabel}
                        </p>
                        
                        {/* Progress bar for locked badges */}
                        {badge.isLocked && fanData.badgeProgress[badgeKey] > 0 && (
                          <div className="mt-2 mb-1">
                            <div className="h-1.5 bg-slate-300/40 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-slate-400/30 rounded-full transition-all duration-500" 
                                style={{ width: `${fanData.badgeProgress[badgeKey]}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        {/* Tier label */}
                        <div className="mt-3 flex justify-center">
                          <div className={`px-2 py-0.5 rounded-full border ${badge.tierLabelBg}`}>
                            <p className={`text-[9px] font-black ${badge.labelColor}`}>
                              {badge.tierLabel}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>

            {/* Season Totals - CONNECTED TO CONTEXT */}
            <div className="bg-white rounded-3xl shadow-lg p-4 mb-4">
              <h3 className="text-base font-black text-slate-900 mb-3">SEASON TOTALS</h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-xl font-black" style={{ color: themeData.primaryColor }}>{fanData.seasonStats.gamesAttended}</p>
                  <p className="text-[10px] text-slate-600 font-semibold">Games</p>
                </div>
                <div>
                  <p className="text-xl font-black" style={{ color: themeData.primaryColor }}>
                    {fanData.seasonStats.avgEnergyScore > 0 ? fanData.seasonStats.avgEnergyScore.toLocaleString() : '-'}
                  </p>
                  <p className="text-[10px] text-slate-600 font-semibold">Avg Score</p>
                </div>
                <div>
                  <p className="text-xl font-black" style={{ color: themeData.primaryColor }}>
                    {fanData.seasonStats.totalTokens > 0 ? fanData.seasonStats.totalTokens.toLocaleString() : '-'}
                  </p>
                  <p className="text-[10px] text-slate-600 font-semibold">Tokens</p>
                </div>
                <div>
                  <p className="text-xl font-black" style={{ color: themeData.primaryColor }}>{fanData.seasonStats.totalBadges}</p>
                  <p className="text-[10px] text-slate-600 font-semibold">Badges</p>
                </div>
              </div>
            </div>

            {/* Past Performances - ONLY SHOWS SIMULATION RESULTS */}
            {fanData.pastPerformances.length > 0 && (
              <div>
                <h3 className="text-base font-black text-slate-900 mb-3 px-1">PAST PERFORMANCES</h3>
                <div className="space-y-2">
                  {fanData.pastPerformances.map((perf, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-md p-4 border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-slate-900">{themeData.teamName} vs {perf.opponent}</p>
                        <div className="flex gap-1">
                          {perf.badges.map((badge, badgeIdx) => {
                            const tierColor = badge.includes('gold') ? 'bg-yellow-400' : 
                                            badge.includes('silver') ? 'bg-slate-400' : 
                                            'bg-orange-500';
                            return (
                              <div key={badgeIdx} className={`w-5 h-5 rounded-full flex items-center justify-center ${tierColor}`}>
                                <span className="text-[10px]">⭐</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{perf.date}</p>
                      <div className="flex gap-4 text-xs">
                        <span className="text-slate-700 font-semibold">Energy: <span className="font-black">{perf.energy.toLocaleString()}</span></span>
                        <span className="text-slate-700 font-semibold">Tokens: <span className="font-black">{perf.tokens}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* REWARDS VIEW - CONNECTED TO CONTEXT */}
        {currentView === 'rewards' && isConnected && (
          <div className="flex-1 overflow-auto pb-24">

            <div className="relative rounded-3xl shadow-2xl p-5 mb-4 overflow-hidden" style={{ 
              background: `linear-gradient(135deg, ${themeData.primaryColor} 0%, ${themeData.primaryColor}dd 100%)`
            }}>
              <div className="relative z-10">
                <p className="text-white/80 text-sm font-bold mb-1">AVAILABLE TOKENS</p>
                <h2 className="text-6xl font-black text-white">{fanData.seasonStats.totalTokens - fanData.tokensSpent}</h2>
                <p className="text-white/70 text-xs mt-2">Earn more tokens by bringing energy!</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 mb-3 px-1">REWARDS CATALOG</h3>
              {rewardsCatalog.filter(r => r.available).length > 0 ? (
                <div className="space-y-2 px-1">
                  {rewardsCatalog.filter(r => r.available).map((reward) => (
                    <div key={reward.id} className="bg-white rounded-2xl shadow-md p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-black text-slate-900 text-sm">{reward.name}</h4>
                          <p className="text-xs text-slate-500 mt-1">{reward.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black" style={{ color: themeData.primaryColor }}>
                            {reward.tokens}
                          </p>
                          <p className="text-[10px] text-slate-500">tokens</p>
                        </div>
                      </div>
                      <button 
                        disabled={(fanData.seasonStats.totalTokens - fanData.tokensSpent) < reward.tokens}
                        onClick={() => {
                          if ((fanData.seasonStats.totalTokens - fanData.tokensSpent) >= reward.tokens) {
                            setFanData(prev => ({
                              ...prev,
                              tokensSpent: prev.tokensSpent + reward.tokens
                            }));
                          }
                        }}
                        className={`w-full py-2 rounded-lg font-bold text-white text-xs transition ${
                          (fanData.seasonStats.totalTokens - fanData.tokensSpent) >= reward.tokens 
                            ? 'hover:opacity-90' 
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                        style={{ backgroundColor: themeData.primaryColor }}
                      >
                        {(fanData.seasonStats.totalTokens - fanData.tokensSpent) >= reward.tokens ? 'Redeem Now' : 'Not Enough Tokens'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600 px-1">No rewards available at this time</p>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS VIEW - CONNECTED TO CONTEXT */}
        {currentView === 'settings' && isConnected && (
          <div className="flex-1 overflow-auto pb-24">

            {/* Settings Header */}
            <div className="bg-white rounded-3xl shadow-lg p-5 mb-4">
              <h2 className="text-lg font-black text-slate-900 mb-2">SETTINGS</h2>
              <p className="text-sm text-slate-600">Customize your fan experience</p>
            </div>

            {/* Device Settings */}
            <div className="bg-white rounded-3xl shadow-lg p-5 mb-4">
              <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                BRACELET CONTROLS
              </h3>
              
              <div className="space-y-4">
                {/* LED Lights */}
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">LED Light Effects</p>
                    <p className="text-xs text-slate-500 mt-0.5">Sync bracelet lights with game moments</p>
                  </div>
                  <button 
                    onClick={() => setShowSettingWarning('led')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      fanSettings.led ? 'bg-cyan-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`${
                      fanSettings.led ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                {/* Vibration */}
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">Vibration Alerts</p>
                    <p className="text-xs text-slate-500 mt-0.5">Feel the energy during key plays</p>
                  </div>
                  <button 
                    onClick={() => setShowSettingWarning('vibration')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      fanSettings.vibration ? 'bg-cyan-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`${
                      fanSettings.vibration ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                {/* Sound Effects */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">Sound Effects</p>
                    <p className="text-xs text-slate-500 mt-0.5">Audio cues for achievements</p>
                  </div>
                  <button 
                    onClick={() => setShowSettingWarning('sound')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      fanSettings.sound ? 'bg-cyan-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`${
                      fanSettings.sound ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-3xl shadow-lg p-5 mb-4">
              <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                NOTIFICATIONS
              </h3>
              
              <div className="space-y-4">
                {/* Game Updates */}
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">Game Updates</p>
                    <p className="text-xs text-slate-500 mt-0.5">Real-time scores and highlights</p>
                  </div>
                  <button 
                    onClick={() => setShowSettingWarning('gameUpdates')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      fanSettings.gameUpdates ? 'bg-purple-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`${
                      fanSettings.gameUpdates ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                {/* Reward Alerts */}
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">Reward Alerts</p>
                    <p className="text-xs text-slate-500 mt-0.5">New rewards and token milestones</p>
                  </div>
                  <button 
                    onClick={() => setShowSettingWarning('rewards')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      fanSettings.rewards ? 'bg-purple-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`${
                      fanSettings.rewards ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                {/* Challenge Reminders */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">Challenge Reminders</p>
                    <p className="text-xs text-slate-500 mt-0.5">Energy boost opportunities</p>
                  </div>
                  <button 
                    onClick={() => setShowSettingWarning('challenges')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      fanSettings.challenges ? 'bg-purple-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`${
                      fanSettings.challenges ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy & Data */}
            <div className="bg-white rounded-3xl shadow-lg p-5 mb-4">
              <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                PRIVACY & DATA
              </h3>
              
              <div className="space-y-4">
                {/* Analytics Sharing */}
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">Analytics Sharing</p>
                    <p className="text-xs text-slate-500 mt-0.5">Help improve the fan experience</p>
                  </div>
                  <button 
                    onClick={() => setShowSettingWarning('analytics')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      fanSettings.analytics ? 'bg-orange-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`${
                      fanSettings.analytics ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                {/* Location Services */}
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">Location Services</p>
                    <p className="text-xs text-slate-500 mt-0.5">For in-stadium features only</p>
                  </div>
                  <button 
                    onClick={() => setShowSettingWarning('location')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      fanSettings.location ? 'bg-orange-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`${
                      fanSettings.location ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                {/* Camera Access */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">Camera Access</p>
                    <p className="text-xs text-slate-500 mt-0.5">For AR features and QR scanning</p>
                  </div>
                  <button 
                    onClick={() => setShowSettingWarning('camera')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      fanSettings.camera ? 'bg-orange-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`${
                      fanSettings.camera ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-3xl shadow-lg p-5">
              <h3 className="text-sm font-black text-slate-900 mb-4">ACCOUNT</h3>
              <div className="space-y-3">
                <button className="w-full py-3 px-4 bg-slate-100 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-200 transition">
                  Manage Profile
                </button>
                <button className="w-full py-3 px-4 bg-slate-100 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-200 transition">
                  Linked Devices
                </button>
                <button className="w-full py-3 px-4 bg-red-50 rounded-xl text-sm font-bold text-red-600 hover:bg-red-100 transition">
                  Sign Out
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 text-center">App Version 1.0.0</p>
                <p className="text-xs text-slate-500 text-center mt-1">Device ID: BRC-2025-1847</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Navigation */}
      {isConnected && (
        <div 
            className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm md:absolute md:rounded-b-[3rem] border-t border-slate-200 px-6 py-3"
            style={{ paddingBottom: isStandalone ? 'calc(env(safe-area-inset-bottom) + 12px)' : '12px' }}
          >
          <div className="flex items-center justify-around">
            <button 
              onClick={() => setCurrentView('home')}
              className="flex flex-col items-center gap-0.5" 
              style={{ color: currentView === 'home' ? themeData.primaryColor : '#94a3b8' }}
            >
              <Home className="w-6 h-6" strokeWidth={currentView === 'home' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Home</span>
            </button>
            <button 
              onClick={() => setCurrentView('stats')}
              className="flex flex-col items-center gap-0.5 transition"
              style={{ color: currentView === 'stats' ? themeData.primaryColor : '#94a3b8' }}
            >
              <BarChart3 className="w-6 h-6" strokeWidth={currentView === 'stats' ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">Stats</span>
            </button>
            <button 
              onClick={() => setCurrentView('rewards')}
              className="flex flex-col items-center gap-0.5 transition"
              style={{ color: currentView === 'rewards' ? themeData.primaryColor : '#94a3b8' }}
            >
              <Gift className="w-6 h-6" strokeWidth={currentView === 'rewards' ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">Rewards</span>
            </button>
            <button 
              onClick={() => setCurrentView('settings')}
              className="flex flex-col items-center gap-0.5 transition"
              style={{ color: currentView === 'settings' ? themeData.primaryColor : '#94a3b8' }}
            >
              <Settings className="w-6 h-6" strokeWidth={currentView === 'settings' ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* Explainer Modal */}
      {showExplainer && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 rounded-[3rem]">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900">Energy Challenges</h3>
              <button onClick={() => setShowExplainer(false)} className="p-1 hover:bg-slate-100 rounded-lg transition">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Complete challenges during the game to earn energy points!
            </p>
            <button 
              onClick={() => setShowExplainer(false)}
              className="w-full py-3 rounded-xl font-bold text-white transition shadow-lg"
              style={{ background: `linear-gradient(135deg, ${themeData.primaryColor}, ${themeData.secondaryColor})` }}
            >
              Got It!
            </button>
          </div>
        </div>
      )}

      {/* Settings Warning Modal - CONNECTED TO CONTEXT */}
      {showSettingWarning && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 rounded-[3rem]">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900">
                {showSettingWarning === 'led' && '💡 LED Light Effects'}
                {showSettingWarning === 'vibration' && '📳 Vibration Alerts'}
                {showSettingWarning === 'sound' && '🔊 Sound Effects'}
                {showSettingWarning === 'gameUpdates' && '📱 Game Updates'}
                {showSettingWarning === 'rewards' && '🎁 Reward Alerts'}
                {showSettingWarning === 'challenges' && '⚡ Challenge Reminders'}
                {showSettingWarning === 'analytics' && '📊 Analytics Sharing'}
                {showSettingWarning === 'location' && '📍 Location Services'}
                {showSettingWarning === 'camera' && '📷 Camera Access'}
              </h3>
              <button onClick={() => setShowSettingWarning(null)} className="p-1 hover:bg-slate-100 rounded-lg transition">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            <div className="mb-6">
              {showSettingWarning === 'led' && (
                <div>
                  <p className="text-sm text-slate-600 mb-3">
                    {fanSettings.led ? 'Disabling LED effects will:' : 'Enabling LED effects will:'}
                  </p>
                  <ul className="space-y-2 text-sm text-slate-500">
                    {fanSettings.led ? (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">⚠️</span>
                          <span>Stop synchronized light shows during key game moments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">⚠️</span>
                          <span>Reduce your participation in crowd-wide effects</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>Sync your bracelet with stadium-wide light shows</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">ℹ️</span>
                          <span>May increase battery consumption by ~15%</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
              
              {showSettingWarning === 'vibration' && (
                <div>
                  <p className="text-sm text-slate-600 mb-3">
                    {fanSettings.vibration ? 'Disabling vibrations will:' : 'Enabling vibrations will:'}
                  </p>
                  <ul className="space-y-2 text-sm text-slate-500">
                    {fanSettings.vibration ? (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">⚠️</span>
                          <span>Remove haptic feedback for touchdowns and big plays</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">⚠️</span>
                          <span>Miss physical alerts for rewards and achievements</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>Feel the excitement during crucial game moments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">ℹ️</span>
                          <span>Gentle pulses won't disturb others around you</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
              
              {showSettingWarning === 'analytics' && (
                <div>
                  <p className="text-sm text-slate-600 mb-3">
                    {fanSettings.analytics ? 'Disabling analytics will:' : 'Enabling analytics will:'}
                  </p>
                  <ul className="space-y-2 text-sm text-slate-500">
                    {fanSettings.analytics ? (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">⚠️</span>
                          <span>Stop sharing anonymous usage data</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">ℹ️</span>
                          <span>Your personal info always remains private</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>Help improve the app with anonymous data</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">ℹ️</span>
                          <span>No personal information is ever collected</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}

              {showSettingWarning === 'location' && (
                <div>
                  <p className="text-sm text-slate-600 mb-3">
                    {fanSettings.location ? 'Disabling location will:' : 'Enabling location will:'}
                  </p>
                  <ul className="space-y-2 text-sm text-slate-500">
                    {fanSettings.location ? (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">⚠️</span>
                          <span>Disable seat-specific experiences and rewards</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">⚠️</span>
                          <span>Remove access to location-based challenges</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>Unlock seat-specific rewards and experiences</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">ℹ️</span>
                          <span>Location is only used inside the stadium</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}

              {!['led', 'vibration', 'analytics', 'location'].includes(showSettingWarning) && (
                <p className="text-sm text-slate-600">
                  Are you sure you want to {fanSettings[showSettingWarning] ? 'disable' : 'enable'} this feature?
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowSettingWarning(null)}
                className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-700 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  toggleFanSetting(showSettingWarning);
                  setShowSettingWarning(null);
                }}
                className="flex-1 py-3 rounded-xl font-bold text-white transition shadow-lg"
                style={{ background: `linear-gradient(135deg, ${themeData.primaryColor}, ${themeData.secondaryColor})` }}
              >
                {fanSettings[showSettingWarning] ? 'Turn Off' : 'Turn On'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .overflow-auto::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .overflow-auto {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }

        /* Slide in animation for notifications */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}