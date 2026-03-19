import { useSim } from '../../../context/SimulatorContext';
import { BRAND, COLORS } from '../../../constants';

const DEMO_BADGES = [
  { name: 'FIRST SPARK',  desc: 'Reached 500 pts' },
  { name: 'FAN ON FIRE',  desc: '2,000 pts in one event' },
  { name: 'NOISE MAKER',  desc: 'Top audio score' },
];

const DEMO_HISTORY = [
  { event: 'Ravens vs Eagles — Week 10', date: '11/10/2025', score: 3_210 },
  { event: 'Ravens vs Cowboys — Week 7', date: '10/19/2025', score: 2_880 },
  { event: 'Ravens vs Jets — Week 4',    date: '9/28/2025',  score: 1_540 },
];

export default function StatsScreen() {
  const { state } = useSim();
  const { energyScore, tokensEarned } = state;

  return (
    <div className="phone-scroll h-full" style={{ background: COLORS.bg }}>

      {/* Fan header */}
      <div className="flex items-center gap-3.5 px-4 pt-14 pb-5">
        <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center font-display font-black text-[22px] border-2"
             style={{ background: COLORS.surface, borderColor: BRAND.teal, color: BRAND.teal }}>
          S
        </div>
        <div className="flex-1">
          <p className="font-body text-[18px] font-black text-white">SAGAFAN</p>
          <p className="text-[13px]" style={{ color: COLORS.muted }}>@sagafan</p>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-display font-black text-2xl" style={{ color: BRAND.teal }}>4</span>
          <span className="font-mono text-[9px] font-bold tracking-[1px]" style={{ color: COLORS.muted }}>EVENTS</span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex border-y" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
        <StatCell label="TOTAL SCORE"  value={energyScore.toLocaleString()} color={BRAND.teal}  />
        <div className="w-px my-2.5" style={{ background: COLORS.border }} />
        <StatCell label="TOKENS" value={tokensEarned.toString()}            color={BRAND.gold}  />
        <div className="w-px my-2.5" style={{ background: COLORS.border }} />
        <StatCell label="BADGES"       value={energyScore > 500 ? DEMO_BADGES.length.toString() : '0'} color={BRAND.teal}  />
      </div>

      {/* Badges */}
      <section className="px-4 pt-7">
        <SectionHead title="BADGES EARNED" />
        {energyScore < 500 ? (
          <p className="mt-3 text-[13px]" style={{ color: COLORS.dim }}>Play to earn badges.</p>
        ) : (
          <div className="mt-3 flex gap-2.5 flex-wrap">
            {DEMO_BADGES.filter((_, i) => i < Math.ceil(energyScore / 1500)).map((b, i) => (
              <div key={i} className="w-[88px] rounded border p-3 flex flex-col items-center gap-1.5"
                   style={{ background: COLORS.surface, borderColor: BRAND.teal + '30' }}>
                <div className="w-7 h-7 rounded flex items-center justify-center font-mono text-[9px] font-black"
                     style={{ background: BRAND.teal + '20', color: BRAND.teal }}>MDL</div>
                <p className="text-[10px] font-semibold text-center leading-tight" style={{ color: '#9CA3AF' }}>{b.name}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Event history */}
      <section className="px-4 pt-7 pb-10">
        <SectionHead title="EVENT HISTORY" />
        <div className="mt-3">
          {[{ event: 'Ravens vs Chiefs — Week 14', date: 'Tonight', score: energyScore }, ...DEMO_HISTORY].map((h, i) => (
            <div key={i} className="flex items-center py-3 border-b" style={{ borderColor: COLORS.border }}>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-white">{h.event}</p>
                <p className="text-[11px] mt-0.5" style={{ color: COLORS.muted }}>{h.date}</p>
              </div>
              <span className="font-display font-black text-sm" style={{ color: BRAND.teal }}>
                {h.score.toLocaleString()} pts
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHead({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-0.5 h-3.5 rounded-sm" style={{ background: BRAND.teal }} />
      <span className="font-body text-xs font-black tracking-[1.5px] text-white">{title}</span>
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
