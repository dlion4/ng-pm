import { Component, OnInit, OnDestroy, AfterViewInit, TrackByFunction, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ─── Data Models ──────────────────────────────────────────────

interface DashboardMetric {
  value: string;
  label: string;
}

interface Dashboard {
  id: string;
  account: string;
  cat: string;
  type: string;
  title: string;
  desc: string;
  icon: string;
  c1: string;
  c2: string;
  img: string;
  badge: string;
  badgeClass: string;
  metrics: DashboardMetric[];
  features: string[];
  actions: string[];
  url: string;
}

interface Notification {
  dash: string;
  msg: string;
  color: string;
}

interface WidgetOption {
  label: string;
  icon: string;
  active: boolean;
}

interface AccountTab {
  id: string;
  icon: string;
  label: string;
}

interface FilterTab {
  id: string;
  label: string;
}

interface HeroMetric {
  value: string;
  label: string;
}

// ─── Component ──────────────────────────────────────────────────

@Component({
  selector: 'app-dashboard-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-selector.html',
  styleUrls: ['./dashboard-selector.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardSelectorComponent implements OnInit, AfterViewInit, OnDestroy {

  historyStatusFilter: string = 'all';
  historyLocationFilter: string = 'all';

  // 2. Define the change handler method
  renderHistory(): void {
    console.log('Filtering status:', this.historyStatusFilter);
    console.log('Filtering location:', this.historyLocationFilter);
  }

  // ─── Static Config ───────────────────────────────────────────

  logoMark = 'P';
  brandTitle = 'Paymo';
  brandSubtitle = 'Dashboard selection hub · Zero-trust routed session';

  pageIndicator = 'PAGE 56 · DASHBOARD SELECTION HUB';
  heroHeading = 'Choose your';
  heroAccent = 'financial command center.';
  heroDescription = 'You are signed in as Amara Okafor. Pick the dashboard that matches the job you need to do now. Your choice is remembered and can be changed anytime.';

  heroMetrics: HeroMetric[] = [
    { value: '8', label: 'Dashboards' },
    { value: '13', label: 'Unread alerts' },
    { value: '99.97%', label: 'Platform uptime' },
    { value: 'Trusted', label: 'Chrome · Lagos' }
  ];

  commandSectionLabel = 'Section 56.8 · Quick Search';
  commandTitle = 'Search dashboards, transactions, settings or help.';
  searchPlaceholder = 'Try: transactions, loan, API keys, export, fraud alert...';

  availableSectionLabel = 'Sections 56.1 - 56.6';
  availableTitle = 'Available dashboards';

  selectedSectionLabel = 'Section 56.9';
  selectedTitle = 'Selected route';

  notificationsSectionLabel = 'Section 56.7';
  notificationsTitle = 'Recent notifications';

  sessionTitle = 'Session context';
  sessionContext = {
    device: 'Desktop browser',
    location: 'Lagos, NG',
    auth: 'Passkey + MFA',
    session: '14:59'
  };

  // ─── Account Tabs ────────────────────────────────────────────

  accountTabs: AccountTab[] = [
    { id: 'all', icon: 'bi-grid-fill', label: 'All access' },
    { id: 'personal', icon: 'bi-person', label: 'Personal' },
    { id: 'business', icon: 'bi-building', label: 'Business' },
    { id: 'developer', icon: 'bi-code-slash', label: 'Developer' }
  ];
  currentAccount = 'all';

  // ─── Filter Tabs ─────────────────────────────────────────────

  filterTabs: FilterTab[] = [
    { id: 'all', label: 'All' },
    { id: 'money', label: 'Money movement' },
    { id: 'admin', label: 'Admin' },
    { id: 'dev', label: 'Developer' },
    { id: 'risk', label: 'Risk' },
    { id: 'credit', label: 'Credit' }
  ];
  currentFilter = 'all';

  // ─── Dashboards Data ─────────────────────────────────────────

  dashboards: Dashboard[] = [
    {
      id: 'transactions', account: 'business', cat: 'money', type: 'Core',
      title: 'Transactions Dashboard',
      desc: 'Track collections, payouts, refunds, settlement states and dispute queues across all rails.',
      icon: 'bi-arrow-left-right', c1: '#22d3ee', c2: '#60a5fa',
      img: 'https://i.pinimg.com/originals/82/de/83/82de83fb86c54aa5783bbb6ca3b26938.gif',
      badge: '3 new alerts', badgeClass: 'badge-native',
      metrics: [{ value: '1,284', label: 'today' }, { value: '99.4%', label: 'success' }, { value: 'T+0', label: 'settlement' }],
      features: ['Collections and payouts ledger', 'Rail failure and retry visibility', 'Reconciliation exports by market'],
      actions: ['View transactions', 'Export CSV', 'Resolve alerts'],
      url: '#transactions-dashboard'
    },
    {
      id: 'wallet', account: 'personal', cat: 'money', type: 'Personal',
      title: 'Personal Wallet',
      desc: 'Manage balances, cards, remittances, savings goals and bill payments from one wallet.',
      icon: 'bi-wallet2', c1: '#60a5fa', c2: '#a78bfa',
      img: 'https://i.pinimg.com/736x/81/8d/70/818d706bc8e2a226f8a4d0564be6f286.jpg',
      badge: 'Default', badgeClass: 'badge-ok',
      metrics: [{ value: 'NGN 1.8M', label: 'balance' }, { value: '4', label: 'currencies' }, { value: '2', label: 'cards' }],
      features: ['Multi-currency wallet balances', 'Send money and pay bills', 'Card controls and spend limits'],
      actions: ['Send money', 'Freeze card', 'Pay bill'],
      url: '#wallet-dashboard'
    },
    {
      id: 'business', account: 'business', cat: 'admin', type: 'Business',
      title: 'Business Operations',
      desc: 'Run invoices, suppliers, payroll, staff roles, payment links and merchant settlement.',
      icon: 'bi-shop', c1: '#22c55e', c2: '#22d3ee',
      img: 'https://i.pinimg.com/736x/9e/c1/f1/9ec1f12d8d3474f7ca550168f7ef48bc.jpg',
      badge: '2 approvals', badgeClass: 'badge-soon',
      metrics: [{ value: '42', label: 'invoices' }, { value: '8', label: 'suppliers' }, { value: '5', label: 'staff' }],
      features: ['Invoice and payment link management', 'Supplier and payroll workflows', 'Role-based staff permissions'],
      actions: ['Create invoice', 'Approve payroll', 'Invite staff'],
      url: '#business-dashboard'
    },
    {
      id: 'developer', account: 'developer', cat: 'dev', type: 'Developer',
      title: 'Developer API Console',
      desc: 'Manage apps, API keys, webhook delivery, sandbox events, SDKs and production access.',
      icon: 'bi-code-slash', c1: '#a78bfa', c2: '#22d3ee',
      img: 'https://i.pinimg.com/736x/90/c8/9e/90c89eba3035569f426401ce96443c1b.jpg',
      badge: 'Sandbox live', badgeClass: 'badge-adv',
      metrics: [{ value: '142ms', label: 'latency' }, { value: '12', label: 'webhooks' }, { value: '2', label: 'apps' }],
      features: ['API key rotation and scopes', 'Webhook replay and debugging', 'Production access requests'],
      actions: ['Rotate key', 'Replay webhook', 'Open docs'],
      url: '#developer-console'
    },
    {
      id: 'treasury', account: 'business', cat: 'money', type: 'Enterprise',
      title: 'Treasury Dashboard',
      desc: 'Control FX exposure, cash positions, corridors, hedging windows and cross-border AP/AR.',
      icon: 'bi-currency-exchange', c1: '#fbbf24', c2: '#60a5fa',
      img: 'https://i.pinimg.com/originals/82/de/83/82de83fb86c54aa5783bbb6ca3b26938.gif',
      badge: 'FX alert', badgeClass: 'badge-soon',
      metrics: [{ value: '$4.2M', label: 'float' }, { value: '18', label: 'corridors' }, { value: '0.42%', label: 'spread' }],
      features: ['Multi-entity cash pooling', 'FX lock and conversion timing', 'ERP-ready treasury reports'],
      actions: ['Lock FX', 'Move funds', 'Export report'],
      url: '#treasury-dashboard'
    },
    {
      id: 'admin', account: 'business', cat: 'admin', type: 'Admin',
      title: 'Team Admin & Access',
      desc: 'Manage users, roles, approvals, limits, access policies, audit logs and enterprise controls.',
      icon: 'bi-people', c1: '#22d3ee', c2: '#22c55e',
      img: 'https://i.pinimg.com/736x/81/8d/70/818d706bc8e2a226f8a4d0564be6f286.jpg',
      badge: 'Needs review', badgeClass: 'badge-native',
      metrics: [{ value: '27', label: 'users' }, { value: '6', label: 'roles' }, { value: '14', label: 'logs' }],
      features: ['Role permissions and approval rules', 'Login and device audit trail', 'Spending and transaction limits'],
      actions: ['Invite user', 'Review logs', 'Set limits'],
      url: '#admin-dashboard'
    },
    {
      id: 'compliance', account: 'business', cat: 'risk', type: 'Risk',
      title: 'Compliance & Risk Center',
      desc: 'Review KYC/KYB queues, AML alerts, sanctions hits, regulatory exports and case investigations.',
      icon: 'bi-shield-check', c1: '#ef4444', c2: '#fbbf24',
      img: 'https://i.pinimg.com/736x/9e/c1/f1/9ec1f12d8d3474f7ca550168f7ef48bc.jpg',
      badge: '4 cases', badgeClass: 'badge-soon',
      metrics: [{ value: '18', label: 'alerts' }, { value: '2', label: 'EDD' }, { value: '0', label: 'critical' }],
      features: ['KYC/KYB review queue', 'AML case management', 'Regulatory report exports'],
      actions: ['Review case', 'Export STR', 'Update policy'],
      url: '#compliance-center'
    },
    {
      id: 'apps', account: 'developer', cat: 'dev', type: 'Apps',
      title: 'App Management',
      desc: 'Register applications, configure OAuth, review crash reports, analytics and marketplace listing status.',
      icon: 'bi-window-stack', c1: '#fb7185', c2: '#a78bfa',
      img: 'https://i.pinimg.com/736x/90/c8/9e/90c89eba3035569f426401ce96443c1b.jpg',
      badge: '1 release', badgeClass: 'badge-adv',
      metrics: [{ value: '3', label: 'apps' }, { value: '4.8', label: 'rating' }, { value: '50K', label: 'MAU' }],
      features: ['App registration and configuration', 'Performance and error analytics', 'Marketplace listing management'],
      actions: ['Register app', 'Request prod', 'View analytics'],
      url: '#app-management'
    },
    {
      id: 'loans', account: 'personal', cat: 'credit', type: 'Credit',
      title: 'Loans & Credit',
      desc: 'Access working capital, manage existing loans, repayment schedules and credit options.',
      icon: 'bi-graph-up-arrow', c1: '#fbbf24', c2: '#f59e0b',
      img: 'https://i.pinimg.com/originals/82/de/83/82de83fb86c54aa5783bbb6ca3b26938.gif',
      badge: 'Pre-approved', badgeClass: 'badge-soon',
      metrics: [{ value: 'NGN 2M', label: 'limit' }, { value: 'NGN 500K', label: 'outstanding' }, { value: '5 days', label: 'due' }],
      features: ['Loan application and status tracking', 'Repayment history and early payoff', 'Credit score monitoring where available'],
      actions: ['Apply', 'Make payment', 'View score'],
      url: '#loans-credit'
    }
  ];

  // ─── Notifications ───────────────────────────────────────────

  notifications: Notification[] = [
    { dash: 'Transactions', msg: '3 payouts require retry approval.', color: '#fbbf24' },
    { dash: 'Bills', msg: '2 scheduled bills due this week.', color: '#22d3ee' },
    { dash: 'Compliance', msg: 'EDD review needed for one merchant.', color: '#ef4444' },
    { dash: 'Developer', msg: 'Webhook endpoint returned 500 twice.', color: '#a78bfa' }
  ];

  notificationsCleared = false;

  // ─── Selected Dashboard State ────────────────────────────────

  selectedId: string;
  searchQuery = '';

  // ─── Custom Modal State ──────────────────────────────────────

  customModalOpen = false;
  customName = 'Treasury control room';
  customOwner = 'Finance team';

  widgetOptions: WidgetOption[] = [
    { label: 'FX Exposure', icon: 'bi-currency-exchange', active: true },
    { label: 'Cash Position', icon: 'bi-wallet2', active: true },
    { label: 'Approval Queue', icon: 'bi-check2-square', active: false },
    { label: 'Rail Health', icon: 'bi-broadcast', active: false },
    { label: 'Audit Trail', icon: 'bi-journal-check', active: true },
    { label: 'ERP Sync', icon: 'bi-database-check', active: false }
  ];

  ownerOptions = ['Finance team', 'Engineering team', 'Compliance team', 'Executive team'];

  // ─── Toast State ─────────────────────────────────────────────

  toastVisible = false;
  toastTitle = 'Action completed';
  toastBody = 'Your preference was saved.';
  private toastTimeout: any;

  // ─── Session Timer ───────────────────────────────────────────

  private sessionSeconds = 899;
  private timerInterval: any;
  sessionTimerDisplay = '14:59';

  // ─── Constructor / Lifecycle ─────────────────────────────────

  constructor() {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('paymo_selected_dashboard') : null;
    this.selectedId = stored || 'transactions';
  }

  ngOnInit(): void {
    this.startSessionTimer();
    this.detectDevice();
  }

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
      }, { threshold: 0.12 });
      document.querySelectorAll('.reveal, .glass, .glass-strong').forEach(el => io.observe(el));
    }
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }

  // ─── Computed Properties ─────────────────────────────────────

  get filteredDashboards(): Dashboard[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.dashboards.filter(d => {
      const filterOk = this.currentFilter === 'all' || d.cat === this.currentFilter;
      const accountOk = this.currentAccount === 'all' || d.account === this.currentAccount;
      const queryOk = !q || [d.title, d.desc, d.type, ...d.features, ...d.actions].join(' ').toLowerCase().includes(q);
      return filterOk && accountOk && queryOk;
    });
  }

  get selectedDashboard(): Dashboard {
    return this.dashboards.find(d => d.id === this.selectedId) || this.dashboards[0];
  }

  get selectedRiskText(): string {
    const cat = this.selectedDashboard.cat;
    return cat === 'risk' ? 'Step-up may apply' : cat === 'credit' ? 'Credit check' : 'Low risk';
  }

  get selectedRiskClass(): string {
    const cat = this.selectedDashboard.cat;
    return cat === 'risk' ? 'badge-soon' : 'badge-ok';
  }

  // ─── TrackBy Functions ───────────────────────────────────────

  trackByDashboardId: TrackByFunction<Dashboard> = (index, d) => d.id;
  trackByIndex: TrackByFunction<any> = (index) => index;

  // ─── Event Handlers ──────────────────────────────────────────

  onSearchInput(): void { /* filteredDashboards recomputes automatically */ }

  setAccountFilter(id: string): void { this.currentAccount = id; }

  setCategoryFilter(id: string): void { this.currentFilter = id; }

  selectDashboard(id: string): void { this.selectedId = id; }

  onActionChipClick(action: string, dashboardTitle: string, event: Event): void {
    event.stopPropagation();
    this.showToast('Quick action queued', `${action} opened in ${dashboardTitle}.`);
  }

  onRemember(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('paymo_selected_dashboard', this.selectedId);
    }
    this.showToast('Dashboard remembered', `${this.selectedDashboard.title} will open first next time.`);
  }

  onOpenSelected(): void {
    this.showToast('Opening dashboard', `Routing securely to ${this.selectedDashboard.title}.`);
  }

  onPreviewTour(): void {
    this.showToast('Preview tour started', `Highlighting the most important actions in ${this.selectedDashboard.title}.`);
  }

  onClearAlerts(): void {
    this.notificationsCleared = true;
    this.showToast('Notifications cleared', 'Unread alerts were marked as read.');
  }

  onLockSession(): void {
    this.showToast('Session locked', 'Your dashboard session is locked. Re-authentication would be required in production.');
  }

  onResetSearch(): void {
    this.searchQuery = '';
    this.currentFilter = 'all';
  }

  // ─── Modal Handlers ──────────────────────────────────────────

  openCustomModal(): void { this.customModalOpen = true; }

  closeCustomModal(): void { this.customModalOpen = false; }

  toggleWidget(index: number): void {
    this.widgetOptions[index].active = !this.widgetOptions[index].active;
  }

  onCreateCustom(): void {
    const widgets = this.widgetOptions.filter(w => w.active).map(w => w.label).join(', ');
    const name = this.customName.trim() || 'Custom dashboard';
    this.closeCustomModal();
    this.showToast('Custom dashboard created', `${name} includes: ${widgets || 'no widgets selected'}.`);
  }

  // ─── Toast ───────────────────────────────────────────────────

  showToast(title: string, body: string): void {
    this.toastTitle = title;
    this.toastBody = body;
    this.toastVisible = true;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => this.toastVisible = false, 3200);
  }

  // ─── Utilities ───────────────────────────────────────────────

  hexToRgba(hex: string, alpha: number): string {
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map(x => x + x).join('') : h;
    const bigint = parseInt(full, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  private startSessionTimer(): void {
    this.timerInterval = setInterval(() => {
      this.sessionSeconds = Math.max(0, this.sessionSeconds - 1);
      const m = String(Math.floor(this.sessionSeconds / 60)).padStart(2, '0');
      const s = String(this.sessionSeconds % 60).padStart(2, '0');
      this.sessionTimerDisplay = `${m}:${s}`;
    }, 1000);
  }

  private detectDevice(): void {
    if (typeof navigator !== 'undefined') {
      this.sessionContext.device = /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile browser' : 'Desktop browser';
    }
  }

  // ─── Keyboard shortcut ───────────────────────────────────────

  onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      const input = document.getElementById('commandInput');
      if (input) input.focus();
    }
  }
}