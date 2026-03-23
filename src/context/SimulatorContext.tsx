import React, { createContext, useContext, useRef, useState } from 'react';
import type {
  SimState, SimScreen, SimFeedItem, SimChallenge,
  FanType, CrowdLevel, SimDuration, SimReward,
} from '../types';

// ── Demo data ──────────────────────────────────────────────────────────────

const DEMO_REWARDS: SimReward[] = [
  { id: '1', name: '20% Off Concessions', description: 'Valid at any concession stand tonight.', token_cost: 50,  reward_type: 'food',    expires_at: null },
  { id: '2', name: 'Team Cap',            description: 'Claim at the merchandise booth, Section B.', token_cost: 150, reward_type: 'merch',   expires_at: null },
  { id: '3', name: 'VIP Club Access',     description: 'One-time access to the premium club level.', token_cost: 300, reward_type: 'ticket',  expires_at: null },
  { id: '4', name: 'Signed Jersey',       description: 'Autographed player jersey. Limited stock.', token_cost: 500, reward_type: 'merch',   expires_at: null },
];

const DEMO_CHALLENGES: SimChallenge[] = [
  { id: 'c1', name: 'MAKE SOME NOISE',  description: 'Get loud for the home team!',   reward_type: 'multiplier', reward_value: 2, duration_seconds: 45, elapsed: 0, participant_count: 4821 },
  { id: 'c2', name: 'WAVE CHECK',       description: 'Start the wave in your section!', reward_type: 'bonus_pts',  reward_value: 75, duration_seconds: 30, elapsed: 0, participant_count: 3294 },
  { id: 'c3', name: 'CLAP IT OUT',      description: 'Clap to the beat!',              reward_type: 'multiplier', reward_value: 2, duration_seconds: 60, elapsed: 0, participant_count: 5102 },
];

const ENERGY_RATES: Record<FanType, number> = {
  super: 28, engaged: 18, casual: 10, distracted: 4,
};
const CROWD_MULTI: Record<CrowdLevel, number> = {
  electric: 1.4, energized: 1.0, average: 0.7, quiet: 0.4,
};
const DURATION_MS: Record<SimDuration, number> = {
  instant: 0, '1min': 60_000, '3min': 180_000,
};

// ── Context ────────────────────────────────────────────────────────────────

interface SimCtx {
  state: SimState;
  rewards: SimReward[];
  connect: () => void;
  disconnect: () => void;
  setScreen: (s: SimScreen) => void;
  startSimulation: (opts: { fanType: FanType; crowdLevel: CrowdLevel; duration: SimDuration }) => void;
  stopSimulation: () => void;
  redeemReward: (reward: SimReward) => void;
}

const SimulatorContext = createContext<SimCtx | null>(null);

const INITIAL: SimState = {
  connected: false,
  screen: 'connect',
  energyScore: 0,
  tokensEarned: 0,
  energySpent: 0,
  challenge: null,
  feed: [],
  isSimulating: false,
  simulationProgress: 0,
  fanType: 'engaged',
  crowdLevel: 'energized',
};

export function SimulatorProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SimState>(INITIAL);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const challengeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function connect() {
    const startFeed: SimFeedItem = {
      id: `f${Date.now()}`,
      type: 'session_started',
      title: 'Session started — Ravens vs Chiefs, M&T Bank Stadium',
      ts: Date.now(),
    };
    setState(s => ({
      ...s,
      connected: true,
      screen: 'energy',
      feed: [startFeed],
    }));
  }

  function disconnect() {
    stopSimulation();
    setState(INITIAL);
  }

  function setScreen(screen: SimScreen) {
    setState(s => ({ ...s, screen }));
  }

  function addFeedItem(item: Omit<SimFeedItem, 'id' | 'ts'>) {
    const full: SimFeedItem = { ...item, id: `f${Date.now()}_${Math.random()}`, ts: Date.now() };
    setState(s => ({ ...s, feed: [full, ...s.feed].slice(0, 40) }));
  }

  function startSimulation(opts: { fanType: FanType; crowdLevel: CrowdLevel; duration: SimDuration }) {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const totalMs = DURATION_MS[opts.duration];
    const tickMs  = totalMs === 0 ? 50 : 1000;
    const ticks   = totalMs === 0 ? 180 : totalMs / tickMs; // instant = compress 180 ticks
    const baseRate = ENERGY_RATES[opts.fanType] * CROWD_MULTI[opts.crowdLevel];

    setState(s => ({
      ...s,
      isSimulating: true,
      simulationProgress: 0,
      fanType: opts.fanType,
      crowdLevel: opts.crowdLevel,
    }));

    let tick = 0;
    let challengeActive = false;

    intervalRef.current = setInterval(() => {
      tick++;
      const progress = Math.min((tick / ticks) * 100, 100);

      // Occasionally trigger a challenge
      if (!challengeActive && tick % 30 === 0) {
        challengeActive = true;
        const c = { ...DEMO_CHALLENGES[Math.floor(Math.random() * DEMO_CHALLENGES.length)], elapsed: 0 };
        setState(s => ({ ...s, challenge: c }));
        addFeedItem({ type: 'challenge_complete', title: `Challenge: ${c.name}`, points: c.reward_value, subtitle: c.description });
        challengeRef.current = setTimeout(() => {
          setState(s => ({ ...s, challenge: null }));
          challengeActive = false;
        }, c.duration_seconds * (totalMs === 0 ? 200 : 1000));
      }

      const pts = Math.floor(baseRate * (0.7 + Math.random() * 0.6));
      const tokens = Math.floor(pts / 10);

      setState(s => {
        const newScore  = s.energyScore + pts;
        const newTokens = s.tokensEarned + tokens;

        if (progress % 20 < 1.5) {
          addFeedItem({ type: 'energy_drop', title: `Energy burst: +${pts} pts`, points: pts });
        }

        return {
          ...s,
          energyScore:      newScore,
          tokensEarned:     newTokens,
          simulationProgress: progress,
        };
      });

      if (tick >= ticks) {
        stopSimulation();
        addFeedItem({ type: 'admin_message', title: 'Simulation complete. Great game tonight!', admin_name: 'Brimz HQ' });
      }
    }, tickMs);
  }

  function stopSimulation() {
    if (intervalRef.current)  clearInterval(intervalRef.current);
    if (challengeRef.current) clearTimeout(challengeRef.current);
    setState(s => ({ ...s, isSimulating: false, simulationProgress: 0, challenge: null }));
  }

  function redeemReward(reward: SimReward) {
    setState(s => ({
      ...s,
      tokensEarned: s.tokensEarned, // total earned never decreases
      energySpent:  s.energySpent + reward.token_cost,
    }));
    addFeedItem({ type: 'reward_unlocked', title: `Reward redeemed: ${reward.name}`, points: -reward.token_cost });
  }

  return (
    <SimulatorContext.Provider value={{ state, rewards: DEMO_REWARDS, connect, disconnect, setScreen, startSimulation, stopSimulation, redeemReward }}>
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSim() {
  const ctx = useContext(SimulatorContext);
  if (!ctx) throw new Error('useSim must be inside SimulatorProvider');
  return ctx;
}
