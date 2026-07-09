import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ─── INTERFACES ────────────────────────────────────────────────────────

interface PageBarButton {
  id: string;
  iconClass: string;
  label: string;
  extraClass?: string;
  modalId: string;
}

interface HeroStatButton {
  label: string;
  modalId: string;
  style?: string;
  extraClass?: string;
  fullWidth?: boolean;
}

interface HeroStatBadge {
  icon: string;
  label: string;
  badgeClass: string;
}

interface HeroStatProgress {
  label: string;
  pct: number;
  color: string;
}

interface HeroStat {
  id: string;
  colClass: string;
  isAccent: boolean;
  cardStyle?: string;
  labelStyle?: string;
  label: string;
  dotColor?: string;
  value: string;
  valueStyle?: string;
  description?: string;
  badge?: HeroStatBadge;
  progress?: HeroStatProgress;
  extraInfoText?: string;
  extraInfoBold?: string;
  buttons: HeroStatButton[];
  buttonsInAccentGroup?: boolean;
}

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

interface IssuedCard {
  id: string;
  avatarInitials: string;
  avatarBg?: string;
  name: string;
  department: string;
  cardType: string;
  limit: string;
  statusBadge: string;
  statusBadgeClass: string;
  actionModal: string;
  actionLabel: string;
}

interface ConfigStatus {
  id: string;
  label: string;
  description: string;
  modalId: string;
  actionLabel: string;
}

interface PolicyGroup {
  id: string;
  name: string;
  rules: string;
  employeeCount: number;
  isHighlighted?: boolean;
}

interface ApprovalItem {
  id: string;
  avatarInitials: string;
  employeeName: string;
  merchant: string;
  amount: string;
  flagBadge: string;
  flagBadgeClass: string;
}

interface ReceiptStat {
  id: string;
  label: string;
  value: string;
  valueColor?: string;
}

interface ExpenseTransaction {
  id: string;
  date: string;
  employee: string;
  merchant: string;
  amount: string;
  category: string;
  receiptBadge: string;
  receiptBadgeClass: string;
  receiptIcon: string;
  actionModal: string;
  actionLabel: string;
}

interface BillingStatus {
  id: string;
  label: string;
  description: string;
  rightType: 'badge' | 'text';
  rightBadgeClass?: string;
  rightText: string;
}

interface Settlement {
  id: string;
  period: string;
  amount: string;
  statusBadge: string;
  statusBadgeClass: string;
  settledDate: string;
}

interface ReceiptDonut {
  matchedPct: number;
  missingPct: number;
  missingOffset: number;
  label: string;
}

interface ProgramInfo {
  icon: string;
  title: string;
  details: string[];
}

interface StatementBalance {
  label: string;
  amount: string;
  dueDate: string;
}

// ─── COMPONENT ─────────────────────────────────────────────────────────

@Component({
  selector: 'app-business-cards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './business-cards.html',
  styleUrls: ['./business-cards.css'],
  encapsulation: ViewEncapsulation.None
})
export class BusinessCardsComponent {
  activeModal: string | null = null;
  issueStep: number = 1;

  // Tab state per prefix (e.g. { policy: 'groups', fundTab: 'deposit' })
  activeTabs: Record<string, string> = {
    policy: 'groups',
    fundTab: 'deposit'
  };

  // Saved states for action modals
  bulkIssueSaved: boolean = false;
  policyRulesSaved: boolean = false;
  createPolicySaved: boolean = false;
  reviewTransactionSaved: boolean = false;
  reconciliationSaved: boolean = false;
  uploadReceiptSaved: boolean = false;
  manageEmployeeCardSaved: boolean = false;
  editLimitSaved: boolean = false;
  expenseDetailSaved: boolean = false;
  violationDetailsSaved: boolean = false;
  fundingSaved: boolean = false;
  reportsSaved: boolean = false;
  settlementSaved: boolean = false;
  billingSetupSaved: boolean = false;
  brandingSaved: boolean = false;

  // Issue card stepper labels
  issueStepperLabels: string[] = ['Assignment', 'Controls', 'Delivery', 'Done'];

  // ─── MOCK DATA ─────────────────────────────────────────────────────

  /** Page bar action buttons */
  pageBarButtons: PageBarButton[] = [
    { id: 'pb-policies', iconClass: 'bi bi-shield-lock', label: 'Policies', modalId: 'policyRulesModal' },
    { id: 'pb-recon', iconClass: 'bi bi-journal-check', label: 'Recon', modalId: 'reconciliationModal' },
    { id: 'pb-issue', iconClass: 'bi bi-plus-lg', label: 'Issue Card', extraClass: 'pm-btn-primary', modalId: 'issueCardModal' },
  ];

  /** Hero stats row – 4 cards */
  heroStats: HeroStat[] = [
    {
      id: 'active-cards',
      colClass: 'col-lg-4',
      isAccent: true,
      label: 'Corporate card program active',
      dotColor: '#86efac',
      value: '42 Active Cards',
      valueStyle: 'margin:8px 0;color:#fff',
      description: '38 employee cards, 4 department cards linked to the centralized Acme Corp billing account.',
      buttons: [
        { label: 'Issue New', modalId: 'issueCardModal', style: 'background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.22);color:#fff' },
        { label: 'View Directory', modalId: 'cardRosterModal', style: 'background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.22);color:#fff' },
        { label: 'Fund Program', modalId: 'fundingModal', style: 'background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.22);color:#fff' },
      ],
      buttonsInAccentGroup: true,
    },
    {
      id: 'pending-approvals',
      colClass: 'col-lg-2 col-md-4 col-6',
      isAccent: false,
      labelStyle: 'color:var(--pm-warning)',
      label: 'PENDING APPROVALS',
      value: 'KES 485K',
      badge: { icon: 'bi-clock', label: '8 transactions', badgeClass: 'pm-badge-warning' },
      buttons: [
        { label: 'Review Queue', modalId: 'approvalQueueModal', fullWidth: true },
      ],
    },
    {
      id: 'total-spend',
      colClass: 'col-lg-3 col-md-4 col-6',
      isAccent: false,
      labelStyle: 'color:var(--pm-info)',
      label: 'TOTAL SPEND (MTD)',
      value: 'KES 2.4M',
      badge: { icon: 'bi-graph-down-arrow', label: '12% under budget', badgeClass: 'pm-badge-success' },
      progress: { label: 'Company budget limit', pct: 86, color: 'var(--pm-info)' },
      buttons: [],
    },
    {
      id: 'missing-receipts',
      colClass: 'col-lg-3 col-md-4',
      isAccent: false,
      cardStyle: 'min-height:170px;border-left:3px solid var(--pm-danger)',
      labelStyle: 'color:var(--pm-danger)',
      label: 'MISSING RECEIPTS',
      value: '14 items',
      badge: { icon: 'bi-exclamation-triangle', label: 'KES 312,400 unverified', badgeClass: 'pm-badge-danger' },
      extraInfoText: 'Oldest missing:',
      extraInfoBold: '12 days ago',
      buttons: [
        { label: 'Chase Employees', modalId: 'missingReceiptsModal', extraClass: 'text-danger border-danger' },
      ],
    },
  ];

  /** Attention Required feed items */
  attentionItems: FeedItem[] = [
    {
      id: 'att-1',
      iconText: 'AP',
      iconBg: 'var(--pm-warning-soft)',
      iconColor: 'var(--pm-warning)',
      title: 'Large software purchase approval',
      subtitle: 'S. Kamau · AWS AWS EMEA · KES 145,000',
      buttonLabel: 'Review',
      buttonClass: 'pm-btn-primary',
      modalId: 'reviewTransactionModal',
    },
    {
      id: 'att-2',
      iconText: 'MR',
      iconBg: 'var(--pm-danger-soft)',
      iconColor: 'var(--pm-danger)',
      title: 'Missing receipt over grace period',
      subtitle: 'P. Ochieng · Emirates Air · KES 85,200',
      buttonLabel: 'Chase',
      buttonClass: '',
      modalId: 'missingReceiptsModal',
    },
    {
      id: 'att-3',
      iconText: 'PV',
      iconBg: 'var(--pm-purple-soft)',
      iconColor: 'var(--pm-purple)',
      title: 'Policy violation detected',
      subtitle: 'J. Njoroge · Weekend spend (blocked)',
      buttonLabel: 'Inspect',
      buttonClass: '',
      modalId: 'violationDetailsModal',
    },
    {
      id: 'att-4',
      iconText: 'BL',
      iconBg: 'var(--pm-info-soft)',
      iconColor: 'var(--pm-info)',
      title: 'Marketing Card approaching limit',
      subtitle: 'KES 490K / 500K used · Reset in 4 days',
      buttonLabel: 'Top-up',
      buttonClass: '',
      modalId: 'editLimitModal',
    },
  ];

  /** Smart Recommendations feed items */
  recommendationItems: FeedItem[] = [
    {
      id: 'rec-1',
      iconText: 'SA',
      iconBg: 'var(--pm-accent-soft)',
      iconColor: 'var(--pm-accent)',
      title: 'Auto-approve recurring software',
      subtitle: 'Save 4 hours/month on SaaS approvals',
      buttonLabel: 'Automate',
      buttonClass: '',
      modalId: 'policyRulesModal',
    },
    {
      id: 'rec-2',
      iconText: 'MC',
      iconBg: 'var(--pm-info-soft)',
      iconColor: 'var(--pm-info)',
      title: 'Consolidate AWS spending',
      subtitle: '4 employees using personal cards for AWS',
      buttonLabel: 'Issue Card',
      buttonClass: '',
      modalId: 'issueCardModal',
    },
    {
      id: 'rec-3',
      iconText: 'VR',
      iconBg: 'var(--pm-warning-soft)',
      iconColor: 'var(--pm-warning)',
      title: 'Vendor redundancy detected',
      subtitle: 'Uber & Bolt used interchangeably',
      buttonLabel: 'Report',
      buttonClass: '',
      modalId: 'reportsModal',
    },
    {
      id: 'rec-4',
      iconText: 'FR',
      iconBg: 'var(--pm-danger-soft)',
      iconColor: 'var(--pm-danger)',
      title: 'Dormant cards present',
      subtitle: '3 issued cards not used in 90+ days',
      buttonLabel: 'Review',
      buttonClass: '',
      modalId: 'cardRosterModal',
    },
  ];

  /** Quick action buttons grid */
  quickActions: QuickAction[] = [
    { id: 'qa-1', iconClass: 'bi bi-plus-circle', iconColor: 'text-success', label: 'Issue Card', modalId: 'issueCardModal' },
    { id: 'qa-2', iconClass: 'bi bi-people', iconColor: 'text-primary', label: 'Bulk Upload', modalId: 'bulkIssueModal' },
    { id: 'qa-3', iconClass: 'bi bi-shield-lock', iconColor: 'text-warning', label: 'Policy Rules', modalId: 'policyRulesModal' },
    { id: 'qa-4', iconClass: 'bi bi-check-circle', iconColor: '', iconStyle: 'color:var(--pm-purple)', label: 'Approvals', modalId: 'approvalQueueModal', },
    { id: 'qa-5', iconClass: 'bi bi-journal-check', iconColor: 'text-info', label: 'Accounting', modalId: 'reconciliationModal' },
    { id: 'qa-6', iconClass: 'bi bi-bar-chart', iconColor: 'text-danger', label: 'Reporting', modalId: 'reportsModal' },
    { id: 'qa-7', iconClass: 'bi bi-receipt', iconColor: '', iconStyle: 'color:var(--pm-primary)', label: 'Receipts', modalId: 'missingReceiptsModal' },
    { id: 'qa-8', iconClass: 'bi bi-cash', iconColor: 'text-success', label: 'Program Funding', modalId: 'fundingModal' },
  ];

  /** Recently issued cards table (Section 5.6.1) */
  issuedCards: IssuedCard[] = [
    {
      id: 'ic-1',
      avatarInitials: 'SK',
      name: 'Sarah Kamau',
      department: 'Engineering',
      cardType: 'Virtual',
      limit: '150,000 /mo',
      statusBadge: 'Active',
      statusBadgeClass: 'pm-badge-success',
      actionModal: 'manageEmployeeCardModal',
      actionLabel: 'Manage',
    },
    {
      id: 'ic-2',
      avatarInitials: 'M',
      avatarBg: 'var(--pm-danger)',
      name: 'Marketing Dept',
      department: 'Shared Procurement',
      cardType: 'Virtual',
      limit: '500,000 /mo',
      statusBadge: 'Active',
      statusBadgeClass: 'pm-badge-success',
      actionModal: 'manageEmployeeCardModal',
      actionLabel: 'Manage',
    },
    {
      id: 'ic-3',
      avatarInitials: 'PO',
      avatarBg: 'var(--pm-warning)',
      name: 'Peter Ochieng',
      department: 'Sales',
      cardType: 'Physical',
      limit: '80,000 /mo',
      statusBadge: 'Dispatched',
      statusBadgeClass: 'pm-badge-info',
      actionModal: 'cardDeliveryModal',
      actionLabel: 'Track',
    },
    {
      id: 'ic-4',
      avatarInitials: 'P1',
      name: 'Project Alpha',
      department: 'Vendor Payments',
      cardType: 'Virtual',
      limit: '1,000,000 fixed',
      statusBadge: 'Active',
      statusBadgeClass: 'pm-badge-success',
      actionModal: 'manageEmployeeCardModal',
      actionLabel: 'Manage',
    },
  ];

  /** Program configuration status rows (Section 5.6.1) */
  configStatuses: ConfigStatus[] = [
    { id: 'cfg-1', label: 'Billing Structure', description: 'Corporate liability, centralized', modalId: 'billingSetupModal', actionLabel: 'Edit' },
    { id: 'cfg-2', label: 'Card Branding', description: 'Acme Logo, Blue background', modalId: 'brandingModal', actionLabel: 'Edit' },
    { id: 'cfg-3', label: 'Issuance Scope', description: 'Domestic & Regional allowed', modalId: 'policyRulesModal', actionLabel: 'Edit' },
  ];

  /** Program info block */
  programInfo: ProgramInfo = {
    icon: 'bi bi-building',
    title: 'ACME CORP PROGRAM',
    details: [
      'KRA PIN: P051283991K',
      'Dedicated BIN: 481920',
      'Billing cycle ends: 30th of month',
    ],
  };

  /** Active policy groups (Section 5.6.2) */
  policyGroups: PolicyGroup[] = [
    { id: 'pg-1', name: 'Executive Level', rules: 'KES 500K limit, T&E allowed, No auto-blocks', employeeCount: 6 },
    { id: 'pg-2', name: 'Standard Employee', rules: 'KES 50K limit, strict MCC blocks, weekend block', employeeCount: 24, isHighlighted: true },
    { id: 'pg-3', name: 'Department Head', rules: 'KES 200K limit, Software & Procure allowed', employeeCount: 8 },
  ];

  /** Approval workflow queue (Section 5.6.2) */
  approvalItems: ApprovalItem[] = [
    {
      id: 'ap-1',
      avatarInitials: 'SK',
      employeeName: 'S. Kamau',
      merchant: 'AWS EMEA',
      amount: 'KES 145,000',
      flagBadge: 'Exceeds KES 100K auto-limit',
      flagBadgeClass: 'pm-badge-warning',
    },
    {
      id: 'ap-2',
      avatarInitials: 'JW',
      employeeName: 'J. Wanjiku',
      merchant: 'Sarova Stanley',
      amount: 'KES 24,500',
      flagBadge: 'Requires Manager Auth',
      flagBadgeClass: 'pm-badge-info',
    },
    {
      id: 'ap-3',
      avatarInitials: 'DM',
      employeeName: 'D. Mutua',
      merchant: 'Apple Store',
      amount: 'KES 184,000',
      flagBadge: 'Unauthorized MCC',
      flagBadgeClass: 'pm-badge-danger',
    },
  ];

  /** Receipt donut chart data (Section 5.6.3) */
  receiptDonut: ReceiptDonut = {
    matchedPct: 82,
    missingPct: 18,
    missingOffset: -82,
    label: '82%',
  };

  /** Receipt status breakdown rows */
  receiptStats: ReceiptStat[] = [
    { id: 'rs-1', label: 'Matched', value: '142 trans', valueColor: 'var(--pm-accent)' },
    { id: 'rs-2', label: 'Missing', value: '14 trans', valueColor: 'var(--pm-danger)' },
    { id: 'rs-3', label: 'Grace Period', value: '17 trans' },
  ];

  /** Recent transactions table (Section 5.6.3) */
  expenseTransactions: ExpenseTransaction[] = [
    {
      id: 'tx-1',
      date: '28 Jun',
      employee: 'S. Kamau',
      merchant: 'Uber Kenya',
      amount: 'KES 1,200',
      category: 'Travel (GL-6100)',
      receiptBadge: 'Matched',
      receiptBadgeClass: 'pm-badge-success',
      receiptIcon: 'bi bi-check',
      actionModal: 'expenseDetailModal',
      actionLabel: 'View',
    },
    {
      id: 'tx-2',
      date: '27 Jun',
      employee: 'P. Ochieng',
      merchant: 'Naivas Supermarket',
      amount: 'KES 4,850',
      category: 'Office Supplies (GL-5400)',
      receiptBadge: 'Missing',
      receiptBadgeClass: 'pm-badge-danger',
      receiptIcon: 'bi bi-x',
      actionModal: 'uploadReceiptModal',
      actionLabel: 'Upload',
    },
    {
      id: 'tx-3',
      date: '26 Jun',
      employee: 'Mktg Dept',
      merchant: 'Facebook Ads',
      amount: 'KES 45,000',
      category: 'Advertising (GL-7200)',
      receiptBadge: 'Auto',
      receiptBadgeClass: 'pm-badge-success',
      receiptIcon: 'bi bi-check',
      actionModal: 'expenseDetailModal',
      actionLabel: 'View',
    },
    {
      id: 'tx-4',
      date: '25 Jun',
      employee: 'J. Wanjiku',
      merchant: 'Java House',
      amount: 'KES 8,500',
      category: 'Meals/Ent (GL-6300)',
      receiptBadge: 'Day 3',
      receiptBadgeClass: 'pm-badge-warning',
      receiptIcon: 'bi bi-clock',
      actionModal: 'uploadReceiptModal',
      actionLabel: 'Upload',
    },
  ];

  /** Statement balance block (Section 5.6.4) */
  statementBalance: StatementBalance = {
    label: 'CURRENT STATEMENT BALANCE',
    amount: 'KES 2,410,500',
    dueDate: '05 Jul 2025',
  };

  /** Billing status rows (Section 5.6.4) */
  billingStatuses: BillingStatus[] = [
    {
      id: 'bs-1',
      label: 'Auto-Debit Source',
      description: 'Equity Bank ***4491',
      rightType: 'badge',
      rightBadgeClass: 'pm-badge pm-badge-success',
      rightText: 'Active',
    },
    {
      id: 'bs-2',
      label: 'Unbilled Spend',
      description: 'Current open cycle',
      rightType: 'text',
      rightText: 'KES 185,200',
    },
  ];

  /** Recent settlements & invoices (Section 5.6.4) */
  settlements: Settlement[] = [
    {
      id: 'st-1',
      period: 'May 01 – May 31, 2025',
      amount: 'KES 1,985,400',
      statusBadge: 'Paid in full',
      statusBadgeClass: 'pm-badge-success',
      settledDate: '02 Jun 2025',
    },
    {
      id: 'st-2',
      period: 'Apr 01 – Apr 30, 2025',
      amount: 'KES 2,150,000',
      statusBadge: 'Paid in full',
      statusBadgeClass: 'pm-badge-success',
      settledDate: '03 May 2025',
    },
    {
      id: 'st-3',
      period: 'Mar 01 – Mar 31, 2025',
      amount: 'KES 1,740,200',
      statusBadge: 'Paid in full',
      statusBadgeClass: 'pm-badge-success',
      settledDate: '04 Apr 2025',
    },
  ];

  // ─── MODAL OPEN / CLOSE ──────────────────────────────────────────

  openModal(id: string): void {
    this.activeModal = id;
  }

  closeModal(): void {
    this.activeModal = null;
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.closeModal();
  }

  // ─── MULTI-STEP: ISSUE CARD ──────────────────────────────────────

  nextIssueStep(): void {
    if (this.issueStep === 3) {
      this.issueStep = 4;
      return;
    }
    if (this.issueStep >= 4) {
      this.closeModal();
      this.resetIssueFlow();
      return;
    }
    this.issueStep++;
  }

  prevIssueStep(): void {
    if (this.issueStep > 1) {
      this.issueStep--;
    }
  }

  resetIssueFlow(): void {
    this.issueStep = 1;
  }

  // ─── TAB SWITCHING ───────────────────────────────────────────────

  switchTab(prefix: string, key: string, event: Event): void {
    this.activeTabs[prefix] = key;
    const btn = event.target as HTMLElement;
    if (btn && btn.parentElement) {
      btn.parentElement.querySelectorAll('.pm-tab-pill').forEach((b: Element) => b.classList.remove('active'));
      btn.classList.add('active');
    }
  }

  // ─── RADIO CARD SELECTION ────────────────────────────────────────

  selectRadioCard(event: Event): void {
    const card = (event.target as HTMLElement).closest('.border');
    if (!card || !card.parentElement) return;
    card.parentElement.querySelectorAll('.border').forEach((b: Element) => {
      (b as HTMLElement).style.borderColor = '';
      (b as HTMLElement).style.background = '';
      const r = b.querySelector('input[type=radio]') as HTMLInputElement;
      if (r) r.checked = false;
    });
    (card as HTMLElement).style.borderColor = 'var(--pm-primary)';
    (card as HTMLElement).style.background = 'rgba(79,70,229,.04)';
    const radio = card.querySelector('input[type=radio]') as HTMLInputElement;
    if (radio) radio.checked = true;
  }

  // ─── PROCESS ACTION (sets saved state) ───────────────────────────

  processAction(modalId: string, msg: string, ref: string): void {
    const savedVar = modalId.replace('Modal', 'Saved') as keyof this;
    (this as any)[savedVar] = true;
  }

  // ─── RESET ALL ───────────────────────────────────────────────────

  resetAllModals(): void {
    this.activeModal = null;
    this.issueStep = 1;
    this.activeTabs = { policy: 'groups', fundTab: 'deposit' };
    this.bulkIssueSaved = false;
    this.policyRulesSaved = false;
    this.createPolicySaved = false;
    this.reviewTransactionSaved = false;
    this.reconciliationSaved = false;
    this.uploadReceiptSaved = false;
    this.manageEmployeeCardSaved = false;
    this.editLimitSaved = false;
    this.expenseDetailSaved = false;
    this.violationDetailsSaved = false;
    this.fundingSaved = false;
    this.reportsSaved = false;
    this.settlementSaved = false;
    this.billingSetupSaved = false;
    this.brandingSaved = false;
  }
}