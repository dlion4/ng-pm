import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ============================================================
// DATA INTERFACES - Ready for dynamic API connection
// ============================================================

export interface KraPin {
  pin: string;
  entity: string;
  type: string;
  status: 'compliant' | 'due_soon' | 'overdue';
  nextDue: string;
  amount: number;
  taxType: string;
}

export interface TaxActivity {
  date: string;
  pin: string;
  type: string;
  amount: number;
  status: 'paid' | 'filed' | 'overdue' | 'processing';
  ref: string;
}

export interface GovService {
  service: string;
  ref: string;
  amount: number;
  status: 'ready_to_pay' | 'paid' | 'processing';
  dueDate: string;
  provider: string;
}

export interface CountyPayment {
  county: string;
  service: string;
  amount: number;
  accountNumber: string;
}

export interface ArdhisasaService {
  service: string;
  lrNumber: string;
  amount: number;
}

export interface ScheduledPayment {
  name: string;
  frequency: string;
  nextDate: string;
  method: string;
  status: 'active' | 'paused';
}

export interface AttentionItem {
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  detail: string;
  action: string;
  actionType: 'danger' | 'normal';
  modalTarget: string;
}

export interface SmartSuggestion {
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  detail: string;
  action: string;
  modalTarget: string;
}

export interface GovTransaction {
  date: string;
  service: string;
  provider: string;
  amount: number;
  method: string;
  status: 'success' | 'filed' | 'processing';
  ref: string;
}

export interface ComplianceEntity {
  name: string;
  score: number;
  issues: string;
  nextAction: string;
}

export interface NotificationItem {
  title: string;
  detail: string;
  bg: string;
  textColor: string;
}

export interface TaxOptimizerOpportunity {
  opportunity: string;
  saving: number;
  action: string;
}

export interface FlowStep {
  current: number;
  total: number;
  labels: string[];
}

// ============================================================
// COMPONENT
// ============================================================

@Component({
  selector: 'app-governance-integration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './government-integration.html',
  styleUrls: ['./government-integration.css'],
  encapsulation: ViewEncapsulation.None
})
export class GovernmentComponent implements OnInit, OnDestroy {

  // ============================================================
  // MODAL STATE - All 20+ modals
  // ============================================================
  activeModal: string | null = null;

  // ============================================================
  // FLOW STEPPERS - Multi-step modal state
  // ============================================================
  flows: Record<string, FlowStep> = {
    kra: { current: 1, total: 4, labels: ['Obligation', 'Details', 'Confirm', 'Done'] },
    file: { current: 1, total: 4, labels: ['Select', 'Upload', 'Submit', 'Done'] },
    bulk: { current: 1, total: 3, labels: ['Upload', 'Validate', 'Done'] }
  };

  // ============================================================
  // LOADING STATE
  // ============================================================
  isProcessing = false;
  processingMessage = 'Processing...';

  // ============================================================
  // FORM MODELS - Two-way binding ready
  // ============================================================
  payKraForm = {
    pin: 'A012345678Y',
    taxType: 'PAYE',
    amount: 42800,
    method: 'wallet',
    schedule: 'immediate'
  };

  fileReturnForm = {
    pin: 'P987654321Z',
    period: 'June 2025',
    payImmediately: true,
    autoFile: true
  };

  payECitizenForm = {
    service: 'Passport Renewal',
    ref: 'P-449281',
    method: 'mpesa'
  };

  payCountyForm = {
    county: 'Nairobi City County',
    service: 'Single Business Permit',
    account: 'NCC-882910',
    method: 'mpesa'
  };

  payArdhisasaForm = {
    service: 'Title Deed Processing',
    lrNumber: 'LR-209/881',
    method: 'wallet'
  };

  scheduleTaxForm = {
    pin: 'P987654321Z',
    amount: 84200,
    frequency: 'Monthly',
    startDate: '2025-07-05',
    method: 'wallet'
  };

  addKraForm = {
    pin: '',
    entityType: 'Individual',
    entityName: '',
    defaultMethod: 'wallet',
    autoSync: true
  };

  syncItaxForm = {
    fullSync: true,
    paymentHistory: true,
    refundStatus: false
  };

  disputeKraForm = {
    pin: 'C112233445W',
    assessmentRef: 'CGT-2025-6621',
    reason: 'The capital gains calculation does not account for improvement costs of KES 1.2M incurred in 2023.',
    documents: null as File | null
  };

  // ============================================================
  // DYNAMIC DATA - Replace with API calls
  // ============================================================
  kraPins: KraPin[] = [
    { pin: 'A012345678Y', entity: 'James Kamau (Personal)', type: 'individual', status: 'compliant', nextDue: '15 Jul — PAYE', amount: 42800, taxType: 'PAYE' },
    { pin: 'P987654321Z', entity: 'JK Holdings Ltd', type: 'company', status: 'due_soon', nextDue: '05 Jul — VAT', amount: 84200, taxType: 'VAT' },
    { pin: 'R445566778X', entity: 'Rental Portfolio', type: 'individual', status: 'compliant', nextDue: '20 Jul — TOT', amount: 18600, taxType: 'TOT' },
    { pin: 'C112233445W', entity: 'JK Investments', type: 'company', status: 'overdue', nextDue: '25 Jun — CGT', amount: 62000, taxType: 'CGT' }
  ];

  taxActivities: TaxActivity[] = [
    { date: '25 Jun', pin: 'A012345678Y', type: 'PAYE', amount: 42800, status: 'paid', ref: 'ITX-882341' },
    { date: '22 Jun', pin: 'P987654321Z', type: 'VAT', amount: 84200, status: 'filed', ref: 'ITX-881902' },
    { date: '18 Jun', pin: 'C112233445W', type: 'CGT', amount: 62000, status: 'overdue', ref: 'ITX-880117' }
  ];

  govServices: GovService[] = [
    { service: 'Passport Renewal', ref: 'P-449281', amount: 4500, status: 'ready_to_pay', dueDate: '30 Jun 2025', provider: 'eCitizen' },
    { service: 'Driving Licence Renewal', ref: 'DL-882910', amount: 3200, status: 'paid', dueDate: '15 Aug 2025', provider: 'eCitizen' },
    { service: 'Police Clearance', ref: 'PC-334102', amount: 1000, status: 'processing', dueDate: '28 Jun 2025', provider: 'eCitizen' },
    { service: 'Business Registration (LLC)', ref: 'BN-991827', amount: 12500, status: 'paid', dueDate: '—', provider: 'eCitizen' }
  ];

  countyPayments: CountyPayment[] = [
    { county: 'Nairobi City County', service: 'Single Business Permit', amount: 18500, accountNumber: 'NCC-882910' },
    { county: 'Kiambu County', service: 'Land Rates', amount: 42300, accountNumber: 'KMB-445211' },
    { county: 'Nakuru County', service: 'Health Permit', amount: 7800, accountNumber: 'NKR-778291' }
  ];

  ardhisasaServices: ArdhisasaService[] = [
    { service: 'Title Deed Processing', lrNumber: 'LR-209/881', amount: 28500 },
    { service: 'Stamp Duty — Property Transfer', lrNumber: 'LR-209/881', amount: 124000 },
    { service: 'Lease Renewal', lrNumber: 'LR-334102', amount: 15200 }
  ];

  scheduledPayments: ScheduledPayment[] = [
    { name: 'PAYE — Personal', frequency: 'Monthly • 15th • Auto from Wallet', nextDate: '15 Jul', method: 'Wallet', status: 'active' },
    { name: 'VAT — JK Holdings', frequency: 'Monthly • 5th • M-Pesa', nextDate: '05 Jul', method: 'M-Pesa', status: 'active' },
    { name: 'TOT — Rental Portfolio', frequency: 'Quarterly • Next: 20 Jul', nextDate: '20 Jul', method: 'Wallet', status: 'paused' }
  ];

  attentionItems: AttentionItem[] = [
    { icon: 'bi-receipt-cutoff', iconColor: 'var(--pm-danger)', iconBg: 'var(--pm-danger-soft)', title: 'VAT return due in 2 days', detail: 'KRA PIN A012345678Y · KES 84,200', action: 'File', actionType: 'danger', modalTarget: 'fileReturnModal' },
    { icon: 'bi-bank', iconColor: 'var(--pm-warning)', iconBg: 'var(--pm-warning-soft)', title: 'CGT on property sale pending', detail: 'KES 62,000 due 15 Jul', action: 'Pay', actionType: 'normal', modalTarget: 'payKRAModal' },
    { icon: 'bi-file-earmark-text', iconColor: 'var(--pm-info)', iconBg: 'var(--pm-info-soft)', title: 'eCitizen passport renewal ready', detail: 'Application #P-449281 · Pay KES 4,500', action: 'Pay', actionType: 'normal', modalTarget: 'payECitizenModal' }
  ];

  smartSuggestions: SmartSuggestion[] = [
    { icon: 'bi-calendar-check', iconColor: 'var(--pm-accent)', iconBg: 'var(--pm-accent-soft)', title: 'File PAYE early for 5-day relief', detail: 'Save KES 8,400 in penalties', action: 'File Early', modalTarget: 'fileReturnModal' },
    { icon: 'bi-graph-up', iconColor: 'var(--pm-purple)', iconBg: 'var(--pm-purple-soft)', title: 'Claim additional rental income relief', detail: 'KES 124,000 unclaimed', action: 'Claim', modalTarget: 'taxOptimizerModal' },
    { icon: 'bi-building', iconColor: 'var(--pm-warning)', iconBg: 'var(--pm-warning-soft)', title: 'Renew 3 county business permits', detail: 'Nairobi, Kiambu, Nakuru', action: 'Renew', modalTarget: 'payCountyModal' }
  ];

  govTransactions: GovTransaction[] = [
    { date: '25 Jun', service: 'PAYE', provider: 'KRA', amount: 42800, method: 'M-Pesa', status: 'success', ref: 'ITX-882341' },
    { date: '22 Jun', service: 'VAT Return', provider: 'KRA', amount: 84200, method: 'Wallet', status: 'filed', ref: 'ITX-881902' },
    { date: '18 Jun', service: 'Passport Renewal', provider: 'eCitizen', amount: 4500, method: 'Bank', status: 'processing', ref: 'EC-449281' },
    { date: '15 Jun', service: 'Land Rates', provider: 'Nairobi County', amount: 42300, method: 'M-Pesa', status: 'success', ref: 'CCN-772910' }
  ];

  complianceEntities: ComplianceEntity[] = [
    { name: 'James Kamau', score: 98, issues: 'None', nextAction: 'PAYE 15 Jul' },
    { name: 'JK Holdings', score: 92, issues: 'VAT due soon', nextAction: 'File 05 Jul' },
    { name: 'JK Investments', score: 78, issues: 'CGT overdue', nextAction: 'Pay immediately' }
  ];

  notifications: NotificationItem[] = [
    { title: 'VAT return due in 2 days', detail: 'P987654321Z · File before 05 Jul', bg: 'var(--pm-danger-soft)', textColor: '#7F1D1D' },
    { title: 'CGT overdue', detail: 'C112233445W · Pay immediately', bg: 'var(--pm-warning-soft)', textColor: '#92400E' },
    { title: 'Passport application update', detail: 'P-449281 · Biometric stage', bg: 'var(--pm-info-soft)', textColor: '#1E40AF' },
    { title: 'Land rates payment confirmed', detail: 'Nairobi County · Receipt available', bg: 'var(--pm-accent-soft)', textColor: '#065F46' }
  ];

  optimizerOpportunities: TaxOptimizerOpportunity[] = [
    { opportunity: 'Claim additional rental income relief', saving: 31200, action: 'Claim' },
    { opportunity: 'Investment deduction (solar)', saving: 12400, action: 'Add' },
    { opportunity: 'Early filing penalty avoidance', saving: 4200, action: 'File Early' }
  ];

  // Tax history (full)
  fullTaxHistory: TaxActivity[] = [
    { date: '25 Jun', pin: 'A012345678Y', type: 'PAYE', amount: 42800, status: 'paid', ref: 'ITX-882341' },
    { date: '22 Jun', pin: 'P987654321Z', type: 'VAT', amount: 84200, status: 'filed', ref: 'ITX-881902' },
    { date: '15 Jun', pin: 'R445566778X', type: 'TOT', amount: 18600, status: 'paid', ref: 'ITX-880991' }
  ];

  // Gov history (full)
  fullGovHistory: GovTransaction[] = [
    { date: '18 Jun', service: 'Passport Renewal', provider: 'eCitizen', amount: 4500, method: 'Bank', status: 'processing', ref: 'P-449281' },
    { date: '15 Jun', service: 'Land Rates', provider: 'Nairobi County', amount: 42300, method: 'M-Pesa', status: 'success', ref: 'CCN-772910' }
  ];

  // ============================================================
  // HERO STATS - Dynamic data
  // ============================================================
  heroStats = {
    linkedPins: 4,
    dueAmount: 184200,
    dueCount: 5,
    complianceScore: 94,
    savings: 47800,
    payeRelief: 31200,
    investmentDeductions: 16600
  };

  // ============================================================
  // PROFILE DATA
  // ============================================================
  profile = {
    name: 'James Kamau',
    email: 'james.kamau@email.com',
    phone: '+254 712 345 890',
    initials: 'JK',
    kraPinsCount: 4,
    complianceScore: 94,
    memberSince: 'Mar 2022',
    openCases: 2
  };

  // ============================================================
  // SEARCH
  // ============================================================
  searchQuery = '';

  // ============================================================
  // LIFECYCLE
  // ============================================================
  ngOnInit(): void {
    // Initialize steppers
    Object.keys(this.flows).forEach(key => {
      this.renderStepper(key);
    });
  }

  ngOnDestroy(): void {
    this.closeAllModals();
  }

  // ============================================================
  // MODAL SYSTEM - Pure Angular, no Bootstrap JS
  // ============================================================
  openModal(modalId: string): void {
    this.activeModal = modalId;
    document.body.classList.add('modal-open');
    // Reset flows if opening a stepper modal
    if (modalId === 'payKRAModal') this.resetFlow('kra');
    if (modalId === 'fileReturnModal') this.resetFlow('file');
    if (modalId === 'bulkTaxModal') this.resetFlow('bulk');
  }

  closeModal(): void {
    this.activeModal = null;
    document.body.classList.remove('modal-open');
    this.isProcessing = false;
  }

  closeAllModals(): void {
    this.closeModal();
  }

  isModalOpen(modalId: string): boolean {
    return this.activeModal === modalId;
  }

  // ============================================================
  // FLOW STEPPER LOGIC
  // ============================================================
  resetFlow(key: string): void {
    this.flows[key].current = 1;
  }

  nextFlow(key: string): void {
    const flow = this.flows[key];
    if (flow.current === flow.total - 1) {
      // Show loading before final step
      this.showLoading(() => {
        flow.current = flow.total;
      });
      return;
    }
    if (flow.current >= flow.total) {
      this.closeModal();
      return;
    }
    flow.current++;
  }

  prevFlow(key: string): void {
    const flow = this.flows[key];
    if (flow.current > 1) {
      flow.current--;
    }
  }

  getFlowButtonText(key: string): string {
    const flow = this.flows[key];
    if (flow.current === flow.total - 1) {
      if (key === 'kra') return 'Pay Now';
      if (key === 'file') return 'Submit & Pay';
      return 'Execute';
    }
    if (flow.current >= flow.total) return 'Done';
    return 'Continue';
  }

  getFlowButtonIcon(key: string): string {
    const flow = this.flows[key];
    if (flow.current === flow.total - 1) {
      if (key === 'kra') return 'bi-lock';
      if (key === 'file') return 'bi-send';
      return 'bi-check-lg';
    }
    return 'bi-arrow-right';
  }

  // ============================================================
  // STEPPER RENDERING
  // ============================================================
  renderStepper(key: string): void {
    // Stepper state is computed in template via isStepActive/isStepDone
  }

  isStepActive(key: string, stepIndex: number): boolean {
    return this.flows[key].current === stepIndex;
  }

  isStepDone(key: string, stepIndex: number): boolean {
    return this.flows[key].current > stepIndex;
  }

  // ============================================================
  // LOADING / PROCESSING
  // ============================================================
  showLoading(callback: () => void): void {
    this.isProcessing = true;
    setTimeout(() => {
      this.isProcessing = false;
      callback();
    }, 1500);
  }

  // ============================================================
  // SIMPLE ACTION MODALS (non-stepper)
  // ============================================================
  doAction(modalId: string, successMessage: string, ref: string): void {
    this.showLoading(() => {
      // Replace modal content with success receipt
      this.processingMessage = successMessage;
      // Close modal after showing success
      setTimeout(() => {
        this.closeModal();
      }, 2000);
    });
  }

  // ============================================================
  // PIN INPUT AUTO-FOCUS
  // ============================================================
  onPinInput(event: Event, index: number, inputs: HTMLInputElement[]): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  }

  // ============================================================
  // SEARCH HANDLER
  // ============================================================
  onSearch(): void {
    // TODO: Connect to search API
    console.log('Search:', this.searchQuery);
  }

  // ============================================================
  // FILE UPLOAD HANDLER
  // ============================================================
  onFileUpload(event: Event, formField: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (formField === 'dispute') {
      this.disputeKraForm.documents = file;
    }
  }

  // ============================================================
  // UTILITY HELPERS
  // ============================================================
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'compliant':
      case 'paid':
      case 'success':
        return 'B-s';
      case 'due_soon':
      case 'filed':
      case 'warning':
        return 'B-w';
      case 'overdue':
      case 'danger':
        return 'B-d';
      case 'processing':
      case 'info':
        return 'B-i';
      case 'ready_to_pay':
        return 'B-w';
      default:
        return 'B-s';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'compliant': return 'Compliant';
      case 'due_soon': return 'Due Soon';
      case 'overdue': return 'Overdue';
      case 'paid': return 'Paid';
      case 'filed': return 'Filed';
      case 'success': return 'Success';
      case 'processing': return 'Processing';
      case 'ready_to_pay': return 'Ready to Pay';
      default: return status;
    }
  }

  formatAmount(amount: number): string {
    return 'KES ' + amount.toLocaleString();
  }

  // ============================================================
  // DYNAMIC DATA LOADING METHODS - Call these from API
  // ============================================================
  loadKraPins(): void {
    // TODO: this.kraPins = await api.getKraPins();
  }

  loadTaxActivities(): void {
    // TODO: this.taxActivities = await api.getTaxActivities();
  }

  loadGovServices(): void {
    // TODO: this.govServices = await api.getGovServices();
  }

  loadGovTransactions(): void {
    // TODO: this.govTransactions = await api.getGovTransactions();
  }

  loadComplianceData(): void {
    // TODO: this.complianceEntities = await api.getComplianceData();
  }

  loadNotifications(): void {
    // TODO: this.notifications = await api.getNotifications();
  }

  loadOptimizerData(): void {
    // TODO: this.optimizerOpportunities = await api.getOptimizerData();
  }
  downloadTemplateAlert(): void {
    alert('Template downloaded');
  }
}