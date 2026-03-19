import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BRAND, COLORS } from '../../constants';
import { Zap, Send, Radio } from 'lucide-react';
import type { Event, Challenge, Session } from '../../types';

export default function AdminLiveEvent() {
  const { adminUser } = useAdminAuth();
  const venueId = (adminUser as any)?.venue_id;

  const [event,       setEvent]       = useState<Event | null>(null);
  const [sessions,    setSessions]    = useState<Session[]>([]);
  const [challenges,  setChallenges]  = useState<Challenge[]>([]);
  const [pushName,    setPushName]    = useState('');
  const [pushDesc,    setPushDesc]    = useState('');
  const [pushDur,     setPushDur]     = useState(60);
  const [pushing,     setPushing]     = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (venueId) loadEvent();
    return () => { channelRef.current?.unsubscribe(); };
  }, [venueId]);

  async function loadEvent() {
    const { data } = await supabase
      .from('events').select('*').eq('venue_id', venueId)
      .in('status', ['active', 'scheduled']).order('start_time').limit(1).single();
    if (!data) return;
    setEvent(data);
    loadSessions(data.id);
    loadChallenges(data.id);
    subscribeRealtime(data.id);
  }

  async function loadSessions(eventId: string) {
    const { data } = await supabase
      .from('sessions').select('*').eq('event_id', eventId)
      .is('disconnected_at', null).order('energy_score', { ascending: false }).limit(50);
    if (data) setSessions(data);
  }

  async function loadChallenges(eventId: string) {
    const { data } = await supabase
      .from('challenges').select('*').eq('event_id', eventId)
      .order('created_at', { ascending: false }).limit(10);
    if (data) setChallenges(data);
  }

  function subscribeRealtime(eventId: string) {
    channelRef.current = supabase
      .channel(`admin-live-${eventId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions', filter: `event_id=eq.${eventId}` },
        () => loadSessions(eventId))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenges', filter: `event_id=eq.${eventId}` },
        () => loadChallenges(eventId))
      .subscribe();
  }

  async function pushChallenge() {
    if (!event || !pushName) return;
    setPushing(true);
    await supabase.from('challenges').insert({
      event_id:         event.id,
      name:             pushName,
      description:      pushDesc || pushName,
      type:             'custom',
      duration_seconds: pushDur,
      token_bonus:      50,
      status:           'active',
      triggered_by:     'manual',
      activated_at:     new Date().toISOString(),
    });
    setPushName('');
    setPushDesc('');
    setPushing(false);
  }

  const liveCount = sessions.filter(s => !s.disconnected_at).length;
  const avgEnergy = sessions.length
    ? Math.round(sessions.reduce((s, x) => s + x.energy_score, 0) / sessions.length)
    : 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-start gap-4">
        <div>
          <h1 className="font-display font-black text-3xl tracking-wider text-white">LIVE EVENT</h1>
          <p className="text-sm mt-1" style={{ color: COLORS.muted }}>
            {event ? event.name : 'No active event'}
          </p>
        </div>
        {event && (
          <div className="flex items-center gap-1.5 mt-1.5 px-3 py-1.5 rounded border"
               style={{ background: BRAND.red + '12', borderColor: BRAND.red + '30' }}>
            <div className="w-1.5 h-1.5 rounded-full animate-live-dot" style={{ background: BRAND.red }} />
            <span className="font-mono text-[10px] font-black tracking-[1px]" style={{ color: BRAND.red }}>
              LIVE
            </span>
          </div>
        )}
      </div>

      {!event ? (
        <div className="rounded-lg border p-10 text-center" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
          <Radio size={32} style={{ color: COLORS.dim, margin: '0 auto 12px' }} />
          <p className="font-body font-black text-base text-white mb-2">No Active Event</p>
          <p className="text-sm" style={{ color: COLORS.muted }}>
            Create and start an event from the Events page to see live data here.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left: Live stats + top fans */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'FANS LIVE',   value: liveCount.toLocaleString(),  color: BRAND.teal },
                { label: 'AVG ENERGY',  value: avgEnergy.toLocaleString(),   color: BRAND.gold },
                { label: 'TOKENS OUT',  value: event.total_tokens_distributed.toLocaleString(), color: BRAND.green },
              ].map(s => (
                <div key={s.label} className="rounded-lg border p-4" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
                  <p className="font-mono text-[8px] font-black tracking-[1.5px] mb-2" style={{ color: COLORS.muted }}>{s.label}</p>
                  <p className="font-display font-black text-2xl" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Top fans */}
            <div className="rounded-lg border overflow-hidden" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
              <div className="flex items-center gap-2 px-5 py-3.5 border-b" style={{ borderColor: COLORS.border }}>
                <div className="w-0.5 h-4" style={{ background: BRAND.teal }} />
                <h2 className="font-body font-black text-xs tracking-widest text-white">TOP FANS THIS EVENT</h2>
              </div>
              {sessions.slice(0, 10).map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 px-5 py-3 border-b last:border-b-0"
                     style={{ borderColor: COLORS.border }}>
                  <span className="font-display font-black text-base w-5 text-center"
                        style={{ color: i < 3 ? BRAND.gold : COLORS.dim }}>{i + 1}</span>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-black"
                       style={{ background: BRAND.teal + '20', color: BRAND.teal }}>
                    {s.fan_id.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white">Fan #{s.fan_id.slice(-6)}</p>
                    <p className="font-mono text-[9px]" style={{ color: COLORS.muted }}>Section {s.section ?? '—'}</p>
                  </div>
                  <span className="font-display font-black text-sm" style={{ color: BRAND.teal }}>
                    {s.energy_score.toLocaleString()}
                  </span>
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="p-6 text-center text-sm" style={{ color: COLORS.muted }}>
                  No connected fans yet
                </div>
              )}
            </div>
          </div>

          {/* Right: Challenge controls + history */}
          <div className="flex flex-col gap-5">
            {/* Push challenge */}
            <div className="rounded-lg border p-5" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} color={BRAND.gold} />
                <h2 className="font-body font-black text-xs tracking-widest text-white">PUSH CHALLENGE</h2>
              </div>
              <div className="flex flex-col gap-3">
                <input
                  value={pushName}
                  onChange={e => setPushName(e.target.value)}
                  placeholder="Challenge name"
                  className="w-full px-3 py-2.5 rounded border text-sm text-white outline-none"
                  style={{ background: COLORS.surface2, borderColor: COLORS.border, fontFamily: '"Barlow", sans-serif' }}
                />
                <input
                  value={pushDesc}
                  onChange={e => setPushDesc(e.target.value)}
                  placeholder="Description (optional)"
                  className="w-full px-3 py-2.5 rounded border text-sm text-white outline-none"
                  style={{ background: COLORS.surface2, borderColor: COLORS.border, fontFamily: '"Barlow", sans-serif' }}
                />
                <div>
                  <label className="font-mono text-[9px] font-bold tracking-[1px] block mb-1" style={{ color: COLORS.muted }}>
                    DURATION: {pushDur}s
                  </label>
                  <input type="range" min="15" max="120" step="15" value={pushDur}
                         onChange={e => setPushDur(+e.target.value)}
                         className="w-full accent-teal-400" />
                </div>
                <button
                  onClick={pushChallenge}
                  disabled={pushing || !pushName}
                  className="w-full py-2.5 rounded flex items-center justify-center gap-2 font-mono text-[11px] font-black tracking-[1.5px] disabled:opacity-50"
                  style={{ background: BRAND.gold, color: COLORS.bg }}>
                  <Send size={12} />
                  {pushing ? 'PUSHING...' : 'PUSH NOW'}
                </button>
              </div>
            </div>

            {/* Challenge history */}
            <div className="rounded-lg border overflow-hidden" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: COLORS.border }}>
                <h2 className="font-body font-black text-xs tracking-widest text-white">CHALLENGES</h2>
              </div>
              <div className="max-h-[280px] overflow-y-auto">
                {challenges.map(c => (
                  <div key={c.id} className="px-4 py-3 border-b last:border-b-0 flex items-center gap-3"
                       style={{ borderColor: COLORS.border }}>
                    <div className="w-1.5 h-1.5 rounded-full shrink-0"
                         style={{ background: c.status === 'active' ? BRAND.green : c.status === 'scheduled' ? BRAND.gold : COLORS.dim }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{c.name}</p>
                      <p className="font-mono text-[9px]" style={{ color: COLORS.muted }}>{c.status} · {c.duration_seconds}s</p>
                    </div>
                  </div>
                ))}
                {challenges.length === 0 && (
                  <div className="p-4 text-center text-xs" style={{ color: COLORS.muted }}>No challenges yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
