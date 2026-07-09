import { Component, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule, ModalDirective } from 'ngx-bootstrap/modal';


/* ─── Data Models ─── */
export interface Customer {
  name: string;
  type: string;
  kyc: string;
  accounts: number;
  status: string;
  last: string;
}

export interface Account {
  num: string;
  cust: string;
  type: string;
  bal: string;
  status: string;
  opened: string;
}

export interface Ticket {
  t: string;
  c: string;
  s: string;
  p: string;
  st: string;
  a: string;
  u: string;
}

export interface OnboardFlow {
  current: number;
  total: number;
  labels: string[];
}

/* ─── Component ─── */
@Component({
  selector: 'app-customer-account',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalModule],
  templateUrl: './customer-account.html',
  styleUrls: ['./customer-account.css'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerAccountComponent implements OnInit {

  /* ─── Data Arrays (replace with API calls) ─── */
  customers: Customer[] = [
    { name: 'Peter Ochieng', type: 'Retail', kyc: 'Pending', accounts: 2, status: 'Active', last: '26 Jun' },
    { name: 'Grace Wanjiku Ltd', type: 'Corporate', kyc: 'Approved', accounts: 4, status: 'Active', last: '27 Jun' },
    { name: 'Samuel Kipchoge', type: 'Retail', kyc: 'Rejected', accounts: 1, status: 'Suspended', last: '24 Jun' },
    { name: 'Amina Hassan', type: 'SME', kyc: 'Approved', accounts: 3, status: 'Active', last: '25 Jun' },
    { name: 'John Kamau', type: 'Retail', kyc: 'Pending', accounts: 1, status: 'Active', last: '27 Jun' }
  ];

  accounts: Account[] = [
    { num: 'ACC-20240115-1122', cust: 'Peter Ochieng', type: 'Current', bal: 'KES 124,500', status: 'Active', opened: '15 Jan 2024' },
    { num: 'ACC-20240302-3344', cust: 'Grace Wanjiku Ltd', type: 'Savings', bal: 'KES 2,847,200', status: 'Active', opened: '02 Mar 2024' },
    { num: 'ACC-20240511-5566', cust: 'Samuel Kipchoge', type: 'Current', bal: 'KES 8,200', status: 'Suspended', opened: '11 May 2024' }
  ];

  tickets: Ticket[] = [
    { t: 'TKT-8821', c: 'Peter Ochieng', s: 'KYC document rejected', p: 'Medium', st: 'In Progress', a: 'Grace M.', u: '27 Jun' },
    { t: 'TKT-8834', c: 'Grace Wanjiku Ltd', s: 'Statement not received', p: 'Low', st: 'Open', a: 'Unassigned', u: '26 Jun' },
    { t: 'TKT-8847', c: 'Samuel Kipchoge', s: 'Card not working', p: 'High', st: 'Awaiting Customer', a: 'James K.', u: '25 Jun' }
  ];

  /* ─── Tab State ─── */
  kycTab = 'pending';
  permTab = 'roles';
  tixTab = 'open';
  tdTab = 'details';

  /* ─── Stepper State ─── */
  onboardFlow: OnboardFlow = { current: 1, total: 4, labels: ['Type', 'Info', 'Docs', 'Done'] };
  onboardLoading = false;
  onboardSuccess = false;
  onboardSuccessMsg = '';
  onboardSuccessRef = '';

  /* ─── Loading & Action State ─── */
  loadingModalId: string | null = null;
  actionResult: { modalId: string; msg: string; ref: string } | null = null;

  /* ─── Search / Filter ─── */
  customerSearch = '';
  customerStatusFilter = 'All Status';
  customerTypeFilter = 'All Types';

  /* ─── Selected Box (onboard type) ─── */
  selectedBox: string | null = null;

  /* ─── Modal Directives ─── */
  @ViewChild('onboardCustomerModal') onboardCustomerModal!: ModalDirective;
  @ViewChild('kycReviewModal') kycReviewModal!: ModalDirective;
  @ViewChild('openAccountModal') openAccountModal!: ModalDirective;
  @ViewChild('closeAccountModal') closeAccountModal!: ModalDirective;
  @ViewChild('permissionModal') permissionModal!: ModalDirective;
  @ViewChild('statementModal') statementModal!: ModalDirective;
  @ViewChild('supportTicketsModal') supportTicketsModal!: ModalDirective;
  @ViewChild('ticketDetailModal') ticketDetailModal!: ModalDirective;
  @ViewChild('bulkUploadModal') bulkUploadModal!: ModalDirective;
  @ViewChild('amlReviewModal') amlReviewModal!: ModalDirective;
  @ViewChild('linkExternalModal') linkExternalModal!: ModalDirective;
  @ViewChild('apiKeyModal') apiKeyModal!: ModalDirective;
  @ViewChild('createTicketModal') createTicketModal!: ModalDirective;
  @ViewChild('reportModal') reportModal!: ModalDirective;
  @ViewChild('commModal') commModal!: ModalDirective;
  @ViewChild('attentionModal') attentionModal!: ModalDirective;
  @ViewChild('kycHealthModal') kycHealthModal!: ModalDirective;
  @ViewChild('profileModal') profileModal!: ModalDirective;
  @ViewChild('bulkKycApproveModal') bulkKycApproveModal!: ModalDirective;
  @ViewChild('apiKeyModal2') apiKeyModal2!: ModalDirective;
  @ViewChild('ticketDetailModal2') ticketDetailModal2!: ModalDirective;
  @ViewChild('caseExportModal') caseExportModal!: ModalDirective;
  @ViewChild('feeCalcModal') feeCalcModal!: ModalDirective;

  ngOnInit(): void {
    // Data loaded from arrays above; replace with API service calls
  }

  /* ─── Modal Open / Close ─── */
  openM(modalId: string): void {
    const modalMap: Record<string, ModalDirective> = {
      'onboardCustomerModal': this.onboardCustomerModal,
      'kycReviewModal': this.kycReviewModal,
      'openAccountModal': this.openAccountModal,
      'closeAccountModal': this.closeAccountModal,
      'permissionModal': this.permissionModal,
      'statementModal': this.statementModal,
      'supportTicketsModal': this.supportTicketsModal,
      'ticketDetailModal': this.ticketDetailModal,
      'bulkUploadModal': this.bulkUploadModal,
      'amlReviewModal': this.amlReviewModal,
      'linkExternalModal': this.linkExternalModal,
      'apiKeyModal': this.apiKeyModal,
      'createTicketModal': this.createTicketModal,
      'reportModal': this.reportModal,
      'commModal': this.commModal,
      'attentionModal': this.attentionModal,
      'kycHealthModal': this.kycHealthModal,
      'profileModal': this.profileModal,
      'bulkKycApproveModal': this.bulkKycApproveModal,
      'apiKeyModal2': this.apiKeyModal2,
      'ticketDetailModal2': this.ticketDetailModal2,
      'caseExportModal': this.caseExportModal,
      'feeCalcModal': this.feeCalcModal
    };
    const modal = modalMap[modalId];
    if (modal) {
      modal.show();
    }
  }

  closeModal(): void {
    const allModals = [
      this.onboardCustomerModal, this.kycReviewModal, this.openAccountModal,
      this.closeAccountModal, this.permissionModal, this.statementModal,
      this.supportTicketsModal, this.ticketDetailModal, this.bulkUploadModal,
      this.amlReviewModal, this.linkExternalModal, this.apiKeyModal,
      this.createTicketModal, this.reportModal, this.commModal,
      this.attentionModal, this.kycHealthModal, this.profileModal,
      this.bulkKycApproveModal, this.apiKeyModal2, this.ticketDetailModal2,
      this.caseExportModal, this.feeCalcModal
    ];
    for (const modal of allModals) {
      if (modal && modal.isShown) {
        modal.hide();
      }
    }
  }

  /* ─── Tab Switching ─── */
  sw(prefix: string, key: string): void {
    if (prefix === 'kyc') this.kycTab = key;
    if (prefix === 'perm') this.permTab = key;
    if (prefix === 'tix') this.tixTab = key;
    if (prefix === 'td') this.tdTab = key;
  }

  isTabActive(prefix: string, key: string): boolean {
    if (prefix === 'kyc') return this.kycTab === key;
    if (prefix === 'perm') return this.permTab === key;
    if (prefix === 'tix') return this.tixTab === key;
    if (prefix === 'td') return this.tdTab === key;
    return false;
  }

  /* ─── Stepper / Flow ─── */
  renderStepper(): string[] {
    const f = this.onboardFlow;
    const result: string[] = [];
    for (let i = 0; i < f.labels.length; i++) {
      const stepNum = i + 1;
      const isDone = stepNum < f.current;
      const isActive = stepNum === f.current;
      const cls = isDone ? 'done' : (isActive ? 'active' : '');
      const numContent = isDone ? '<i class="bi bi-check"></i>' : String(stepNum);
      result.push(`${cls}|${numContent}|${f.labels[i]}`);
    }
    return result;
  }

  isFlowStepActive(stepNum: number): boolean {
    return this.onboardFlow.current === stepNum;
  }

  nextFlow(): void {
    const f = this.onboardFlow;
    if (f.current === f.total - 1) {
      this.onboardLoading = true;
      setTimeout(() => {
        this.onboardLoading = false;
        this.onboardSuccess = true;
        this.onboardSuccessMsg = 'Customer Onboarded Successfully';
        this.onboardSuccessRef = 'CUS-20250627-8841';
        f.current = f.total;
      }, 1500);
      return;
    }
    if (f.current >= f.total) {
      this.onboardCustomerModal.hide();
      this.resetOnboard();
      return;
    }
    f.current++;
  }

  resetOnboard(): void {
    this.onboardFlow.current = 1;
    this.onboardSuccess = false;
    this.onboardSuccessMsg = '';
    this.onboardSuccessRef = '';
    this.onboardLoading = false;
    this.selectedBox = null;
  }

  /* ─── Select Box (customer type) ─── */
  selectBox(type: string): void {
    this.selectedBox = type;
  }

  isBoxSelected(type: string): boolean {
    return this.selectedBox === type;
  }

  /* ─── Action / Loading ─── */
  doAction(modalId: string, msg: string, ref: string): void {
    this.loadingModalId = modalId;
    setTimeout(() => {
      this.loadingModalId = null;
      this.actionResult = { modalId, msg, ref };
    }, 1500);
  }

  isLoading(modalId: string): boolean {
    return this.loadingModalId === modalId;
  }

  hasResult(modalId: string): boolean {
    return this.actionResult?.modalId === modalId;
  }

  getResultMsg(modalId: string): string {
    return this.actionResult?.modalId === modalId ? this.actionResult.msg : '';
  }

  getResultRef(modalId: string): string {
    return this.actionResult?.modalId === modalId ? this.actionResult.ref : '';
  }

  clearResult(modalId: string): void {
    if (this.actionResult?.modalId === modalId) {
      this.actionResult = null;
    }
  }

  /* ─── Badge Helpers ─── */
  kycBadgeClass(kyc: string): string {
    if (kyc === 'Pending') return 'B-w';
    if (kyc === 'Approved') return 'B-s';
    return 'B-d';
  }

  statusBadgeClass(status: string): string {
    if (status === 'Active') return 'B-s';
    return 'B-d';
  }

  priorityBadgeClass(p: string): string {
    if (p === 'High') return 'B-d';
    if (p === 'Medium') return 'B-w';
    return 'B-s';
  }

  ticketStatusClass(st: string): string {
    if (st === 'In Progress') return 'B-i';
    if (st === 'Open') return 'B-s';
    return 'B-w';
  }

  /* ─── Filtered Customers ─── */
  get filteredCustomers(): Customer[] {
    return this.customers.filter(c => {
      const matchSearch = !this.customerSearch ||
        c.name.toLowerCase().includes(this.customerSearch.toLowerCase());
      const matchStatus = this.customerStatusFilter === 'All Status' || c.status === this.customerStatusFilter;
      const matchType = this.customerTypeFilter === 'All Types' || c.type === this.customerTypeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }
}