import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BRAND, COLORS } from '../../constants';
import { Plus, X, Pin } from 'lucide-react';
import type { AdminPost } from '../../types';

const TAGS = ['GAMEDAY', 'PROMO', 'TEAM NEWS', 'BRIMZ CHALLENGE', 'INSIDE ACCESS', 'GAMEDAY INFO'];

export default function AdminContent() {
  const { adminUser } = useAdminAuth();
  const venueId = (adminUser as any)?.venue_id;

  const [posts,   setPosts]   = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', tag: 'GAMEDAY', pinned: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (venueId) loadPosts(); }, [venueId]);

  async function loadPosts() {
    setLoading(true);
    const { data } = await supabase
      .from('admin_posts').select('*').eq('venue_id', venueId)
      .order('created_at', { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  }

  async function createPost() {
    if (!form.title) return;
    setSaving(true);
    await supabase.from('admin_posts').insert({
      venue_id:  venueId,
      title:     form.title,
      body:      form.body || null,
      tag:       form.tag,
      pinned:    form.pinned,
      published: true,
    });
    setForm({ title: '', body: '', tag: 'GAMEDAY', pinned: false });
    setShowNew(false);
    setSaving(false);
    loadPosts();
  }

  async function togglePublish(id: string, published: boolean) {
    await supabase.from('admin_posts').update({ published: !published }).eq('id', id);
    loadPosts();
  }

  async function deletePost(id: string) {
    await supabase.from('admin_posts').delete().eq('id', id);
    loadPosts();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl tracking-wider text-white">CONTENT</h1>
          <p className="text-sm mt-1" style={{ color: COLORS.muted }}>Posts and promos shown in the fan app</p>
        </div>
        <button onClick={() => setShowNew(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded font-mono text-xs font-black tracking-[1.5px]"
                style={{ background: BRAND.teal, color: COLORS.bg }}>
          <Plus size={14} />
          NEW POST
        </button>
      </div>

      {showNew && (
        <div className="rounded-xl border p-6 mb-6 animate-fade-in" style={{ background: COLORS.surface, borderColor: BRAND.teal + '40' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-body font-black text-sm tracking-widest text-white">NEW POST</h2>
            <button onClick={() => setShowNew(false)} style={{ color: COLORS.muted }}><X size={16} /></button>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <Label>TITLE</Label>
              <Input value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="Post headline" />
            </div>
            <div>
              <Label>BODY (OPTIONAL)</Label>
              <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                        placeholder="Post body text..."
                        rows={3}
                        className="w-full px-3 py-2.5 rounded border text-sm text-white outline-none resize-none"
                        style={{ background: COLORS.surface2, borderColor: COLORS.border, fontFamily: '"Barlow", sans-serif' }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>TAG</Label>
                <select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded border text-sm text-white outline-none"
                        style={{ background: COLORS.surface2, borderColor: COLORS.border, fontFamily: '"Barlow", sans-serif' }}>
                  {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={() => setForm(f => ({ ...f, pinned: !f.pinned }))}
                        className="flex items-center gap-2 px-4 py-2.5 rounded border font-mono text-xs font-black tracking-[1px] w-full justify-center"
                        style={{
                          background:  form.pinned ? BRAND.gold + '18' : COLORS.surface2,
                          borderColor: form.pinned ? BRAND.gold + '50' : COLORS.border,
                          color:       form.pinned ? BRAND.gold         : COLORS.muted,
                        }}>
                  <Pin size={12} />
                  {form.pinned ? 'PINNED' : 'PIN TO TOP'}
                </button>
              </div>
            </div>
            <button onClick={createPost} disabled={saving || !form.title}
                    className="self-end px-6 py-2.5 rounded font-mono text-xs font-black tracking-[1.5px] disabled:opacity-50"
                    style={{ background: BRAND.teal, color: COLORS.bg }}>
              {saving ? 'PUBLISHING...' : 'PUBLISH POST'}
            </button>
          </div>
        </div>
      )}

      {/* Posts list */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="text-center py-10 text-sm" style={{ color: COLORS.muted }}>Loading...</div>
        ) : posts.length === 0 ? (
          <div className="rounded-lg border p-10 text-center" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
            <p className="text-sm" style={{ color: COLORS.muted }}>No posts yet. Create your first post above.</p>
          </div>
        ) : posts.map(post => (
          <div key={post.id} className="rounded-lg border p-4 flex items-start gap-4"
               style={{ background: COLORS.surface, borderColor: post.pinned ? BRAND.gold + '30' : COLORS.border }}>
            {post.pinned && <Pin size={14} style={{ color: BRAND.gold, marginTop: 2, flexShrink: 0 }} />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[8px] font-black tracking-[1.5px] px-1.5 py-0.5 rounded"
                      style={{ background: BRAND.teal + '18', color: BRAND.teal }}>
                  {post.tag}
                </span>
                <span className="font-mono text-[9px]" style={{ color: COLORS.muted }}>
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm font-semibold text-white">{post.title}</p>
              {post.body && <p className="text-xs mt-1 line-clamp-2" style={{ color: COLORS.muted }}>{post.body}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => togglePublish(post.id, post.published)}
                      className="px-3 py-1.5 rounded font-mono text-[9px] font-black tracking-[1px] border"
                      style={{
                        background:  post.published ? BRAND.green + '15' : COLORS.surface2,
                        borderColor: post.published ? BRAND.green + '40' : COLORS.border,
                        color:       post.published ? BRAND.green         : COLORS.muted,
                      }}>
                {post.published ? 'LIVE' : 'DRAFT'}
              </button>
              <button onClick={() => deletePost(post.id)} style={{ color: COLORS.dim }}>
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Label({ children }: { children: string }) {
  return <label className="font-mono text-[9px] font-black tracking-[1.5px] block mb-1.5" style={{ color: COLORS.muted }}>{children}</label>;
}
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
           className="w-full px-3 py-2.5 rounded border text-sm text-white outline-none"
           style={{ background: COLORS.surface2, borderColor: COLORS.border, fontFamily: '"Barlow", sans-serif' }} />
  );
}
