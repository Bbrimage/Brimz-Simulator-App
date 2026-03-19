import { useSim } from '../../context/SimulatorContext';
import { BRAND, COLORS } from '../../constants';
import type { SimScreen } from '../../types';

interface Tab {
  id: SimScreen;
  label: string;
  icon: React.ReactNode;
  center?: boolean;
}

export default function BottomNav() {
  const { state, setScreen } = useSim();
  const active = state.screen;

  const tabs: Tab[] = [
    { id: 'home',     label: 'HOME',    icon: <HomeIcon />    },
    { id: 'stats',    label: 'STATS',   icon: <StatsIcon />   },
    { id: 'energy',   label: '',        icon: <BIcon />, center: true },
    { id: 'rewards',  label: 'REWARDS', icon: <GiftIcon />    },
    { id: 'settings', label: 'ACCOUNT', icon: <UserIcon />    },
  ];

  return (
    <div className="flex items-center border-t shrink-0"
         style={{ background: COLORS.surface, borderColor: COLORS.border, height: 56 }}>
      {tabs.map(tab => {
        const isActive = active === tab.id;

        if (tab.center) {
          return (
            <button key={tab.id} onClick={() => setScreen(tab.id)}
                    className="flex-1 flex items-center justify-center relative"
                    style={{ height: 56 }}>
              {/* Center hex button */}
              <div className="flex items-center justify-center w-10 h-10 rounded-lg font-display font-black text-lg transition-all"
                   style={{
                     background: isActive ? BRAND.teal : COLORS.surface2,
                     color:      isActive ? COLORS.bg  : COLORS.muted,
                     boxShadow:  isActive ? `0 0 16px ${BRAND.teal}60` : 'none',
                   }}>
                B
              </div>
            </button>
          );
        }

        return (
          <button key={tab.id} onClick={() => setScreen(tab.id)}
                  className="flex-1 flex flex-col items-center justify-center gap-1 transition-opacity"
                  style={{ height: 56, opacity: isActive ? 1 : 0.5 }}>
            <div style={{ color: isActive ? BRAND.teal : COLORS.muted }}>
              {tab.icon}
            </div>
            <span className="font-mono text-[8px] font-black tracking-[1px]"
                  style={{ color: isActive ? BRAND.teal : COLORS.muted }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function StatsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
    </svg>
  );
}

function BIcon() {
  return <span style={{ fontSize: 20, fontFamily: '"Barlow Condensed"', fontWeight: 900 }}>⬡</span>;
}

function GiftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"/>
      <rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
