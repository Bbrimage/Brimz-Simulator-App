import { useState } from 'react';
import { useSim } from '../../../context/SimulatorContext';
import { BRAND, COLORS, APP_VERSION } from '../../../constants';

export default function SettingsScreen() {
  const { disconnect } = useSim();
  const [notifs,  setNotifs]  = useState(true);
  const [ledSync, setLedSync] = useState(true);
  const [vibrate, setVibrate] = useState(true);

  return (
    <div className="phone-scroll h-full" style={{ background: COLORS.bg }}>

      {/* Profile card */}
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
        <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center font-display font-black text-[22px] border-2"
             style={{ background: BRAND.teal, borderColor: BRAND.teal, color: COLORS.bg }}>
          S
        </div>
        <div className="flex-1">
          <p className="font-body text-base font-black text-white">SagaFan</p>
          <p className="text-[10px] mt-0.5" style={{ color: COLORS.muted }}>demo@brimz.tech</p>
          <div className="flex items-center gap-1.5 mt-1.5 self-start px-2 py-0.5 rounded border"
               style={{ background: BRAND.teal + '12', borderColor: BRAND.teal + '30', display: 'inline-flex' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND.teal }} />
            <span className="font-mono text-[9px] font-black tracking-[1px]" style={{ color: BRAND.teal }}>BRIMZ MEMBER</span>
          </div>
        </div>
      </div>

      {/* Account */}
      <GroupLabel label="ACCOUNT" />
      <SettingGroup>
        <SettingRow icon="ID"  label="Edit Profile"    arrow />
        <Divider />
        <SettingRow icon="PW"  label="Change Password" arrow />
      </SettingGroup>

      {/* Preferences */}
      <GroupLabel label="PREFERENCES" />
      <SettingGroup>
        <SettingRow icon="NF"  label="Notifications"       toggle={{ value: notifs,  set: setNotifs }}  />
        <Divider />
        <SettingRow icon="LED" label="Wristband LED Sync"  toggle={{ value: ledSync, set: setLedSync }} />
        <Divider />
        <SettingRow icon="VB"  label="Vibration"           toggle={{ value: vibrate, set: setVibrate }} />
      </SettingGroup>

      {/* Privacy */}
      <GroupLabel label="PRIVACY & DATA" />
      <SettingGroup>
        <a href="/privacy" target="_blank">
          <SettingRow icon="PR"  label="Privacy Policy"   arrow />
        </a>
        <Divider />
        <a href="/terms" target="_blank">
          <SettingRow icon="TC"  label="Terms of Service" arrow />
        </a>
        <Divider />
        <SettingRow icon="DEL" label="Delete My Data"     arrow danger />
      </SettingGroup>

      {/* App */}
      <GroupLabel label="APP" />
      <SettingGroup>
        <SettingRow icon="VR"  label="Version"  value={APP_VERSION} />
      </SettingGroup>

      {/* Sign out */}
      <div className="mx-3.5 mt-3 mb-10">
        <button onClick={disconnect}
                className="w-full py-2.5 rounded border font-mono text-xs font-black tracking-[1.5px]"
                style={{ background: BRAND.red + '12', borderColor: BRAND.red + '30', color: BRAND.red }}>
          DISCONNECT
        </button>
      </div>
    </div>
  );
}

function GroupLabel({ label }: { label: string }) {
  return (
    <p className="font-mono text-[9px] font-black tracking-[2px] ml-4 mt-4 mb-1.5" style={{ color: COLORS.muted }}>
      {label}
    </p>
  );
}

function SettingGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-3.5 rounded-lg overflow-hidden border" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px ml-12" style={{ background: COLORS.border }} />;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
            className="relative w-10 h-5 rounded-full transition-colors flex items-center"
            style={{ background: value ? BRAND.teal + '80' : COLORS.surface2 }}>
      <div className="absolute w-4 h-4 rounded-full transition-transform shadow"
           style={{
             background: value ? BRAND.teal : COLORS.dim,
             transform: value ? 'translateX(22px)' : 'translateX(2px)',
           }} />
    </button>
  );
}

function SettingRow({
  icon, label, value, arrow, danger, toggle,
}: {
  icon: string; label: string; value?: string;
  arrow?: boolean; danger?: boolean;
  toggle?: { value: boolean; set: (v: boolean) => void };
}) {
  return (
    <div className="flex items-center gap-2.5 p-3 px-3.5">
      <div className="w-7 h-7 rounded flex items-center justify-center border shrink-0"
           style={{
             background:   danger ? BRAND.red + '10' : COLORS.surface2,
             borderColor:  danger ? BRAND.red + '40' : COLORS.border,
           }}>
        <span className="font-mono text-[8px] font-black" style={{ color: danger ? BRAND.red : COLORS.muted }}>
          {icon}
        </span>
      </div>
      <span className="flex-1 text-xs font-semibold" style={{ color: danger ? BRAND.red : '#fff' }}>{label}</span>
      {value    && <span className="text-[10px]" style={{ color: COLORS.muted }}>{value}</span>}
      {toggle   && <Toggle value={toggle.value} onChange={toggle.set} />}
      {arrow    && <span style={{ color: COLORS.dim, fontSize: 16 }}>›</span>}
    </div>
  );
}
