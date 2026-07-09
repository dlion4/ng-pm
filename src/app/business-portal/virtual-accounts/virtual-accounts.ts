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
  readonly openModals = new Set<string>();
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
