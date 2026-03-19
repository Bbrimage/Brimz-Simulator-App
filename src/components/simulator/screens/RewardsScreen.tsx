import { useState } from 'react';
import { useSim } from '../../../context/SimulatorContext';
import { BRAND, COLORS } from '../../../constants';

type Filter = 'ALL' | 'FOOD' | 'MERCH' | 'VIP' | 'EXPERIENCE';
const FILTERS: Filter[] = ['ALL', 'FOOD', 'MERCH', 'VIP', 'EXPERIENCE'];

const TYPE_MAP: Record<string, Filter> = {
  food: 'FOOD', merch: 'MERCH', ticket: 'VIP', social: 'EXPERIENCE', custom: 'EXPERIENCE',
};

export default function RewardsScreen() {
  const { state, rewards, redeemReward } = useSim();
  const { tokensEarned, energySpent } = state;
  const available = tokensEarned - energySpent;

  const [filter, setFilter]   = useState<Filter>('ALL');
  const [selected, setSelected] = useState<typeof rewards[0] | null>(null);
  const [voucher, setVoucher]   = useState('');

  const filtered = filter === 'ALL'
    ? rewards
    : rewards.filter(r => TYPE_MAP[r.reward_type] === filter);

  function handleRedeem() {
    if (!selected) return;
    redeemReward(selected);
    setVoucher(`BRIMZ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
  }

  return (
    <div className="flex flex-col h-full" style={{ background: COLORS.bg }}>

      {/* Header */}
      <div className="px-3.5 py-3.5 border-b shrink-0" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
        <div className="mb-2.5">
          <span className="font-display font-black text-[30px] leading-none" style={{ color: BRAND.green }}>
            {available.toLocaleString()}
          </span>
          <span className="font-mono text-[9px] font-bold tracking-[1.5px] block mt-0.5" style={{ color: COLORS.muted }}>
            PTS AVAILABLE
          </span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
                    className="px-2.5 py-1 rounded shrink-0 border font-mono text-[9px] font-black tracking-[1px] transition-colors"
                    style={{
                      background:   filter === f ? BRAND.teal    : COLORS.surface2,
                      borderColor:  filter === f ? BRAND.teal    : COLORS.border,
                      color:        filter === f ? COLORS.bg     : COLORS.muted,
                    }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 phone-scroll">
        <div className="py-2">
          {filtered.map(r => {
            const canAfford = available >= r.token_cost;
            return (
              <div key={r.id} className="mx-3.5 mb-2.5 rounded border overflow-hidden"
                   style={{ background: COLORS.surface, borderColor: COLORS.border }}>
                {/* Image placeholder */}
                <div className="h-16 flex items-center justify-center" style={{ background: COLORS.surface2 }}>
                  <span className="font-mono text-[9px] font-black tracking-[2px]" style={{ color: COLORS.dim }}>IMAGE</span>
                </div>
                <div className="p-3 pb-0">
                  <p className="font-body text-[13px] font-black text-white">{r.name}</p>
                  <p className="font-mono text-[9px] font-bold tracking-[1.5px] mt-0.5" style={{ color: COLORS.muted }}>
                    M&T BANK STADIUM · {r.reward_type.toUpperCase()}
                  </p>
                  <p className="text-[10px] mt-1.5 leading-relaxed" style={{ color: COLORS.muted }}>{r.description}</p>
                </div>
                <div className="flex items-center justify-between border-t mt-3 px-3 py-2.5"
                     style={{ borderColor: COLORS.border }}>
                  <span className="font-display font-black text-[15px]"
                        style={{ color: canAfford ? BRAND.green : COLORS.muted }}>
                    {r.token_cost.toLocaleString()} PTS
                  </span>
                  <button
                    onClick={() => { setSelected(r); setVoucher(''); }}
                    disabled={!canAfford}
                    className="px-4 py-1.5 rounded font-mono text-[10px] font-black tracking-[1.5px]"
                    style={{
                      background:  canAfford ? BRAND.teal    : COLORS.surface2,
                      color:       canAfford ? COLORS.bg     : COLORS.muted,
                      opacity:     canAfford ? 1             : 0.8,
                    }}>
                    {canAfford ? 'REDEEM' : 'NEED MORE PTS'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="absolute inset-0 flex items-center justify-center p-6 z-50"
             style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="rounded-xl border p-5 w-full flex flex-col gap-3"
               style={{ background: COLORS.surface, borderColor: COLORS.border }}>
            {voucher ? (
              <>
                <p className="font-display font-black text-lg text-white">REWARD REDEEMED</p>
                <p className="text-xs" style={{ color: COLORS.muted }}>
                  Show this code at the venue to claim your reward.
                </p>
                <div className="rounded border flex items-center justify-center py-5"
                     style={{ background: COLORS.bg, borderColor: BRAND.teal + '50' }}>
                  <span className="font-display font-black text-[28px] tracking-[3px]" style={{ color: BRAND.teal }}>
                    {voucher}
                  </span>
                </div>
                <p className="text-[10px] text-center" style={{ color: COLORS.muted }}>
                  Screenshot this screen. Code expires in 15 minutes.
                </p>
                <button onClick={() => setSelected(null)}
                        className="w-full py-2.5 rounded font-mono font-black text-[11px] tracking-[2px]"
                        style={{ background: BRAND.teal, color: COLORS.bg }}>
                  DONE
                </button>
              </>
            ) : (
              <>
                <p className="font-display font-black text-lg text-white">{selected.name}</p>
                <p className="text-xs" style={{ color: COLORS.muted }}>{selected.description}</p>
                {[
                  ['Cost',             `${selected.token_cost.toLocaleString()} PTS`, BRAND.green],
                  ['Your balance',     `${available.toLocaleString()} PTS`,           '#fff'],
                  ['After redemption', `${(available - selected.token_cost).toLocaleString()} PTS`, BRAND.green],
                ].map(([label, val, color]) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-[11px]" style={{ color: COLORS.muted }}>{label}</span>
                    <span className="font-display font-black text-[13px]" style={{ color: color as string }}>{val}</span>
                  </div>
                ))}
                <div className="flex gap-2 mt-1">
                  <button onClick={() => setSelected(null)}
                          className="flex-1 py-2.5 rounded border font-mono font-black text-[10px] tracking-[1px]"
                          style={{ background: COLORS.surface2, borderColor: COLORS.border, color: COLORS.muted }}>
                    CANCEL
                  </button>
                  <button onClick={handleRedeem}
                          className="flex-1 py-2.5 rounded font-mono font-black text-[10px] tracking-[2px]"
                          style={{ background: BRAND.teal, color: COLORS.bg }}>
                    CONFIRM
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
