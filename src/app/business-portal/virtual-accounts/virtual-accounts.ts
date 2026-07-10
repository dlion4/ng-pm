import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NgClass } from '@angular/common';

interface FlowConfig { labels: string[]; closeOnDone?: boolean; doneMessage: string; }
interface StatusItem { status: 'active' | 'success' | 'warning' | 'danger' | 'paused' | 'cleared' | 'bank-error'; statusLabel: string; }
interface VirtualAccount extends StatusItem { id: string; name: string; type: string; balance: string; subAccounts: number; rules: number; }
interface SubAccount extends StatusItem { id: string; name: string; parent: string; balance: string; limit: string; }
interface FundingRecord extends StatusItem { ref: string; date: string; account: string; source: string; amount: string; }
interface ReconciliationBalance extends StatusItem { account: string; bookBalance: string; bankBalance: string; difference: string; actionModal?: string; actionLabel?: string; }
interface SimpleControl { name: string; value: string; status: StatusItem['status']; }
interface HierarchyNode { id: string; name: string; balance: string; children: Array<{ id: string; name: string; balance: string; status: StatusItem['status']; note: string }>; }
interface ActivityRecord extends StatusItem { date: string; account: string; description: string; amount: string; ref: string; }

interface VirtualAccountsMockData {
  virtualAccounts: VirtualAccount[];
  subAccounts: SubAccount[];
  fundingHistory: FundingRecord[];
  reconciliationBalances: ReconciliationBalance[];
  limitControls: SimpleControl[];
  automationRules: SimpleControl[];
  sweepRules: SimpleControl[];
  hierarchy: HierarchyNode[];
  recentActivity: ActivityRecord[];
}

@Component({
  selector: 'app-virtual-accounts',
  standalone: true,
  imports: [NgClass],
  templateUrl: './virtual-accounts.html',
  styleUrl: './virtual-accounts.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class VirtualAccountsComponent {
  // === PAGE METADATA (data-driven) ===
  readonly pageTitle = 'PAGE 3.9 — Virtual Accounts & Sub-Accounts';
  readonly pageSubtitle = 'Create, manage and reconcile business virtual accounts and sub-accounts with full funding controls, hierarchy, automation rules and audit trails.';
  readonly breadcrumbStrong = 'Virtual Accounts';

  readonly hero = {
    liveLabel: 'Virtual accounts live',
    count: '18 virtual accounts',
    stats: '12 main VAs + 47 sub-accounts • KES 124.8M total balance • 6 automated rules active',
  };

  readonly stats = [
    { label: 'TOTAL BALANCE', value: 'KES 124.8M', change: '+12.4% MoM', detail: 'Main VAs: KES 89.4M<br/>Sub-accounts: KES 35.4M', color: 'accent' },
    { label: 'THIS MONTH ACTIVITY', value: 'KES 312.6M', change: '4,812 txns', detail: 'Collections: KES 198.2M<br/>Disbursements: KES 114.4M', color: 'info' },
    { label: 'RECONCILIATION STATUS', value: '4 issues', change: 'Review needed', detail: '2 unmatched credits<br/>1 timing difference<br/>1 bank error', color: 'warning', border: true },
  ];

  readonly attentionItems = [
    { icon: 'exclamation-triangle', title: 'Unmatched credit KES 1.2M', sub: 'VA-003 • 26 Jun', action: 'Resolve', modal: 'reconModal' },
    { icon: 'clock', title: 'Sub-account limit breach', sub: 'Payroll Sub • KES 450K over', action: 'Adjust', modal: 'subLimitModal' },
    { icon: 'arrow-left-right', title: 'Auto-sweep rule paused', sub: 'Collections VA • 3 days', action: 'Resume', modal: 'autoSweepModal' },
  ];

  readonly suggestionItems = [
    { icon: 'diagram-3', title: 'Create 4 new project sub-accounts', sub: 'Based on upcoming contracts', action: 'Create', modal: 'createSub' },
    { icon: 'shield-check', title: 'Enable dual approval on large subs', sub: 'Reduce fraud risk on 3 accounts', action: 'Enable', modal: 'approvalRulesModal' },
    { icon: 'graph-up', title: 'Consolidate 5 low-activity VAs', sub: 'Save KES 12,500/month in fees', action: 'Review', modal: 'consolidateModal' },
  ];

  readonly quickActions = [
    { icon: 'plus-circle', label: 'New VA', modal: 'createVA', color: 'primary' },
    { icon: 'diagram-3', label: 'New Sub', modal: 'createSub', color: 'success' },
    { icon: 'cash-stack', label: 'Fund Account', modal: 'fundVA', color: 'accent' },
    { icon: 'arrow-left-right', label: 'Internal Transfer', modal: 'transferModal', color: 'info' },
    { icon: 'collection', label: 'Bulk Fund', modal: 'bulkFundModal', color: 'purple' },
    { icon: 'list-check', label: 'Reconcile', modal: 'reconModal', color: 'warning' },
    { icon: 'arrow-repeat', label: 'Auto Rules', modal: 'autoSweepModal', color: 'primary' },
    { icon: 'download', label: 'Export', modal: 'exportReportModal', color: 'muted' },
  ];

  readonly approvalMatrix = [
    { range: 'Up to KES 100K', approver1: 'Auto-approve', approver2: '—', approver3: '—' },
    { range: 'KES 100K – 500K', approver1: 'Department Head', approver2: '—', approver3: '—' },
    { range: 'KES 500K – 2M', approver1: 'Finance Manager', approver2: 'Director', approver3: '—' },
    { range: 'Above KES 2M', approver1: 'CFO', approver2: 'CEO', approver3: 'Board' },
  ];

  readonly notificationSettings = [
    { label: 'Low balance alerts', checked: true },
    { label: 'Transaction notifications', checked: true },
    { label: 'Limit breach alerts', checked: true },
  ];

  readonly quickReports = [
    { label: 'Daily Summary', modal: 'exportReportModal' },
    { label: 'Monthly Statement', modal: 'exportReportModal' },
    { label: 'Sub-Account Report', modal: 'exportReportModal' },
    { label: 'Audit Trail', modal: 'exportReportModal' },
  ];

  // Section headers (data-driven)
  readonly sections = [
    { id: '3.9.1', icon: 'wallet2', title: 'Virtual Account Creation & Management', desc: 'Create, view, edit and manage all virtual accounts with full details, balances, rules and status.' },
    { id: '3.9.2', icon: 'diagram-3', title: 'Sub-Account Hierarchy & Structure', desc: 'Manage hierarchical sub-accounts under each virtual account with limits, approvals and visibility controls.' },
    { id: '3.9.3', icon: 'cash-stack', title: 'Virtual Account Funding & Transfers', desc: 'Fund accounts, perform internal transfers, set up bulk funding and manage liquidity across the portfolio.' },
    { id: '3.9.4', icon: 'sliders', title: 'Virtual Account Controls & Limits', desc: 'Set spending limits, approval workflows, transaction rules and velocity controls per account and sub-account.' },
    { id: '3.9.5', icon: 'list-check', title: 'Reconciliation & Reporting', desc: 'Reconcile bank statements, match transactions, resolve discrepancies and generate comprehensive reports.' },
    { id: '3.9.6', icon: 'cpu', title: 'Virtual Account Settings & Automation', desc: 'Configure auto-sweep rules, notification preferences, access controls and integration settings.' },
  ];

  readonly fundingOptions = ['M-Pesa', 'Bank Transfer', 'PayMo Wallet', 'Bulk Upload'];

  // === COMPREHENSIVE UI CONFIG (data-driven shell) ===
  readonly uiConfig = {
    headerButtons: { health: 'Health', reconcile: 'Reconcile', newVA: 'New VA', newSub: 'New Sub-Account' },
    heroActions: ['New VA', 'New Sub', 'Bulk Fund'],
    attention: { title: 'Attention Required', viewAll: 'View all' },
    suggestions: { title: 'Smart Suggestions', aiLabel: 'AI' },
    quickActions: { title: 'Quick Actions', subtitle: 'Frequent virtual account workflows' },
    recentActivity: { title: 'Recent Virtual Account Activity', viewAll: 'View All' },
    sectionActions: {
      '3.9.1': ['New VA', 'Health Check'],
      '3.9.2': ['New Sub', 'View Hierarchy'],
      '3.9.3': ['Fund VA', 'Transfer', 'Bulk Fund'],
      '3.9.4': ['Approval Rules', 'Velocity Controls'],
      '3.9.5': ['Reconcile Now', 'Export Reports'],
      '3.9.6': ['Auto-Sweep', 'Integrations']
    },
    // Modal titles and labels (comprehensive)
    modals: {
      createVA: 'Create Virtual Account',
      createSub: 'Create Sub-Account',
      fundVA: 'Fund Virtual Account',
      transfer: 'Internal Transfer',
      bulkFund: 'Bulk Fund Virtual Accounts',
      recon: 'Reconciliation Center',
      match: 'Match Transaction',
      approvalRules: 'Approval Rules & Workflows',
      autoSweep: 'Auto-Sweep Configuration',
      hierarchy: 'Virtual Account Hierarchy',
      txnDetail: 'Transaction Details',
      exportReport: 'Export Virtual Account Report',
      vaHealth: 'Virtual Account Health Check',
      bankError: 'Bank Error Ticket',
      attention: 'All Items Requiring Attention',
      subLimit: 'Adjust Sub-Account Limit',
      velocity: 'Velocity & Transaction Controls',
      integration: 'Integrations & Webhooks',
      activity: 'Full Activity Log',
      profile: 'Profile',
      notif: 'Notifications (9)',
      healthCheck: 'Virtual Account Portfolio Health',
      consolidate: 'Consolidate Virtual Accounts',
      notifSettings: 'Notification Settings'
    },
    // Form labels and stepper
    formLabels: {
      accountName: 'Account Name',
      accountType: 'Account Type',
      currency: 'Currency',
      initialBalance: 'Initial Balance',
      dailyLimit: 'Daily Limit',
      monthlyLimit: 'Monthly Limit',
      approvalAbove: 'Approval Required Above',
      autoSweepThreshold: 'Auto-Sweep Threshold'
    },
    stepperLabels: {
      va: ['Details', 'Controls', 'Done'],
      sub: ['Details', 'Limits', 'Done'],
      bulk: ['Upload', 'Review', 'Done']
    },
    tableHeaders: {
      va: ['VA Number', 'Name', 'Type', 'Balance', 'Sub-Accounts', 'Status', 'Rules', 'Actions'],
      sub: ['Sub-Account', 'Parent VA', 'Balance', 'Limit', 'Status', 'Actions'],
      funding: ['Date', 'VA / Sub', 'Amount', 'Source', 'Status'],
      recon: ['VA / Sub', 'Book Balance', 'Bank Balance', 'Difference', 'Status', 'Action'],
      activity: ['Date', 'VA / Sub', 'Description', 'Amount', 'Status', 'Ref', 'Action']
    }
  };

  readonly mockData: VirtualAccountsMockData = {
    virtualAccounts: [
      { id: 'VA-003', name: 'Client Collections', type: 'Collections', balance: '12.4M', subAccounts: 8, status: 'active', statusLabel: 'Active', rules: 2 },
      { id: 'VA-001', name: 'Operations', type: 'Operations', balance: '8.9M', subAccounts: 12, status: 'active', statusLabel: 'Active', rules: 3 },
      { id: 'VA-007', name: 'Payroll', type: 'Payroll', balance: '22.1M', subAccounts: 5, status: 'active', statusLabel: 'Active', rules: 1 },
      { id: 'VA-009', name: 'Marketing', type: 'Project', balance: '3.2M', subAccounts: 4, status: 'active', statusLabel: 'Active', rules: 2 },
      { id: 'VA-012', name: 'Old Project Reserve', type: 'Reserve', balance: '1.2M', subAccounts: 0, status: 'active', statusLabel: 'Active', rules: 0 },
    ],
    subAccounts: [
      { id: 'SUB-0142', name: 'Project Alpha', parent: 'VA-003', balance: '2.1M', limit: '2.5M', status: 'active', statusLabel: 'Active' },
      { id: 'SUB-0143', name: 'Project Beta', parent: 'VA-003', balance: '1.8M', limit: '2.0M', status: 'active', statusLabel: 'Active' },
      { id: 'SUB-0144', name: 'Project Gamma', parent: 'VA-003', balance: '2.45M', limit: '2.0M', status: 'warning', statusLabel: 'Warning' },
      { id: 'SUB-0071', name: 'June Salaries', parent: 'VA-007', balance: '8.9M', limit: '10M', status: 'active', statusLabel: 'Active' },
      { id: 'SUB-0121', name: 'Campaign Q2', parent: 'VA-009', balance: '450K', limit: '500K', status: 'active', statusLabel: 'Active' },
    ],
    fundingHistory: [
      { ref: 'FND-4421', date: '27 Jun', account: 'VA-003', source: 'Client payment', amount: 'KES 2.45M', status: 'success', statusLabel: 'Success' },
      { ref: 'FND-4420', date: '26 Jun', account: 'VA-007', source: 'Payroll funding', amount: 'KES 8.5M', status: 'success', statusLabel: 'Success' },
      { ref: 'FND-4419', date: '25 Jun', account: 'SUB-012', source: 'Campaign top-up', amount: 'KES 450K', status: 'success', statusLabel: 'Success' },
    ],
    reconciliationBalances: [
      { account: 'VA-003', bookBalance: 'KES 12.4M', bankBalance: 'KES 12.4M', difference: '0', status: 'cleared', statusLabel: 'Cleared' },
      { account: 'VA-001', bookBalance: 'KES 8.9M', bankBalance: 'KES 8.775M', difference: 'KES 125K', status: 'bank-error', statusLabel: 'Bank error', actionModal: 'bankErrorModal', actionLabel: 'Track' },
      { account: 'VA-007', bookBalance: 'KES 22.1M', bankBalance: 'KES 22.1M', difference: '0', status: 'cleared', statusLabel: 'Cleared' },
    ],
    limitControls: [
      { name: 'VA-003 Daily', value: 'KES 5M', status: 'success' },
      { name: 'VA-007 Daily', value: 'KES 10M', status: 'success' },
      { name: 'SUB-0142 Daily', value: 'KES 500K', status: 'warning' },
    ],
    automationRules: [
      { name: 'Auto-sweep', value: 'Active', status: 'success' },
      { name: 'Low balance alert', value: 'Active', status: 'success' },
      { name: 'Dual approval', value: 'Paused', status: 'warning' },
    ],
    sweepRules: [
      { name: 'Collections → Treasury', value: 'Active', status: 'success' },
      { name: 'Operations → Reserve', value: 'Active', status: 'success' },
    ],
    hierarchy: [
      { id: 'VA-003', name: 'Client Collections', balance: '12.4M', children: [
        { id: 'SUB-0142', name: 'Project Alpha', balance: '2.1M', status: 'success', note: '' },
        { id: 'SUB-0143', name: 'Project Beta', balance: '1.8M', status: 'success', note: '' },
        { id: 'SUB-0144', name: 'Project Gamma', balance: '2.45M', status: 'warning', note: ' (over)' },
      ] },
    ],
    recentActivity: [
      { date: '27 Jun', account: 'Collections VA', description: 'Client payment received', amount: 'KES 2,450,000', status: 'success', statusLabel: 'Success', ref: 'VA-003-4421' },
      { date: '27 Jun', account: 'Payroll VA', description: 'Salary batch funded', amount: 'KES 8,500,000', status: 'success', statusLabel: 'Success', ref: 'VA-007-8821' },
      { date: '26 Jun', account: 'Operations VA', description: 'Duplicate debit detected', amount: 'KES 125,000', status: 'danger', statusLabel: 'Issue', ref: 'VA-001-2281' },
      { date: '25 Jun', account: 'Marketing Sub', description: 'Campaign top-up', amount: 'KES 450,000', status: 'success', statusLabel: 'Success', ref: 'SUB-0121-7719' },
      { date: '24 Jun', account: 'Treasury VA', description: 'Auto-sweep executed', amount: 'KES 2,000,000', status: 'success', statusLabel: 'Success', ref: 'SWP-20250624' },
    ],
  };

  readonly flows: Record<string, FlowConfig> = {
    va: { labels: ['Details', 'Controls', 'Done'], closeOnDone: true, doneMessage: 'Virtual account created successfully.' },
    sub: { labels: ['Details', 'Limits', 'Done'], closeOnDone: true, doneMessage: 'Sub-account created successfully.' },
    bulk: { labels: ['Upload', 'Review', 'Done'], closeOnDone: true, doneMessage: 'Bulk funding batch executed successfully.' },
  };
  readonly steps: Record<string, number> = { va: 1, sub: 1, bulk: 1 };
  private readonly flowModalMap: Record<string, string> = { va: 'createVA', sub: 'createSub', bulk: 'bulkFundModal' };
  private readonly defaultTabs: Record<string, string> = { recon: 'unmatched', apr: 'matrix', swp: 'rules', int: 'api' };
  readonly tabs: Record<string, string> = { ...this.defaultTabs };
  openModals = new Set<string>();
  toastMessage = '';

  openModal(id: string): void {
    this.openModals.clear();
    this.openModals.add(id);
    this.resetFlowsForModal(id);
  }

  closeModal(id: string): void {
    this.openModals.delete(id);
    this.resetFlowsForModal(id);
  }

  closeAllModals(): void { this.openModals.clear(); }
  isModalOpen(id: string): boolean { return this.openModals.has(id); }
  hasOpenModal(): boolean { return this.openModals.size > 0; }

  currentStep(flow: string): number { return this.steps[flow] ?? 1; }
  isStep(flow: string, step: number): boolean { return this.currentStep(flow) === step; }
  stepperItems(flow: string): Array<{ index: number; label: string; last: boolean }> {
    const labels = this.flows[flow]?.labels ?? [];
    return labels.map((label, i) => ({ index: i + 1, label, last: i === labels.length - 1 }));
  }

  nextFlow(flow: string, total = 3): void {
    const next = Math.min((this.steps[flow] ?? 1) + 1, total);
    this.steps[flow] = next;
    if (next >= total) {
      this.notify(this.flows[flow]?.doneMessage || 'Flow completed.');
      const modalId = this.flowModalMap[flow];
      if (modalId && this.flows[flow]?.closeOnDone) window.setTimeout(() => this.closeModal(modalId), 650);
    }
  }

  activeTab(prefix: string): string { return this.tabs[prefix] ?? this.defaultTabs[prefix] ?? ''; }
  switchTab(prefix: string, key: string, event?: Event): void {
    this.tabs[prefix] = key;
    const target = event?.currentTarget as HTMLElement | null;
    const parent = target?.parentElement;
    parent?.querySelectorAll('.pill').forEach((button) => button.classList.remove('active'));
    target?.classList.add('active');
  }

  processAction(modalId: string, message: string, ref = ''): void {
    this.notify(ref ? `${message} Reference: ${ref}` : message);
    if (modalId) this.closeModal(modalId);
  }

  moveFocus(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input?.value?.length === 1) (input.nextElementSibling as HTMLElement | null)?.focus();
  }

  statusBadgeClass(status: string): string {
    if (['active', 'success', 'cleared'].includes(status)) return 'B-s';
    if (status === 'warning' || status === 'paused') return 'B-w';
    if (status === 'danger' || status === 'bank-error') return 'B-d';
    return 'B-s';
  }

  notify(message: string): void { this.toastMessage = message || 'Action completed.'; }
  clearToast(): void { this.toastMessage = ''; }

  private resetFlowsForModal(id: string): void {
    const modalFlows: Record<string, string[]> = { createVA: ['va'], createSub: ['sub'], bulkFundModal: ['bulk'] };
    for (const flow of modalFlows[id] ?? []) this.steps[flow] = 1;
  }
}
