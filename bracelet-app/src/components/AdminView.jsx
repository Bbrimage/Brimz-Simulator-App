import React, { useState } from 'react';
import { BarChart3, Settings as SettingsIcon, Gamepad2, Search, Star, Calendar, Image, Bell, Award } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function AdminView() {
  const { 
    themeData, 
    updateThemeData,
    gameData,
    activeChallenges,
    endChallenge,
    rewardsCatalog,
    removeReward,
    sendPushNotification
  } = useAppContext();

  // Detect if running as installed PWA
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  
  const [currentPage, setCurrentPage] = useState('analytics');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [starredCards, setStarredCards] = useState(new Set());
  const [hoveredTime, setHoveredTime] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Local state for color inputs
  const [primaryColor, setPrimaryColor] = useState(themeData.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(themeData.secondaryColor);

  // Push notification state
  const [pushMessage, setPushMessage] = useState('');
  const [pushTarget, setPushTarget] = useState('all');

  // Handler to update theme colors
  const handleApplyColors = () => {
    updateThemeData({ 
      primaryColor, 
      secondaryColor 
    });
    alert('Colors updated successfully!');
  };

  // Handler to end a challenge
  const handleEndChallenge = (challengeId) => {
    endChallenge(challengeId);
  };

  // Handler to remove a reward
  const handleRemoveReward = (rewardId) => {
    if (window.confirm('Are you sure you want to remove this reward?')) {
      removeReward(rewardId);
    }
  };

  // Handler to send push notification
  const handleSendPushNotification = () => {
    if (!pushMessage.trim()) {
      alert('Please enter a message');
      return;
    }
    sendPushNotification(pushMessage, pushTarget);
    setPushMessage('');
    alert('Push notification sent!');
  };

  const categories = ['all', 'crowd-engagement', 'app-impact', 'fan-participation', 'operations', 'tokens-rewards', 'badges', 'leaderboard', 'timing'];

  const timelineData = [
    { time: 'Q1 0:00', energy: 1200, fans: 14500, participation: 45, tokens: 125000, noise: 75 },
    { time: 'Q1 5:00', energy: 1350, fans: 14600, participation: 52, tokens: 180000, noise: 78 },
    { time: 'Q1 10:00', energy: 1450, fans: 14700, participation: 58, tokens: 240000, noise: 82 },
    { time: 'Q1 15:00', energy: 1420, fans: 14650, participation: 55, tokens: 285000, noise: 80 },
    { time: 'Q2 0:00', energy: 1580, fans: 14750, participation: 65, tokens: 350000, noise: 85 },
    { time: 'Q2 5:00', energy: 1650, fans: 14800, participation: 70, tokens: 420000, noise: 88 },
    { time: 'Q2 10:00', energy: 1680, fans: 14820, participation: 72, tokens: 490000, noise: 89 },
    { time: 'HT', energy: 950, fans: 12200, participation: 25, tokens: 520000, noise: 65 },
    { time: 'Q3 0:00', energy: 1480, fans: 14600, participation: 60, tokens: 620000, noise: 83 },
    { time: 'Q3 5:00', energy: 1520, fans: 14700, participation: 62, tokens: 690000, noise: 84 },
    { time: 'Q3 10:00', energy: 1500, fans: 14650, participation: 58, tokens: 750000, noise: 82 },
    { time: 'Q4 0:00', energy: 1750, fans: 14847, participation: 78, tokens: 850000, noise: 92 },
    { time: 'Q4 5:00', energy: 1850, fans: 14847, participation: 82, tokens: 950000, noise: 95 },
    { time: 'Q4 10:00', energy: 1890, fans: 14847, participation: 85, tokens: 1050000, noise: 96 },
  ];

  const toggleStar = (cardId) => {
    const newStarred = new Set(starredCards);
    if (newStarred.has(cardId)) {
      newStarred.delete(cardId);
    } else {
      newStarred.add(cardId);
    }
    setStarredCards(newStarred);
  };

  const handleAddToTracker = (cardId, cardTitle) => {
    console.log(`Adding "${cardTitle}" to tracker graph`);
    setActiveDropdown(null);
  };

  const handlePinToTop = (cardId, cardTitle) => {
    console.log(`Pinning "${cardTitle}" to top`);
    setActiveDropdown(null);
  };

  const allDataCards = [
    // CROWD ENGAGEMENT
    { id: 'avg-energy', title: 'Average Energy Score', value: '1,847', change: '↑ 12% vs Q3', trend: 'up', category: 'crowd-engagement' },
    { id: 'total-claps', title: 'Total Claps', value: '1.2M', change: '↑ 18%', trend: 'up', category: 'crowd-engagement' },
    { id: 'total-cheers', title: 'Total Cheers', value: '845K', change: '↑ 22%', trend: 'up', category: 'crowd-engagement' },
    { id: 'wave-init', title: 'Wave Initiations', value: '23', change: '↑ 35%', trend: 'up', category: 'crowd-engagement' },
    { id: 'chant-part', title: 'Chant Participation', value: '67%', change: '↑ 8%', trend: 'up', category: 'crowd-engagement' },
    { id: 'peak-energy', title: 'Peak Energy Moment', value: 'Q4 2:34', change: '2,100', trend: 'up', category: 'crowd-engagement' },
    { id: 'low-energy', title: 'Lowest Energy', value: 'Halftime', change: '890', trend: 'down', category: 'crowd-engagement' },
    { id: 'sec-108', title: 'Section 108 Energy', value: '2,100', change: '🏆 Top', trend: 'up', category: 'crowd-engagement' },
    { id: 'sec-214', title: 'Section 214 Energy', value: '1,450', change: '↓ 15%', trend: 'down', category: 'crowd-engagement' },

    // APP IMPACT
    { id: 'engagement-lift', title: 'Engagement Lift', value: '+34%', change: 'vs baseline', trend: 'up', category: 'app-impact' },
    { id: 'challenge-success', title: 'Challenge Success Rate', value: '78%', change: '↑ 5%', trend: 'up', category: 'app-impact' },
    { id: 'challenges-issued', title: 'Challenges Issued', value: '45', change: '', trend: 'neutral', category: 'app-impact' },
    { id: 'challenges-completed', title: 'Challenges Completed', value: '32', change: '71%', trend: 'up', category: 'app-impact' },
    { id: 'avg-part-challenge', title: 'Avg Participation/Challenge', value: '3,200', change: 'fans', trend: 'up', category: 'app-impact' },
    { id: 'clap-success', title: '"Clap Challenge" Success', value: '92%', change: '', trend: 'up', category: 'app-impact' },
    { id: 'wave-success', title: '"Wave Challenge" Success', value: '65%', change: '', trend: 'up', category: 'app-impact' },
    { id: 'cheer-success', title: '"Loudest Cheer" Success', value: '78%', change: '', trend: 'up', category: 'app-impact' },
    { id: 'push-open', title: 'Push Notification Open Rate', value: '84%', change: '', trend: 'up', category: 'app-impact' },
    { id: 'push-action', title: 'Push Notification Action Rate', value: '67%', change: '', trend: 'up', category: 'app-impact' },
    { id: 'app-vs-non', title: 'App Users vs Non-Users', value: '+51%', change: 'engagement', trend: 'up', category: 'app-impact' },
    { id: 'historical-imp', title: 'Historical Improvement', value: '+22 dB', change: 'noise', trend: 'up', category: 'app-impact' },

    // FAN PARTICIPATION
    { id: 'active-now', title: 'Active Fans Now', value: '14,847', change: '99%', trend: 'up', category: 'fan-participation' },
    { id: 'currently-engaged', title: 'Currently Engaged', value: '11,234', change: '76%', trend: 'up', category: 'fan-participation' },
    { id: 'wave-part', title: '"Start Wave" Participation', value: '1,247', change: '8.4%', trend: 'up', category: 'fan-participation' },
    { id: 'cheer-active', title: '"Loudest Cheer" Active', value: '3,892', change: '26.2%', trend: 'up', category: 'fan-participation' },
    { id: 'clap-engaged', title: '"Clap Count" Engaged', value: '8,654', change: '58.3%', trend: 'up', category: 'fan-participation' },
    { id: 'response-time', title: 'Avg Response Time', value: '4.2s', change: '', trend: 'neutral', category: 'fan-participation' },
    { id: 'peak-window', title: 'Peak Engagement Window', value: '15-30s', change: '', trend: 'neutral', category: 'fan-participation' },

    // OPERATIONS
    { id: 'in-seats', title: 'Fans In Seats', value: '82%', change: '↑ 3%', trend: 'up', category: 'operations' },
    { id: 'fans-away', title: 'Fans Away', value: '18%', change: '↓ 3%', trend: 'down', category: 'operations' },
    { id: 'avg-time-away', title: 'Avg Time Away', value: '8 min', change: '', trend: 'neutral', category: 'operations' },
    { id: 'concession-wait', title: 'Concession Wait Time', value: '6.5 min', change: '↓ 1.2 min', trend: 'up', category: 'operations' },
    { id: 'busiest-stand', title: 'Busiest Concession', value: 'Stand C', change: '450 visits', trend: 'neutral', category: 'operations' },
    { id: 'bathroom-peak', title: 'Bathroom Peak', value: 'Q2', change: '8-min mark', trend: 'neutral', category: 'operations' },
    { id: 'traffic-rush', title: 'Traffic Rush', value: 'Halftime', change: '42% movement', trend: 'neutral', category: 'operations' },

    // TOKENS & REWARDS
    { id: 'tokens-today', title: 'Total Tokens Today', value: '4.2M', change: '', trend: 'up', category: 'tokens-rewards' },
    { id: 'redemption', title: 'Redemption Rate', value: '67%', change: '↑ 12%', trend: 'up', category: 'tokens-rewards' },
    { id: 'avg-tokens', title: 'Avg Tokens/Fan', value: '289', change: '', trend: 'neutral', category: 'tokens-rewards' },
    { id: 'most-claimed', title: 'Most Claimed Reward', value: 'Free Drink', change: '1,245', trend: 'up', category: 'tokens-rewards' },
    { id: 'milestone-hit', title: 'Milestone Hit Rate', value: '56%', change: '', trend: 'neutral', category: 'tokens-rewards' },
    { id: 'token-motivation', title: 'Token Motivation Impact', value: '+67%', change: 'engagement', trend: 'up', category: 'tokens-rewards' },

    // BADGES
    { id: 'streak-master', title: 'Streak Master Earned', value: '3,245', change: '', trend: 'up', category: 'badges' },
    { id: 'loudest-badge', title: 'Loudest Cheer Earned', value: '1,892', change: '', trend: 'up', category: 'badges' },
    { id: 'top-50-badge', title: 'Top 50 Fan Earned', value: '50', change: '', trend: 'up', category: 'badges' },
    { id: 'mvp-section-badge', title: 'MVP Section Earned', value: '18', change: 'sections', trend: 'up', category: 'badges' },
    { id: 'total-badges', title: 'Total Badges Awarded', value: '5,205', change: '', trend: 'up', category: 'badges' },

    // LEADERBOARD
    { id: 'top-fan', title: 'Top Fan', value: '#23', change: '3,450 points', trend: 'up', category: 'leaderboard' },
    { id: 'top-section', title: 'Top Section', value: '108', change: '2,100 avg', trend: 'up', category: 'leaderboard' },
    { id: 'top-100-threshold', title: 'Top 100 Threshold', value: '2,200', change: 'points', trend: 'neutral', category: 'leaderboard' },
    { id: '50th-percentile', title: '50th Percentile', value: '1,450', change: 'points', trend: 'neutral', category: 'leaderboard' },

    // TIMING
    { id: 'q1-avg', title: 'Q1 Avg Energy', value: '1,450', change: '', trend: 'neutral', category: 'timing' },
    { id: 'q2-avg', title: 'Q2 Avg Energy', value: '1,680', change: '↑ 16%', trend: 'up', category: 'timing' },
    { id: 'q3-avg', title: 'Q3 Avg Energy', value: '1,520', change: '↓ 9%', trend: 'down', category: 'timing' },
    { id: 'q4-avg', title: 'Q4 Avg Energy', value: '1,890', change: '↑ 24%', trend: 'up', category: 'timing' },
    { id: 'best-quarter', title: 'Best Quarter', value: 'Q4', change: '', trend: 'up', category: 'timing' },
    { id: 'challenge-timing', title: 'Challenge Optimal Timing', value: '8-12 min', change: '', trend: 'neutral', category: 'timing' },
  ];

  const filteredCards = allDataCards.filter(card => {
    const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
    const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div 
          className="relative z-10 px-5 h-full flex flex-col pb-20"
          style={{ paddingTop: isStandalone ? 'calc(env(safe-area-inset-top) + 80px)' : '' }}
        >
        
        {/* ANALYTICS PAGE */}
        {currentPage === 'analytics' && (
          <div className="flex-1 overflow-auto pb-24">

            {/* Header */}
            <div className="mb-4">
              <h1 className="text-2xl font-black text-slate-900 mb-1">Admin Dashboard</h1>
              <p className="text-xs text-slate-600">{themeData.teamName} vs {themeData.opponent} • {gameData.quarter} {gameData.timeRemaining} • {gameData.isLive ? 'Live' : 'Ended'}</p>
            </div>

            {/* Top Headline Metrics - Swipeable Carousel */}
            <div className="mb-4 overflow-hidden">
              {/* Swipe Indicator - ABOVE CARDS */}
              <div className="flex items-center justify-end gap-1 mb-2">
                <div className="flex gap-1">
                  <div className="w-6 h-1 rounded-full bg-slate-900"></div>
                  <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                </div>
                <svg className="w-4 h-4 text-slate-400 animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-[9px] text-slate-400 font-semibold">Swipe</span>
              </div>

              <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide">
                {/* Total Active Fans - FROM CONTEXT */}
                <div className="min-w-[48%] bg-white shadow-md p-3 snap-start">
                  <p className="text-[10px] text-slate-400 mb-1 uppercase tracking-wide">Total Active Fans</p>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">{gameData.totalActiveFans.toLocaleString()}</h2>
                  <div className="flex items-center gap-3 text-[9px]">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">🔒 SSL</span>
                      <span className="text-green-600 font-bold">↑ {(gameData.activeFansSSL - 10000).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">NON-SSL</span>
                      <span className="text-green-600 font-bold">↑ {(gameData.activeFansNonSSL - 1400).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Average Energy Score - FROM CONTEXT */}
                <div className="min-w-[48%] bg-white shadow-md p-3 snap-start">
                  <p className="text-[10px] text-slate-400 mb-1 uppercase tracking-wide">Avg Energy</p>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">{gameData.averageEnergy.toLocaleString()}</h2>
                  <div className="flex items-center gap-3 text-[9px]">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">🔒 SSL</span>
                      <span className="text-green-600 font-bold">↑ {gameData.averageEnergySSL - gameData.averageEnergy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">NON-SSL</span>
                      <span className="text-green-600 font-bold">↑ {gameData.averageEnergy - gameData.averageEnergyNonSSL}</span>
                    </div>
                  </div>
                </div>

                {/* App Engagement - FROM CONTEXT */}
                <div className="min-w-[48%] bg-white shadow-md p-3 snap-start">
                  <p className="text-[10px] text-slate-400 mb-1 uppercase tracking-wide">Engagement</p>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">{gameData.engagementRate}%</h2>
                  <div className="flex items-center gap-3 text-[9px]">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">🔒 SSL</span>
                      <span className="text-green-600 font-bold">↑ {gameData.engagementSSL}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">NON-SSL</span>
                      <span className="text-green-600 font-bold">{gameData.engagementNonSSL}%</span>
                    </div>
                  </div>
                </div>

                {/* Tokens Distributed - FROM CONTEXT */}
                <div className="min-w-[48%] bg-white shadow-md p-3 snap-start">
                  <p className="text-[10px] text-slate-400 mb-1 uppercase tracking-wide">Tokens</p>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">{(gameData.totalTokens / 1000000).toFixed(1)}M</h2>
                  <div className="flex items-center gap-3 text-[9px]">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">🔒 SSL</span>
                      <span className="text-green-600 font-bold">↑ {(gameData.tokensSSL / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">NON-SSL</span>
                      <span className="text-green-600 font-bold">↑ {(gameData.tokensNonSSL / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Game Tracking Chart */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-900">LIVE GAME TRACKING</h3>
                <button className="p-1.5 hover:bg-slate-100 rounded-lg transition">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4 relative">
                {/* Unified vertical line indicator - positioned absolutely */}
                {hoveredTime !== null && (
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-900 pointer-events-none z-20"
                    style={{ 
                      left: `${(hoveredTime / (timelineData.length - 1)) * 100}%`
                    }}
                  />
                )}

                {[
                  { label: 'Average Energy Score', key: 'energy', max: 2000 },
                  { label: 'Active Fans', key: 'fans', max: 15000 },
                  { label: 'Challenge Participation %', key: 'participation', max: 100 },
                  { label: 'Tokens Distributed', key: 'tokens', max: 1200000 },
                  { label: 'Crowd Noise (dB)', key: 'noise', max: 100 },
                ].map((metric, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-semibold text-slate-700">{metric.label}</p>
                      {hoveredTime !== null && (
                        <div className="text-xs font-bold" style={{ color: themeData.primaryColor }}>
                          {timelineData[hoveredTime][metric.key].toLocaleString()}
                          <span className="text-[10px] text-slate-500 ml-1">{timelineData[hoveredTime].time}</span>
                        </div>
                      )}
                    </div>
                    <div className="relative h-12 bg-slate-50 rounded-lg overflow-hidden">
                      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <defs>
                          <linearGradient id={`gradient-${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: themeData.secondaryColor, stopOpacity: 0.3 }} />
                            <stop offset="100%" style={{ stopColor: themeData.secondaryColor, stopOpacity: 0.05 }} />
                          </linearGradient>
                        </defs>
                        <path
                          d={timelineData.map((d, i) => {
                            const x = (i / (timelineData.length - 1)) * 100;
                            const y = 100 - (d[metric.key] / metric.max) * 100;
                            return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                          }).join(' ') + ` L 100,100 L 0,100 Z`}
                          fill={`url(#gradient-${idx})`}
                        />
                        <polyline
                          points={timelineData.map((d, i) => {
                            const x = (i / (timelineData.length - 1)) * 100;
                            const y = 100 - (d[metric.key] / metric.max) * 100;
                            return `${x},${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke={themeData.secondaryColor}
                          strokeWidth="1.5"
                        />
                      </svg>
                      
                      {/* Unified hover overlay - on every chart */}
                      <div className="absolute inset-0">
                        {timelineData.map((_, i) => (
                          <div
                            key={i}
                            className="absolute top-0 bottom-0"
                            style={{ 
                              left: `${(i / (timelineData.length - 1)) * 100}%`,
                              width: `${100 / timelineData.length}%`
                            }}
                            onMouseEnter={() => setHoveredTime(i)}
                            onMouseLeave={() => setHoveredTime(null)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-md p-3 mb-4">
              <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search metrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1"
                  style={{ focusRing: themeData.primaryColor }}
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition ${
                      selectedCategory === cat ? 'text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                    }`}
                    style={selectedCategory === cat ? { backgroundColor: themeData.primaryColor } : {}}
                  >
                    {cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Data Cards */}
            <div className="grid grid-cols-2 gap-2">
              {filteredCards.map((card) => (
                <div key={card.id} className="bg-white rounded-lg shadow-sm p-3 relative">
                  {/* Star and Plus buttons */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => toggleStar(card.id)}
                      className="p-0.5"
                    >
                      <Star className={`w-3 h-3 ${starredCards.has(card.id) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === card.id ? null : card.id)}
                        className="p-0.5"
                      >
                        <svg className="w-3 h-3 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeDropdown === card.id && (
                        <div className="absolute right-0 top-6 bg-white border border-slate-200 rounded-lg shadow-lg z-50 w-40">
                          <button
                            onClick={() => handleAddToTracker(card.id, card.title)}
                            className="w-full px-3 py-2 text-left text-[10px] font-semibold text-slate-700 hover:bg-slate-50 rounded-t-lg"
                          >
                            📊 Add to Tracker
                          </button>
                          <button
                            onClick={() => handlePinToTop(card.id, card.title)}
                            className="w-full px-3 py-2 text-left text-[10px] font-semibold text-slate-700 hover:bg-slate-50 rounded-b-lg border-t border-slate-100"
                          >
                            📌 Pin to Top
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 mb-1 pr-8">{card.title}</p>
                  <h3 className="text-xl font-black text-slate-900 mb-1">{card.value}</h3>
                  <span className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
                    card.trend === 'up' ? 'bg-green-100 text-green-700' : 
                    card.trend === 'down' ? 'bg-red-100 text-red-700' : 
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {card.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GAME CONTROLS PAGE */}
        {currentPage === 'controls' && (
          <div className="flex-1 overflow-auto pb-24">

            <div className="mb-4">
              <h1 className="text-2xl font-black text-slate-900 mb-1">Game Controls</h1>
              <p className="text-xs text-slate-600">Manage live game experience</p>
            </div>

            {/* Event Information */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-3">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4" style={{ color: themeData.primaryColor }} />
                <h2 className="text-sm font-black text-slate-900">📅 Event Information</h2>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Opponent</label>
                  <input type="text" defaultValue="Baltimore Ravens" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                    <input type="date" defaultValue="2025-11-21" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                    <input type="time" defaultValue="13:00" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
                  </div>
                </div>
              </div>
              <button className="mt-3 w-full py-2 rounded-lg font-bold text-white text-xs shadow-md" style={{ backgroundColor: themeData.primaryColor }}>
                Update Event Info
              </button>
            </div>

            {/* Carousel Slides */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-3">
              <div className="flex items-center gap-2 mb-3">
                <Image className="w-4 h-4" style={{ color: themeData.primaryColor }} />
                <h2 className="text-sm font-black text-slate-900">🎬 Carousel Slides</h2>
              </div>
              <div className="space-y-3">
                {/* Slide 1 */}
                <div className="border border-slate-200 rounded-lg p-3">
                  <p className="text-xs font-bold text-slate-700 mb-2">Slide 1 - Game Day</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Title</label>
                      <input type="text" defaultValue="GAME DAY" className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Subtitle</label>
                      <input type="text" defaultValue="ENERGY" className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs" />
                    </div>
                  </div>
                </div>

                {/* Slide 2 */}
                <div className="border border-slate-200 rounded-lg p-3">
                  <p className="text-xs font-bold text-slate-700 mb-2">Slide 2 - Promo</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Title</label>
                      <input type="text" defaultValue="50% OFF" className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Subtitle</label>
                      <input type="text" defaultValue="CONCESSIONS" className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs" />
                    </div>
                  </div>
                </div>

                {/* Slide 3 */}
                <div className="border border-slate-200 rounded-lg p-3">
                  <p className="text-xs font-bold text-slate-700 mb-2">Slide 3 - Sponsor</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Title</label>
                      <input type="text" defaultValue="PRESENTED BY" className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Subtitle</label>
                      <input type="text" defaultValue="BRIMZ-TECH" className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs" />
                    </div>
                  </div>
                </div>
              </div>
              <button className="mt-3 w-full py-2 rounded-lg font-bold text-white text-xs shadow-md" style={{ backgroundColor: themeData.primaryColor }}>
                Update Carousel
              </button>
            </div>

            {/* Challenge Management - CONNECTED TO CONTEXT */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-black text-slate-900">⚡ Challenges</h2>
                <button className="px-2 py-1 rounded-lg font-bold text-xs shadow-sm" style={{ backgroundColor: themeData.secondaryColor, color: '#000' }}>
                  + New
                </button>
              </div>
              <div className="space-y-2">
                {activeChallenges.filter(c => c.status === 'active').length > 0 ? (
                  activeChallenges.filter(c => c.status === 'active').map((challenge) => (
                    <div key={challenge.id} className="border border-slate-200 rounded-lg p-2 bg-green-50 animate-pulse-slow">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1">
                            {challenge.emoji && <span>{challenge.emoji}</span>}
                            {challenge.name}
                          </h3>
                          <p className="text-[10px] text-slate-500">{challenge.participants.toLocaleString()} participants</p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-500 text-white animate-pulse">
                          LIVE
                        </span>
                      </div>
                      <button 
                        onClick={() => handleEndChallenge(challenge.id)}
                        className="w-full px-2 py-1 bg-slate-700 text-white rounded text-[10px] font-semibold hover:bg-slate-600 transition"
                      >
                        End Challenge
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">No active challenges</p>
                )}
              </div>
            </div>

            {/* Push Notifications - CONNECTED TO CONTEXT */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-3">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-4 h-4" style={{ color: themeData.primaryColor }} />
                <h2 className="text-sm font-black text-slate-900">📱 Push Notification</h2>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                  <textarea 
                    value={pushMessage}
                    onChange={(e) => setPushMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs resize-none" 
                    rows={3}
                    placeholder="Enter message to fans..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target</label>
                  <select 
                    value={pushTarget}
                    onChange={(e) => setPushTarget(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="all">All Fans ({gameData.totalActiveFans.toLocaleString()})</option>
                    <option value="top100">Top 100 Fans</option>
                    <option value="section">Specific Section</option>
                    <option value="lowenergy">Low Energy Fans</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={handleSendPushNotification}
                className="mt-3 w-full py-2 rounded-lg font-bold text-white text-xs shadow-md hover:opacity-90 transition" 
                style={{ backgroundColor: themeData.primaryColor }}
              >
                Send Notification
              </button>
            </div>

            {/* Rewards Catalog - CONNECTED TO CONTEXT */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-black text-slate-900">🎁 Rewards</h2>
                <button className="px-2 py-1 rounded-lg font-bold text-xs shadow-sm" style={{ backgroundColor: themeData.secondaryColor, color: '#000' }}>
                  + Add
                </button>
              </div>
              <div className="space-y-2">
                {rewardsCatalog.filter(r => r.available).length > 0 ? (
                  rewardsCatalog.filter(r => r.available).map((reward) => (
                    <div key={reward.id} className="border border-slate-200 rounded-lg p-2">
                      <h3 className="font-bold text-slate-900 text-xs mb-1">{reward.name}</h3>
                      <div className="flex justify-between text-[10px] text-slate-600 mb-1">
                        <span>Cost: {reward.tokens} tokens</span>
                        <span>Claimed: {reward.claimed}</span>
                      </div>
                      <div className="flex gap-1">
                        <button className="flex-1 px-2 py-1 bg-slate-100 rounded text-[10px] font-semibold hover:bg-slate-200 transition">
                          Edit
                        </button>
                        <button 
                          onClick={() => handleRemoveReward(reward.id)}
                          className="px-2 py-1 bg-red-100 text-red-700 rounded text-[10px] font-semibold hover:bg-red-200 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">No rewards available</p>
                )}
              </div>
            </div>

            {/* Team Colors - CONNECTED TO CONTEXT */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="text-sm font-black text-slate-900 mb-3">🎨 Team Colors</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 mb-2">Primary Color</p>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="color" 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer" 
                    />
                    <span className="text-xs font-mono text-slate-600">{primaryColor}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-2">Secondary Color</p>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="color" 
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer" 
                    />
                    <span className="text-xs font-mono text-slate-600">{secondaryColor}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleApplyColors}
                className="mt-3 w-full py-2 rounded-lg font-bold text-white text-xs shadow-md hover:opacity-90 transition" 
                style={{ backgroundColor: primaryColor }}
              >
                Apply Changes
              </button>
            </div>
          </div>
        )}

        {/* SETTINGS PAGE */}
        {currentPage === 'settings' && (
          <div className="flex-1 overflow-auto pb-24">

            <div className="mb-4">
              <h1 className="text-2xl font-black text-slate-900 mb-1">Settings</h1>
              <p className="text-xs text-slate-600">System configuration</p>
            </div>

            {/* Team/Venue Settings */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-3">
              <h2 className="text-sm font-black text-slate-900 mb-3">🏟️ Team & Venue</h2>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Team Name</label>
                  <input type="text" defaultValue="Washington Commanders" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stadium Name</label>
                  <input type="text" defaultValue="FedExField" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Capacity</label>
                  <input type="number" defaultValue="67617" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Team Logo</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                    <p className="text-xs text-slate-500">Upload Logo (PNG, SVG)</p>
                    <button className="mt-2 px-3 py-1 bg-slate-100 rounded text-[10px] font-semibold">Choose File</button>
                  </div>
                </div>
              </div>
              <button className="mt-3 w-full py-2 rounded-lg font-bold text-white text-xs shadow-md" style={{ backgroundColor: themeData.primaryColor }}>
                Update Info
              </button>
            </div>

            {/* Badge System Configuration */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-3">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4" style={{ color: themeData.primaryColor }} />
                <h2 className="text-sm font-black text-slate-900">🏆 Badge Requirements</h2>
              </div>
              <div className="space-y-2">
                {/* Streak Master */}
                <div className="border border-slate-200 rounded-lg p-2">
                  <p className="font-bold text-slate-900 text-xs mb-2">Streak Master</p>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Bronze:</span>
                      <input type="text" defaultValue="3 games, 1000+ energy" className="w-40 px-2 py-0.5 border rounded text-[10px]" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Silver:</span>
                      <input type="text" defaultValue="5 games, 1500+ energy" className="w-40 px-2 py-0.5 border rounded text-[10px]" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Gold:</span>
                      <input type="text" defaultValue="7 games, 2000+ energy" className="w-40 px-2 py-0.5 border rounded text-[10px]" />
                    </div>
                  </div>
                </div>

                {/* MVP Section */}
                <div className="border border-slate-200 rounded-lg p-2">
                  <p className="font-bold text-slate-900 text-xs mb-2">MVP Section</p>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Bronze:</span>
                      <input type="text" defaultValue="Top 25% in section" className="w-40 px-2 py-0.5 border rounded text-[10px]" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Silver:</span>
                      <input type="text" defaultValue="Top 10%, 3 games" className="w-40 px-2 py-0.5 border rounded text-[10px]" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Gold:</span>
                      <input type="text" defaultValue="#1 in section, 5 games" className="w-40 px-2 py-0.5 border rounded text-[10px]" />
                    </div>
                  </div>
                </div>

                {/* Top Fan */}
                <div className="border border-slate-200 rounded-lg p-2">
                  <p className="font-bold text-slate-900 text-xs mb-2">Top Fan</p>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Bronze:</span>
                      <input type="text" defaultValue="5,000 total energy" className="w-40 px-2 py-0.5 border rounded text-[10px]" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Silver:</span>
                      <input type="text" defaultValue="15,000 total energy" className="w-40 px-2 py-0.5 border rounded text-[10px]" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Gold:</span>
                      <input type="text" defaultValue="30,000 total energy" className="w-40 px-2 py-0.5 border rounded text-[10px]" />
                    </div>
                  </div>
                </div>

                {/* Cheer Master */}
                <div className="border border-slate-200 rounded-lg p-2">
                  <p className="font-bold text-slate-900 text-xs mb-2">Cheer Master</p>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Bronze:</span>
                      <input type="text" defaultValue="25 successful chants" className="w-40 px-2 py-0.5 border rounded text-[10px]" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Silver:</span>
                      <input type="text" defaultValue="75 successful chants" className="w-40 px-2 py-0.5 border rounded text-[10px]" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Gold:</span>
                      <input type="text" defaultValue="150 successful chants" className="w-40 px-2 py-0.5 border rounded text-[10px]" />
                    </div>
                  </div>
                </div>
              </div>
              <button className="mt-3 w-full py-2 rounded-lg font-bold text-white text-xs shadow-md" style={{ backgroundColor: themeData.primaryColor }}>
                Save Badge Config
              </button>
            </div>

            {/* Default Fan Settings */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-3">
              <h2 className="text-sm font-black text-slate-900 mb-3">⚙️ Default Fan Settings</h2>
              <div className="space-y-2">
                {[
                  { name: 'LED Light Effects', default: true },
                  { name: 'Vibration Alerts', default: true },
                  { name: 'Sound Effects', default: false },
                  { name: 'Game Updates', default: true },
                  { name: 'Reward Alerts', default: true },
                  { name: 'Challenge Reminders', default: false },
                  { name: 'Analytics Sharing', default: true },
                  { name: 'Location Services', default: true },
                  { name: 'Camera Access', default: false },
                ].map((setting, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-700">{setting.name}</span>
                    <button className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                      setting.default ? 'bg-green-500' : 'bg-slate-300'
                    }`}>
                      <span className={`${
                        setting.default ? 'translate-x-5' : 'translate-x-1'
                      } inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                    </button>
                  </div>
                ))}
              </div>
              <button className="mt-3 w-full py-2 rounded-lg font-bold text-white text-xs shadow-md" style={{ backgroundColor: themeData.primaryColor }}>
                Update Defaults
              </button>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-3">
              <h2 className="text-sm font-black text-slate-900 mb-3">👤 Account</h2>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input type="text" defaultValue="Admin User" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input type="email" defaultValue="admin@commanders.com" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
                </div>
              </div>
              <button className="mt-3 w-full py-2 rounded-lg font-bold text-white text-xs shadow-md" style={{ backgroundColor: themeData.primaryColor }}>
                Save Changes
              </button>
            </div>

            {/* System Config */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="text-sm font-black text-slate-900 mb-3">🔧 System</h2>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-2">API Key</p>
                  <div className="flex gap-2">
                    <input type="text" value="brmz_live_abc123xyz789" readOnly className="flex-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-mono" />
                    <button className="px-2 py-1 bg-slate-700 text-white rounded text-[10px] font-semibold">Copy</button>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-xs font-bold text-slate-700 mb-2">Data Export</p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-2 py-2 bg-slate-100 rounded text-[10px] font-semibold">📥 Export CSV</button>
                    <button className="flex-1 px-2 py-2 bg-slate-100 rounded text-[10px] font-semibold">📦 Backup</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Navigation for Admin */}
      <div 
          className="absolute bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm rounded-b-[3rem] border-t border-slate-200 px-6 py-3"
          style={{ paddingBottom: isStandalone ? 'calc(env(safe-area-inset-bottom) + 12px)' : '12px' }}
        >
        <div className="flex items-center justify-around">
          <button 
            onClick={() => setCurrentPage('analytics')}
            className="flex flex-col items-center gap-0.5" 
            style={{ color: currentPage === 'analytics' ? themeData.primaryColor : '#94a3b8' }}
          >
            <BarChart3 className="w-6 h-6" strokeWidth={currentPage === 'analytics' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Analytics</span>
          </button>
          <button 
            onClick={() => setCurrentPage('controls')}
            className="flex flex-col items-center gap-0.5" 
            style={{ color: currentPage === 'controls' ? themeData.primaryColor : '#94a3b8' }}
          >
            <Gamepad2 className="w-6 h-6" strokeWidth={currentPage === 'controls' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Controls</span>
          </button>
          <button 
            onClick={() => setCurrentPage('settings')}
            className="flex flex-col items-center gap-0.5" 
            style={{ color: currentPage === 'settings' ? themeData.primaryColor : '#94a3b8' }}
          >
            <SettingsIcon className="w-6 h-6" strokeWidth={currentPage === 'settings' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Settings</span>
          </button>
        </div>
      </div>

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

        /* Hide scrollbar but keep functionality */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Swipe indicator animation */
        @keyframes bounce-x {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(4px);
          }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }

        /* Slow pulse for live challenges */
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.95;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}