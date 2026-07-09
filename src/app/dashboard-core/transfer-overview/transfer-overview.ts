import { Component, TemplateRef, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';

// ═══════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════

export interface AttentionItem {
  title: string;
  subtitle: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  actionLabel: string;
  modalTarget: string;
}

export interface SuggestionItem {
  title: string;
  subtitle: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  actionLabel: string;
  modalTarget: string;
}

export interface QuickAction {
  label: string;
  icon: string;
  iconColor: string;
  modalTarget: string;
}

export interface TransferRecord {
  date: string;
  beneficiary: string;
  amount: string;
  method: string;
  status: 'success' | 'pending' | 'failed';
  ref: string;
}

export interface Channel {
  name: string;
  transfers: number;
  amount: string;
}

export interface Favorite {
  name: string;
  account: string;
  type: string;
  color: string;
}

export interface ScheduledTransfer {
  schedule: string;
  beneficiary: string;
  amount: string;
  frequency: string;
  nextRun: string;
  status: 'active' | 'paused';
}

export interface TopRecipient {
  name: string;
  amount: string;
}

export interface SuccessRate {
  channel: string;
  rate: string;
  badgeClass: string;
}

export interface MonthlyTrendBar {
  month: string;
  height: string;
  color: string;
}

export interface BulkRecipient {
  name: string;
  account: string;
  amount: string;
}

export interface Beneficiary {
  name: string;
  account: string;
  type: string;
}

export interface AnalyticsVolumeBar {
  month: string;
  height: string;
  color: string;
}

export interface AnalyticsSuccessItem {
  channel: string;
  rate: string;
  badgeClass: string;
  failed: number;
}

export interface AnalyticsRecipient {
  name: string;
  transfers: number;
}

export interface FlowState {
  current: number;
  total: number;
  labels: string[];
}

export interface FlowStep {
  index: number;
  label: string;
  done: boolean;
  active: boolean;
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

@Component({
  selector: 'app-transfer-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalModule],
  providers: [BsModalService],
  templateUrl: './transfer-overview.html',
  styleUrls: ['./transfer-overview.css'],
  encapsulation: ViewEncapsulation.None
})
export class TransferOverviewComponent implements OnInit {

  // ─── Modal Reference ───
  modalRef?: BsModalRef;

  // ═══════════════════════════════════════════════════════════════
  // HERO STATS DATA
  // ═══════════════════════════════════════════════════════════════
  totalTransferred = 'KES 2.84M transferred';
  transactionCount = '1,248';
  successRate = '98.7%';
  completedCount = '1,189';
  completedRate = '98.7%';
  avgTime = '12 seconds';
  pendingCount = '47';
  pendingToday = '32';
  nextExecution = 'Today 3:00 PM';
  failedCount = '12';
  failedRate = '1.0%';
  failedReason = 'Insufficient funds';

  // ═══════════════════════════════════════════════════════════════
  // ATTENTION ITEMS
  // ═══════════════════════════════════════════════════════════════
  attentionItems: AttentionItem[] = [
    {
      title: 'Scheduled transfer to landlord failed',
      subtitle: 'KES 35,000 · Insufficient funds',
      icon: 'bi-exclamation-triangle',
      iconBg: 'var(--pm-danger-soft)',
      iconColor: 'var(--pm-danger)',
      actionLabel: 'Retry',
      modalTarget: 'retryTransferTpl'
    },
    {
      title: '3 recurring payments need funding source update',
      subtitle: 'M-Pesa number changed',
      icon: 'bi-clock',
      iconBg: 'var(--pm-warning-soft)',
      iconColor: 'var(--pm-warning)',
      actionLabel: 'Update',
      modalTarget: 'manageBeneficiariesTpl'
    },
    {
      title: 'Large transfer (KES 450,000) pending approval',
      subtitle: 'Requires 2FA confirmation',
      icon: 'bi-shield-exclamation',
      iconBg: 'var(--pm-info-soft)',
      iconColor: 'var(--pm-info)',
      actionLabel: 'Approve',
      modalTarget: 'initiateTransferTpl'
    }
  ];

  // ═══════════════════════════════════════════════════════════════
  // SMART SUGGESTIONS
  // ═══════════════════════════════════════════════════════════════
  suggestions: SuggestionItem[] = [
    {
      title: 'Set up auto-pay for 4 recurring bills',
      subtitle: 'Save 3 hours/month',
      icon: 'bi-lightning-charge',
      iconBg: 'var(--pm-accent-soft)',
      iconColor: 'var(--pm-accent)',
      actionLabel: 'Setup',
      modalTarget: 'scheduleTransferTpl'
    },
    {
      title: 'Add 6 frequent contacts as favorites',
      subtitle: 'Faster transfers',
      icon: 'bi-people',
      iconBg: 'var(--pm-info-soft)',
      iconColor: 'var(--pm-info)',
      actionLabel: 'Add',
      modalTarget: 'manageBeneficiariesTpl'
    },
    {
      title: 'Your rent transfer is due in 4 days',
      subtitle: 'KES 45,000 to Landlord',
      icon: 'bi-graph-up',
      iconBg: 'var(--pm-warning-soft)',
      iconColor: 'var(--pm-warning)',
      actionLabel: 'Pay Early',
      modalTarget: 'initiateTransferTpl'
    }
  ];

  // ═══════════════════════════════════════════════════════════════
  // QUICK ACTIONS
  // ═══════════════════════════════════════════════════════════════
  quickActions: QuickAction[] = [
    { label: 'Send Money', icon: 'bi-send', iconColor: 'text-primary', modalTarget: 'initiateTransferTpl' },
    { label: 'Bulk Transfer', icon: 'bi-collection', iconColor: 'text-info', modalTarget: 'bulkTransferTpl' },
    { label: 'Schedule', icon: 'bi-calendar-event', iconColor: 'text-success', modalTarget: 'scheduleTransferTpl' },
    { label: 'Beneficiaries', icon: 'bi-person-plus', iconColor: 'text-warning', modalTarget: 'manageBeneficiariesTpl' },
    { label: 'History', icon: 'bi-clock-history', iconColor: '', modalTarget: 'transferHistoryTpl' },
    { label: 'Limits', icon: 'bi-sliders', iconColor: '', modalTarget: 'transferLimitsTpl' },
    { label: 'International', icon: 'bi-globe', iconColor: '', modalTarget: 'internationalTransferTpl' },
    { label: 'QR Pay', icon: 'bi-qr-code', iconColor: '', modalTarget: 'qrPayTpl' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // RECENT TRANSFERS
  // ═══════════════════════════════════════════════════════════════
  recentTransfers: TransferRecord[] = [
    { date: '27 Jun', beneficiary: 'Grace Kamau', amount: 'KES 12,500', method: 'M-Pesa', status: 'success', ref: 'TRF-448291' },
    { date: '26 Jun', beneficiary: 'Landlord Properties', amount: 'KES 45,000', method: 'Bank', status: 'success', ref: 'TRF-447820' },
    { date: '25 Jun', beneficiary: 'James Ochieng', amount: 'KES 8,200', method: 'Internal', status: 'success', ref: 'TRF-447103' },
    { date: '24 Jun', beneficiary: 'Equity Bank', amount: 'KES 120,000', method: 'Bank', status: 'pending', ref: 'TRF-446991' },
    { date: '23 Jun', beneficiary: 'Safaricom', amount: 'KES 1,500', method: 'M-Pesa', status: 'success', ref: 'TRF-446450' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // TRANSFER CHANNELS
  // ═══════════════════════════════════════════════════════════════
  channels: Channel[] = [
    { name: 'M-Pesa', transfers: 612, amount: 'KES 1.24M' },
    { name: 'Bank Transfer', transfers: 298, amount: 'KES 892K' },
    { name: 'Internal Wallet', transfers: 187, amount: 'KES 412K' },
    { name: 'International', transfers: 51, amount: 'KES 296K' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // FAVORITES
  // ═══════════════════════════════════════════════════════════════
  favorites: Favorite[] = [
    { name: 'Grace Kamau', account: '0712 345 890', type: 'M-Pesa', color: '#10B981' },
    { name: 'Landlord Properties', account: 'Bank 0012345678', type: 'Bank', color: '#3B82F6' },
    { name: 'James Ochieng', account: '0722 111 222', type: 'M-Pesa', color: '#10B981' },
    { name: 'Equity Bank', account: '0012345678', type: 'Bank', color: '#3B82F6' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // SCHEDULED TRANSFERS
  // ═══════════════════════════════════════════════════════════════
  scheduledTransfers: ScheduledTransfer[] = [
    { schedule: 'Rent', beneficiary: 'Landlord Properties', amount: 'KES 45,000', frequency: 'Monthly', nextRun: '01 Jul 2025', status: 'active' },
    { schedule: 'Salary Advance', beneficiary: 'Grace Kamau', amount: 'KES 15,000', frequency: 'Bi-weekly', nextRun: '28 Jun 2025', status: 'active' },
    { schedule: 'Internet Bill', beneficiary: 'Safaricom Fibre', amount: 'KES 5,999', frequency: 'Monthly', nextRun: '01 Jul 2025', status: 'paused' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // TOP RECIPIENTS
  // ═══════════════════════════════════════════════════════════════
  topRecipients: TopRecipient[] = [
    { name: 'Grace Kamau', amount: 'KES 187,500' },
    { name: 'Landlord Properties', amount: 'KES 135,000' },
    { name: 'Equity Bank', amount: 'KES 120,000' },
    { name: 'Safaricom', amount: 'KES 42,000' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // SUCCESS RATES
  // ═══════════════════════════════════════════════════════════════
  successRates: SuccessRate[] = [
    { channel: 'M-Pesa', rate: '99.4%', badgeClass: 'B-s' },
    { channel: 'Bank Transfer', rate: '97.8%', badgeClass: 'B-s' },
    { channel: 'Internal', rate: '100%', badgeClass: 'B-s' },
    { channel: 'International', rate: '94.1%', badgeClass: 'B-w' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // MONTHLY TREND
  // ═══════════════════════════════════════════════════════════════
  monthlyTrend: MonthlyTrendBar[] = [
    { month: 'Jan', height: '55%', color: 'var(--pm-primary)' },
    { month: 'Feb', height: '68%', color: 'var(--pm-primary)' },
    { month: 'Mar', height: '82%', color: 'var(--pm-warning)' },
    { month: 'Apr', height: '75%', color: 'var(--pm-primary)' },
    { month: 'May', height: '90%', color: 'var(--pm-accent)' },
    { month: 'Jun', height: '100%', color: 'var(--pm-primary)' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // BULK RECIPIENTS
  // ═══════════════════════════════════════════════════════════════
  bulkRecipients: BulkRecipient[] = [
    { name: 'Grace Kamau', account: '0712 345 890', amount: 'KES 12,500' },
    { name: 'John Otieno', account: '0722 111 222', amount: 'KES 8,000' },
    { name: 'Landlord Ltd', account: 'Bank 0012345678', amount: 'KES 45,000' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // ALL BENEFICIARIES
  // ═══════════════════════════════════════════════════════════════
  allBeneficiaries: Beneficiary[] = [
    { name: 'Grace Kamau', account: '0712 345 890', type: 'M-Pesa' },
    { name: 'Landlord Properties', account: 'Bank 0012345678', type: 'Bank' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // FAVORITE BENEFICIARIES
  // ═══════════════════════════════════════════════════════════════
  favoriteBeneficiaries: Beneficiary[] = [
    { name: 'Grace Kamau', account: '0712 345 890', type: 'M-Pesa' },
    { name: 'Landlord Properties', account: 'Bank 0012345678', type: 'Bank' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // RECENT BENEFICIARIES
  // ═══════════════════════════════════════════════════════════════
  recentBeneficiaries: Beneficiary[] = [
    { name: 'James Ochieng', account: '0722 111 222', type: 'M-Pesa' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // ANALYTICS VOLUME
  // ═══════════════════════════════════════════════════════════════
  analyticsVolume: AnalyticsVolumeBar[] = [
    { month: 'Jan', height: '60%', color: 'var(--pm-primary)' },
    { month: 'Feb', height: '75%', color: 'var(--pm-primary)' },
    { month: 'Mar', height: '90%', color: 'var(--pm-warning)' },
    { month: 'Apr', height: '82%', color: 'var(--pm-primary)' },
    { month: 'May', height: '100%', color: 'var(--pm-accent)' },
    { month: 'Jun', height: '95%', color: 'var(--pm-primary)' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // ANALYTICS SUCCESS
  // ═══════════════════════════════════════════════════════════════
  analyticsSuccess: AnalyticsSuccessItem[] = [
    { channel: 'M-Pesa', rate: '99.4%', badgeClass: 'B-s', failed: 7 },
    { channel: 'Bank', rate: '97.8%', badgeClass: 'B-s', failed: 12 },
    { channel: 'International', rate: '94.1%', badgeClass: 'B-w', failed: 3 }
  ];

  // ═══════════════════════════════════════════════════════════════
  // ANALYTICS RECIPIENTS
  // ═══════════════════════════════════════════════════════════════
  analyticsRecipients: AnalyticsRecipient[] = [
    { name: 'Grace Kamau', transfers: 24 },
    { name: 'Landlord Properties', transfers: 6 }
  ];

  // ═══════════════════════════════════════════════════════════════
  // FLOW / STEPPER STATE
  // ═══════════════════════════════════════════════════════════════
  flows: Record<string, FlowState> = {
    init: { current: 1, total: 4, labels: ['Beneficiary', 'Amount', 'Confirm', 'Done'] },
    bulk: { current: 1, total: 4, labels: ['Upload', 'Review', 'Pay', 'Done'] },
    sched: { current: 1, total: 3, labels: ['Details', 'Schedule', 'Confirm'] },
    intl: { current: 1, total: 4, labels: ['Recipient', 'Amount', 'Compliance', 'Done'] }
  };

  // ═══════════════════════════════════════════════════════════════
  // TAB STATES
  // ═══════════════════════════════════════════════════════════════
  benTab: 'list' | 'favorites' | 'recent' = 'list';
  anTab: 'volume' | 'success' | 'recipients' = 'volume';

  // ═══════════════════════════════════════════════════════════════
  // LOADING STATE
  // ═══════════════════════════════════════════════════════════════
  loading = false;
  loadingMessage = 'Processing...';

  // ═══════════════════════════════════════════════════════════════
  // INITIATE TRANSFER FORM
  // ═══════════════════════════════════════════════════════════════
  selectedBeneficiary = 'Grace Kamau — 0712 345 890';
  selectedTransferType = 'M-Pesa';
  transferAmount = '12500';
  transferReference = 'Rent June 2025';
  selectedFundingSource = 'PayMo Wallet (KES 24,500)';
  pinValues: (string | null)[] = [null, null, null, null];

  // ═══════════════════════════════════════════════════════════════
  // SCHEDULE TRANSFER FORM
  // ═══════════════════════════════════════════════════════════════
  schedBeneficiary = 'Grace Kamau';
  schedAmount = '45000';
  schedFrequency = 'Monthly';
  schedStartDate = '2025-07-01';
  schedEndDate = '';
  schedFundingSource = 'PayMo Wallet';

  // ═══════════════════════════════════════════════════════════════
  // EDIT SCHEDULE FORM
  // ═══════════════════════════════════════════════════════════════
  editSchedAmount = '45000';
  editSchedFrequency = 'Monthly';
  editSchedActive = true;
  editSchedNotify = false;

  // ═══════════════════════════════════════════════════════════════
  // INTERNATIONAL TRANSFER FORM
  // ═══════════════════════════════════════════════════════════════
  intlCountry = 'United Kingdom';
  intlRecipientName = 'John Smith';
  intlAccount = 'GB29NWBK60161331926819';
  intlAmount = '150000';
  intlCurrency = 'GBP';
  intlPurpose = 'Family Support';
  intlSource = 'Salary';

  // ═══════════════════════════════════════════════════════════════
  // QR PAY FORM
  // ═══════════════════════════════════════════════════════════════
  qrAmount = '2500';
  qrReference = 'Lunch payment';

  // ═══════════════════════════════════════════════════════════════
  // TRANSFER LIMITS FORM
  // ═══════════════════════════════════════════════════════════════
  dailyLimit = '500000';
  perTransactionLimit = '200000';
  intlLimit = '100000';
  requirePin = true;
  require2FA = true;

  // ═══════════════════════════════════════════════════════════════
  // RETRY TRANSFER FORM
  // ═══════════════════════════════════════════════════════════════
  retryFundingSource = 'PayMo Wallet (KES 24,500)';

  // ═══════════════════════════════════════════════════════════════
  // ADD BENEFICIARY FORM
  // ═══════════════════════════════════════════════════════════════
  newBeneficiaryName = 'Mary Wanjiku';
  newBeneficiaryPhone = '0733 222 111';
  newBeneficiaryType = 'M-Pesa';
  addToFavorites = true;

  // ═══════════════════════════════════════════════════════════════
  // QUICK SEND FORM
  // ═══════════════════════════════════════════════════════════════
  quickSendAmount = '5000';
  quickSendNote = 'Quick payment';

  // ═══════════════════════════════════════════════════════════════
  // ADD TO FAVORITES FORM
  // ═══════════════════════════════════════════════════════════════
  favoriteNickname = 'My Landlord';
  enableQuickSend = true;

  // ═══════════════════════════════════════════════════════════════
  // DISPUTE FORM
  // ═══════════════════════════════════════════════════════════════
  disputeType = 'Wrong amount sent';
  disputeDescription = 'The transfer was sent to the wrong number.';

  // ═══════════════════════════════════════════════════════════════
  // EDIT BENEFICIARY FORM
  // ═══════════════════════════════════════════════════════════════
  editBeneficiaryName = 'Grace Kamau';
  editBeneficiaryPhone = '0712 345 890';
  editBeneficiaryFavorite = true;

  // ═══════════════════════════════════════════════════════════════
  // MODAL TEMPLATE MAP (for openModalByName)
  // ═══════════════════════════════════════════════════════════════
  private modalTemplateMap: Record<string, TemplateRef<any>> = {};

  // ─── Constructor ───
  constructor(private modalService: BsModalService) { }

  // ─── Lifecycle ───
  ngOnInit(): void {
    // Component initialized
  }

  // ═══════════════════════════════════════════════════════════════
  // MODAL METHODS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Open a modal using a template reference directly
   */
  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
      backdrop: 'static',
      keyboard: true
    });
  }

  /**
   * Open a modal by its template name (string reference)
   * Used by dynamic action items
   */
  openModalByName(name: string): void {
    const template = this.modalTemplateMap[name];
    if (template) {
      this.openModal(template);
    } else {
      console.warn(`Modal template "${name}" not found`);
    }
  }

  /**
   * Register a modal template for name-based lookup
   * Call this from template using a setter or after view init
   */
  registerModalTemplate(name: string, template: TemplateRef<any>): void {
    this.modalTemplateMap[name] = template;
  }

  /**
   * Close the currently open modal
   */
  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = undefined;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // STATUS HELPERS
  // ═══════════════════════════════════════════════════════════════

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'success': return 'B-s';
      case 'pending': return 'B-i';
      case 'failed': return 'B-d';
      default: return 'B-s';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'success': return 'Success';
      case 'pending': return 'Pending';
      case 'failed': return 'Failed';
      default: return status;
    }
  }

  getSchedStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active': return 'B-s';
      case 'paused': return 'B-w';
      default: return 'B-s';
    }
  }

  getSchedStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Active';
      case 'paused': return 'Paused';
      default: return status;
    }
  }

  getSchedActionLabel(status: string): string {
    switch (status) {
      case 'active': return 'Edit';
      case 'paused': return 'Resume';
      default: return 'Edit';
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // FLOW / STEPPER METHODS
  // ═══════════════════════════════════════════════════════════════

  getFlowSteps(key: string): FlowStep[] {
    const flow = this.flows[key];
    if (!flow) return [];
    return flow.labels.map((label, i) => ({
      index: i + 1,
      label,
      done: i + 1 < flow.current,
      active: i + 1 === flow.current
    }));
  }

  isFlowStepActive(key: string, step: number): boolean {
    return this.flows[key]?.current === step;
  }

  getFlowButtonLabel(key: string): string {
    const flow = this.flows[key];
    if (!flow) return 'Continue';
    if (flow.current >= flow.total) return 'Done';
    if (flow.current === flow.total - 1) {
      if (key === 'init') return 'Send Money';
      if (key === 'intl') return 'Confirm Transfer';
      return 'Confirm';
    }
    return 'Continue';
  }

  nextFlow(key: string): void {
    const flow = this.flows[key];
    if (!flow) return;

    // If on the confirmation step, show loading then advance
    if (flow.current === flow.total - 1) {
      this.loading = true;
      this.loadingMessage = 'Processing...';
      setTimeout(() => {
        this.loading = false;
        flow.current = flow.total;
      }, 1500);
      return;
    }

    // If already at the end, close modal
    if (flow.current >= flow.total) {
      this.closeModal();
      this.resetFlow(key);
      return;
    }

    // Advance step
    flow.current++;
  }

  resetFlow(key: string): void {
    if (this.flows[key]) {
      this.flows[key].current = 1;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // UI INTERACTION METHODS
  // ═══════════════════════════════════════════════════════════════

  selectPill(event: Event): void {
    const btn = event.target as HTMLElement;
    const container = btn.closest('.pills');
    if (container) {
      container.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
    }
  }

  onPinInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1) {
      const next = input.nextElementSibling as HTMLInputElement;
      if (next) next.focus();
    }
  }

  switchBenTab(tab: 'list' | 'favorites' | 'recent'): void {
    this.benTab = tab;
  }

  switchAnTab(tab: 'volume' | 'success' | 'recipients'): void {
    this.anTab = tab;
  }

  // ═══════════════════════════════════════════════════════════════
  // ACTION METHODS
  // ═══════════════════════════════════════════════════════════════

  doAction(message: string): void {
    this.loading = true;
    this.loadingMessage = 'Processing...';
    setTimeout(() => {
      this.loading = false;
      // In a real app, you'd show a toast/notification here
      console.log(message);
      this.closeModal();
    }, 1500);
  }
}