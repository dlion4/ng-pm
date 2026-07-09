import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal'; // Swapped to ngx-bootstrap

/* ─── Models ────────────────────────────────────────────────────────── */

export interface Wallet {
  currency: string;
  name: string;
  balance: string;
  kesEquivalent: string;
  change24h: string;
  changePositive: boolean;
  status: 'active' | 'low';
}

export interface FxRate {
  pair: string;
  buy: number;
  sell: number;
  spread: number;
  change24h: string;
  changePositive: boolean;
}

export interface FxTransaction {
  date: string;
  type: string;
  details: string;
  amount: string;
  rate: string;
  fee: string;
  status: string;
}

export interface ForwardContract {
  id: string;
  pair: string;
  amount: string;
  rate: number;
  expiry: string;
  status: 'Active' | 'Settled';
}

export interface AttentionItem {
  icon: string; iconBg: string; iconColor: string;
  title: string; subtitle: string;
  actionLabel: string; actionModal: string; actionStyle?: string;
}

export interface Suggestion {
  icon: string; iconBg: string; iconColor: string;
  title: string; subtitle: string;
  actionLabel: string; actionModal: string;
}

export interface QuickAction {
  icon: string; iconColor: string; customColor?: string;
  label: string; modal: string;
}

export interface RateAlert {
  pair: string; condition: string; threshold: number;
  current: number; trigger: number; status: 'Active' | 'Paused';
}

export interface NotificationItem {
  title: string; subtitle: string;
  bgClass: string; textClass: string;
}

export interface FxExposure {
  currency: string; position: string; exposure: string; var: string;
}

export interface FxCostMonth {
  month: string; volume: string; fees: string; spread: string;
}

export interface AutoRule {
  name: string; description: string; status: 'Active' | 'Paused';
}

export interface AlertSetting {
  pair: string; condition: string; channels: string; status: 'Active' | 'Paused';
}

export interface FxActivity {
  date: string; type: string; details: string;
  amount: string; rate: string; fee: string; status: string;
}

export interface HealthStat {
  value: string; label: string; bg: string; color: string; textColor: string; size: string;
}

export interface MarketDepthRow {
  bid: number; bidAmount: string; ask: number; askAmount: string;
}

export interface BulkFxRow {
  from: string; to: string; amount: number; estReceived: string;
}

export interface FxAnalyticsTab {
  id: string; label: string;
}

export interface FxAutomationTab {
  id: string; label: string;
}

export interface RateAlertTab {
  id: string; label: string;
}

/* ─── Component ─────────────────────────────────────────────────────── */

@Component({
  selector: 'app-fx-multi-currency',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalModule],
  templateUrl: './multi-currency-fx.html',
  styleUrls: ['./multi-currency-fx.css'],
  encapsulation: ViewEncapsulation.None
})
export class FxMultiCurrencyComponent implements OnInit {

  /* ─── Modal refs ─────────────────────────────────────────────────── */
  private modalRefs: Map<string, any> = new Map();

  /* ─── Stepper states ─────────────────────────────────────────────── */
  convStepCurrent = 1; convStepTotal = 4; convStepLabels = ['Wallets', 'Amount', 'Confirm', 'Done'];
  convStepLoading = false;

  hedgeStepCurrent = 1; hedgeStepTotal = 3; hedgeStepLabels = ['Details', 'Rate', 'Done'];
  hedgeStepLoading = false;

  fxTransStepCurrent = 1; fxTransStepTotal = 3; fxTransStepLabels = ['Details', 'Review', 'Done'];
  fxTransStepLoading = false;

  /* ─── Tab states ──────────────────────────────────────────────────── */
  rateAlertsTab = 'active';
  fxAnalyticsTab = 'perf';
  fxAutomationTab = 'rules';

  /* ─── Loading / Action Result ──────────────────────────────────────── */
  modalActionLoading = false;
  actionResult = { show: false, message: '', ref: '' };

  /* ─── Hero Stats ─────────────────────────────────────────────────── */
  heroStats = {
    totalEquivalent: 'KES 124.8M',
    currencies: 9, wallets: 14,
    fxVolume: 'KES 18.4M', volumeChange: 31,
    bestRate: '1 USD = 129.45 KES',
    usdEur: '0.92', usdEurPositive: true,
    usdGbp: '0.78', usdGbpPositive: false,
    savings: 'KES 312,400',
    rateOpt: 'KES 187,200', forwardSavings: 'KES 125,200'
  };

  /* ─── Attention Items ────────────────────────────────────────────── */
  attentionItems: AttentionItem[] = [
    {
      icon: 'bi-currency-exchange', iconBg: 'var(--pm-danger-soft)', iconColor: 'var(--pm-danger)',
      title: 'USD forward contract expiring', subtitle: 'Contract FX-8821 • 30 Jun',
      actionLabel: 'Roll', actionModal: 'hedgeModal'
    },
    {
      icon: 'bi-exclamation-triangle', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)',
      title: 'EUR balance below threshold', subtitle: '€2,180 • Auto-top-up failed',
      actionLabel: 'Top-up', actionModal: 'convertModal'
    },
    {
      icon: 'bi-globe', iconBg: 'var(--pm-purple-soft)', iconColor: 'var(--pm-purple)',
      title: 'NGN rate moved 4.2%', subtitle: 'Alert triggered • 1 NGN = 0.084 KES',
      actionLabel: 'View', actionModal: 'rateAlertsModal'
    }
  ];

  /* ─── Suggestions ──────────────────────────────────────────────────── */
  suggestions: Suggestion[] = [
    {
      icon: 'bi-arrow-left-right', iconBg: 'var(--pm-accent-soft)', iconColor: 'var(--pm-accent)',
      title: 'Convert USD → EUR now', subtitle: 'Rate 0.92 is 2.1% above 30-day avg',
      actionLabel: 'Convert', actionModal: 'convertModal'
    },
    {
      icon: 'bi-shield-check', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)',
      title: 'Lock USD/ZAR forward for July', subtitle: 'Expected volatility from elections',
      actionLabel: 'Hedge', actionModal: 'hedgeModal'
    },
    {
      icon: 'bi-wallet2', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)',
      title: 'Open ZAR wallet for SA suppliers', subtitle: 'Save 1.8% on FX fees monthly',
      actionLabel: 'Create', actionModal: 'newWalletModal'
    }
  ];

/* ─── Quick Actions Config Array ────────────────────────────────────── */
quickActions: QuickAction[] = [
  { icon: 'bi-arrow-left-right', iconColor: 'text-primary', label: 'Instant Convert', modal: 'convertModal' },
  { icon: 'bi-shield-check', iconColor: 'text-success', label: 'Forward Contract', modal: 'hedgeModal' },
  { icon: 'bi-collection', iconColor: 'text-secondary', customColor: 'text-secondary', label: 'Bulk FX', modal: 'bulkFxModal' }, // Fixed missing iconColor
  { icon: 'bi-bell', iconColor: 'text-warning', label: 'Rate Alerts', modal: 'rateAlertsModal' },
  { icon: 'bi-send', iconColor: 'text-info', label: 'Cross-Border', modal: 'fxTransferModal' },
  { icon: 'bi-download', iconColor: 'text-primary', customColor: 'text-primary', label: 'FX Report', modal: 'fxStatementModal' }, // Fixed missing iconColor
  { icon: 'bi-shuffle', iconColor: 'text-danger', label: 'Currency Swap', modal: 'swapModal' },
  { icon: 'bi-bar-chart-line', iconColor: 'text-info', customColor: 'text-info', label: 'Analytics', modal: 'fxAnalyticsModal' } // Fixed missing iconColor
];

  /* ─── Wallets / Portfolio ────────────────────────────────────────── */
  wallets: Wallet[] = [
    { currency: 'USD', name: 'USD Wallet', balance: '48,200.00', kesEquivalent: 'KES 6,240,900', change24h: '+0.42%', changePositive: true, status: 'active' },
    { currency: 'EUR', name: 'EUR Wallet', balance: '18,400.00', kesEquivalent: 'KES 2,572,320', change24h: '-0.18%', changePositive: false, status: 'low' },
    { currency: 'GBP', name: 'GBP Wallet', balance: '9,100.00', kesEquivalent: 'KES 1,512,420', change24h: '+0.65%', changePositive: true, status: 'active' },
    { currency: 'ZAR', name: 'ZAR Wallet', balance: '2,140,000', kesEquivalent: 'KES 15,250,800', change24h: '-1.12%', changePositive: false, status: 'active' },
    { currency: 'UGX', name: 'UGX Wallet', balance: '68,200,000', kesEquivalent: 'KES 2,373,360', change24h: '+0.29%', changePositive: true, status: 'active' }
  ];

  /* ─── FX Rates ─────────────────────────────────────────────────────── */
  fxRates: FxRate[] = [
    { pair: 'USD/KES', buy: 129.35, sell: 129.85, spread: 0.50, change24h: '+0.42%', changePositive: true },
    { pair: 'EUR/KES', buy: 139.10, sell: 139.80, spread: 0.70, change24h: '-0.18%', changePositive: false },
    { pair: 'GBP/KES', buy: 165.40, sell: 166.20, spread: 0.80, change24h: '+0.65%', changePositive: true },
    { pair: 'ZAR/KES', buy: 7.12, sell: 7.22, spread: 0.10, change24h: '-1.12%', changePositive: false },
    { pair: 'UGX/KES', buy: 0.0348, sell: 0.0354, spread: 0.0006, change24h: '+0.29%', changePositive: true }
  ];

  /* ─── Rate Alerts ──────────────────────────────────────────────────── */
  rateAlerts: RateAlert[] = [
    { pair: 'USD/KES', condition: 'Rate above', threshold: 130.50, current: 129.85, trigger: 130.00, status: 'Active' },
    { pair: 'EUR/KES', condition: 'Rate below', threshold: 138.50, current: 139.80, trigger: 138.50, status: 'Paused' },
    { pair: 'GBP/KES', condition: 'Rate above', threshold: 167.00, current: 166.20, trigger: 167.00, status: 'Active' }
  ];

  /* ─── FX Transactions ────────────────────────────────────────────── */
  fxTransactions: FxTransaction[] = [
    { date: '27 Jun', type: 'Conversion', details: 'USD → KES', amount: 'KES 6,472,500', rate: '129.45', fee: 'KES 3,200', status: 'Completed' },
    { date: '26 Jun', type: 'Forward Settlement', details: 'EUR Forward FX-8799', amount: 'USD 13,104', rate: '1.092', fee: 'USD 26', status: 'Completed' },
    { date: '25 Jun', type: 'Transfer', details: 'KES → ZAR Wallet', amount: 'ZAR 281,690', rate: '0.1408', fee: 'KES 1,800', status: 'Pending' }
  ];

  /* ─── Forward Contracts ────────────────────────────────────────────── */
  forwardContracts: ForwardContract[] = [
    { id: 'FX-8821', pair: 'USD Forward', amount: '50,000 USD', rate: 130.00, expiry: '30 Jun', status: 'Active' },
    { id: 'FX-8799', pair: 'EUR Forward', amount: '€25,000', rate: 139.50, expiry: '15 Jul', status: 'Active' },
    { id: 'FX-8754', pair: 'GBP Forward', amount: '£10,000', rate: 166.80, expiry: 'Expired', status: 'Settled' }
  ];

  /* ─── FX Exposure ────────────────────────────────────────────────── */
  fxExposures = [
    { currency: 'USD', position: 'Long +$82,400', exposure: 'KES 82.4M', var: 'KES 1.2M', width: 68, color: 'var(--pm-accent)' },
    { currency: 'EUR', position: 'Short -€14,200', exposure: 'KES 18.9M', var: 'KES 0.8M', width: 32, color: 'var(--pm-danger)' },
    { currency: 'GBP', position: 'Long +£6,800', exposure: 'KES 6.8M', var: 'KES 0.4M', width: 55, color: 'var(--pm-info)' }
  ];

  /* ─── FX Analytics ───────────────────────────────────────────────── */
  fxCostMonths: FxCostMonth[] = [
    { month: 'Jan', volume: 'KES 98M', fees: 'KES 312K', spread: '0.52%' },
    { month: 'Feb', volume: 'KES 112M', fees: 'KES 298K', spread: '0.50%' },
    { month: 'Mar', volume: 'KES 104M', fees: 'KES 289K', spread: '0.51%' },
    { month: 'Apr', volume: 'KES 128M', fees: 'KES 356K', spread: '0.53%' },
    { month: 'May', volume: 'KES 98M', fees: 'KES 289K', spread: '0.51%' },
    { month: 'Jun', volume: 'KES 125M', fees: 'KES 312K', spread: '0.48%' }
  ];

  chartBars = [
    { month: 'Jan', height: 65, color: 'var(--pm-primary)' },
    { month: 'Feb', height: 72, color: 'var(--pm-primary)' },
    { month: 'Mar', height: 58, color: 'var(--pm-primary)' },
    { month: 'Apr', height: 81, color: 'var(--pm-warning)' },
    { month: 'May', height: 67, color: 'var(--pm-primary)' },
    { month: 'Jun', height: 49, color: 'var(--pm-accent)' }
  ];

  /* ─── Auto Rules ──────────────────────────────────────────────────── */
  autoRules: AutoRule[] = [
    { name: 'USD → KES', description: 'When balance > $10,000', status: 'Active' },
    { name: 'EUR → KES', description: 'Daily at 09:00 EAT', status: 'Active' },
    { name: 'GBP → USD', description: 'When rate > 1.28', status: 'Paused' }
  ];

  alertSettings: AlertSetting[] = [
    { pair: 'USD/KES > 130.50', condition: 'Rate above', channels: 'SMS + Push', status: 'Active' },
    { pair: 'EUR/KES < 138.00', condition: 'Rate below', channels: 'Push', status: 'Active' },
    { pair: 'GBP/KES volatility > 2%', condition: 'Volatility', channels: 'Email', status: 'Active' }
  ];

  walletPrefs = [
    { label: 'Default display currency', value: 'KES' },
    { label: 'Show equivalent in', value: 'USD' },
    { label: 'Auto-hide small balances', value: 'On' }
  ];

  /* ─── FX Activity (Recent) ───────────────────────────────────────── */
  fxActivities: FxActivity[] = [
    { date: '27 Jun', type: 'Conversion', details: 'USD → KES', amount: 'KES 6,472,500', rate: '129.45', fee: 'KES 3,200', status: 'Completed' },
    { date: '26 Jun', type: 'Forward Settlement', details: 'EUR Forward FX-8799', amount: 'USD 13,104', rate: '1.092', fee: 'USD 26', status: 'Completed' },
    { date: '25 Jun', type: 'Transfer', details: 'KES → ZAR Wallet', amount: 'ZAR 281,690', rate: '0.1408', fee: 'KES 1,800', status: 'Pending' }
  ];

  /* ─── Health Stats ───────────────────────────────────────────────── */
  healthStats: HealthStat[] = [
    { value: '87', label: 'HEALTH SCORE', bg: 'var(--pm-accent-soft)', color: 'var(--pm-accent)', textColor: '#047857', size: '28px' },
    { value: '9/14', label: 'WALLETS HEALTHY', bg: 'var(--pm-info-soft)', color: 'var(--pm-info)', textColor: '#1D4ED8', size: '24px' },
    { value: '3', label: 'NEED ACTION', bg: 'var(--pm-warning-soft)', color: 'var(--pm-warning)', textColor: '#B45309', size: '24px' },
    { value: '5', label: 'AUTO RULES', bg: 'var(--pm-purple-soft)', color: 'var(--pm-purple)', textColor: '#6D28D9', size: '24px' }
  ];

  /* ─── Notifications ──────────────────────────────────────────────── */
  notifications: NotificationItem[] = [
    { title: 'USD forward expiring', subtitle: 'Contract FX-8821 • 30 Jun', bgClass: 'var(--pm-danger-soft)', textClass: '#7F1D1D' },
    { title: 'EUR balance low', subtitle: '€2,180 remaining', bgClass: 'var(--pm-warning-soft)', textClass: '#92400E' },
    { title: 'Rate alert triggered', subtitle: 'USD/KES > 130.00', bgClass: 'var(--pm-info-soft)', textClass: '#1E40AF' },
    { title: 'Auto-conversion executed', subtitle: 'USD 10,000 → KES 1,294,500', bgClass: 'var(--pm-accent-soft)', textClass: '#065F46' }
  ];

  /* ─── Market Depth ─────────────────────────────────────────────────── */
  marketDepth: MarketDepthRow[] = [
    { bid: 129.35, bidAmount: 'USD 250,000', ask: 129.85, askAmount: 'USD 180,000' },
    { bid: 129.30, bidAmount: 'USD 420,000', ask: 129.90, askAmount: 'USD 310,000' }
  ];

  /* ─── Bulk FX ──────────────────────────────────────────────────────── */
  bulkFxRows: BulkFxRow[] = [
    { from: 'USD', to: 'KES', amount: 25000, estReceived: 'KES 3,236,250' },
    { from: 'EUR', to: 'KES', amount: 12000, estReceived: 'KES 1,677,600' },
    { from: 'GBP', to: 'KES', amount: 8000, estReceived: 'KES 1,329,600' }
  ];

  /* ─── Convert Form ─────────────────────────────────────────────────── */
  convertForm = {
    fromWallet: 'USD Wallet (48,200.00)',
    toWallet: 'KES Wallet (124,800,000)',
    amount: 5000,
    liveRate: '1 USD = 129.45 KES',
    spread: '0.50',
    willReceive: 'KES 647,250',
    pin: ['', '', '', ''],
    receipt: { ref: 'FX-20250627-9912', completed: '27 Jun 2025, 14:41 EAT' }
  };

  /* ─── Hedge Form ──────────────────────────────────────────────────── */
  hedgeForm = {
    pair: 'USD/KES', amount: 50000, contractType: 'Forward (Fixed Rate)',
    expiry: '2025-09-30', indicativeRate: 130.20, margin: 'KES 326,000',
    settlementDate: '30 Sep 2025', acceptTerms: true,
    receipt: { ref: 'FX-8892', rate: 130.20, amount: '50,000 USD' }
  };

  /* ─── New Wallet Form ──────────────────────────────────────────────── */
  newWalletForm = {
    currency: 'USD — United States Dollar',
    nickname: 'Business USD',
    initialFunding: 10000,
    rateAlerts: true,
    autoConvert: false
  };

  /* ─── Rate Alert Create Form ──────────────────────────────────────── */
  newAlertForm = {
    pair: 'USD/KES', condition: 'Rate above', threshold: 130.50,
    push: true, sms: true
  };

  /* ─── FX Transfer Form ─────────────────────────────────────────────── */
  fxTransferForm = {
    fromWallet: 'USD Wallet (48,200)',
    toWallet: 'ZAR Wallet (Own)',
    amount: 10000,
    purpose: 'Supplier Payment',
    transferAmount: 'USD 10,000',
    fxRate: '18.42 ZAR per USD',
    fee: 'USD 25',
    recipientGets: 'ZAR 184,175',
    receiptRef: 'FXTR-20250627-8821'
  };

  /* ─── Swap Form ────────────────────────────────────────────────────── */
  swapForm = {
    from: 'USD Wallet', to: 'EUR Wallet', amount: 10000, estReceived: 'EUR 9,200'
  };

  /* ─── Statement Form ───────────────────────────────────────────────── */
  statementForm = {
    reportType: 'Full FX Activity',
    dateFrom: '2025-01-01', dateTo: '2025-06-27',
    format: 'PDF'
  };

  /* ─── Profile ──────────────────────────────────────────────────────── */
  profile = {
    initials: 'JK', name: 'James Kamau',
    email: 'james.kamau@email.com', phone: '+254 712 345 890',
    fxWallets: '14 active', fxScore: '87/100',
    memberSince: 'Mar 2022', forwardContracts: '5 active'
  };

  /* ─── Attention Full Items ─────────────────────────────────────────── */
  attentionFullItems = [
    { title: 'USD forward FX-8821 expiring 30 Jun', actionLabel: 'Roll', actionModal: 'hedgeModal' },
    { title: 'EUR balance below threshold', actionLabel: 'Top-up', actionModal: 'convertModal' },
    { title: 'NGN rate alert triggered', actionLabel: 'View', actionModal: 'rateAlertsModal' }
  ];

  /* ─── Rate Alert History ──────────────────────────────────────────── */
  alertHistory = [
    { alert: 'USD/KES > 130.00', triggered: '25 Jun 09:12', rate: '130.12', actionLabel: 'Convert' },
    { alert: 'EUR/KES < 139.00', triggered: '22 Jun 14:45', rate: '138.85', actionLabel: 'Hedge' }
  ];

  /* ─── Auto History ─────────────────────────────────────────────────── */
  autoHistory = [
    { rule: 'USD → KES', lastRun: '27 Jun 09:00', result: 'KES 1,294,500' }
  ];

  /* ─── Health Issues ────────────────────────────────────────────────── */
  healthIssues = [
    { wallet: 'EUR Wallet', status: 'Low', issue: 'Below threshold', actionLabel: 'Top-up', actionModal: 'convertModal' },
    { wallet: 'USD Forward', status: 'Expiring', issue: '30 Jun 2025', actionLabel: 'Roll', actionModal: 'hedgeModal' }
  ];

  constructor(private modalService: BsModalService) { }

  ngOnInit(): void { }

  /* ─── Modal Open/Close ─────────────────────────────────────────────── */
  openModal(content: any): void {
    // 1. Determine the appropriate Bootstrap modal size class based on your view criteria
    const modalSizeClass = 
      content.id?.includes('fxAnalytics') || content.id?.includes('auditTrail') 
        ? 'modal-xl' :
      content.id?.includes('convert') || content.id?.includes('hedge') || content.id?.includes('fxTransfer') ||
      content.id?.includes('bulkFx') || content.id?.includes('rateAlerts') || content.id?.includes('fxHealth') ||
      content.id?.includes('fxRisk') || content.id?.includes('fxAutomation') || content.id?.includes('fxMarket') 
        ? 'modal-lg' : 'modal-md';

    // 2. Open the modal using the correct ngx-bootstrap service configuration
    const ref = this.modalService.show(content, {
      ignoreBackdropClick: true, // This is the ngx-bootstrap equivalent of backdrop: 'static'
      keyboard: true,
      animated: true,
      class: `modal-dialog-centered ${modalSizeClass}` // Combines layout positioning and sizing strings
    });

    // 3. Keep tracking the reference within your local tracking Map
    if (content.id) {
      this.modalRefs.set(content.id, ref);
    }
  }

  closeAllModals(): void {
    // Forcefully loop backwards to clear out all stacked active structural layouts safely
    const openModalsCount = this.modalService.getModalsCount();
    for (let i = openModalsCount; i >= 1; i--) {
      this.modalService.hide(i);
    }
    
    // Wipe your local layout memory mapping tracking cache clean
    this.modalRefs.clear();
  }

  /* ─── Stepper Helpers ────────────────────────────────────────────── */
  getStepClass(flow: string, step: number): string {
    const current = flow === 'conv' ? this.convStepCurrent : flow === 'hedge' ? this.hedgeStepCurrent : this.fxTransStepCurrent;
    if (step < current) return 'done';
    if (step === current) return 'active';
    return '';
  }

  getStepNumber(flow: string, step: number): string {
    const current = flow === 'conv' ? this.convStepCurrent : flow === 'hedge' ? this.hedgeStepCurrent : this.fxTransStepCurrent;
    return step < current ? '✓' : String(step);
  }

  isStepActive(flow: string, step: number): boolean {
    const current = flow === 'conv' ? this.convStepCurrent : flow === 'hedge' ? this.hedgeStepCurrent : this.fxTransStepCurrent;
    return current === step;
  }

  nextStep(flow: string): void {
    const total = flow === 'conv' ? this.convStepTotal : flow === 'hedge' ? this.hedgeStepTotal : this.fxTransStepTotal;
    let current = flow === 'conv' ? this.convStepCurrent : flow === 'hedge' ? this.hedgeStepCurrent : this.fxTransStepCurrent;
    if (current === total - 1) {
      if (flow === 'conv') this.convStepLoading = true;
      else if (flow === 'hedge') this.hedgeStepLoading = true;
      else this.fxTransStepLoading = true;
      setTimeout(() => {
        if (flow === 'conv') { this.convStepLoading = false; this.convStepCurrent = total; }
        else if (flow === 'hedge') { this.hedgeStepLoading = false; this.hedgeStepCurrent = total; }
        else { this.fxTransStepLoading = false; this.fxTransStepCurrent = total; }
      }, 1500);
      return;
    }
    if (current >= total) { this.closeAllModals(); this.resetAllSteppers(); return; }
    current++;
    if (flow === 'conv') this.convStepCurrent = current;
    else if (flow === 'hedge') this.hedgeStepCurrent = current;
    else this.fxTransStepCurrent = current;
  }

  prevStep(flow: string): void {
    let current = flow === 'conv' ? this.convStepCurrent : flow === 'hedge' ? this.hedgeStepCurrent : this.fxTransStepCurrent;
    if (current > 1) {
      current--;
      if (flow === 'conv') this.convStepCurrent = current;
      else if (flow === 'hedge') this.hedgeStepCurrent = current;
      else this.fxTransStepCurrent = current;
    }
  }

  resetAllSteppers(): void {
    this.convStepCurrent = 1; this.convStepLoading = false;
    this.hedgeStepCurrent = 1; this.hedgeStepLoading = false;
    this.fxTransStepCurrent = 1; this.fxTransStepLoading = false;
  }

  getStepButtonLabel(flow: string): string {
    const current = flow === 'conv' ? this.convStepCurrent : flow === 'hedge' ? this.hedgeStepCurrent : this.fxTransStepCurrent;
    const total = flow === 'conv' ? this.convStepTotal : flow === 'hedge' ? this.hedgeStepTotal : this.fxTransStepTotal;
    if (current === total) return 'Done';
    if (current === total - 1) return flow === 'conv' ? 'Confirm' : 'Confirm';
    return 'Continue';
  }

  /* ─── Tab Helpers ──────────────────────────────────────────────────── */
  setRateAlertsTab(tab: string): void { this.rateAlertsTab = tab; }
  isRateAlertsTab(tab: string): boolean { return this.rateAlertsTab === tab; }

  setFxAnalyticsTab(tab: string): void { this.fxAnalyticsTab = tab; }
  isFxAnalyticsTab(tab: string): boolean { return this.fxAnalyticsTab === tab; }

  setFxAutomationTab(tab: string): void { this.fxAutomationTab = tab; }
  isFxAutomationTab(tab: string): boolean { return this.fxAutomationTab === tab; }

  /* ─── Badge Helpers ────────────────────────────────────────────────── */
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Completed': case 'Active': case 'Submitted': case 'Acknowledged': return 'B-s';
      case 'Pending': case 'Escalated': case 'Under Review': return 'B-w';
      case 'Alert': case 'Investigation': case 'Expiring': return 'B-d';
      default: return 'B-i';
    }
  }

  getTxnActionLabel(status: string): string {
    return status === 'Completed' ? 'Receipt' : 'Track';
  }

  /* ─── Action Result ───────────────────────────────────────────────── */
  doAction(message: string, ref: string): void {
    this.modalActionLoading = true;
    setTimeout(() => {
      this.modalActionLoading = false;
      this.actionResult = { show: true, message, ref };
    }, 1500);
  }

  resetActionResult(): void {
    this.actionResult = { show: false, message: '', ref: '' };
  }

  /* ─── PIN Input ────────────────────────────────────────────────────── */
  onPinInput(index: number, event: any): void {
    const val = event.target.value;
    if (val.length === 1 && index < 3) {
      const inputs = document.querySelectorAll('.pin-row input');
      (inputs[index + 1] as HTMLElement)?.focus();
    }
    this.convertForm.pin[index] = val;
  }

  /* ─── Track By ───────────────────────────────────────────────────── */
  trackByIndex(index: number): number { return index; }
}