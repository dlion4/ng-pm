import { Component, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

/* ═══════════════════════════════════════════════════════
   INTERFACES
   ═══════════════════════════════════════════════════════ */

export interface VirtualCard {
  id: number;
  alias: string;
  last4: string;
  bgClass: string;
  statusLabel: string;
  maskedNumber: string;
  holderName: string;
  expiry: string;
}

export interface Subscription {
  id: number;
  service: string;
  icon: string;
  iconColorClass: string;
  cardRef: string;
  cycle: string;
  amount: string;
  lastPaid: string;
  nextDue: string;
  statusLabel: string;
  statusClass: string;
  actionLabel: string;
  actionModal: string;
}

export interface RecentTx {
  id: number;
  icon: string;
  merchant: string;
  statusColor: string;
  statusText: string;
  cardRef: string;
  amount: string;
  time: string;
}

export interface CardNotification {
  id: number;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

export interface SecurityItem {
  label: string;
  desc: string;
  passed: boolean;
}

export interface SpendingItem {
  card: string;
  amount: string;
  pct: string;
  color: string;
}

export interface HeroStatButton {
  label: string;
  modalId: string;
}

export interface MiniBar {
  height: string;
  color: string;
}

export interface HeroStatExtraInfo {
  label: string;
  value: string;
}

export interface HeroStat {
  colClass: string;
  isAccent: boolean;
  borderLeftColor?: string;
  label: string;
  labelColor: string;
  value: string;
  valueColor?: string;
  dotColor?: string;
  description?: string;
  descriptionColor?: string;
  badgeText?: string;
  badgeClass?: string;
  badgeIcon?: string;
  buttons?: HeroStatButton[];
  miniBars?: MiniBar[];
  progressPct?: number;
  progressColor?: string;
  progressLabel?: string;
  progressValue?: string;
  extraInfo?: HeroStatExtraInfo[];
}

export interface FeedItem {
  iconText: string;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
  btnLabel: string;
  btnClass: string;
  btnModal: string;
}

export interface QuickAction {
  icon: string;
  iconColorClass?: string;
  iconColorStyle?: string;
  label: string;
  modalId: string;
}

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

@Component({
  selector: 'app-virtual-debit',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './virtual-debit.html',
  styleUrls: ['./virtual-debit.css'],
  // encapsulation: ViewEncapsulation.None
})
export class VirtualDebitComponent {

  /* ─── Modal ─── */
  activeModal = signal<string>('');
  toastVisible = signal(false);
  toastMsg = signal('');

  /* ─── Hero Stats ─── */
  heroStats = signal<HeroStat[]>([
    {
      colClass: 'col-lg-4',
      isAccent: true,
      label: 'Virtual issuance engine is live',
      labelColor: 'rgba(255,255,255,.78)',
      dotColor: '#86efac',
      value: '5 active virtual cards',
      valueColor: '#fff',
      description: 'Used for global shopping, Netflix, AWS hosting, and secure single-use purchases.',
      descriptionColor: 'rgba(255,255,255,.78)',
      buttons: [
        { label: 'New card', modalId: 'createCardModal' },
        { label: 'Single-use', modalId: 'singleUseCardModal' },
        { label: 'Bulk issue', modalId: 'bulkCreateModal' },
      ],
    },
    {
      colClass: 'col-lg-2 col-md-4 col-6',
      isAccent: false,
      label: 'TOTAL MONTHLY SPEND',
      labelColor: 'var(--pm-primary)',
      value: 'KES 48,200',
      badgeText: '+12% this month',
      badgeClass: 'pm-badge pm-badge-info',
      badgeIcon: 'bi bi-graph-up',
      miniBars: [
        { height: '45%', color: 'var(--pm-primary)' },
        { height: '60%', color: 'var(--pm-primary)' },
        { height: '35%', color: 'var(--pm-info)' },
        { height: '80%', color: 'var(--pm-primary)' },
        { height: '90%', color: 'var(--pm-danger)' },
        { height: '60%', color: 'var(--pm-primary)' },
      ],
    },
    {
      colClass: 'col-lg-3 col-md-4 col-6',
      isAccent: false,
      label: 'ACTIVE SUBSCRIPTIONS',
      labelColor: 'var(--pm-warning)',
      value: '8 services',
      badgeText: '3 due this week',
      badgeClass: 'pm-badge pm-badge-warning',
      badgeIcon: 'bi bi-clock',
      progressPct: 40,
      progressColor: 'var(--pm-warning)',
      progressLabel: 'Total recurring',
      progressValue: 'KES 14,500/mo',
    },
    {
      colClass: 'col-lg-3 col-md-4',
      isAccent: false,
      borderLeftColor: 'var(--pm-accent)',
      label: 'SECURED BY PAYMO',
      labelColor: 'var(--pm-accent)',
      value: 'KES 12,400',
      badgeText: 'Blocked attempts',
      badgeClass: 'pm-badge pm-badge-success',
      badgeIcon: 'bi bi-shield-check',
      extraInfo: [
        { label: 'Frozen cards', value: '1' },
        { label: 'Single-use burned', value: '4' },
      ],
    },
  ]);

  /* ─── Attention Items ─── */
  attentionItems = signal<FeedItem[]>([
    { iconText: 'AL', iconBg: 'var(--pm-danger-soft)', iconColor: 'var(--pm-danger)', title: 'Declined: Insufficient Funds', desc: 'AWS Web Services · KES 4,500', btnLabel: 'Fund', btnClass: 'pm-btn pm-btn-sm pm-btn-danger', btnModal: 'topUpCardModal' },
    { iconText: 'EX', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'Card expiring in 15 days', desc: 'Global Shopping Card · **3841', btnLabel: 'Renew', btnClass: 'pm-btn pm-btn-sm', btnModal: 'renewCardModal' },
    { iconText: 'SB', iconBg: 'var(--pm-purple-soft)', iconColor: 'var(--pm-purple)', title: 'Subscription increased', desc: 'Netflix · +KES 300 this month', btnLabel: 'Review', btnClass: 'pm-btn pm-btn-sm', btnModal: 'subManagerModal' },
    { iconText: '3D', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', title: 'Pending 3D Secure Auth', desc: 'AliExpress · KES 2,100', btnLabel: 'Approve', btnClass: 'pm-btn pm-btn-sm', btnModal: 'auth3DSModal' },
  ]);

  /* ─── Suggestion Items ─── */
  suggestionItems = signal<FeedItem[]>([
    { iconText: 'LC', iconBg: 'var(--pm-accent-soft)', iconColor: 'var(--pm-accent)', title: 'Lock card to single merchant', desc: 'Secure your Netflix card further', btnLabel: 'Lock', btnClass: 'pm-btn pm-btn-sm', btnModal: 'merchantLockModal' },
    { iconText: 'CV', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', title: 'Enable Dynamic CVV', desc: 'Rotate CVV daily on Shopping Card', btnLabel: 'Enable', btnClass: 'pm-btn pm-btn-sm', btnModal: 'rotateCvvModal' },
    { iconText: 'IN', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'Unused subscription detected', desc: 'Spotify not used in 60 days', btnLabel: 'Cancel', btnClass: 'pm-btn pm-btn-sm', btnModal: 'cancelSubModal' },
    { iconText: 'LM', iconBg: 'var(--pm-danger-soft)', iconColor: 'var(--pm-danger)', title: 'Lower spending limit', desc: 'Freelance Services card rarely uses >KES 10k', btnLabel: 'Adjust', btnClass: 'pm-btn pm-btn-sm', btnModal: 'editLimitsModal' },
  ]);

  /* ─── Quick Actions ─── */
  quickActions = signal<QuickAction[]>([
    { icon: 'bi bi-credit-card me-1', iconColorClass: 'text-primary', label: 'New Card', modalId: 'createCardModal' },
    { icon: 'bi bi-lightning-charge me-1', iconColorClass: 'text-warning', label: 'Single-Use', modalId: 'singleUseCardModal' },
    { icon: 'bi bi-plus-circle me-1', iconColorClass: 'text-success', label: 'Top-up Card', modalId: 'topUpCardModal' },
    { icon: 'bi bi-arrow-down-circle me-1', iconColorClass: 'text-danger', label: 'Withdraw', modalId: 'withdrawCardModal' },
    { icon: 'bi bi-snow me-1', iconColorClass: 'text-info', label: 'Freeze', modalId: 'freezeCardModal' },
    { icon: 'bi bi-arrow-repeat me-1', iconColorStyle: 'var(--pm-purple)', label: 'Subs Hub', modalId: 'subManagerModal' },
    { icon: 'bi bi-file-earmark-text me-1', iconColorClass: 'text-secondary', label: 'Statements', modalId: 'cardStatementModal' },
    { icon: 'bi bi-shield-exclamation me-1', iconColorClass: 'text-danger', label: 'Report Fraud', modalId: 'reportFraudModal' },
  ]);

  /* ─── Card Data ─── */
  virtualCards = signal<VirtualCard[]>([
    { id: 1, alias: 'Global Shopping', last4: '3841', bgClass: 'v-card-bg-1', statusLabel: 'ACTIVE', maskedNumber: '4532 8821 0092 3841', holderName: 'JAMES KAMAU', expiry: '12/28' },
    { id: 2, alias: 'Subscription Master', last4: '9021', bgClass: 'v-card-bg-2', statusLabel: 'ACTIVE', maskedNumber: '4532 8821 0092 9021', holderName: 'JAMES KAMAU', expiry: '09/27' },
    { id: 3, alias: 'AWS & Hosting', last4: '4418', bgClass: 'v-card-bg-3', statusLabel: 'LOW FUNDS', maskedNumber: '4532 8821 0092 4418', holderName: 'JAMES KAMAU', expiry: '06/26' },
    { id: 4, alias: 'Freelance Services', last4: '7720', bgClass: 'v-card-bg-4', statusLabel: 'FROZEN', maskedNumber: '4532 8821 0092 7720', holderName: 'JAMES KAMAU', expiry: '03/27' },
    { id: 5, alias: 'Trial Burner', last4: '1104', bgClass: 'v-card-bg-5', statusLabel: 'BURNED', maskedNumber: '4532 8821 0092 1104', holderName: 'JAMES KAMAU', expiry: '01/27' },
  ]);

  /* ─── Recent Activity ─── */
  recentActivity = signal<RecentTx[]>([
    { id: 1, icon: 'bi bi-bag', merchant: 'AliExpress Shopping', statusColor: 'var(--pm-accent)', statusText: 'Pending 3D Secure', cardRef: 'Global Shopping · **3841', amount: 'KES 2,100', time: '2 min ago' },
    { id: 2, icon: 'bi bi-cloud', merchant: 'AWS Web Services', statusColor: 'var(--pm-danger)', statusText: 'Declined — Insufficient funds', cardRef: 'AWS & Hosting · **4418', amount: 'KES 4,500', time: '15 min ago' },
    { id: 3, icon: 'bi bi-play-btn', merchant: 'Netflix Premium', statusColor: 'var(--pm-accent)', statusText: 'Success', cardRef: 'Subscription Master · **9021', amount: 'KES 1,400', time: '2 hrs ago' },
    { id: 4, icon: 'bi bi-music-note', merchant: 'Spotify Family', statusColor: 'var(--pm-accent)', statusText: 'Success', cardRef: 'Subscription Master · **9021', amount: 'KES 300', time: '2 hrs ago' },
    { id: 5, icon: 'bi bi-cart', merchant: 'Jumia Electronics', statusColor: 'var(--pm-accent)', statusText: 'Success', cardRef: 'Global Shopping · **3841', amount: 'KES 6,240', time: '5 hrs ago' },
  ]);

  /* ─── Subscriptions ─── */
  subscriptions = signal<Subscription[]>([
    { id: 1, service: 'Netflix', icon: 'bi bi-play-btn-fill', iconColorClass: 'text-danger', cardRef: 'Sub Master · **9021', cycle: 'Monthly', amount: 'KES 1,400', lastPaid: '15 Jun', nextDue: '15 Jul', statusLabel: 'Active', statusClass: 'pm-badge-success', actionLabel: 'Manage', actionModal: 'manageSingleSubModal' },
    { id: 2, service: 'AWS Cloud', icon: 'bi bi-cloud-fill', iconColorClass: 'text-warning', cardRef: 'AWS & Host · **4418', cycle: 'Monthly', amount: 'KES 4,500', lastPaid: '10 Jun', nextDue: '10 Jul', statusLabel: 'Active', statusClass: 'pm-badge-success', actionLabel: 'Manage', actionModal: 'manageSingleSubModal' },
    { id: 3, service: 'Spotify', icon: 'bi bi-music-note-beamed', iconColorClass: 'text-success', cardRef: 'Sub Master · **9021', cycle: 'Monthly', amount: 'KES 300', lastPaid: '1 Jun', nextDue: '1 Jul', statusLabel: 'Active', statusClass: 'pm-badge-success', actionLabel: 'Manage', actionModal: 'manageSingleSubModal' },
    { id: 4, service: 'Google Workspace', icon: 'bi bi-google', iconColorClass: 'text-primary', cardRef: 'Global Shop · **3841', cycle: 'Monthly', amount: 'KES 2,100', lastPaid: '25 Jun', nextDue: '25 Jul', statusLabel: 'Active', statusClass: 'pm-badge-success', actionLabel: 'Manage', actionModal: 'manageSingleSubModal' },
    { id: 5, service: 'ChatGPT Plus', icon: 'bi bi-robot', iconColorClass: 'text-info', cardRef: 'Global Shop · **3841', cycle: 'Monthly', amount: 'KES 2,200', lastPaid: '5 Jun', nextDue: '5 Jul', statusLabel: 'Active', statusClass: 'pm-badge-success', actionLabel: 'Manage', actionModal: 'manageSingleSubModal' },
  ]);

  /* ─── Security Items ─── */
  securityItems = signal<SecurityItem[]>([
    { label: 'Dynamic CVV Rotation', desc: 'CVV auto-rotates every 24 hours on all cards', passed: false },
    { label: 'Merchant Lock', desc: 'Global Shopping card locked to Amazon', passed: true },
    { label: 'Transaction Alerts', desc: 'Instant push notifications for all charges', passed: true },
    { label: 'Spending Limits', desc: 'Monthly and per-transaction limits configured', passed: true },
    { label: '3D Secure Authentication', desc: 'Required for all international transactions', passed: true },
    { label: 'Card Freeze Control', desc: 'Instant freeze/unfreeze capability active', passed: true },
  ]);

  /* ─── Spending by Card ─── */
  spendingByCard = signal<SpendingItem[]>([
    { card: 'Global Shopping', amount: 'KES 18,400', pct: '38%', color: 'var(--pm-primary)' },
    { card: 'AWS & Hosting', amount: 'KES 14,200', pct: '29%', color: 'var(--pm-warning)' },
    { card: 'Subscription Master', amount: 'KES 10,300', pct: '21%', color: 'var(--pm-purple)' },
    { card: 'Freelance Services', amount: 'KES 5,300', pct: '12%', color: 'var(--pm-info)' },
  ]);

  /* ─── Notifications ─── */
  notifications = signal<CardNotification[]>([
    { id: 1, icon: '3D', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', title: '3D Secure Auth Pending', desc: 'AliExpress · KES 2,100 awaiting approval', time: '2 min ago', read: false },
    { id: 2, icon: 'AL', iconBg: 'var(--pm-danger-soft)', iconColor: 'var(--pm-danger)', title: 'Transaction Declined', desc: 'AWS charge failed due to insufficient funds', time: '15 min ago', read: false },
    { id: 3, icon: 'CV', iconBg: 'var(--pm-accent-soft)', iconColor: 'var(--pm-accent)', title: 'Dynamic CVV Available', desc: 'Enable CVV rotation for enhanced security', time: '1 hr ago', read: false },
    { id: 4, icon: 'EX', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'Card Expiring Soon', desc: 'Global Shopping Card expires in 15 days', time: '3 hrs ago', read: true },
    { id: 5, icon: 'SB', iconBg: 'var(--pm-purple-soft)', iconColor: 'var(--pm-purple)', title: 'Subscription Price Change', desc: 'Netflix increased by KES 300 this month', time: '6 hrs ago', read: true },
  ]);
  unreadCount = signal(3);

  /* ─── Multi-step: Create Card ─── */
  createStep = signal(1);
  selectedCardType = signal('global');
  cardNickname = signal('');
  fundingSource = signal('wallet');
  cardCurrency = signal('KES');
  monthlyLimit = signal(20000);
  perTxLimit = signal(10000);
  cardBgOptions = [
    { value: 'v-card-bg-1', css: 'v-card-bg-1' },
    { value: 'v-card-bg-2', css: 'v-card-bg-2' },
    { value: 'v-card-bg-3', css: 'v-card-bg-3' },
    { value: 'v-card-bg-4', css: 'v-card-bg-4' },
    { value: 'v-card-bg-5', css: 'v-card-bg-5' },
  ];
  selectedBg = signal('v-card-bg-1');

  /* ─── Card Reveal ─── */
  cardRevealed = signal(false);

  /* ─── Top Up ─── */
  topUpAmount = signal(5000);

  /* ─── Freeze Card ─── */
  freezeStep = signal(1);
  freezeCardId = signal('');

  /* ─── Bulk Create ─── */
  bulkStep = signal(1);

  /* ─── Delete Card ─── */
  deleteStep = signal(1);

  /* ─── Methods ─── */
  openModal(id: string): void {
    this.activeModal.set(id);
    document.body.classList.add('modal-open');
  }

  closeModal(id: string): void {
    this.activeModal.set('');
    document.body.classList.remove('modal-open');
  }

  showToast(msg: string, closeId?: string): void {
    this.toastMsg.set(msg);
    this.toastVisible.set(true);
    if (closeId) {
      this.closeModal(closeId);
    }
    setTimeout(() => this.toastVisible.set(false), 3000);
  }

  markAllRead(): void {
    this.notifications.update(items => items.map(n => ({ ...n, read: true })));
    this.unreadCount.set(0);
  }

  nextCreateStep(): void {
    if (this.createStep() >= 4) { this.closeModal('createCardModal'); return; }
    this.createStep.set(this.createStep() + 1);
  }

  nextFreezeStep(): void {
    if (this.freezeStep() >= 2) { this.closeModal('freezeCardModal'); return; }
    this.freezeStep.set(this.freezeStep() + 1);
  }

  nextBulkStep(): void {
    if (this.bulkStep() >= 2) { this.closeModal('bulkCreateModal'); return; }
    this.bulkStep.set(this.bulkStep() + 1);
  }

  nextDeleteStep(): void {
    if (this.deleteStep() >= 2) { this.closeModal('deleteCardModal'); return; }
    this.deleteStep.set(this.deleteStep() + 1);
  }

  moveFocus(el: any): void {
    if (el.value.length === 1 && el.nextElementSibling) {
      (el.nextElementSibling as HTMLInputElement).focus();
    }
  }
}