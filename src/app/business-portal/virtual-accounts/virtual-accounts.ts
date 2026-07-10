import { Component, ViewEncapsulation } from '@angular/core';
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
    encapsulation: ViewEncapsulation.None })
export class VirtualAccountsComponent {
  readonly pageTitle = 'PAGE 3.9 — Virtual Accounts & Sub-Accounts';
  readonly pageSubtitle = 'Create virtual accounts and sub-ledgers, automate funding and sweeps, reconcile bank vs book balances, and control multi-entity cash hierarchy.';
  readonly breadcrumbStrong = 'Virtual Accounts';
  readonly breadcrumbs: string[] = ['Home', 'Business Portal'];
  readonly headerActions: Array<{label:string;icon:string;modalId:string;primary?:boolean}> = [
    { label: 'Health Check', icon: 'bi bi-heart-pulse', modalId: 'vaHealthModal', primary: false },
    { label: 'Reconcile', icon: 'bi bi-list-check', modalId: 'reconModal', primary: false },
    { label: 'Fund VA', icon: 'bi bi-plus-circle', modalId: 'fundVA', primary: false },
    { label: 'Create VA', icon: 'bi bi-plus-lg', modalId: 'createVA', primary: true },
  ];
  readonly hero = {
    liveLabel: 'Virtual account platform live',
    primaryValue: 'KES 124.8M under management',
    primaryNote: 'Main VAs and nested sub-accounts with automated sweeps, limits, and reconciliation controls.',
    primaryActions: [
      { label: 'Create VA', modalId: 'createVA' },
      { label: 'Fund', modalId: 'fundVA' },
      { label: 'Sweep', modalId: 'autoSweepModal' },
    ],
    stats: [
      { label: 'TOTAL VA BALANCE', value: 'KES 124.8M', badge: 'Healthy', badgeClass: 'B B-s', icon: 'bi bi-wallet2', note: 'Main VAs: KES 89.4M · Sub-accounts: KES 35.4M', color: 'var(--pm-accent)', border: false },
      { label: 'THIS MONTH ACTIVITY', value: 'KES 312.6M', badge: '4,812 txns', badgeClass: 'B B-i', icon: 'bi bi-arrow-left-right', note: 'Collections: KES 198.2M · Disbursements: KES 114.4M', color: 'var(--pm-info)', border: false },
      { label: 'RECONCILIATION STATUS', value: '4 issues', badge: 'Review needed', badgeClass: 'B B-w', icon: 'bi bi-exclamation-triangle', note: '2 unmatched · 1 timing · 1 bank error', color: 'var(--pm-warning)', border: true },
    ] };
  readonly attentionItems: Array<{icon:string;bg:string;color:string;title:string;subtitle:string;button:string;modalId:string}> = [
    { icon: 'bi bi-exclamation-triangle', bg: 'var(--pm-danger-soft)', color: 'var(--pm-danger)', title: 'Unmatched credit KES 1.2M', subtitle: 'VA-003 · 26 Jun', button: 'Resolve', modalId: 'reconModal' },
    { icon: 'bi bi-clock', bg: 'var(--pm-warning-soft)', color: 'var(--pm-warning)', title: 'Sub-account limit breach', subtitle: 'Payroll Sub · KES 450K over', button: 'Adjust', modalId: 'subLimitModal' },
    { icon: 'bi bi-arrow-left-right', bg: 'var(--pm-info-soft)', color: 'var(--pm-info)', title: 'Auto-sweep rule paused', subtitle: 'Collections VA · 3 days', button: 'Resume', modalId: 'autoSweepModal' },
  ];
  readonly suggestionItems: Array<{icon:string;bg:string;color:string;title:string;subtitle:string;button:string;modalId:string}> = [
    { icon: 'bi bi-diagram-3', bg: 'var(--pm-accent-soft)', color: 'var(--pm-accent)', title: 'Consolidate idle sub-accounts', subtitle: 'Free KES 2.1M working capital', button: 'Consolidate', modalId: 'consolidateModal' },
    { icon: 'bi bi-shield-lock', bg: 'var(--pm-purple-soft)', color: 'var(--pm-purple)', title: 'Tighten approval matrix', subtitle: '3 high-value VAs without dual control', button: 'Configure', modalId: 'approvalRulesModal' },
    { icon: 'bi bi-speedometer2', bg: 'var(--pm-warning-soft)', color: 'var(--pm-warning)', title: 'Velocity spike on VA-007', subtitle: '+240% vs 7-day average', button: 'Review', modalId: 'velocityModal' },
  ];
  readonly quickActions: Array<{icon:string;label:string;modalId:string;style?:string}> = [
    { icon: 'bi bi-plus-lg text-primary me-1', label: 'Create VA', modalId: 'createVA' },
    { icon: 'bi bi-diagram-2 text-success me-1', label: 'Create Sub', modalId: 'createSub' },
    { icon: 'bi bi-plus-circle text-info me-1', label: 'Fund VA', modalId: 'fundVA' },
    { icon: 'bi bi-arrow-left-right me-1', label: 'Transfer', modalId: 'transferModal' },
    { icon: 'bi bi-list-check text-warning me-1', label: 'Reconcile', modalId: 'reconModal' },
    { icon: 'bi bi-arrow-repeat me-1', label: 'Auto Sweep', modalId: 'autoSweepModal' },
    { icon: 'bi bi-download me-1', label: 'Export', modalId: 'exportReportModal' },
    { icon: 'bi bi-collection me-1', label: 'Bulk Fund', modalId: 'bulkFundModal' },
  ];
  loadingModal: string | null = null;

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
    ] };

  readonly flows: Record<string, FlowConfig> = {
    va: { labels: ['Details', 'Controls', 'Done'], closeOnDone: true, doneMessage: 'Virtual account created successfully.' },
    sub: { labels: ['Details', 'Limits', 'Done'], closeOnDone: true, doneMessage: 'Sub-account created successfully.' },
    bulk: { labels: ['Upload', 'Review', 'Done'], closeOnDone: true, doneMessage: 'Bulk funding batch executed successfully.' } };
  readonly steps: Record<string, number> = { va: 1, sub: 1, bulk: 1 };
  private readonly flowModalMap: Record<string, string> = { va: 'createVA', sub: 'createSub', bulk: 'bulkFundModal' };
  private readonly defaultTabs: Record<string, string> = { recon: 'unmatched', apr: 'matrix', swp: 'rules', int: 'api' };
  readonly tabs: Record<string, string> = { ...this.defaultTabs };
  openModals = new Set<string>();
  toastMessage = '';

  openModal(id: string): void {
    this.openModals = new Set([id]);
    this.loadingModal = null;
    this.resetFlowsForModal(id);
  }

  closeModal(id: string): void {
    const next = new Set(this.openModals);
    next.delete(id);
    this.openModals = next;
    this.loadingModal = null;
    this.resetFlowsForModal(id);
  }

  closeAllModals(): void { this.openModals = new Set(); this.loadingModal = null; }
  isModalOpen(id: string): boolean { return this.openModals.has(id); }
  hasOpenModal(): boolean { return this.openModals.size > 0; }

  currentStep(flow: string): number { return this.steps[flow] ?? 1; }
  isStep(flow: string, step: number): boolean { return this.currentStep(flow) === step; }
  stepperItems(flow: string): Array<{ index: number; label: string; last: boolean }> {
    const labels = this.flows[flow]?.labels ?? [];
    return labels.map((label, i) => ({ index: i + 1, label, last: i === labels.length - 1 }));
  }

  nextFlow(flow: string, total = this.flows[flow]?.labels.length ?? 1): void {
    const next = Math.min((this.steps[flow] ?? 1) + 1, total);
    this.steps[flow] = next;
    if (next >= total) {
      const modalMap: Record<string, string> = { va: 'createVA', sub: 'createSub', bulk: 'bulkFundModal' };
      const modal = modalMap[flow];
      this.loadingModal = modal || null;
      window.setTimeout(() => {
        this.loadingModal = null;
        this.notify(this.flows[flow]?.doneMessage || 'Flow completed.');
        if (modal) window.setTimeout(() => this.closeModal(modal), 650);
      }, 500);
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

  notify(message: string): void { this.toastMessage = message || 'Action completed.'; window.setTimeout(() => this.clearToast(), 3200); }
  clearToast(): void { this.toastMessage = ''; }

  private resetFlowsForModal(id: string): void {
    const modalFlows: Record<string, string[]> = { createVA: ['va'], createSub: ['sub'], bulkFundModal: ['bulk'] };
    for (const flow of modalFlows[id] ?? []) this.steps[flow] = 1;
  }
}