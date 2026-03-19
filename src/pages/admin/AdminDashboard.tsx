import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BRAND, COLORS } from '../../constants';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Zap, Coins, TrendingUp } from 'lucide-react';
import type { Event } from '../../types';

interface Stats {
  totalFans:   number;
  avgEnergy:   number;
  tokensOut:   number;
  activeEvents: number;
}

interface ChartPoint {
  time: string;
  energy: number;
  fans: number;
}

export default function AdminDashboard() {
  const { adminUser } = useAdminAuth();
  const venueId = (adminUser as any)?.venue_id;

  const [stats,   setStats]   = useState<Stats>({ totalFans: 0, avgEnergy: 0, tokensOut: 0, activeEvents: 0 });
  const [events,  setEvents]  = useState<Event[]>([]);
  const [chart,   setChart]   = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (venueId) loadDashboard();
  }, [venueId]);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [eventsRes] = await Promise.all([
        supabase
          .from('events')
          .select('*')
          .eq('venue_id', venueId)
          .order('event_date', { ascending: false })
          .limit(5),
      ]);

      if (eventsRes.data) {
        setEvents(eventsRes.data);
        const active = eventsRes.data.filter(e => e.status === 'active');
        const totals = active.reduce((acc, e) => ({
          fans:   acc.fans   + e.total_fans_connected,
          energy: acc.energy + e.avg_energy_score,
          tokens: acc.tokens + e.total_tokens_distributed,
        }), { fans: 0, energy: 0, tokens: 0 });

        setStats({
          totalFans:    totals.fans,
          avgEnergy:    active.length ? Math.round(totals.energy / active.length) : 0,
          tokensOut:    totals.tokens,
          activeEvents: active.length,
        });
      }

      // Build chart from recent events
      const chartData: ChartPoint[] = (eventsRes.data ?? []).slice(0, 6).reverse().map(e => ({
        time:   new Date(e.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        energy: e.avg_energy_score,
        fans:   e.total_fans_connected,
      }));
      setChart(chartData);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const statCards = [
    { label: 'FANS CONNECTED',   value: stats.totalFans.toLocaleString(),   icon: Users,       color: BRAND.teal  },
    { label: 'AVG ENERGY SCORE', value: stats.avgEnergy.toLocaleString(),   icon: Zap,         color: BRAND.gold  },
    { label: 'TOKENS DISTRIBUTED', value: stats.tokensOut.toLocaleString(), icon: Coins,       color: BRAND.green },
    { label: 'ACTIVE EVENTS',    value: stats.activeEvents.toString(),      icon: TrendingUp,  color: BRAND.teal  },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl tracking-wider text-white">DASHBOARD</h1>
        <p className="text-sm mt-1" style={{ color: COLORS.muted }}>
          {(adminUser as any)?.venue?.name ?? 'Your Venue'} · Live overview
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(card => (
          <div key={card.label} className="rounded-lg border p-4" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[9px] font-black tracking-[1.5px]" style={{ color: COLORS.muted }}>
                {card.label}
              </span>
              <card.icon size={14} color={card.color} />
            </div>
            <div className="font-display font-black text-3xl" style={{ color: card.color }}>
              {loading ? '—' : card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Energy chart */}
      <div className="rounded-lg border p-5 mb-6" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-0.5 h-4" style={{ background: BRAND.teal }} />
          <h2 className="font-body font-black text-sm tracking-widest text-white">AVG ENERGY BY EVENT</h2>
        </div>
        {chart.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chart} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <XAxis dataKey="time" tick={{ fill: COLORS.muted, fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: COLORS.muted, fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 6, fontFamily: 'DM Mono', fontSize: 11 }}
                labelStyle={{ color: COLORS.muted }}
                itemStyle={{ color: BRAND.teal }}
              />
              <Line type="monotone" dataKey="energy" stroke={BRAND.teal} strokeWidth={2} dot={{ fill: BRAND.teal, r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[180px] flex items-center justify-center">
            <p className="text-sm" style={{ color: COLORS.muted }}>No event data yet</p>
          </div>
        )}
      </div>

      {/* Recent events */}
      <div className="rounded-lg border overflow-hidden" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
        <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: COLORS.border }}>
          <div className="w-0.5 h-4" style={{ background: BRAND.teal }} />
          <h2 className="font-body font-black text-sm tracking-widest text-white">RECENT EVENTS</h2>
        </div>
        {events.length === 0 && !loading ? (
          <div className="p-6 text-center text-sm" style={{ color: COLORS.muted }}>No events yet.</div>
        ) : (
          events.map(event => (
            <div key={event.id} className="flex items-center gap-4 px-5 py-3.5 border-b last:border-b-0"
                 style={{ borderColor: COLORS.border }}>
              <StatusDot status={event.status} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{event.name}</p>
                <p className="font-mono text-[10px] mt-0.5" style={{ color: COLORS.muted }}>
                  {new Date(event.event_date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display font-black text-sm" style={{ color: BRAND.teal }}>
                  {event.total_fans_connected.toLocaleString()}
                </p>
                <p className="font-mono text-[9px]" style={{ color: COLORS.muted }}>FANS</p>
              </div>
              <div className="text-right">
                <p className="font-display font-black text-sm" style={{ color: BRAND.gold }}>
                  {Math.round(event.avg_energy_score).toLocaleString()}
                </p>
                <p className="font-mono text-[9px]" style={{ color: COLORS.muted }}>AVG PTS</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color = status === 'active' ? BRAND.green : status === 'scheduled' ? BRAND.gold : COLORS.dim;
  return (
    <div className="w-2 h-2 rounded-full shrink-0"
         style={{ background: color, boxShadow: status === 'active' ? `0 0 6px ${color}` : 'none' }} />
  );
}
