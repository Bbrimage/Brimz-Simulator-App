import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BRAND, COLORS } from '../../constants';
import { Plus, X } from 'lucide-react';
import type { Event, EventStatus } from '../../types';

export default function AdminEvents() {
  const { adminUser } = useAdminAuth();
  const venueId = (adminUser as any)?.venue_id;

  const [events,  setEvents]  = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: '', event_date: '', start_time: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (venueId) loadEvents(); }, [venueId]);

  async function loadEvents() {
    setLoading(true);
    const { data } = await supabase
      .from('events').select('*').eq('venue_id', venueId)
      .order('event_date', { ascending: false });
    if (data) setEvents(data);
    setLoading(false);
  }

  async function createEvent() {
    if (!form.name || !form.event_date) return;
    setSaving(true);
    await supabase.from('events').insert({
      venue_id:   venueId,
      name:       form.name,
      event_date: form.event_date,
      start_time: form.start_time ? `${form.event_date}T${form.start_time}:00` : null,
      status:     'scheduled',
    });
    setForm({ name: '', event_date: '', start_time: '' });
    setShowNew(false);
    setSaving(false);
    loadEvents();
  }

  async function setStatus(id: string, status: EventStatus) {
    await supabase.from('events').update({ status }).eq('id', id);
    loadEvents();
  }

  const STATUS_COLORS: Record<EventStatus, string> = {
    active:    BRAND.green,
    scheduled: BRAND.gold,
    completed: COLORS.muted,
    cancelled: BRAND.red,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl tracking-wider text-white">EVENTS</h1>
          <p className="text-sm mt-1" style={{ color: COLORS.muted }}>Manage your event schedule</p>
        </div>
        <button onClick={() => setShowNew(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded font-mono text-xs font-black tracking-[1.5px]"
                style={{ background: BRAND.teal, color: COLORS.bg }}>
          <Plus size={14} />
          NEW EVENT
        </button>
      </div>

      {/* New event form */}
      {showNew && (
        <div className="rounded-xl border p-6 mb-6 animate-fade-in" style={{ background: COLORS.surface, borderColor: BRAND.teal + '40' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-body font-black text-sm tracking-widest text-white">NEW EVENT</h2>
            <button onClick={() => setShowNew(false)} style={{ color: COLORS.muted }}><X size={16} /></button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <Label>EVENT NAME</Label>
              <Input value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Ravens vs Chiefs — Week 14" />
            </div>
            <div>
              <Label>DATE</Label>
              <Input type="date" value={form.event_date} onChange={v => setForm(f => ({ ...f, event_date: v }))} />
            </div>
            <div>
              <Label>START TIME (OPTIONAL)</Label>
              <Input type="time" value={form.start_time} onChange={v => setForm(f => ({ ...f, start_time: v }))} />
            </div>
            <div className="flex items-end">
              <button onClick={createEvent} disabled={saving || !form.name || !form.event_date}
                      className="w-full py-2.5 rounded font-mono text-xs font-black tracking-[1.5px] disabled:opacity-50"
                      style={{ background: BRAND.teal, color: COLORS.bg }}>
                {saving ? 'CREATING...' : 'CREATE EVENT'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events table */}
      <div className="rounded-lg border overflow-hidden" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: COLORS.border }}>
              {['Event', 'Date', 'Status', 'Fans', 'Avg Energy', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 font-mono text-[9px] font-black tracking-[1.5px]"
                    style={{ color: COLORS.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10 text-sm" style={{ color: COLORS.muted }}>Loading...</td></tr>
            ) : events.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-sm" style={{ color: COLORS.muted }}>No events yet</td></tr>
            ) : events.map(event => (
              <tr key={event.id} className="border-b last:border-b-0" style={{ borderColor: COLORS.border }}>
                <td className="px-5 py-3.5">
                  <p className="text-sm font-semibold text-white">{event.name}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="font-mono text-xs" style={{ color: COLORS.muted }}>
                    {new Date(event.event_date).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-mono text-[9px] font-black px-2 py-1 rounded border"
                        style={{
                          color:       STATUS_COLORS[event.status],
                          background:  STATUS_COLORS[event.status] + '15',
                          borderColor: STATUS_COLORS[event.status] + '40',
                        }}>
                    {event.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-display font-black text-sm" style={{ color: BRAND.teal }}>
                    {event.total_fans_connected.toLocaleString()}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-display font-black text-sm" style={{ color: BRAND.gold }}>
                    {Math.round(event.avg_energy_score).toLocaleString()}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    {event.status === 'scheduled' && (
                      <ActionBtn label="START" color={BRAND.green} onClick={() => setStatus(event.id, 'active')} />
                    )}
                    {event.status === 'active' && (
                      <ActionBtn label="END" color={BRAND.red} onClick={() => setStatus(event.id, 'completed')} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Label({ children }: { children: string }) {
  return <label className="font-mono text-[9px] font-black tracking-[1.5px] block mb-1.5" style={{ color: COLORS.muted }}>{children}</label>;
}
function Input({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
           className="w-full px-3 py-2.5 rounded border text-sm text-white outline-none"
           style={{ background: COLORS.surface2, borderColor: COLORS.border, fontFamily: '"Barlow", sans-serif' }} />
  );
}
function ActionBtn({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="px-3 py-1.5 rounded font-mono text-[9px] font-black tracking-[1px]"
            style={{ background: color + '20', color, border: `1px solid ${color}40` }}>
      {label}
    </button>
  );
}
