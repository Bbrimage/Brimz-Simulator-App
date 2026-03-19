import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BRAND, COLORS } from '../../constants';
import {
  LayoutDashboard, Radio, Calendar, FileText,
  Gift, Users, Settings, LogOut, Menu, X, ChevronRight,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/admin/dashboard', label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/admin/live',      label: 'Live Event',   icon: Radio,           badge: 'LIVE' },
  { to: '/admin/events',    label: 'Events',       icon: Calendar },
  { to: '/admin/content',   label: 'Content',      icon: FileText },
  { to: '/admin/rewards',   label: 'Rewards',      icon: Gift },
  { to: '/admin/fans',      label: 'Fans',         icon: Users },
  { to: '/admin/settings',  label: 'Settings',     icon: Settings },
];

export default function AdminLayout() {
  const { adminUser, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate('/admin/login');
  }

  const venueName = (adminUser as any)?.venue?.name ?? 'Venue';
  const initials  = (adminUser?.full_name ?? 'A').slice(0, 2).toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: COLORS.bg }}>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden"
             onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        flex flex-col w-[220px] shrink-0 border-r
        transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
             style={{ background: COLORS.surface, borderColor: COLORS.border }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: COLORS.border }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-base"
               style={{ background: BRAND.teal, color: COLORS.bg }}>B</div>
          <div>
            <div className="font-display font-black text-base tracking-widest text-white">BRIMZ</div>
            <div className="font-mono text-[9px] tracking-[2px]" style={{ color: COLORS.muted }}>ADMIN PORTAL</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden" style={{ color: COLORS.muted }}>
            <X size={16} />
          </button>
        </div>

        {/* Venue badge */}
        <div className="mx-3 my-3 px-3 py-2 rounded border"
             style={{ background: BRAND.teal + '0A', borderColor: BRAND.teal + '30' }}>
          <div className="font-mono text-[8px] font-black tracking-[2px] mb-0.5" style={{ color: BRAND.teal }}>
            VENUE
          </div>
          <div className="text-xs font-bold text-white truncate">{venueName}</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pb-3 overflow-y-auto space-y-0.5">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                sidebar-item flex items-center gap-3 px-3 py-2.5 rounded
                ${isActive
                  ? 'text-white'
                  : 'text-[#6B7280] hover:text-white'
                }
              `}
              style={({ isActive }) => ({
                background: isActive ? BRAND.teal + '18' : 'transparent',
                borderLeft: isActive ? `2px solid ${BRAND.teal}` : '2px solid transparent',
              })}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={15} color={isActive ? BRAND.teal : undefined} />
                  <span className="flex-1 font-mono text-[11px] font-bold tracking-[0.5px]">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="font-mono text-[8px] font-black px-1.5 py-0.5 rounded animate-live-dot"
                          style={{ background: BRAND.red + '20', color: BRAND.red }}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight size={12} style={{ color: BRAND.teal }} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t p-3" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-[11px] font-black shrink-0"
                 style={{ background: BRAND.teal + '20', color: BRAND.teal, border: `1px solid ${BRAND.teal}40` }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {adminUser?.full_name ?? 'Admin'}
              </div>
              <div className="font-mono text-[9px] capitalize" style={{ color: COLORS.muted }}>
                {adminUser?.role?.replace('_', ' ') ?? 'operator'}
              </div>
            </div>
            <button onClick={handleSignOut} className="shrink-0 hover:opacity-80 transition-opacity"
                    style={{ color: COLORS.muted }}>
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-4 px-5 py-3.5 border-b shrink-0"
                style={{ background: COLORS.surface, borderColor: COLORS.border }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden" style={{ color: COLORS.muted }}>
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-live-dot" style={{ background: BRAND.green }} />
            <span className="font-mono text-[10px] font-bold tracking-[1px]" style={{ color: BRAND.green }}>
              SUPABASE CONNECTED
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
