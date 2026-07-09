import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ═══════════════════════════════════════════════════════
   INTERFACES
   ═══════════════════════════════════════════════════════ */

export interface HeroStatButton {
  label: string;
  modalId: string;
}

export interface MiniBar {
  height: number;
  color: string;
}

export interface HeroStat {
  colClass: string;
  isAccent: boolean;
  borderLeftColor?: string;
  label: string;
  labelColor: string;
  value: string;
  valueColor?: string;
  valueSuffix?: string;
  indicatorDotColor?: string;
  subtitle?: string;
  badgeText?: string;
  badgeClass?: string;
  badgeIcon?: string;
  buttons?: HeroStatButton[];
  miniBars?: MiniBar[];
  progressPct?: number;
  progressColor?: string;
  progressLabel?: string;
  progressValue?: string;
  extraInfo?: { label: string; text: string }[];
}

export interface FeedItem {
  iconBg: string;
  iconColor: string;
  iconText: string;
  title: string;
  description: string;
  btnLabel: string;
  btnClass: string;
  btnModal: string;
}

export interface QuickAction {
  iconFull: string;
  iconColorStyle?: string;
  label: string;
  modalId: string;
}

export interface StatementRow {
  label: string;
  value: string;
  valueStyle?: string;
}

export interface VirtualCard {
  alias: string;
  number: string;
  type: 'Single-Use' | 'Subscription' | 'Multi-Use';
  bg: string;
  brand: 'VISA' | 'Mastercard';
  limit: string;
  spent: string;
  available: string;
  exp: string;
  utilPct: number;
}

export interface Subscription {
  merchant: string;
  card: string;
  amount: string;
  date: string;
}

export interface VCardTransaction {
  date: string;
  merchant: string;
  card: string;
  amount: string;
  status: string;
  statusClass: string;
}

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

@Component({
  selector: 'app-virtual-credit.',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './virtual-credit.html',
  styleUrls: ['./virtual-credit.css'],
  encapsulation: ViewEncapsulation.None
})
export class VirtualCreditComponent {

  // ─── Modal ───
  activeModal = '';

  // ─── Multi-step ───
  cardStep = 1;
  payCredStep = 1;
  cardStepperLabels = ['Purpose', 'Limits', 'Auth', 'Done'];
  payCredStepperLabels = ['Amount', 'Method', 'Done'];

  // ─── Success flags ───
  freezeSaved = false;
  cvvSaved = false;
  limitSaved = false;
  autoPaySaved = false;
  fraudResolved = false;
  expirySaved = false;
  disputeSaved = false;
  stmtSaved = false;
  limitIncSaved = false;
  deleteSaved = false;
  profileSaved = false;
  manageSaved = false;
  subBlocked = false;
  cardRevealed = false;

  // ─── Form state ───
  selectedPurpose: 'single' | 'subscription' | 'multi' = 'multi';
  payAmount: 'min' | 'full' | 'custom' = 'full';
  paySource: 'wallet' | 'mpesa' = 'wallet';
  manageTab: 'settings' | 'limits' | 'danger' = 'settings';

  // ─── Hero Stats ───
  heroStats: HeroStat[] = [
    {
      colClass: 'col-lg-4',
      isAccent: true,
      label: 'Virtual credit limit active',
      labelColor: 'rgba(255,255,255,.78)',
      value: 'KES 150,000',
      valueColor: '#fff',
      indicatorDotColor: '#86efac',
      subtitle: 'Total credit limit shared across your active virtual cards.',
      buttons: [
        { label: 'Allocate Limit', modalId: 'limitAllocationModal' },
        { label: 'Repay balance', modalId: 'payCreditBillModal' },
        { label: 'Request Increase', modalId: 'limitIncreaseModal' },
      ],
    },
    {
      colClass: 'col-lg-2 col-md-4 col-6',
      isAccent: false,
      label: 'OUTSTANDING BALANCE',
      labelColor: 'var(--pm-warning)',
      value: 'KES 42,300',
      badgeText: 'Due in 12 days',
      badgeClass: 'warning',
      badgeIcon: 'calendar',
      miniBars: [
        { height: 35, color: 'var(--pm-primary)' },
        { height: 20, color: 'var(--pm-info)' },
        { height: 52, color: 'var(--pm-primary)' },
        { height: 25, color: 'var(--pm-info)' },
        { height: 88, color: 'var(--pm-warning)' },
        { height: 10, color: 'var(--pm-info)' },
      ],
    },
    {
      colClass: 'col-lg-3 col-md-4 col-6',
      isAccent: false,
      label: 'ACTIVE V-CARDS',
      labelColor: 'var(--pm-info)',
      value: '4 Cards',
      badgeText: '100% Tokenized',
      badgeClass: 'success',
      badgeIcon: 'shield-check',
      progressPct: 28,
      progressColor: 'var(--pm-info)',
      progressLabel: 'Limit Utilization',
      progressValue: '28%',
    },
    {
      colClass: 'col-lg-3 col-md-4',
      isAccent: false,
      borderLeftColor: 'var(--pm-accent)',
      label: 'ACTIVE SUBSCRIPTIONS',
      labelColor: 'var(--pm-accent)',
      value: 'KES 8,450',
      valueSuffix: '/mo',
      badgeText: '7 active merchants',
      badgeClass: 'success',
      badgeIcon: 'arrow-repeat',
      extraInfo: [
        { label: 'Highest', text: 'AWS Cloud (KES 2,400)' },
        { label: 'Upcoming', text: 'Netflix (KES 1,200)' },
      ],
    },
  ];

  // ─── Attention Feed Items ───
  attentionItems: FeedItem[] = [
    { iconBg: 'var(--pm-danger-soft)', iconColor: 'var(--pm-danger)', iconText: 'CV', title: 'Single-use card compromised', description: 'Blocked attempt at unauthorized merchant', btnLabel: 'Review', btnClass: 'pm-btn-danger', btnModal: 'fraudAlertModal' },
    { iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', iconText: 'BL', title: 'Approaching card limit', description: "'Marketing Ads' card at 92% of limit", btnLabel: 'Adjust', btnClass: '', btnModal: 'limitAllocationModal' },
    { iconBg: 'var(--pm-purple-soft)', iconColor: 'var(--pm-purple)', iconText: 'EX', title: 'Virtual card expiring soon', description: "'AWS Hosting' card expires in 5 days", btnLabel: 'Renew', btnClass: '', btnModal: 'cardExpiryModal' },
  ];

  // ─── Smart Suggestion Feed Items ───
  suggestionItems: FeedItem[] = [
    { iconBg: 'var(--pm-accent-soft)', iconColor: 'var(--pm-accent)', iconText: 'AP', title: 'Set up auto-pay for credit balance', description: 'Avoid late fees of KES 500', btnLabel: 'Setup', btnClass: '', btnModal: 'autoPayModal' },
    { iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', iconText: 'SB', title: 'Isolate online subscriptions', description: 'Move Netflix & Spotify to a dedicated card', btnLabel: 'Create', btnClass: '', btnModal: 'createCardModal' },
    { iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', iconText: 'ZP', title: 'Unused subscriptions detected', description: "'Adobe CC' hasn't been accessed in 3 months", btnLabel: 'Review', btnClass: '', btnModal: 'subscriptionManageModal' },
  ];

  // ─── Quick Actions ───
  quickActions: QuickAction[] = [
    { iconFull: 'bi bi-plus-circle text-primary me-1', label: 'New V-Card', modalId: 'createCardModal' },
    { iconFull: 'bi bi-cash-stack text-success me-1', label: 'Pay Balance', modalId: 'payCreditBillModal' },
    { iconFull: 'bi bi-sliders text-warning me-1', label: 'Adjust Limits', modalId: 'limitAllocationModal' },
    { iconFull: 'bi bi-snow text-info me-1', label: 'Freeze Card', modalId: 'freezeCardModal' },
    { iconFull: 'bi bi-arrow-repeat me-1', iconColorStyle: 'var(--pm-purple)', label: 'Subscriptions', modalId: 'subscriptionManageModal' },
    { iconFull: 'bi bi-arrow-clockwise text-danger me-1', label: 'Rotate CVV', modalId: 'generateCVVModal' },
    { iconFull: 'bi bi-list-columns me-1', iconColorStyle: 'var(--pm-primary)', label: 'Statements', modalId: 'transactionHistoryModal' },
    { iconFull: 'bi bi-shield-exclamation me-1', iconColorStyle: 'var(--pm-accent)', label: 'Dispute', modalId: 'disputeTransactionModal' },
  ];

  // ─── Statement Rows ───
  statementRows: StatementRow[] = [
    { label: 'Previous Balance', value: 'KES 0' },
    { label: 'Purchases & Advances', value: 'KES 42,300' },
    { label: 'Interest & Fees', value: 'KES 0' },
    { label: 'Payments & Credits', value: 'KES 0' },
    { label: 'Total Amount Due', value: 'KES 42,300', valueStyle: 'color:var(--pm-danger)' },
    { label: 'Minimum Payment', value: 'KES 4,230' },
  ];

  // ─── Data (swap with API calls) ───
  vcards: VirtualCard[] = [
    { alias: 'AWS Hosting', number: '**** 9173', type: 'Subscription', bg: 'var(--pm-gradient-hero)', brand: 'VISA', limit: '20,000', spent: '2,400', available: '17,600', exp: '06/25', utilPct: 12 },
    { alias: 'Marketing Ads', number: '**** 7720', type: 'Multi-Use', bg: 'var(--pm-gradient-blue)', brand: 'Mastercard', limit: '50,000', spent: '15,400', available: '34,600', exp: '11/26', utilPct: 31 },
    { alias: 'Software Subs', number: '**** 1104', type: 'Multi-Use', bg: 'var(--pm-gradient-slate)', brand: 'VISA', limit: '15,000', spent: '3,600', available: '11,400', exp: '01/27', utilPct: 24 },
    { alias: 'Travel Exp', number: '**** 4409', type: 'Multi-Use', bg: 'var(--pm-gradient-warm)', brand: 'Mastercard', limit: '23,000', spent: '850', available: '22,150', exp: '08/26', utilPct: 4 },
  ];

  subscriptions: Subscription[] = [
    { merchant: 'AWS Cloud', card: 'AWS Hosting', amount: 'KES 2,400', date: '15th' },
    { merchant: 'Netflix', card: 'Software Subs', amount: 'KES 1,200', date: '20th' },
    { merchant: 'Spotify', card: 'Software Subs', amount: 'KES 300', date: '1st' },
    { merchant: 'Facebook Ads', card: 'Marketing Ads', amount: 'KES ~15k', date: 'Weekly' },
    { merchant: 'Google Workspace', card: 'Software Subs', amount: 'KES 2,100', date: '25th' },
  ];

  transactions: VCardTransaction[] = [
    { date: '27 Jun', merchant: 'Facebook Ads', card: 'Marketing Ads', amount: 'KES 12,400', status: 'Success', statusClass: 'success' },
    { date: '25 Jun', merchant: 'Google Wksp', card: 'Software Subs', amount: 'KES 2,100', status: 'Success', statusClass: 'success' },
    { date: '22 Jun', merchant: 'AWS EMEA', card: 'AWS Hosting', amount: 'KES 2,400', status: 'Success', statusClass: 'success' },
    { date: '18 Jun', merchant: 'Uber *Trip', card: 'Travel Exp', amount: 'KES 850', status: 'Pending', statusClass: 'warning' },
    { date: '10 Jun', merchant: 'LinkedIn Ads', card: 'Marketing Ads', amount: 'KES 3,000', status: 'Declined', statusClass: 'danger' },
  ];

  // ─── Modal methods ───
  openModal(id: string): void { this.resetAll(); this.activeModal = id; document.body.classList.add('modal-open'); }
  closeModal(): void { this.activeModal = ''; document.body.classList.remove('modal-open'); this.resetAll(); }
  switchModal(id: string): void { this.resetAll(); this.activeModal = id; }

  @HostListener('document:keydown.escape')
  onEscape(): void { if (this.activeModal) this.closeModal(); }

  private resetAll(): void {
    this.cardStep = 1; this.payCredStep = 1;
    this.freezeSaved = false; this.cvvSaved = false; this.limitSaved = false;
    this.autoPaySaved = false; this.fraudResolved = false; this.expirySaved = false;
    this.disputeSaved = false; this.stmtSaved = false; this.limitIncSaved = false;
    this.deleteSaved = false; this.profileSaved = false; this.manageSaved = false;
    this.subBlocked = false; this.cardRevealed = false;
    this.payAmount = 'full'; this.paySource = 'wallet';
    this.manageTab = 'settings'; this.selectedPurpose = 'multi';
  }

  // ─── Multi-step navigation ───
  nextCardStep(): void { if (this.cardStep >= 3) { this.closeModal(); return; } this.cardStep++; }
  nextPayCredStep(): void { if (this.payCredStep >= 2) { this.closeModal(); return; } this.payCredStep++; }

  // ─── Helpers ───
  moveFocus(current: HTMLInputElement, next: HTMLInputElement): void {
    if (current.value.length === 1 && next) next.focus();
  }
}