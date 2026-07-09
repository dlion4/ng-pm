import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const bootstrap: any;

// ==================== INTERFACES (from original reconciliation-center) ====================

export interface HeroStats {
  matchRate: number; reconciled: number; total: number; banks: number; exceptions: number;
  matchedToday: number; matchedSinceMorning: number; pendingExceptions: number;
  highValueExceptions: number; unmatchedAmount: string; swiftItems: number;
  auditEntries: number; lastRunDate: string;
}

export interface AttentionItem {
  icon: string; iconBg: string; iconColor: string; title: string; subtitle: string;
  actionModal: string; actionLabel: string;
}

export interface SmartSuggestion {
  icon: string; iconBg: string; iconColor: string; title: string; subtitle: string;
  actionModal: string; actionLabel: string;
}

export interface QuickAction {
  icon: string; iconColor: string; label: string; modal: string;
}

export interface BankCoverage {
  name: string; rate: string; badgeClass: string;
}

export interface ActivityBar {
  height: number; color: string; label: string;
}

export interface ExceptionBreakdown {
  type: string; count: number; badgeClass: string;
}

export interface HealthStats {
  autoMatchRate: number; manualReview: number; avgResolution: string;
}

export interface PendingTransaction {
  date: string; bank: string; ref: string; desc: string; amt: string; dir: string;
  status: string; statusClass: string;
}

export interface MatchedTransaction {
  id: string; date: string; bankA: string; bankB: string; amt: string; by: string;
  time: string; result: string;
}

export interface ExceptionItem {
  id: string; ref: string; issue: string; amt: string; pri: string; priClass: string; assigned: string;
}

export interface RuleItem {
  name: string; cond: string; rate: string; last: string; status: string; statusClass: string;
}

export interface TopRule {
  name: string; desc: string; rate: string;
}

export interface AuditLog {
  time: string; user: string; action: string; item: string; result: string; resultClass: string;
}

export interface AuditLogFull {
  timestamp: string; user: string; action: string; item: string; details: string;
  result: string; resultClass: string;
}

export interface Tolerance {
  label: string; value: string;
}

export interface NotificationSetting {
  id: string; label: string; checked: boolean;
}

export interface TeamPermission {
  name: string; access: string; badgeClass: string;
}

export interface NotificationItem {
  title: string; subtitle: string; bgColor: string; textColor: string;
}

export interface TeamUser {
  name: string; role: string; access: string; badgeClass: string;
}

export interface RulePerformance {
  matchRate: number; itemsProcessed: number; falsePositives: number;
  weeks: { week: string; matches: number; exceptions: number; accuracy: number }[];
}

export interface BulkItem {
  ref: string; amt: string; confidence: string; badgeClass: string; selected: boolean;
}

// ==================== PAYMENT RAILS INTERFACES ====================

interface Bank {
  name: string; status: string; health: string; rails: string; settle: string; limit: string; color: string;
}

interface RoutingRule {
  name: string; amount: string; rail: string; fallback: string; priority: number; status: string;
}

interface RailConfig {
  name: string; enabled: boolean; cutoff: string; perTx: string; daily: string; webhook: string;
}

interface NostroAccount {
  name: string; currency: string; balance: string; bank: string; status: string;
}

// ==================== COMPONENT ====================

@Component({
  selector: 'app-reconciliation-center',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reconciliation-center.html',
  styleUrls: ['./reconciliation-center.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReconciliationCenterComponent implements OnInit {

  // ==================== MODAL STATE ====================
  activeModal: string | null = null;

  // ==================== HERO STATS ====================
  heroStats: HeroStats = {
    matchRate: 94.7, reconciled: 8412, total: 8882, banks: 6, exceptions: 47,
    matchedToday: 8412, matchedSinceMorning: 312, pendingExceptions: 47,
    highValueExceptions: 12, unmatchedAmount: '18.4M', swiftItems: 3,
    auditEntries: 124892, lastRunDate: '27 Jun 2025, 14:12'
  };

  // ==================== ATTENTION ITEMS ====================
  attentionItems: AttentionItem[] = [
    { icon: 'bi-bank', iconBg: 'var(--pm-danger-soft)', iconColor: 'var(--pm-danger)', title: 'Equity Bank credit not matched', subtitle: 'KES 2.8M • Ref EQ-882910', actionModal: 'manualMatchModal', actionLabel: 'Match' },
    { icon: 'bi-exclamation-triangle', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'KCB debit duplicate detected', subtitle: 'KES 450,000 • Same ref twice', actionModal: 'discrepancyModal', actionLabel: 'Review' },
    { icon: 'bi-globe', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', title: 'SWIFT inbound pending FX rate', subtitle: 'USD 125,000 • Rate lock expired', actionModal: 'fxRateModal', actionLabel: 'Resolve' }
  ];

  // ==================== SMART SUGGESTIONS ====================
  smartSuggestions: SmartSuggestion[] = [
    { icon: 'bi-magic', iconBg: 'var(--pm-accent-soft)', iconColor: 'var(--pm-accent)', title: 'Run auto-match on 34 pending items', subtitle: 'Confidence > 92%', actionModal: 'runAutoReconModal', actionLabel: 'Run' },
    { icon: 'bi-link-45deg', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'Create rule for recurring payroll', subtitle: 'KES 8.2M every 25th', actionModal: 'ruleEngineModal', actionLabel: 'Create' },
    { icon: 'bi-file-earmark-text', iconBg: 'var(--pm-purple-soft)', iconColor: 'var(--pm-purple)', title: 'Export June reconciliation report', subtitle: 'Ready for auditors', actionModal: 'exportReportModal', actionLabel: 'Export' }
  ];

  // ==================== QUICK ACTIONS ====================
  quickActions: QuickAction[] = [
    { icon: 'bi-hand-index', iconColor: 'var(--pm-primary)', label: 'Manual Match', modal: 'manualMatchModal' },
    { icon: 'bi-exclamation-triangle', iconColor: 'var(--pm-warning)', label: 'Flag Exception', modal: 'discrepancyModal' },
    { icon: 'bi-upload', iconColor: 'var(--pm-accent)', label: 'Upload Statement', modal: 'uploadStatementModal' },
    { icon: 'bi-collection', iconColor: 'var(--pm-info)', label: 'Bulk Match', modal: 'bulkMatchModal' },
    { icon: 'bi-magic', iconColor: 'var(--pm-purple)', label: 'Auto-Rule', modal: 'ruleEngineModal' },
    { icon: 'bi-currency-exchange', iconColor: 'var(--pm-danger)', label: 'FX Rate', modal: 'fxRateModal' },
    { icon: 'bi-clock-history', iconColor: 'var(--pm-muted)', label: 'Audit Log', modal: 'auditLogModal' },
    { icon: 'bi-download', iconColor: 'var(--pm-accent)', label: 'Reports', modal: 'exportReportModal' }
  ];

  // ==================== BANK COVERAGE ====================
  bankCoverage: BankCoverage[] = [
    { name: 'Equity Bank', rate: '98.4%', badgeClass: 'B-s' },
    { name: 'KCB Bank', rate: '96.1%', badgeClass: 'B-s' },
    { name: 'Co-op Bank', rate: '94.8%', badgeClass: 'B-s' },
    { name: 'Stanbic Bank', rate: '89.2%', badgeClass: 'B-w' },
    { name: 'M-Pesa B2B', rate: '99.1%', badgeClass: 'B-s' }
  ];

  // ==================== ACTIVITY BARS ====================
  activityBars: ActivityBar[] = [
    { height: 85, color: 'var(--pm-primary)', label: 'Equity' },
    { height: 72, color: 'var(--pm-info)', label: 'KCB' },
    { height: 68, color: 'var(--pm-accent)', label: 'Co-op' },
    { height: 55, color: 'var(--pm-warning)', label: 'Stanbic' },
    { height: 90, color: 'var(--pm-purple)', label: 'M-Pesa' }
  ];

  // ==================== EXCEPTION BREAKDOWN ====================
  exceptionBreakdown: ExceptionBreakdown[] = [
    { type: 'Amount mismatch', count: 18, badgeClass: 'B-d' },
    { type: 'Duplicate', count: 9, badgeClass: 'B-w' },
    { type: 'Missing reference', count: 12, badgeClass: 'B-i' },
    { type: 'FX rate pending', count: 5, badgeClass: 'B-p' },
    { type: 'Timing difference', count: 3, badgeClass: 'B-s' }
  ];

  // ==================== HEALTH STATS ====================
  healthStats: HealthStats = {
    autoMatchRate: 94.7, manualReview: 47, avgResolution: '14 min'
  };

  // ==================== PENDING DATA ====================
  pendingData: PendingTransaction[] = [
    { date: '27 Jun', bank: 'Equity', ref: 'EQ-882910', desc: 'Payroll transfer', amt: 'KES 2,800,000', dir: 'Debit', status: 'Unmatched', statusClass: 'B-w' },
    { date: '27 Jun', bank: 'KCB', ref: 'KCB-991028', desc: 'Incoming transfer', amt: 'KES 2,800,000', dir: 'Credit', status: 'Unmatched', statusClass: 'B-w' },
    { date: '26 Jun', bank: 'Co-op', ref: 'COOP-77102', desc: 'Supplier payment', amt: 'KES 450,000', dir: 'Debit', status: 'Exception', statusClass: 'B-d' }
  ];

  // ==================== MATCHED DATA ====================
  matchedData: MatchedTransaction[] = [
    { id: 'MATCH-88291', date: '27 Jun', bankA: 'Equity', bankB: 'KCB', amt: 'KES 2,800,000', by: 'James K.', time: '14:32', result: 'Matched' },
    { id: 'MATCH-88290', date: '27 Jun', bankA: 'KCB', bankB: 'M-Pesa', amt: 'KES 1,200,000', by: 'System', time: '14:28', result: 'Matched' }
  ];

  // ==================== EXCEPTION DATA ====================
  exceptionData: ExceptionItem[] = [
    { id: 'EXC-9910', ref: 'KCB-99102', issue: 'Amount mismatch', amt: 'KES 50,000', pri: 'High', priClass: 'B-d', assigned: 'James K.' },
    { id: 'EXC-9909', ref: 'EQ-882901', issue: 'Duplicate', amt: 'KES 120,000', pri: 'Medium', priClass: 'B-w', assigned: 'Grace M.' }
  ];

  // ==================== RULE DATA ====================
  ruleData: RuleItem[] = [
    { name: 'Payroll Auto-Match v2', cond: 'Amount ±500, Ref PAY-', rate: '99.2%', last: '27 Jun 14:28', status: 'Active', statusClass: 'B-s' },
    { name: 'Supplier Invoice', cond: 'Amount ±2%, 3-day window', rate: '97.8%', last: '27 Jun 09:15', status: 'Active', statusClass: 'B-s' }
  ];

  // ==================== TOP RULES ====================
  topRules: TopRule[] = [
    { name: 'Payroll Auto-Match', desc: 'Exact amount + ref prefix', rate: '99.2%' },
    { name: 'Supplier Invoice', desc: 'Amount ±2% + date window', rate: '97.8%' },
    { name: 'Internal Transfer', desc: 'Same bank, same day', rate: '100%' }
  ];

  // ==================== QUICK REPORTS ====================
  quickReports: string[] = ['Daily Reconciliation', 'Monthly Summary', 'Exception Report', 'Audit Certificate'];

  // ==================== AUDIT ACTIVITY ====================
  auditActivity: AuditLog[] = [
    { time: '14:32', user: 'James K.', action: 'Manual Match', item: 'EQ-882910', result: 'Matched', resultClass: 'B-s' },
    { time: '14:28', user: 'System', action: 'Auto-Rule', item: '47 items', result: 'Success', resultClass: 'B-s' },
    { time: '13:55', user: 'Grace M.', action: 'Flag Exception', item: 'KCB-99102', result: 'Flagged', resultClass: 'B-w' }
  ];

  // ==================== TOLERANCES ====================
  tolerances: Tolerance[] = [
    { label: 'Amount tolerance', value: '± KES 100' },
    { label: 'Date window', value: '± 3 days' },
    { label: 'Reference similarity', value: '85%' }
  ];

  // ==================== NOTIFICATIONS ====================
  notifications: NotificationSetting[] = [
    { id: 'notif1', label: 'High-value exceptions', checked: true },
    { id: 'notif2', label: 'Auto-match success', checked: true },
    { id: 'notif3', label: 'Daily summary email', checked: false }
  ];

  // ==================== TEAM PERMISSIONS ====================
  teamPermissions: TeamPermission[] = [
    { name: 'Finance Team', access: 'Full access', badgeClass: 'B-s' },
    { name: 'Auditors', access: 'View only', badgeClass: 'B-i' },
    { name: 'Ops Staff', access: 'Match only', badgeClass: 'B-w' }
  ];

  // ==================== NOTIFICATIONS LIST ====================
  notificationsList: NotificationItem[] = [
    { title: 'High-value exception flagged', subtitle: 'KES 2.8M • EQ-882910', bgColor: 'var(--pm-danger-soft)', textColor: '#7F1D1D' },
    { title: 'Auto-recon completed', subtitle: '42 items matched • 5 exceptions', bgColor: 'var(--pm-warning-soft)', textColor: '#92400E' },
    { title: 'Statement processed', subtitle: 'Equity Bank • 1,284 transactions', bgColor: 'var(--pm-accent-soft)', textColor: '#065F46' }
  ];

  // ==================== TEAM USERS ====================
  teamUsers: TeamUser[] = [
    { name: 'James K.', role: 'Finance Manager', access: 'Full', badgeClass: 'B-s' },
    { name: 'Grace M.', role: 'Reconciliation Lead', access: 'Match + Flag', badgeClass: 'B-i' },
    { name: 'Auditor Team', role: 'External Auditors', access: 'View Only', badgeClass: 'B-w' }
  ];

  // ==================== RULE PERFORMANCE ====================
  rulePerf: RulePerformance = {
    matchRate: 99.2, itemsProcessed: 12481, falsePositives: 0.8,
    weeks: [
      { week: 'Week 26', matches: 2841, exceptions: 12, accuracy: 99.6 },
      { week: 'Week 25', matches: 2712, exceptions: 18, accuracy: 99.3 },
      { week: 'Week 24', matches: 2654, exceptions: 21, accuracy: 99.2 }
    ]
  };

  // ==================== BULK ITEMS ====================
  bulkItems: BulkItem[] = [
    { ref: 'EQ-882910', amt: 'KES 2,800,000', confidence: '96%', badgeClass: 'B-s', selected: true },
    { ref: 'KCB-991028', amt: 'KES 2,800,000', confidence: '94%', badgeClass: 'B-s', selected: true },
    { ref: 'COOP-77102', amt: 'KES 450,000', confidence: '72%', badgeClass: 'B-w', selected: false }
  ];

  // ==================== ATTENTION FULL ITEMS ====================
  attentionFullItems: AttentionItem[] = [
    { icon: '', iconBg: '', iconColor: '', title: 'Equity credit not matched', subtitle: 'KES 2.8M', actionModal: 'manualMatchModal', actionLabel: 'Match' },
    { icon: '', iconBg: '', iconColor: '', title: 'KCB debit duplicate', subtitle: 'KES 450k', actionModal: 'discrepancyModal', actionLabel: 'Review' },
    { icon: '', iconBg: '', iconColor: '', title: 'SWIFT FX rate pending', subtitle: 'USD 125k', actionModal: 'fxRateModal', actionLabel: 'Resolve' }
  ];

  // ==================== MODAL RULES ====================
  modalRules: RuleItem[] = [
    { name: 'Payroll Auto-Match v2', cond: 'Amount ±500, Ref PAY-', rate: '99.2%', last: '27 Jun 14:28', status: 'Active', statusClass: 'B-s' },
    { name: 'Supplier Invoice', cond: 'Amount ±2%, 3-day window', rate: '97.8%', last: '27 Jun 09:15', status: 'Active', statusClass: 'B-s' }
  ];

  // ==================== AUDIT LOGS (full modal) ====================
  auditLogs: AuditLogFull[] = [
    { timestamp: '27 Jun 14:32', user: 'James K.', action: 'Manual Match', item: 'EQ-882910', details: 'Matched to KCB-991028', result: 'Success', resultClass: 'B-s' },
    { timestamp: '27 Jun 14:28', user: 'System', action: 'Auto-Rule', item: '47 items', details: 'Payroll rule applied', result: 'Success', resultClass: 'B-s' },
    { timestamp: '27 Jun 13:55', user: 'Grace M.', action: 'Flag Exception', item: 'KCB-99102', details: 'Amount mismatch KES 50k', result: 'Flagged', resultClass: 'B-w' },
    { timestamp: '27 Jun 12:10', user: 'System', action: 'Statement Upload', item: 'Equity 27 Jun', details: '1,284 transactions', result: 'Processed', resultClass: 'B-s' }
  ];

  // ==================== MULTI-STEP FLOW STATE ====================
  matchSteps: string[] = ['Select', 'Confirm', 'Done'];
  matchCurrentStep: number = 1;
  matchForm = { matchType: 'Exact match', internalRef: 'PAY-2025-0627-001', notes: 'Payroll transfer from Equity to KCB for June salaries. Approved by Finance on 26 Jun.' };

  discSteps: string[] = ['Details', 'Issue', 'Done'];
  discCurrentStep: number = 1;
  discForm = { bank: 'Equity Bank', reference: 'EQ-991022', amount: '1,450,000', date: '2025-06-26', issueType: 'Amount mismatch', priority: 'High', assignedTo: 'James K.', description: 'Amount on statement is KES 1,450,000 but expected was KES 1,500,000. Difference of KES 50,000 needs investigation.' };

  ruleSteps: string[] = ['Basics', 'Conditions', 'Actions', 'Done'];
  ruleCurrentStep: number = 1;
  ruleTab: string = 'create';
  ruleForm = { name: 'Payroll Auto-Match v2', appliesTo: 'Equity → KCB', amountTolerance: '± KES 500', dateWindow: '± 3 days', refPrefix: 'PAY-', mustBeCredit: true, descContainsPayroll: true, onMatch: 'Auto-confirm', notifyOn: 'Match success' };
  ruleTest = { amount: '2,800,500', reference: 'PAY-2025-0627-001' };
  ruleTestResult: string = '';

  bulkSteps: string[] = ['Select', 'Review', 'Done'];
  bulkCurrentStep: number = 1;

  // ==================== FORM STATE ====================
  uploadForm = { bank: 'Equity Bank', dateFrom: '2025-06-01', dateTo: '2025-06-27' };
  fxForm = { actualRate: '128.80', resolution: 'Accept bank rate (write-off)' };
  exportForm = { reportType: 'Daily Reconciliation Summary', dateFrom: '2025-06-01', dateTo: '2025-06-27', format: 'PDF (Signed)', delivery: 'Download now' };
  auditFilter = { user: 'All Users', action: 'All Actions', search: '' };
  matchedFilter = { bankPair: 'All Pairs', matchedBy: 'All' };
  settings = { amountTolerance: 'KES 500', dateWindow: '± 3 days', autoRun: true, emailSummary: true };
  filterForm = { status: 'All', priority: 'All' };
  disputeForm = { bank: 'Equity Bank', reference: 'EQ-882910', reason: 'Incorrect amount', description: 'Bank debited KES 2,800,000 but only KES 2,750,000 was authorized.' };

  // ==================== PAYMENT RAILS DATA (needed by HTML) ====================
  banks: Bank[] = [
    { name: 'Equity Bank', status: 'active', health: 'degraded', rails: 'PesaLink,RTGS,ACH', settle: '09:00-16:00', limit: 'KES 100M', color: '#EF4444' },
    { name: 'KCB Bank', status: 'active', health: 'healthy', rails: 'PesaLink,RTGS,ACH,Card', settle: '08:00-17:00', limit: 'KES 200M', color: '#10B981' },
    { name: 'Co-operative Bank', status: 'active', health: 'healthy', rails: 'PesaLink,RTGS,ACH', settle: '09:00-16:00', limit: 'KES 150M', color: '#10B981' },
    { name: 'Absa Bank', status: 'active', health: 'healthy', rails: 'PesaLink,RTGS,SWIFT', settle: '08:30-16:30', limit: 'KES 250M', color: '#10B981' },
    { name: 'Stanbic Bank', status: 'active', health: 'healthy', rails: 'PesaLink,RTGS,ACH,SWIFT', settle: '09:00-17:00', limit: 'KES 300M', color: '#10B981' },
    { name: 'Family Bank', status: 'paused', health: 'paused', rails: 'PesaLink,ACH', settle: '09:00-15:00', limit: 'KES 50M', color: '#9CA3AF' },
    { name: 'DTB Bank', status: 'active', health: 'healthy', rails: 'PesaLink,RTGS,Card', settle: '08:00-16:00', limit: 'KES 120M', color: '#10B981' },
    { name: 'I&M Bank', status: 'active', health: 'healthy', rails: 'PesaLink,RTGS,ACH', settle: '09:00-16:00', limit: 'KES 180M', color: '#10B981' }
  ];

  routingRules: RoutingRule[] = [
    { name: 'High-Value Instant', amount: 'KES 1M–50M', rail: 'PesaLink', fallback: 'RTGS', priority: 1, status: 'Active' },
    { name: 'Salary Batch', amount: 'KES 500K+', rail: 'ACH', fallback: 'PesaLink', priority: 2, status: 'Active' },
    { name: 'International USD', amount: 'USD 10K+', rail: 'SWIFT', fallback: '—', priority: 3, status: 'Paused' },
    { name: 'Low-Value Fast', amount: 'KES 1–100K', rail: 'Card-to-Bank', fallback: 'PesaLink', priority: 1, status: 'Active' }
  ];

  railConfigs: RailConfig[] = [
    { name: 'PesaLink Instant', enabled: true, cutoff: '16:00', perTx: 'KES 100M', daily: 'KES 2B', webhook: 'Active' },
    { name: 'RTGS', enabled: true, cutoff: '15:30', perTx: 'KES 500M', daily: 'KES 10B', webhook: 'Active' },
    { name: 'ACH', enabled: true, cutoff: '14:00', perTx: 'KES 50M', daily: 'KES 1B', webhook: 'Active' },
    { name: 'SWIFT', enabled: false, cutoff: '12:00', perTx: 'USD 1M', daily: 'USD 50M', webhook: 'Inactive' },
    { name: 'Card-to-Bank', enabled: true, cutoff: '23:59', perTx: 'KES 500K', daily: 'KES 5M', webhook: 'Active' }
  ];

  nostroAccounts: NostroAccount[] = [
    { name: 'Nostro USD', currency: 'USD', balance: '$2,847,500', bank: 'Standard Chartered NY', status: 'Matched' },
    { name: 'Nostro EUR', currency: 'EUR', balance: '€1,204,800', bank: 'Deutsche Bank Frankfurt', status: 'Matched' },
    { name: 'Nostro GBP', currency: 'GBP', balance: '£892,400', bank: 'Barclays London', status: 'Investigate' },
    { name: 'Vostro KES', currency: 'KES', balance: 'KES 184.2M', bank: 'PayMo Settlement', status: 'Matched' }
  ];

  // ==================== PAYMENT RAILS TAB STATE ====================
  activeRuleTab: string = 'rule-create';
  activeRailTab: string = 'rail-limits';
  activeNostroTab: string = 'nost-bal';
  activePerfTab: string = 'perf-success';

  // ==================== PAYMENT RAILS FLOW STATE ====================
  addBankSteps: string[] = ['Bank', 'Rails', 'Limits', 'Done'];
  addBankCurrentStep: number = 1;
  addBankTotalSteps: number = 4;

  // ==================== MODAL BACKUPS ====================
  private modalBackups: Map<string, { body: string; footer: string }> = new Map();

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.cacheModals();
  }

  // ==================== COMPUTED PROPERTIES ====================
  get selectedBulkCount(): number {
    return this.bulkItems.filter(i => i.selected).length;
  }

  get selectedBulkTotal(): string {
    const selected = this.bulkItems.filter(i => i.selected);
    if (selected.length === 0) return '0';
    return '5,600,000';
  }

  // ==================== MODAL METHODS ====================
  openModal(id: string): void {
    this.activeModal = id;
    const el = document.getElementById(id);
    if (el) {
      const modal = new bootstrap.Modal(el);
      modal.show();
    }
  }

  closeModal(): void {
    this.activeModal = null;
  }

  closeModalById(id: string): void {
    const el = document.getElementById(id);
    if (!el) return;
    const modal = bootstrap.Modal.getInstance(el);
    if (modal) modal.hide();
  }

  // ==================== TAB SWITCHING ====================
  sw(prefix: string, key: string, event?: Event): void {
    if (event) {
      const btn = event.target as HTMLElement;
      const parent = btn.parentElement;
      if (parent) {
        parent.querySelectorAll('.pill').forEach((b: any) => b.classList.remove('active'));
      }
      btn.classList.add('active');
    }

    const tabId = prefix + '-' + key;
    if (prefix === 'rule') this.activeRuleTab = tabId;
    if (prefix === 'rail') this.activeRailTab = tabId;
    if (prefix === 'nost') this.activeNostroTab = tabId;
    if (prefix === 'perf') this.activePerfTab = tabId;
  }

  // ==================== STEP FLOW METHODS ====================
  nextFlow(key: string, total: number): void {
    if (key === 'addBank') {
      if (this.addBankCurrentStep === total - 1) {
        this.showLoading('addBankModal', () => {
          this.addBankCurrentStep = total;
        });
        return;
      }
      if (this.addBankCurrentStep >= total) {
        this.closeModalById('addBankModal');
        this.resetFlow('addBank');
        return;
      }
      this.addBankCurrentStep++;
    }
  }

  resetFlow(key: string): void {
    if (key === 'addBank') {
      this.addBankCurrentStep = 1;
    }
  }

  nextMatchStep(): void {
    if (this.matchCurrentStep < 3) {
      this.matchCurrentStep++;
    } else {
      this.closeModal();
      this.matchCurrentStep = 1;
    }
  }

  nextDiscStep(): void {
    if (this.discCurrentStep < 3) {
      this.discCurrentStep++;
    } else {
      this.closeModal();
      this.discCurrentStep = 1;
    }
  }

  nextRuleStep(): void {
    if (this.ruleCurrentStep < 4) {
      this.ruleCurrentStep++;
    } else {
      this.closeModal();
      this.ruleCurrentStep = 1;
    }
  }

  nextBulkStep(): void {
    if (this.bulkCurrentStep < 3) {
      this.bulkCurrentStep++;
    } else {
      this.closeModal();
      this.bulkCurrentStep = 1;
    }
  }

  switchRuleTab(tab: string): void {
    this.ruleTab = tab;
  }

  // ==================== LOADING & ACTION ====================
  showLoading(modalId: string, callback: () => void): void {
    const modal = document.getElementById(modalId);
    if (!modal) { callback(); return; }
    const body = modal.querySelector('.modal-body');
    if (!body) { callback(); return; }

    const ov = this.renderer.createElement('div');
    this.renderer.addClass(ov, 'loading-ov');
    ov.innerHTML = '<div class="spinner"></div><p style="margin-top:12px;font-size:13px;font-weight:600;color:var(--pm-primary)">Processing...</p>';
    this.renderer.setStyle(body, 'position', 'relative');
    this.renderer.appendChild(body, ov);

    setTimeout(() => {
      this.renderer.removeChild(body, ov);
      callback();
    }, 1500);
  }

  doAction(modalId: string, msg: string, ref: string): void {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const body = modal.querySelector('.modal-body') as HTMLElement;
    const footer = modal.querySelector('.modal-footer') as HTMLElement;

    this.showLoading(modalId, () => {
      if (body) {
        body.innerHTML = `<div class="receipt"><div class="ri"><i class="bi bi-check-lg"></i></div><h5 style="font-weight:700;color:var(--pm-accent)">${msg}</h5>${ref ? `<p style="font-size:12px;color:var(--pm-muted)">Reference: ${ref}</p>` : ''}<div class="d-flex justify-content-center mt-3" style="gap:8px"><button class="btn-pm btn-sm reload-btn"><i class="bi bi-download"></i> Save</button><button class="btn-pm btn-sm reload-btn"><i class="bi bi-share"></i> Continue</button></div></div>`;
        body.querySelectorAll('.reload-btn').forEach((btn: any) => {
          btn.addEventListener('click', () => this.reloadPage());
        });
      }
      if (footer) {
        footer.innerHTML = '<button class="btn-pm btn-pm-p" data-bs-dismiss="modal">Done</button>';
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

  // ==================== FILE UPLOAD ====================
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log('File selected:', input.files[0].name);
    }
  }

  // ==================== RULE TEST ====================
  runRuleTest(): void {
    this.ruleTestResult = 'Rule test passed! Match confidence 98%.';
  }

  // ==================== CACHE & RESET MODALS ====================
  private cacheModals(): void {
    document.querySelectorAll('.R').forEach((m: any) => {
      const b = m.querySelector('.modal-body');
      const f = m.querySelector('.modal-footer');
      if (b) this.modalBackups.set(m.id, { body: b.innerHTML, footer: f ? f.innerHTML : '' });
    });

    document.querySelectorAll('.R').forEach((m: any) => {
      m.addEventListener('hidden.bs.modal', () => {
        const backup = this.modalBackups.get(m.id);
        if (backup) {
          const b = m.querySelector('.modal-body');
          const f = m.querySelector('.modal-footer');
          if (b) b.innerHTML = backup.body;
          if (f && backup.footer) f.innerHTML = backup.footer;
        }
        this.resetFlow('addBank');
      });
    });
  }
}