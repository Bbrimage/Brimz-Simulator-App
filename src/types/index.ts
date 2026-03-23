// ── Enums / Literals ─────────────────────────────────────────────────────

export type ContractStatus  = 'active' | 'suspended' | 'expired';
export type BraceletStatus  = 'available' | 'in_use' | 'maintenance' | 'retired';
export type EventStatus     = 'scheduled' | 'active' | 'completed' | 'cancelled';
export type ChallengeStatus = 'scheduled' | 'active' | 'completed';
export type ChallengeType   = 'clap' | 'cheer' | 'wave' | 'custom';
export type TriggeredBy     = 'manual' | 'ai';
export type RewardType      = 'food' | 'merch' | 'ticket' | 'social' | 'custom';
export type OperatorMode    = 'manual' | 'assisted' | 'auto';
export type ApiKeyStatus    = 'active' | 'suspended' | 'revoked';
export type LedPattern      = 'solid' | 'pulse' | 'wave' | 'flash' | 'rainbow';
export type LeagueFilter    = 'global' | 'nfl' | 'nba' | 'mlb' | 'wrestling' | 'special';

// ── Database Types ────────────────────────────────────────────────────────

export interface Fan {
  id: string;
  auth_user_id: string;
  email: string | null;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  total_tokens: number;
  energy_spent: number;
  tokens_balance: number;
  total_events: number;
  created_at: string;
  updated_at: string;
}

export interface Venue {
  id: string;
  name: string;
  slug: string;
  team_name: string | null;
  primary_color: string;
  secondary_color: string;
  logo_url: string | null;
  contract_status: ContractStatus;
  api_access_enabled: boolean;
  ai_mode_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface VenueSettings {
  id: string;
  venue_id: string;
  motion_weight: number;
  audio_weight: number;
  hr_weight: number;
  challenge_multiplier: number;
  tick_interval_seconds: number;
  token_conversion_rate: number;
  operator_mode: OperatorMode;
}

export type AdminStatus = 'pending' | 'approved' | 'suspended';

export interface AdminUser {
  id: string;
  auth_user_id: string;
  venue_id: string | null;
  role: 'operator' | 'venue_admin';
  status: AdminStatus;
  full_name: string | null;
  created_at: string;
  venue?: Venue;
}

export interface VenueInquiry {
  id: string;
  org_name: string;
  league: string | null;
  capacity: string | null;
  contact_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  reviewed: boolean;
  created_at: string;
}

export interface SuperAdmin {
  id: string;
  auth_user_id: string;
  full_name: string;
  created_at: string;
}

export interface Bracelet {
  id: string;
  hardware_id: string;
  venue_id: string;
  firmware_version: string | null;
  status: BraceletStatus;
  last_used_at: string | null;
  created_at: string;
  venue?: Venue;
}

export interface Event {
  id: string;
  venue_id: string;
  name: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  status: EventStatus;
  total_fans_connected: number;
  avg_energy_score: number;
  total_tokens_distributed: number;
  created_at: string;
  updated_at: string;
  venue?: Venue;
}

export interface Session {
  id: string;
  fan_id: string;
  event_id: string;
  bracelet_id: string;
  section: string | null;
  connected_at: string;
  disconnected_at: string | null;
  energy_score: number;
  tokens_earned: number;
  hr_baseline: number | null;
  fan?: Fan;
}

export interface Challenge {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  type: ChallengeType;
  duration_seconds: number;
  token_bonus: number;
  badge_id: string | null;
  status: ChallengeStatus;
  triggered_by: TriggeredBy;
  starts_at: string | null;
  activated_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface Reward {
  id: string;
  venue_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  token_cost: number;
  reward_type: RewardType;
  voucher_prefix: string | null;
  active: boolean;
  available_from: string | null;
  available_until: string | null;
  max_redemptions: number | null;
  total_redeemed: number;
  created_at: string;
}

export interface AdminPost {
  id: string;
  venue_id: string;
  event_id: string | null;
  title: string;
  body: string | null;
  image_url: string | null;
  tag: string;
  pinned: boolean;
  published: boolean;
  created_at: string;
}

export interface Promo {
  id: string;
  venue_id: string | null;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  cta_text: string;
  cta_url: string | null;
  active: boolean;
  expires_at: string | null;
}

export interface ApiKey {
  id: string;
  partner_name: string;
  venue_id: string | null;
  key_prefix: string;
  scopes: string[];
  rate_limit_per_hour: number;
  status: ApiKeyStatus;
  agreement_signed: boolean;
  issued_at: string;
  last_used_at: string | null;
  expires_at: string | null;
}

// ── Simulator Types ────────────────────────────────────────────────────────

export type FanType    = 'super' | 'engaged' | 'casual' | 'distracted';
export type CrowdLevel = 'electric' | 'energized' | 'average' | 'quiet';
export type SimDuration = 'instant' | '1min' | '3min';

export type SimScreen = 'connect' | 'home' | 'stats' | 'energy' | 'rewards' | 'settings';

export interface SimFeedItem {
  id: string;
  type: 'energy_drop' | 'challenge_complete' | 'challenge_missed' | 'reward_unlocked' | 'session_started' | 'admin_message';
  title: string;
  subtitle?: string;
  points?: number;
  admin_name?: string;
  ts: number;
}

export interface SimChallenge {
  id: string;
  name: string;
  description: string;
  reward_type: 'multiplier' | 'bonus_pts';
  reward_value: number;
  duration_seconds: number;
  elapsed: number;
  participant_count: number;
}

export interface SimState {
  connected: boolean;
  screen: SimScreen;
  energyScore: number;
  energySpent: number;
  challenge: SimChallenge | null;
  feed: SimFeedItem[];
  isSimulating: boolean;
  simulationProgress: number;
  fanType: FanType;
  crowdLevel: CrowdLevel;
}

export interface SimReward {
  id: string;
  name: string;
  description: string;
  token_cost: number;
  reward_type: RewardType;
  expires_at: string | null;
}
