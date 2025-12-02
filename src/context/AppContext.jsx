import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // ============================================
  // TEAM & GAME INFORMATION (Admin Controlled)
  // ============================================
  const [themeData, setThemeData] = useState({
    teamName: "Baltimore Ravens",
    opponent: "Washington Commanders",
    gameDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    gameTime: "1:00 PM EST",
    stadium: "M&T Bank Stadium",
    capacity: 71008,
    primaryColor: "#241773",
    secondaryColor: "#9E7C0C",
    teamLogo: "shield",
    slides: [
      { type: "game", title: "GAME DAY", subtitle: "ENERGY", image: "/images/Promo1.jpg" },
      { type: "promo", title: "FLOCK FRIENDLY", subtitle: "FARE", image: "/images/Promo2.jpg" },
      { type: "sponsor", title: "FAN OF THE", subtitle: "YEAR", image: "/images/Promo3.JPG" }
    ]
  });

  // ============================================
  // CONNECTION STATE
  // ============================================
  const [isConnected, setIsConnected] = useState(false);
  const [currentMainView, setCurrentMainView] = useState('fan');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // ============================================
  // NOTIFICATIONS (Energy Tracker Feed)
  // ============================================
  const [notifications, setNotifications] = useState([]);

  // ============================================
  // SIMULATION STATE
  // ============================================
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationHistory, setSimulationHistory] = useState([]);
  const simulationInterval = useRef(null);

  // ============================================
  // LIVE GAME DATA (Admin Dashboard Analytics)
  // ============================================
  const [gameData, setGameData] = useState({
    quarter: 'Q4',
    timeRemaining: '4:32',
    isLive: true,
    totalActiveFans: 14847,
    activeFansSSL: 12347,
    activeFansNonSSL: 2500,
    averageEnergy: 1847,
    averageEnergySSL: 1950,
    averageEnergyNonSSL: 1420,
    engagementRate: 76,
    engagementSSL: 82,
    engagementNonSSL: 45,
    totalTokens: 4200000,
    tokensSSL: 3800000,
    tokensNonSSL: 400000
  });

  // ============================================
  // ACTIVE CHALLENGES (Admin Controlled)
  // ============================================
  const [activeChallenges, setActiveChallenges] = useState([]);

  // ============================================
  // REWARDS CATALOG (Admin Controlled)
  // ============================================
  const [rewardsCatalog, setRewardsCatalog] = useState([
    {
      id: 'reward-1',
      name: 'Free Hot Dog',
      description: 'Redeem at any concession stand',
      tokens: 500,
      claimed: 1245,
      available: true,
      category: 'food'
    },
    {
      id: 'reward-2',
      name: '50% Off Merch',
      description: 'Valid on any team merchandise',
      tokens: 1000,
      claimed: 456,
      available: true,
      category: 'merchandise'
    },
    {
      id: 'reward-3',
      name: 'Free Drink',
      description: 'Any size, any beverage',
      tokens: 300,
      claimed: 892,
      available: true,
      category: 'food'
    }
  ]);

  // ============================================
  // BADGE REQUIREMENTS (Admin Controlled)
  // ============================================
  const [badgeRequirements, setBadgeRequirements] = useState({
    streakMaster: {
      bronze: { games: 3, minEnergy: 1000, description: '3 games, 1000+ energy' },
      silver: { games: 5, minEnergy: 1500, description: '5 games, 1500+ energy' },
      gold: { games: 7, minEnergy: 2000, description: '7 games, 2000+ energy' }
    },
    mvpSection: {
      bronze: { description: 'Top 25% in section' },
      silver: { description: 'Top 10%, 3 games' },
      gold: { description: '#1 in section, 5 games' }
    },
    topFan: {
      bronze: { totalEnergy: 5000, description: '5,000 total energy' },
      silver: { totalEnergy: 15000, description: '15,000 total energy' },
      gold: { totalEnergy: 30000, description: '30,000 total energy' }
    },
    cheerMaster: {
      bronze: { chants: 25, description: '25 successful chants' },
      silver: { chants: 75, description: '75 successful chants' },
      gold: { chants: 150, description: '150 successful chants' }
    }
  });

  // ============================================
  // FAN PERSONAL DATA (Simulated for Testing)
  // ============================================
const [fanData, setFanData] = useState({
    energy: 0,
    tokens: 0,
    tokensSpent: 0,
    badges: {
      streakMaster: 'locked',
      mvpSection: 'locked',
      topFan: 'locked',
      cheerMaster: 'locked'
    },
    badgeProgress: {
      streakMaster: 0,
      mvpSection: 0,
      topFan: 0,
      cheerMaster: 0
    },
    seasonStats: {
      gamesAttended: 0,
      avgEnergyScore: 0,
      totalTokens: 0,
      totalBadges: 0
    },
    pastPerformances: [],
    milestone: {
      current: 0,
      target: 2000,
      reward: 'Game Day Prize'
    }
  });

  // ============================================
  // FAN SETTINGS (Defaults from Admin)
  // ============================================
  const [fanSettings, setFanSettings] = useState({
    led: true,
    vibration: true,
    sound: false,
    gameUpdates: true,
    rewards: true,
    challenges: false,
    analytics: true,
    location: true,
    camera: false
  });

  // ============================================
  // NOTIFICATION HELPERS
  // ============================================
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50
  };

  // ============================================
  // SIMULATION HELPER FUNCTIONS
  // ============================================

  // Get data ranges based on fan type
  const getFanTypeRanges = (fanType) => {
    const ranges = {
      'super': {
        energy: { min: 2000, max: 2400 },
        tokens: { min: 400, max: 600 },
        challengeSuccess: { min: 85, max: 95 },
        badgeProgress: { min: 15, max: 25 }
      },
      'engaged': {
        energy: { min: 1400, max: 1800 },
        tokens: { min: 250, max: 400 },
        challengeSuccess: { min: 70, max: 85 },
        badgeProgress: { min: 8, max: 15 }
      },
      'casual': {
        energy: { min: 1000, max: 1400 },
        tokens: { min: 150, max: 280 },
        challengeSuccess: { min: 55, max: 70 },
        badgeProgress: { min: 3, max: 10 }
      },
      'distracted': {
        energy: { min: 600, max: 1000 },
        tokens: { min: 80, max: 180 },
        challengeSuccess: { min: 35, max: 55 },
        badgeProgress: { min: 1, max: 5 }
      }
    };
    return ranges[fanType] || ranges.casual;
  };

  // Get data ranges based on crowd level
  const getCrowdLevelRanges = (crowdLevel) => {
    const ranges = {
      'electric': {
        totalFans: { min: 14000, max: 15000 },
        avgEnergy: { min: 1900, max: 2200 },
        engagement: { min: 88, max: 95 },
        attendance: { min: 92, max: 98 },
        challengeParticipants: { min: 9000, max: 12000 }
      },
      'energized': {
        totalFans: { min: 11000, max: 13500 },
        avgEnergy: { min: 1400, max: 1800 },
        engagement: { min: 68, max: 82 },
        attendance: { min: 75, max: 88 },
        challengeParticipants: { min: 6000, max: 9000 }
      },
      'average': {
        totalFans: { min: 8000, max: 11000 },
        avgEnergy: { min: 1000, max: 1400 },
        engagement: { min: 50, max: 68 },
        attendance: { min: 60, max: 75 },
        challengeParticipants: { min: 4000, max: 6000 }
      },
      'quiet': {
        totalFans: { min: 6000, max: 9000 },
        avgEnergy: { min: 700, max: 1000 },
        engagement: { min: 35, max: 50 },
        attendance: { min: 40, max: 60 },
        challengeParticipants: { min: 2000, max: 4000 }
      }
    };
    return ranges[crowdLevel] || ranges.average;
  };

  // Random number within range
  const randomInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Challenge templates
  const challengeTemplates = [
    { name: 'Clap for 30 Seconds', emoji: '👏', tokenReward: 50 },
    { name: 'Start the Wave', emoji: '🌊', tokenReward: 100 },
    { name: 'Loudest Cheer Contest', emoji: '📢', tokenReward: 75 },
    { name: 'Team Chant Challenge', emoji: '🎵', tokenReward: 60 },
    { name: 'Stand and Cheer', emoji: '🙌', tokenReward: 40 },
    { name: 'Fist Pump Challenge', emoji: '✊', tokenReward: 45 }
  ];

  // Determine badge tier based on energy
  const determineBadgeTier = (energy, fanType) => {
    if (fanType === 'super') {
      if (energy >= 2200) return 'gold';
      if (energy >= 2000) return 'silver';
      return 'bronze';
    } else if (fanType === 'engaged') {
      if (energy >= 1700) return 'gold';
      if (energy >= 1500) return 'silver';
      if (energy >= 1400) return 'bronze';
      return 'locked';
    } else if (fanType === 'casual') {
      if (energy >= 1300) return 'silver';
      if (energy >= 1100) return 'bronze';
      return 'locked';
    } else {
      if (energy >= 900) return 'bronze';
      return 'locked';
    }
  };

  // ============================================
  // START SIMULATION
  // ============================================
  const startSimulation = (config) => {
    const { fanType, crowdLevel, duration } = config;
    
    const fanRanges = getFanTypeRanges(fanType);
    const crowdRanges = getCrowdLevelRanges(crowdLevel);

    // Calculate target values
    const targetFanEnergy = randomInRange(fanRanges.energy.min, fanRanges.energy.max);
    const targetFanTokens = randomInRange(fanRanges.tokens.min, fanRanges.tokens.max);
    const targetCrowdFans = randomInRange(crowdRanges.totalFans.min, crowdRanges.totalFans.max);
    const targetAvgEnergy = randomInRange(crowdRanges.avgEnergy.min, crowdRanges.avgEnergy.max);
    const targetEngagement = randomInRange(crowdRanges.engagement.min, crowdRanges.engagement.max);

    // Store starting values
    const startingFanEnergy = fanData.energy;
    const startingFanTokens = fanData.tokens;

    setIsSimulating(true);
    setSimulationProgress(0);

    // Clear previous notifications
    setNotifications([]);
    
    // Welcome notification
    addNotification({
      type: 'system',
      icon: '🎮',
      title: 'Simulation Started!',
      message: 'Game day experience active'
    });

    // INSTANT MODE
    if (duration === 'instant') {
      // Create challenges
      const numChallenges = randomInRange(2, 4);
      const selectedChallenges = challengeTemplates
        .sort(() => Math.random() - 0.5)
        .slice(0, numChallenges)
        .map((template, idx) => ({
          id: `sim-challenge-${Date.now()}-${idx}`,
          name: template.name,
          description: `Complete this challenge to earn ${template.tokenReward} tokens!`,
          status: 'active',
          participants: randomInRange(crowdRanges.challengeParticipants.min, crowdRanges.challengeParticipants.max),
          tokenReward: template.tokenReward,
          startTime: Date.now(),
          duration: 180000,
          emoji: template.emoji
        }));

      setActiveChallenges(prev => [...selectedChallenges]);

      // Determine badges earned
      const badgeTier = determineBadgeTier(targetFanEnergy, fanType);
      const badges = {
        streakMaster: badgeTier,
        mvpSection: badgeTier === 'gold' ? 'silver' : (badgeTier === 'silver' ? 'bronze' : 'locked'),
        topFan: badgeTier === 'gold' || badgeTier === 'silver' ? 'bronze' : 'locked',
        cheerMaster: 'locked'
      };

      // Update fan data
      setFanData(prev => ({
        ...prev,
        energy: targetFanEnergy,
        tokens: targetFanTokens,
        badges: badges,
        milestone: {
          ...prev.milestone,
          current: targetFanEnergy
        },
        seasonStats: {
          gamesAttended: prev.seasonStats.gamesAttended + 1,
          avgEnergyScore: Math.round((prev.seasonStats.avgEnergyScore * prev.seasonStats.gamesAttended + targetFanEnergy) / (prev.seasonStats.gamesAttended + 1)),
          totalTokens: prev.seasonStats.totalTokens + targetFanTokens,
          totalBadges: Object.values(badges).filter(b => b !== 'locked').length
        },
        pastPerformances: [
          {
            opponent: themeData.opponent,
            date: new Date().toLocaleDateString(),
            energy: targetFanEnergy,
            tokens: targetFanTokens,
            badges: Object.entries(badges)
              .filter(([_, tier]) => tier !== 'locked')
              .map(([name, tier]) => `${name}-${tier}`)
          },
          ...prev.pastPerformances
        ]
      }));

      // Update game data
      setGameData(prev => ({
        ...prev,
        totalActiveFans: targetCrowdFans,
        averageEnergy: targetAvgEnergy,
        engagementRate: targetEngagement,
        totalTokens: prev.totalTokens + targetFanTokens * targetCrowdFans
      }));

      // Add final notifications
      selectedChallenges.forEach(challenge => {
        addNotification({
          type: 'challenge',
          icon: challenge.emoji,
          title: 'Challenge Active!',
          message: challenge.name
        });
      });

      addNotification({
        type: 'tokens',
        icon: '💰',
        title: `+${targetFanTokens} Tokens Earned!`,
        message: 'Keep bringing the energy!'
      });

      if (badges.streakMaster !== 'locked') {
        addNotification({
          type: 'badge',
          icon: '🏆',
          title: 'Badge Unlocked!',
          message: `Streak Master ${badges.streakMaster.toUpperCase()}`
        });
      }

      // Save to history
      const event = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        fanType,
        crowdLevel,
        duration: 'Instant',
        finalStats: {
          fanEnergy: targetFanEnergy,
          fanTokens: targetFanTokens,
          crowdFans: targetCrowdFans,
          avgEnergy: targetAvgEnergy,
          engagement: targetEngagement
        }
      };
      setSimulationHistory(prev => [event, ...prev]);

      setIsSimulating(false);
      setSimulationProgress(100);
      
      setTimeout(() => setSimulationProgress(0), 2000);
      return;
    }

    // TIMED MODE - Animate over duration
    const durationMs = duration === '2min' ? 120000 : 300000;
    const updateInterval = 3000; // Update every 3 seconds
    const totalUpdates = durationMs / updateInterval;
    let currentUpdate = 0;

    // Create challenges at start
    const numChallenges = randomInRange(2, 4);
    const selectedChallenges = challengeTemplates
      .sort(() => Math.random() - 0.5)
      .slice(0, numChallenges)
      .map((template, idx) => ({
        id: `sim-challenge-${Date.now()}-${idx}`,
        name: template.name,
        description: `Complete this challenge to earn ${template.tokenReward} tokens!`,
        status: 'active',
        participants: 0,
        tokenReward: template.tokenReward,
        startTime: Date.now(),
        duration: 180000,
        emoji: template.emoji
      }));

    setActiveChallenges(prev => [...selectedChallenges]);

    // Announce challenges
    selectedChallenges.forEach((challenge, idx) => {
      setTimeout(() => {
        addNotification({
          type: 'challenge',
          icon: challenge.emoji,
          title: 'New Challenge!',
          message: challenge.name
        });
      }, idx * 1000);
    });

    simulationInterval.current = setInterval(() => {
      currentUpdate++;
      const progress = (currentUpdate / totalUpdates) * 100;
      setSimulationProgress(progress);

      // Calculate incremental values
      const fanEnergyIncrement = (targetFanEnergy - startingFanEnergy) / totalUpdates;
      const fanTokensIncrement = (targetFanTokens - startingFanTokens) / totalUpdates;

      // Random event notifications
      const eventRoll = Math.random();
      if (eventRoll < 0.3) {
        const events = [
          { icon: '⚡', title: 'Energy Boost!', message: `+${randomInRange(25, 75)} points earned` },
          { icon: '👏', title: 'Great Cheering!', message: 'Section energy rising!' },
          { icon: '🎯', title: 'Challenge Progress!', message: `${randomInRange(60, 95)}% complete` },
          { icon: '🔥', title: 'Hot Streak!', message: 'Keep it up!' },
          { icon: '💪', title: 'Fan Power!', message: 'Stadium is electric!' }
        ];
        const event = events[Math.floor(Math.random() * events.length)];
        addNotification({
          type: 'energy',
          icon: event.icon,
          title: event.title,
          message: event.message
        });
      }

      // Token awards
      if (currentUpdate % 3 === 0) {
        const tokenAmount = randomInRange(10, 30);
        addNotification({
          type: 'tokens',
          icon: '💰',
          title: `+${tokenAmount} Tokens!`,
          message: 'Energy converted to rewards'
        });
      }

      // Update fan data incrementally
      setFanData(prev => {
        const newEnergy = Math.round(prev.energy + fanEnergyIncrement + randomInRange(-20, 30));
        const newTokens = Math.round(prev.tokens + fanTokensIncrement + randomInRange(-2, 5));
        
        return {
          ...prev,
          energy: newEnergy,
          tokens: newTokens,
          milestone: {
            ...prev.milestone,
            current: newEnergy
          }
        };
      });

      // Update game data incrementally
      setGameData(prev => ({
        ...prev,
        totalActiveFans: Math.round(prev.totalActiveFans + randomInRange(-100, 200)),
        averageEnergy: Math.round(prev.averageEnergy + randomInRange(-20, 40)),
        engagementRate: Math.min(100, Math.max(0, prev.engagementRate + randomInRange(-2, 3)))
      }));

      // Update challenge participants
      setActiveChallenges(prev => 
        prev.map(challenge => ({
          ...challenge,
          participants: Math.max(0, challenge.participants + randomInRange(50, 200))
        }))
      );

      // Badge unlock notifications (mid-simulation)
      if (currentUpdate === Math.floor(totalUpdates / 2)) {
        const badgeTier = determineBadgeTier(targetFanEnergy, fanType);
        if (badgeTier !== 'locked') {
          addNotification({
            type: 'badge',
            icon: '🏆',
            title: 'Badge Progress!',
            message: `Streak Master ${badgeTier} almost unlocked!`
          });
        }
      }

      // When complete
      if (currentUpdate >= totalUpdates) {
        clearInterval(simulationInterval.current);
        
        // Determine final badges
        const badgeTier = determineBadgeTier(targetFanEnergy, fanType);
        const badges = {
          streakMaster: badgeTier,
          mvpSection: badgeTier === 'gold' ? 'silver' : (badgeTier === 'silver' ? 'bronze' : 'locked'),
          topFan: badgeTier === 'gold' || badgeTier === 'silver' ? 'bronze' : 'locked',
          cheerMaster: 'locked'
        };

        // Final badge notifications
        Object.entries(badges).forEach(([name, tier]) => {
          if (tier !== 'locked') {
            addNotification({
              type: 'badge',
              icon: '🏆',
              title: 'Badge Unlocked!',
              message: `${name.replace(/([A-Z])/g, ' $1').trim()} ${tier.toUpperCase()}`
            });
          }
        });

        // Update final fan data
        setFanData(prev => ({
          ...prev,
          energy: targetFanEnergy,
          tokens: targetFanTokens,
          badges: badges,
          seasonStats: {
            gamesAttended: prev.seasonStats.gamesAttended + 1,
            avgEnergyScore: Math.round((prev.seasonStats.avgEnergyScore * prev.seasonStats.gamesAttended + targetFanEnergy) / (prev.seasonStats.gamesAttended + 1)),
            totalTokens: prev.seasonStats.totalTokens + targetFanTokens,
            totalBadges: Object.values(badges).filter(b => b !== 'locked').length
          },
          pastPerformances: [
            {
              opponent: themeData.opponent,
              date: new Date().toLocaleDateString(),
              energy: targetFanEnergy,
              tokens: targetFanTokens,
              badges: Object.entries(badges)
                .filter(([_, tier]) => tier !== 'locked')
                .map(([name, tier]) => `${name}-${tier}`)
            },
            ...prev.pastPerformances
          ]
        }));

        // Final notification
        addNotification({
          type: 'system',
          icon: '🎉',
          title: 'Simulation Complete!',
          message: `Final Score: ${targetFanEnergy.toLocaleString()} energy, ${targetFanTokens} tokens`
        });

        // Save to history
        const event = {
          id: Date.now(),
          timestamp: new Date().toLocaleString(),
          fanType,
          crowdLevel,
          duration: duration === '2min' ? '2 Minutes' : '5 Minutes',
          finalStats: {
            fanEnergy: targetFanEnergy,
            fanTokens: targetFanTokens,
            crowdFans: targetCrowdFans,
            avgEnergy: targetAvgEnergy,
            engagement: targetEngagement
          }
        };
        setSimulationHistory(prev => [event, ...prev]);

        setIsSimulating(false);
        setTimeout(() => setSimulationProgress(0), 2000);
      }
    }, updateInterval);
  };

  // ============================================
  // STOP SIMULATION
  // ============================================
  const stopSimulation = () => {
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
    }
    setIsSimulating(false);
    setSimulationProgress(0);
    
    addNotification({
      type: 'system',
      icon: '⛔',
      title: 'Simulation Stopped',
      message: 'Manually ended by user'
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    };
  }, []);

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  
  const updateThemeData = (updates) => {
    setThemeData(prev => ({ ...prev, ...updates }));
  };

  const updateGameData = (updates) => {
    setGameData(prev => ({ ...prev, ...updates }));
  };

  const addChallenge = (challenge) => {
    const newChallenge = {
      id: `challenge-${Date.now()}`,
      status: 'active',
      participants: 0,
      startTime: Date.now(),
      ...challenge
    };
    setActiveChallenges(prev => [...prev, newChallenge]);
    
    // Send notification to fans
    addNotification({
      type: 'challenge',
      icon: '⚡',
      title: 'New Challenge!',
      message: challenge.name
    });
  };

  const endChallenge = (challengeId) => {
    setActiveChallenges(prev => 
      prev.map(c => c.id === challengeId ? { ...c, status: 'ended' } : c)
    );
    
    const challenge = activeChallenges.find(c => c.id === challengeId);
    if (challenge) {
      addNotification({
        type: 'challenge',
        icon: '✅',
        title: 'Challenge Complete!',
        message: `${challenge.name} has ended`
      });
    }
  };

  const sendPushNotification = (message, target = 'all') => {
    addNotification({
      type: 'push',
      icon: '📱',
      title: 'Stadium Alert',
      message: message
    });
  };

  const addReward = (reward) => {
    const newReward = {
      id: `reward-${Date.now()}`,
      claimed: 0,
      available: true,
      ...reward
    };
    setRewardsCatalog(prev => [...prev, newReward]);
  };

  const updateReward = (rewardId, updates) => {
    setRewardsCatalog(prev =>
      prev.map(r => r.id === rewardId ? { ...r, ...updates } : r)
    );
  };

  const removeReward = (rewardId) => {
    setRewardsCatalog(prev => prev.filter(r => r.id !== rewardId));
  };

  const updateBadgeRequirements = (badge, tier, updates) => {
    setBadgeRequirements(prev => ({
      ...prev,
      [badge]: {
        ...prev[badge],
        [tier]: { ...prev[badge][tier], ...updates }
      }
    }));
  };

  const updateFanData = (updates) => {
    setFanData(prev => ({ ...prev, ...updates }));
  };

  const toggleFanSetting = (setting) => {
    setFanSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  // ============================================
  // CONTEXT VALUE
  // ============================================
  const value = {
    // Theme & Game Info
    themeData,
    setThemeData,
    updateThemeData,
    
    // Connection & View
    isConnected,
    setIsConnected,
    currentMainView,
    setCurrentMainView,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    
    // Notifications
    notifications,
    addNotification,
    sendPushNotification,
    
    // Game Data
    gameData,
    setGameData,
    updateGameData,
    
    // Challenges
    activeChallenges,
    setActiveChallenges,
    addChallenge,
    endChallenge,
    
    // Rewards
    rewardsCatalog,
    setRewardsCatalog,
    addReward,
    updateReward,
    removeReward,
    
    // Badges
    badgeRequirements,
    setBadgeRequirements,
    updateBadgeRequirements,
    
    // Fan Data
    fanData,
    setFanData,
    updateFanData,
    
    // Fan Settings
    fanSettings,
    setFanSettings,
    toggleFanSetting,

    // Simulation
    isSimulating,
    simulationProgress,
    simulationHistory,
    startSimulation,
    stopSimulation
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};