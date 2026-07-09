import { Component, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FlowState {
  current: number;
  total: number;
  labels: string[];
}

@Component({
  selector: 'app-fee-commission',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fee-commission.html',
  styleUrls: ['./fee-commission.css'],
  encapsulation: ViewEncapsulation.None
})
export class FeeCommissionComponent implements OnInit {
  // Modal visibility map
  modalVisible: { [key: string]: boolean } = {};

  // Flow states for multi-step modals
  flows: { [key: string]: FlowState } = {
    fee: { current: 1, total: 4, labels: ['Details', 'Pricing', 'Conditions', 'Done'] },
    calc: { current: 1, total: 3, labels: ['Details', 'Breakdown', 'Done'] },
    waiver: { current: 1, total: 3, labels: ['Details', 'Eligibility', 'Done'] },
    settle: { current: 1, total: 3, labels: ['Select', 'Review', 'Done'] }
  };

  // Calculator inputs
  calcType: string = 'Inter-bank Transfer';
  calcAmount: number = 250000;
  baseFee: number = 2125;
  vatFee: number = 340;
  totalFee: number = 2465;

  // Advanced calculator inputs
  advAmount: number = 500000;
  advType: string = 'Inter-bank Transfer';
  advBase: number = 4250;
  advVat: number = 680;
  advNet: number = 50;
  advTotal: number = 4980;

  // Data arrays - ready for API integration
  feeRules = [
    { id: 'FR-401', name: 'Inter-bank Transfer', type: 'Percentage', rate: '0.85%', volume: 'KES 842M', revenue: 'KES 7.16M', status: 'Active' },
    { id: 'FR-402', name: 'Wallet to Bank', type: 'Fixed', rate: 'KES 25', volume: '124,890 txns', revenue: 'KES 3.12M', status: 'Active' },
    { id: 'FR-410', name: 'High-Value Instant', type: 'Tiered', rate: '0.45–1.2%', volume: 'KES 1.12B', revenue: 'KES 6.84M', status: 'Active' },
    { id: 'FR-415', name: 'SME Promotional', type: 'Percentage', rate: '0.50%', volume: 'KES 189M', revenue: 'KES 945K', status: 'Expiring' },
    { id: 'FR-420', name: 'Agent Cash-in', type: 'Fixed', rate: 'KES 10', volume: '89,420 txns', revenue: 'KES 894K', status: 'Active' }
  ];

  commissionTiers = [
    { tier: 'T1', name: 'Starter', volumeThreshold: 'KES 0 – 500K', rate: '0.8%', agents: 1240, paidOut: 'KES 1.12M' },
    { tier: 'T2', name: 'Growth', volumeThreshold: 'KES 500K – 2M', rate: '1.1%', agents: 682, paidOut: 'KES 2.04M' },
    { tier: 'T3', name: 'Pro', volumeThreshold: 'KES 2M – 10M', rate: '1.4%', agents: 189, paidOut: 'KES 1.48M' },
    { tier: 'T4', name: 'Elite', volumeThreshold: 'KES 10M+', rate: '1.8%', agents: 73, paidOut: 'KES 218K' }
  ];

  waivers = [
    { id: 'WV-101', name: 'SME First Transfer', type: 'Promotional', discount: '100%', used: 18420, budget: 'KES 5M' },
    { id: 'WV-105', name: 'Hardship Relief', type: 'Hardship', discount: '50%', used: 2184, budget: 'KES 2M' },
    { id: 'WV-110', name: 'Regulatory (CBK)', type: 'Regulatory', discount: '100%', used: 44920, budget: 'Unlimited' },
    { id: 'WV-112', name: 'Partner Discount', type: 'Partner', discount: '30%', used: 8920, budget: 'KES 3M' }
  ];

  recentSettlements = [
    { date: '25 Jun 2025', type: 'Agent Commission', amount: 'KES 4.12M', recipients: 2011, status: 'Completed' },
    { date: '20 Jun 2025', type: 'Partner Share', amount: 'KES 1.76M', recipients: 12, status: 'Completed' },
    { date: '18 Jun 2025', type: 'Merchant Cashback', amount: 'KES 289K', recipients: 79, status: 'Completed' }
  ];

  auditLogs = [
    { date: '26 Jun', action: 'Fee rule updated', user: 'James K.', details: 'FR-415 rate changed to 0.5%', result: 'Approved' },
    { date: '25 Jun', action: 'Waiver created', user: 'Grace M.', details: 'WV-115 — Flood Relief 100%', result: 'Approved' },
    { date: '24 Jun', action: 'Commission tier edited', user: 'James K.', details: 'T3 threshold updated', result: 'Approved' },
    { date: '23 Jun', action: 'Settlement run', user: 'System', details: 'June agent commission', result: 'Completed' }
  ];

  topAgents = [
    { id: 'AG-8821', name: 'Grace W.', volume: 'KES 48.2M', tier: 'Elite' },
    { id: 'AG-7744', name: 'Peter M.', volume: 'KES 39.8M', tier: 'Elite' },
    { id: 'AG-9910', name: 'Amina K.', volume: 'KES 31.4M', tier: 'Pro' },
    { id: 'AG-3342', name: 'John O.', volume: 'KES 27.9M', tier: 'Pro' },
    { id: 'AG-5510', name: 'Sarah N.', volume: 'KES 24.1M', tier: 'Pro' }
  ];

  attentionItems = [
    { icon: 'bi-exclamation-triangle', iconBg: 'var(--pm-danger-soft)', iconColor: 'var(--pm-danger)', title: 'Tier 3 commission rule underperforming', subtitle: 'Only 12% of target volume', action: 'editCommissionModal', actionLabel: 'Review' },
    { icon: 'bi-clock', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'Fee rule #FR-442 expires in 5 days', subtitle: 'Promotional 0.5% fee for SMEs', action: 'editFeeRuleModal', actionLabel: 'Extend' },
    { icon: 'bi-file-earmark-text', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', title: 'Monthly settlement reconciliation pending', subtitle: 'KES 2.1M difference flagged', action: 'settlementModal', actionLabel: 'Reconcile' }
  ];

  smartSuggestions = [
    { icon: 'bi-graph-up', iconBg: 'var(--pm-accent-soft)', iconColor: 'var(--pm-accent)', title: 'Introduce volume-based tier for agents', subtitle: 'Potential +KES 840K monthly revenue', action: 'addCommissionTierModal', actionLabel: 'Create Tier' },
    { icon: 'bi-lightbulb', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'Waive fees for first 3 inter-bank transfers', subtitle: 'Increase wallet adoption by 18%', action: 'waiverModal', actionLabel: 'Setup' },
    { icon: 'bi-file-earmark-check', iconBg: 'var(--pm-purple-soft)', iconColor: 'var(--pm-purple)', title: 'Audit fee leakage on high-value transfers', subtitle: 'KES 312K identified in Q2', action: 'complianceCheckModal', actionLabel: 'Audit' }
  ];

  revenueCategories = [
    { name: 'Inter-bank', value: 'KES 7.16M', height: '85%', color: 'var(--pm-primary)' },
    { name: 'Wallet', value: 'KES 3.12M', height: '62%', color: 'var(--pm-info)' },
    { name: 'Instant', value: 'KES 6.84M', height: '78%', color: 'var(--pm-accent)' },
    { name: 'Agent', value: 'KES 1.28M', height: '45%', color: 'var(--pm-warning)' },
    { name: 'Other', value: '', height: '35%', color: 'var(--pm-purple)' }
  ];

  monthlyTrend = [
    { month: 'Jan', height: '55%' },
    { month: 'Feb', height: '62%' },
    { month: 'Mar', height: '71%' },
    { month: 'Apr', height: '68%' },
    { month: 'May', height: '82%' },
    { month: 'Jun', height: '78%', highlight: true }
  ];

  topChannels = [
    { name: 'Inter-bank (KES)', amount: 'KES 7.16M', percent: '39%', badge: 'B-s' },
    { name: 'Wallet Transfers', amount: 'KES 3.12M', percent: '17%', badge: 'B-i' },
    { name: 'Instant Payments', amount: 'KES 6.84M', percent: '37%', badge: 'B-p' },
    { name: 'Agent Services', amount: 'KES 1.28M', percent: '7%', badge: 'B-w' }
  ];

  waiverBudgets = [
    { name: 'SME First Transfer', percent: 78, color: 'var(--pm-accent)' },
    { name: 'Hardship Relief', percent: 54, color: 'var(--pm-warning)' },
    { name: 'Partner Discount', percent: 31, color: 'var(--pm-info)' }
  ];

  pendingSettlements = [
    { name: 'Agent Commission — June', subtitle: '2,184 agents', amount: 'KES 4.82M' },
    { name: 'Partner Revenue Share', subtitle: '12 partners', amount: 'KES 1.89M' },
    { name: 'Merchant Cashback', subtitle: '84 merchants', amount: 'KES 312K' }
  ];

  complianceItems = [
    { name: 'CBK Fee Disclosure', status: 'Compliant', badge: 'B-s' },
    { name: 'KRA Withholding', status: 'Compliant', badge: 'B-s' },
    { name: 'Consumer Protection', status: 'Compliant', badge: 'B-s' },
    { name: 'PCI DSS Fee Storage', status: 'Compliant', badge: 'B-s' }
  ];

  feeComparison = [
    { provider: 'PayMo', fee: 'KES 2,465', time: 'Instant', rating: '4.9/5', badge: 'B-s', highlight: true },
    { provider: 'Bank A', fee: 'KES 3,200', time: '30 min', rating: '4.2/5', badge: 'B-i' },
    { provider: 'Bank B', fee: 'KES 2,850', time: '2 hours', rating: '3.8/5', badge: 'B-i' },
    { provider: 'Mobile Money', fee: 'KES 4,100', time: 'Instant', rating: '3.5/5', badge: 'B-w' }
  ];

  modalIds: string[] = [
    'addFeeRuleModal', 'editFeeRuleModal', 'feeCalculatorModal', 'addCommissionTierModal',
    'editCommissionModal', 'waiverModal', 'editWaiverModal', 'settlementModal',
    'complianceCheckModal', 'feeReportModal', 'agentLeaderboardModal', 'exemptionModal',
    'attentionFullModal', 'feeNotifModal', 'profileModal', 'notifSettingsModal',
    'policyConfigModal', 'auditDetailModal', 'bulkUploadModal', 'partnerPayoutModal',
    'regulatoryReportModal', 'tierPerformanceModal', 'hardshipWaiverModal',
    'feeCompareModal', 'finalConfirmModal'
  ];

  constructor() {}

  ngOnInit(): void {
    this.modalIds.forEach(id => { this.modalVisible[id] = false; });
    this.resetAllFlows();
    this.calculateFee();
    this.advCalc();
  }

  // Modal management
  openModal(modalId: string): void {
    this.closeAllModals();
    this.modalVisible[modalId] = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(modalId: string): void {
    this.modalVisible[modalId] = false;
    const anyOpen = Object.values(this.modalVisible).some(v => v);
    if (!anyOpen) document.body.style.overflow = '';
  }

  closeAllModals(): void {
    Object.keys(this.modalVisible).forEach(key => { this.modalVisible[key] = false; });
    document.body.style.overflow = '';
  }

  isModalVisible(modalId: string): boolean {
    return !!this.modalVisible[modalId];
  }

  onBackdropClick(event: MouseEvent, modalId: string): void {
    if (event.target === event.currentTarget) {
      this.closeModal(modalId);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.closeAllModals(); }

  // Flow management
  resetAllFlows(): void {
    this.flows = {
      fee: { current: 1, total: 4, labels: ['Details', 'Pricing', 'Conditions', 'Done'] },
      calc: { current: 1, total: 3, labels: ['Details', 'Breakdown', 'Done'] },
      waiver: { current: 1, total: 3, labels: ['Details', 'Eligibility', 'Done'] },
      settle: { current: 1, total: 3, labels: ['Select', 'Review', 'Done'] }
    };
  }

  resetFlow(key: string): void {
    const defaults: { [key: string]: FlowState } = {
      fee: { current: 1, total: 4, labels: ['Details', 'Pricing', 'Conditions', 'Done'] },
      calc: { current: 1, total: 3, labels: ['Details', 'Breakdown', 'Done'] },
      waiver: { current: 1, total: 3, labels: ['Details', 'Eligibility', 'Done'] },
      settle: { current: 1, total: 3, labels: ['Select', 'Review', 'Done'] }
    };
    this.flows[key] = { ...defaults[key] };
  }

  nextFlow(key: string, total: number): void {
    const flow = this.flows[key];
    const modalMap: { [key: string]: string } = {
      fee: 'addFeeRuleModal', calc: 'feeCalculatorModal',
      waiver: 'waiverModal', settle: 'settlementModal'
    };

    if (flow.current === total - 1) {
      this.showLoading(() => { flow.current = total; });
      return;
    }

    if (flow.current >= total) {
      this.closeModal(modalMap[key]);
      this.resetFlow(key);
      return;
    }

    flow.current++;
  }

  showLoading(callback: () => void): void {
    setTimeout(() => { callback(); }, 1400);
  }

  isStepActive(key: string, step: number): boolean {
    return this.flows[key].current === step;
  }

  isStepDone(key: string, step: number): boolean {
    return this.flows[key].current > step;
  }

  getStepNumber(key: string, step: number): string {
    return this.isStepDone(key, step) ? '✓' : String(step);
  }

  doAction(modalId: string, msg: string, ref: string): void {
    this.showLoading(() => {
      this.closeModal(modalId);
      this.resetAllFlows();
    });
  }

  // Calculator functions
  calculateFee(): void {
    const type = this.calcType;
    const amt = this.calcAmount || 0;
    let fee = 0;
    if (type.includes('Inter-bank')) fee = amt * 0.0085;
    else if (type.includes('Wallet')) fee = 25;
    else if (type.includes('Instant')) fee = amt * 0.0045;
    else fee = 10;
    const vat = fee * 0.16;
    this.baseFee = Math.round(fee);
    this.vatFee = Math.round(vat);
    this.totalFee = Math.round(fee + vat);
  }

  advCalc(): void {
    const amt = this.advAmount || 0;
    const type = this.advType;
    let base = amt * 0.0085;
    if (type.includes('Instant')) base = amt * 0.0045;
    if (type.includes('Wallet')) base = 25;
    const vat = base * 0.16;
    this.advBase = Math.round(base);
    this.advVat = Math.round(vat);
    this.advNet = 50;
    this.advTotal = Math.round(base + vat + 50);
  }

  reloadPage(): void { window.location.reload(); }
  showAlert(message: string): void { alert(message); }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Active': case 'Completed': case 'Compliant': return 'B-s';
      case 'Expiring': return 'B-w';
      default: return 'B-i';
    }
  }

  getTierBadgeClass(tier: string): string {
    switch (tier) {
      case 'Elite': return 'B-s';
      case 'Pro': return 'B-p';
      case 'Growth': return 'B-i';
      default: return 'B-s';
    }
  }
}