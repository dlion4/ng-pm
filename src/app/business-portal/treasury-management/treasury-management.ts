import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AccountRow {
  bank: string;
  accountNo: string;
  currency: string;
  balance: string;
  lastSync: string;
}

interface SweepLog {
  date: string;
  rule: string;
  amount: string;
  status: string;
}

interface FxRate {
  pair: string;
  bid: string;
  ask: string;
  spread: string;
  trendColor: string;
  trendIcon: string;
  trendPct: string;
}

interface ApprovalItem {
  request: string;
  amount: string;
  initiator: string;
  approveMsg: string;
  ref: string;
}

interface BankStatement {
  date: string;
  description: string;
  ref: string;
  inflow: string;
  outflow: string;
  balance: string;
}

interface YieldRow {
  month: string;
  principal: string;
  interest: string;
  yield: string;
}

interface SavedModal {
  message: string;
  ref: string;
}

@Component({
  selector: 'app-treasury-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './treasury-management.html',
  styleUrls: ['./treasury-management.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TreasuryManagementComponent {
  activeModal: string | null = null;
  toastMessage = '';
  modalTableHeaders: string[] = ['Item', 'Detail', 'Amount', 'Status'];

  loadingModal: string | null = null;

  stepState: Record<string, number> = {
    addBank: 1,
    transfer: 1,
    fx: 1,
    crossBorder: 1,
    invest: 1,
  };

  activeTabs: Record<string, string> = {
    fxTab: 'spot',
    forecastTab: '30d',
  };

  savedModals: Record<string, SavedModal> = {};

  stepperLabels: Record<string, string[]> = {
    addBank: ['Select Type', 'Authorize', 'Done'],
    transfer: ['Details', 'Authorize', 'Done'],
    fx: ['Get Quote', 'Review', 'Done'],
    crossBorder: ['Details', 'Review', 'Done'],
    invest: ['Configure', 'Review', 'Done'],
  };

  flowButtonDefaults: Record<string, string> = {
    addBank: 'Continue',
    transfer: 'Review Transfer',
    fx: 'Get Quote',
    crossBorder: 'Review Transfer',
    invest: 'Review',
  };

  // Mock data
  accounts: AccountRow[] = [
    { bank: 'Equity Bank Main', accountNo: '018***4521', currency: 'KES', balance: '14,250,000', lastSync: 'Just now' },
    { bank: 'KCB Payroll', accountNo: '110***8832', currency: 'KES', balance: '3,800,000', lastSync: '10m ago' },
    { bank: 'StanChart USD', accountNo: '870***9911', currency: 'USD', balance: '$45,200', lastSync: '1h ago' },
    { bank: 'Safaricom Till', accountNo: 'Till 88291', currency: 'KES', balance: '1,450,200', lastSync: 'Live' },
    { bank: 'PayMo Wallet', accountNo: 'PM-00192', currency: 'KES', balance: '4,200,000', lastSync: 'Live' },
  ];

  sweepLogs: SweepLog[] = [
    { date: '27 Jun, 23:00', rule: 'Till to Equity (EOD)', amount: 'KES 840,500', status: 'Success' },
    { date: '26 Jun, 23:00', rule: 'Till to Equity (EOD)', amount: 'KES 790,200', status: 'Success' },
    { date: '25 Jun, 09:00', rule: 'Equity to KCB (Target)', amount: 'KES 4,000,000', status: 'Success' },
    { date: '24 Jun, 23:00', rule: 'Till to Equity (EOD)', amount: 'KES 920,000', status: 'Success' },
  ];

  fxRates: FxRate[] = [
    { pair: 'USD/KES', bid: '129.10', ask: '129.40', spread: '0.30', trendColor: 'color:var(--pm-accent)', trendIcon: 'bi bi-arrow-down', trendPct: '-0.12%' },
    { pair: 'EUR/KES', bid: '140.20', ask: '140.85', spread: '0.65', trendColor: 'color:var(--pm-danger)', trendIcon: 'bi bi-arrow-up', trendPct: '+0.32%' },
    { pair: 'GBP/KES', bid: '165.40', ask: '166.10', spread: '0.70', trendColor: 'color:var(--pm-accent)', trendIcon: 'bi bi-arrow-down', trendPct: '-0.05%' },
    { pair: 'UGX/KES', bid: '0.034', ask: '0.035', spread: '0.001', trendColor: 'color:var(--pm-muted)', trendIcon: 'bi bi-dash', trendPct: '0.00%' },
  ];

  approvalItems: ApprovalItem[] = [
    { request: 'Internal Sweep (Till -> Bank)', amount: 'KES 1,450,200', initiator: 'System (Auto)', approveMsg: 'Sweep approved.', ref: 'APP-1' },
    { request: 'Cross-Border SWIFT (Guangzhou)', amount: '$ 18,200', initiator: 'Esther A.', approveMsg: 'SWIFT Transfer approved.', ref: 'APP-2' },
    { request: 'MMF Investment', amount: 'KES 2,500,000', initiator: 'James K.', approveMsg: 'Investment approved.', ref: 'APP-3' },
  ];

  bankStatements: BankStatement[] = [
    { date: '28 Jun', description: 'PayMo SWEEP IN', ref: 'TRF-001', inflow: '1,450,200', outflow: '-', balance: '14,250,000' },
    { date: '27 Jun', description: 'VENDOR PAY - ALIBABA', ref: 'SWIFT-88', inflow: '-', outflow: '582,300', balance: '12,799,800' },
    { date: '25 Jun', description: 'PAYROLL FUNDING', ref: 'TRF-002', inflow: '-', outflow: '4,000,000', balance: '13,382,100' },
  ];

  yieldData: YieldRow[] = [
    { month: 'June', principal: 'KES 18.0M', interest: 'KES 185,200', yield: '12.3%' },
    { month: 'May', principal: 'KES 16.5M', interest: 'KES 160,400', yield: '11.6%' },
    { month: 'April', principal: 'KES 15.0M', interest: 'KES 135,000', yield: '10.8%' },
  ];


  openModal(id: string): void {
    if (id === 'treasuryReportModal') id = 'exportTreasuryModal';
    this.activeModal = id;
    this.loadingModal = null;
    Object.keys(this.stepState).forEach((k) => (this.stepState[k] = 1));
  }

  closeModal(): void {
    this.activeModal = null;
    this.loadingModal = null;
    Object.keys(this.stepState).forEach((k) => (this.stepState[k] = 1));
  }

  @HostListener('document:keydown.escape')
  onEsc(): void { this.closeModal(); }

  nextFlow(type: string, total: number, modalId?: string, message?: string, ref?: string): void {
    const current = this.stepState[type] ?? 1;
    const mid = modalId || this.getFlowModalId(type);
    if (current >= total) {
      this.processAction(mid, message || 'Flow completed.', ref || 'OK');
      return;
    }
    if (current === total - 1) {
      this.loadingModal = mid;
      setTimeout(() => {
        this.stepState[type] = total;
        this.loadingModal = null;
        this.processAction(mid, message || 'Executed successfully.', ref || 'OK');
      }, 1200);
      return;
    }
    this.stepState[type] = current + 1;
  }

  selectBox(event: Event): void {
    const el = event.currentTarget as HTMLElement;
    const row = el.closest('.row');
    row?.querySelectorAll('.acct-card').forEach((b) => {
      (b as HTMLElement).style.borderColor = '';
      (b as HTMLElement).style.background = '';
    });
    el.style.borderColor = 'var(--pm-primary)';
    el.style.background = 'rgba(79,70,229,.04)';
  }

  selectRadioCard(event: Event): void {
    const el = event.currentTarget as HTMLElement;
    const row = el.closest('.row');
    row?.querySelectorAll('.acct-card, .border').forEach((b) => {
      (b as HTMLElement).style.borderColor = '';
      (b as HTMLElement).style.background = '';
      const r = b.querySelector('input[type=radio]') as HTMLInputElement | null;
      if (r) r.checked = false;
    });
    el.style.borderColor = 'var(--pm-primary)';
    el.style.background = 'rgba(79,70,229,.04)';
    const radio = el.querySelector('input[type=radio]') as HTMLInputElement | null;
    if (radio) radio.checked = true;
  }

  moveFocus(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && input.nextElementSibling) (input.nextElementSibling as HTMLInputElement).focus();
  }

  processAction(modalId: string, msg: string, ref: string): void {
    this.loadingModal = modalId;
    setTimeout(() => {
      this.savedModals[modalId] = { message: msg, ref };
      this.loadingModal = null;
      this.notify(ref ? `${msg} Ref: ${ref}` : msg);
    }, 900);
  }

  resetAllModals(): void { this.closeModal(); this.savedModals = {}; }

  getFlowModalId(type: string): string {
    const map: Record<string, string> = {
      addBank: 'addAccountModal', transfer: 'transferFundsModal', fx: 'bookFXModal',
      crossBorder: 'crossBorderModal', invest: 'investCashModal',
    };
    return map[type] || '';
  }

  isStepActive(type: string, index: number): boolean { return this.stepState[type] === index + 1; }
  isStepCompleted(type: string, index: number): boolean { return this.stepState[type] > index + 1; }
  getFlowButtonLabel(type: string, total: number): string {
    const current = this.stepState[type];
    if (current >= total) return 'Done';
    if (current === total - 1) return 'Execute';
    return this.flowButtonDefaults[type] || 'Continue';
  }

  getModalRows(modalId: string): string[][] {
    const map: Record<string, string[][]> = {
      multiAccountModal: this.accounts.map(a => [a.bank, a.accountNo, a.balance, a.lastSync]),
      sweepHistoryModal: this.sweepLogs.map(s => [s.date, s.rule, s.amount, s.status]),
      fxRatesModal: this.fxRates.map(r => [r.pair, r.bid, r.ask, r.trendPct]),
      approvalQueueModal: this.approvalItems.map(a => [a.request, a.amount, a.initiator, 'Pending']),
      bankStatementsModal: this.bankStatements.map(b => [b.date, b.description, b.inflow, b.balance]),
      yieldAnalyticsModal: this.yieldData.map(y => [y.month, y.principal, y.interest, y.yield]),
      investmentPortfolioModal: [['MMF Core', 'KES 12.0M', '12.1%', 'Active'], ['Term 90d', 'KES 6.0M', '13.4%', 'Active']],
      attentionModal: [['Low till float', 'Top-up recommended', 'KES 1.4M', 'Open'], ['FX hedge expiry', 'USD forward rolls in 3d', '$45k', 'Open']],
    };
    return map[modalId] ?? [['Item', 'Detail', '—', 'Ready']];
  }

  notify(message: string): void { this.toastMessage = message; setTimeout(() => this.clearToast(), 3200); }
  clearToast(): void { this.toastMessage = ''; }
}
