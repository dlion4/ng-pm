import { Component, ViewEncapsulation } from '@angular/core';
import { NgClass } from '@angular/common';

type StatusKey =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'matched'
  | 'healthy'
  | 'expired'
  | 'active'
  | 'pending';
interface FlowConfig {
  labels: string[];
  closeOnDone?: boolean;
  doneMessage: string;
}
interface CurrencyAccount {
  currency: string;
  accountName: string;
  balance: string;
  kesEquivalent: string;
  change: string;
  changeStatus: StatusKey;
  limit: string;
  utilization: number;
}
interface FxTransfer {
  ref: string;
  date: string;
  route: string;
  amount: string;
  convertedAmount: string;
  rate: string;
  fee: string;
  status: StatusKey;
  statusLabel: string;
}
interface FxContract {
  id: string;
  type: string;
  pair: string;
  amount: string;
  rate: string;
  expiry: string;
  status: StatusKey;
  statusLabel: string;
  actionLabel: string;
  actionModal: string;
}
interface ActiveContract {
  id: string;
  pair: string;
  amount: string;
  rate: string;
  expiry: string;
  mtm: string;
  mtmStatus: StatusKey;
}
interface NostroRow {
  account: string;
  bankBalance: string;
  ledgerBalance: string;
  difference: string;
  status: StatusKey;
  statusLabel: string;
}
interface ForwardReconRow {
  contract: string;
  bankMtm: string;
  ledgerMtm: string;
  difference: string;
  status: StatusKey;
  statusLabel: string;
}
interface FxHealthRow {
  area: string;
  status: StatusKey;
  statusLabel: string;
  issue: string;
  actionLabel?: string;
  actionModal?: string;
}
interface CurrencySetting {
  currency: string;
  accountNumber: string;
  bank: string;
  balance: string;
  limit: string;
}
interface TreasuryMockData {
  currencyAccounts: CurrencyAccount[];
  fxTransfers: FxTransfer[];
  fxContracts: FxContract[];
  activeContracts: ActiveContract[];
  nostroReconciliation: NostroRow[];
  forwardReconciliation: ForwardReconRow[];
  fxHealthRows: FxHealthRow[];
  currencyAccountSettings: CurrencySetting[];
}

@Component({
  selector: 'app-multi-currency',
  standalone: true,
  imports: [NgClass],
  templateUrl: './multi-currency.html',
  styleUrl: './multi-currency.css',
    encapsulation: ViewEncapsulation.None })
export class MultiCurrencyComponent {
  readonly pageTitle = 'PAGE 3.11 — Multi-Currency Treasury & Forex Operations';
  readonly pageSubtitle = 'Manage multi-currency accounts, execute live FX trades, set hedging contracts, monitor exposure, ensure regulatory compliance and reconcile treasury positions.';
  readonly breadcrumbStrong = 'Multi-Currency Treasury';
  readonly breadcrumbs: string[] = ['Home', 'Business Portal'];
  readonly headerActions: Array<{label:string;icon:string;modalId:string;primary?:boolean}> = [
    { label: 'Health Check', icon: 'bi bi-heart-pulse', modalId: 'fxHealthModal', primary: false },
    { label: 'Alerts', icon: 'bi bi-bell', modalId: 'fxNotifModal', primary: false },
    { label: 'Transfer', icon: 'bi bi-arrow-left-right', modalId: 'transferModal', primary: false },
    { label: 'Trade FX', icon: 'bi bi-currency-exchange', modalId: 'tradeModal', primary: true },
  ];
  readonly hero = {
    liveLabel: 'Treasury platform live',
    primaryValue: 'KES 124.8M equivalent',
    primaryNote: 'Across 7 currencies (KES, USD, EUR, GBP, UGX, TZS, AED). Hedged exposure: 68%. Pending trades: 4.',
    primaryActions: [
      { label: 'Trade', modalId: 'tradeModal' },
      { label: 'Hedge', modalId: 'hedgeModal' },
      { label: 'Transfer', modalId: 'transferModal' },
    ],
    stats: [
      { label: 'NET FX EXPOSURE', value: 'USD 318K', badge: '68% hedged', badgeClass: 'B B-s', icon: 'bi bi-shield-check', note: 'Unhedged: USD 102K · Next hedge expiry: 14 Jul', color: 'var(--pm-accent)', border: false },
      { label: 'TODAY\'S FX P&L', value: '+KES 184,200', badge: '+1.8% vs yesterday', badgeClass: 'B B-s', icon: 'bi bi-graph-up-arrow', note: 'Spot gain: KES 142K · Forward gain: KES 42K', color: 'var(--pm-info)', border: false },
      { label: 'COMPLIANCE STATUS', value: '99.4%', badge: '1 STR pending', badgeClass: 'B B-w', icon: 'bi bi-exclamation-triangle', note: 'CBK filing: Complete · Next report: 30 Jun', color: 'var(--pm-warning)', border: true },
    ] };
  readonly attentionItems: Array<{icon:string;bg:string;color:string;title:string;subtitle:string;button:string;modalId:string}> = [
    { icon: 'bi bi-exclamation-triangle', bg: 'var(--pm-danger-soft)', color: 'var(--pm-danger)', title: 'USD 45K forward expires today', subtitle: 'Contract FX-8821 · action required', button: 'Roll', modalId: 'fxContractModal' },
    { icon: 'bi bi-file-earmark-text', bg: 'var(--pm-warning-soft)', color: 'var(--pm-warning)', title: 'STR report due for large USD inflow', subtitle: 'KES 12.4M from US client', button: 'File', modalId: 'complianceModal' },
    { icon: 'bi bi-arrow-left-right', bg: 'var(--pm-info-soft)', color: 'var(--pm-info)', title: 'EUR 28K settlement mismatch', subtitle: 'Bank vs internal ledger', button: 'Reconcile', modalId: 'reconcileModal' },
  ];
  readonly suggestionItems: Array<{icon:string;bg:string;color:string;title:string;subtitle:string;button:string;modalId:string}> = [
    { icon: 'bi bi-graph-up-arrow', bg: 'var(--pm-accent-soft)', color: 'var(--pm-accent)', title: 'Lock GBP rate now (1.32 vs forecast 1.29)', subtitle: 'Save ~KES 380K on July payroll', button: 'Trade', modalId: 'tradeModal' },
    { icon: 'bi bi-shield-check', bg: 'var(--pm-purple-soft)', color: 'var(--pm-purple)', title: 'Increase hedge ratio on USD exposure', subtitle: 'Current 68% → recommended 85%', button: 'Hedge', modalId: 'hedgeModal' },
    { icon: 'bi bi-currency-exchange', bg: 'var(--pm-warning-soft)', color: 'var(--pm-warning)', title: 'Convert TZS 18M to USD before 2% devaluation', subtitle: 'CBK policy meeting scheduled', button: 'Convert', modalId: 'tradeModal' },
  ];
  readonly quickActions: Array<{icon:string;label:string;modalId:string;style?:string}> = [
    { icon: 'bi bi-currency-exchange text-primary me-1', label: 'Spot Trade', modalId: 'tradeModal' },
    { icon: 'bi bi-shield-check text-success me-1', label: 'Forward Hedge', modalId: 'hedgeModal' },
    { icon: 'bi bi-arrow-left-right text-info me-1', label: 'Cross-Currency', modalId: 'transferModal' },
    { icon: 'bi bi-file-earmark-text me-1', label: 'Manage Contracts', modalId: 'fxContractModal', style: 'color:var(--pm-purple)' },
    { icon: 'bi bi-list-check text-warning me-1', label: 'Reconcile', modalId: 'reconcileModal' },
    { icon: 'bi bi-file-earmark-check text-danger me-1', label: 'Compliance', modalId: 'complianceModal' },
    { icon: 'bi bi-bell me-1', label: 'Rate Alerts', modalId: 'rateAlertModal', style: 'color:var(--pm-accent)' },
    { icon: 'bi bi-download me-1', label: 'Reports', modalId: 'reportExportModal', style: 'color:var(--pm-primary)' },
  ];
  loadingModal: string | null = null;

  readonly mockData: TreasuryMockData = {
    currencyAccounts: [
      {
        currency: 'KES',
        accountName: 'Local operating treasury',
        balance: '48,240,000',
        kesEquivalent: '48.24M',
        change: '+2.1%',
        changeStatus: 'success',
        limit: '100M',
        utilization: 48 },
      {
        currency: 'USD',
        accountName: 'USD Nostro',
        balance: '318,450',
        kesEquivalent: '41.22M',
        change: '+0.8%',
        changeStatus: 'success',
        limit: '500K',
        utilization: 64 },
      {
        currency: 'EUR',
        accountName: 'EUR Collections',
        balance: '92,100',
        kesEquivalent: '12.84M',
        change: '-0.4%',
        changeStatus: 'warning',
        limit: '200K',
        utilization: 46 },
      {
        currency: 'GBP',
        accountName: 'GBP Vendor Pool',
        balance: '44,800',
        kesEquivalent: '7.35M',
        change: '+1.2%',
        changeStatus: 'success',
        limit: '100K',
        utilization: 45 },
      {
        currency: 'TZS',
        accountName: 'Tanzania operations',
        balance: '48,000,000',
        kesEquivalent: '2.55M',
        change: '+0.1%',
        changeStatus: 'success',
        limit: '80M',
        utilization: 60 },
      {
        currency: 'UGX',
        accountName: 'Uganda operations',
        balance: '92,000,000',
        kesEquivalent: '3.18M',
        change: '-0.2%',
        changeStatus: 'warning',
        limit: '120M',
        utilization: 77 },
      {
        currency: 'ZAR',
        accountName: 'Southern Africa',
        balance: '126,000',
        kesEquivalent: '0.91M',
        change: '+0.6%',
        changeStatus: 'success',
        limit: '250K',
        utilization: 50 },
    ],
    fxTransfers: [
      {
        ref: 'FXT-4421',
        date: '27 Jun',
        route: 'USD → KES',
        amount: 'USD 50,000',
        convertedAmount: 'KES 6,471,000',
        rate: '129.42',
        fee: 'KES 12,942',
        status: 'success',
        statusLabel: 'Completed' },
      {
        ref: 'FXT-4417',
        date: '26 Jun',
        route: 'EUR → KES',
        amount: 'EUR 12,000',
        convertedAmount: 'KES 1,672,800',
        rate: '139.40',
        fee: 'KES 3,346',
        status: 'success',
        statusLabel: 'Completed' },
      {
        ref: 'FXT-4412',
        date: '25 Jun',
        route: 'KES → USD',
        amount: 'KES 3,000,000',
        convertedAmount: 'USD 23,060',
        rate: '130.10',
        fee: 'KES 6,000',
        status: 'pending',
        statusLabel: 'Processing' },
      {
        ref: 'FXT-4409',
        date: '24 Jun',
        route: 'GBP → KES',
        amount: 'GBP 8,000',
        convertedAmount: 'KES 1,312,000',
        rate: '164.00',
        fee: 'KES 2,624',
        status: 'success',
        statusLabel: 'Completed' },
    ],
    fxContracts: [
      {
        id: 'FX-8821',
        type: 'Forward',
        pair: 'USD/KES',
        amount: 'USD 120,000',
        rate: '130.50',
        expiry: '27 Jun 2025',
        status: 'warning',
        statusLabel: 'Expires today',
        actionLabel: 'Roll',
        actionModal: 'rollContractModal' },
      {
        id: 'FX-8814',
        type: 'Forward',
        pair: 'EUR/KES',
        amount: 'EUR 50,000',
        rate: '141.20',
        expiry: '15 Jul 2025',
        status: 'active',
        statusLabel: 'Active',
        actionLabel: 'View',
        actionModal: 'fxContractModal' },
      {
        id: 'FX-8799',
        type: 'Option',
        pair: 'USD/KES',
        amount: 'USD 75,000',
        rate: '128.90',
        expiry: '30 Jul 2025',
        status: 'active',
        statusLabel: 'Active',
        actionLabel: 'View',
        actionModal: 'fxContractModal' },
      {
        id: 'FX-8740',
        type: 'Forward',
        pair: 'GBP/KES',
        amount: 'GBP 30,000',
        rate: '165.10',
        expiry: '10 Jun 2025',
        status: 'expired',
        statusLabel: 'Expired',
        actionLabel: 'Archive',
        actionModal: 'fxContractModal' },
    ],
    activeContracts: [
      {
        id: 'FX-8821',
        pair: 'USD/KES',
        amount: 'USD 120,000',
        rate: '130.50',
        expiry: '27 Jun',
        mtm: '+KES 84K',
        mtmStatus: 'success' },
      {
        id: 'FX-8814',
        pair: 'EUR/KES',
        amount: 'EUR 50,000',
        rate: '141.20',
        expiry: '15 Jul',
        mtm: '+KES 22K',
        mtmStatus: 'success' },
      {
        id: 'FX-8799',
        pair: 'USD/KES',
        amount: 'USD 75,000',
        rate: '128.90',
        expiry: '30 Jul',
        mtm: '-KES 18K',
        mtmStatus: 'warning' },
    ],
    nostroReconciliation: [
      {
        account: 'USD Nostro',
        bankBalance: '318,450',
        ledgerBalance: '318,450',
        difference: '0',
        status: 'matched',
        statusLabel: 'Matched' },
      {
        account: 'EUR Nostro',
        bankBalance: '92,100',
        ledgerBalance: '92,100',
        difference: '0',
        status: 'matched',
        statusLabel: 'Matched' },
      {
        account: 'GBP Nostro',
        bankBalance: '44,800',
        ledgerBalance: '44,720',
        difference: '80',
        status: 'warning',
        statusLabel: 'Exception' },
    ],
    forwardReconciliation: [
      {
        contract: 'FX-8821',
        bankMtm: '+KES 84K',
        ledgerMtm: '+KES 84K',
        difference: '0',
        status: 'matched',
        statusLabel: 'Matched' },
      {
        contract: 'FX-8799',
        bankMtm: '-KES 18K',
        ledgerMtm: '-KES 20K',
        difference: 'KES 2K',
        status: 'warning',
        statusLabel: 'Review' },
    ],
    fxHealthRows: [
      { area: 'USD Exposure', status: 'healthy', statusLabel: 'Healthy', issue: '68% hedged' },
      {
        area: 'Forward Expiry',
        status: 'warning',
        statusLabel: 'Attention',
        issue: 'FX-8821 expires today',
        actionLabel: 'Roll',
        actionModal: 'rollContractModal' },
      {
        area: 'Nostro Reconciliation',
        status: 'warning',
        statusLabel: 'Review',
        issue: 'GBP difference 80',
        actionLabel: 'Resolve',
        actionModal: 'reconcileModal' },
      {
        area: 'Compliance Reporting',
        status: 'healthy',
        statusLabel: 'Healthy',
        issue: 'CBK FX1 ready' },
    ],
    currencyAccountSettings: [
      {
        currency: 'USD',
        accountNumber: 'ACCT-USD-8821',
        bank: 'Standard Chartered',
        balance: '318,450',
        limit: '500,000' },
      {
        currency: 'EUR',
        accountNumber: 'ACCT-EUR-7712',
        bank: 'Absa Bank',
        balance: '92,100',
        limit: '200,000' },
      {
        currency: 'GBP',
        accountNumber: 'ACCT-GBP-4471',
        bank: 'I&M Bank',
        balance: '44,800',
        limit: '100,000' },
      {
        currency: 'KES',
        accountNumber: 'ACCT-KES-1001',
        bank: 'Equity Bank',
        balance: '48,240,000',
        limit: '100,000,000' },
    ] };
  readonly flows: Record<string, FlowConfig> = {
    trade: {
      labels: ['Pair', 'Amount', 'Review', 'Done'],
      closeOnDone: true,
      doneMessage: 'FX trade booked successfully.' },
    xfer: {
      labels: ['Details', 'Rate', 'Approve', 'Done'],
      closeOnDone: true,
      doneMessage: 'Cross-currency transfer submitted successfully.' } };
  readonly steps: Record<string, number> = { trade: 1, xfer: 1 };
  readonly tabs: Record<string, string> = { fxc: 'active', rec: 'nostro', cmp: 'cbk' };
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
  isModalOpen(id: string): boolean {
    return this.openModals.has(id);
  }
  hasOpenModal(): boolean {
    return this.openModals.size > 0;
  }
  currentStep(flow: string): number {
    return this.steps[flow] ?? 1;
  }
  isStep(flow: string, step: number): boolean {
    return this.currentStep(flow) === step;
  }
  stepperItems(flow: string): Array<{ index: number; label: string; last: boolean }> {
    const labels = this.flows[flow]?.labels ?? [];
    return labels.map((label, i) => ({ index: i + 1, label, last: i === labels.length - 1 }));
  }
  nextFlow(flow: string, total = this.flows[flow]?.labels.length ?? 1): void {
    const next = Math.min((this.steps[flow] ?? 1) + 1, total);
    this.steps[flow] = next;
    if (next >= total) {
      const modalMap: Record<string, string> = { trade: 'tradeModal', xfer: 'transferModal' };
      const modal = modalMap[flow];
      this.loadingModal = modal || null;
      window.setTimeout(() => {
        this.loadingModal = null;
        this.notify(this.flows[flow]?.doneMessage || 'Flow completed.');
        if (modal) window.setTimeout(() => this.closeModal(modal), 650);
      }, 500);
    }
  }
  activeTab(prefix: string): string {
    return this.tabs[prefix] ?? '';
  }
  switchTab(prefix: string, key: string, event?: Event): void {
    this.tabs[prefix] = key;
    this.activatePill(event);
  }
  activatePill(event?: Event): void {
    const target = event?.currentTarget as HTMLElement | null;
    const parent = target?.parentElement;
    parent?.querySelectorAll('.pill').forEach((p) => p.classList.remove('active'));
    target?.classList.add('active');
  }
  processAction(modalId: string, message: string, ref = ''): void {
    this.notify(ref ? `${message} Reference: ${ref}` : message);
    if (modalId) this.closeModal(modalId);
  }
  badgeClass(status: string): string {
    if (['success', 'matched', 'healthy', 'active'].includes(status)) return 'B-s';
    if (['warning', 'pending', 'info'].includes(status)) return 'B-w';
    if (['danger', 'expired'].includes(status)) return 'B-d';
    return 'B-s';
  }
  moveFocus(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input?.value?.length === 1) (input.nextElementSibling as HTMLElement | null)?.focus();
  }
  notify(message: string): void { this.toastMessage = message || 'Action completed.'; window.setTimeout(() => this.clearToast(), 3200); }
  clearToast(): void {
    this.toastMessage = '';
  }
  private resetFlowsForModal(id: string): void {
    const map: Record<string, string[]> = { tradeModal: ['trade'], transferModal: ['xfer'] };
    for (const flow of map[id] ?? []) this.steps[flow] = 1;
  }
}