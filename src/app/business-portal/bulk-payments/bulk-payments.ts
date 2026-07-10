import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ─── INTERFACES ────────────────────────────────────────────────────────

interface FeedItem {
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

interface QuickAction {
  id: string;
  iconClass: string;
  iconColor: string;
  iconStyle?: string;
  label: string;
  modalId: string;
}

interface RecentBatch {
  id: string;
  batchId: string;
  name: string;
  type: string;
  count: string;
  totalValue: string;
  statusBadge: string;
  statusBadgeClass: string;
  actionModal: string;
  actionLabel: string;
}

interface SavedTemplate {
  id: string;
  name: string;
  count: string;
  iconBg: string;
  iconColor: string;
  modalId: string;
}

interface PendingAuth {
  id: string;
  batchId: string;
  batchType: string;
  maker: string;
  amount: string;
  statusBadge: string;
  statusBadgeClass: string;
  actionModal: string;
  actionLabel: string;
  isLocked: boolean;
}

interface FailedTransfer {
  id: string;
  beneficiary: string;
  amount: string;
  errorBadge: string;
  errorBadgeClass: string;
  actionModal: string;
  actionLabel: string;
}

interface ValidationRow {
  id: string;
  row: number;
  name: string;
  phone: string;
  phoneHasError: boolean;
  amount: string;
  amountHasError: boolean;
  statusIcon: string;
  statusText: string;
  statusHasError: boolean;
}

interface Beneficiary {
  id: string;
  name: string;
  phone: string;
  group: string;
  kycBadge: string;
  kycBadgeClass: string;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  ip: string;
  action: string;
  statusBadge: string;
  statusBadgeClass: string;
}

interface AuditTrailItem {
  id: string;
  timestamp: string;
  badge: string;
  badgeClass: string;
  description: string;
}

interface VoucherMerchant {
  id: string;
  merchant: string;
  location: string;
  redeemedToday: string;
  statusBadge: string;
  statusBadgeClass: string;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  bgStyle: string;
}

interface HealthCheckItem {
  id: string;
  name: string;
  response: string;
  statusBadge: string;
  statusBadgeClass: string;
}

interface WorkflowTier {
  id: string;
  name: string;
  description: string;
}

// ─── COMPONENT ─────────────────────────────────────────────────────────

@Component({
  selector: 'app-bulk-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bulk-payments.html',
  styleUrls: ['./bulk-payments.css'],
  encapsulation: ViewEncapsulation.None
})
export class BulkPaymentsComponent {
  activeModal: string | null = null;
  loadingModal: string | null = null;
  toastMessage = '';
  savedModals: Record<string, { message: string; ref: string }> = {};
  stepState: Record<string, number> = { nd: 1, approve: 1, fund: 1 };
  stepperLabels: Record<string, string[]> = {
    nd: ['Upload', 'Map', 'Setup', 'Submit'],
    approve: ['Review', 'Authorize', 'Done'],
    fund: ['Source', 'Amount', 'Confirm'],
  };
  modalTableHeaders: string[] = ['Item', 'Detail', 'Amount', 'Status'];

  ndStep: number = 1;
  uploadVisible: boolean = false;
  uploadPct: number = 0;

  // Tab state per prefix
  activeTabs: Record<string, string> = {
    apiTab: 'keys'
  };

  // Saved states for action modals
  newDisbursementSaved: boolean = false;
  approveBatchSaved: boolean = false;
  beneficiaryDirectorySaved: boolean = false;
  addBeneficiarySaved: boolean = false;
  failedTransfersSaved: boolean = false;
  retryTransferSaved: boolean = false;
  fundWalletSaved: boolean = false;
  scheduleDisbursementSaved: boolean = false;
  exportAnalyticsSaved: boolean = false;
  ngoProgramSaved: boolean = false;
  approvalWorkflowSaved: boolean = false;
  disbursementSettingsSaved: boolean = false;
  disputeDisbursementSaved: boolean = false;
  businessProfileSaved: boolean = false;

  // New Disbursement stepper labels
  ndStepperLabels: string[] = ['Upload', 'Map', 'Setup', 'Submit'];

  // ─── MOCK DATA ─────────────────────────────────────────────────────

  /** Attention Required feed items */
  attentionItems: FeedItem[] = [
    {
      id: 'att-1',
      iconText: 'AP',
      iconBg: 'var(--pm-warning-soft)',
      iconColor: 'var(--pm-warning)',
      title: 'Contractor Payout Batch',
      subtitle: 'Pending your approval · KES 1.2M',
      buttonLabel: 'Review',
      buttonClass: 'pm-btn pm-btn-sm pm-btn-primary',
      modalId: 'approveBatchModal'
    },
    {
      id: 'att-2',
      iconText: 'FL',
      iconBg: 'var(--pm-danger-soft)',
      iconColor: 'var(--pm-danger)',
      title: '14 Transfers Failed',
      subtitle: 'Invalid numbers in \'Relief Fund\' batch',
      buttonLabel: 'Resolve',
      buttonClass: 'pm-btn pm-btn-sm',
      modalId: 'failedTransfersModal'
    },
    {
      id: 'att-3',
      iconText: 'FL',
      iconBg: 'var(--pm-purple-soft)',
      iconColor: 'var(--pm-purple)',
      title: 'Float dropping low',
      subtitle: 'Est. run out in 2 days based on schedule',
      buttonLabel: 'Top-up',
      buttonClass: 'pm-btn pm-btn-sm',
      modalId: 'fundWalletModal'
    }
  ];

  /** System Intelligence feed items */
  intelligenceItems: FeedItem[] = [
    {
      id: 'intel-1',
      iconText: 'OP',
      iconBg: 'var(--pm-accent-soft)',
      iconColor: 'var(--pm-accent)',
      title: 'Optimize Disbursement Path',
      subtitle: 'Route 45 payments via PesaLink to save KES 1,800',
      buttonLabel: 'Apply',
      buttonClass: 'pm-btn pm-btn-sm',
      modalId: 'disbursementSettingsModal'
    },
    {
      id: 'intel-2',
      iconText: 'DD',
      iconBg: 'var(--pm-info-soft)',
      iconColor: 'var(--pm-info)',
      title: 'Duplicate Beneficiaries',
      subtitle: 'Found 12 duplicates in directory',
      buttonLabel: 'Merge',
      buttonClass: 'pm-btn pm-btn-sm',
      modalId: 'beneficiaryDirectoryModal'
    },
    {
      id: 'intel-3',
      iconText: 'AG',
      iconBg: 'var(--pm-warning-soft)',
      iconColor: 'var(--pm-warning)',
      title: 'Agri-Subsidy Engagement',
      subtitle: 'Redemption rate is down 15% this week',
      buttonLabel: 'Analyze',
      buttonClass: 'pm-btn pm-btn-sm',
      modalId: 'subsidyVoucherModal'
    }
  ];

  /** Quick action buttons grid */
  quickActions: QuickAction[] = [
    { id: 'qa-1', iconClass: 'bi bi-file-earmark-excel text-success me-1', iconColor: 'default', label: 'Upload CSV', modalId: 'newDisbursementModal' },
    { id: 'qa-2', iconClass: 'bi bi-person-lines-fill text-primary me-1', iconColor: 'default', label: 'Directory', modalId: 'beneficiaryDirectoryModal' },
    { id: 'qa-3', iconClass: 'bi bi-calendar-check text-warning me-1', iconColor: 'default', label: 'Schedule', modalId: 'scheduleDisbursementModal' },
    { id: 'qa-4', iconClass: 'bi bi-diagram-3 me-1', iconColor: 'default', iconStyle: 'color:var(--pm-purple)', label: 'Workflows', modalId: 'approvalWorkflowModal' },
    { id: 'qa-5', iconClass: 'bi bi-globe-africa text-info me-1', iconColor: 'default', label: 'NGO Programs', modalId: 'ngoProgramModal' },
    { id: 'qa-6', iconClass: 'bi bi-code-slash text-danger me-1', iconColor: 'default', label: 'API Keys', modalId: 'apiIntegrationModal' },
    { id: 'qa-7', iconClass: 'bi bi-download text-secondary me-1', iconColor: 'default', label: 'Reports', modalId: 'exportAnalyticsModal' },
    { id: 'qa-8', iconClass: 'bi bi-arrow-counterclockwise me-1', iconColor: 'default', iconStyle: 'color:var(--pm-ink)', label: 'Recall / Reverse', modalId: 'disputeDisbursementModal' }
  ];

  /** Recent Batches & Drafts table */
  recentBatches: RecentBatch[] = [
    {
      id: 'rb-1',
      batchId: 'BTH-9921',
      name: 'June Contractor Payout',
      type: 'Supplier Payments',
      count: '42',
      totalValue: 'KES 1.2M',
      statusBadge: 'Draft',
      statusBadgeClass: 'pm-badge pm-badge-warning',
      actionModal: 'newDisbursementModal',
      actionLabel: 'Resume'
    },
    {
      id: 'rb-2',
      batchId: 'BTH-9920',
      name: 'Q2 Sales Commissions',
      type: 'Salary/Wages',
      count: '118',
      totalValue: 'KES 4.5M',
      statusBadge: 'Executed',
      statusBadgeClass: 'pm-badge pm-badge-success',
      actionModal: 'batchDetailsModal',
      actionLabel: 'View'
    },
    {
      id: 'rb-3',
      batchId: 'BTH-9918',
      name: 'Customer Refunds',
      type: 'Refunds',
      count: '14',
      totalValue: 'KES 85K',
      statusBadge: 'Executed',
      statusBadgeClass: 'pm-badge pm-badge-success',
      actionModal: 'batchDetailsModal',
      actionLabel: 'View'
    },
    {
      id: 'rb-4',
      batchId: 'BTH-9915',
      name: 'Nairobi Field Agents',
      type: 'Allowances',
      count: '210',
      totalValue: 'KES 630K',
      statusBadge: 'Executed',
      statusBadgeClass: 'pm-badge pm-badge-success',
      actionModal: 'batchDetailsModal',
      actionLabel: 'View'
    }
  ];

  /** Saved Templates */
  savedTemplates: SavedTemplate[] = [
    { id: 'st-1', name: 'Monthly Field Allowances', count: '210 beneficiaries · mapped', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', modalId: 'newDisbursementModal' },
    { id: 'st-2', name: 'Office Cleaning Staff', count: '12 beneficiaries · mapped', iconBg: 'var(--pm-purple-soft)', iconColor: 'var(--pm-purple)', modalId: 'newDisbursementModal' },
    { id: 'st-3', name: 'Freelance Writers', count: '8 beneficiaries · pending updates', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', modalId: 'newDisbursementModal' }
  ];

  /** Pending Authorization table */
  pendingAuths: PendingAuth[] = [
    {
      id: 'pa-1',
      batchId: 'BTH-9922',
      batchType: 'Emergency Relief',
      maker: 'Sarah N.',
      amount: 'KES 2.5M',
      statusBadge: 'Needs Approval',
      statusBadgeClass: 'pm-badge pm-badge-warning',
      actionModal: 'approveBatchModal',
      actionLabel: 'Review',
      isLocked: false
    },
    {
      id: 'pa-2',
      batchId: 'BTH-9923',
      batchType: 'Mombasa Logistics',
      maker: 'John O.',
      amount: 'KES 850K',
      statusBadge: 'Director Auth',
      statusBadgeClass: 'pm-badge pm-badge-info',
      actionModal: 'approveBatchModal',
      actionLabel: 'Review',
      isLocked: true
    }
  ];

  /** Failed Transfers table */
  failedTransfers: FailedTransfer[] = [
    { id: 'ft-1', beneficiary: 'Alice Kemboi (0799***)', amount: 'KES 4,500', errorBadge: 'Invalid Number', errorBadgeClass: 'pm-badge pm-badge-danger', actionModal: 'retryTransferModal', actionLabel: 'Fix & Retry' },
    { id: 'ft-2', beneficiary: 'Brian Wekesa (0712***)', amount: 'KES 12,000', errorBadge: 'Limit Exceeded', errorBadgeClass: 'pm-badge pm-badge-warning', actionModal: 'retryTransferModal', actionLabel: 'Fix & Retry' },
    { id: 'ft-3', beneficiary: 'Tech Supplies Ltd', amount: 'KES 45,000', errorBadge: 'Network Timeout', errorBadgeClass: 'pm-badge pm-badge-info', actionModal: 'retryTransferModal', actionLabel: 'Fix & Retry' }
  ];

  /** Validation rows for Step 2 */
  validationRows: ValidationRow[] = [
    { id: 'vr-1', row: 1, name: 'John Doe', phone: '0712345678', phoneHasError: false, amount: '5,000', amountHasError: false, statusIcon: 'bi bi-check-circle-fill text-success', statusText: '', statusHasError: false },
    { id: 'vr-2', row: 2, name: 'Jane Smith', phone: '07991', phoneHasError: true, amount: '12,000', amountHasError: false, statusIcon: '', statusText: 'Invalid format', statusHasError: true },
    { id: 'vr-3', row: 3, name: 'Peter Kamau', phone: '0722112233', phoneHasError: false, amount: '-500', amountHasError: true, statusIcon: '', statusText: 'Negative amount', statusHasError: true }
  ];

  /** Beneficiary Directory table */
  beneficiaries: Beneficiary[] = [
    { id: 'ben-1', name: 'Jane Nduta', phone: '0712***890 (M-Pesa)', group: 'Employee', kycBadge: 'Verified', kycBadgeClass: 'pm-badge pm-badge-success' },
    { id: 'ben-2', name: 'Mark Ochieng', phone: '0733***112 (Airtel)', group: 'Supplier', kycBadge: 'Verified', kycBadgeClass: 'pm-badge pm-badge-success' },
    { id: 'ben-3', name: 'Agro Supplies Ltd', phone: '***4521 (Equity)', group: 'Supplier', kycBadge: 'Verified', kycBadgeClass: 'pm-badge pm-badge-success' },
    { id: 'ben-4', name: 'Salome Wanjiku', phone: '0700***441 (M-Pesa)', group: 'NGO/Relief', kycBadge: 'Pending ID', kycBadgeClass: 'pm-badge pm-badge-warning' },
    { id: 'ben-5', name: 'David Mutiso', phone: '0722***990 (M-Pesa)', group: 'Employee', kycBadge: 'Failed Check', kycBadgeClass: 'pm-badge pm-badge-danger' }
  ];

  /** Audit Log table */
  auditLogs: AuditLogEntry[] = [
    { id: 'al-1', timestamp: '27 Jun, 14:32', user: 'Edwin K.', ip: '192.168.1.45', action: 'Approved Batch BTH-9920', statusBadge: 'Success', statusBadgeClass: 'pm-badge pm-badge-success' },
    { id: 'al-2', timestamp: '27 Jun, 12:15', user: 'Sarah N.', ip: '192.168.1.60', action: 'Uploaded CSV for BTH-9922', statusBadge: 'Success', statusBadgeClass: 'pm-badge pm-badge-success' },
    { id: 'al-3', timestamp: '26 Jun, 09:10', user: 'System API', ip: '10.0.0.1', action: 'Webhook callback fired (118/118)', statusBadge: 'Success', statusBadgeClass: 'pm-badge pm-badge-success' },
    { id: 'al-4', timestamp: '25 Jun, 16:45', user: 'Edwin K.', ip: '192.168.1.45', action: 'Changed B2C Auto-route settings', statusBadge: 'Logged', statusBadgeClass: 'pm-badge pm-badge-warning' },
    { id: 'al-5', timestamp: '25 Jun, 11:05', user: 'Unknown', ip: '41.220.12.8', action: 'Failed login attempt', statusBadge: 'Failed', statusBadgeClass: 'pm-badge pm-badge-danger' }
  ];

  /** Batch Details Audit Trail */
  auditTrail: AuditTrailItem[] = [
    { id: 'at-1', timestamp: '15 Jun, 09:00', badge: 'Created', badgeClass: 'pm-badge pm-badge-slate', description: 'Maker: Edwin K. uploaded file' },
    { id: 'at-2', timestamp: '15 Jun, 11:30', badge: 'Approved', badgeClass: 'pm-badge pm-badge-info', description: 'Checker: Director Board authorized' },
    { id: 'at-3', timestamp: '15 Jun, 11:35', badge: 'Processing', badgeClass: 'pm-badge pm-badge-warning', description: 'API submitted 118 requests to M-Pesa' },
    { id: 'at-4', timestamp: '15 Jun, 11:42', badge: 'Completed', badgeClass: 'pm-badge pm-badge-success', description: 'All callbacks received successfully' }
  ];

  /** Voucher Merchants table */
  voucherMerchants: VoucherMerchant[] = [
    { id: 'vm-1', merchant: 'Rift Valley Agrovets (Till 44102)', location: 'Nakuru', redeemedToday: '45 Vouchers', statusBadge: 'Settled', statusBadgeClass: 'pm-badge pm-badge-success' },
    { id: 'vm-2', merchant: 'Eldoret Farmers Hub (Till 99182)', location: 'Eldoret', redeemedToday: '22 Vouchers', statusBadge: 'Pending settlement', statusBadgeClass: 'pm-badge pm-badge-warning' },
    { id: 'vm-3', merchant: 'Nyeri Supply Co (Till 11029)', location: 'Nyeri', redeemedToday: '8 Vouchers', statusBadge: 'Settled', statusBadgeClass: 'pm-badge pm-badge-success' }
  ];

  /** Notifications */
  notifications: NotificationItem[] = [
    { id: 'ntf-1', title: 'Batch Executed', description: 'BTH-9920 successfully completed. 118 records processed.', bgStyle: 'background:var(--pm-surface-2)' },
    { id: 'ntf-2', title: 'Approval Required', description: 'BTH-9922 (Emergency Relief) is waiting for checker approval.', bgStyle: 'background:var(--pm-warning-soft)' },
    { id: 'ntf-3', title: 'Float Alert', description: 'Scheduled payments for next 48h exceed available float by KES 800K.', bgStyle: 'background:var(--pm-danger-soft)' },
    { id: 'ntf-4', title: 'System Update', description: 'PesaLink routing has been optimized for lower fees.', bgStyle: 'background:var(--pm-info-soft)' }
  ];

  /** Health Check items */
  healthChecks: HealthCheckItem[] = [
    { id: 'hc-1', name: 'M-Pesa B2C Gateway', response: 'Response time: 120ms', statusBadge: 'Operational', statusBadgeClass: 'pm-badge pm-badge-success' },
    { id: 'hc-2', name: 'PesaLink Core', response: 'Response time: 450ms', statusBadge: 'Operational', statusBadgeClass: 'pm-badge pm-badge-success' },
    { id: 'hc-3', name: 'Airtel Money API', response: 'Intermittent timeouts', statusBadge: 'Degraded', statusBadgeClass: 'pm-badge pm-badge-warning' },
    { id: 'hc-4', name: 'PayMo Webhooks', response: '100% delivery success', statusBadge: 'Operational', statusBadgeClass: 'pm-badge pm-badge-success' }
  ];

  /** Workflow Tiers */
  workflowTiers: WorkflowTier[] = [
    { id: 'wt-1', name: 'Tier 1: Up to KES 100K', description: '1 Maker, 1 Checker (Manager)' },
    { id: 'wt-2', name: 'Tier 2: Up to KES 1M', description: '1 Maker, 1 Checker (Director)' },
    { id: 'wt-3', name: 'Tier 3: Above KES 1M', description: '1 Maker, 2 Checkers (CFO + Board)' }
  ];

  // ─── MODAL OPEN / CLOSE ──────────────────────────────────────────


  openModal(id: string): void {
    this.activeModal = id;
    this.loadingModal = null;
    // reset relevant flow
    if (id === 'newDisbursementModal') { this.stepState['nd'] = 1; this.ndStep = 1; this.newDisbursementSaved = false; this.uploadVisible = false; this.uploadPct = 0; }
    if (id === 'approveBatchModal') this.stepState['approve'] = 1;
    if (id === 'fundWalletModal') this.stepState['fund'] = 1;
  }

  closeModal(): void {
    this.activeModal = null;
    this.loadingModal = null;
  }

  @HostListener('document:keydown.escape')
  onEsc(): void { this.closeModal(); }

  isStepActive(flow: string, index: number): boolean { return (this.stepState[flow] ?? 1) === index + 1; }
  isStepCompleted(flow: string, index: number): boolean { return (this.stepState[flow] ?? 1) > index + 1; }
  getFlowButtonLabel(flow: string, total: number): string {
    const cur = this.stepState[flow] ?? 1;
    if (cur >= total) return 'Done';
    if (cur === total - 1) return 'Execute';
    return 'Continue';
  }

  nextFlow(flow: string, total: number, modalId: string, message: string, ref: string): void {
    const cur = this.stepState[flow] ?? 1;
    if (cur >= total) {
      this.processAction(modalId, message, ref);
      return;
    }
    if (cur === total - 1) {
      this.loadingModal = modalId;
      setTimeout(() => {
        this.stepState[flow] = total;
        this.loadingModal = null;
        this.processAction(modalId, message, ref);
      }, 900);
      return;
    }
    this.stepState[flow] = cur + 1;
    if (flow === 'nd') this.ndStep = this.stepState[flow];
  }

  nextNdStep(): void {
    this.nextFlow('nd', 4, 'newDisbursementModal', 'Batch validated and sent to checker for approval.', 'BTH-9924');
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
      approveBatchModal: [['BTH-9922', 'Emergency Relief', 'KES 2.5M', 'Needs Approval'], ['BTH-9923', 'Mombasa Logistics', 'KES 850K', 'Director Auth']],
      beneficiaryDirectoryModal: this.beneficiaries?.map(b => [b.name, b.phone, b.group, b.kycBadge]) ?? [],
      failedTransfersModal: this.failedTransfers?.map(f => [f.beneficiary, f.amount, f.errorBadge, f.actionLabel]) ?? [],
      batchDetailsModal: [['Created', 'Maker submitted', '—', 'Done'], ['Approved', 'Checker signed', '—', 'Done'], ['Executing', 'Payouts in flight', 'KES 4.5M', 'Live']],
      auditLogModal: this.auditLogs?.slice(0, 5).map(a => [a.timestamp, a.user, a.action, a.statusBadge]) ?? [],
      attentionActionModal: this.attentionItems?.map(a => [a.title, a.subtitle, a.buttonLabel, 'Open']) ?? [],
      healthCheckModal: this.healthChecks?.map(h => [h.name, h.response, h.statusBadge, 'OK']) ?? [],
    };
    return map[modalId] ?? [['Sample', 'Detail', '—', 'Ready']];
  }

  simulateUpload(): void {
    this.uploadVisible = true;
    this.uploadPct = 0;
    const tick = () => {
      if (this.uploadPct >= 100) return;
      this.uploadPct += 20;
      setTimeout(tick, 180);
    };
    tick();
  }

  selectTemplate(_event?: Event): void { this.notify('Template selected'); this.ndStep = 2; this.stepState['nd'] = 2; }

  moveFocus(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.value?.length === 1 && input.nextElementSibling) (input.nextElementSibling as HTMLInputElement).focus();
  }

  switchTab(prefix: string, key: string, event: Event): void {
    this.activeTabs[prefix] = key;
    const btn = event.target as HTMLElement;
    btn?.parentElement?.querySelectorAll('.pm-tab-pill').forEach((b) => b.classList.remove('active'));
    btn?.classList.add('active');
  }

  getStepState(index: number): string {
    if (this.ndStep > index + 1) return 'completed';
    if (this.ndStep === index + 1) return 'active';
    return '';
  }

  notify(message: string): void { this.toastMessage = message || 'Action completed.'; setTimeout(() => this.clearToast(), 3200); }
  clearToast(): void { this.toastMessage = ''; }

}
