import { Component, signal, computed, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ============================================================
 * PayMo — Card Program Administration (Page 5.9 — Issuer/BaaS)
 * Standalone Angular 17+ component.
 * Modern @if / @for / @switch control flow in template
 * (no *ngIf / *ngFor / ngClass / ngStyle).
 * All state is signal-based for change detection safety.
 * Data models are typed and ready for API integration.
 * ============================================================ */

/* ---------- Data models (replace mock arrays with API calls) ---------- */

export type CardNetwork = 'Visa' | 'Mastercard' | 'UnionPay';
export type BinStatus = 'active' | 'awaiting' | 'suspended';

export interface BinProgram {
  id: string;
  bin: string;            // e.g. "4410 11**"
  name: string;
  type: string;           // "Virtual Credit" | "Physical Debit" | ...
  network: CardNetwork;
  issuedCards: number;
  spend30d: string;       // pre-formatted currency string
  status: BinStatus;
  awaitingSetup?: boolean;
}

export interface AttentionItem {
  id: string;
  initials: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  actionModal: string;
  actionClass: string;
}

export interface BatchQueueItem {
  id: string;
  batchId: string;
  statusBadge: 'warning' | 'info' | 'success';
  statusLabel: string;
  detail: string;
  actionLabel: string;
  actionModal: string;
  actionClass: string;
}

export interface SupportActionItem {
  id: string;
  user: string;
  cardLabel: string;
  detail: string;
  actionLabel: string;
  actionModal: string;
  actionClass: string;
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
  color?: string;          // optional color for value
}

export interface HeroStatProgressBar {
  label: string;
  value: string;           // displayed numeric label
  percent: number;         // width %
  color: string;           // bar color (CSS var)
}

export interface HeroStatAction {
  label: string;
  modal: string;
  style: string;           // inline style for the button
}

export interface HeroStat {
  id: string;
  colClass: string;             // bootstrap col-* classes
  cardClass: string;            // additional card class (e.g. 'pm-card-dark')
  cardStyle: string;            // inline style on the .pm-card
  topLabel?: string;            // dark-card top line ("BaaS Issuing Platform")
  topLabelStyle?: string;       // inline style for top label
  liveIndicator?: string;       // "● Live"
  liveColor?: string;           // color for live indicator
  label?: string;               // stat label ("30D ISSUANCE VOL")
  accentVar?: string;           // label color (CSS var)
  value: string;                // main stat value
  valueStyle?: string;          // inline style for value
  subtext?: string;             // descriptive subtext
  subtextStyle?: string;        // inline style for subtext
  badgeClass?: string;          // pm-badge pm-badge-success ...
  badgeIcon?: string;           // bi-* icon class
  badgeText?: string;
  breakdownContainerClass?: string;  // 'mt-3' | 'mt-2'
  breakdownItems?: HeroStatBreakdownItem[];
  progressBars?: HeroStatProgressBar[];
  actions?: HeroStatAction[];
}

/* ---------- Quick actions & compliance blocks ---------- */
export interface QuickAction {
  id: string;
  icon: string;            // base icon class (e.g. 'bi bi-search')
  iconClass: string;       // additional classes (e.g. 'text-primary me-1')
  iconStyle?: string;      // inline style for icon (e.g. 'color:var(--pm-purple)')
  label: string;
  modal: string;
}

export interface ComplianceBlock {
  id: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  modal: string;
}

/* ---------- Health checks ---------- */
export interface HealthCheck {
  id: string;
  name: string;
  status: string;
  statusClass: string;     // 'pm-badge pm-badge-success' | 'pm-badge-warning'
}

/* ---------- Cardholder search results ---------- */
export interface CardholderSearchResult {
  id: string;
  name: string;
  pan: string;
  type: string;
  status: string;
  statusClass: string;
}

/* ---------- Cardholder detail ---------- */
export interface CardholderProfile {
  initials: string;
  name: string;
  email: string;
  phone: string;
  kycStatus: string;
  kycStatusClass: string;
  program: string;
  walletId: string;
}

export interface CardholderCard {
  brandIcon: string;
  brand: string;
  wifiIcon: string;
  pan: string;
  name: string;
  expiry: string;
}

export interface CardholderTransaction {
  id: string;
  date: string;
  merchant: string;
  amount: string;
  status: string;
  statusClass: string;
}

export interface CardholderLimit {
  dailyCap: string;
  singleTxnCap: string;
  onlineEnabled: boolean;
  internationalEnabled: boolean;
}

export interface TabItem {
  id: string;
  label: string;
}

/* ---------- BIN config form data ---------- */
export interface BinConfigData {
  bin: string;
  programName: string;
  cardType: string;
  baseCurrency: string;
  maxCardBalance: string;
  settlementAccount: string;
  lowBalanceAlert: string;
  settlementFrequency: string;
}

/* ---------- Batch validation records (Issue Batch step 3) ---------- */
export interface BatchValidationRecord {
  id: string;
  name: string;
  idNumber: string;
  initLimit: string;
  status: string;
  statusClass: string;
}

/* ---------- Approve batch summary ---------- */
export interface ApproveBatchData {
  batchId: string;
  program: string;
  cardCount: string;
  submittedBy: string;
}

/* ---------- Batch tracking steps (batch status modal) ---------- */
export interface BatchTrackingStep {
  id: string;
  stepNum: string;          // numeric label ('3') when stepNumIcon absent
  stepNumIcon?: string;     // icon class for completed steps ('bi bi-check')
  title: string;
  titleColor?: string;      // optional muted color for pending step
  detail: string;
  stepBgColor?: string;     // background of the step-num circle
  stepColor?: string;       // text color of the step-num circle
}

/* ---------- Fee schedule rows ---------- */
export interface FeeScheduleRow {
  id: string;
  feeType: string;
  amount: string;
  status: string;
  statusClass: string;
}

/* ---------- MCC categories ---------- */
export interface MccCategory {
  id: string;
  code: string;
  label: string;
  checked: boolean;
}

/* ---------- AML alerts ---------- */
export interface AmlAlertAction {
  label: string;
  class: string;
  modal?: string;                 // openModal(...) target
  processModal?: string;          // processAction(...) target
  processMessage?: string;
}

export interface AmlAlert {
  id: string;
  riskLevel: string;
  riskClass: string;
  cardLabel: string;
  detail: string;
  amount: string;
  actions: AmlAlertAction[];
}

/* ---------- Dispute cases ---------- */
export interface DisputeCase {
  id: string;
  caseId: string;
  cardholder: string;
  amount: string;
  reasonCode: string;
  deadline: string;
  hasReviewAction: boolean;
}

/* ---------- Settlement details ---------- */
export interface SettlementData {
  balance: string;
  threshold: string;
  isBelowThreshold: boolean;
  topUpOptions: string[];
  amount: string;
}

/* ---------- Geo rules ---------- */
export interface GeoRule {
  id: string;
  title: string;
  description: string;
  checked: boolean;
}

/* ---------- Webhook ---------- */
export interface WebhookEvent {
  id: string;
  eventName: string;
  checked: boolean;
}

export interface WebhookConfig {
  url: string;
  signingSecret: string;
  failureCount: number;
  failureEndpoint: string;
}

/* ---------- Inbox ---------- */
export interface InboxMessage {
  id: string;
  type: string;
  typeClass: string;
  title: string;
  detail: string;
}

/* ---------- Notifications ---------- */
export interface NotificationAlert {
  id: string;
  borderColor: string;
  title: string;
  message: string;
  time: string;
}

/* ---------- Profile ---------- */
export interface ProfileData {
  initials: string;
  avatarBg: string;
  name: string;
  email: string;
  role: string;
  twoFAStatus: string;
  twoFAClass: string;
  lastLogin: string;
  accessLevel: string;
}

@Component({
  selector: 'app-card-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-admin.html',
  styleUrls: ['./card-admin.css'],
  encapsulation: ViewEncapsulation.None
})
export class CardAdminComponent implements OnInit {
  /* ---------- Modal open/close state ---------- */
  private _openModals = signal<Set<string>>(new Set());
  isModalOpen = (id: string) => this._openModals().has(id);

  /* ---------- Multi-step: Issue Batch ---------- */
  batchStep = signal(1);
  batchSteps = ['Program', 'Upload', 'Validate', 'Done'] as const;
  flowLoading = signal(false);

  /* ---------- Cardholder search result toggle ---------- */
  searchPerformed = signal(false);

  /* ---------- Tab state (cardholder detail, BIN config, disputes) ---------- */
  chDetailTab = signal<'cards' | 'txns' | 'limits'>('cards');
  binConfigTab = signal<'general' | 'auth' | 'settlement'>('general');
  disputeTab = signal<'pending' | 'representment' | 'closed'>('pending');

  /* ---------- Processed receipt / loading state ---------- */
  processed = signal<ProcessedResult | null>(null);
  loadingModalId = signal<string | null>(null);

  /* ============================================================
   * DATA SIGNALS (mock — wire to API in ngOnInit)
   * ============================================================ */

  /* ---------- Existing data signals ---------- */
  binPrograms = signal<BinProgram[]>([
    { id: 'b1', bin: '4410 11**', name: 'Corporate Expense', type: 'Virtual Credit', network: 'Visa', issuedCards: 12450, spend30d: 'KES 85.2M', status: 'active' },
    { id: 'b2', bin: '5529 00**', name: 'Standard Retail', type: 'Physical Debit', network: 'Mastercard', issuedCards: 8200, spend30d: 'KES 42.1M', status: 'active' },
    { id: 'b3', bin: '4288 99**', name: 'Premium Travel', type: 'Physical Credit', network: 'Visa', issuedCards: 4200, spend30d: 'KES 61.5M', status: 'active' },
    { id: 'b4', bin: '5399 21**', name: 'Student Prepaid', type: 'Virtual Prepaid', network: 'Mastercard', issuedCards: 0, spend30d: 'KES 0', status: 'awaiting', awaitingSetup: true },
  ]);

  attentionItems = signal<AttentionItem[]>([
    { id: 'a1', initials: 'AM', iconBg: 'var(--pm-danger-soft)', iconColor: 'var(--pm-danger)', title: '5 High-Risk AML Alerts', subtitle: 'Requires manual review & unblock', actionLabel: 'Review', actionModal: 'amlReviewModal', actionClass: 'pm-btn-danger' },
    { id: 'a2', initials: 'B2', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'Batch Issuance #8892 Pending', subtitle: '250 Corporate virtual cards', actionLabel: 'Approve', actionModal: 'approveBatchModal', actionClass: 'pm-btn-primary' },
    { id: 'a3', initials: 'DS', iconBg: 'var(--pm-purple-soft)', iconColor: 'var(--pm-purple)', title: '14 New Chargeback Disputes', subtitle: 'Deadline approaching for 3 cases', actionLabel: 'Resolve', actionModal: 'disputeResolutionModal', actionClass: '' },
    { id: 'a4', initials: 'ST', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', title: 'Low Settlement Balance', subtitle: 'BIN 441011 settlement account < 10%', actionLabel: 'Top-up', actionModal: 'settlementDetailsModal', actionClass: '' },
  ]);

  suggestions = signal<AttentionItem[]>([
    { id: 's1', initials: 'LM', iconBg: 'var(--pm-accent-soft)', iconColor: 'var(--pm-accent)', title: 'Update Velocity Limits', subtitle: 'Increase daily limits for corporate BINs based on usage', actionLabel: 'Update', actionModal: 'velocityLimitsModal', actionClass: '' },
    { id: 's2', initials: 'MC', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', title: 'Review MCC Blocklist', subtitle: 'High failure rate on MCC 5411 (Grocery)', actionLabel: 'Review', actionModal: 'mccBlocklistModal', actionClass: '' },
    { id: 's3', initials: 'FX', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'Optimize FX Fee Schedule', subtitle: 'Consider lowering cross-border fees by 0.5%', actionLabel: 'Model', actionModal: 'feeScheduleModal', actionClass: '' },
    { id: 's4', initials: 'WH', iconBg: 'var(--pm-primary-light)', iconColor: 'white', title: 'Webhook Failures Detected', subtitle: '3 endpoint timeouts in the last 24h', actionLabel: 'Check', actionModal: 'webhookSettingsModal', actionClass: '' },
  ]);

  supportActions = signal<SupportActionItem[]>([
    { id: 'sa1', user: 'James Kamau (Corporate)', cardLabel: 'Card *4421 · PIN reset requested', detail: '', actionLabel: 'Action', actionModal: 'resetPinModal', actionClass: '' },
    { id: 'sa2', user: 'Amina Hassan (Retail)', cardLabel: 'Card *8812 · Reported stolen', detail: '', actionLabel: 'Freeze', actionModal: 'forceFreezeModal', actionClass: 'pm-btn-danger' },
    { id: 'sa3', user: 'TechCorp Ltd (Expense)', cardLabel: 'Card *9923 · Replacement damaged', detail: '', actionLabel: 'Initiate', actionModal: 'replaceCardModal', actionClass: '' },
  ]);

  batchQueue = signal<BatchQueueItem[]>([
    { id: 'bq1', batchId: '#8892', statusBadge: 'warning', statusLabel: 'Pending Approval', detail: '250 Virtual · Corp Expense BIN · by John D.', actionLabel: 'Review', actionModal: 'approveBatchModal', actionClass: 'pm-btn-primary' },
    { id: 'bq2', batchId: '#8891', statusBadge: 'info', statusLabel: 'In Production', detail: '150 Physical · Premium BIN · 40% printed', actionLabel: 'Track', actionModal: 'batchStatusModal', actionClass: '' },
    { id: 'bq3', batchId: '#8890', statusBadge: 'success', statusLabel: 'Completed', detail: '500 Virtual · Standard BIN · 12 Jun 2025', actionLabel: 'Details', actionModal: 'batchStatusModal', actionClass: '' },
  ]);

  /* ---------- 1. Hero stats row (4 cards) ---------- */
  heroStats = signal<HeroStat[]>([
    {
      id: 'hs1',
      colClass: 'col-lg-4',
      cardClass: 'pm-card-dark',
      cardStyle: 'min-height:170px',
      topLabel: 'BaaS Issuing Platform',
      topLabelStyle: 'margin:0;font-size:12px;color:rgba(255,255,255,.7)',
      liveIndicator: '● Live',
      liveColor: '#34D399',
      value: '24,850 Active Cards',
      valueStyle: 'margin:8px 0;color:#fff',
      subtext: 'Operating across 3 BIN programs (Corporate, Standard Debit, Premium Credit).',
      subtextStyle: 'margin:0;font-size:12px;color:rgba(255,255,255,.7)',
      actions: [
        { label: 'New batch', modal: 'issueBatchModal', style: 'background:rgba(255,255,255,.15);border:none;color:#fff' },
        { label: 'BIN config', modal: 'binConfigModal', style: 'background:rgba(255,255,255,.15);border:none;color:#fff' },
      ],
    },
    {
      id: 'hs2',
      colClass: 'col-lg-2 col-md-4 col-6',
      cardClass: '',
      cardStyle: 'min-height:170px',
      label: '30D ISSUANCE VOL',
      accentVar: 'var(--pm-info)',
      value: '1,420',
      valueStyle: 'margin:6px 0',
      badgeClass: 'pm-badge pm-badge-success',
      badgeIcon: 'bi bi-graph-up-arrow',
      badgeText: '+12% MoM',
      progressBars: [
        { label: 'Virtual', value: '1,100', percent: 78, color: 'var(--pm-info)' },
        { label: 'Physical', value: '320', percent: 22, color: 'var(--pm-warning)' },
      ],
    },
    {
      id: 'hs3',
      colClass: 'col-lg-3 col-md-4 col-6',
      cardClass: '',
      cardStyle: 'min-height:170px',
      label: 'RISK & FRAUD ALERTS',
      accentVar: 'var(--pm-danger)',
      value: '28',
      valueStyle: 'margin:6px 0',
      badgeClass: 'pm-badge pm-badge-danger',
      badgeIcon: 'bi bi-shield-exclamation',
      badgeText: '5 critical',
      breakdownContainerClass: 'mt-3',
      breakdownItems: [
        { label: 'Velocity breaches', value: '12' },
        { label: 'Geo-mismatch', value: '11' },
        { label: 'AML flags', value: '5', color: 'var(--pm-danger)' },
      ],
    },
    {
      id: 'hs4',
      colClass: 'col-lg-3 col-md-4',
      cardClass: '',
      cardStyle: 'min-height:170px;border-left:3px solid var(--pm-primary)',
      label: 'PROGRAM REVENUE (YTD)',
      accentVar: 'var(--pm-primary)',
      value: 'KES 14.2M',
      valueStyle: 'margin:6px 0',
      badgeClass: 'pm-badge pm-badge-success',
      badgeIcon: 'bi bi-cash-stack',
      badgeText: 'Interchange & Fees',
      breakdownContainerClass: 'mt-2',
      breakdownItems: [
        { label: 'Interchange fee', value: 'KES 8.4M' },
        { label: 'Issuance & FX', value: 'KES 4.2M' },
        { label: 'ATM & Penalty', value: 'KES 1.6M' },
      ],
    },
  ]);

  /* ---------- 2. Quick actions grid (8 buttons) ---------- */
  quickActions = signal<QuickAction[]>([
    { id: 'qa1', icon: 'bi bi-search', iconClass: 'text-primary me-1', label: 'Find Card', modal: 'cardholderSearchModal' },
    { id: 'qa2', icon: 'bi bi-credit-card-2-front', iconClass: 'text-info me-1', label: 'Manage BIN', modal: 'binConfigModal' },
    { id: 'qa3', icon: 'bi bi-speedometer2', iconClass: 'text-warning me-1', label: 'Limits', modal: 'velocityLimitsModal' },
    { id: 'qa4', icon: 'bi bi-tags', iconClass: 'text-success me-1', label: 'Fee Engine', modal: 'feeScheduleModal' },
    { id: 'qa5', icon: 'bi bi-slash-circle', iconClass: 'text-danger me-1', label: 'Global MCC', modal: 'mccBlocklistModal' },
    { id: 'qa6', icon: 'bi bi-shield-lock', iconClass: '', iconStyle: 'color:var(--pm-purple)', label: 'AML Review', modal: 'amlReviewModal' },
    { id: 'qa7', icon: 'bi bi-file-earmark-spreadsheet', iconClass: 'text-secondary me-1', label: 'Batch Issue', modal: 'issueBatchModal' },
    { id: 'qa8', icon: 'bi bi-bank', iconClass: 'text-primary me-1', label: 'Settlements', modal: 'settlementDetailsModal' },
  ]);

  /* ---------- 3. Compliance utility blocks (Section 5.9.3) ---------- */
  complianceBlocks = signal<ComplianceBlock[]>([
    { id: 'cb1', icon: 'bi bi-speedometer2', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'Velocity Limits', description: 'Set daily, weekly, monthly transaction caps and frequency rules across programs.', modal: 'velocityLimitsModal' },
    { id: 'cb2', icon: 'bi bi-tags', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', title: 'Fee Schedule Engine', description: 'Configure issuance, ATM, cross-border, and maintenance fees per BIN.', modal: 'feeScheduleModal' },
    { id: 'cb3', icon: 'bi bi-slash-circle', iconBg: 'var(--pm-danger-soft)', iconColor: 'var(--pm-danger)', title: 'Global MCC & Fraud Rules', description: 'Block restricted categories (e.g. gambling, crypto) and setup 3DS enforcement.', modal: 'mccBlocklistModal' },
  ]);

  /* ---------- 4. Health check modal ---------- */
  healthChecks = signal<HealthCheck[]>([
    { id: 'hc1', name: 'Mastercard Gateway', status: '100% Uptime', statusClass: 'pm-badge pm-badge-success' },
    { id: 'hc2', name: 'Visa Gateway', status: '100% Uptime', statusClass: 'pm-badge pm-badge-success' },
    { id: 'hc3', name: 'Core Ledger Sync', status: 'Syncing (4ms lag)', statusClass: 'pm-badge pm-badge-success' },
    { id: 'hc4', name: 'KYC/AML Oracle', status: 'Degraded (1.2s delay)', statusClass: 'pm-badge pm-badge-warning' },
    { id: 'hc5', name: 'Settlement Accounts', status: 'Funded', statusClass: 'pm-badge pm-badge-success' },
  ]);
  healthCheckLastText = signal('Last automated check: 2 minutes ago. All issuing endpoints are active and accepting payload requests.');

  /* ---------- Cardholder search results ---------- */
  searchResults = signal<CardholderSearchResult[]>([
    { id: 'sr1', name: 'James Kamau (TechCorp)', pan: '4410 **** 4421', type: 'Virtual', status: 'Active', statusClass: 'pm-badge pm-badge-success' },
    { id: 'sr2', name: 'Amina Hassan', pan: '5529 **** 8812', type: 'Physical', status: 'Frozen', statusClass: 'pm-badge pm-badge-danger' },
  ]);

  /* ---------- Cardholder detail modal ---------- */
  cardholderProfile = signal<CardholderProfile>({
    initials: 'JK',
    name: 'James Kamau',
    email: 'james@techcorp.co.ke',
    phone: '+254 712 345 678',
    kycStatus: 'KYC Verified',
    kycStatusClass: 'pm-badge pm-badge-success',
    program: 'Corporate Expense (BIN 441011)',
    walletId: 'WAL-882193',
  });

  cardholderCard = signal<CardholderCard>({
    brandIcon: 'bi bi-building',
    brand: 'TechCorp Expense',
    wifiIcon: 'bi bi-wifi',
    pan: '4410  11**  ****  4421',
    name: 'JAMES KAMAU',
    expiry: '12/28',
  });

  cardholderTransactions = signal<CardholderTransaction[]>([
    { id: 'ct1', date: '27 Jun', merchant: 'Uber Eats', amount: 'KES 2,400', status: 'Settled', statusClass: 'pm-badge pm-badge-success' },
    { id: 'ct2', date: '25 Jun', merchant: 'Shell Petrol', amount: 'KES 5,000', status: 'Settled', statusClass: 'pm-badge pm-badge-success' },
    { id: 'ct3', date: '24 Jun', merchant: 'AWS Cloud', amount: '$142.50', status: 'Auth Hold', statusClass: 'pm-badge pm-badge-warning' },
  ]);

  cardholderLimits = signal<CardholderLimit>({
    dailyCap: 'KES 50,000',
    singleTxnCap: 'KES 20,000',
    onlineEnabled: true,
    internationalEnabled: true,
  });

  /* Tab labels for the cardholder detail modal */
  chDetailTabs: TabItem[] = [
    { id: 'cards', label: 'Active Cards' },
    { id: 'txns', label: 'Transactions' },
    { id: 'limits', label: 'Limits' },
  ];

  /* ---------- BIN config modal form data ---------- */
  binConfigData = signal<BinConfigData>({
    bin: '4410 11**',
    programName: 'Corporate Expense',
    cardType: 'Virtual Credit',
    baseCurrency: 'KES',
    maxCardBalance: '500,000',
    settlementAccount: 'SET-9912048811',
    lowBalanceAlert: '5,000,000',
    settlementFrequency: 'Daily (T+1)',
  });

  /* ---------- Batch issue validation records (step 3) ---------- */
  batchValidationRecords = signal<BatchValidationRecord[]>([
    { id: 'bv1', name: 'Sarah Jenkins', idNumber: '29188211', initLimit: 'KES 50,000', status: 'Valid', statusClass: 'pm-badge pm-badge-success' },
    { id: 'bv2', name: 'Peter Omondi', idNumber: '31002911', initLimit: 'KES 20,000', status: 'Valid', statusClass: 'pm-badge pm-badge-success' },
  ]);
  batchValidationFooter = signal('...and 248 more');

  /* ---------- Approve batch modal summary ---------- */
  approveBatchData = signal<ApproveBatchData>({
    batchId: '#8892',
    program: 'Corporate Expense',
    cardCount: '250 Virtual',
    submittedBy: 'John Doe (Admin)',
  });

  /* ---------- Batch status modal ---------- */
  batchStatusData = signal({
    batchId: '#8891',
    status: 'In Production',
    statusClass: 'pm-badge pm-badge-info',
  });
  batchTrackingSteps = signal<BatchTrackingStep[]>([
    { id: 'bts1', stepNum: '', stepNumIcon: 'bi bi-check', title: 'Uploaded & Validated', detail: '150 records · 24 Jun 09:00', stepBgColor: 'var(--pm-accent)', stepColor: '#fff' },
    { id: 'bts2', stepNum: '', stepNumIcon: 'bi bi-check', title: 'Approved & Queued', detail: '24 Jun 10:15', stepBgColor: 'var(--pm-accent)', stepColor: '#fff' },
    { id: 'bts3', stepNum: '3', title: 'Printing & Personalization', detail: '40% complete · ETA 28 Jun', stepBgColor: 'var(--pm-primary)', stepColor: '#fff' },
    { id: 'bts4', stepNum: '4', title: 'Dispatch & Delivery', titleColor: 'var(--pm-muted)', detail: 'Pending', stepBgColor: '', stepColor: '' },
  ]);

  /* ---------- Fee schedule rows ---------- */
  feeSchedule = signal<FeeScheduleRow[]>([
    { id: 'fs1', feeType: 'Card Issuance (Physical)', amount: 'KES 500', status: 'Active', statusClass: 'pm-badge pm-badge-success' },
    { id: 'fs2', feeType: 'Monthly Maintenance', amount: 'KES 0', status: 'Inactive', statusClass: 'pm-badge pm-badge-outline' },
    { id: 'fs3', feeType: 'ATM Withdrawal (Local)', amount: 'KES 35', status: 'Active', statusClass: 'pm-badge pm-badge-success' },
    { id: 'fs4', feeType: 'Cross-Border FX Markup', amount: '2.5%', status: 'Active', statusClass: 'pm-badge pm-badge-success' },
    { id: 'fs5', feeType: 'Replacement Fee', amount: 'KES 500', status: 'Active', statusClass: 'pm-badge pm-badge-success' },
  ]);

  /* ---------- MCC blocklist categories ---------- */
  mccCategories = signal<MccCategory[]>([
    { id: 'mc1', code: '7995', label: 'Betting, Casino & Gambling', checked: true },
    { id: 'mc2', code: '6051', label: 'Crypto / Non-FI Fiat', checked: true },
    { id: 'mc3', code: '5921', label: 'Liquor Stores', checked: false },
    { id: 'mc4', code: '5814', label: 'Fast Food Restaurants', checked: false },
    { id: 'mc5', code: '7273', label: 'Dating & Escort Services', checked: false },
  ]);

  /* ---------- AML alerts ---------- */
  amlAlerts = signal<AmlAlert[]>([
    {
      id: 'aa1',
      riskLevel: 'High Risk',
      riskClass: 'pm-badge pm-badge-danger',
      cardLabel: 'Card *4421 (James Kamau)',
      detail: 'Suspicious geo-velocity: Nairobi -> Dubai in 30 mins',
      amount: '$850.00 Auth Hold',
      actions: [
        { label: 'Block Card', class: 'pm-btn pm-btn-sm pm-btn-danger', modal: 'forceFreezeModal' },
        { label: 'Clear Alert', class: 'pm-btn pm-btn-sm pm-btn-accent', processModal: 'amlReviewModal', processMessage: 'Alert cleared. Transaction approved.' },
      ],
    },
    {
      id: 'aa2',
      riskLevel: 'Med Risk',
      riskClass: 'pm-badge pm-badge-warning',
      cardLabel: 'Card *1102 (TechCorp Marketing)',
      detail: 'Pattern deviation: 15 micro-transactions in 2 hours',
      amount: 'Facebook Ads',
      actions: [
        { label: 'Block Card', class: 'pm-btn pm-btn-sm pm-btn-danger' },
        { label: 'Clear Alert', class: 'pm-btn pm-btn-sm pm-btn-accent' },
      ],
    },
  ]);

  /* ---------- Dispute cases (pending tab) ---------- */
  disputeCases = signal<DisputeCase[]>([
    { id: 'dc1', caseId: 'CB-1192', cardholder: 'Sarah Jenkins', amount: '$45.00', reasonCode: 'Fraud (Not Authorized)', deadline: '2 Days', hasReviewAction: true },
    { id: 'dc2', caseId: 'CB-1188', cardholder: 'Peter Omondi', amount: 'KES 12,500', reasonCode: 'Services Not Rendered', deadline: '5 Days', hasReviewAction: false },
  ]);

  /* ---------- Settlement details ---------- */
  settlementData = signal<SettlementData>({
    balance: 'KES 4,250,000',
    threshold: 'KES 5M',
    isBelowThreshold: true,
    topUpOptions: ['Transfer from Main Treasury (Acc *8812)', 'Wire Transfer Instructions (PDF)'],
    amount: '5,000,000',
  });

  /* ---------- Geo-fencing rules ---------- */
  geoRules = signal<GeoRule[]>([
    { id: 'gr1', title: 'East Africa Only Mode', description: 'Restrict physical transactions to Kenya, Uganda, Tanzania, Rwanda.', checked: true },
    { id: 'gr2', title: 'High-Risk Jurisdiction Block', description: 'Auto-decline CNP & POS transactions from FATF high-risk countries.', checked: false },
  ]);

  /* ---------- Webhook events + config ---------- */
  webhookEvents = signal<WebhookEvent[]>([
    { id: 'we1', eventName: 'card.created', checked: true },
    { id: 'we2', eventName: 'card.status_changed', checked: true },
    { id: 'we3', eventName: 'transaction.authorized', checked: true },
    { id: 'we4', eventName: 'transaction.declined', checked: true },
  ]);
  webhookEventsCol1 = computed(() => this.webhookEvents().slice(0, 2));
  webhookEventsCol2 = computed(() => this.webhookEvents().slice(2));

  webhookConfig = signal<WebhookConfig>({
    url: 'https://api.techcorp.com/v1/cards/webhook',
    signingSecret: 'whsec_1234567890abcdef',
    failureCount: 3,
    failureEndpoint: 'https://api.techcorp.com/v1/cards/webhook',
  });

  /* ---------- Inbox messages ---------- */
  inboxMessages = signal<InboxMessage[]>([
    { id: 'im1', type: 'System', typeClass: 'pm-badge pm-badge-info', title: 'Visa Gateway Maintenance Notice', detail: 'Scheduled downtime on 30 Jun 02:00 EAT' },
    { id: 'im2', type: 'Compliance', typeClass: 'pm-badge pm-badge-warning', title: 'Updated AML Guidelines Q3 2025', detail: 'New reporting requirements for cross-border TXNs' },
  ]);

  /* ---------- Notifications ---------- */
  notificationAlerts = signal<NotificationAlert[]>([
    { id: 'na1', borderColor: 'var(--pm-danger)', title: 'Velocity Breach', message: 'Corporate Card *9921 hit daily limit.', time: '10 mins ago' },
    { id: 'na2', borderColor: 'var(--pm-info)', title: 'Batch Processed', message: 'Batch #8890 successfully issued 500 virtual cards.', time: '1 hour ago' },
    { id: 'na3', borderColor: 'var(--pm-warning)', title: 'Low Settlement Balance', message: 'Corporate BIN dropping below threshold.', time: '2 hours ago' },
  ]);

  /* ---------- Profile ---------- */
  profileData = signal<ProfileData>({
    initials: 'AO',
    avatarBg: 'var(--pm-gradient-slate)',
    name: 'Amina O.',
    email: 'admin@techcorp.co.ke',
    role: 'Super Admin',
    twoFAStatus: 'Enabled',
    twoFAClass: 'pm-badge pm-badge-success',
    lastLogin: 'Today, 08:14 EAT',
    accessLevel: 'Level 4 (BIN Admin)',
  });

  /* ---------- Suspend program options ---------- */
  suspendPrograms = signal<string[]>(['Corporate Expense (441011)']);

  /* ---------- 5. Form option lists ---------- */
  networks = signal<string[]>(['Visa', 'Mastercard', 'UnionPay']);
  formFactors = signal<string[]>(['Virtual Only', 'Physical Only', 'Virtual + Physical Companion']);
  fundingModels = signal<string[]>(['Prepaid (Cardholder funded)', 'Prepaid (Corporate funded)', 'Credit (Issuer ledger)']);
  cardFormats = signal<string[]>(['Virtual Cards (Instant issue)', 'Physical Cards (Requires printing & dispatch)']);
  velocityPrograms = signal<string[]>(['Corporate Expense (441011)', 'Standard Retail (552900)']);
  baseCurrencies = signal<string[]>(['KES', 'USD']);
  settlementFrequencies = signal<string[]>(['Daily (T+1)', 'Real-time']);
  forceFreezeReasons = signal<string[]>([
    'Suspected Fraud (Permanent)',
    'AML Investigation (Temporary)',
    'Corporate Policy Breach (Temporary)',
    'Lost / Stolen (Permanent)',
  ]);
  pinDeliveryChannels = signal<string[]>([
    'Email (ja***@techcorp.co.ke)',
    'SMS (+254 712 *** 678)',
    'Both',
  ]);
  replaceReasons = signal<string[]>(['Lost / Stolen', 'Damaged / Unreadable', 'Compromised / Fraud', 'Name Change']);
  replacementFeeOptions = signal<string[]>(['Waive Fee (Operator Override)', 'Charge Standard Fee (KES 500)']);
  approveBatchActions = signal<string[]>(['Approve & Push to Production', 'Reject & Return to Maker']);
  mccPrograms = signal<string[]>(['Corporate Expense']);
  reportTypes = signal<string[]>(['Settlement Reconciliation', 'Card Issuance Ledger', 'Fraud & Dispute Log', 'Interchange Revenue Statement']);
  reportFormats = signal<string[]>(['CSV', 'Excel', 'PDF']);
  feePrograms = signal<string[]>(['Corporate Expense (441011)']);

  /* Export report date range */
  reportDateRange = signal({ from: '2025-06-01', to: '2025-06-27' });

  ngOnInit(): void {
    // Hook for initial API load, e.g.:
    // this.programService.getBinPrograms().subscribe(b => this.binPrograms.set(b));
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
    if (this.processed()?.modalId === id) {
      this.processed.set(null);
    }
    if (this.loadingModalId() === id) {
      this.loadingModalId.set(null);
    }
    // Reset multi-step / search state on close
    if (id === 'issueBatchModal') {
      this.batchStep.set(1);
    }
    if (id === 'cardholderSearchModal') {
      this.searchPerformed.set(false);
    }
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

  /* ---------- Issue Batch multi-step navigation ---------- */
  batchNextLabel(): string {
    if (this.batchStep() === 3) return 'Submit Batch';
    if (this.batchStep() === 4) return 'Done';
    return 'Next Step';
  }

  nextBatchStep(): void {
    if (this.flowLoading()) return;
    const cur = this.batchStep();
    if (cur === 3) {
      this.flowLoading.set(true);
      setTimeout(() => {
        this.flowLoading.set(false);
        this.batchStep.set(4);
      }, 1200);
      return;
    }
    if (cur >= 4) {
      this.closeModal('issueBatchModal');
      return;
    }
    this.batchStep.set(cur + 1);
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

  /* ---------- Cardholder search ---------- */
  performSearch(): void {
    this.searchPerformed.set(true);
  }

  /* ---------- Tab switchers (typed signals, no DOM manipulation) ---------- */
  setChDetailTab(tab: 'cards' | 'txns' | 'limits'): void {
    this.chDetailTab.set(tab);
  }

  setBinConfigTab(tab: 'general' | 'auth' | 'settlement'): void {
    this.binConfigTab.set(tab);
  }

  setDisputeTab(tab: 'pending' | 'representment' | 'closed'): void {
    this.disputeTab.set(tab);
  }

  /* ---------- AML alert action dispatcher ---------- */
  handleAmlAction(action: AmlAlertAction): void {
    if (action.modal) {
      this.openModal(action.modal);
    } else if (action.processModal) {
      this.processAction(action.processModal, action.processMessage ?? '', '');
    }
    // No-op when neither target is defined (matches original static button behaviour).
  }

  /* ---------- Format helpers ---------- */
  networkBadgeStyle(network: CardNetwork): string {
    return network === 'Visa' ? 'background:#1434CB;color:white' : 'background:#EB001B;color:white';
  }

  binStatusBadgeClass(status: BinStatus): string {
    switch (status) {
      case 'active': return 'pm-badge pm-badge-success';
      case 'awaiting': return 'pm-badge pm-badge-warning';
      case 'suspended': return 'pm-badge pm-badge-danger';
    }
  }

  binStatusLabel(status: BinStatus): string {
    switch (status) {
      case 'active': return 'Active';
      case 'awaiting': return 'Awaiting Setup';
      case 'suspended': return 'Suspended';
    }
  }

  statusRowBadgeClass(badge: 'warning' | 'info' | 'success'): string {
    switch (badge) {
      case 'warning': return 'pm-badge pm-badge-warning';
      case 'info': return 'pm-badge pm-badge-info';
      case 'success': return 'pm-badge pm-badge-success';
    }
  }
}
