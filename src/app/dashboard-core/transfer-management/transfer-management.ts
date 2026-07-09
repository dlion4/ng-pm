import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ═══════════════════════════════════════════════════════════
// INTERFACES — ready for API replacement
// ═══════════════════════════════════════════════════════════

export interface Transfer {
  date: string; beneficiary: string; bank: string; amount: string;
  method: string; status: string; statusClass: string; action: string; actionModal: string;
}

export interface IntlTransfer {
  date: string; beneficiary: string; destination: string; amount: string;
  fxRate: string; method: string; status: string; statusClass: string;
  action: string; actionModal: string;
}

export interface RecurringTransfer {
  name: string; beneficiary: string; amount: string; frequency: string;
  nextRun: string; status: string; statusClass: string; action: string; actionModal: string;
}

export interface HistoryTransfer {
  date: string; reference: string; beneficiary: string; bank: string;
  amount: string; method: string; status: string; statusClass: string;
  receiptAction: string; receiptModal: string;
}

export interface BankStatus {
  name: string; methods: string; status: string; statusClass: string;
}

export interface FxRate {
  currency: string; rate: string; change: string; changeClass: string;
}

export interface Limit {
  label: string; value: string;
}

export interface ApprovalWorkflow {
  range: string; approver: string; badgeClass: string;
}

export interface AttentionItem {
  icon: string; iconBg: string; iconColor: string;
  title: string; subtitle: string; actionLabel: string; actionModal: string;
}

export interface SmartSuggestion {
  icon: string; iconBg: string; iconColor: string;
  title: string; subtitle: string; actionLabel: string; actionModal: string;
}

export interface QuickAction {
  label: string; icon: string; iconColor: string; modal: string;
}

export interface ComplianceStatus {
  label: string; value: string; colorVar: string; textColor: string;
}

interface FlowState {
  current: number; total: number; labels: string[];
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

@Component({
  selector: 'app-transfer-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer-management.html',
  styleUrl: './transfer-management.css',
  encapsulation: ViewEncapsulation.None
})
export class TransferManagementComponent implements OnInit {

  // ── Search ───────────────────────────────────────────────
  searchQuery = '';

  // ── Hero Stats ───────────────────────────────────────────
  heroStats = {
    totalTransferred: 'KES 184.7M',
    transferredToday: 'KES 184.7M transferred today',
    pendingApproval: 47,
    pendingAmount: 'KES 38.2M',
    successRate: '98.7%',
    successDelta: '+0.4% vs last month',
    domesticSuccess: '99.1%',
    internationalSuccess: '96.4%',
    avgSettlement: '18s',
    settlementMethod: 'PesaLink instant',
    rtgsAvg: '42 min avg',
    swiftAvg: '4.2 hrs avg'
  };

  // ── Attention Required ─────────────────────────────────
  attentionItems: AttentionItem[] = [
    {
      icon: 'bi-exclamation-triangle', iconBg: 'var(--pm-danger-soft)', iconColor: 'var(--pm-danger)',
      title: 'KES 12.5M transfer failed compliance', subtitle: 'AML flag on Equity → KCB',
      actionLabel: 'Review', actionModal: 'complianceModal'
    },
    {
      icon: 'bi-clock', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)',
      title: '3 recurring transfers need re-authorisation', subtitle: 'Salary runs — 28 Jun',
      actionLabel: 'Approve', actionModal: 'recurringModal'
    },
    {
      icon: 'bi-bank', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)',
      title: 'Co-op Bank maintenance window', subtitle: 'Tonight 02:00 – 04:00 EAT',
      actionLabel: 'Details', actionModal: 'bankStatusModal'
    }
  ];

  // ── Smart Suggestions ──────────────────────────────────
  smartSuggestions: SmartSuggestion[] = [
    {
      icon: 'bi-lightning-charge', iconBg: 'var(--pm-accent-soft)', iconColor: 'var(--pm-accent)',
      title: 'Switch 8 beneficiaries to PesaLink', subtitle: 'Save KES 1,600 in fees this month',
      actionLabel: 'Switch', actionModal: 'beneficiaryModal'
    },
    {
      icon: 'bi-calendar-event', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)',
      title: 'Pre-schedule July salary run', subtitle: 'Avoid last-minute approval rush',
      actionLabel: 'Schedule', actionModal: 'scheduleTransferModal'
    },
    {
      icon: 'bi-globe', iconBg: 'var(--pm-purple-soft)', iconColor: 'var(--pm-purple)',
      title: 'Optimise USD corridor via Wave', subtitle: 'Better FX rate than SWIFT',
      actionLabel: 'Compare', actionModal: 'internationalModal'
    }
  ];

  // ── Quick Actions ──────────────────────────────────────
  quickActions: QuickAction[] = [
    { label: 'Domestic Transfer', icon: 'bi-arrow-left-right', iconColor: 'text-primary', modal: 'initiateTransferModal' },
    { label: 'International', icon: 'bi-globe', iconColor: 'text-info', modal: 'internationalModal' },
    { label: 'Schedule', icon: 'bi-calendar-event', iconColor: 'text-success', modal: 'scheduleTransferModal' },
    { label: 'Recurring', icon: 'bi-arrow-repeat', iconColor: '', modal: 'recurringModal' },
    { label: 'Beneficiaries', icon: 'bi-people', iconColor: 'text-warning', modal: 'beneficiaryModal' },
    { label: 'Bulk Transfer', icon: 'bi-collection', iconColor: '', modal: 'bulkTransferModal' },
    { label: 'Approvals', icon: 'bi-check2-square', iconColor: 'text-danger', modal: 'approvalQueueModal' },
    { label: 'History', icon: 'bi-clock-history', iconColor: '', modal: 'transferHistoryModal' }
  ];

  // ── Domestic Transfers ─────────────────────────────────
  domesticTransfers: Transfer[] = [
    { date: '27 Jun', beneficiary: 'Grace Wanjiku', bank: 'Equity Bank', amount: 'KES 85,000', method: 'PesaLink', status: 'Instant', statusClass: 'B-s', action: 'Receipt', actionModal: 'transferReceiptModal' },
    { date: '27 Jun', beneficiary: 'ABC Suppliers Ltd', bank: 'KCB Bank', amount: 'KES 420,000', method: 'RTGS', status: 'Processing', statusClass: 'B-i', action: 'Track', actionModal: 'trackTransferModal' },
    { date: '26 Jun', beneficiary: 'James Otieno', bank: 'Co-op Bank', amount: 'KES 12,500', method: 'EFT', status: 'Completed', statusClass: 'B-s', action: 'Receipt', actionModal: 'transferReceiptModal' },
    { date: '26 Jun', beneficiary: 'Property Management', bank: 'NCBA', amount: 'KES 185,000', method: 'PesaLink', status: 'Instant', statusClass: 'B-s', action: 'Receipt', actionModal: 'transferReceiptModal' }
  ];

  // ── Bank Status ────────────────────────────────────────
  bankStatuses: BankStatus[] = [
    { name: 'Equity Bank', methods: 'PesaLink • RTGS • EFT', status: 'Online', statusClass: 'B-s' },
    { name: 'KCB Bank', methods: 'PesaLink • RTGS • EFT', status: 'Online', statusClass: 'B-s' },
    { name: 'Co-op Bank', methods: 'PesaLink • EFT', status: 'Maintenance', statusClass: 'B-w' },
    { name: 'NCBA', methods: 'PesaLink • RTGS', status: 'Online', statusClass: 'B-s' },
    { name: 'Family Bank', methods: 'PesaLink only', status: 'Online', statusClass: 'B-s' }
  ];

  // ── International Transfers ────────────────────────────
  internationalTransfers: IntlTransfer[] = [
    { date: '26 Jun', beneficiary: 'Peter Ochieng', destination: 'Uganda (UGX)', amount: 'USD 2,500', fxRate: '1 USD = 3,680 UGX', method: 'Wave', status: 'Delivered', statusClass: 'B-s', action: 'Receipt', actionModal: 'intlReceiptModal' },
    { date: '25 Jun', beneficiary: 'Tech Solutions Ltd', destination: 'UK (GBP)', amount: 'USD 18,400', fxRate: '1 USD = 0.78 GBP', method: 'SWIFT', status: 'In Transit', statusClass: 'B-i', action: 'Track', actionModal: 'trackIntlModal' },
    { date: '24 Jun', beneficiary: 'Mary Njeri', destination: 'Tanzania (TZS)', amount: 'USD 850', fxRate: '1 USD = 2,680 TZS', method: 'Remitly', status: 'Delivered', statusClass: 'B-s', action: 'Receipt', actionModal: 'intlReceiptModal' }
  ];

  // ── FX Rates ───────────────────────────────────────────
  fxRates: FxRate[] = [
    { currency: 'USD', rate: '129.45', change: '-0.12', changeClass: 'var(--pm-accent)' },
    { currency: 'GBP', rate: '164.80', change: '+0.45', changeClass: 'var(--pm-danger)' },
    { currency: 'EUR', rate: '140.20', change: '-0.08', changeClass: 'var(--pm-accent)' },
    { currency: 'UGX', rate: '0.035', change: '-0.001', changeClass: 'var(--pm-accent)' },
    { currency: 'TZS', rate: '0.048', change: '-0.002', changeClass: 'var(--pm-accent)' }
  ];

  // ── Recurring Transfers ───────────────────────────────
  recurringTransfers: RecurringTransfer[] = [
    { name: 'Monthly Rent', beneficiary: 'Property Mgmt Ltd', amount: 'KES 65,000', frequency: 'Monthly', nextRun: '01 Jul 2025', status: 'Active', statusClass: 'B-s', action: 'Edit', actionModal: 'editRecurringModal' },
    { name: 'Staff Salaries', beneficiary: 'Payroll Run (42 staff)', amount: 'KES 2.8M', frequency: 'Monthly', nextRun: '28 Jun 2025', status: 'Approval Pending', statusClass: 'B-w', action: 'Approve', actionModal: 'approvalQueueModal' },
    { name: 'Internet Bill', beneficiary: 'Safaricom Fibre', amount: 'KES 5,999', frequency: 'Monthly', nextRun: '01 Jul 2025', status: 'Active', statusClass: 'B-s', action: 'Edit', actionModal: 'editRecurringModal' },
    { name: 'School Fees', beneficiary: 'Strathmore University', amount: 'KES 185,000', frequency: 'Termly', nextRun: '15 Aug 2025', status: 'Active', statusClass: 'B-s', action: 'Edit', actionModal: 'editRecurringModal' }
  ];

  // ── Transfer History ───────────────────────────────────
  transferHistory: HistoryTransfer[] = [
    { date: '27 Jun', reference: 'TRF-20250627-88341', beneficiary: 'Grace Wanjiku', bank: 'Equity Bank', amount: 'KES 85,000', method: 'PesaLink', status: 'Success', statusClass: 'B-s', receiptAction: 'View', receiptModal: 'transferReceiptModal' },
    { date: '27 Jun', reference: 'TRF-20250627-88342', beneficiary: 'ABC Suppliers Ltd', bank: 'KCB Bank', amount: 'KES 420,000', method: 'RTGS', status: 'Processing', statusClass: 'B-i', receiptAction: 'Track', receiptModal: 'trackTransferModal' },
    { date: '26 Jun', reference: 'TRF-20250626-77219', beneficiary: 'Peter Ochieng', bank: 'Wave (Uganda)', amount: 'USD 2,500', method: 'Wave', status: 'Delivered', statusClass: 'B-s', receiptAction: 'View', receiptModal: 'intlReceiptModal' },
    { date: '26 Jun', reference: 'TRF-20250626-77220', beneficiary: 'James Otieno', bank: 'Co-op Bank', amount: 'KES 12,500', method: 'EFT', status: 'Success', statusClass: 'B-s', receiptAction: 'View', receiptModal: 'transferReceiptModal' }
  ];

  // ── Limits ─────────────────────────────────────────────
  limits: Limit[] = [
    { label: 'Daily Transfer Limit', value: 'KES 5,000,000' },
    { label: 'Single Transfer Limit', value: 'KES 2,000,000' },
    { label: 'Weekly Limit', value: 'KES 15,000,000' },
    { label: 'International Monthly', value: 'USD 50,000' }
  ];

  // ── Approval Workflow ──────────────────────────────────
  approvalWorkflow: ApprovalWorkflow[] = [
    { range: 'Up to KES 100K', approver: 'Auto-approved', badgeClass: 'B-s' },
    { range: 'KES 100K – 500K', approver: 'Manager approval', badgeClass: 'B-i' },
    { range: 'KES 500K – 2M', approver: 'Director + Finance', badgeClass: 'B-w' },
    { range: 'Above KES 2M', approver: 'CFO + Board', badgeClass: 'B-d' }
  ];

  // ── Compliance Status ──────────────────────────────────
  complianceStatus: ComplianceStatus[] = [
    { label: 'AML SCREENING', value: 'Clean', colorVar: 'var(--pm-accent-soft)', textColor: '#047857' },
    { label: 'SANCTIONS CHECK', value: 'Pass', colorVar: 'var(--pm-info-soft)', textColor: '#1D4ED8' },
    { label: 'KYC STATUS', value: 'Verified', colorVar: 'var(--pm-warning-soft)', textColor: '#B45309' }
  ];

  // ── Modal / Flow State ─────────────────────────────────
  activeModal: string | null = null;

  flows: Record<string, FlowState> = {
    init: { current: 1, total: 4, labels: ['Beneficiary', 'Details', 'Confirm', 'Done'] },
    intl: { current: 1, total: 4, labels: ['Beneficiary', 'FX', 'Compliance', 'Done'] },
    bulk: { current: 1, total: 4, labels: ['Upload', 'Preview', 'Funding', 'Done'] }
  };

  // ── Tab State ──────────────────────────────────────────
  activePill: Record<string, string> = { rec: 'active', ben: 'list' };

  // ── Form Models ────────────────────────────────────────
  initForm = {
    beneficiaryName: 'Grace Wanjiku', accountNumber: '0123456789', bank: 'Equity Bank',
    branch: 'Westlands Branch', amount: '85000', method: 'PesaLink (Instant)',
    narration: 'Monthly rent payment - June 2025', pin: ['', '', '', '']
  };

  intlForm = {
    beneficiaryName: 'Peter Ochieng', mobile: '+256 772 123 456', country: 'Uganda',
    currency: 'USD', amount: '2500', recipientGets: '9,200,000',
    deliveryMethod: 'Wave (Instant to Mobile Money)', purpose: 'Family Support'
  };

  scheduleForm = { beneficiary: 'Grace Wanjiku (Equity)', amount: '65000', date: '2025-07-01', method: 'PesaLink', reminder: '1 day before' };
  recurringForm = { beneficiary: 'Property Mgmt Ltd', amount: '65000', frequency: 'Monthly', startDate: '2025-07-01' };
  editRecurringForm = { amount: '65000', frequency: 'Monthly', nextRun: '2025-07-01', paused: false };
  limitsForm = { daily: '5000000', single: '2000000', weekly: '15000000', international: '50000' };
  complianceForm = { sourceOfFunds: 'Business Revenue', document: null as File | null };
  reconciliationForm = { startDate: '2025-06-20', endDate: '2025-06-27' };
  bulkForm = { file: null as File | null, fundingSource: 'PayMo Wallet (KES 24.5M)', approval: 'Director + Finance (Maker-Checker)' };

  // ── Loading & Toast ────────────────────────────────────
  isLoading = false;
  loadingMessage = 'Processing...';
  toast = { visible: false, message: '', type: 'success' as 'success' | 'error' | 'info' };

  // ── Beneficiary Data ───────────────────────────────────
  beneficiaries = [
    { name: 'Grace Wanjiku', bank: 'Equity', account: '0123456789', type: 'Domestic', lastTransfer: '27 Jun' },
    { name: 'Peter Ochieng', bank: 'Wave', account: '+256772123456', type: 'International', lastTransfer: '26 Jun' }
  ];
  newBeneficiary = { name: '', account: '', bank: 'Equity Bank', nickname: '' };

  // ── Approval Queue ─────────────────────────────────────
  approvalQueue = [
    { reference: 'TRF-20250627-88350', beneficiary: 'Staff Salaries', amount: 'KES 2,800,000', requestedBy: 'HR Manager', status: 'Awaiting Director', statusClass: 'B-w' },
    { reference: 'TRF-20250627-88351', beneficiary: 'ABC Suppliers', amount: 'KES 420,000', requestedBy: 'Procurement', status: 'Awaiting Finance', statusClass: 'B-i' }
  ];

  // ── Bank Directory ─────────────────────────────────────
  bankDirectory = [
    { name: 'Equity Bank', pesalink: 'Yes', rtgs: 'Yes', eft: 'Yes', status: 'Online', statusClass: 'B-s' },
    { name: 'KCB Bank', pesalink: 'Yes', rtgs: 'Yes', eft: 'Yes', status: 'Online', statusClass: 'B-s' },
    { name: 'Co-op Bank', pesalink: 'Yes', rtgs: 'No', eft: 'Yes', status: 'Maintenance', statusClass: 'B-w' },
    { name: 'NCBA', pesalink: 'Yes', rtgs: 'Yes', eft: 'Yes', status: 'Online', statusClass: 'B-s' }
  ];

  // ── Health Dashboard ─────────────────────────────────
  healthStats = { successRate: '98.7', avgSettlement: '18s', pendingApproval: 47, openIssues: 3 };
  healthMetrics = [
    { metric: 'Success Rate', domestic: '99.1%', international: '96.4%' },
    { metric: 'Avg Time', domestic: '18 seconds', international: '4.2 hours' },
    { metric: 'Failed Today', domestic: '2', international: '1' }
  ];

  // ── Notifications ──────────────────────────────────────
  notifications = [
    { title: 'Compliance flag on KES 12.5M transfer', subtitle: 'AML review required before processing.', bg: 'var(--pm-danger-soft)', text: '#7F1D1D' },
    { title: '3 recurring transfers need approval', subtitle: 'Salary run scheduled for 28 Jun.', bg: 'var(--pm-warning-soft)', text: '#92400E' },
    { title: 'International transfer delivered', subtitle: 'Peter Ochieng received UGX 9,200,000.', bg: 'var(--pm-info-soft)', text: '#1E40AF' },
    { title: 'PesaLink maintenance completed', subtitle: 'All services restored.', bg: 'var(--pm-accent-soft)', text: '#065F46' }
  ];

  // ── Profile ────────────────────────────────────────────
  profile = { name: 'James Kamau', email: 'james.kamau@email.com', phone: '+254 712 345 890', initials: 'JK', transfersToday: 'KES 184.7M', pendingApprovals: 47 };

  // ── Attention Modal Items ──────────────────────────────
  attentionModalItems = [
    { title: 'Compliance flag on KES 12.5M transfer', modal: 'complianceModal' },
    { title: '3 recurring transfers need approval', modal: 'approvalQueueModal' },
    { title: 'Co-op Bank maintenance tonight', modal: 'bankStatusModal' },
    { title: '2 discrepancies in reconciliation', modal: 'reconciliationModal' }
  ];

  // ── Full History ───────────────────────────────────────
  fullHistory = [
    { date: '27 Jun', reference: 'TRF-20250627-88341', beneficiary: 'Grace Wanjiku', amount: 'KES 85,000', method: 'PesaLink', status: 'Success', statusClass: 'B-s', receiptModal: 'transferReceiptModal' },
    { date: '26 Jun', reference: 'INTL-20250626-77219', beneficiary: 'Peter Ochieng', amount: 'USD 2,500', method: 'Wave', status: 'Delivered', statusClass: 'B-s', receiptModal: 'intlReceiptModal' }
  ];

  // ── FX Rates Modal ─────────────────────────────────────
  fxRatesModal = [
    { currency: 'USD', buy: '129.20', sell: '129.45', change: '-0.12', changeClass: 'text-success' },
    { currency: 'GBP', buy: '164.50', sell: '164.80', change: '+0.45', changeClass: 'text-danger' },
    { currency: 'EUR', buy: '139.95', sell: '140.20', change: '-0.08', changeClass: 'text-success' },
    { currency: 'UGX', buy: '0.0348', sell: '0.0352', change: '-0.001', changeClass: 'text-success' }
  ];

  // ── Recurring History ──────────────────────────────────
  recurringHistory = [
    { date: '01 Jun', name: 'Monthly Rent', amount: 'KES 65,000', status: 'Success', statusClass: 'B-s' },
    { date: '28 May', name: 'Staff Salaries', amount: 'KES 2.8M', status: 'Success', statusClass: 'B-s' }
  ];

  // ── Bulk Preview ───────────────────────────────────────
  bulkPreview = [
    { name: 'John Doe', account: '0123456789', bank: 'Equity', amount: 'KES 25,000', status: 'Valid', statusClass: 'B-s' },
    { name: 'Jane Smith', account: '9876543210', bank: 'KCB', amount: 'KES 40,000', status: 'Valid', statusClass: 'B-s' }
  ];

  // ── Track Transfer ─────────────────────────────────────
  trackTransfer = {
    reference: 'TRF-20250627-88342', status: 'Processing at KCB', statusClass: 'B-i',
    steps: [
      { label: 'Submitted', time: '27 Jun 14:28' },
      { label: 'Received by PesaLink', time: '27 Jun 14:28' },
      { label: 'Processing at Destination Bank', time: '27 Jun 14:29' },
      { label: 'Expected Completion', time: '27 Jun 14:35' }
    ]
  };

  // ── Track International ──────────────────────────────────
  trackIntl = {
    reference: 'INTL-20250625-66102', status: 'In Transit (SWIFT)', statusClass: 'B-i',
    steps: [
      { label: 'Submitted', time: '25 Jun 09:12' },
      { label: 'SWIFT Message Sent', time: '25 Jun 09:14' },
      { label: 'Received by Correspondent Bank', time: '25 Jun 14:22' },
      { label: 'Expected Credit', time: '27 Jun 2025' }
    ]
  };

  // ── Receipt Data ───────────────────────────────────────
  receiptData = {
    reference: 'TRF-20250627-88341', beneficiary: 'Grace Wanjiku', bank: 'Equity Bank',
    amount: 'KES 85,000.00', fee: 'KES 25.00', method: 'PesaLink', completed: '27 Jun 2025, 14:32'
  };

  intlReceiptData = {
    reference: 'INTL-20250626-77219', beneficiary: 'Peter Ochieng',
    amountSent: 'USD 2,500.00', received: 'UGX 9,200,000', method: 'Wave', delivered: '26 Jun 2025, 11:44 EAT'
  };

  constructor() { }

  ngOnInit(): void { }

  // ═══════════════════════════════════════════════════════════
  // MODAL HELPERS
  // ═══════════════════════════════════════════════════════════

  openModal(modalId: string): void {
    this.activeModal = modalId;
    const key = modalId.replace('Modal', '');
    if (this.flows[key]) this.flows[key].current = 1;
  }

  closeModal(): void { this.activeModal = null; }

  isModalOpen(modalId: string): boolean { return this.activeModal === modalId; }

  // ═══════════════════════════════════════════════════════════
  // FLOW NAVIGATION
  // ═══════════════════════════════════════════════════════════

  nextFlow(key: string): void {
    const flow = this.flows[key];
    if (!flow) return;
    if (flow.current === flow.total - 1) {
      this.isLoading = true;
      setTimeout(() => { this.isLoading = false; flow.current = flow.total; }, 1500);
      return;
    }
    if (flow.current >= flow.total) { this.closeModal(); return; }
    flow.current++;
  }

  prevFlow(key: string): void {
    const flow = this.flows[key];
    if (!flow || flow.current <= 1) return;
    flow.current--;
  }

  isFlowStep(key: string, step: number): boolean { return this.flows[key]?.current === step; }
  isFlowDone(key: string, step: number): boolean { return (this.flows[key]?.current ?? 0) > step; }

  // ═══════════════════════════════════════════════════════════
  // PIN INPUT
  // ═══════════════════════════════════════════════════════════

  onPinInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    this.initForm.pin[index] = input.value;
    if (input.value.length === 1) {
      const next = input.nextElementSibling as HTMLInputElement;
      if (next) next.focus();
    }
  }

  // ═══════════════════════════════════════════════════════════
  // TAB SWITCHING
  // ═══════════════════════════════════════════════════════════

  switchTab(prefix: string, key: string): void { this.activePill[prefix] = key; }
  isTabActive(prefix: string, key: string): boolean { return this.activePill[prefix] === key; }

  // ═══════════════════════════════════════════════════════════
  // ACTIONS & TOAST
  // ═══════════════════════════════════════════════════════════

  doAction(message: string): void {
    this.isLoading = true;
    setTimeout(() => { this.isLoading = false; this.showToast(message); this.closeModal(); }, 1500);
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.toast = { visible: true, message, type };
    setTimeout(() => this.toast.visible = false, 3000);
  }

  // ═══════════════════════════════════════════════════════════
  // FILE UPLOAD
  // ═══════════════════════════════════════════════════════════

  onFileSelected(event: Event, formField: 'compliance' | 'bulk'): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (formField === 'compliance') this.complianceForm.document = file;
    else this.bulkForm.file = file;
  }

  // ═══════════════════════════════════════════════════════════
  // FORM SUBMIT HELPERS
  // ═══════════════════════════════════════════════════════════

  submitInitTransfer(): void { this.doAction('Transfer initiated successfully!'); }
  submitIntlTransfer(): void { this.doAction('International transfer sent!'); }
  submitSchedule(): void { this.doAction('Transfer scheduled successfully for 01 Jul 2025.'); }
  submitRecurring(): void { this.doAction('Recurring transfer created successfully!'); }
  submitBulk(): void { this.doAction('Bulk transfer initiated! 42 transfers queued.'); }
  submitBeneficiary(): void { this.doAction('Beneficiary added successfully!'); }
  submitApproval(): void { this.doAction('Transfer approved!'); }
  submitLimits(): void { this.doAction('Transfer limits updated successfully!'); }
  submitEditRecurring(): void { this.doAction('Recurring transfer updated!'); }
  submitCompliance(): void { this.doAction('Compliance documentation submitted. Transfer released.'); }
  submitReconciliation(): void { this.doAction('Reconciliation completed. 2 discrepancies flagged.'); }
  exportHistory(): void { this.doAction('Report downloaded successfully.'); }
}