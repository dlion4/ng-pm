import { Component, signal, WritableSignal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

// ─── Existing Interfaces ──────────────────────────────────────────────────────

export interface PhysicalCard {
  id: string;
  tier: 'standard' | 'premium' | 'business';
  last4: string;
  type: string;
  status: 'active' | 'needs_pin' | 'in_transit' | 'frozen';
  holderName: string;
  wallet: string;
  expiryDate: string;
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

export interface MerchantCategory {
  code: string;
  name: string;
}

export interface HealthItem {
  label: string;
  score: number;
  status: 'pass' | 'warn';
}

// ─── NEW Interfaces ───────────────────────────────────────────────────────────

export interface HeroButton {
  label: string;
  modal: string;
  style?: string;
}

export interface HeroBreakdown {
  label: string;
  value: string;
}

export interface HeroStat {
  id: number;
  colClass: string;
  isAccent?: boolean;
  cardStyle?: string;
  accentStatus?: string;
  accentDotColor?: string;
  balance?: string;
  walletInfo?: string;
  miniCard?: { last4: string; holderName: string; brand: string };
  label?: string;
  labelColor?: string;
  value?: string;
  badgeClass?: string;
  badgeIcon?: string;
  badgeText?: string;
  breakdowns?: HeroBreakdown[];
  pct?: number;
  progressColor?: string;
  infoLines?: string[];
  buttons?: HeroButton[];
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

export interface PortfolioCard {
  tier: 'standard' | 'premium' | 'business';
  last4: string;
  typeLabel: string;
  statusLabel: string;
  statusClass: string;
  walletInfo: string;
  btnLabel: string;
  btnModal: string;
  filterStyle?: string;
}

export interface QuickAction {
  iconClass: string;
  iconColorClass?: string;
  iconColorStyle?: string;
  label: string;
  modalId: string;
}

export interface CardDesign {
  tier: 'standard' | 'premium' | 'business';
  cssClass: string;
  logo: string;
  name: string;
  price: string;
}

export interface ToggleItem {
  label: string;
  desc: string;
  toggleKey: string;
}

export interface LimitItem {
  id: number;
  label: string;
  value: string;
  pct: number | null;
  progressColor?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-physical-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './physical-cards.html',
  styleUrls: ['./physical-cards.css'],
  encapsulation: ViewEncapsulation.None
})
export class PhysicalCardsComponent {

  // ─── Modal & Toast State ──────────────────────────────────────────────────
  activeModal = signal<string>('');
  toastVisible = signal<boolean>(false);
  toastMsg = signal<string>('');

  // ─── Existing Signals ─────────────────────────────────────────────────────
  onlineTxn = signal<boolean>(true);
  internationalSpend = signal<boolean>(false);
  atmWithdrawals = signal<boolean>(true);
  contactlessEnabled = signal<boolean>(true);

  cards = signal<PhysicalCard[]>([
    { id: 'c1', tier: 'standard', last4: '8422', type: 'Personal Standard Debit', status: 'active', holderName: 'JAMES KAMAU', wallet: 'Primary PayMo Wallet', expiryDate: '12/2026' },
    { id: 'c2', tier: 'business', last4: '1102', type: 'SME Business Debit', status: 'needs_pin', holderName: 'JAMES KAMAU', wallet: 'Biz Wallet', expiryDate: '03/2027' },
    { id: 'c3', tier: 'premium', last4: '5591', type: 'Premium Travel Debit', status: 'in_transit', holderName: 'JAMES KAMAU', wallet: 'Primary PayMo Wallet', expiryDate: '12/2028' },
    { id: 'c4', tier: 'standard', last4: '9421', type: 'Legacy Debit Card', status: 'frozen', holderName: 'JAMES KAMAU', wallet: 'Primary PayMo Wallet', expiryDate: '08/2024' },
  ]);

  healthItems = signal<HealthItem[]>([
    { label: 'Online Transactions', score: 20, status: 'pass' },
    { label: 'ATM Access', score: 20, status: 'pass' },
    { label: 'Contactless Enabled', score: 20, status: 'pass' },
    { label: 'International Blocked', score: 14, status: 'pass' },
    { label: 'Geo-fencing Active (Kenya Only)', score: 10, status: 'pass' },
    { label: 'No Compromised Cards', score: 5, status: 'pass' },
    { label: 'PIN Set (All Active Cards)', score: 5, status: 'pass' },
  ]);

  merchantCategories = signal<MerchantCategory[]>([
    { code: '6011', name: 'ATM / Cash Withdrawals' },
    { code: '5999', name: 'Lottery / Gambling' },
    { code: '5967', name: 'Direct Marketing' },
    { code: '7995', name: 'Gambling Transactions' },
    { code: '9754', name: 'Crypto / Digital Wallets' },
  ]);

  notifications = signal<CardNotification[]>([
    { id: 1, icon: 'ND', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'Premium Card Dispatched', desc: 'Your premium travel card has been shipped via Fargo Courier.', time: '2 hours ago', read: false },
    { id: 2, icon: 'PA', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', title: 'Business Card Needs PIN', desc: 'Card **** 1102 is activated but needs a PIN to be set.', time: '5 hours ago', read: false },
    { id: 3, icon: 'TX', iconBg: 'var(--pm-danger-soft)', iconColor: 'var(--pm-danger)', title: 'Declined POS Transaction', desc: 'Naivas Supermarket — exceeded daily tap limit.', time: 'Yesterday', read: true },
  ]);

  unreadCount = 2;
  blockedMccs = signal<string[]>(['5999', '7995']);

  // ─── Order Card Signals ───────────────────────────────────────────────────
  orderStep = signal(1);
  selectedTier = signal('standard');
  cardName = signal('JAMES KAMAU');
  linkedAccount = signal('primary');
  enableContactless = signal(true);
  deliveryMethod = signal('standard');
  deliveryAddress = signal('Apt 4B, Kilimani Heights, Argwings Kodhek Rd, Nairobi');
  contactNumber = signal('');
  payFrom = signal('wallet');

  // ─── Freeze Card Signals ──────────────────────────────────────────────────
  freezeCardId = signal('');
  freezeStep = signal(1);

  // ─── Report Lost Signals ──────────────────────────────────────────────────
  lostCardId = signal('');
  lostReason = signal('');
  reportLostStep = signal(1);

  // ─── Cancel Card Signals ──────────────────────────────────────────────────
  cancelCardId = signal('');
  cancelStep = signal(1);

  // ─── Replace Card Signals ─────────────────────────────────────────────────
  replaceCardId = signal('');
  replaceReason = signal('damaged');
  replaceStep = signal(1);

  // ─── Renew Card Signals ───────────────────────────────────────────────────
  renewStep = signal(1);

  // ─── Reset PIN Signals ────────────────────────────────────────────────────
  resetPinStep = signal(1);

  // ─── Bulk Order Signals ───────────────────────────────────────────────────
  bulkStep = signal(1);

  // ─── Travel Mode Signals ──────────────────────────────────────────────────
  travelStep = signal(1);

  // ─── Geo-Fencing Signals ──────────────────────────────────────────────────
  geoMode = signal('kenya_only');
  geoCountries = signal<string[]>([]);

  // ─── Limit Signals ────────────────────────────────────────────────────────
  dailyPosLimit = signal(100000);
  dailyAtmLimit = signal(40000);
  dailyOnlineLimit = signal(50000);
  contactlessCap = signal(5000);
  monthlyLimit = signal(500000);

  // ══════════════════════════════════════════════════════════════════════════
  // NEW — Extracted Mock Signal Arrays
  // ══════════════════════════════════════════════════════════════════════════

  heroStats = signal<HeroStat[]>([
    {
      id: 1,
      colClass: 'col-lg-5',
      isAccent: true,
      cardStyle: 'min-height:170px;background:var(--pm-gradient-slate)',
      accentStatus: 'Primary Physical Card Active',
      accentDotColor: '#86efac',
      balance: 'KES 145,200.00',
      walletInfo: 'Linked to PayMo Main Wallet. Standard Debit tier.',
      miniCard: { last4: '8422', holderName: 'JAMES KAMAU', brand: 'VISA' },
      buttons: [
        { label: 'View Details', modal: 'viewCardDetailsModal', style: 'background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.22);color:#fff' },
        { label: 'Limits', modal: 'cardLimitsModal', style: 'background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.22);color:#fff' },
        { label: 'Freeze', modal: 'freezeCardModal', style: 'background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.22);color:#fff' },
      ],
    },
    {
      id: 2,
      colClass: 'col-lg-2 col-md-4 col-6',
      cardStyle: 'min-height:170px',
      label: 'THIS MONTH SPEND',
      labelColor: 'var(--pm-primary)',
      value: 'KES 32k',
      badgeClass: 'pm-badge pm-badge-info',
      badgeIcon: 'bi bi-graph-up',
      badgeText: '14 transactions',
      breakdowns: [
        { label: 'POS Tap', value: '65%' },
        { label: 'Online', value: '25%' },
        { label: 'ATM', value: '10%' },
      ],
    },
    {
      id: 3,
      colClass: 'col-lg-2 col-md-4 col-6',
      cardStyle: 'min-height:170px',
      label: 'DAILY LIMIT USAGE',
      labelColor: 'var(--pm-warning)',
      value: '42%',
      badgeClass: 'pm-badge pm-badge-warning',
      badgeIcon: 'bi bi-speedometer2',
      badgeText: 'KES 42k / 100k',
      pct: 42,
      progressColor: 'var(--pm-warning)',
      buttons: [
        { label: 'Adjust Limits', modal: 'cardLimitsModal' },
      ],
    },
    {
      id: 4,
      colClass: 'col-lg-3 col-md-4',
      cardStyle: 'min-height:170px;border-left:3px solid var(--pm-accent)',
      label: 'SECURITY POSTURE',
      labelColor: 'var(--pm-accent)',
      value: '94/100',
      badgeClass: 'pm-badge pm-badge-success',
      badgeIcon: 'bi bi-shield-check',
      badgeText: 'Excellent',
      infoLines: [
        'Geo-fencing: <strong>Active (Kenya Only)</strong>',
        'Contactless: <strong>Capped at KES 5k</strong>',
      ],
      buttons: [
        { label: 'Security Audit', modal: 'cardHealthModal' },
      ],
    },
  ]);

  feedItems = signal<FeedItem[]>([
    { iconText: 'ND', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'Premium Card Dispatched', desc: 'Arriving tomorrow via Fargo Courier', btnLabel: 'Track', btnClass: 'pm-btn pm-btn-sm pm-btn-primary', btnModal: 'cardDeliveryModal' },
    { iconText: 'PA', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', title: 'Business Card Needs PIN', desc: 'Card **** 1102 activated, set PIN to use', btnLabel: 'Set PIN', btnClass: 'pm-btn pm-btn-sm', btnModal: 'pinManagementModal' },
    { iconText: 'TX', iconBg: 'var(--pm-danger-soft)', iconColor: 'var(--pm-danger)', title: 'Declined POS Transaction', desc: 'Naivas Supermarket \u00b7 Exceeded daily tap limit', btnLabel: 'Fix', btnClass: 'pm-btn pm-btn-sm', btnModal: 'cardLimitsModal' },
    { iconText: 'RN', iconBg: 'var(--pm-purple-soft)', iconColor: 'var(--pm-purple)', title: 'Card Expiring Soon', desc: 'Card **** 9421 expires in 45 days', btnLabel: 'Renew', btnClass: 'pm-btn pm-btn-sm', btnModal: 'renewCardModal' },
  ]);

  portfolioCards = signal<PortfolioCard[]>([
    { tier: 'standard', last4: '8422', typeLabel: 'Personal Standard Debit', statusLabel: 'Active \u00b7 KES 145.2k available', statusClass: '', walletInfo: '', btnLabel: 'View', btnModal: 'viewCardDetailsModal' },
    { tier: 'business', last4: '1102', typeLabel: 'SME Business Debit', statusLabel: '<span class="text-warning">Needs PIN</span> \u00b7 Linked to Biz Wallet', statusClass: '', walletInfo: '', btnLabel: 'PIN', btnModal: 'pinManagementModal' },
    { tier: 'premium', last4: '5591', typeLabel: 'Premium Travel Debit', statusLabel: '<span class="text-info">In transit</span> \u00b7 Ordered 26 Jun', statusClass: '', walletInfo: '', btnLabel: 'Track', btnModal: 'cardDeliveryModal' },
    { tier: 'standard', last4: '9421', typeLabel: 'Legacy Debit Card', statusLabel: '<span class="text-danger">Frozen</span> \u00b7 Reported compromised', statusClass: '', walletInfo: '', btnLabel: 'Replace', btnModal: 'replaceCardModal', filterStyle: 'grayscale(1)' },
  ]);

  quickActions = signal<QuickAction[]>([
    { iconClass: 'bi bi-upc-scan', iconColorClass: 'text-primary', label: 'Activate Card', modalId: 'activateCardModal' },
    { iconClass: 'bi bi-asterisk', iconColorClass: 'text-warning', label: 'PIN Settings', modalId: 'pinManagementModal' },
    { iconClass: 'bi bi-speedometer', iconColorClass: 'text-info', label: 'Card Limits', modalId: 'cardLimitsModal' },
    { iconClass: 'bi bi-globe-americas', iconColorClass: 'text-success', label: 'Geo-Fencing', modalId: 'geoFencingModal' },
    { iconClass: 'bi bi-shop', iconColorStyle: 'color:var(--pm-purple)', label: 'MCC Blocks', modalId: 'merchantControlsModal' },
    { iconClass: 'bi bi-snow', iconColorClass: 'text-primary', label: 'Freeze/Thaw', modalId: 'freezeCardModal' },
    { iconClass: 'bi bi-shield-exclamation', iconColorClass: 'text-danger', label: 'Report Lost', modalId: 'reportLostModal' },
    { iconClass: 'bi bi-x-circle', iconColorClass: 'text-muted', label: 'Cancel Card', modalId: 'cancelCardModal' },
  ]);

  cardDesigns = signal<CardDesign[]>([
    { tier: 'standard', cssClass: 'pm-dc-standard', logo: 'PayMo', name: 'Standard', price: 'Free' },
    { tier: 'premium', cssClass: 'pm-dc-premium', logo: 'PayMo', name: 'Premium', price: 'KES 1,000' },
    { tier: 'business', cssClass: 'pm-dc-business', logo: 'PayMo Biz', name: 'Business', price: 'Free for SMEs' },
  ]);

  toggleItems = signal<ToggleItem[]>([
    { label: 'Online Transactions', desc: 'E-commerce & web', toggleKey: 'online' },
    { label: 'International Spend', desc: 'Outside Kenya', toggleKey: 'international' },
    { label: 'ATM Withdrawals', desc: 'Cash access', toggleKey: 'atm' },
    { label: 'Contactless (Tap-to-pay)', desc: 'NFC payments', toggleKey: 'contactless' },
  ]);

  limitItems = signal<LimitItem[]>([
    { id: 1, label: 'Daily POS Limit', value: 'KES 42k / 100k', pct: 42, progressColor: 'var(--pm-primary)' },
    { id: 2, label: 'Daily ATM Limit', value: 'KES 0 / 40k', pct: 0, progressColor: 'var(--pm-info)' },
    { id: 3, label: 'Contactless Cap', value: 'Max KES 5,000/tap', pct: null },
  ]);

  // ─── Existing Methods ─────────────────────────────────────────────────────

  openModal(id: string): void {
    this.activeModal.set(id);
  }

  closeModal(id: string): void {
    if (this.activeModal() === id) {
      this.activeModal.set('');
    }
  }

  showToast(msg: string, modalId?: string): void {
    this.toastMsg.set(msg);
    this.toastVisible.set(true);
    setTimeout(() => this.toastVisible.set(false), 3000);
    if (modalId) {
      this.closeModal(modalId);
    }
  }

  handleToggle(type: string): void {
    this.openModal('toggleConfirmModal');
  }

  cancelToggle(): void {
    this.closeModal('toggleConfirmModal');
  }

  confirmToggle(): void {
    const map: Record<string, WritableSignal<boolean>> = {
      online: this.onlineTxn,
      international: this.internationalSpend,
      atm: this.atmWithdrawals,
      contactless: this.contactlessEnabled,
    };
    // The actual toggle is a placeholder — modal confirms the intent
    this.closeModal('toggleConfirmModal');
  }

  selectCardTier(tier: string): void {
    this.selectedTier.set(tier);
  }

  nextOrderStep(): void {
    if (this.orderStep() < 4) {
      this.orderStep.set(this.orderStep() + 1);
    } else {
      this.showToast('Card order placed successfully!', 'orderCardModal');
      this.orderStep.set(1);
    }
  }

  prevOrderStep(): void {
    if (this.orderStep() > 1) {
      this.orderStep.set(this.orderStep() - 1);
    }
  }

  moveFocus(el: any): void {
    if (el.value.length === 1 && el.nextElementSibling) {
      (el.nextElementSibling as HTMLInputElement).focus();
    }
  }

  nextResetPinStep(): void {
    if (this.resetPinStep() < 2) {
      this.resetPinStep.set(this.resetPinStep() + 1);
    } else {
      this.showToast('PIN reset successfully.', 'resetPinModal');
      this.resetPinStep.set(1);
    }
  }

  saveLimits(): void {
    this.showToast('Card limits updated successfully.', 'cardLimitsModal');
  }

  saveGeoFencing(): void {
    this.showToast('Geo-fencing settings saved.', 'geoFencingModal');
  }

  toggleMcc(code: string): void {
    const current = this.blockedMccs();
    if (current.includes(code)) {
      this.blockedMccs.set(current.filter(c => c !== code));
    } else {
      this.blockedMccs.set([...current, code]);
    }
  }

  saveMerchantControls(): void {
    this.showToast('Merchant category blocks saved.', 'merchantControlsModal');
  }

  nextFreezeStep(): void {
    if (this.freezeStep() < 2) {
      this.freezeStep.set(this.freezeStep() + 1);
    } else {
      this.showToast('Card frozen successfully.', 'freezeCardModal');
      this.freezeStep.set(1);
    }
  }

  nextReportLostStep(): void {
    if (this.reportLostStep() < 3) {
      this.reportLostStep.set(this.reportLostStep() + 1);
    } else {
      this.showToast('Card reported as lost. Replacement will be issued.', 'reportLostModal');
      this.reportLostStep.set(1);
    }
  }

  nextCancelStep(): void {
    if (this.cancelStep() < 3) {
      this.cancelStep.set(this.cancelStep() + 1);
    } else {
      this.showToast('Card permanently cancelled.', 'cancelCardModal');
      this.cancelStep.set(1);
    }
  }

  nextReplaceStep(): void {
    if (this.replaceStep() < 3) {
      this.replaceStep.set(this.replaceStep() + 1);
    } else {
      this.showToast('Replacement card ordered.', 'replaceCardModal');
      this.replaceStep.set(1);
    }
  }

  nextRenewStep(): void {
    if (this.renewStep() < 2) {
      this.renewStep.set(this.renewStep() + 1);
    } else {
      this.showToast('Card renewal initiated.', 'renewCardModal');
      this.renewStep.set(1);
    }
  }

  markAllRead(): void {
    this.notifications.set(this.notifications().map(n => ({ ...n, read: true })));
    this.unreadCount = 0;
  }

  nextBulkStep(): void {
    if (this.bulkStep() < 3) {
      this.bulkStep.set(this.bulkStep() + 1);
    } else {
      this.showToast('Bulk card order submitted.', 'bulkOrderModal');
      this.bulkStep.set(1);
    }
  }

  nextTravelStep(): void {
    if (this.travelStep() < 2) {
      this.travelStep.set(this.travelStep() + 1);
    } else {
      this.showToast('Travel mode activated.', 'travelModeModal');
      this.travelStep.set(1);
    }
  }

  getTierClass(tier: string): string {
    return 'pm-debit-card ' + (tier === 'premium' ? 'pm-dc-premium' : tier === 'business' ? 'pm-dc-business' : 'pm-dc-standard');
  }

  getStatusBadge(status: string): { label: string; class: string } {
    const map: Record<string, { label: string; class: string }> = {
      active: { label: 'Active', class: 'pm-badge pm-badge-success' },
      frozen: { label: 'Frozen', class: 'pm-badge pm-badge-danger' },
      needs_pin: { label: 'Needs PIN', class: 'pm-badge pm-badge-warning' },
      in_transit: { label: 'In Transit', class: 'pm-badge pm-badge-info' },
      expired: { label: 'Expired', class: 'pm-badge pm-badge-secondary' },
    };
    return map[status] || { label: status, class: 'pm-badge' };
  }

  // ─── NEW Helper Methods ───────────────────────────────────────────────────

  getToggleValue(key: string): boolean {
    const map: Record<string, WritableSignal<boolean>> = {
      online: this.onlineTxn,
      international: this.internationalSpend,
      atm: this.atmWithdrawals,
      contactless: this.contactlessEnabled,
    };
    return map[key]?.() ?? false;
  }
}