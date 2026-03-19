import { useEffect, useRef, useState } from 'react';
import { useSim } from '../../../context/SimulatorContext';
import { BRAND, COLORS } from '../../../constants';

const PUMP_WORDS = [
  'GET LOUD!', 'CLAP!', 'STAND UP!', "LET'S GO!",
  'MAKE NOISE!', 'WAVE!', 'WE GOT YOU!', "DON'T STOP!",
  'FEEL IT!', "THAT'S IT!", 'KEEP GOING!', 'YOU GOT THIS!',
];

const PRIZE_GOAL = 5000;

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function EnergyScreen() {
  const { state, setScreen } = useSim();
  const { energyScore, tokensEarned, energySpent, challenge, feed } = state;

  const [pumpIdx, setPumpIdx] = useState(0);
  const [pumpVisible, setPumpVisible] = useState(true);
  const pumpRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const available     = tokensEarned - energySpent;
  const prizeProgress = Math.min(energyScore / PRIZE_GOAL, 1);
  const prizeUnlocked = energyScore >= PRIZE_GOAL;

  useEffect(() => {
    pumpRef.current = setInterval(() => {
      setPumpVisible(false);
      setTimeout(() => {
        setPumpIdx(i => (i + 1) % PUMP_WORDS.length);
        setPumpVisible(true);
      }, 200);
    }, 1600);
    return () => { if (pumpRef.current) clearInterval(pumpRef.current); };
  }, []);

  const challengeProgress = challenge
    ? Math.min(challenge.elapsed / challenge.duration_seconds, 1)
    : 0;
  const timeLeft = challenge ? Math.max(challenge.duration_seconds - challenge.elapsed, 0) : 0;
  const rewardLabel = challenge
    ? challenge.reward_type === 'multiplier' ? `${challenge.reward_value}X` : `+${challenge.reward_value}`
    : null;
  const rewardSub = challenge
    ? challenge.reward_type === 'multiplier' ? 'PTS MULTIPLIER' : 'BONUS PTS'
    : null;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: COLORS.bg }}>

      {/* Zone 1: Score banner */}
      <button
        onClick={() => setScreen('stats')}
        className="flex items-center gap-2 px-4 py-2.5 shrink-0 border-b"
        style={{ background: COLORS.surface, borderColor: COLORS.border }}
      >
        <div className="flex-1">
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="font-display font-black text-2xl leading-none"
                  style={{ color: prizeUnlocked ? BRAND.gold : BRAND.teal }}>
              {energyScore.toLocaleString()}
            </span>
            <span className="font-mono text-[8px] font-bold tracking-[1.5px]" style={{ color: COLORS.muted }}>
              TODAY'S ENERGY
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1 rounded-sm overflow-hidden mb-1" style={{ background: COLORS.surface2 }}>
            <div className="h-full rounded-sm transition-all duration-500"
                 style={{ width: `${prizeProgress * 100}%`, background: prizeUnlocked ? BRAND.gold : BRAND.teal }} />
          </div>
          <p className="font-mono text-[8px] font-bold" style={{ color: prizeUnlocked ? BRAND.gold : COLORS.muted }}>
            {prizeUnlocked
              ? 'Gameday prize unlocked — show bracelet at concessions'
              : `${(PRIZE_GOAL - energyScore).toLocaleString()} pts from gameday prize · ${PRIZE_GOAL.toLocaleString()} goal`}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <span style={{ color: COLORS.dim, fontSize: 16 }}>›</span>
          <span className="font-mono text-[7px] font-bold tracking-[1px]" style={{ color: COLORS.dim }}>STATS</span>
        </div>
      </button>

      {/* Zone 2: Challenge zone */}
      <div className="relative shrink-0 overflow-hidden"
           style={{
             background: '#000',
             borderBottom: `2px solid ${challenge ? BRAND.teal + '35' : COLORS.border}`,
             borderLeft:   `1px solid ${challenge ? BRAND.teal + '35' : COLORS.border}`,
             borderRight:  `1px solid ${challenge ? BRAND.teal + '35' : COLORS.border}`,
           }}>

        {/* Electric border wires */}
        {challenge && (
          <>
            <div className="wire-track-h" style={{ top: 0 }}>
              <div className="wire-zap-h animate-wire-h" />
            </div>
            <div className="wire-track-h" style={{ bottom: 0 }}>
              <div className="wire-zap-h animate-wire-h-rev" />
            </div>
            <div className="wire-track-v" style={{ left: 0 }}>
              <div className="wire-zap-v animate-wire-v" />
            </div>
            <div className="wire-track-v" style={{ right: 0 }}>
              <div className="wire-zap-v animate-wire-v-rev" />
            </div>
          </>
        )}

        <div className="px-4 py-3 relative z-10">
          {/* Top row: badge + reward */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded"
                 style={{
                   background: challenge ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)',
                   border: `1px solid ${challenge ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.08)'}`,
                 }}>
              {challenge && (
                <div className="w-1.5 h-1.5 rounded-full animate-live-dot" style={{ background: BRAND.red }} />
              )}
              <span className="font-mono text-[9px] font-black tracking-[1.5px]"
                    style={{ color: challenge ? BRAND.red : COLORS.dim }}>
                {challenge ? challenge.name.toUpperCase() : 'NO ACTIVE CHALLENGE'}
              </span>
            </div>
            {challenge && (
              <div className="text-right">
                <div className="font-display font-black text-lg leading-none" style={{ color: BRAND.gold }}>
                  {rewardLabel}
                </div>
                <div className="font-mono text-[8px] font-bold tracking-[1px]" style={{ color: COLORS.muted }}>
                  {rewardSub}
                </div>
              </div>
            )}
          </div>

          {/* Action text */}
          <p className="font-display font-black text-xl leading-tight mb-1"
             style={{ color: challenge ? '#fff' : 'rgba(255,255,255,0.2)' }}>
            {challenge ? challenge.description?.toUpperCase() : 'STANDING BY'}
          </p>

          {/* Pump text or idle sub */}
          {challenge ? (
            <div className="flex items-center justify-center" style={{ height: 56 }}>
              <span
                className="font-display font-black text-[44px] leading-none pump-glitch"
                style={{
                  color: '#fff',
                  opacity: pumpVisible ? 1 : 0,
                  transition: 'opacity 0.2s',
                }}
              >
                {PUMP_WORDS[pumpIdx]}
              </span>
            </div>
          ) : (
            <p className="text-[11px] mb-2" style={{ color: 'rgba(255,255,255,0.35)', lineHeight: '1.5' }}>
              New challenges drop during key game moments. Stay connected and stay loud.
            </p>
          )}

          {/* Timer */}
          <div className="flex justify-center mb-2">
            <span className="font-display font-black leading-none"
                  style={{
                    fontSize: 60,
                    lineHeight: 1,
                    color: challenge ? BRAND.red : COLORS.dim,
                  }}>
              {challenge ? formatTime(timeLeft) : '— : —'}
            </span>
          </div>

          {/* Progress bar + footer */}
          {challenge && (
            <>
              <div className="h-px mb-2 overflow-hidden rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full transition-all duration-1000"
                     style={{ width: `${challengeProgress * 100}%`, background: BRAND.teal }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] font-bold" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {formatTime(challenge.elapsed)} ELAPSED
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND.green }} />
                  <span className="font-display font-black text-sm" style={{ color: BRAND.green }}>
                    {challenge.participant_count.toLocaleString()}
                  </span>
                  <span className="font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}> fans active</span>
                </div>
              </div>
            </>
          )}

          {!challenge && (
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] font-bold" style={{ color: 'rgba(255,255,255,0.25)' }}>
                NEXT CHALLENGE: Q4
              </span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.dim }} />
                <span className="font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>— fans active</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zone 3: Tracker label */}
      <div className="flex items-center gap-2 px-4 py-2.5 shrink-0 border-b"
           style={{ background: COLORS.bg, borderColor: COLORS.border }}>
        <div className="w-0.5 h-3 rounded-sm" style={{ background: COLORS.dim }} />
        <span className="font-mono text-[10px] font-bold tracking-[2px]" style={{ color: COLORS.muted }}>
          ENERGY TRACKER
        </span>
        <div className="ml-auto flex items-center gap-3">
          <span className="font-mono text-[9px] font-bold" style={{ color: BRAND.green }}>
            {available.toLocaleString()} PTS AVL
          </span>
        </div>
      </div>

      {/* Zone 4: Scrollable feed */}
      <div className="flex-1 phone-scroll">
        <div className="py-1.5">
          {feed.length === 0 ? (
            <div className="flex items-center justify-center py-10 px-6">
              <p className="text-xs text-center" style={{ color: COLORS.muted, lineHeight: '1.6' }}>
                Your energy activity will appear here during the game.
              </p>
            </div>
          ) : (
            feed.map(item => <FeedRow key={item.id} item={item} />)
          )}
        </div>
      </div>
    </div>
  );
}

function FeedRow({ item }: { item: ReturnType<typeof useSim>['state']['feed'][0] }) {
  const stripe =
    item.type === 'energy_drop'        ? BRAND.teal  :
    item.type === 'challenge_complete' ? BRAND.gold  :
    item.type === 'reward_unlocked'    ? BRAND.green :
    item.type === 'session_started'    ? BRAND.teal  : COLORS.dim;

  const label =
    item.type === 'energy_drop'        ? 'ENERGY DROP'        :
    item.type === 'challenge_complete' ? 'CHALLENGE COMPLETE' :
    item.type === 'challenge_missed'   ? 'CHALLENGE MISSED'   :
    item.type === 'reward_unlocked'    ? 'REWARD UNLOCKED'    :
    item.type === 'session_started'    ? 'SESSION STARTED'    : '';

  const ago = (() => {
    const diff = Math.floor((Date.now() - item.ts) / 60000);
    if (diff < 1)  return 'JUST NOW';
    if (diff < 60) return `${diff} MIN AGO`;
    return `${Math.floor(diff / 60)} HR AGO`;
  })();

  if (item.type === 'admin_message') {
    return (
      <div className="flex mx-3.5 mb-1.5 rounded overflow-hidden border"
           style={{ background: 'rgba(255,182,18,0.03)', borderColor: 'rgba(255,182,18,0.18)' }}>
        <div className="w-6 h-6 rounded m-2 mr-0 flex items-center justify-center shrink-0"
             style={{ background: 'rgba(255,182,18,0.14)', border: '1px solid rgba(255,182,18,0.28)' }}>
          <span className="font-mono text-[8px] font-black" style={{ color: BRAND.gold }}>
            {(item.admin_name ?? 'AD').slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="p-2 flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-mono text-[9px] font-black tracking-[1px]" style={{ color: BRAND.gold }}>
              {item.admin_name?.toUpperCase() ?? 'ADMIN'}
            </span>
            <span className="font-mono text-[9px]" style={{ color: COLORS.dim }}>{ago}</span>
          </div>
          <p className="text-[11px] text-white">{item.title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex mx-3.5 mb-1.5 rounded overflow-hidden border"
         style={{ background: COLORS.surface, borderColor: COLORS.border }}>
      <div className="w-0.5 shrink-0" style={{ background: stripe }} />
      <div className="p-2.5 flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[9px] font-black tracking-[1.5px]" style={{ color: stripe }}>{label}</span>
          <span className="font-mono text-[9px]" style={{ color: COLORS.dim }}>{ago}</span>
        </div>
        <p className="text-xs font-bold text-white">{item.title}</p>
        {item.subtitle && <p className="text-[10px] mt-0.5" style={{ color: COLORS.muted }}>{item.subtitle}</p>}
        {item.points != null && (
          <p className="font-display font-black text-base mt-0.5" style={{ color: stripe }}>
            {item.points > 0 ? `+${item.points.toLocaleString()} PTS` : `${item.points.toLocaleString()} PTS`}
          </p>
        )}
      </div>
    </div>
  );
}
