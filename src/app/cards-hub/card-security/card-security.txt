import { Component, signal, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ============================================================
 * PayMo — Card Security & Fraud Prevention (Page 5.7)
 * Standalone Angular 17+ component.
 * Modern @if / @for control flow in template (no *ngIf / *ngFor).
 * All state is signal-based for change detection safety.
 * Data models are typed and ready for API integration.
 * ALL mock data lives in TS signals — the template is fully
 * declarative (no hardcoded lists, stats, options, or amounts).
 * ============================================================ */

/* ============================================================
 * Data models (replace mock arrays with API calls)
 * ============================================================ */

/* ---------- Existing models (page sections + audit log) ---------- */

export type SuspiciousStatus = 'blocked' | 'flagged' | 'cleared';

export interface SuspiciousActivity {
  id: string;
  date: string;
  merchant: string;
  country: string;        // ISO code shown in parentheses
  cardType: 'Virtual' | 'Physical';
  last4: string;
  amount: number;
  status: SuspiciousStatus;
  reason: string;
  highlightDanger?: boolean;
}

export interface ActiveRule {
  id: string;
  name: string;
  description: string;
  editModal: string;
}

export type DisputeStatus = 'awaiting' | 'resolved' | 'review';

export interface DisputeIncident {
  id: string;
  caseId: string;
  type: string;
  cardType: 'Virtual' | 'Physical';
  last4: string;
  amount: number;
  status: DisputeStatus;
  actionLabel: string;
  actionModal: string;
}

export interface AuditLogEntry {
  id: string;
  time: string;
  action: string;
  user: string;
  ip: string;
}

export interface ProcessedResult {
  modalId: string;
  message: string;
  ref: string;
}

/* ---------- Hero stats row ---------- */

export interface HeroStatBreakdownItem {
  label: string;
  value: string;
  color?: string;
}

export interface HeroStat {
  id: string;
  cardClass: string;            // 'pm-card pm-card-accent' (dark) or 'pm-card' (light)
  cardStyle: string;            // inline style string (min-height + optional border-top)
  accentVar: string;            // CSS var for the accent color
  label: string;                // uppercase stat label
  labelClass: string;           // '' for dark card (custom inline style), 'pm-stat-label' for light
  labelStyle: string;           // inline style for the label
  value: string;                // main value ('92', '14', 'KES 42.5K', '2')
  valueStyle: string;           // inline style for the value
  valueSuffix?: string;         // optional suffix ('/100', ' rules running', ' devices')
  valueSuffixStyle?: string;    // inline style for the suffix span
  subtext?: string;             // small text below value (dark card only)
  subtextStyle?: string;        // inline style for subtext
  subtextHighlight?: string;    // highlighted portion of subtext (green text)
  subtextHighlightStyle?: string;
  badgeIcon?: string;           // icon class for the badge
  badgeText?: string;           // badge label
  badgeClass?: string;          // badge classes (e.g. 'pm-badge pm-badge-success')
  actionLabel: string;          // action button label
  actionModal: string;          // modal to open when button clicked
  actionBtnClass: string;       // action button classes
  actionBtnStyle?: string;      // action button inline style (dark card only)
  breakdownItems?: HeroStatBreakdownItem[]; // reserved for risk breakdown (card 3), API-ready
}

/* ---------- Device binding (section 5.7.2 + device binding modal) ---------- */

export interface BoundDevice {
  id: string;
  icon: string;                 // 'bi bi-phone' | 'bi bi-laptop'
  iconColor: string;            // CSS var for icon color
  name: string;                 // 'iPhone 14 Pro' | 'MacBook Air M2'
  isCurrent: boolean;
  // Section 5.7.2 inline card display
  sectionBadgeText?: string;
  sectionBadgeClass?: string;
  sectionBadgeStyle?: string;
  sectionDetail: string;
  sectionItemClass: string;     // 'mb-2' for first, '' for the rest
  // Device binding modal display
  modalBadgeText?: string;
  modalBadgeClass?: string;
  modalDetail: string;
  modalActionLabel?: string;
  modalActionClass?: string;
}

/* ---------- 3D Secure info ---------- */

export interface ThreeDSInfo {
  activeMessage: string;
  fallbackLabel: string;
  fallbackDetail: string;
  whitelistLabel: string;
  whitelistDetail: string;
  whitelistStatus: string;
  whitelistBadgeClass: string;
}

/* ---------- Geography & POS controls ---------- */

export type GeoControlType = 'button' | 'badge';

export interface GeoControl {
  id: string;
  name: string;
  detail: string;
  type: GeoControlType;
  actionLabel?: string;
  actionModal?: string;
  badgeText?: string;
  badgeClass?: string;
  rowClass: string;
}

/* ---------- Evidence vault ---------- */

export interface EvidenceVaultAction {
  label: string;
  icon: string;
  modal: string;
  btnClass: string;
}

export interface EvidenceVault {
  title: string;
  description: string;
  uploadIcon: string;
  uploadIconClass: string;
  uploadIconStyle: string;
  uploadLabel: string;
  uploadHint: string;
  actions: EvidenceVaultAction[];
}

/* ---------- Health check modal ---------- */

export interface HealthCheck {
  id: string;
  name: string;
  status: string;
  statusClass: string;
}

export interface HealthCheckSummary {
  score: string;
  postureLabel: string;
  lastCheckText: string;
}

/* ---------- Security alerts modal ---------- */

export interface SecurityAlert {
  id: string;
  bgClass: string;              // CSS var for background (applied via [style.background])
  titleColor: string;           // CSS var for title color (applied via [style.color])
  title: string;
  time: string;
  message: string;
  hasReviewButton: boolean;
  reviewModal?: string;
  reviewButtonLabel?: string;
  reviewButtonClass?: string;
}

/* ---------- Profile modal ---------- */

export interface ProfileData {
  initials: string;
  name: string;
  email: string;
  device: string;
}

/* ---------- Security score breakdown modal ---------- */

export interface ScoreBreakdownItem {
  id: string;
  label: string;
  detail: string;
  points: string;
  pointsClass: string;
  rowClass: string;
}

/* ---------- Merchant whitelist modal ---------- */

export interface TrustedMerchant {
  id: string;
  name: string;
  type: string;
  removeAction: string;
  rowClass: string;
}

/* ---------- Card replacement tracker modal ---------- */

export type ReplacementStepStatus = 'completed' | 'active' | 'pending';

export interface ReplacementStep {
  id: string;
  stepNum: string;
  title: string;
  detail: string;
  status: ReplacementStepStatus;
  bgColor?: string;
  color?: string;
  titleColor?: string;
}

export interface ReplacementOrder {
  orderId: string;
  status: string;
  statusClass: string;
}

/* ---------- MCC blocker modal ---------- */

export interface MccCategory {
  id: string;
  code: string;                 // ISO MCC code (mock; not rendered to preserve visuals)
  label: string;
  checked: boolean;
}

/* ---------- VPN / Proxy blocker modal ---------- */

export interface VpnRule {
  id: string;
  name: string;
  detail?: string;
  checked: boolean;
  hasDetail: boolean;
  rowClass: string;
}

/* ---------- Review Suspicious Tx modal (step 1 transaction details) ---------- */

export interface ReviewTxDetail {
  id: string;
  label: string;
  value: string;
  valueStyle?: string;
}

/* ---------- Report Compromise modal (step 2 flaggable tx + step 3 actions) ---------- */

export interface FlaggableTransaction {
  id: string;
  merchant: string;
  amount: number;
}

export type CompromiseActionType = 'badge' | 'toggle';

export interface CompromiseAction {
  id: string;
  label: string;
  detail?: string;
  type: CompromiseActionType;
  badgeText?: string;
  badgeClass?: string;
  toggleChecked?: boolean;
  rowClass: string;
}

/* ---------- Fraud Rule Builder modal (step 2 condition rows) ---------- */

export interface FraudRuleCondition {
  fields: string[];
  operators: string[];
  value: string;
}

/* ---------- Generic select option (with optional selected flag) ---------- */

export interface SelectOption {
  label: string;
  selected?: boolean;
}

/* ---------- Velocity limits modal (numeric defaults) ---------- */

export interface VelocityLimits {
  maxPerHour: number;
  maxPerDay: number;
  maxSpendPerDay: number;
  blockExceeding: boolean;
}

/* ---------- Contactless limit modal (numeric default) ---------- */

export interface ContactlessLimit {
  maxPerTap: number;
  enabled: boolean;
}

/* ---------- Export report modal (date defaults) ---------- */

export interface ExportReportDates {
  from: string;
  to: string;
}

@Component({
  selector: 'app-card-security',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-security.html',
  styleUrls: ['./card-security.css'],
  encapsulation: ViewEncapsulation.None
})
export class CardSecurityComponent implements OnInit {
  /* ---------- Modal open/close state ---------- */
  private _openModals = signal<Set<string>>(new Set());
  isModalOpen = (id: string) => this._openModals().has(id);

  /* ---------- Multi-step flow state ---------- */
  // Review Suspicious Transaction — 3 steps with yes/no branch
  rsStep = signal(1);
  rsDecision = signal<'yes' | 'no' | null>(null);
  rsSteps = ['Review', 'Action', 'Done'] as const;

  // Fraud Rule Builder — 4 steps
  frStep = signal(1);
  frSteps = ['Name', 'Criteria', 'Action', 'Done'] as const;

  // Report Compromise — 4 steps
  rcStep = signal(1);
  rcSteps = ['Identify', 'Review', 'Confirm', 'Done'] as const;

  flowLoading = signal(false);

  /* ---------- Processed receipt state ---------- */
  processed = signal<ProcessedResult | null>(null);
  loadingModalId = signal<string | null>(null);

  /* ============================================================
   * DATA SIGNALS — mock (wire to API in ngOnInit)
   * ============================================================ */

  /* ---------- Section 5.7.1 — Suspicious Activity Log ---------- */
  suspiciousActivity = signal<SuspiciousActivity[]>([
    { id: 's1', date: 'Today, 04:12 AM', merchant: 'AliExpress', country: 'CN', cardType: 'Virtual', last4: '4412', amount: 12500, status: 'blocked', reason: 'Geo-mismatch', highlightDanger: true },
    { id: 's2', date: 'Yesterday, 21:40', merchant: 'Binance Crypto', country: 'MT', cardType: 'Physical', last4: '9921', amount: 45000, status: 'blocked', reason: 'MCC blocked' },
    { id: 's3', date: '24 Jun, 15:30', merchant: 'Jumia', country: 'KE', cardType: 'Virtual', last4: '1011', amount: 8200, status: 'flagged', reason: 'High velocity' },
    { id: 's4', date: '22 Jun, 09:15', merchant: 'Netflix', country: 'US', cardType: 'Virtual', last4: '4412', amount: 1200, status: 'cleared', reason: 'Verified 3DS' },
  ]);

  activeRules = signal<ActiveRule[]>([
    { id: 'r1', name: 'Velocity Limit', description: 'Max 5 Tx / hr per card', editModal: 'velocityLimitsModal' },
    { id: 'r2', name: 'High-Risk MCCs', description: 'Gambling, Crypto blocked', editModal: 'mccBlockerModal' },
    { id: 'r3', name: 'VPN / Proxy Block', description: 'Reject if IP is hidden', editModal: 'vpnProxyBlockerModal' },
    { id: 'r4', name: 'Trusted Merchants', description: '12 auto-allowlisted', editModal: 'merchantWhitelistModal' },
  ]);

  /* ---------- HERO STATS ROW (4 cards) ---------- */
  heroStats = signal<HeroStat[]>([
    {
      id: 'score',
      cardClass: 'pm-card pm-card-accent',
      cardStyle: 'min-height:160px',
      accentVar: 'var(--pm-accent)',
      label: 'OVERALL SECURITY SCORE',
      labelClass: '',
      labelStyle: 'margin:0;font-size:11px;color:rgba(255,255,255,.78);text-transform:uppercase;font-weight:600',
      value: '92',
      valueStyle: 'margin:8px 0;color:#fff',
      valueSuffix: '/100',
      valueSuffixStyle: 'font-size:14px;color:rgba(255,255,255,.7)',
      subtext: 'Excellent posture. ',
      subtextStyle: 'margin:0;font-size:12px;color:rgba(255,255,255,.78)',
      subtextHighlight: 'Protected by AI.',
      subtextHighlightStyle: 'color:#86efac',
      actionLabel: 'View breakdown',
      actionModal: 'securityScoreDetailsModal',
      actionBtnClass: 'pm-btn pm-btn-sm',
      actionBtnStyle: 'background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.22);color:#fff',
      breakdownItems: []
    },
    {
      id: 'policies',
      cardClass: 'pm-card',
      cardStyle: 'min-height:160px;border-top:3px solid var(--pm-primary)',
      accentVar: 'var(--pm-primary)',
      label: 'ACTIVE SECURITY POLICIES',
      labelClass: 'pm-stat-label',
      labelStyle: 'color:var(--pm-primary)',
      value: '14',
      valueStyle: 'margin:6px 0',
      valueSuffix: ' rules running',
      valueSuffixStyle: 'font-size:14px;color:var(--pm-muted);font-weight:500',
      badgeIcon: 'bi bi-shield-check',
      badgeText: '100% card coverage',
      badgeClass: 'pm-badge pm-badge-success',
      actionLabel: 'Manage policies',
      actionModal: 'fraudRuleBuilderModal',
      actionBtnClass: 'pm-btn pm-btn-sm w-100',
      breakdownItems: []
    },
    {
      id: 'threats',
      cardClass: 'pm-card',
      cardStyle: 'min-height:160px;border-top:3px solid var(--pm-warning)',
      accentVar: 'var(--pm-warning)',
      label: 'THREATS BLOCKED (30D)',
      labelClass: 'pm-stat-label',
      labelStyle: 'color:var(--pm-warning)',
      value: 'KES 42.5K',
      valueStyle: 'margin:6px 0',
      badgeIcon: 'bi bi-cone-striped',
      badgeText: '7 flagged attempts',
      badgeClass: 'pm-badge pm-badge-warning',
      actionLabel: 'Review threats',
      actionModal: 'securityAlertsModal',
      actionBtnClass: 'pm-btn pm-btn-sm w-100',
      breakdownItems: [
        { label: 'Blocked value', value: 'KES 42.5K', color: 'var(--pm-warning)' },
        { label: 'Flagged attempts', value: '7', color: 'var(--pm-warning)' }
      ]
    },
    {
      id: 'devices',
      cardClass: 'pm-card',
      cardStyle: 'min-height:160px;border-top:3px solid var(--pm-info)',
      accentVar: 'var(--pm-info)',
      label: 'DEVICE & REGION SCOPE',
      labelClass: 'pm-stat-label',
      labelStyle: 'color:var(--pm-info)',
      value: '2',
      valueStyle: 'margin:6px 0',
      valueSuffix: ' devices',
      valueSuffixStyle: 'font-size:14px;color:var(--pm-muted);font-weight:500',
      badgeIcon: 'bi bi-geo-alt',
      badgeText: 'EA Region Only',
      badgeClass: 'pm-badge pm-badge-info',
      actionLabel: 'Access controls',
      actionModal: 'deviceBindingModal',
      actionBtnClass: 'pm-btn pm-btn-sm w-100',
      breakdownItems: []
    }
  ]);

  /* ---------- Section 5.7.2 — Device Binding ---------- */
  boundDevices = signal<BoundDevice[]>([
    {
      id: 'bd1',
      icon: 'bi bi-phone',
      iconColor: 'var(--pm-primary)',
      name: 'iPhone 14 Pro',
      isCurrent: true,
      sectionBadgeText: 'Current',
      sectionBadgeClass: 'pm-badge pm-badge-success',
      sectionBadgeStyle: 'font-size:9px',
      sectionDetail: 'Biometric active · Nairobi, KE',
      sectionItemClass: 'mb-2',
      modalBadgeText: 'Verified',
      modalBadgeClass: 'pm-badge pm-badge-success',
      modalDetail: 'Biometric 3DS Push Enabled'
    },
    {
      id: 'bd2',
      icon: 'bi bi-laptop',
      iconColor: 'var(--pm-muted)',
      name: 'MacBook Air M2',
      isCurrent: false,
      sectionDetail: 'Web access · Nairobi, KE',
      sectionItemClass: '',
      modalDetail: 'Web access · Last used yesterday',
      modalActionLabel: 'Unbind',
      modalActionClass: 'pm-btn pm-btn-sm pm-btn-danger'
    }
  ]);

  /* ---------- Section 5.7.2 — 3D Secure info ---------- */
  threeDSInfo = signal<ThreeDSInfo>({
    activeMessage: 'Biometric push approval active for transactions > KES 5,000',
    fallbackLabel: 'Fallback Method',
    fallbackDetail: 'SMS OTP to +254 712***890',
    whitelistLabel: 'Whitelist',
    whitelistDetail: 'Skip 3DS for recurring subs',
    whitelistStatus: 'On',
    whitelistBadgeClass: 'pm-badge pm-badge-success'
  });

  /* ---------- Section 5.7.2 — Geography & POS controls ---------- */
  geoControls = signal<GeoControl[]>([
    {
      id: 'gc1',
      name: 'Contactless (Tap-to-pay)',
      detail: 'Limit: KES 2,500/tap',
      type: 'button',
      actionLabel: 'Edit',
      actionModal: 'contactlessLimitModal',
      rowClass: 'pt-0'
    },
    {
      id: 'gc2',
      name: 'Geo-Fencing',
      detail: 'Blocked > 100km from phone',
      type: 'badge',
      badgeText: 'Active',
      badgeClass: 'pm-badge pm-badge-success',
      rowClass: ''
    },
    {
      id: 'gc3',
      name: 'Travel Mode',
      detail: 'No active trips scheduled',
      type: 'button',
      actionLabel: 'Set',
      actionModal: 'travelModeModal',
      rowClass: 'pb-0 border-0'
    }
  ]);

  /* ---------- Section 5.7.3 — Disputes & Incidents ---------- */
  disputes = signal<DisputeIncident[]>([
    { id: 'd1', caseId: 'CB-11920', type: 'Chargeback', cardType: 'Physical', last4: '9921', amount: 12400, status: 'awaiting', actionLabel: 'Upload', actionModal: 'evidenceVaultModal' },
    { id: 'd2', caseId: 'FR-88211', type: 'Card Compromise', cardType: 'Virtual', last4: '1011', amount: 0, status: 'resolved', actionLabel: 'Track Card', actionModal: 'cardReplacementTrackerModal' },
    { id: 'd3', caseId: 'DP-44912', type: 'Duplicate Charge', cardType: 'Physical', last4: '9921', amount: 3200, status: 'review', actionLabel: 'Details', actionModal: 'disputeCenterModal' },
  ]);

  /* ---------- Section 5.7.3 — Evidence Vault ---------- */
  evidenceVault = signal<EvidenceVault>({
    title: 'Evidence Vault',
    description: 'Securely store police abstracts, communication with merchants, and receipts to support chargebacks.',
    uploadIcon: 'bi bi-cloud-arrow-up text-primary',
    uploadIconClass: 'text-primary',
    uploadIconStyle: 'font-size:24px',
    uploadLabel: 'Upload Evidence',
    uploadHint: 'PDF, JPG, PNG up to 5MB',
    actions: [
      { label: 'Download Incident Report', icon: 'bi bi-file-earmark-pdf', modal: 'exportSecurityReportModal', btnClass: 'pm-btn pm-btn-sm w-100' },
      { label: 'View Audit Log', icon: 'bi bi-journal-text', modal: 'auditLogModal', btnClass: 'pm-btn pm-btn-sm w-100 mt-2' }
    ]
  });

  /* ---------- Audit Log (modal 22) ---------- */
  auditLog = signal<AuditLogEntry[]>([
    { id: 'a1', time: 'Today, 04:12', action: 'Transaction Blocked (Geo)', user: 'System AI', ip: 'N/A' },
    { id: 'a2', time: '25 Jun, 14:00', action: 'Geo-Fencing Enabled', user: 'James K.', ip: '10.0.x.x (iPhone 14)' },
    { id: 'a3', time: '25 Jun, 13:50', action: '3DS Preference Changed', user: 'James K.', ip: '10.0.x.x (iPhone 14)' },
    { id: 'a4', time: '22 Jun, 09:15', action: '3DS Biometric Auth Success', user: 'James K.', ip: '10.0.x.x (iPhone 14)' },
  ]);

  /* ============================================================
   * MODAL LIST CONTENT — extracted mock data
   * ============================================================ */

  /* ---------- Modal 1 — Health Check ---------- */
  healthCheckSummary = signal<HealthCheckSummary>({
    score: '92/100',
    postureLabel: 'OVERALL POSTURE',
    lastCheckText: 'Last checked: Today, 09:00 AM' // mock API field (reserved, not rendered to preserve visuals)
  });

  healthChecks = signal<HealthCheck[]>([
    { id: 'hc1', name: 'Biometric Authentication', status: 'Enabled', statusClass: 'pm-badge pm-badge-success' },
    { id: 'hc2', name: '3D Secure Setup', status: 'Strict', statusClass: 'pm-badge pm-badge-success' },
    { id: 'hc3', name: 'VPN/Proxy Block', status: 'Disabled', statusClass: 'pm-badge pm-badge-warning' }
  ]);

  /* ---------- Modal 2 — Security Alerts ---------- */
  securityAlerts = signal<SecurityAlert[]>([
    {
      id: 'sa1',
      bgClass: 'var(--pm-danger-soft)',
      titleColor: 'var(--pm-danger)',
      title: 'Blocked Transaction',
      time: '04:12 AM',
      message: 'KES 12,500 at AliExpress (CN). Reason: Geo-mismatch.',
      hasReviewButton: true,
      reviewModal: 'reviewSuspiciousTxModal',
      reviewButtonLabel: 'Review',
      reviewButtonClass: 'pm-btn pm-btn-sm mt-2 pm-btn-danger'
    },
    {
      id: 'sa2',
      bgClass: 'var(--pm-warning-soft)',
      titleColor: 'var(--pm-warning)',
      title: 'Velocity Warning',
      time: 'Yesterday',
      message: 'Virtual Card 1011 had 4 transactions in 10 minutes.',
      hasReviewButton: false
    }
  ]);

  /* ---------- Modal 3 — Profile ---------- */
  profileData = signal<ProfileData>({
    initials: 'JK',
    name: 'James Kamau',
    email: 'james.kamau@email.com',
    device: 'iPhone 14 Pro (Verified)'
  });

  /* ---------- Modal 4 — Review Suspicious Tx (step 1 details) ---------- */
  reviewTxDetails = signal<ReviewTxDetail[]>([
    { id: 'rt1', label: 'Merchant', value: 'AliExpress (CN)' },
    { id: 'rt2', label: 'Amount', value: 'KES 12,500', valueStyle: 'color:var(--pm-danger)' },
    { id: 'rt3', label: 'Time', value: 'Today, 04:12 AM' },
    { id: 'rt4', label: 'Risk Flag', value: 'Device in KE, Tx in CN' }
  ]);

  /* ---------- Modal 5 — Fraud Rule Builder (step 2 conditions) ---------- */
  fraudRuleConditions = signal<FraudRuleCondition[]>([
    { fields: ['Time of Day', 'Amount', 'Country'], operators: ['Is Between'], value: '00:00 - 05:00' },
    { fields: ['Country'], operators: ['Is Not'], value: 'Kenya' }
  ]);

  /* ---------- Modal 5 — Fraud Rule Builder (step 3 actions) ---------- */
  fraudRuleActions = signal<string[]>([
    'Block Transaction & Notify',
    'Require Biometric Approval',
    'Flag for Review'
  ]);

  /* ---------- Modal 6 — MCC Blocker ---------- */
  mccCategories = signal<MccCategory[]>([
    { id: 'mc1', code: '7995', label: 'Gambling & Betting', checked: true },
    { id: 'mc2', code: '6051', label: 'Cryptocurrency Exchanges', checked: true },
    { id: 'mc3', code: '5967', label: 'Adult Content', checked: true },
    { id: 'mc4', code: '5813', label: 'Bars & Liquor Stores', checked: false }
  ]);

  /* ---------- Modal 7 — Velocity Limits (numeric defaults) ---------- */
  velocityLimits = signal<VelocityLimits>({
    maxPerHour: 5,
    maxPerDay: 20,
    maxSpendPerDay: 100000,
    blockExceeding: true
  });

  /* ---------- Modal 8 — VPN / Proxy Blocker ---------- */
  vpnRules = signal<VpnRule[]>([
    { id: 'vr1', name: 'Block Anonymous IPs', checked: true, hasDetail: false, rowClass: '' },
    { id: 'vr2', name: 'Block Cloud Provider IPs', detail: 'AWS, DigitalOcean, etc.', checked: false, hasDetail: true, rowClass: 'border-0 pb-0' }
  ]);

  /* ---------- Modal 10 — Manage 3DS ---------- */
  threeDSMethods = signal<string[]>([
    'Biometric App Push (Recommended)',
    'SMS OTP',
    'Email OTP'
  ]);

  threeDSThresholds = signal<SelectOption[]>([
    { label: 'Challenge all online txns', selected: false },
    { label: 'Challenge over KES 5,000', selected: true },
    { label: 'Only high-risk merchants', selected: false }
  ]);

  /* ---------- Modal 11 — Geo-Fencing ---------- */
  geoFencingRadii = signal<SelectOption[]>([
    { label: '10 km', selected: false },
    { label: '50 km', selected: false },
    { label: '100 km', selected: true },
    { label: '250 km', selected: false }
  ]);

  /* ---------- Modal 12 — Travel Mode ---------- */
  travelModeCardOptions = signal<string[]>([
    'All Cards',
    'Physical Debit 9921'
  ]);

  /* ---------- Modal 13 — Contactless Limit (numeric default) ---------- */
  contactlessLimit = signal<ContactlessLimit>({
    maxPerTap: 2500,
    enabled: true
  });

  /* ---------- Modal 14 — Freeze Card ---------- */
  freezeReasons = signal<string[]>([
    'Misplaced temporarily',
    'Not using it right now',
    'Suspect unauthorized use'
  ]);

  /* ---------- Modal 15 — Report Compromise ---------- */
  reportCompromiseReasons = signal<string[]>([
    'I see unauthorized transactions',
    'Card was stolen',
    'Card was lost',
    'Phishing/Scam suspected'
  ]);

  // Step 2 — transactions available to flag (numbers per spec)
  flaggableTransactions = signal<FlaggableTransaction[]>([
    { id: 'ft1', merchant: 'AliExpress (CN)', amount: 12500 },
    { id: 'ft2', merchant: 'Jumia (KE)', amount: 8200 }
  ]);

  // Step 3 — action summary rows
  compromiseActions = signal<CompromiseAction[]>([
    { id: 'ca1', label: 'Permanent Card Block', type: 'badge', badgeText: 'Will apply', badgeClass: 'pm-badge pm-badge-danger', rowClass: '' },
    { id: 'ca2', label: 'Disputes Created', type: 'badge', badgeText: '0 items', badgeClass: 'pm-badge pm-badge-warning', rowClass: '' },
    { id: 'ca3', label: 'Issue Replacement', detail: 'Virtual replacement available instantly', type: 'toggle', toggleChecked: true, rowClass: 'border-0' }
  ]);

  /* ---------- Modal 16 — Dispute Center ---------- */
  disputeTransactions = signal<string[]>([
    'KES 12,400 - Merchant XYZ',
    'KES 3,200 - Jumia KE'
  ]);

  disputeReasons = signal<string[]>([
    'Fraudulent / Did not authorize',
    'Goods not received',
    'Duplicate charge',
    'Amount is incorrect',
    'Subscription cancelled previously'
  ]);

  /* ---------- Modal 17 — Evidence Vault ---------- */
  evidenceCaseOptions = signal<string[]>([
    'CB-11920 (Chargeback - KES 12,400)',
    'DP-44912 (Duplicate - KES 3,200)'
  ]);

  evidenceDocTypes = signal<string[]>([
    'Receipt / Invoice',
    'Email correspondence with merchant',
    'Police abstract',
    'Other'
  ]);

  /* ---------- Modal 18 — Security Score Details ---------- */
  securityScoreValue = signal('92/100');

  scoreBreakdown = signal<ScoreBreakdownItem[]>([
    { id: 'sb1', label: 'PIN Strength', detail: 'Changed < 90 days ago', points: '+20', pointsClass: 'text-success fw-bold', rowClass: '' },
    { id: 'sb2', label: '3DS Enrollment', detail: 'Biometric push enabled', points: '+30', pointsClass: 'text-success fw-bold', rowClass: '' },
    { id: 'sb3', label: 'Device Binding', detail: '1 active trusted device', points: '+25', pointsClass: 'text-success fw-bold', rowClass: '' },
    { id: 'sb4', label: 'Geo-Fencing', detail: 'Active', points: '+17', pointsClass: 'text-success fw-bold', rowClass: '' },
    { id: 'sb5', label: 'VPN Protection', detail: 'Disabled', points: '0', pointsClass: 'text-warning fw-bold', rowClass: 'border-0' }
  ]);

  /* ---------- Modal 19 — Export Security Report ---------- */
  exportContentOptions = signal<string[]>([
    'All Security Incidents',
    'Blocked Transactions Log',
    'Audit Log (Settings changes)'
  ]);

  exportFormatOptions = signal<string[]>([
    'PDF',
    'CSV'
  ]);

  exportReportDates = signal<ExportReportDates>({
    from: '2025-05-27',
    to: '2025-06-27'
  });

  /* ---------- Modal 20 — Merchant Whitelist ---------- */
  trustedMerchants = signal<TrustedMerchant[]>([
    { id: 'tm1', name: 'Netflix (US)', type: 'Recurring Sub', removeAction: 'Remove', rowClass: '' },
    { id: 'tm2', name: 'Spotify', type: 'Recurring Sub', removeAction: 'Remove', rowClass: '' },
    { id: 'tm3', name: 'Safaricom PLC', type: 'Utility', removeAction: 'Remove', rowClass: 'border-0 pb-0' }
  ]);

  /* ---------- Modal 21 — Card Replacement Tracker ---------- */
  replacementOrder = signal<ReplacementOrder>({
    orderId: 'ORD-99120',
    status: 'In Transit',
    statusClass: 'pm-badge pm-badge-info'
  });

  replacementSteps = signal<ReplacementStep[]>([
    { id: 'rps1', stepNum: '1', title: 'Ordered', detail: '25 Jun, 10:00', status: 'completed', bgColor: 'var(--pm-accent)', color: '#fff' },
    { id: 'rps2', stepNum: '2', title: 'Personalization', detail: '26 Jun, 14:00', status: 'completed', bgColor: 'var(--pm-accent)', color: '#fff' },
    { id: 'rps3', stepNum: '3', title: 'Dispatched via Fargo', detail: 'Tracking: FGO-1120', status: 'active', bgColor: 'var(--pm-primary)', color: '#fff' },
    { id: 'rps4', stepNum: '4', title: 'Delivery', detail: 'Est. Tomorrow', status: 'pending', titleColor: 'var(--pm-muted)' }
  ]);

  /* ---------- Shared form option lists ---------- */
  // Card selector used by freeze + report compromise modals
  cardSelectOptions = signal<string[]>([
    'Physical Debit · 9921',
    'Virtual Debit · 4412'
  ]);

  // Fraud rule builder — apply to cards (step 1)
  fraudRuleCardOptions = signal<string[]>([
    'All Cards',
    'Virtual Cards Only',
    'Physical Debit 9921'
  ]);

  ngOnInit(): void {
    // Hook for initial API load, e.g.:
    // this.securityService.getActivity().subscribe(a => this.suspiciousActivity.set(a));
  }

  /* ---------- Modal controls ---------- */
  openModal(id: string): void {
    const next = new Set(this._openModals());
    next.add(id);
    this._openModals.set(next);
  }

  closeModal(id: string): void {
    const next = new Set(this._openModals());
    next.delete(id);
    this._openModals.set(next);
    // Reset any processed receipt / loading state for this modal
    if (this.processed()?.modalId === id) {
      this.processed.set(null);
    }
    if (this.loadingModalId() === id) {
      this.loadingModalId.set(null);
    }
    // Reset multi-step flows on close
    this.resetFlow(id);
  }

  /** Open one modal and close another (cross-modal navigation, no stacking). */
  openAndClose(openId: string, closeId: string): void {
    this.closeModal(closeId);
    this.openModal(openId);
  }

  /* ---------- Stepper class helper ---------- */
  stepState(index: number, current: number): 'active' | 'completed' | '' {
    const step = index + 1;
    if (step < current) return 'completed';
    if (step === current) return 'active';
    return '';
  }

  /* ---------- Process single-step modal action (shows receipt) ---------- */
  processAction(modalId: string, message: string, ref: string = ''): void {
    this.loadingModalId.set(modalId);
    setTimeout(() => {
      this.loadingModalId.set(null);
      this.processed.set({ modalId, message, ref });
    }, 1200);
  }

  isProcessed(modalId: string): boolean {
    return this.processed()?.modalId === modalId;
  }

  /* ============================================================
   * Flow 1: Review Suspicious Transaction (3 steps, yes/no branch)
   * ============================================================ */
  /** Step 1 → Step 2 with a decision (no = fraud, yes = false alarm). */
  rsDecide(decision: 'yes' | 'no'): void {
    this.rsDecision.set(decision);
    this.rsStep.set(2);
  }

  /** Step 2 → Step 3 (loading then receipt). */
  rsConfirm(): void {
    this.flowLoading.set(true);
    setTimeout(() => {
      this.flowLoading.set(false);
      this.rsStep.set(3);
    }, 1200);
  }

  rsConfirmBtnClass(): string {
    return this.rsDecision() === 'no' ? 'pm-btn pm-btn-danger' : 'pm-btn';
  }

  rsConfirmBtnStyle(): string {
    return this.rsDecision() === 'no'
      ? 'var(--pm-danger)'
      : 'var(--pm-accent)';
  }

  /* ============================================================
   * Flow 2: Fraud Rule Builder (4 steps)
   * ============================================================ */
  frNextLabel(): string {
    if (this.frStep() === 3) return 'Activate Rule';
    if (this.frStep() === 4) return 'Done';
    return 'Continue';
  }

  nextFrStep(): void {
    if (this.flowLoading()) return;
    const cur = this.frStep();
    if (cur === 3) {
      this.flowLoading.set(true);
      setTimeout(() => {
        this.flowLoading.set(false);
        this.frStep.set(4);
      }, 1200);
      return;
    }
    if (cur >= 4) {
      this.closeModal('fraudRuleBuilderModal');
      return;
    }
    this.frStep.set(cur + 1);
  }

  /* ============================================================
   * Flow 3: Report Compromise (4 steps)
   * ============================================================ */
  rcNextLabel(): string {
    if (this.rcStep() === 3) return 'Freeze & Issue New';
    if (this.rcStep() === 4) return 'Done';
    return 'Continue';
  }

  rcNextBtnClass(): string {
    if (this.rcStep() === 4) return 'pm-btn pm-btn-primary';
    return 'pm-btn pm-btn-danger';
  }

  nextRcStep(): void {
    if (this.flowLoading()) return;
    const cur = this.rcStep();
    if (cur === 3) {
      this.flowLoading.set(true);
      setTimeout(() => {
        this.flowLoading.set(false);
        this.rcStep.set(4);
      }, 1200);
      return;
    }
    if (cur >= 4) {
      this.closeModal('reportCompromiseModal');
      return;
    }
    this.rcStep.set(cur + 1);
  }

  /* ---------- Reset a specific multi-step flow when its modal closes ---------- */
  private resetFlow(modalId: string): void {
    switch (modalId) {
      case 'reviewSuspiciousTxModal':
        this.rsStep.set(1);
        this.rsDecision.set(null);
        break;
      case 'fraudRuleBuilderModal':
        this.frStep.set(1);
        break;
      case 'reportCompromiseModal':
        this.rcStep.set(1);
        break;
    }
  }

  /* ---------- Format helpers ---------- */
  formatKes(amount: number): string {
    return 'KES ' + amount.toLocaleString('en-KE');
  }

  statusBadgeClass(status: SuspiciousStatus): string {
    switch (status) {
      case 'blocked': return 'pm-badge pm-badge-danger';
      case 'flagged': return 'pm-badge pm-badge-warning';
      case 'cleared': return 'pm-badge pm-badge-success';
    }
  }

  disputeBadgeClass(status: DisputeStatus): string {
    switch (status) {
      case 'awaiting': return 'pm-badge pm-badge-warning';
      case 'resolved': return 'pm-badge pm-badge-success';
      case 'review': return 'pm-badge pm-badge-info';
    }
  }
}
