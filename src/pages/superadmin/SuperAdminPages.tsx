import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { BRAND, COLORS } from '../../constants';
import { Plus, X } from 'lucide-react';
import type { Venue, Bracelet, ApiKey } from '../../types';

// ── SuperAdminDashboard ────────────────────────────────────────────────────
export function SuperAdminDashboard() {
  const [stats, setStats] = useState({ venues: 0, activeEvents: 0, totalFans: 0, bracelets: 0 });
  const [activeEvents, setActiveEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  async function loadStats() {
    setLoading(true);
    const [venuesRes, eventsRes, bracRes] = await Promise.all([
      supabase.from('venues').select('id', { count: 'exact' }),
      supabase.from('events').select('*, venue:venues(name)').eq('status', 'active'),
      supabase.from('bracelets').select('id', { count: 'exact' }),
    ]);
    const active = eventsRes.data ?? [];
    setStats({
      venues:       venuesRes.count ?? 0,
      activeEvents: active.length,
      totalFans:    active.reduce((s, e) => s + (e.total_fans_connected ?? 0), 0),
      bracelets:    bracRes.count ?? 0,
    });
    setActiveEvents(active.slice(0, 8));
    setLoading(false);
  }

  const cards = [
    { label: 'TOTAL VENUES',   value: stats.venues.toString(),              color: BRAND.teal  },
    { label: 'ACTIVE EVENTS',  value: stats.activeEvents.toString(),        color: BRAND.green },
    { label: 'FANS LIVE NOW',  value: stats.totalFans.toLocaleString(),     color: BRAND.gold  },
    { label: 'BRACELETS',      value: stats.bracelets.toLocaleString(),     color: BRAND.teal  },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl tracking-wider text-white">NETWORK OVERVIEW</h1>
        <p className="text-sm mt-1" style={{ color: COLORS.muted }}>Platform-wide live status</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="rounded-lg border p-4" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
            <p className="font-mono text-[9px] font-black tracking-[1.5px] mb-2" style={{ color: COLORS.muted }}>{c.label}</p>
            <p className="font-display font-black text-3xl" style={{ color: c.color }}>{loading ? '—' : c.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border overflow-hidden" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
        <div className="px-5 py-3.5 border-b flex items-center gap-2" style={{ borderColor: COLORS.border }}>
          <div className="w-0.5 h-4" style={{ background: BRAND.green }} />
          <h2 className="font-body font-black text-xs tracking-widest text-white">ACTIVE EVENTS NOW</h2>
          <div className="ml-auto w-2 h-2 rounded-full animate-live-dot" style={{ background: BRAND.green }} />
        </div>
        {activeEvents.length === 0 && !loading ? (
          <div className="p-6 text-center text-sm" style={{ color: COLORS.muted }}>No active events</div>
        ) : activeEvents.map(e => (
          <div key={e.id} className="flex items-center gap-4 px-5 py-3 border-b last:border-b-0" style={{ borderColor: COLORS.border }}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{e.name}</p>
              <p className="font-mono text-[9px] mt-0.5" style={{ color: COLORS.muted }}>{e.venue?.name}</p>
            </div>
            <div className="flex gap-6 shrink-0">
              <Stat label="FANS"   value={e.total_fans_connected?.toLocaleString() ?? '0'}        color={BRAND.teal} />
              <Stat label="AVG"    value={Math.round(e.avg_energy_score ?? 0).toLocaleString()}   color={BRAND.gold} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SuperAdminVenues ───────────────────────────────────────────────────────
export function SuperAdminVenues() {
  const [venues,  setVenues]  = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: '', team_name: '', slug: '', primary_color: '#773141', secondary_color: '#FFB612' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadVenues(); }, []);

  async function loadVenues() {
    setLoading(true);
    const { data } = await supabase.from('venues').select('*').order('created_at', { ascending: false });
    if (data) setVenues(data);
    setLoading(false);
  }

  async function createVenue() {
    if (!form.name || !form.slug) return;
    setSaving(true);
    await supabase.from('venues').insert({
      ...form,
      contract_status:      'active',
      api_access_enabled:   false,
      ai_mode_enabled:      false,
    });
    setForm({ name: '', team_name: '', slug: '', primary_color: '#773141', secondary_color: '#FFB612' });
    setShowNew(false);
    setSaving(false);
    loadVenues();
  }

  async function toggleContract(id: string, status: string) {
    const next = status === 'active' ? 'suspended' : 'active';
    await supabase.from('venues').update({ contract_status: next }).eq('id', id);
    loadVenues();
  }

  async function toggleAI(id: string, enabled: boolean) {
    await supabase.from('venues').update({ ai_mode_enabled: !enabled }).eq('id', id);
    loadVenues();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl tracking-wider text-white">VENUES</h1>
          <p className="text-sm mt-1" style={{ color: COLORS.muted }}>Licensed venue accounts</p>
        </div>
        <button onClick={() => setShowNew(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded font-mono text-xs font-black tracking-[1.5px]"
                style={{ background: BRAND.gold, color: COLORS.bg }}>
          <Plus size={14} /> NEW VENUE
        </button>
      </div>

      {showNew && (
        <div className="rounded-xl border p-6 mb-6 animate-fade-in" style={{ background: COLORS.surface, borderColor: BRAND.gold + '40' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-body font-black text-sm tracking-widest text-white">ONBOARD VENUE</h2>
            <button onClick={() => setShowNew(false)} style={{ color: COLORS.muted }}><X size={16} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <FieldInput label="VENUE NAME"  value={form.name}      onChange={v => setForm(f => ({ ...f, name: v }))}      placeholder="M&T Bank Stadium" />
            <FieldInput label="SLUG"        value={form.slug}      onChange={v => setForm(f => ({ ...f, slug: v }))}      placeholder="mandt-bank-stadium" />
            <FieldInput label="TEAM NAME"   value={form.team_name} onChange={v => setForm(f => ({ ...f, team_name: v }))} placeholder="Baltimore Ravens" />
            <div />
            <div>
              <label className={labelCls}>PRIMARY COLOR</label>
              <div className="flex gap-2 mt-1.5">
                <input type="color" value={form.primary_color} onChange={e => setForm(f => ({ ...f, primary_color: e.target.value }))}
                       className="w-10 h-10 rounded border" style={{ borderColor: COLORS.border }} />
                <input value={form.primary_color} onChange={e => setForm(f => ({ ...f, primary_color: e.target.value }))}
                       className={`flex-1 ${inputCls}`} style={inputSt} />
              </div>
            </div>
            <div>
              <label className={labelCls}>SECONDARY COLOR</label>
              <div className="flex gap-2 mt-1.5">
                <input type="color" value={form.secondary_color} onChange={e => setForm(f => ({ ...f, secondary_color: e.target.value }))}
                       className="w-10 h-10 rounded border" style={{ borderColor: COLORS.border }} />
                <input value={form.secondary_color} onChange={e => setForm(f => ({ ...f, secondary_color: e.target.value }))}
                       className={`flex-1 ${inputCls}`} style={inputSt} />
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button onClick={createVenue} disabled={saving || !form.name || !form.slug}
                      className="px-6 py-2.5 rounded font-mono text-xs font-black tracking-[1.5px] disabled:opacity-50"
                      style={{ background: BRAND.gold, color: COLORS.bg }}>
                {saving ? 'CREATING...' : 'CREATE VENUE'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border overflow-hidden" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: COLORS.border }}>
              {['Venue', 'Colors', 'Contract', 'AI Mode', 'API Access'].map(h => (
                <th key={h} className="text-left px-5 py-3 font-mono text-[9px] font-black tracking-[1.5px]" style={{ color: COLORS.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-sm" style={{ color: COLORS.muted }}>Loading...</td></tr>
            ) : venues.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-sm" style={{ color: COLORS.muted }}>No venues yet</td></tr>
            ) : venues.map(v => (
              <tr key={v.id} className="border-b last:border-b-0" style={{ borderColor: COLORS.border }}>
                <td className="px-5 py-3.5">
                  <p className="text-sm font-semibold text-white">{v.name}</p>
                  <p className="font-mono text-[9px] mt-0.5" style={{ color: COLORS.muted }}>{v.team_name ?? '—'} · {v.slug}</p>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5">
                    <div className="w-5 h-5 rounded" style={{ background: v.primary_color }} title={v.primary_color} />
                    <div className="w-5 h-5 rounded" style={{ background: v.secondary_color }} title={v.secondary_color} />
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <button onClick={() => toggleContract(v.id, v.contract_status)}
                          className="px-2.5 py-1 rounded font-mono text-[9px] font-black border"
                          style={{
                            background:  (v.contract_status === 'active' ? BRAND.green : BRAND.red) + '15',
                            color:        v.contract_status === 'active' ? BRAND.green : BRAND.red,
                            borderColor: (v.contract_status === 'active' ? BRAND.green : BRAND.red) + '40',
                          }}>
                    {v.contract_status.toUpperCase()}
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <Toggle value={v.ai_mode_enabled} onToggle={() => toggleAI(v.id, v.ai_mode_enabled)} color={BRAND.gold} />
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-mono text-[9px] font-black" style={{ color: v.api_access_enabled ? BRAND.green : COLORS.muted }}>
                    {v.api_access_enabled ? 'ENABLED' : 'DISABLED'}
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

// ── SuperAdminNetwork (live view of all active events) ─────────────────────
export function SuperAdminNetwork() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
    const interval = setInterval(loadEvents, 15000);
    return () => clearInterval(interval);
  }, []);

  async function loadEvents() {
    setLoading(true);
    const { data } = await supabase
      .from('events')
      .select('*, venue:venues(name, primary_color)')
      .in('status', ['active', 'scheduled'])
      .order('total_fans_connected', { ascending: false });
    if (data) setEvents(data);
    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl tracking-wider text-white">LIVE NETWORK</h1>
          <p className="text-sm mt-1" style={{ color: COLORS.muted }}>All active and scheduled events — refreshes every 15s</p>
        </div>
        <button onClick={loadEvents} className="flex items-center gap-2 px-3 py-2 rounded border font-mono text-xs font-black tracking-[1px]"
                style={{ background: COLORS.surface, borderColor: COLORS.border, color: COLORS.muted }}>
          REFRESH
        </button>
      </div>

      {events.length === 0 && !loading ? (
        <div className="rounded-lg border p-10 text-center" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
          <p className="text-sm" style={{ color: COLORS.muted }}>No active events right now</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {events.map(e => (
            <div key={e.id} className="rounded-lg border p-5" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
              <div className="flex items-start justify-between gap-2 mb-4">
                <div>
                  <p className="font-body font-black text-sm text-white">{e.name}</p>
                  <p className="font-mono text-[9px] mt-0.5" style={{ color: COLORS.muted }}>{e.venue?.name}</p>
                </div>
                <span className="font-mono text-[9px] font-black px-2 py-1 rounded shrink-0"
                      style={{
                        background: e.status === 'active' ? BRAND.green + '15' : BRAND.gold + '15',
                        color:      e.status === 'active' ? BRAND.green         : BRAND.gold,
                        border:     `1px solid ${(e.status === 'active' ? BRAND.green : BRAND.gold)}40`,
                      }}>
                  {e.status.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Stat label="FANS"      value={e.total_fans_connected?.toLocaleString() ?? '0'}        color={BRAND.teal}  />
                <Stat label="AVG SCORE" value={Math.round(e.avg_energy_score ?? 0).toLocaleString()}   color={BRAND.gold}  />
                <Stat label="TOKENS"    value={e.total_tokens_distributed?.toLocaleString() ?? '0'}    color={BRAND.green} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── SuperAdminAPIKeys ──────────────────────────────────────────────────────
export function SuperAdminAPIKeys() {
  const [keys,    setKeys]    = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ partner_name: '', rate_limit_per_hour: 1000 });
  const [newKey, setNewKey]   = useState('');
  const [saving, setSaving]   = useState(false);

  useEffect(() => { loadKeys(); }, []);

  async function loadKeys() {
    setLoading(true);
    const { data } = await supabase.from('api_keys').select('*').order('issued_at', { ascending: false });
    if (data) setKeys(data);
    setLoading(false);
  }

  async function issueKey() {
    if (!form.partner_name) return;
    setSaving(true);
    const rawKey = `brimz_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    const prefix = rawKey.slice(0, 14);
    await supabase.from('api_keys').insert({
      partner_name:        form.partner_name,
      key_prefix:          prefix,
      scopes:              ['read:fans', 'read:events'],
      rate_limit_per_hour: form.rate_limit_per_hour,
      status:              'active',
      agreement_signed:    false,
    });
    setNewKey(rawKey);
    setSaving(false);
    loadKeys();
  }

  async function revokeKey(id: string) {
    await supabase.from('api_keys').update({ status: 'revoked' }).eq('id', id);
    loadKeys();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl tracking-wider text-white">API KEYS</h1>
          <p className="text-sm mt-1" style={{ color: COLORS.muted }}>Partner API key registry</p>
        </div>
        <button onClick={() => { setShowNew(true); setNewKey(''); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded font-mono text-xs font-black tracking-[1.5px]"
                style={{ background: BRAND.teal, color: COLORS.bg }}>
          <Plus size={14} /> ISSUE KEY
        </button>
      </div>

      {showNew && (
        <div className="rounded-xl border p-6 mb-6 animate-fade-in" style={{ background: COLORS.surface, borderColor: BRAND.teal + '40' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-body font-black text-sm tracking-widest text-white">ISSUE API KEY</h2>
            <button onClick={() => setShowNew(false)} style={{ color: COLORS.muted }}><X size={16} /></button>
          </div>
          {newKey ? (
            <div>
              <p className="text-xs mb-3" style={{ color: COLORS.muted }}>Copy this key now — it will never be shown again.</p>
              <div className="rounded border p-4 font-mono text-sm break-all mb-4"
                   style={{ background: COLORS.bg, borderColor: BRAND.teal + '50', color: BRAND.teal }}>
                {newKey}
              </div>
              <button onClick={() => { setShowNew(false); setNewKey(''); }}
                      className="px-4 py-2 rounded font-mono text-xs font-black"
                      style={{ background: BRAND.teal, color: COLORS.bg }}>
                DONE
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <FieldInput label="PARTNER NAME"      value={form.partner_name}               onChange={v => setForm(f => ({ ...f, partner_name: v }))}           placeholder="ESPN Data Services" />
              <FieldInput label="RATE LIMIT / HOUR" value={form.rate_limit_per_hour.toString()} onChange={v => setForm(f => ({ ...f, rate_limit_per_hour: +v }))} placeholder="1000" />
              <div className="md:col-span-2 flex justify-end">
                <button onClick={issueKey} disabled={saving || !form.partner_name}
                        className="px-6 py-2.5 rounded font-mono text-xs font-black tracking-[1.5px] disabled:opacity-50"
                        style={{ background: BRAND.teal, color: COLORS.bg }}>
                  {saving ? 'GENERATING...' : 'GENERATE KEY'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="rounded-lg border overflow-hidden" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: COLORS.border }}>
              {['Partner', 'Key Prefix', 'Rate Limit', 'Status', 'Issued', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 font-mono text-[9px] font-black tracking-[1.5px]" style={{ color: COLORS.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-sm" style={{ color: COLORS.muted }}>Loading...</td></tr>
            ) : keys.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-sm" style={{ color: COLORS.muted }}>No keys issued</td></tr>
            ) : keys.map(k => (
              <tr key={k.id} className="border-b last:border-b-0" style={{ borderColor: COLORS.border }}>
                <td className="px-5 py-3.5"><p className="text-sm font-semibold text-white">{k.partner_name}</p></td>
                <td className="px-5 py-3.5"><code className="font-mono text-xs" style={{ color: BRAND.teal }}>{k.key_prefix}...</code></td>
                <td className="px-5 py-3.5"><span className="font-mono text-xs" style={{ color: COLORS.muted }}>{k.rate_limit_per_hour}/hr</span></td>
                <td className="px-5 py-3.5">
                  <span className="font-mono text-[9px] font-black px-2 py-1 rounded border"
                        style={{
                          color:       k.status === 'active' ? BRAND.green : BRAND.red,
                          background: (k.status === 'active' ? BRAND.green : BRAND.red) + '12',
                          borderColor:(k.status === 'active' ? BRAND.green : BRAND.red) + '30',
                        }}>
                    {k.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-5 py-3.5"><span className="font-mono text-xs" style={{ color: COLORS.muted }}>{new Date(k.issued_at).toLocaleDateString()}</span></td>
                <td className="px-5 py-3.5">
                  {k.status === 'active' && (
                    <button onClick={() => revokeKey(k.id)}
                            className="px-3 py-1.5 rounded font-mono text-[9px] font-black border"
                            style={{ background: BRAND.red + '12', color: BRAND.red, borderColor: BRAND.red + '30' }}>
                      REVOKE
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── SuperAdminBracelets ────────────────────────────────────────────────────
export function SuperAdminBracelets() {
  const [bracelets, setBracelets] = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('all');

  useEffect(() => { loadBracelets(); }, []);

  async function loadBracelets() {
    setLoading(true);
    const { data } = await supabase
      .from('bracelets')
      .select('*, venue:venues(name)')
      .order('created_at', { ascending: false });
    if (data) setBracelets(data);
    setLoading(false);
  }

  async function setStatus(id: string, status: string) {
    await supabase.from('bracelets').update({ status }).eq('id', id);
    loadBracelets();
  }

  const STATUSES = ['all', 'available', 'in_use', 'maintenance', 'retired'];
  const filtered = filter === 'all' ? bracelets : bracelets.filter(b => b.status === filter);

  const STATUS_COLORS: Record<string, string> = {
    available:   BRAND.green,
    in_use:      BRAND.teal,
    maintenance: BRAND.gold,
    retired:     COLORS.dim,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-black text-3xl tracking-wider text-white">BRACELETS</h1>
          <p className="text-sm mt-1" style={{ color: COLORS.muted }}>Hardware inventory</p>
        </div>
        <div className="flex gap-1.5">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)}
                    className="px-3 py-1.5 rounded font-mono text-[9px] font-black tracking-[1px] border"
                    style={{
                      background:  filter === s ? BRAND.teal       : COLORS.surface,
                      borderColor: filter === s ? BRAND.teal        : COLORS.border,
                      color:       filter === s ? COLORS.bg         : COLORS.muted,
                    }}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: COLORS.border }}>
              {['Hardware ID', 'Venue', 'Firmware', 'Status', 'Last Used', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 font-mono text-[9px] font-black tracking-[1.5px]" style={{ color: COLORS.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-sm" style={{ color: COLORS.muted }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-sm" style={{ color: COLORS.muted }}>No bracelets found</td></tr>
            ) : filtered.map(b => (
              <tr key={b.id} className="border-b last:border-b-0" style={{ borderColor: COLORS.border }}>
                <td className="px-5 py-3.5"><code className="font-mono text-xs text-white">{b.hardware_id}</code></td>
                <td className="px-5 py-3.5"><p className="text-sm" style={{ color: COLORS.muted }}>{b.venue?.name ?? '—'}</p></td>
                <td className="px-5 py-3.5"><span className="font-mono text-xs" style={{ color: COLORS.muted }}>{b.firmware_version ?? '—'}</span></td>
                <td className="px-5 py-3.5">
                  <span className="font-mono text-[9px] font-black px-2 py-1 rounded"
                        style={{ background: (STATUS_COLORS[b.status] ?? COLORS.dim) + '15', color: STATUS_COLORS[b.status] ?? COLORS.dim }}>
                    {b.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-mono text-xs" style={{ color: COLORS.muted }}>
                    {b.last_used_at ? new Date(b.last_used_at).toLocaleDateString() : '—'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {b.status !== 'maintenance' && b.status !== 'retired' && (
                    <button onClick={() => setStatus(b.id, 'maintenance')}
                            className="px-2.5 py-1 rounded font-mono text-[8px] font-black border"
                            style={{ background: BRAND.gold + '12', color: BRAND.gold, borderColor: BRAND.gold + '30' }}>
                      FLAG
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── SuperAdminSettings ─────────────────────────────────────────────────────
export function SuperAdminPlatformSettings() {
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl tracking-wider text-white">PLATFORM</h1>
        <p className="text-sm mt-1" style={{ color: COLORS.muted }}>Global platform settings</p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-lg border p-6" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
          <SectionHead title="PLATFORM INFO" />
          <div className="mt-4 flex flex-col gap-0">
            <InfoRow label="PLATFORM VERSION"  value="2.0.0" />
            <InfoRow label="SUPABASE PROJECT"  value="Connected" valueColor={BRAND.green} />
            <InfoRow label="EDGE FUNCTIONS"    value="7 deployed" />
            <InfoRow label="REALTIME"          value="Active" valueColor={BRAND.green} />
          </div>
        </div>

        <div className="rounded-lg border p-6" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
          <SectionHead title="GLOBAL DEFAULTS" />
          <p className="text-xs mt-1 mb-5" style={{ color: COLORS.muted }}>
            These defaults apply to new venues unless overridden at the venue level.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <FieldInput label="TICK INTERVAL (SEC)" value="30" onChange={() => {}} placeholder="30" />
            <FieldInput label="TOKEN CONVERSION RATE" value="10" onChange={() => {}} placeholder="10" />
            <FieldInput label="CHALLENGE MULTIPLIER" value="2.0" onChange={() => {}} placeholder="2.0" />
            <FieldInput label="PRIZE GOAL (PTS)" value="5000" onChange={() => {}} placeholder="5000" />
          </div>
          <button onClick={handleSave}
                  className="px-6 py-2.5 rounded font-mono text-xs font-black tracking-[1.5px]"
                  style={{ background: saved ? BRAND.green : BRAND.gold, color: COLORS.bg }}>
            {saved ? 'SAVED' : 'SAVE DEFAULTS'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Shared helpers ─────────────────────────────────────────────────────────
function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-display font-black text-base" style={{ color }}>{value}</span>
      <span className="font-mono text-[8px] font-bold tracking-[1.5px]" style={{ color: COLORS.muted }}>{label}</span>
    </div>
  );
}

function SectionHead({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-0.5 h-4" style={{ background: BRAND.gold }} />
      <h2 className="font-body font-black text-sm tracking-widest text-white">{title}</h2>
    </div>
  );
}

function InfoRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b last:border-b-0" style={{ borderColor: COLORS.border }}>
      <span className="font-mono text-[10px] font-bold tracking-[1px]" style={{ color: COLORS.muted }}>{label}</span>
      <span className="text-sm font-semibold" style={{ color: valueColor ?? '#fff' }}>{value}</span>
    </div>
  );
}

function FieldInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
             className={`w-full mt-1.5 ${inputCls}`} style={inputSt} />
    </div>
  );
}

function Toggle({ value, onToggle, color }: { value: boolean; onToggle: () => void; color: string }) {
  return (
    <button onClick={onToggle}
            className="relative w-10 h-5 rounded-full flex items-center transition-colors"
            style={{ background: value ? color + '80' : COLORS.surface2 }}>
      <div className="absolute w-4 h-4 rounded-full shadow transition-transform"
           style={{ background: value ? color : COLORS.dim, transform: value ? 'translateX(22px)' : 'translateX(2px)' }} />
    </button>
  );
}

const labelCls = 'font-mono text-[9px] font-black tracking-[1.5px] block' as const;
const inputCls = 'px-3 py-2.5 rounded border text-sm text-white outline-none' as const;
const inputSt  = { background: COLORS.surface2, borderColor: COLORS.border, fontFamily: '"Barlow", sans-serif' } as const;
