import { useSim } from '../../../context/SimulatorContext';
import { BRAND, COLORS } from '../../../constants';

export default function HomeScreen() {
  const { state, setScreen } = useSim();
  const { energyScore, tokensEarned, energySpent } = state;

  const available = tokensEarned - energySpent;
  const primary   = BRAND.teal;
  const secondary = BRAND.gold;

  return (
    <div className="phone-scroll h-full" style={{ background: COLORS.bg }}>

      {/* Hero */}
      <div style={{ background: COLORS.surface }}>
        <div className="h-[3px] w-full" style={{ background: primary }} />
        <div className="px-5 pt-12 pb-6 flex flex-col gap-1">
          <span className="font-mono text-[10px] font-bold tracking-[2px]" style={{ color: COLORS.muted }}>
            CONNECTED TO
          </span>
          <span className="font-display font-black text-[28px] leading-tight text-white tracking-tight">
            M&T Bank Stadium
          </span>
          <span className="font-body text-sm font-semibold" style={{ color: '#9CA3AF' }}>
            Baltimore Ravens
          </span>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full animate-live-dot" style={{ background: BRAND.red }} />
            <span className="font-mono text-[10px] font-black tracking-[1.5px]" style={{ color: BRAND.red }}>LIVE</span>
            <span className="text-xs font-semibold" style={{ color: COLORS.muted }}>
              Ravens vs Chiefs — Week 14
            </span>
          </div>
        </div>
      </div>

      {/* Stats ticker */}
      <div className="flex border-y" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
        <StatCell label="FANS IN"    value="4,821"            color={primary}   />
        <div className="w-px my-2.5" style={{ background: COLORS.border }} />
        <StatCell label="AVG ENERGY" value="1,204"            color={secondary} />
        <div className="w-px my-2.5" style={{ background: COLORS.border }} />
        <StatCell label="TOKENS OUT" value="48,210"           color={primary}   />
      </div>

      {/* Your Status */}
      <section className="px-4 pt-6 pb-0">
        <SectionHeader title="YOUR STATUS" />
        <div className="mt-3 rounded overflow-hidden border" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
          <div className="flex py-6 px-4">
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <span className="font-display font-black text-[42px] leading-none" style={{ color: primary }}>
                {energyScore.toLocaleString()}
              </span>
              <span className="font-mono text-[9px] font-bold tracking-[1.5px]" style={{ color: COLORS.muted }}>ENERGY SCORE</span>
            </div>
            <div className="w-px mx-2" style={{ background: COLORS.border }} />
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <span className="font-display font-black text-[42px] leading-none" style={{ color: secondary }}>
                {available}
              </span>
              <span className="font-mono text-[9px] font-bold tracking-[1.5px]" style={{ color: COLORS.muted }}>TOKENS</span>
            </div>
          </div>
          <div className="border-t px-4 py-3" style={{ borderColor: COLORS.border }}>
            <p className="text-xs text-center" style={{ color: COLORS.muted }}>
              Sign up to save your score and unlock bigger rewards →
            </p>
          </div>
        </div>
      </section>

      {/* Today's Rewards */}
      <section className="px-4 pt-6 pb-8">
        <SectionHeader title="TODAY'S REWARDS" action="SEE ALL" onAction={() => setScreen('rewards')} />
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {PREVIEW_REWARDS.map(r => (
            <button key={r.id} className="rounded p-3.5 flex flex-col gap-2 text-left border hover:border-opacity-60 transition-colors"
                    style={{ background: COLORS.surface, borderColor: COLORS.border }}
                    onClick={() => setScreen('rewards')}>
              <span className="font-mono text-xs font-black" style={{ color: primary }}>{r.icon}</span>
              <span className="text-xs font-semibold text-white leading-snug">{r.name}</span>
              <div className="rounded px-2 py-1 self-start border"
                   style={{ background: primary + '18', borderColor: primary + '35' }}>
                <span className="font-mono text-[9px] font-black" style={{ color: primary }}>
                  {r.cost} TKN
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-0.5 h-4 rounded-sm" style={{ background: BRAND.teal }} />
      <span className="flex-1 font-body text-[13px] font-black tracking-[1.5px] text-white">{title}</span>
      {action && (
        <button onClick={onAction} className="font-mono text-xs font-bold" style={{ color: BRAND.teal }}>
          {action}
        </button>
      )}
    </div>
  );
}

function StatCell({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex-1 flex flex-col items-center py-3.5 gap-1">
      <span className="font-display font-black text-xl" style={{ color }}>{value}</span>
      <span className="font-mono text-[9px] font-bold tracking-[1.5px]" style={{ color: COLORS.muted }}>{label}</span>
    </div>
  );
}

const PREVIEW_REWARDS = [
  { id: '1', icon: 'FOOD', name: '20% Off Concessions', cost: 50  },
  { id: '2', icon: 'MERCH', name: 'Team Cap', cost: 150 },
  { id: '3', icon: 'VIP',   name: 'Club Level Access', cost: 300 },
  { id: '4', icon: 'XTRA',  name: 'Signed Jersey', cost: 500 },
];
