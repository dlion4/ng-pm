import { Component, TemplateRef, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';

// ═══════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════
export interface SourceAccount { value: string; label: string; }
export interface BankOption { name: string; }
export interface RailOption { name: string; time: string; selected: boolean; }
export interface ManualRail { value: string; label: string; }
export interface RailComparison { name: string; time: string; fee: string; success: string; limit: string; recommendation: string; badgeClass: string; }
export interface RailHealth { name: string; status: string; badgeClass: string; latency: string; success: string; queue: number; lastSync: string; }
export interface RailDetailStats { connectedBanks: number; apiHealth: string; cutoff: string; volume: string; avgTime: string; fee: string; }
export interface Beneficiary { name: string; account: string; bank: string; lastUsed: string; }
export interface Draft { ref: string; beneficiary: string; amount: string; created: string; }
export interface Notification { title: string; subtitle: string; bgColor: string; textColor: string; }
export interface NotifPref { event: string; push: boolean; sms: boolean; email: boolean; webhook: boolean; }
export interface ProfileStat { label: string; value: string; color?: string; }
export interface FeePreview { platformFee: string; railFee: string; totalFees: string; }
export interface QuickTransfer { from: string; to: string; amount: string; rail: string; }
export interface NewBeneficiary { name: string; nickname: string; bank: string; account: string; }
export interface NewAccount { type: string; provider: string; number: string; currency: string; }
export interface DegradedRail { message: string; }

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════
@Component({
  selector: 'app-initiate-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalModule],
  providers: [BsModalService],
  templateUrl: './initiate-transfer.html',
  styleUrls: ['./initiate-transfer.css'],
  encapsulation: ViewEncapsulation.None
})
export class InitiateTransferComponent implements OnInit {

  // ─── Modal Reference ───
  modalRef?: BsModalRef;

  // ─── Template References ───
  // Modal templates defined in HTML
  @ViewChild('templateTpl') templateTpl!: TemplateRef<any>;
  @ViewChild('newTransferTpl') newTransferTpl!: TemplateRef<any>;
  @ViewChild('bulkUploadTpl') bulkUploadTpl!: TemplateRef<any>;
  @ViewChild('railCompareTpl') railCompareTpl!: TemplateRef<any>;
  @ViewChild('uploadDocTpl') uploadDocTpl!: TemplateRef<any>;
  @ViewChild('termsTpl') termsTpl!: TemplateRef<any>;
  @ViewChild('profileTpl') profileTpl!: TemplateRef<any>;
  @ViewChild('railHealthTpl') railHealthTpl!: TemplateRef<any>;
  @ViewChild('railDetailTpl') railDetailTpl!: TemplateRef<any>;

  // Modal templates referenced in TS methods
  @ViewChild('verifyAccountLoadingTpl') verifyAccountLoadingTpl!: TemplateRef<any>;
  @ViewChild('miniVerifiedTpl') miniVerifiedTpl!: TemplateRef<any>;
  @ViewChild('beneficiarySelectedTpl') beneficiarySelectedTpl!: TemplateRef<any>;
  @ViewChild('loadDraftTpl') loadDraftTpl!: TemplateRef<any>;
  @ViewChild('draftSavedTpl') draftSavedTpl!: TemplateRef<any>;
  @ViewChild('submitSuccessTpl') submitSuccessTpl!: TemplateRef<any>;
  @ViewChild('docUploadedTpl') docUploadedTpl!: TemplateRef<any>;

  // ═══════════════════════════════════════════════════════════════
  // HERO STATS
  // ═══════════════════════════════════════════════════════════════
  engineStats = {
    totalProcessed: 'KES 124.7M',
    rails: 12,
    successRate: '98.9%',
    avgSettlement: '4.2s'
  };

  todayStats = {
    count: '2,841',
    completed: '2,812',
    inProgress: '29',
    failed: '0'
  };

  settlementStats = {
    avgTime: '4.2s',
    vsYesterday: '-0.8s',
    mpesaTime: '2.1s',
    pesalinkTime: '3.4s',
    rtgsTime: '8.7s'
  };

  pendingApproval = {
    count: '14',
    highValue: '7',
    amount: '48.3M'
  };

  // ═══════════════════════════════════════════════════════════════
  // TRANSFER TYPE
  // ═══════════════════════════════════════════════════════════════
  transferType: 'single' | 'bulk' | 'recurring' = 'single';
  transferMode: 'standard' | 'instant' = 'standard';
  recurringFrequency = 'Weekly';
  recurringEndDate = '2025-12-31';

  // ═══════════════════════════════════════════════════════════════
  // SENDER
  // ═══════════════════════════════════════════════════════════════
  sourceAccounts: SourceAccount[] = [
    { value: 'float', label: 'PayMo KES Float (M-Pesa) • KES 124.7M' },
    { value: 'nostro', label: 'PayMo KES Nostro (KCB) • KES 89.4M' },
    { value: 'usd', label: 'PayMo USD Nostro • USD 2.8M' },
    { value: 'client', label: 'Client Segregated • KES 31.2M' }
  ];
  selectedSourceAccount = 'float';

  senderStats = {
    available: 'KES 124,700,000',
    dailyLimit: 'KES 500,000,000 (24.9% used)'
  };

  // ═══════════════════════════════════════════════════════════════
  // RECEIVER
  // ═══════════════════════════════════════════════════════════════
  beneficiaryType: 'bank' | 'mobile' | 'wallet' = 'bank';
  banks = ['KCB Bank Kenya', 'Equity Bank', 'Co-operative Bank', 'Stanbic Bank', 'NCBA Bank', 'ABSA Bank Kenya'];
  selectedBank = 'KCB Bank Kenya';
  accountNumber = '1234567890';
  accountVerified = false;
  verifiedAccountName = 'James K. Mwangi';
  mobileNetworks = ['Safaricom M-Pesa', 'Airtel Money', 'Telkom T-Kash'];
  selectedNetwork = 'Safaricom M-Pesa';
  phoneNumber = '0712345678';
  walletId = '';
  saveToAddressBook = true;

  // ═══════════════════════════════════════════════════════════════
  // AMOUNT & CURRENCY
  // ═══════════════════════════════════════════════════════════════
  transferAmount = '250000';
  currencies = ['KES', 'USD', 'EUR', 'UGX', 'TZS'];
  selectedCurrency = 'KES';

  feeBreakdown = {
    platformFee: 'KES 125',
    railFee: 'KES 50',
    fxSpread: 'KES 0',
    totalDebit: 'KES 250,175'
  };

  // ═══════════════════════════════════════════════════════════════
  // PAYMENT RAIL
  // ═══════════════════════════════════════════════════════════════
  railMode: 'smart' | 'manual' = 'smart';
  smartRail = {
    name: 'PesaLink',
    recommendation: 'Recommended',
    time: '3.4s',
    fee: 'KES 50'
  };
  railOptions: RailOption[] = [
    { name: 'M-Pesa', time: '2.1s', selected: false },
    { name: 'PesaLink', time: '3.4s', selected: true },
    { name: 'RTGS', time: '8.7s', selected: false }
  ];
  manualRails: ManualRail[] = [
    { value: 'pesalink', label: 'PesaLink (KES 50 • 3.4s)' },
    { value: 'mpesa', label: 'M-Pesa STK (KES 35 • 2.1s)' },
    { value: 'rtgs', label: 'RTGS (KES 200 • 8.7s)' },
    { value: 'swift', label: 'SWIFT (KES 2,500 • 1-3 days)' },
    { value: 'eaps', label: 'EAPS (KES 180 • 2m)' }
  ];
  selectedManualRail = 'pesalink';

  railComparison: RailComparison[] = [
    { name: 'PesaLink', time: '3.4s', fee: 'KES 50', success: '99.4%', limit: 'KES 1M', recommendation: 'Best balance', badgeClass: 'B-s' },
    { name: 'M-Pesa STK', time: '2.1s', fee: 'KES 35', success: '99.7%', limit: 'KES 300K', recommendation: 'Fastest', badgeClass: 'B-i' },
    { name: 'RTGS', time: '8.7s', fee: 'KES 200', success: '99.9%', limit: 'Unlimited', recommendation: 'High value', badgeClass: 'B-p' },
    { name: 'SWIFT', time: '1-3d', fee: 'KES 2,500', success: '97.8%', limit: 'Unlimited', recommendation: 'International', badgeClass: 'B-w' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // PURPOSE & COMPLIANCE
  // ═══════════════════════════════════════════════════════════════
  purposeCodes = ['Salary / Wages', 'Supplier Payment', 'Loan Disbursement', 'Dividend', 'Refund', 'Tax Payment', 'Other'];
  selectedPurpose = 'Salary / Wages';
  transferNarration = 'June 2025 Payroll - Engineering';
  docCount = 0;
  docTypes = ['Invoice / Contract', 'Salary Schedule', 'Tax Payment Advice', 'Loan Agreement', 'Other'];
  docType = 'Invoice / Contract';
  docDescription = 'June 2025 payroll for Engineering team (47 employees)';
  docUploadMessage = 'Invoice uploaded and attached. 3 documents now linked to this transfer.';
  urgentPriority = false;

  // ═══════════════════════════════════════════════════════════════
  // AUTHORIZATION
  // ═══════════════════════════════════════════════════════════════
  authChain = {
    maker: 'James K. (You)',
    checker: 'Grace W. (Finance)',
    approver: 'Peter O. (Treasury)'
  };
  scheduleExecution = '2025-06-27T14:00';
  require2FA = true;

  // ═══════════════════════════════════════════════════════════════
  // TRANSFER SUMMARY
  // ═══════════════════════════════════════════════════════════════
  summary = {
    from: 'PayMo KES Float',
    to: 'James K. Mwangi (KCB)',
    amount: 'KES 250,000',
    totalDebit: 'KES 250,175',
    rail: 'PesaLink',
    eta: '3.4 seconds',
    ref: 'PAY-20250627-8841',
    riskScore: 'Low (12)'
  };
  termsAccepted = true;
  submitRef = 'PAY-20250627-8841';
  draftRef = 'DRAFT-9918';

  // ═══════════════════════════════════════════════════════════════
  // RAIL HEALTH
  // ═══════════════════════════════════════════════════════════════
  railHealth: RailHealth[] = [
    { name: 'M-Pesa', status: 'Healthy', badgeClass: 'B-s', latency: '210ms', success: '99.7%', queue: 142, lastSync: '14:32:01' },
    { name: 'PesaLink', status: 'Healthy', badgeClass: 'B-s', latency: '340ms', success: '99.4%', queue: 87, lastSync: '14:31:58' },
    { name: 'RTGS', status: 'Healthy', badgeClass: 'B-s', latency: '870ms', success: '99.9%', queue: 12, lastSync: '14:30:00' },
    { name: 'SWIFT', status: 'Degraded', badgeClass: 'B-w', latency: '2.1s', success: '97.8%', queue: 31, lastSync: '14:25:12' }
  ];
  selectedRailDetail: RailHealth | null = null;
  railDetailStats: RailDetailStats = {
    connectedBanks: 31,
    apiHealth: '99.4%',
    cutoff: '15:30 EAT',
    volume: 'KES 18.4B',
    avgTime: '3.4s',
    fee: 'KES 50 flat'
  };

  // ═══════════════════════════════════════════════════════════════
  // BENEFICIARIES
  // ═══════════════════════════════════════════════════════════════
  allBeneficiaries: Beneficiary[] = [
    { name: 'James K. Mwangi', account: '1234567890', bank: 'KCB', lastUsed: '25 Jun' },
    { name: 'Grace Wanjiku', account: '0712345678', bank: 'M-Pesa', lastUsed: '24 Jun' },
    { name: 'Peter Ochieng', account: '9876543210', bank: 'Equity', lastUsed: '20 Jun' }
  ];
  beneficiarySearch = '';
  selectedBeneficiaryData: Beneficiary | null = null;
  newBeneficiary: NewBeneficiary = {
    name: 'Sarah Njeri',
    nickname: 'Sarah - Supplier',
    bank: 'KCB',
    account: '0712987654'
  };

  // ═══════════════════════════════════════════════════════════════
  // DRAFTS
  // ═══════════════════════════════════════════════════════════════
  drafts: Draft[] = [
    { ref: 'DRAFT-9912', beneficiary: 'James K. Mwangi', amount: 'KES 250,000', created: '26 Jun' },
    { ref: 'DRAFT-9908', beneficiary: 'Grace Wanjiku', amount: 'KES 85,000', created: '25 Jun' },
    { ref: 'DRAFT-9901', beneficiary: 'Peter Ochieng', amount: 'KES 1,200,000', created: '24 Jun' }
  ];
  selectedDraft: Draft | null = null;

  // ═══════════════════════════════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════
  notifications: Notification[] = [
    { title: 'High-value transfer pending approval', subtitle: 'KES 12.4M to KCB • Ref PAY-20250627-8841', bgColor: 'var(--pm-danger-soft)', textColor: '#7F1D1D' },
    { title: 'Bulk upload 487 rows validated', subtitle: '3 validation warnings • ready for approval', bgColor: 'var(--pm-warning-soft)', textColor: '#92400E' },
    { title: 'SWIFT rail degraded', subtitle: 'Success rate 97.8% • fallback to RTGS recommended', bgColor: 'var(--pm-info-soft)', textColor: '#1E40AF' },
    { title: 'Transfer completed', subtitle: 'PAY-20250627-8834 • KES 85,000 to Grace W.', bgColor: 'var(--pm-accent-soft)', textColor: '#065F46' }
  ];

  notifPrefs: NotifPref[] = [
    { event: 'Transfer submitted', push: true, sms: false, email: true, webhook: true },
    { event: 'Transfer completed', push: true, sms: true, email: true, webhook: true },
    { event: 'Approval required', push: true, sms: true, email: true, webhook: true },
    { event: 'Rail degraded', push: true, sms: false, email: true, webhook: true },
    { event: 'High-value alert', push: true, sms: true, email: true, webhook: true }
  ];

  // ═══════════════════════════════════════════════════════════════
  // PROFILE
  // ═══════════════════════════════════════════════════════════════
  profile = {
    initials: 'JK',
    name: 'James Kamau',
    email: 'james.kamau@company.co.ke',
    phone: '+254 712 345 890'
  };
  profileStats: ProfileStat[] = [
    { label: 'Role', value: 'Treasury Manager' },
    { label: 'Approval Limit', value: 'KES 50M' },
    { label: 'Transfers Today', value: '47' },
    { label: '2FA', value: 'Enabled', color: 'var(--pm-accent)' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // FEE CALCULATOR
  // ═══════════════════════════════════════════════════════════════
  feeCalc = { rail: 'PesaLink', amount: '250000' };
  feeCalcRails = ['PesaLink', 'M-Pesa STK', 'RTGS', 'SWIFT'];
  feePreview: FeePreview = {
    platformFee: 'KES 125',
    railFee: 'KES 50',
    totalFees: 'KES 175'
  };

  // ═══════════════════════════════════════════════════════════════
  // QUICK TRANSFER
  // ═══════════════════════════════════════════════════════════════
  quickTransfer: QuickTransfer = { from: 'float', to: 'james', amount: '50000', rail: 'PesaLink' };
  quickBeneficiaries = [
    { value: 'james', label: 'James K. Mwangi (KCB 1234567890)' },
    { value: 'grace', label: 'Grace W. (M-Pesa 0712***890)' },
    { value: 'peter', label: 'Peter O. (Equity 9876543210)' }
  ];
  quickRails = ['PesaLink', 'M-Pesa STK', 'RTGS'];

  // ═══════════════════════════════════════════════════════════════
  // NEW ACCOUNT
  // ═══════════════════════════════════════════════════════════════
  newAccount: NewAccount = { type: 'Bank Nostro', provider: 'KCB Bank', number: '1234567890', currency: 'KES' };
  accountTypes = ['Bank Nostro', 'Mobile Money Float', 'Client Segregated'];
  accountProviders = ['KCB Bank', 'Equity Bank', 'Safaricom (M-Pesa)'];

  // ═══════════════════════════════════════════════════════════════
  // BULK
  // ═══════════════════════════════════════════════════════════════
  bulkSourceAccount = 'float';
  validateBeforeSubmit = true;
  bulkStats = { ready: '487', warnings: '3', errors: '0' };

  // ═══════════════════════════════════════════════════════════════
  // DEGRADED RAIL
  // ═══════════════════════════════════════════════════════════════
  degradedRail: DegradedRail = {
    message: 'SWIFT rail is currently degraded (97.8% success). Consider using RTGS or PesaLink for time-sensitive transfers.'
  };

  // ═══════════════════════════════════════════════════════════════
  // TERMS
  // ═══════════════════════════════════════════════════════════════
  termsText = `By submitting this transfer you agree to PayMo's Terms of Service, the specific rail operator terms (Safaricom, IPSL, CBK, SWIFT), and applicable regulatory requirements (CBK, KRA, AML/CFT). All transfers are final once processed. You confirm you have verified the beneficiary details and purpose. PayMo reserves the right to hold or reverse any transaction suspected of fraud, money laundering, or regulatory breach. For disputes, contact support within 30 days.`;

  // ═══════════════════════════════════════════════════════════════
  // LOADING
  // ═══════════════════════════════════════════════════════════════
  loading = false;
  loadingMessage = 'Processing...';

  // ─── Constructor ───
  constructor(private modalService: BsModalService) { }

  // ─── Lifecycle ───
  ngOnInit(): void {
    this.calcTotal();
  }

  // ═══════════════════════════════════════════════════════════════
  // MODAL METHODS
  // ═══════════════════════════════════════════════════════════════
  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
      backdrop: 'static',
      keyboard: true
    });
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = undefined;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // TAB SWITCHING
  // ═══════════════════════════════════════════════════════════════
  switchTransferType(type: 'single' | 'bulk' | 'recurring'): void {
    this.transferType = type;
  }

  switchBeneficiaryType(type: 'bank' | 'mobile' | 'wallet'): void {
    this.beneficiaryType = type;
  }

  switchRailMode(mode: 'smart' | 'manual'): void {
    this.railMode = mode;
  }

  // ═══════════════════════════════════════════════════════════════
  // ACCOUNT VERIFICATION
  // ═══════════════════════════════════════════════════════════════
  validateAccount(): void {
    this.accountVerified = this.accountNumber.length > 8;
  }

  verifyAccount(): void {
    this.openModal(this.verifyAccountLoadingTpl);
    setTimeout(() => {
      this.closeModal();
      this.openModal(this.miniVerifiedTpl);
    }, 1500);
  }

  // ═══════════════════════════════════════════════════════════════
  // FEE CALCULATION
  // ═══════════════════════════════════════════════════════════════
  calcTotal(): void {
    const amt = parseFloat(this.transferAmount) || 250000;
    const platformFee = Math.round(amt * 0.0005);
    this.feeBreakdown = {
      platformFee: `KES ${platformFee}`,
      railFee: 'KES 50',
      fxSpread: 'KES 0',
      totalDebit: `KES ${(amt + platformFee + 50).toLocaleString()}`
    };
  }

  updateFeePreview(): void {
    const amt = parseFloat(this.feeCalc.amount) || 250000;
    const platformFee = Math.round(amt * 0.0005);
    this.feePreview = {
      platformFee: `KES ${platformFee}`,
      railFee: 'KES 50',
      totalFees: `KES ${platformFee + 50}`
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // BENEFICIARY ACTIONS
  // ═══════════════════════════════════════════════════════════════
  get filteredBeneficiaries(): Beneficiary[] {
    if (!this.beneficiarySearch) return this.allBeneficiaries;
    const term = this.beneficiarySearch.toLowerCase();
    return this.allBeneficiaries.filter(b =>
      b.name.toLowerCase().includes(term) ||
      b.account.toLowerCase().includes(term) ||
      b.bank.toLowerCase().includes(term)
    );
  }

  selectBeneficiary(ben: Beneficiary): void {
    this.selectedBeneficiaryData = ben;
    this.closeModal();
    setTimeout(() => {
      this.openModal(this.beneficiarySelectedTpl);
    }, 300);
  }

  // ═══════════════════════════════════════════════════════════════
  // DRAFT ACTIONS
  // ═══════════════════════════════════════════════════════════════
  loadDraft(draft: Draft): void {
    this.selectedDraft = draft;
    this.closeModal();
    setTimeout(() => {
      this.openModal(this.loadDraftTpl);
    }, 300);
  }

  saveDraft(): void {
    this.openModal(this.draftSavedTpl);
  }

  // ═══════════════════════════════════════════════════════════════
  // TRANSFER ACTIONS
  // ═══════════════════════════════════════════════════════════════
  submitTransfer(): void {
    this.openModal(this.submitSuccessTpl);
  }

  // ═══════════════════════════════════════════════════════════════
  // DOCUMENT ACTIONS
  // ═══════════════════════════════════════════════════════════════
  onFileSelected(event: Event): void {
    // Handle file selection
    console.log('File selected');
  }

  onDocSelected(event: Event): void {
    // Handle document selection
    console.log('Document selected');
  }

  uploadDoc(): void {
    this.docCount++;
    this.closeModal();
    setTimeout(() => {
      this.openModal(this.docUploadedTpl);
    }, 300);
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILITY ACTIONS
  // ═══════════════════════════════════════════════════════════════
  doAction(message: string): void {
    this.loading = true;
    this.loadingMessage = 'Processing...';
    setTimeout(() => {
      this.loading = false;
      console.log(message);
      this.closeModal();
    }, 1500);
  }

  downloadReceipt(): void {
    console.log('Downloading receipt...');
  }

  shareTransfer(): void {
    console.log('Sharing transfer...');
  }
}