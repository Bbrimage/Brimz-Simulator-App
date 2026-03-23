// ── AdminRewards.tsx ──────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BRAND, COLORS } from '../../constants';
import { Plus, X } from 'lucide-react';
import type { Reward } from '../../types';

const REWARD_TYPES = ['food', 'merch', 'ticket', 'social', 'custom'] as const;

export function AdminRewards() {
  const { adminUser } = useAdminAuth();
  const venueId = (adminUser as any)?.venue_id;
  const [rewards,  setRewards]  = useState<Reward[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showNew,  setShowNew]  = useState(false);
  const [form, setForm] = useState({ name: '', description: '', token_cost: 100, reward_type: 'food' as typeof REWARD_TYPES[number] });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (venueId) load(); }, [venueId]);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('rewards').select('*').eq('venue_id', venueId).order('token_cost');
    if (data) setRewards(data);
    setLoading(false);
  }

  async function create() {
    if (!form.name) return;
    setSaving(true);
    await supabase.from('rewards').insert({ ...form, venue_id: venueId, active: true, total_redeemed: 0 });
    setForm({ name: '', description: '', token_cost: 100, reward_type: 'food' });
    setShowNew(false);
    setSaving(false);
    load();
  }

  async function toggleActive(id: string, active: boolean) {
    await supabase.from('rewards').update({ active: !active }).eq('id', id);
    load();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl tracking-wider text-white">REWARDS</h1>
          <p className="text-sm mt-1" style={{ color: COLORS.muted }}>Manage your fan reward catalog</p>
        </div>
        <button onClick={() => setShowNew(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded font-mono text-xs font-black tracking-[1.5px]"
                style={{ background: BRAND.teal, color: COLORS.bg }}>
          <Plus size={14} /> NEW REWARD
        </button>
      </div>

      {showNew && (
        <div className="rounded-xl border p-6 mb-6 animate-fade-in" style={{ background: COLORS.surface, borderColor: BRAND.teal + '40' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-body font-black text-sm tracking-widest text-white">NEW REWARD</h2>
            <button onClick={() => setShowNew(false)} style={{ color: COLORS.muted }}><X size={16} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Field label="NAME"><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="20% Off Concessions" className={inputCls} style={inputStyle} /></Field>
            </div>
            <div>
              <Field label="TYPE">
                <select value={form.reward_type} onChange={e => setForm(f => ({ ...f, reward_type: e.target.value as any }))} className={inputCls} style={inputStyle}>
                  {REWARD_TYPES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                </select>
              </Field>
            </div>
            <div>
              <Field label="ENERGY COST"><input type="number" value={form.token_cost} onChange={e => setForm(f => ({ ...f, token_cost: +e.target.value }))} className={inputCls} style={inputStyle} /></Field>
            </div>
            <div>
              <Field label="DESCRIPTION"><input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Claim at any concession stand" className={inputCls} style={inputStyle} /></Field>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button onClick={create} disabled={saving || !form.name} className="px-6 py-2.5 rounded font-mono text-xs font-black tracking-[1.5px] disabled:opacity-50" style={{ background: BRAND.teal, color: COLORS.bg }}>
                {saving ? 'CREATING...' : 'CREATE REWARD'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border overflow-hidden" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
        <table className="w-full">
          <thead><tr className="border-b" style={{ borderColor: COLORS.border }}>
            {['Reward', 'Type', 'Cost', 'Redeemed', 'Status'].map(h => (
              <th key={h} className="text-left px-5 py-3 font-mono text-[9px] font-black tracking-[1.5px]" style={{ color: COLORS.muted }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="text-center py-8 text-sm" style={{ color: COLORS.muted }}>Loading...</td></tr>
            : rewards.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-sm" style={{ color: COLORS.muted }}>No rewards yet</td></tr>
            : rewards.map(r => (
              <tr key={r.id} className="border-b last:border-b-0" style={{ borderColor: COLORS.border }}>
                <td className="px-5 py-3.5"><p className="text-sm font-semibold text-white">{r.name}</p><p className="text-xs mt-0.5 line-clamp-1" style={{ color: COLORS.muted }}>{r.description}</p></td>
                <td className="px-5 py-3.5"><span className="font-mono text-[9px] font-black px-2 py-1 rounded" style={{ background: BRAND.teal + '18', color: BRAND.teal }}>{r.reward_type.toUpperCase()}</span></td>
                <td className="px-5 py-3.5"><span className="font-display font-black text-sm" style={{ color: BRAND.gold }}>{r.token_cost.toLocaleString()}</span></td>
                <td className="px-5 py-3.5"><span className="font-display font-black text-sm" style={{ color: BRAND.teal }}>{r.total_redeemed}</span></td>
                <td className="px-5 py-3.5">
                  <button onClick={() => toggleActive(r.id, r.active)} className="px-3 py-1.5 rounded font-mono text-[9px] font-black tracking-[1px] border"
                          style={{ background: r.active ? BRAND.green + '15' : COLORS.surface2, borderColor: r.active ? BRAND.green + '40' : COLORS.border, color: r.active ? BRAND.green : COLORS.muted }}>
                    {r.active ? 'ACTIVE' : 'INACTIVE'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── AdminFans.tsx ──────────────────────────────────────────────────────────
export function AdminFans() {
  const { adminUser } = useAdminAuth();
  const venueId = (adminUser as any)?.venue_id;
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [eventId,  setEventId]  = useState('');
  const [events,   setEvents]   = useState<any[]>([]);

  useEffect(() => { if (venueId) loadEvents(); }, [venueId]);
  useEffect(() => { if (eventId) loadSessions(); }, [eventId]);

  async function loadEvents() {
    const { data } = await supabase.from('events').select('id,name').eq('venue_id', venueId).order('event_date', { ascending: false }).limit(10);
    if (data) { setEvents(data); if (data[0]) setEventId(data[0].id); }
  }
  async function loadSessions() {
    setLoading(true);
    const { data } = await supabase.from('sessions').select('*, fan:fans(username,display_name,total_tokens)').eq('event_id', eventId).order('energy_score', { ascending: false }).limit(100);
    if (data) setSessions(data);
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-black text-3xl tracking-wider text-white">FANS</h1>
          <p className="text-sm mt-1" style={{ color: COLORS.muted }}>Connected fans by event</p>
        </div>
        {events.length > 0 && (
          <select value={eventId} onChange={e => setEventId(e.target.value)}
                  className="px-3 py-2.5 rounded border text-sm text-white outline-none"
                  style={{ background: COLORS.surface, borderColor: COLORS.border, fontFamily: '"Barlow", sans-serif' }}>
            {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        )}
      </div>

      <div className="rounded-lg border overflow-hidden" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
        <table className="w-full">
          <thead><tr className="border-b" style={{ borderColor: COLORS.border }}>
            {['Rank', 'Fan', 'Section', 'Energy', 'Energy Spent', 'Status'].map(h => (
              <th key={h} className="text-left px-5 py-3 font-mono text-[9px] font-black tracking-[1.5px]" style={{ color: COLORS.muted }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="text-center py-8 text-sm" style={{ color: COLORS.muted }}>Loading...</td></tr>
            : sessions.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-sm" style={{ color: COLORS.muted }}>No fans connected</td></tr>
            : sessions.map((s, i) => (
              <tr key={s.id} className="border-b last:border-b-0" style={{ borderColor: COLORS.border }}>
                <td className="px-5 py-3.5"><span className="font-display font-black text-base" style={{ color: i < 3 ? BRAND.gold : COLORS.dim }}>{i + 1}</span></td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[9px] font-black" style={{ background: BRAND.teal + '20', color: BRAND.teal }}>
                      {(s.fan?.display_name ?? s.fan?.username ?? 'F').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{s.fan?.display_name ?? s.fan?.username ?? `Fan #${s.fan_id.slice(-6)}`}</p>
                      <p className="font-mono text-[9px]" style={{ color: COLORS.muted }}>{s.fan_id.slice(-8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5"><span className="font-mono text-xs" style={{ color: COLORS.muted }}>{s.section ?? '—'}</span></td>
                <td className="px-5 py-3.5"><span className="font-display font-black text-sm" style={{ color: BRAND.teal }}>{s.energy_score.toLocaleString()}</span></td>
                <td className="px-5 py-3.5"><span className="font-display font-black text-sm" style={{ color: BRAND.gold }}>{s.tokens_earned.toLocaleString()}</span></td>
                <td className="px-5 py-3.5">
                  <span className="font-mono text-[9px] font-black px-2 py-1 rounded" style={{ background: !s.disconnected_at ? BRAND.green + '15' : COLORS.surface2, color: !s.disconnected_at ? BRAND.green : COLORS.muted }}>
                    {s.disconnected_at ? 'LEFT' : 'LIVE'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── AdminSettings.tsx ─────────────────────────────────────────────────────
export function AdminSettings() {
  const { adminUser } = useAdminAuth();
  const venue = (adminUser as any)?.venue;
  const [primary,   setPrimary]   = useState(venue?.primary_color   ?? '#773141');
  const [secondary, setSecondary] = useState(venue?.secondary_color ?? '#FFB612');
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);

  async function saveColors() {
    if (!venue?.id) return;
    setSaving(true);
    await supabase.from('venues').update({ primary_color: primary, secondary_color: secondary }).eq('id', venue.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl tracking-wider text-white">SETTINGS</h1>
        <p className="text-sm mt-1" style={{ color: COLORS.muted }}>Venue configuration</p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Venue info */}
        <div className="rounded-lg border p-6" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
          <SectionHead title="VENUE INFO" />
          <div className="mt-4 flex flex-col gap-3">
            <InfoRow label="VENUE NAME"  value={venue?.name      ?? '—'} />
            <InfoRow label="TEAM"        value={venue?.team_name ?? '—'} />
            <InfoRow label="CONTRACT"    value={venue?.contract_status?.toUpperCase() ?? '—'} />
            <InfoRow label="AI MODE"     value={venue?.ai_mode_enabled ? 'ENABLED' : 'DISABLED'} />
          </div>
        </div>

        {/* Theme colors */}
        <div className="rounded-lg border p-6" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
          <SectionHead title="THEME COLORS" />
          <p className="text-xs mt-1 mb-5" style={{ color: COLORS.muted }}>
            These colors cascade to the fan app in real time.
          </p>
          <div className="grid grid-cols-2 gap-6 mb-5">
            <div>
              <Field label="PRIMARY COLOR" />
              <div className="flex items-center gap-3 mt-1.5">
                <input type="color" value={primary} onChange={e => setPrimary(e.target.value)}
                       className="w-10 h-10 rounded cursor-pointer border" style={{ borderColor: COLORS.border }} />
                <input value={primary} onChange={e => setPrimary(e.target.value)}
                       className="flex-1 px-3 py-2 rounded border text-sm text-white outline-none font-mono"
                       style={{ background: COLORS.surface2, borderColor: COLORS.border }} />
              </div>
            </div>
            <div>
              <Field label="SECONDARY COLOR" />
              <div className="flex items-center gap-3 mt-1.5">
                <input type="color" value={secondary} onChange={e => setSecondary(e.target.value)}
                       className="w-10 h-10 rounded cursor-pointer border" style={{ borderColor: COLORS.border }} />
                <input value={secondary} onChange={e => setSecondary(e.target.value)}
                       className="flex-1 px-3 py-2 rounded border text-sm text-white outline-none font-mono"
                       style={{ background: COLORS.surface2, borderColor: COLORS.border }} />
              </div>
            </div>
          </div>
          <button onClick={saveColors} disabled={saving}
                  className="px-6 py-2.5 rounded font-mono text-xs font-black tracking-[1.5px] disabled:opacity-50"
                  style={{ background: saved ? BRAND.green : BRAND.teal, color: COLORS.bg }}>
            {saving ? 'SAVING...' : saved ? 'SAVED' : 'SAVE COLORS'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Shared helpers ─────────────────────────────────────────────────────────
function SectionHead({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-0.5 h-4" style={{ background: BRAND.teal }} />
      <h2 className="font-body font-black text-sm tracking-widest text-white">{title}</h2>
    </div>
  );
}
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: COLORS.border }}>
      <span className="font-mono text-[10px] font-bold tracking-[1px]" style={{ color: COLORS.muted }}>{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}
function Field({ label, children }: { label: string; children?: React.ReactNode }) {
  return <label className="font-mono text-[9px] font-black tracking-[1.5px] block" style={{ color: COLORS.muted }}>{children ?? label}</label>;
}
const inputCls = 'w-full px-3 py-2.5 rounded border text-sm text-white outline-none';
const inputStyle = { background: COLORS.surface2, borderColor: COLORS.border, fontFamily: '"Barlow", sans-serif' };

export default AdminRewards;
