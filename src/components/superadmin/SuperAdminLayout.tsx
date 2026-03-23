import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext';
import { BRAND, COLORS } from '../../constants';
import {
  LayoutDashboard, Building2, Network,
  Key, HardDrive, Settings, LogOut, Menu, X, ChevronRight, Shield, UserCheck,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/superadmin/dashboard', label: 'Network Overview', icon: LayoutDashboard },
  { to: '/superadmin/venues',    label: 'Venues',           icon: Building2 },
  { to: '/superadmin/network',   label: 'Live Network',     icon: Network },
  { to: '/superadmin/access',    label: 'Access Requests',  icon: UserCheck },
  { to: '/superadmin/apikeys',   label: 'API Keys',         icon: Key },
  { to: '/superadmin/bracelets', label: 'Bracelets',        icon: HardDrive },
  { to: '/superadmin/settings',  label: 'Platform',         icon: Settings },
];

export default function SuperAdminLayout() {
  const { superAdmin, signOut } = useSuperAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate('/superadmin/login');
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: COLORS.bg }}>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        flex flex-col w-[220px] shrink-0 border-r
        transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
             style={{ background: COLORS.surface, borderColor: COLORS.border }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: COLORS.border }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
               style={{ background: BRAND.gold + '20', border: `1px solid ${BRAND.gold}40` }}>
            <Shield size={16} color={BRAND.gold} />
          </div>
          <div>
            <div className="font-display font-black text-base tracking-widest text-white">BRIMZ</div>
            <div className="font-mono text-[9px] tracking-[2px]" style={{ color: BRAND.gold }}>SUPER ADMIN</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden" style={{ color: COLORS.muted }}>
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-item flex items-center gap-3 px-3 py-2.5 rounded ${isActive ? 'text-white' : 'text-[#6B7280] hover:text-white'}`
              }
              style={({ isActive }) => ({
                background:  isActive ? BRAND.gold + '15' : 'transparent',
                borderLeft:  isActive ? `2px solid ${BRAND.gold}` : '2px solid transparent',
              })}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={15} color={isActive ? BRAND.gold : undefined} />
                  <span className="flex-1 font-mono text-[11px] font-bold tracking-[0.5px]">{item.label}</span>
                  {isActive && <ChevronRight size={12} style={{ color: BRAND.gold }} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t p-3" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-[10px] font-black shrink-0"
                 style={{ background: BRAND.gold + '20', color: BRAND.gold, border: `1px solid ${BRAND.gold}40` }}>
              {(superAdmin?.full_name ?? 'SA').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">{superAdmin?.full_name ?? 'Super Admin'}</div>
              <div className="font-mono text-[9px]" style={{ color: BRAND.gold }}>BRIMZ INTERNAL</div>
            </div>
            <button onClick={handleSignOut} className="shrink-0 hover:opacity-80 transition-opacity" style={{ color: COLORS.muted }}>
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center gap-4 px-5 py-3.5 border-b shrink-0"
                style={{ background: COLORS.surface, borderColor: COLORS.border }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden" style={{ color: COLORS.muted }}>
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <span className="font-mono text-[10px] font-bold tracking-[1px] px-2 py-1 rounded"
                style={{ background: BRAND.gold + '12', color: BRAND.gold, border: `1px solid ${BRAND.gold}30` }}>
            SUPER ADMIN — INTERNAL USE ONLY
          </span>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
