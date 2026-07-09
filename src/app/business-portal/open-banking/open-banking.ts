import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NgClass } from '@angular/common';

type StatusKey = 'live' | 'valid' | 'success' | 'instant' | 'matched' | 'healthy' | 'expiring' | 'expired' | 'warning' | 'danger' | 'issue' | 'unmatched' | 'paused' | 'pending';

interface FlowConfig {
  labels: string[];
  closeOnDone?: boolean;
  doneMessage: string;
}

interface BankAccount {
  id: string;
  bank: string;
  maskedAccount: string;
  nickname: string;
  balance: string;
  lastSync: string;
  status: StatusKey;
  statusLabel: string;
  consentScope: string;
  consentExpires: string;
  minimumBalance?: string;
}

interface TransferHistoryItem {
  ref: string;
  dateTime: string;
  route: string;
  amount: string;
  status: StatusKey;
  statusLabel: string;
}

interface TransactionItem {
  id: string;
  date: string;
  bank: string;
  description: string;
  amount: string;
  matchStatus: StatusKey;
  matchLabel: string;
  actionLabel: string;
  actionModal: string;
}

interface ReconciliationMatch {
  id: string;
  date: string;
  bank: string;
  description: string;
  amount: string;
  status: StatusKey;
  match: string;
  action: string;
  actionModal: string;
}

interface AccountDetailTransaction {
  id: string;
  date: string;
  description: string;
  amount: string;
}

interface ConsentRecord {
  bank: string;
  scope: string;
  expires: string;
  status: StatusKey;
  statusLabel: string;
  actionLabel: string;
  actionModal?: string;
  actionMessage: string;
}

interface BankHealthRow {
  bank: string;
  connection: string;
  connectionStatus: StatusKey;
  sync: string;
  consent: string;
  consentStatus: StatusKey;
  score: number;
}

interface BankBenchmarkRow {
  bank: string;
  settlement: string;
  fee: string;
  uptime: string;
  syncSpeed: string;
  score: number;
}

interface OptimizationAccount {
  account: string;
  averageMonthlyTransactions: number;
  annualFees: string;
  recommendation: string;
}

interface ManagedBankLink {
  bank: string;
  account: string;
  consent: string;
  consentStatus: StatusKey;
  sync: string;
  syncStatus: StatusKey;
  secondaryAction: string;
  secondaryActionMessage: string;
}

interface AlertItem {
  title: string;
  description: string;
  actionLabel: string;
  modalId: string;
  severity: StatusKey;
}

interface SuggestionItem {
  title: string;
  description: string;
  actionLabel: string;
  modalId: string;
}

interface OpenBankingMockData {
  bankAccounts: BankAccount[];
  transferHistory: TransferHistoryItem[];
  transactions: TransactionItem[];
  reconciliationMatches: ReconciliationMatch[];
  accountDetailTransactions: AccountDetailTransaction[];
  consents: ConsentRecord[];
  healthRows: BankHealthRow[];
  bankBenchmarks: BankBenchmarkRow[];
  optimizationAccounts: OptimizationAccount[];
  managedLinks: ManagedBankLink[];
  attentionItems: AlertItem[];
  suggestions: SuggestionItem[];
}

@Component({
  selector: 'app-open-banking',
  standalone: true,
  imports: [NgClass],
  templateUrl: './open-banking.html',
  styleUrl: './open-banking.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OpenBankingComponent {
  readonly mockData: OpenBankingMockData = {
    bankAccounts: [
      { id: 'equity-4521', bank: 'Equity Bank', maskedAccount: '***4521', nickname: 'Operating Account', balance: 'KES 6,842,100', lastSync: 'Just now', status: 'live', statusLabel: 'Live', consentScope: 'View + Transfer', consentExpires: '15 Aug 2025' },
      { id: 'kcb-7782', bank: 'KCB Bank', maskedAccount: '***7782', nickname: 'Payroll Account', balance: 'KES 2,104,550', lastSync: 'Just now', status: 'live', statusLabel: 'Live', consentScope: 'View + Transfer', consentExpires: '12 Sep 2025', minimumBalance: 'KES 50,000' },
      { id: 'coop-3390', bank: 'Co-op Bank', maskedAccount: '***3390', nickname: 'Collections Account', balance: 'KES 4,892,300', lastSync: '2 min ago', status: 'live', statusLabel: 'Live', consentScope: 'View only', consentExpires: '20 Jul 2025' },
      { id: 'stanbic-9912', bank: 'Stanbic Bank', maskedAccount: '***9912', nickname: 'Expense Account', balance: 'KES 1,245,870', lastSync: '15 min ago', status: 'live', statusLabel: 'Live', consentScope: 'View + Transfer', consentExpires: '10 Oct 2025' },
      { id: 'family-5543', bank: 'Family Bank', maskedAccount: '***5543', nickname: 'Reserve Account', balance: 'KES 42,100', lastSync: '3 hr ago', status: 'expired', statusLabel: 'Re-auth', consentScope: 'Expired', consentExpires: 'Expired' },
      { id: 'ncba-2201', bank: 'NCBA Bank', maskedAccount: '***2201', nickname: 'Rent Account', balance: 'KES 985,000', lastSync: '1 hr ago', status: 'live', statusLabel: 'Live', consentScope: 'View + Transfer', consentExpires: '18 Nov 2025' },
      { id: 'im-6674', bank: 'I&M Bank', maskedAccount: '***6674', nickname: 'USD Account', balance: 'USD 12,400', lastSync: '8 min ago', status: 'live', statusLabel: 'Live', consentScope: 'View only', consentExpires: '01 Dec 2025' },
    ],
    transferHistory: [
      { ref: 'PL-442189', dateTime: '27 Jun 14:32', route: 'Equity → KCB', amount: 'KES 850,000', status: 'instant', statusLabel: 'Instant' },
      { ref: 'PL-442155', dateTime: '27 Jun 11:04', route: 'Co-op → Equity', amount: 'KES 1,200,000', status: 'instant', statusLabel: 'Instant' },
      { ref: 'PL-441902', dateTime: '26 Jun 16:55', route: 'Stanbic → NCBA', amount: 'KES 320,000', status: 'instant', statusLabel: 'Instant' },
      { ref: 'PL-441712', dateTime: '25 Jun 09:20', route: 'Equity → Stanbic', amount: 'KES 92,000', status: 'instant', statusLabel: 'Instant' },
    ],
    transactions: [
      { id: 'TXN-4421', date: '27 Jun', bank: 'Equity', description: 'Client payment - ABC Ltd', amount: '+KES 1,850,000', matchStatus: 'matched', matchLabel: 'Matched', actionLabel: 'View', actionModal: 'matchDetailModal' },
      { id: 'TXN-4419', date: '27 Jun', bank: 'Co-op', description: 'Supplier payment - XYZ Traders', amount: '-KES 420,000', matchStatus: 'matched', matchLabel: 'Matched', actionLabel: 'View', actionModal: 'matchDetailModal' },
      { id: 'TXN-4412', date: '26 Jun', bank: 'Stanbic', description: 'Unknown credit', amount: '+KES 85,000', matchStatus: 'unmatched', matchLabel: 'Unmatched', actionLabel: 'Match', actionModal: 'exceptionModal' },
      { id: 'TXN-4408', date: '26 Jun', bank: 'KCB', description: 'Payroll transfer', amount: '-KES 2,400,000', matchStatus: 'matched', matchLabel: 'Matched', actionLabel: 'View', actionModal: 'matchDetailModal' },
      { id: 'TXN-4401', date: '25 Jun', bank: 'Family', description: 'Bank fee', amount: '-KES 600', matchStatus: 'unmatched', matchLabel: 'Review', actionLabel: 'Resolve', actionModal: 'exceptionModal' },
    ],
    reconciliationMatches: [
      { id: 'REC-001', date: '27 Jun', bank: 'Equity', description: 'Client payment - ABC Ltd', amount: '+KES 1,850,000', status: 'matched', match: 'Matched (INV-4421)', action: 'Confirm', actionModal: 'matchDetailModal' },
      { id: 'REC-002', date: '27 Jun', bank: 'Co-op', description: 'Supplier payment - XYZ Traders', amount: '-KES 420,000', status: 'matched', match: 'Matched (PO-9912)', action: 'Confirm', actionModal: 'matchDetailModal' },
      { id: 'REC-003', date: '26 Jun', bank: 'Stanbic', description: 'Unknown credit', amount: '+KES 85,000', status: 'unmatched', match: 'Unmatched', action: 'Match', actionModal: 'exceptionModal' },
    ],
    accountDetailTransactions: [
      { id: 'ADT-001', date: '27 Jun', description: 'Client payment - ABC Ltd', amount: '+KES 1,850,000' },
      { id: 'ADT-002', date: '26 Jun', description: 'Payroll transfer out', amount: '-KES 2,400,000' },
      { id: 'ADT-003', date: '25 Jun', description: 'Supplier payment', amount: '-KES 320,000' },
    ],
    consents: [
      { bank: 'Equity Bank', scope: 'View + Transfer', expires: '15 Aug 2025', status: 'valid', statusLabel: 'Valid', actionLabel: 'Revoke', actionMessage: 'Consent revoked successfully.' },
      { bank: 'KCB Bank', scope: 'View + Transfer', expires: '12 Sep 2025', status: 'valid', statusLabel: 'Valid', actionLabel: 'Revoke', actionMessage: 'Consent revoked successfully.' },
      { bank: 'Co-op Bank', scope: 'View only', expires: '20 Jul 2025', status: 'expiring', statusLabel: 'Expiring', actionLabel: 'Re-auth', actionModal: 'reauthModal', actionMessage: 'Re-authorisation required.' },
      { bank: 'Family Bank', scope: 'Expired', expires: 'Expired', status: 'expired', statusLabel: 'Expired', actionLabel: 'Re-auth', actionModal: 'reauthModal', actionMessage: 'Re-authorisation required.' },
    ],
    healthRows: [
      { bank: 'Equity Bank', connection: 'Healthy', connectionStatus: 'healthy', sync: 'Real-time', consent: 'Valid', consentStatus: 'valid', score: 98 },
      { bank: 'KCB Bank', connection: 'Healthy', connectionStatus: 'healthy', sync: 'Real-time', consent: 'Valid', consentStatus: 'valid', score: 97 },
      { bank: 'Co-op Bank', connection: 'Healthy', connectionStatus: 'healthy', sync: 'Real-time', consent: 'Expiring', consentStatus: 'expiring', score: 92 },
      { bank: 'Family Bank', connection: 'Issue', connectionStatus: 'issue', sync: 'Paused', consent: 'Expired', consentStatus: 'expired', score: 61 },
    ],
    bankBenchmarks: [
      { bank: 'Equity Bank', settlement: '8s', fee: 'KES 0', uptime: '99.9%', syncSpeed: 'Real-time', score: 98 },
      { bank: 'KCB Bank', settlement: '12s', fee: 'KES 0', uptime: '99.8%', syncSpeed: 'Real-time', score: 96 },
      { bank: 'Co-op Bank', settlement: '15s', fee: 'KES 0', uptime: '99.7%', syncSpeed: 'Real-time', score: 94 },
      { bank: 'Stanbic Bank', settlement: '20s', fee: 'KES 0', uptime: '99.1%', syncSpeed: '15 min', score: 88 },
      { bank: 'Family Bank', settlement: '45s', fee: 'KES 0', uptime: '96.4%', syncSpeed: 'Paused', score: 61 },
    ],
    optimizationAccounts: [
      { account: 'Family Bank ****5543', averageMonthlyTransactions: 4, annualFees: 'KES 6,000', recommendation: 'Close / Merge' },
      { account: 'Stanbic ****9912', averageMonthlyTransactions: 12, annualFees: 'KES 8,400', recommendation: 'Close / Merge' },
      { account: 'I&M ****6674', averageMonthlyTransactions: 3, annualFees: 'KES 3,800', recommendation: 'Close / Merge' },
    ],
    managedLinks: [
      { bank: 'Equity Bank', account: '****4521', consent: 'Valid', consentStatus: 'valid', sync: 'Live', syncStatus: 'live', secondaryAction: 'Pause', secondaryActionMessage: 'Bank link paused successfully.' },
      { bank: 'KCB Bank', account: '****7782', consent: 'Valid', consentStatus: 'valid', sync: 'Live', syncStatus: 'live', secondaryAction: 'Pause', secondaryActionMessage: 'Bank link paused successfully.' },
      { bank: 'Family Bank', account: '****5543', consent: 'Expired', consentStatus: 'expired', sync: 'Paused', syncStatus: 'paused', secondaryAction: 'Remove', secondaryActionMessage: 'Bank link removed successfully.' },
    ],
    attentionItems: [
      { title: 'KCB account balance below minimum', description: 'KES 42,100 · minimum KES 50,000', actionLabel: 'Top-up', modalId: 'transferModal', severity: 'warning' },
      { title: '14 unreconciled transactions', description: 'Equity & Stanbic accounts', actionLabel: 'Review', modalId: 'reconcileModal', severity: 'warning' },
      { title: 'Co-op account link expires in 7 days', description: 'Re-authenticate consent', actionLabel: 'Re-auth', modalId: 'reauthModal', severity: 'expiring' },
    ],
    suggestions: [
      { title: 'Consolidate 3 low-activity accounts', description: 'Potential fee savings: KES 18,200/year', actionLabel: 'Analyse', modalId: 'optimizeModal' },
      { title: 'Schedule recurring transfers to payroll account', description: 'Reduce manual effort by 92%', actionLabel: 'Schedule', modalId: 'scheduleTransferModal' },
      { title: 'Enable real-time fraud alerts on I&M', description: 'High-value transfers detected', actionLabel: 'Enable', modalId: 'fraudSettingsModal' },
    ],
  };

  readonly flows: Record<string, FlowConfig> = {
    connect: { labels: ['Bank', 'Details', 'Consent', 'Done'], closeOnDone: true, doneMessage: 'Bank connected successfully.' },
    transfer: { labels: ['Details', 'Authorise', 'Done'], closeOnDone: true, doneMessage: 'Transfer completed successfully.' },
    recon: { labels: ['Select', 'Match', 'Done'], closeOnDone: true, doneMessage: 'Reconciliation completed successfully.' },
  };

  readonly steps: Record<string, number> = { connect: 1, transfer: 1, recon: 1 };
  private readonly flowModalMap: Record<string, string> = { connect: 'connectBankModal', transfer: 'transferModal', recon: 'reconcileModal' };
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
  setStep(flow: string, step: number): void { this.steps[flow] = step; }

  stepperItems(flow: string): Array<{ index: number; label: string; last: boolean }> {
    const labels = this.flows[flow]?.labels ?? [];
    return labels.map((label, i) => ({ index: i + 1, label, last: i === labels.length - 1 }));
  }

  nextFlow(flow: string, total = this.flows[flow]?.labels.length ?? 1): void {
    const next = Math.min((this.steps[flow] ?? 1) + 1, total);
    this.steps[flow] = next;
    if (next >= total) {
      this.notify(this.flows[flow]?.doneMessage || 'Flow completed.');
      const modalId = this.flowModalMap[flow];
      if (modalId && this.flows[flow]?.closeOnDone) window.setTimeout(() => this.closeModal(modalId), 650);
    }
  }

  handleConsentAction(consent: ConsentRecord): void {
    if (consent.actionModal) {
      this.openModal(consent.actionModal);
      return;
    }
    this.processAction('consentModal', consent.actionMessage, '');
  }

  processAction(modalId: string, message: string, ref = ''): void {
    this.notify(ref ? `${message} Reference: ${ref}` : message);
    if (modalId) this.closeModal(modalId);
  }

  selectBox(event: Event): void {
    const box = event.currentTarget as HTMLElement | null;
    const row = box?.closest('.row');
    row?.querySelectorAll<HTMLElement>('.border').forEach((item) => {
      item.style.borderColor = '';
      item.style.background = '';
    });
    if (box) {
      box.style.borderColor = 'var(--pm-primary)';
      box.style.background = 'rgba(79,70,229,.04)';
    }
  }

  moveFocus(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input?.value?.length === 1) (input.nextElementSibling as HTMLElement | null)?.focus();
  }

  badgeClass(status: string): string {
    if (['live', 'valid', 'success', 'instant', 'matched', 'healthy'].includes(status)) return 'B-s';
    if (['expiring', 'warning', 'unmatched', 'pending'].includes(status)) return 'B-w';
    if (['expired', 'danger', 'issue', 'paused'].includes(status)) return 'B-d';
    return 'B-s';
  }

  notify(message: string): void { this.toastMessage = message || 'Action completed.'; }
  clearToast(): void { this.toastMessage = ''; }

  private resetFlowsForModal(id: string): void {
    const modalFlows: Record<string, string[]> = {
      connectBankModal: ['connect'],
      transferModal: ['transfer'],
      reconcileModal: ['recon'],
    };
    for (const flow of modalFlows[id] ?? []) this.steps[flow] = 1;
  }
}
