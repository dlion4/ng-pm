import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ─── Interfaces (ready for API integration) ───
export interface Card {
  id: string;
  last4: string;
  type: string;       // 'credit' | 'debit' | 'prepaid'
  form: string;       // 'physical' | 'virtual'
  network: string;    // 'VISA' | 'Mastercard'
  holderName: string;
  expiry: string;
  balance: number;
  creditLimit: number;
  creditUsed: number;
  status: 'active' | 'frozen' | 'expired' | 'blocked';
  bgClass: string;
  dailyLimit: number;
  typeLabel: string;
  balanceLabel: string;
  chipStyle?: string;
  actions: CardAction[];
}

export interface CardAction {
  label: string;
  icon: string;
  styleClass: string;
  extraColor?: string;
  modal?: string;
}

export interface Transaction {
  id: string;
  date: string;
  cardLast4: string;
  cardIcon: string;
  cardBg: string;
  merchant: string;
  category: string;
  amount: string;
  status: string;
  statusClass: string;
  isDeclined: boolean;
  actionLabel: string;
}

export interface Notification {
  id: number;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface BudgetCategory {
  name: string;
  limit: number;
  spent: number;
}

export interface SecurityControl {
  name: string;
  status: 'active' | 'warning' | 'danger';
  statusLabel: string;
  impact: 'High' | 'Medium' | 'Low';
  actionModal?: string;
}

export interface HeroStat {
  id: string;
  isDark: boolean;
  label: string;
  value: string;
  labelColor?: string;
  borderLeft?: string;
  greenDot?: boolean;
  showSubCounts?: boolean;
  subCounts?: { label: string; value: number }[];
  progressPct?: number;
  progressColor?: string;
  detailText?: string;
  detailHtml?: string;
  detailMt2?: boolean;
  detailColor?: string;
  badgeClass?: string;
  badgeIcon?: string;
  badgeText?: string;
  buttonText?: string;
  buttonModal?: string;
  buttonClass?: string;
  buttonStyle?: string;
  buttonWrapperClass?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  iconClass: string;
  iconStyle?: string;
  modal: string;
}

export interface CategoryBar {
  id: string;
  label: string;
  heightPct: number;
  color: string;
  modal: string;
}

export interface BudgetItem {
  id: string;
  label: string;
  amountText: string;
  pct: number;
  barColor: string;
  marginClass: string;
}

export interface HealthStatusRow {
  id: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionModal?: string;
  completeIcon?: string;
}

@Component({
  selector: 'app-card-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-dashboard.html',
  styleUrls: ['./card-dashboard.css'],
  encapsulation: ViewEncapsulation.None
})
export class CardDashboardComponent {

  // ─── Modal State ───
  activeModal: string = '';

  // ─── Multi-step states ───
  lostStep = 1;
  payBillStep = 1;
  addCardStep = 1;

  // ─── Stepper labels ───
  lostStepperLabels = ['Select', 'Confirm', 'Replace'];
  payBillStepperLabels = ['Select', 'Pay'];
  addCardStepperLabels = ['Type', 'Design', 'Deliver'];

  // ─── Success/receipt flags ───
  freezeSuccess = false;
  cvvRevealed = false;
  alertsSaved = false;
  autoRenewalSaved = false;
  renewSaved = false;
  budgetSaved = false;
  replaceSaved = false;
  pinChanged = false;
  pinResetDone = false;
  contactlessSaved = false;
  onlineTxnSaved = false;
  intlSaved = false;
  atmSaved = false;
  tempLimitSaved = false;
  topupDone = false;
  transferDone = false;
  exportDone = false;

  // ─── Form state ───
  freezeReason = 'Misplaced temporarily';
  fundingSource: 'wallet' | 'mpesa' = 'wallet';
  selectedCardType: 'virtual' | 'physical' = 'virtual';
  topupAmount = 10000;
  topupChips = [1000, 5000, 10000];

  // ─── Card Portfolio Data ───
  cards: Card[] = [
    {
      id: '1', last4: '4921', type: 'credit', form: 'physical', network: 'VISA',
      holderName: 'JAMES KAMAU', expiry: '12/28', balance: 145000,
      creditLimit: 250000, creditUsed: 105000, status: 'active',
      bgClass: 'bank-card-bg-1', dailyLimit: 50000,
      typeLabel: 'Premium Credit',
      balanceLabel: 'Available: KES 145,000',
      actions: [
        { label: 'Freeze', icon: 'bi bi-snow', styleClass: 'pm-btn-outline', modal: 'freezeCardModal' },
        { label: 'CVV', icon: 'bi bi-eye', styleClass: 'pm-btn-outline', modal: 'showCvvModal' },
      ],
    },
    {
      id: '2', last4: '8810', type: 'debit', form: 'virtual', network: 'Mastercard',
      holderName: 'ONLINE SPEND', expiry: '04/27', balance: 18200,
      creditLimit: 100000, creditUsed: 0, status: 'active',
      bgClass: 'bank-card-bg-2', dailyLimit: 50000,
      typeLabel: 'Virtual Debit',
      balanceLabel: 'Balance: KES 18,200',
      chipStyle: 'opacity:0.5;background:transparent;border:1px solid rgba(255,255,255,0.3)',
      actions: [
        { label: 'Freeze', icon: 'bi bi-snow', styleClass: 'pm-btn-outline', modal: 'freezeCardModal' },
        { label: 'Copy', icon: 'bi bi-files', styleClass: 'pm-btn-outline' },
      ],
    },
    {
      id: '3', last4: '3105', type: 'debit', form: 'physical', network: 'VISA',
      holderName: 'JAMES KAMAU', expiry: '09/26', balance: 45000,
      creditLimit: 0, creditUsed: 0, status: 'frozen',
      bgClass: 'bank-card-bg-3', dailyLimit: 40000,
      typeLabel: 'Physical Debit',
      balanceLabel: 'Linked to Main Acct',
      actions: [
        { label: 'Unfreeze', icon: 'bi bi-fire', styleClass: 'pm-btn-accent', extraColor: '#fff', modal: 'freezeCardModal' },
        { label: 'Replace', icon: 'bi bi-arrow-repeat', styleClass: 'pm-btn-outline', modal: 'replaceCardModal' },
      ],
    },
  ];

  // ─── Transactions Data ───
  transactions: Transaction[] = [
    { id: 'TXN-001', date: 'Today, 14:20', cardLast4: '****4921', cardIcon: 'bi bi-credit-card', cardBg: '#f3f4f6', merchant: 'Carrefour Supermarket', category: 'Groceries', amount: 'KES 12,450.00', status: 'Approved', statusClass: 'pm-badge-success', isDeclined: false, actionLabel: 'Details' },
    { id: 'TXN-002', date: 'Today, 09:15', cardLast4: '****8810', cardIcon: 'bi bi-globe', cardBg: '#f3f4f6', merchant: 'Netflix.com', category: 'Entertainment', amount: 'KES 1,200.00', status: 'Approved', statusClass: 'pm-badge-success', isDeclined: false, actionLabel: 'Details' },
    { id: 'TXN-003', date: 'Yesterday', cardLast4: '****4921', cardIcon: 'bi bi-credit-card', cardBg: '#f3f4f6', merchant: 'Shell Petrol Station', category: 'Transport', amount: 'KES 4,000.00', status: 'Approved', statusClass: 'pm-badge-success', isDeclined: false, actionLabel: 'Details' },
    { id: 'TXN-004', date: '26 Jun 2025', cardLast4: '****8810', cardIcon: 'bi bi-globe', cardBg: '#f3f4f6', merchant: 'Amazon AWS', category: 'Online', amount: 'USD 45.00', status: 'Declined', statusClass: 'pm-badge-danger', isDeclined: true, actionLabel: 'Fix' },
    { id: 'TXN-005', date: '24 Jun 2025', cardLast4: '****3105', cardIcon: 'bi bi-credit-card', cardBg: '#f3f4f6', merchant: 'ATM Withdrawal', category: 'Cash', amount: 'KES 10,000.00', status: 'Approved', statusClass: 'pm-badge-success', isDeclined: false, actionLabel: 'Details' },
  ];

  // ─── Notifications Data ───
  notifications: Notification[] = [
    { id: 1, title: 'Declined Transaction', body: 'Amazon AWS (USD 45.00) declined due to insufficient prepaid balance.', time: '2h ago', read: false },
    { id: 2, title: 'Large Purchase Alert', body: 'KES 12,450 spent at Carrefour.', time: '5h ago', read: false },
    { id: 3, title: 'Budget Warning', body: 'You have reached 85% of your global monthly card limit.', time: '1d ago', read: true },
  ];

  // ─── Quick Actions Data ───
  quickActions: QuickAction[] = [
    { id: 'qa-freeze', label: 'Freeze/Thaw', iconClass: 'bi bi-snow text-info', modal: 'freezeCardModal' },
    { id: 'qa-pin', label: 'Change PIN', iconClass: 'bi bi-asterisk text-warning', modal: 'changePinModal' },
    { id: 'qa-lost', label: 'Report Lost', iconClass: 'bi bi-shield-exclamation text-danger', modal: 'reportLostModal' },
    { id: 'qa-limit', label: 'Set Limit', iconClass: 'bi bi-speedometer2 text-success', modal: 'tempLimitModal' },
    { id: 'qa-contactless', label: 'Contactless', iconClass: 'bi bi-wifi text-primary', modal: 'contactlessLimitModal' },
    { id: 'qa-online', label: 'Online Txn', iconClass: 'bi bi-globe', iconStyle: 'color:var(--pm-purple)', modal: 'onlineTransactionsModal' },
    { id: 'qa-paybill', label: 'Pay Bill', iconClass: 'bi bi-credit-card-2-front text-secondary', modal: 'payCardBillModal' },
    { id: 'qa-transfer', label: 'Transfer', iconClass: 'bi bi-arrow-left-right text-dark', modal: 'transferBetweenCardsModal' },
  ];

  // ─── Spend Category Chart Bars Data ───
  categoryBars: CategoryBar[] = [
    { id: 'cb-1', label: 'Groceries', heightPct: 80, color: 'var(--pm-warning)', modal: 'merchantAnalyticsModal' },
    { id: 'cb-2', label: 'Dining', heightPct: 45, color: 'var(--pm-info)', modal: 'merchantAnalyticsModal' },
    { id: 'cb-3', label: 'Transport', heightPct: 60, color: 'var(--pm-purple)', modal: 'merchantAnalyticsModal' },
    { id: 'cb-4', label: 'Online', heightPct: 95, color: 'var(--pm-primary)', modal: 'merchantAnalyticsModal' },
    { id: 'cb-5', label: 'Health', heightPct: 30, color: 'var(--pm-accent)', modal: 'merchantAnalyticsModal' },
  ];

  // ─── Budget Tracking Data ───
  budgetItems: BudgetItem[] = [
    { id: 'bi-1', label: 'Overall Card Spend', amountText: 'KES 118,200 / 140,000', pct: 85, barColor: 'var(--pm-warning)', marginClass: 'mb-3' },
    { id: 'bi-2', label: 'Online Purchases (Virtual)', amountText: 'KES 42,000 / 50,000', pct: 84, barColor: 'var(--pm-primary)', marginClass: 'mb-3' },
    { id: 'bi-3', label: 'Dining & Entertainment', amountText: 'KES 18,500 / 30,000', pct: 61, barColor: 'var(--pm-info)', marginClass: 'mb-2' },
  ];

  // ─── Health & Security Status Rows Data ───
  healthStatusRows: HealthStatusRow[] = [
    { id: 'hs-1', title: 'Expiry Management', description: 'Card ****3105 expiring in 72 days', actionLabel: 'Review', actionModal: 'autoRenewalModal' },
    { id: 'hs-2', title: '3D Secure Setup', description: 'All active cards enrolled', completeIcon: 'bi bi-check-circle-fill text-success' },
    { id: 'hs-3', title: 'International Txn', description: 'Allowed on Virtual Debit ****8810', actionLabel: 'Manage', actionModal: 'internationalTransactionsModal' },
  ];

  // ─── Computed ───
  get virtualCount(): number { return this.cards.filter(c => c.form === 'virtual').length; }
  get physicalCount(): number { return this.cards.filter(c => c.form === 'physical').length; }
  get creditCount(): number { return this.cards.filter(c => c.type === 'credit').length; }

  // ─── Hero Stats (getter for dynamic first-card value) ───
  get heroStats(): HeroStat[] {
    return [
      {
        id: 'cards-summary',
        isDark: true,
        label: 'Active Cards Summary',
        value: `${this.cards.length} Cards`,
        greenDot: true,
        showSubCounts: true,
        subCounts: [
          { label: 'Virtual', value: this.virtualCount },
          { label: 'Physical', value: this.physicalCount },
          { label: 'Credit', value: this.creditCount },
        ],
        buttonText: '+ Create New',
        buttonModal: 'addCardModal',
        buttonClass: 'pm-btn pm-btn-sm',
        buttonStyle: 'background:rgba(255,255,255,.1);border:none;color:#fff',
        buttonWrapperClass: 'mt-3',
      },
      {
        id: 'available-credit',
        isDark: false,
        label: 'TOTAL AVAILABLE CREDIT',
        value: 'KES 145,000',
        labelColor: 'var(--pm-primary)',
        progressPct: 42,
        progressColor: 'var(--pm-primary)',
        detailText: 'Limit: KES 250,000 \u00B7 Used: KES 105,000',
        detailMt2: false,
        detailColor: 'var(--pm-muted)',
      },
      {
        id: 'prepaid-balance',
        isDark: false,
        label: 'PREPAID BALANCE',
        value: 'KES 32,450',
        labelColor: 'var(--pm-accent)',
        badgeClass: 'pm-badge pm-badge-success',
        badgeIcon: 'bi bi-arrow-up',
        badgeText: 'Top-up Ready',
        detailText: 'Across 2 prepaid virtual cards',
        detailMt2: true,
        detailColor: 'var(--pm-ink-soft)',
        buttonText: 'Top-up now',
        buttonModal: 'topupPrepaidModal',
        buttonClass: 'pm-btn pm-btn-sm pm-btn-outline',
        buttonWrapperClass: 'mt-2',
      },
      {
        id: 'monthly-spend',
        isDark: false,
        label: "THIS MONTH'S SPEND",
        value: 'KES 118,200',
        labelColor: 'var(--pm-warning)',
        borderLeft: '3px solid var(--pm-warning)',
        badgeClass: 'pm-badge pm-badge-warning',
        badgeIcon: 'bi bi-graph-up-arrow',
        badgeText: '+12% vs last month',
        detailHtml: 'Budget used: <strong>85%</strong>',
        detailMt2: true,
        detailColor: 'var(--pm-ink-soft)',
      },
    ];
  }

  // ─── Modal methods ───
  openModal(id: string): void {
    this.resetAllStates();
    this.activeModal = id;
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    this.activeModal = '';
    document.body.classList.remove('modal-open');
    this.resetAllStates();
  }

  switchModal(id: string): void {
    this.resetAllStates();
    this.activeModal = id;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.activeModal) {
      this.closeModal();
    }
  }

  private resetAllStates(): void {
    this.lostStep = 1;
    this.payBillStep = 1;
    this.addCardStep = 1;
    this.freezeSuccess = false;
    this.cvvRevealed = false;
    this.alertsSaved = false;
    this.autoRenewalSaved = false;
    this.renewSaved = false;
    this.budgetSaved = false;
    this.replaceSaved = false;
    this.pinChanged = false;
    this.pinResetDone = false;
    this.contactlessSaved = false;
    this.onlineTxnSaved = false;
    this.intlSaved = false;
    this.atmSaved = false;
    this.tempLimitSaved = false;
    this.topupDone = false;
    this.transferDone = false;
    this.exportDone = false;
    this.fundingSource = 'wallet';
    this.topupAmount = 10000;
    this.selectedCardType = 'virtual';
  }

  // ─── Multi-step navigation ───
  nextLostStep(): void {
    if (this.lostStep === 3) {
      this.closeModal();
      return;
    }
    if (this.lostStep === 2) {
      this.lostStep = 3;
      return;
    }
    this.lostStep++;
  }

  nextPayBillStep(): void {
    if (this.payBillStep === 2) {
      this.closeModal();
      return;
    }
    this.payBillStep++;
  }

  nextAddCardStep(): void {
    if (this.addCardStep === 3) {
      this.closeModal();
      return;
    }
    this.addCardStep++;
  }

  // ─── PIN focus helpers ───
  moveFocus(current: HTMLInputElement, next: HTMLInputElement): void {
    if (current.value.length === 1 && next) {
      next.focus();
    }
  }

  onCvvPinEnter(): void {
    this.revealCvv();
  }

  revealCvv(): void {
    this.cvvRevealed = true;
  }

  // ─── Selection helpers ───
  selectFundingSource(source: 'wallet' | 'mpesa'): void {
    this.fundingSource = source;
  }

  selectTopupChip(amount: number): void {
    this.topupAmount = amount;
  }

  // ─── Generic process action (kept for API integration hook) ───
  processAction(message: string, ref: string): void {
    // Override per-modal in template; this is a hook for API calls
    console.log('Action processed:', message, ref);
  }
}