import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ─── INTERFACES ────────────────────────────────────────────────────────

interface AttentionItem {
  id: string;
  iconText: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonClass: string;
  modalId: string;
}

export interface QuickAction {
  id: string;
  iconClass: string;
  iconColor?: string;
  label: string;
  iconStyle?: string;
  modalId: string;
}


interface SupplierAction {
  label: string;
  iconHtml: string;
  modalId: string;
}

interface Supplier {
  id: string;
  name: string;
  kraInfo: string;
  category: string;
  payMethod: string;
  creditTerms: string;
  status: string;
  statusBadgeClass: string;
  rating: string;
  actions: SupplierAction[];
}

interface Invoice {
  id: string;
  invNum: string;
  supplier: string;
  amount: string;
  matchStatus: string;
  matchBadgeClass: string;
  authStatus: string;
  authBadgeClass: string;
  status: string;
  statusBadgeClass: string;
  actionLabel: string;
  actionModal: string;
}

interface Payment {
  id: string;
  ref: string;
  dateScheduled: string;
  invoicesIncluded: string;
  totalValue: string;
  method: string;
  status: string;
  statusBadgeClass: string;
  actionLabel: string;
  actionModal: string;
}

interface ExpenseClaim {
  id: string;
  avatarInitials: string;
  avatarBg: string;
  name: string;
  description: string;
  isApproved: boolean;
  actionLabel?: string;
  actionModal?: string;
}

interface AgingRow {
  label: string;
  value: string;
  pct: number;
  color: string;
}

interface AgingDetailRow {
  id: string;
  supplier: string;
  current: string;
  d1to30: string;
  d31to60: string;
  d60plus: string;
  total: string;
  totalColor?: string;
}

interface SupplierHistory {
  id: string;
  invNum: string;
  date: string;
  amount: string;
  status: string;
  statusBadgeClass: string;
}

interface ApprovalQueueItem {
  id: string;
  invoice: string;
  supplier: string;
  amount: string;
  requestedBy: string;
  ref: string;
}

// ─── COMPONENT ─────────────────────────────────────────────────────────

@Component({
  selector: 'app-accounts-payable',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accounts-payable.html',
  styleUrls: ['./accounts-payable.css'],
  encapsulation: ViewEncapsulation.None
})
export class AccountsPayableComponent {
  toastMessage = '';
  loadingModal: string | null = null;
  savedModals: Record<string, { message: string; ref: string }> = {};
  stepState: Record<string, number> = { supp: 1, apBulk: 1 };
  stepperLabels: Record<string, string[]> = {
    supp: ['Identity', 'Banking', 'KYB', 'Done'],
    apBulk: ['Select', 'Review', 'Pay'],
  };
  flowButtonDefaults: Record<string, string> = { supp: 'Continue', apBulk: 'Continue' };
  modalTableHeaders: string[] = ['Item', 'Detail', 'Amount', 'Status'];

  activeModal: string | null = null;
  suppStep: number = 1;
  apBulkStep: number = 1;

  // Tab state
  activeTabs: Record<string, string> = {
    suppProf: 'info'
  };

  // Saved states for action modals
  uploadInvoiceSaved: boolean = false;
  paySupplierSaved: boolean = false;
  schedulePaymentSaved: boolean = false;
  createPoSaved: boolean = false;
  expenseClaimSaved: boolean = false;
  approveExpenseSaved: boolean = false;
  supplierStatementSaved: boolean = false;
  disputeInvoiceSaved: boolean = false;
  earlyPaymentDiscountSaved: boolean = false;
  kybVerificationSaved: boolean = false;
  departmentApprovalSaved: boolean = false;
  exportApReportSaved: boolean = false;
  reconciliationSaved: boolean = false;
  onboardSupplierInviteSaved: boolean = false;
  approvalQueueSaved: boolean = false;

  // Stepper labels
  suppStepperLabels: string[] = ['Business', 'Payment', 'Terms', 'Done'];
  apBulkStepperLabels: string[] = ['Select', 'Execute', 'Done'];

  // ─── MOCK DATA ─────────────────────────────────────────────────────

  /** Attention Required feed items */
  attentionItems: AttentionItem[] = [
    {
      id: 'att-1',
      iconText: 'PO',
      iconBg: 'var(--pm-danger-soft)',
      iconColor: 'var(--pm-danger)',
      title: '3-Way Match Failed',
      subtitle: 'Inv #1004 (TechCorp) quantity mismatch',
      buttonLabel: 'Review',
      buttonClass: 'pm-btn-danger',
      modalId: 'invoiceDetailsModal'
    },
    {
      id: 'att-2',
      iconText: 'AP',
      iconBg: 'var(--pm-warning-soft)',
      iconColor: 'var(--pm-warning)',
      title: 'Pending Dept Approvals',
      subtitle: '4 invoices awaiting IT sign-off',
      buttonLabel: 'Nudge',
      buttonClass: '',
      modalId: 'departmentApprovalModal'
    },
    {
      id: 'att-3',
      iconText: 'KYC',
      iconBg: 'var(--pm-info-soft)',
      iconColor: 'var(--pm-info)',
      title: 'Supplier KYB Pending',
      subtitle: 'Global Logistics Ltd missing KRA PIN',
      buttonLabel: 'Verify',
      buttonClass: '',
      modalId: 'kybVerificationModal'
    },
    {
      id: 'att-4',
      iconText: 'EX',
      iconBg: 'var(--pm-purple-soft)',
      iconColor: 'var(--pm-purple)',
      title: 'Unprocessed Expense Claims',
      subtitle: 'KES 112,000 from Sales Team',
      buttonLabel: 'Approve',
      buttonClass: '',
      modalId: 'approveExpenseModal'
    }
  ];

  /** Smart Suggestions feed items */
  suggestionItems: AttentionItem[] = [
    {
      id: 'sug-1',
      iconText: 'EP',
      iconBg: 'var(--pm-accent-soft)',
      iconColor: 'var(--pm-accent)',
      title: 'Early Payment Discount',
      subtitle: 'Pay OfficeMart by Fri to save KES 8,500',
      buttonLabel: 'Execute',
      buttonClass: '',
      modalId: 'earlyPaymentDiscountModal'
    },
    {
      id: 'sug-2',
      iconText: 'BP',
      iconBg: 'var(--pm-primary-light)',
      iconColor: '#fff',
      title: 'Batch 15 PesaLink Transfers',
      subtitle: 'Combine payments to reduce bank fees by 40%',
      buttonLabel: 'Batch',
      buttonClass: '',
      modalId: 'bulkPaySuppliersModal'
    },
    {
      id: 'sug-3',
      iconText: 'DP',
      iconBg: 'var(--pm-warning-soft)',
      iconColor: 'var(--pm-warning)',
      title: 'Possible Duplicate Invoice',
      subtitle: 'Inv #441 (CleanCo) matches last month',
      buttonLabel: 'Flag',
      buttonClass: '',
      modalId: 'disputeInvoiceModal'
    },
    {
      id: 'sug-4',
      iconText: 'VD',
      iconBg: 'var(--pm-info-soft)',
      iconColor: 'var(--pm-info)',
      title: 'Invite Suppliers to Portal',
      subtitle: '4 top suppliers still using email invoices',
      buttonLabel: 'Invite',
      buttonClass: '',
      modalId: 'onboardSupplierInviteModal'
    }
  ];

  /** Quick action buttons grid */
  quickActions: QuickAction[] = [
    { id: 'qa-1', iconClass: 'bi bi-cloud-arrow-up text-primary me-1', iconColor: 'default', label: 'Scan Invoice', modalId: 'uploadInvoiceModal' },
    { id: 'qa-2', iconClass: 'bi bi-file-earmark-plus text-info me-1', iconColor: 'default', label: 'Create PO', modalId: 'createPoModal' },
    { id: 'qa-3', iconClass: 'bi bi-send text-success me-1', iconColor: 'default', label: 'Pay Supplier', modalId: 'paySupplierModal' },
    { id: 'qa-4', iconClass: 'bi bi-collection-play me-1', iconColor: 'default', iconStyle: 'color:var(--pm-purple)', label: 'Bulk Run', modalId: 'bulkPaySuppliersModal' },
    { id: 'qa-5', iconClass: 'bi bi-receipt text-warning me-1', iconColor: 'default', label: 'File Expense', modalId: 'expenseClaimModal' },
    { id: 'qa-6', iconClass: 'bi bi-calendar-event text-danger me-1', iconColor: 'default', label: 'Schedule', modalId: 'schedulePaymentModal' },
    { id: 'qa-7', iconClass: 'bi bi-file-text me-1', iconColor: 'default', iconStyle: 'color:var(--pm-ink-soft)', label: 'Statements', modalId: 'supplierStatementModal' },
    { id: 'qa-8', iconClass: 'bi bi-download me-1', iconColor: 'default', iconStyle: 'color:var(--pm-accent)', label: 'Export Data', modalId: 'exportApReportModal' }
  ];

  /** Supplier directory (Section 3.6.1) */
  suppliers: Supplier[] = [
    {
      id: 'supp-1',
      name: 'TechCorp Solutions Ltd',
      kraInfo: 'KRA: P051283944L',
      category: 'IT Services',
      payMethod: 'Bank (NCBA)',
      creditTerms: 'Net 30',
      status: 'Active',
      statusBadgeClass: 'pm-badge-success',
      rating: '4.8 ⭐',
      actions: [
        { label: 'Profile', iconHtml: '', modalId: 'supplierProfileModal' },
        { label: ' ', iconHtml: '<i class="bi bi-star"></i>', modalId: 'vendorPerformanceModal' }
      ]
    },
    {
      id: 'supp-2',
      name: 'OfficeMart Stationers',
      kraInfo: 'KRA: P002239401G',
      category: 'Supplies',
      payMethod: 'M-Pesa Till 445100',
      creditTerms: 'Net 15',
      status: 'Active',
      statusBadgeClass: 'pm-badge-success',
      rating: '4.5 ⭐',
      actions: [
        { label: 'Profile', iconHtml: '', modalId: 'supplierProfileModal' },
        { label: ' ', iconHtml: '<i class="bi bi-star"></i>', modalId: 'vendorPerformanceModal' }
      ]
    },
    {
      id: 'supp-3',
      name: 'Global Logistics Hub',
      kraInfo: 'Missing KRA PIN',
      category: 'Transport',
      payMethod: 'Bank (KCB)',
      creditTerms: 'Net 45',
      status: 'KYB Pending',
      statusBadgeClass: 'pm-badge-warning',
      rating: 'New',
      actions: [
        { label: 'Verify', iconHtml: '', modalId: 'kybVerificationModal' }
      ]
    },
    {
      id: 'supp-4',
      name: 'CleanCo Janitorial',
      kraInfo: 'KRA: P089122304K',
      category: 'Facilities',
      payMethod: 'M-Pesa PayBill',
      creditTerms: 'COD',
      status: 'Active',
      statusBadgeClass: 'pm-badge-success',
      rating: '3.9 ⭐',
      actions: [
        { label: 'Profile', iconHtml: '', modalId: 'supplierProfileModal' },
        { label: ' ', iconHtml: '<i class="bi bi-star"></i>', modalId: 'vendorPerformanceModal' }
      ]
    }
  ];

  /** Invoice processing table (Section 3.6.2) */
  invoices: Invoice[] = [
    {
      id: 'inv-1',
      invNum: 'INV-1004',
      supplier: 'TechCorp Solutions',
      amount: 'KES 450,000',
      matchStatus: 'Failed: Qty',
      matchBadgeClass: 'pm-badge-danger',
      authStatus: 'IT Dept (Approved)',
      authBadgeClass: 'pm-badge-success',
      status: 'Exception',
      statusBadgeClass: 'pm-badge-warning',
      actionLabel: 'Review',
      actionModal: 'invoiceDetailsModal'
    },
    {
      id: 'inv-2',
      invNum: 'INV-4419',
      supplier: 'OfficeMart Stationers',
      amount: 'KES 12,500',
      matchStatus: 'Matched (PO-992)',
      matchBadgeClass: 'pm-badge-success',
      authStatus: 'HR Dept (Pending)',
      authBadgeClass: 'pm-badge-warning',
      status: 'Routing',
      statusBadgeClass: 'pm-badge-info',
      actionLabel: 'Nudge',
      actionModal: 'departmentApprovalModal'
    },
    {
      id: 'inv-3',
      invNum: 'INV-0092',
      supplier: 'Global Logistics',
      amount: 'KES 85,200',
      matchStatus: 'No PO',
      matchBadgeClass: 'pm-badge-dark',
      authStatus: 'Ops (Approved)',
      authBadgeClass: 'pm-badge-success',
      status: 'Ready',
      statusBadgeClass: 'pm-badge-success',
      actionLabel: 'Pay',
      actionModal: 'paySupplierModal'
    },
    {
      id: 'inv-4',
      invNum: 'INV-881A',
      supplier: 'CleanCo Janitorial',
      amount: 'KES 24,000',
      matchStatus: 'Matched (PO-995)',
      matchBadgeClass: 'pm-badge-success',
      authStatus: 'Facilities (Approved)',
      authBadgeClass: 'pm-badge-success',
      status: 'Ready',
      statusBadgeClass: 'pm-badge-success',
      actionLabel: 'Pay',
      actionModal: 'paySupplierModal'
    }
  ];

  /** Payment table (Section 3.6.3) */
  payments: Payment[] = [
    {
      id: 'pay-1',
      ref: 'BATCH-20250628-A',
      dateScheduled: 'Tomorrow, 10:00 AM',
      invoicesIncluded: '15 invoices',
      totalValue: 'KES 1,240,000',
      method: 'PesaLink (Mixed)',
      status: 'Scheduled',
      statusBadgeClass: 'pm-badge-info',
      actionLabel: 'Edit Batch',
      actionModal: 'bulkPaySuppliersModal'
    },
    {
      id: 'pay-2',
      ref: 'PMT-TC-1003',
      dateScheduled: 'Today, 2:00 PM',
      invoicesIncluded: '1 invoice (TechCorp)',
      totalValue: 'KES 200,000',
      method: 'RTGS',
      status: 'Pending Final Auth',
      statusBadgeClass: 'pm-badge-warning',
      actionLabel: 'Authorize',
      actionModal: 'paySupplierModal'
    },
    {
      id: 'pay-3',
      ref: 'BATCH-20250625-C',
      dateScheduled: '25 Jun 2025',
      invoicesIncluded: '8 invoices',
      totalValue: 'KES 412,500',
      method: 'M-Pesa B2B',
      status: 'Completed',
      statusBadgeClass: 'pm-badge-success',
      actionLabel: 'Receipts',
      actionModal: 'paymentReceiptModal'
    }
  ];

  /** Expense claims (Section 3.6.4) */
  expenseClaims: ExpenseClaim[] = [
    {
      id: 'claim-1',
      avatarInitials: 'DN',
      avatarBg: 'var(--pm-gradient-blue)',
      name: 'David N. (Sales)',
      description: 'Client dinner + Taxi · KES 14,500',
      isApproved: false,
      actionLabel: 'Review',
      actionModal: 'approveExpenseModal'
    },
    {
      id: 'claim-2',
      avatarInitials: 'MK',
      avatarBg: 'var(--pm-gradient-rose)',
      name: 'Mercy K. (Ops)',
      description: 'Office supplies · KES 8,200',
      isApproved: false,
      actionLabel: 'Review',
      actionModal: 'approveExpenseModal'
    },
    {
      id: 'claim-3',
      avatarInitials: '',
      avatarBg: 'var(--pm-info-soft)',
      name: 'Petty Cash Replenishment',
      description: 'Branch 2 · KES 50,000',
      isApproved: true
    }
  ];

  /** Aging summary rows (Section 3.6.5) */
  agingRows: AgingRow[] = [
    { label: 'Current (Not Due)', value: '1,250,000', pct: 50, color: 'var(--pm-accent)' },
    { label: '1-30 Days Past Due', value: '845,000', pct: 35, color: 'var(--pm-warning)' },
    { label: '31-60 Days Past Due', value: '210,000', pct: 10, color: 'var(--pm-danger)' }
  ];

  /** Aging detail rows (modal 11) */
  agingDetailRows: AgingDetailRow[] = [
    { id: 'ad-1', supplier: 'TechCorp Solutions', current: 'KES 0', d1to30: 'KES 450,000', d31to60: 'KES 0', d60plus: 'KES 0', total: 'KES 450,000' },
    { id: 'ad-2', supplier: 'Global Logistics', current: 'KES 85,200', d1to30: 'KES 0', d31to60: 'KES 0', d60plus: 'KES 0', total: 'KES 85,200' },
    { id: 'ad-3', supplier: 'DesignWorks Agency', current: 'KES 0', d1to30: 'KES 0', d31to60: 'KES 210,000', d60plus: 'KES 0', total: 'KES 210,000' },
    { id: 'ad-4', supplier: 'Alpha Supplies', current: 'KES 0', d1to30: 'KES 0', d31to60: 'KES 0', d60plus: 'KES 145,000', total: 'KES 145,000', totalColor: 'var(--pm-danger)' }
  ];

  /** Supplier profile invoice history (modal 2) */
  supplierHistory: SupplierHistory[] = [
    { id: 'sh-1', invNum: 'INV-1004', date: '24 Jun', amount: 'KES 450,000', status: 'Disputed', statusBadgeClass: 'pm-badge-warning' },
    { id: 'sh-2', invNum: 'INV-0992', date: '12 May', amount: 'KES 1,200,000', status: 'Paid', statusBadgeClass: 'pm-badge-success' },
    { id: 'sh-3', invNum: 'INV-0881', date: '10 Apr', amount: 'KES 800,000', status: 'Paid', statusBadgeClass: 'pm-badge-success' }
  ];

  /** Approval queue items (modal 26) */
  approvalQueueItems: ApprovalQueueItem[] = [
    { id: 'aq-1', invoice: 'INV-4419', supplier: 'OfficeMart', amount: 'KES 12,500', requestedBy: 'HR Dept', ref: 'APPR-1001' },
    { id: 'aq-2', invoice: 'INV-8822', supplier: 'CreativeHub', amount: 'KES 45,000', requestedBy: 'Marketing', ref: 'APPR-1002' }
  ];

  openQuickAction(action: { modalId?: string }): void {
    this.openModal(action.modalId || 'genericActionModal');
  }

  // ─── MODAL OPEN / CLOSE ──────────────────────────────────────────

  openModal(id: string): void {
    this.activeModal = id;
    this.loadingModal = null;
    if (id === 'addSupplierModal') { this.stepState['supp'] = 1; this.suppStep = 1; }
    if (id === 'bulkPaySuppliersModal') { this.stepState['apBulk'] = 1; this.apBulkStep = 1; }
  }

  closeModal(): void { this.activeModal = null; this.loadingModal = null; }

  @HostListener('document:keydown.escape')
  onEsc(): void { this.closeModal(); }

  isStepActive(flow: string, index: number): boolean { return (this.stepState[flow] ?? 1) === index + 1; }
  isStepCompleted(flow: string, index: number): boolean { return (this.stepState[flow] ?? 1) > index + 1; }
  getFlowButtonLabel(flow: string, total: number): string {
    const cur = this.stepState[flow] ?? 1;
    if (cur >= total) return 'Done';
    if (cur === total - 1) return 'Confirm';
    return this.flowButtonDefaults[flow] || 'Continue';
  }

  nextFlow(flow: string, total: number, modalId: string, message: string, ref: string): void {
    const cur = this.stepState[flow] ?? 1;
    if (cur >= total) { this.processAction(modalId, message, ref); return; }
    if (cur === total - 1) {
      this.loadingModal = modalId;
      setTimeout(() => {
        this.stepState[flow] = total;
        if (flow === 'supp') this.suppStep = total;
        if (flow === 'apBulk') this.apBulkStep = total;
        this.loadingModal = null;
        this.processAction(modalId, message, ref);
      }, 900);
      return;
    }
    this.stepState[flow] = cur + 1;
    if (flow === 'supp') this.suppStep = this.stepState[flow];
    if (flow === 'apBulk') this.apBulkStep = this.stepState[flow];
  }

  nextSuppStep(): void { this.nextFlow('supp', 4, 'addSupplierModal', 'Supplier onboarded.', 'SUP-1'); }
  prevSuppStep(): void { if (this.stepState['supp'] > 1) { this.stepState['supp']--; this.suppStep = this.stepState['supp']; } }
  resetSuppFlow(): void { this.stepState['supp'] = 1; this.suppStep = 1; }
  nextApBulkStep(): void { this.nextFlow('apBulk', 3, 'bulkPaySuppliersModal', 'Supplier batch submitted for approval.', 'PAY-B'); }
  resetApBulkFlow(): void { this.stepState['apBulk'] = 1; this.apBulkStep = 1; }

  switchTab(prefix: string, key: string, event: Event): void {
    this.activeTabs[prefix] = key;
    const btn = event.target as HTMLElement;
    btn?.parentElement?.querySelectorAll('.pm-tab-pill').forEach((b) => b.classList.remove('active'));
    btn?.classList.add('active');
  }

  selectRadioCard(event: Event): void {
    const card = (event.target as HTMLElement).closest('.border');
    if (!card?.parentElement) return;
    card.parentElement.querySelectorAll('.border').forEach((b) => {
      (b as HTMLElement).style.borderColor = '';
      (b as HTMLElement).style.background = '';
      const r = b.querySelector('input[type=radio]') as HTMLInputElement | null;
      if (r) r.checked = false;
    });
    (card as HTMLElement).style.borderColor = 'var(--pm-primary)';
    (card as HTMLElement).style.background = 'rgba(79,70,229,.04)';
    const radio = card.querySelector('input[type=radio]') as HTMLInputElement | null;
    if (radio) radio.checked = true;
  }

  processAction(modalId: string, msg: string, ref: string): void {
    this.loadingModal = modalId;
    setTimeout(() => {
      this.savedModals[modalId] = { message: msg, ref };
      const savedVar = modalId.replace('Modal', 'Saved');
      if (savedVar in this) (this as any)[savedVar] = true;
      this.loadingModal = null;
      this.notify(ref ? `${msg} Ref: ${ref}` : msg);
    }, 700);
  }

  getModalRows(modalId: string): string[][] {
    const map: Record<string, string[][]> = {
      approvalQueueModal: this.invoices?.filter(i => i.authStatus?.toLowerCase().includes('pending') || i.status?.toLowerCase().includes('pending')).slice(0,5).map(i => [i.invNum, i.supplier, i.amount, i.status]) ?? [],
      payableAgingModal: this.agingRows?.map(r => [r.label, r.value, `${r.pct}%`, r.color]) ?? [],
      attentionActionModal: this.attentionItems?.map(a => [a.title, a.subtitle, a.buttonLabel, 'Open']) ?? [],
      approvalQueueDetail: this.approvalQueueItems?.map(a => [a.invoice, a.supplier, a.amount, a.requestedBy]) ?? [],
    };
    return map[modalId] ?? [['Item', 'Detail', '—', 'Ready']];
  }

  openExpenseClaim(claim: ExpenseClaim | { actionModal?: string }): void {
    this.openModal((claim as ExpenseClaim)?.actionModal || 'expenseClaimModal');
  }

  notify(message: string): void { this.toastMessage = message; setTimeout(() => this.clearToast(), 3200); }
  clearToast(): void { this.toastMessage = ''; }

  resetAllModals(): void {
    this.closeModal();
    this.savedModals = {};
    this.stepState = { supp: 1, apBulk: 1 };
    this.suppStep = 1; this.apBulkStep = 1;
  }
}
