import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AutoPayRule {
  id: number;
  utility: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  amountRule: string;
  timing: string;
  source: string;
  smartLogic: string;
  active: boolean;
}

export interface BudgetCategory {
  name: string;
  spent: number;
  limit: number;
  color: string;
  get percent(): number;
}

export interface HouseholdMember {
  id: number;
  initials: string;
  name: string;
  role: string;
  gradient: string;
  spendLimit: string;
  access: string;
  accessLabel?: string;
  accessColor?: string;
  badge?: string;
  badgeText?: string;
}

export interface Notification {
  icon: string;
  iconColor: string;
  bgColor: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface HealthCheck {
  name: string;
  detail: string;
  passed: boolean;
}

export interface PaymentSource {
  name: string;
  detail: string;
}

export interface ActivityEntry {
  time: string;
  action: string;
  details: string;
  status: string;
}

export interface ActivityHistoryEntry {
  time: string;
  type: string;
  description: string;
  user: string;
}

export interface SplitAllocation {
  initials: string;
  name: string;
  gradient: string;
  percent: number;
}

export interface BudgetWizardItem {
  name: string;
  amount: number;
  color: string;
  get percent(): number;
}

@Component({
  selector: 'app-utility-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-automation.html',
  styleUrls: ['./settings-automation.css'],
  encapsulation: ViewEncapsulation.None
})
export class UtilitySettingsComponent implements OnInit {

  activeModalId: string | null = null;
  toastMessage: string | null = null;

  apStep = 1;
  bwStep = 1;
  amStep = 1;

  autoPayRules: AutoPayRule[] = [
    { id: 1, utility: 'KPLC Prepaid', icon: 'bi-lightning-charge', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', amountRule: 'KES 2,000 top-up', timing: 'When balance < 20 units', source: 'M-Pesa (Primary)', smartLogic: 'None', active: true },
    { id: 2, utility: 'DSTV Compact+', icon: 'bi-tv', iconBg: 'var(--pm-purple-soft)', iconColor: 'var(--pm-purple)', amountRule: 'Full exact bill (KES 11,500)', timing: '2 days before due date', source: 'Wallet (Primary)', smartLogic: 'Block if > KES 12K', active: true },
    { id: 3, utility: 'NCWSC Water', icon: 'bi-droplet', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', amountRule: 'Fetch dynamic bill', timing: 'On due date', source: 'Bank (Primary)', smartLogic: 'Requires approval if > 15% avg', active: true },
    { id: 4, utility: 'Safaricom Data', icon: 'bi-phone', iconBg: 'var(--pm-accent-soft)', iconColor: 'var(--pm-accent)', amountRule: 'KES 1,000 fixed', timing: '1st of every month', source: 'M-Pesa (Primary)', smartLogic: 'None', active: true },
  ];

  budgetCategories: BudgetCategory[] = [
    { name: 'Electricity', spent: 18400, limit: 20000, color: 'var(--pm-warning)', get percent() { return Math.round((this.spent / this.limit) * 100); } },
    { name: 'Water', spent: 6800, limit: 8000, color: 'var(--pm-info)', get percent() { return Math.round((this.spent / this.limit) * 100); } },
    { name: 'TV & Streaming', spent: 14500, limit: 15000, color: 'var(--pm-purple)', get percent() { return Math.round((this.spent / this.limit) * 100); } },
    { name: 'Internet', spent: 8500, limit: 12000, color: 'var(--pm-primary)', get percent() { return Math.round((this.spent / this.limit) * 100); } },
  ];

  members: HouseholdMember[] = [
    { id: 1, initials: 'JK', name: 'James Kamau', role: 'Primary Admin', gradient: 'var(--pm-gradient-hero)', spendLimit: 'Unlimited', access: 'All 14 Utilities', badge: 'pm-badge-success', badgeText: 'Primary Admin' },
    { id: 2, initials: 'GK', name: 'Grace Kamau', role: 'Spouse (Co-Payer)', gradient: 'var(--pm-gradient-rose)', spendLimit: 'KES 30,000 / mo', access: '12 Utilities' },
    { id: 3, initials: 'BK', name: 'Brian Kamau', role: 'Child Account', gradient: 'var(--pm-gradient-blue)', spendLimit: 'KES 2,000 / mo', access: 'Req. > KES 500', accessLabel: 'Approvals', accessColor: 'text-warning' },
    { id: 4, initials: 'MN', name: 'Mama Nyokabi', role: 'Elderly Parent', gradient: 'var(--pm-gradient-violet)', spendLimit: 'None (View Only)', access: 'Active (Home Meter)', accessLabel: 'Auto-Pay Link', accessColor: 'text-success' },
  ];

  alertConfigs = {
    dueDateReminders: true,
    lowBalanceWarnings: true,
    unusualUsage: true,
    priceChange: false,
    serviceOutage: true,
  };

  alertChannels = {
    push: false,
    email: true,
    sms: true,
    quietFrom: '22:00',
    quietTo: '07:00',
    quietOverride: true,
  };

  smartConfig = {
    deviationGuard: true,
    deviationPercent: 15,
    hardCapAlert: true,
    hardCapAmount: 12000,
    seasonalAdjustments: true,
    liquidityCheck: false,
  };

  newRule = {
    utility: 'KPLC Prepaid (14825739)',
    type: 'schedule',
    amountType: 'Fetch exactly full billed amount',
    capAmount: 10000,
    timing: '2 days before due date',
    primarySource: 'PayMo Wallet',
    fallbackSource: 'M-Pesa 0712***890',
    requireApproval: true,
    notifyExecution: true,
  };

  editingRule: AutoPayRule | null = null;
  editingRuleIndex = -1;
  editForm = { amount: 2000, trigger: 'When balance drops below 20 units', active: true };

  deletingRule: AutoPayRule | null = null;
  deletingRuleIndex = -1;
  deleteConfirm = false;

  budgetWizardItems: BudgetWizardItem[] = [
    { name: 'Electricity', amount: 20000, color: 'var(--pm-warning)', get percent() { return Math.round((this.amount / 50000) * 100); } },
    { name: 'Water', amount: 8000, color: 'var(--pm-info)', get percent() { return Math.round((this.amount / 50000) * 100); } },
    { name: 'TV/Internet', amount: 15000, color: 'var(--pm-purple)', get percent() { return Math.round((this.amount / 50000) * 100); } },
    { name: 'Airtime/Gas', amount: 7000, color: 'var(--pm-accent)', get percent() { return Math.round((this.amount / 50000) * 100); } },
  ];

  newMember = { name: '', phone: '', email: '', relationship: 'Spouse / Partner', role: 'Co-Payer (Full access with limits)', spendLimit: 0, approvalThreshold: 0 };
  utilityOptions = [
    { name: 'Electricity (KPLC)', selected: true },
    { name: 'Water (NCWSC)', selected: true },
    { name: 'DSTV', selected: true },
    { name: 'Safaricom Fibre', selected: true },
    { name: 'Zuku Internet', selected: false },
    { name: 'Gas (K-Gas)', selected: false },
  ];

  splitAllocations: SplitAllocation[] = [
    { initials: 'JK', name: 'James Kamau', gradient: 'var(--pm-gradient-hero)', percent: 50 },
    { initials: 'GK', name: 'Grace Kamau', gradient: 'var(--pm-gradient-rose)', percent: 50 },
  ];

  childUtilities = [
    { name: 'Airtime Top-up', allowed: true },
    { name: 'Data Bundles', allowed: true },
    { name: 'Electricity', allowed: false },
    { name: 'Water', allowed: false },
    { name: 'Entertainment', allowed: false },
  ];
  childConfig = { timeRestriction: false, fromTime: '08:00', toTime: '20:00' };

  rolloverConfig = { enabled: true, destination: 'PayMo Savings Wallet', minimum: 500 };
  rolloverCategories = [
    { name: 'Electricity', excluded: false },
    { name: 'Water', excluded: false },
    { name: 'TV & Streaming', excluded: true },
    { name: 'Internet', excluded: false },
  ];

  overspendConfig = { hardCaps: false, warnConfirm: true, totalCap: 52000, includeAutoPay: true };

  paymentSources: PaymentSource[] = [
    { name: 'PayMo Wallet', detail: 'Balance: KES 12,400' },
    { name: 'M-Pesa 0712***890', detail: 'Primary mobile money' },
    { name: 'Equity Bank ***4521', detail: 'Checking account' },
    { name: 'KCB Bank ***7890', detail: 'Savings account' },
  ];

  healthChecks: HealthCheck[] = [
    { name: 'Auto-Pay Engine', detail: '4 rules active, 0 errors', passed: true },
    { name: 'Payment Sources', detail: 'All 3 primary sources reachable', passed: true },
    { name: 'Budget Guardrails', detail: 'No categories exceeded', passed: true },
    { name: 'Member Access Tokens', detail: 'All 4 sessions valid', passed: true },
    { name: 'Provider API Connections', detail: 'KPLC, NCWSC, DSTV, Safaricom', passed: false },
    { name: 'Alert Delivery', detail: 'Push, Email, SMS channels active', passed: true },
  ];

  notifications: Notification[] = [
    { icon: 'bi-exclamation-triangle', iconColor: 'var(--pm-danger)', bgColor: 'var(--pm-danger-soft)', title: 'Auto-pay failed', body: 'Zuku Internet payment of KES 5,500 failed — card expired.', time: '5 min ago', read: false },
    { icon: 'bi-person-plus', iconColor: 'var(--pm-warning)', bgColor: 'var(--pm-warning-soft)', title: 'Payment approval pending', body: 'Brian Kamau requested KES 500 for airtime.', time: '1 hour ago', read: false },
    { icon: 'bi-piggy-bank', iconColor: 'var(--pm-info)', bgColor: 'var(--pm-info-soft)', title: 'Budget 92% used', body: 'Electricity budget is at KES 18,400 of KES 20,000.', time: '3 hours ago', read: false },
    { icon: 'bi-arrow-repeat', iconColor: 'var(--pm-accent)', bgColor: 'var(--pm-accent-soft)', title: 'Auto-pay executed', body: 'KPLC Prepaid topped up KES 2,000 successfully.', time: 'Yesterday', read: false },
  ];

  activitySearch = '';
  memberActivity: ActivityEntry[] = [
    { time: 'Today, 09:14 AM', action: 'Payment Request', details: 'Requested KES 500 — Safaricom Airtime', status: 'Pending' },
    { time: 'Yesterday, 4:30 PM', action: 'Top-up', details: 'KES 200 airtime via M-Pesa', status: 'Success' },
    { time: 'Jun 12, 11:00 AM', action: 'Login', details: 'Logged in from Android device', status: 'Success' },
    { time: 'Jun 10, 2:15 PM', action: 'Payment Request', details: 'Requested KES 1,000 — Denied by admin', status: 'Failed' },
    { time: 'Jun 8, 9:00 AM', action: 'Auto-Pay Triggered', details: 'Data bundle KES 1,000 auto-paid', status: 'Success' },
  ];

  activityHistory: ActivityHistoryEntry[] = [
    { time: 'Today, 09:14 AM', type: 'Payment', description: 'Brian requested KES 500 airtime', user: 'Brian K.' },
    { time: 'Today, 08:00 AM', type: 'Alert', description: 'Electricity budget at 92%', user: 'System' },
    { time: 'Yesterday, 6:00 PM', type: 'Payment', description: 'KPLC auto-top-up KES 2,000', user: 'Auto-Pay' },
    { time: 'Yesterday, 3:00 PM', type: 'Settings', description: 'Updated budget limit for Water', user: 'James K.' },
    { time: 'Jun 12, 11:00 AM', type: 'Member', description: 'Brian Kamau logged in', user: 'Brian K.' },
    { time: 'Jun 11, 9:00 AM', type: 'Payment', description: 'DSTV auto-paid KES 11,500', user: 'Auto-Pay' },
    { time: 'Jun 10, 2:00 PM', type: 'Settings', description: 'Enabled Smart Auto-Pay logic', user: 'James K.' },
    { time: 'Jun 9, 8:00 AM', type: 'Alert', description: 'Unusual water usage detected (+35%)', user: 'System' },
  ];

  failureAction = 'Update payment method & retry';
  get failureDate(): string {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  priceChangeProviders = [
    { name: 'KPLC', detail: 'Electricity tariffs & token pricing', monitored: true },
    { name: 'NCWSC', detail: 'Water rates per cubic meter', monitored: true },
    { name: 'DSTV / MultiChoice', detail: 'Package pricing changes', monitored: true },
    { name: 'Safaricom', detail: 'Data & voice bundle pricing', monitored: false },
    { name: 'Zuku / Wananchi', detail: 'Internet package rates', monitored: false },
  ];

  outageProviders = [
    { name: 'KPLC', detail: 'Planned outages & unplanned blackouts', monitored: true },
    { name: 'NCWSC', detail: 'Water interruptions & maintenance', monitored: true },
    { name: 'Safaricom', detail: 'Network outages & maintenance', monitored: false },
    { name: 'Zuku', detail: 'Fibre outages in your area', monitored: true },
  ];

  get activeAutomationsCount(): number {
    return this.autoPayRules.filter(r => r.active).length;
  }

  get totalBudget(): number {
    return this.budgetCategories.reduce((sum, b) => sum + b.limit, 0) / 1000;
  }

  get totalSpent(): number {
    return this.budgetCategories.reduce((sum, b) => sum + b.spent, 0);
  }

  get budgetUnderLimit(): string {
    return this.budgetCategories.reduce((sum, b) => sum + (b.limit - b.spent), 0).toLocaleString();
  }

  get totalBudgetPercent(): number {
    const total = this.budgetCategories.reduce((s, b) => s + b.limit, 0);
    return total ? Math.round((this.totalSpent / total) * 100) : 0;
  }

  get alertsTriggered(): number { return 12; }
  get dueReminders(): number { return 5; }
  get lowBalances(): number { return 2; }

  get budgetWizardTotal(): number {
    return this.budgetWizardItems.reduce((s, b) => s + b.amount, 0);
  }

  get splitTotal(): number {
    return this.splitAllocations.reduce((s, a) => s + a.percent, 0);
  }

  ngOnInit(): void {}

  navigateTo(route: string): void {
    console.log('Navigate to:', route);
  }

  // ── Step increment/decrement methods (Angular templates don't support ++/--) ──
  incrementApStep(): void { this.apStep = this.apStep + 1; }
  decrementApStep(): void { this.apStep = this.apStep - 1; }
  incrementBwStep(): void { this.bwStep = this.bwStep + 1; }
  decrementBwStep(): void { this.bwStep = this.bwStep - 1; }
  incrementAmStep(): void { this.amStep = this.amStep + 1; }
  decrementAmStep(): void { this.amStep = this.amStep - 1; }

  openModal(id: string): void {
    this.resetModalStates(id);
    this.activeModalId = id;
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    this.activeModalId = null;
    this.toastMessage = null;
    document.body.classList.remove('modal-open');
  }

  private resetModalStates(id: string): void {
    if (id === 'autoPaySetupModal') {
      this.apStep = 1;
      this.newRule = { utility: 'KPLC Prepaid (14825739)', type: 'schedule', amountType: 'Fetch exactly full billed amount', capAmount: 10000, timing: '2 days before due date', primarySource: 'PayMo Wallet', fallbackSource: 'M-Pesa 0712***890', requireApproval: true, notifyExecution: true };
    }
    if (id === 'budgetWizardModal') { this.bwStep = 1; }
    if (id === 'addMemberModal') {
      this.amStep = 1;
      this.newMember = { name: '', phone: '', email: '', relationship: 'Spouse / Partner', role: 'Co-Payer (Full access with limits)', spendLimit: 0, approvalThreshold: 0 };
    }
    if (id === 'deleteRuleModal') { this.deleteConfirm = false; }
  }

  openEditRule(index: number): void {
    this.editingRuleIndex = index;
    this.editingRule = this.autoPayRules[index];
    this.editForm = { amount: 2000, trigger: 'When balance drops below 20 units', active: this.editingRule.active };
    this.openModal('editAutoPayModal');
  }

  saveEditRule(): void {
    if (this.editingRuleIndex >= 0) {
      this.autoPayRules[this.editingRuleIndex].active = this.editForm.active;
    }
    this.processAction('Rule updated successfully.');
  }

  openDeleteRule(index: number): void {
    this.deletingRuleIndex = index;
    this.deletingRule = this.autoPayRules[index];
    this.deleteConfirm = false;
    this.openModal('deleteRuleModal');
  }

  confirmDeleteRule(): void {
    if (this.deletingRuleIndex >= 0) {
      this.autoPayRules.splice(this.deletingRuleIndex, 1);
    }
    this.processAction('Rule deleted successfully.');
  }

  saveAutoPayRule(): void {
    this.processAction('Auto-pay rule created successfully!');
  }

  saveNewMember(): void {
    if (!this.newMember.name.trim()) return;
    this.processAction(this.newMember.name + ' added to household.');
  }

  moveSourceUp(index: number): void {
    if (index <= 0) return;
    const temp = this.paymentSources[index];
    this.paymentSources[index] = this.paymentSources[index - 1];
    this.paymentSources[index - 1] = temp;
  }

  moveSourceDown(index: number): void {
    if (index >= this.paymentSources.length - 1) return;
    const temp = this.paymentSources[index];
    this.paymentSources[index] = this.paymentSources[index + 1];
    this.paymentSources[index + 1] = temp;
  }

  markAllRead(): void {
    this.notifications.forEach(n => n.read = true);
  }

  processAction(message: string): void {
    this.activeModalId = null;
    document.body.classList.remove('modal-open');
    this.toastMessage = message;
    setTimeout(() => { this.toastMessage = null; }, 3500);
  }
}