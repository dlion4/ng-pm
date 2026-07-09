import { Component, ViewChild, OnInit, AfterViewInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';

/* ============================================================
   DATA INTERFACES — wire these up to your API/services
   ============================================================ */
export interface DisputeCase {
  id: string;
  network: string;
  amount: number;
  currency: string;
  status: string;
  deadline?: string;
  merchant?: string;
  evidenceCount?: number;
  evidenceTotal?: number;
}

export interface Chargeback {
  cbId: string;
  caseId: string;
  network: string;
  stage: string;
  amount: number;
  currency: string;
  dueDate?: string;
}

export interface MerchantRisk {
  name: string;
  cases30d: number;
  winRate: number;
  riskScore: number;
  status: string;
}

export interface EvidenceFile {
  name: string;
  caseId: string;
  type: string;
  uploaded: string;
  size: string;
}

export interface ActivityLog {
  timestamp: string;
  caseId: string;
  action: string;
  user: string;
  details: string;
}

export interface DashboardStats {
  openCases: number;
  winRate: number;
  winRateTrend: number;
  avgResolutionDays: number;
  totalRecovered: number;
  atRiskCount: number;
  expiringCount: number;
  monthlySavings: number;
  fraudPrevention: number;
  merchantClawbacks: number;
}

@Component({
  selector: 'app-dispute-chargeback',
  standalone: true,
  imports: [CommonModule, ModalModule, ModalDirective],
  templateUrl: './dispute-chargeback.html',
  styleUrls: ['./dispute-chargeback.css'],
  encapsulation: ViewEncapsulation.None
})
export class DisputeChargebackComponent implements OnInit, AfterViewInit {

  /* ============================================================
     VIEWCHILD REFERENCES — all 22 modals
     ============================================================ */
  @ViewChild('disputeModal', { static: false }) disputeModal!: ModalDirective;
  @ViewChild('evidenceUploadModal', { static: false }) evidenceUploadModal!: ModalDirective;
  @ViewChild('chargebackResponseModal', { static: false }) chargebackResponseModal!: ModalDirective;
  @ViewChild('bulkDisputeModal', { static: false }) bulkDisputeModal!: ModalDirective;
  @ViewChild('evidencePackageModal', { static: false }) evidencePackageModal!: ModalDirective;
  @ViewChild('merchantRiskModal', { static: false }) merchantRiskModal!: ModalDirective;
  @ViewChild('resolutionAnalyticsModal', { static: false }) resolutionAnalyticsModal!: ModalDirective;
  @ViewChild('disputeRulesModal', { static: false }) disputeRulesModal!: ModalDirective;
  @ViewChild('arbitrationModal', { static: false }) arbitrationModal!: ModalDirective;
  @ViewChild('exportReportModal', { static: false }) exportReportModal!: ModalDirective;
  @ViewChild('healthCheckModal', { static: false }) healthCheckModal!: ModalDirective;
  @ViewChild('caseNotifModal', { static: false }) caseNotifModal!: ModalDirective;
  @ViewChild('profileModal', { static: false }) profileModal!: ModalDirective;
  @ViewChild('activityLogModal', { static: false }) activityLogModal!: ModalDirective;
  @ViewChild('attentionModal', { static: false }) attentionModal!: ModalDirective;
  @ViewChild('quickDisputeModal', { static: false }) quickDisputeModal!: ModalDirective;
  @ViewChild('disputeDetailModal', { static: false }) disputeDetailModal!: ModalDirective;
  @ViewChild('chargebackTrackerModal', { static: false }) chargebackTrackerModal!: ModalDirective;
  @ViewChild('disputeRulesModal2', { static: false }) disputeRulesModal2!: ModalDirective;
  @ViewChild('feeCalcModal', { static: false }) feeCalcModal!: ModalDirective;
  @ViewChild('branchSupportModal', { static: false }) branchSupportModal!: ModalDirective;
  @ViewChild('securityCheckModal', { static: false }) securityCheckModal!: ModalDirective;

  private modalMap: Record<string, ModalDirective> = {};

  /* ============================================================
     FLOW STATE — multi-step modals
     ============================================================ */
  flows: Record<string, { current: number; total: number }> = {
    disp: { current: 1, total: 4 },
    ev: { current: 1, total: 3 },
    bulk: { current: 1, total: 3 }
  };

  /* ============================================================
     TAB STATE — modal internal tabs
     ============================================================ */
  activeTabs: Record<string, string> = {
    evpkg: 'all',
    mrisk: 'high',
    ran: 'win',
    drule: 'auto'
  };

  /* ============================================================
     DASHBOARD DATA — wire to API
     ============================================================ */
  stats: DashboardStats = {
    openCases: 142,
    winRate: 68,
    winRateTrend: 4,
    avgResolutionDays: 41,
    totalRecovered: 18400000,
    atRiskCount: 29,
    expiringCount: 11,
    monthlySavings: 4200000,
    fraudPrevention: 2100000,
    merchantClawbacks: 2100000
  };

  recentTransactions = [
    { merchant: 'Amazon Kenya', card: 'Visa ****4521', amount: 87400, date: '12 Jun', ref: 'AMZ-882910' },
    { merchant: 'Jumia Pay', card: 'MC ****3392', amount: 23150, date: '10 Jun', ref: 'JM-441029' },
    { merchant: 'Booking.com', card: 'Visa ****4521', amount: 124800, date: '08 Jun', ref: 'BK-991022' },
    { merchant: 'Uber Eats', card: 'Prepaid ****8890', amount: 4200, date: '05 Jun', ref: 'UE-221901' }
  ];

  evidenceRequirements: DisputeCase[] = [
    { id: 'CDP-44892', network: 'Visa', amount: 1850000, currency: 'KES', status: '4/6 uploaded', deadline: '29 Jun', evidenceCount: 4, evidenceTotal: 6 },
    { id: 'CB-99102', network: 'Mastercard', amount: 87400, currency: 'KES', status: '2/5 uploaded', deadline: '27 Jun', evidenceCount: 2, evidenceTotal: 5 },
    { id: 'CDP-44915', network: 'PesaLink', amount: 124800, currency: 'KES', status: 'Complete', deadline: '02 Jul', evidenceCount: 6, evidenceTotal: 6 }
  ];

  evidenceLibrary = [
    { name: 'Receipts', count: 124 },
    { name: 'Police Reports', count: 38 },
    { name: 'Delivery Proof', count: 67 },
    { name: 'Contracts', count: 19 }
  ];

  activeChargebacks: Chargeback[] = [
    { cbId: 'CB-99102', caseId: 'CDP-44892', network: 'Visa', stage: 'Representment', amount: 87400, currency: 'KES', dueDate: '27 Jun' },
    { cbId: 'CB-99087', caseId: 'CDP-44710', network: 'MC', stage: 'Pre-Arbitration', amount: 312000, currency: 'KES', dueDate: '02 Jul' },
    { cbId: 'CB-99065', caseId: 'CDP-44655', network: 'Visa', stage: 'Arbitration', amount: 1240000, currency: 'KES', dueDate: '15 Jul' }
  ];

  stageSummary = [
    { stage: 'First Chargeback', count: 48, badgeClass: 'B-s' },
    { stage: 'Representment', count: 29, badgeClass: 'B-w' },
    { stage: 'Pre-Arbitration', count: 12, badgeClass: 'B-i' },
    { stage: 'Arbitration', count: 7, badgeClass: 'B-d' },
    { stage: 'Resolved (30d)', count: 67, badgeClass: 'B-s' }
  ];

  winRateByReason = [
    { reason: 'Unauthorised', rate: 82, badgeClass: 'B-s' },
    { reason: 'Not Received', rate: 71, badgeClass: 'B-s' },
    { reason: 'Not Described', rate: 54, badgeClass: 'B-w' },
    { reason: 'Duplicate', rate: 89, badgeClass: 'B-s' },
    { reason: 'Cancelled', rate: 63, badgeClass: 'B-i' }
  ];

  topMerchants = [
    { name: 'Amazon Kenya', cases: 18, winRate: 61, status: 'Review', badgeClass: 'B-w' },
    { name: 'Jumia Pay', cases: 12, winRate: 75, status: 'OK', badgeClass: 'B-s' },
    { name: 'Booking.com', cases: 9, winRate: 44, status: 'High Risk', badgeClass: 'B-d' },
    { name: 'Uber Eats', cases: 7, winRate: 86, status: 'OK', badgeClass: 'B-s' },
    { name: 'Local Vendor X', cases: 6, winRate: 17, status: 'Blacklist', badgeClass: 'B-d' }
  ];

  recentActivity: ActivityLog[] = [
    { timestamp: '27 Jun', caseId: 'CDP-44923', action: 'Dispute', user: 'System', details: 'Amazon Kenya — KES 87,400 — Under Review' },
    { timestamp: '26 Jun', caseId: 'CB-99102', action: 'Chargeback', user: 'System', details: 'Jumia Pay — KES 23,150 — Representment' },
    { timestamp: '25 Jun', caseId: 'CDP-44915', action: 'Dispute', user: 'System', details: 'Booking.com — KES 124,800 — Resolved - Won' },
    { timestamp: '24 Jun', caseId: 'CDP-44892', action: 'Dispute', user: 'System', details: 'Local Vendor X — KES 1,850,000 — Evidence Pending' }
  ];

  attentionItems = [
    { title: 'High-value dispute expiring', detail: 'CDP-44892 · KES 1.85M · 4 days left', icon: 'bi-exclamation-triangle', iconColor: 'var(--pm-danger)', iconBg: 'var(--pm-danger-soft)', action: 'evidenceUploadModal', actionLabel: 'Upload', actionClass: 'btn-pm-d' },
    { title: 'Merchant repeat offender', detail: '4 cases this month · Blacklist review', icon: 'bi-arrow-repeat', iconColor: 'var(--pm-warning)', iconBg: 'var(--pm-warning-soft)', action: 'merchantRiskModal', actionLabel: 'Review', actionClass: '' },
    { title: 'Chargeback response due today', detail: 'CB-99102 · Visa · KES 87,400', icon: 'bi-clock', iconColor: 'var(--pm-info)', iconBg: 'var(--pm-info-soft)', action: 'chargebackResponseModal', actionLabel: 'Respond', actionClass: '' }
  ];

  smartSuggestions = [
    { title: 'Increase evidence bundle for online disputes', detail: '+18% win rate improvement', icon: 'bi-graph-up', iconColor: 'var(--pm-accent)', iconBg: 'var(--pm-accent-soft)', action: 'evidenceUploadModal', actionLabel: 'Apply' },
    { title: 'Blacklist 3 high-risk merchants', detail: 'Prevent 12 future disputes', icon: 'bi-building', iconColor: 'var(--pm-purple)', iconBg: 'var(--pm-purple-soft)', action: 'merchantRiskModal', actionLabel: 'Blacklist' },
    { title: 'Enable auto-escalation for >KES 500k', detail: 'Reduce SLA breach risk', icon: 'bi-clock-history', iconColor: 'var(--pm-warning)', iconBg: 'var(--pm-warning-soft)', action: 'disputeRulesModal', actionLabel: 'Enable' }
  ];

  quickActions = [
    { label: 'File Dispute', icon: 'bi-plus-circle', iconColor: 'text-primary', modal: 'disputeModal' },
    { label: 'Upload Evidence', icon: 'bi-upload', iconColor: 'text-success', modal: 'evidenceUploadModal' },
    { label: 'Respond to CB', icon: 'bi-reply', iconColor: 'text-info', modal: 'chargebackResponseModal' },
    { label: 'Bulk Action', icon: 'bi-collection', iconColor: '', styleColor: 'var(--pm-purple)', modal: 'bulkDisputeModal' },
    { label: 'Merchant Risk', icon: 'bi-building', iconColor: 'text-warning', modal: 'merchantRiskModal' },
    { label: 'Analytics', icon: 'bi-bar-chart-line', iconColor: '', styleColor: 'var(--pm-accent)', modal: 'resolutionAnalyticsModal' },
    { label: 'Rules', icon: 'bi-sliders', iconColor: '', styleColor: 'var(--pm-primary)', modal: 'disputeRulesModal' },
    { label: 'Export Report', icon: 'bi-download', iconColor: 'text-muted', modal: 'exportReportModal' }
  ];

  evidenceFiles: EvidenceFile[] = [
    { name: 'receipt_amz.pdf', caseId: 'CDP-44892', type: 'Receipt', uploaded: '27 Jun', size: '1.2 MB' },
    { name: 'police_88291.pdf', caseId: 'CDP-44892', type: 'Police', uploaded: '26 Jun', size: '3.4 MB' },
    { name: 'id_jk.jpg', caseId: 'CDP-44915', type: 'ID', uploaded: '25 Jun', size: '0.8 MB' }
  ];

  merchantRiskList: MerchantRisk[] = [
    { name: 'Local Vendor X', cases30d: 6, winRate: 17, riskScore: 94, status: 'Blacklist' },
    { name: 'Booking.com', cases30d: 9, winRate: 44, riskScore: 72, status: 'Monitor' }
  ];

  healthMetrics = [
    { metric: 'Evidence completeness', current: '78%', target: '95%', status: 'Below', badgeClass: 'B-w' },
    { metric: 'On-time filing', current: '94%', target: '100%', status: 'Good', badgeClass: 'B-s' },
    { metric: 'Merchant blacklisting', current: '3', target: '5', status: 'Below', badgeClass: 'B-w' },
    { metric: 'Arbitration win rate', current: '52%', target: '65%', status: 'Below', badgeClass: 'B-w' }
  ];

  notifications = [
    { title: 'CDP-44892 evidence deadline in 2 days', detail: 'Upload remaining documents before 29 Jun.', bg: 'var(--pm-danger-soft)', color: '#7F1D1D' },
    { title: 'CB-99102 representment response due today', detail: 'Visa deadline: 27 Jun 2025.', bg: 'var(--pm-warning-soft)', color: '#92400E' },
    { title: 'CDP-44923 evidence package complete', detail: 'Submitted to Visa successfully.', bg: 'var(--pm-info-soft)', color: '#1E40AF' },
    { title: 'CDP-44915 resolved — won', detail: 'KES 124,800 recovered.', bg: 'var(--pm-accent-soft)', color: '#065F46' },
    { title: 'Merchant blacklisting applied', detail: 'Local Vendor X — 3 new disputes prevented.', bg: '#fff', color: 'var(--pm-muted)' }
  ];

  activityLogFull: ActivityLog[] = [
    { timestamp: '27 Jun 14:32', caseId: 'CDP-44923', action: 'Evidence uploaded', user: 'James K.', details: 'receipt_amz.pdf, police_88291.pdf' },
    { timestamp: '27 Jun 11:15', caseId: 'CB-99102', action: 'Representment filed', user: 'Grace M.', details: 'Response submitted to Visa' },
    { timestamp: '26 Jun 09:40', caseId: 'CDP-44892', action: 'Merchant flagged', user: 'System', details: 'Local Vendor X — risk score 94' },
    { timestamp: '25 Jun 16:20', caseId: 'CDP-44915', action: 'Case resolved — won', user: 'James K.', details: 'KES 124,800 recovered' }
  ];

  timeDistribution = [
    { range: '0-30 days', percent: 42, badgeClass: 'B-s' },
    { range: '31-60 days', percent: 38, badgeClass: 'B-w' },
    { range: '61-90 days', percent: 15, badgeClass: 'B-i' },
    { range: '90+ days', percent: 5, badgeClass: 'B-d' }
  ];

  reasonCodeStats = [
    { code: 'Unauthorised', cases: 16, winRate: 82, avgDays: 32 },
    { code: 'Not Received', cases: 9, winRate: 71, avgDays: 48 },
    { code: 'Duplicate', cases: 7, winRate: 89, avgDays: 21 }
  ];

  merchantAnalytics = [
    { name: 'Amazon Kenya', cases: 18, winRate: 61, avgAmount: 'KES 87k', trend: '↑', trendClass: 'B-s' },
    { name: 'Jumia Pay', cases: 12, winRate: 75, avgAmount: 'KES 23k', trend: '↑', trendClass: 'B-s' },
    { name: 'Booking.com', cases: 9, winRate: 44, avgAmount: 'KES 125k', trend: '↓', trendClass: 'B-w' }
  ];

  branchLocations = [
    { name: 'PayMo Westlands', address: 'Sarit Centre, Level 2', services: 'Dispute filing, Evidence upload', distance: '1.2 km' },
    { name: 'PayMo CBD', address: 'Koinange / Kenyatta', services: 'Full dispute support', distance: '3.4 km' }
  ];

  disputeReasons = [
    { code: 'unauthorised', label: 'Unauthorised', icon: 'bi-person-x', color: 'text-danger' },
    { code: 'not_received', label: 'Not Received', icon: 'bi-box-arrow-left', color: 'text-warning' },
    { code: 'not_described', label: 'Not Described', icon: 'bi-exclamation-octagon', color: 'text-info' },
    { code: 'duplicate', label: 'Duplicate', icon: 'bi-copy', color: 'text-purple' },
    { code: 'cancelled', label: 'Cancelled', icon: 'bi-x-circle', color: 'text-danger' },
    { code: 'refund', label: 'Refund Issue', icon: 'bi-arrow-counterclockwise', color: 'text-accent' }
  ];

  filingStats = [
    { label: 'FILED', value: '38', bg: 'var(--pm-danger-soft)', color: '#991B1B', size: '24px' },
    { label: 'AVG VALUE', value: 'KES 124,800', bg: 'var(--pm-warning-soft)', color: 'var(--pm-warning)', size: '20px' },
    { label: 'TOP REASON', value: 'Unauthorised (42%)', bg: 'var(--pm-accent-soft)', color: 'var(--pm-accent)', size: '18px' }
  ];

  recoverySummary = [
    { label: 'TOTAL RECOVERED', value: 'KES 18.4M', bg: 'var(--pm-accent-soft)', color: 'var(--pm-accent)', size: '22px' },
    { label: 'AVG PER CASE', value: 'KES 129,600', bg: 'var(--pm-info-soft)', color: 'var(--pm-info)', size: '18px' },
    { label: 'MERCHANT CLAWBACKS', value: 'KES 4.7M', bg: 'var(--pm-purple-soft)', color: 'var(--pm-purple)', size: '18px' }
  ];

  healthScoreCards = [
    { value: '84', label: 'HEALTH SCORE', bg: 'var(--pm-accent-soft)', color: 'var(--pm-accent)', size: '28px' },
    { value: '11', label: 'EXPIRING', bg: 'var(--pm-warning-soft)', color: 'var(--pm-warning)', size: '24px' },
    { value: '41d', label: 'AVG TIME', bg: 'var(--pm-info-soft)', color: 'var(--pm-info)', size: '24px' },
    { value: '68%', label: 'WIN RATE', bg: 'var(--pm-purple-soft)', color: 'var(--pm-purple)', size: '24px' }
  ];

  securityScoreCards = [
    { value: '92', label: 'SECURITY SCORE', bg: 'var(--pm-accent-soft)', color: 'var(--pm-accent)', size: '28px' },
    { value: '100%', label: '2FA ENABLED', bg: 'var(--pm-info-soft)', color: 'var(--pm-info)', size: '24px' },
    { value: '0', label: 'BREACHES', bg: 'var(--pm-purple-soft)', color: 'var(--pm-purple)', size: '24px' }
  ];

  feeCalcResult = {
    networkFee: 'KES 2,500',
    legalReview: 'KES 15,000',
    totalCost: 'KES 17,500'
  };

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.buildModalMap();
    this.initFlows();
  }

  private buildModalMap(): void {
    this.modalMap = {
      disputeModal: this.disputeModal,
      evidenceUploadModal: this.evidenceUploadModal,
      chargebackResponseModal: this.chargebackResponseModal,
      bulkDisputeModal: this.bulkDisputeModal,
      evidencePackageModal: this.evidencePackageModal,
      merchantRiskModal: this.merchantRiskModal,
      resolutionAnalyticsModal: this.resolutionAnalyticsModal,
      disputeRulesModal: this.disputeRulesModal,
      arbitrationModal: this.arbitrationModal,
      exportReportModal: this.exportReportModal,
      healthCheckModal: this.healthCheckModal,
      caseNotifModal: this.caseNotifModal,
      profileModal: this.profileModal,
      activityLogModal: this.activityLogModal,
      attentionModal: this.attentionModal,
      quickDisputeModal: this.quickDisputeModal,
      disputeDetailModal: this.disputeDetailModal,
      chargebackTrackerModal: this.chargebackTrackerModal,
      disputeRulesModal2: this.disputeRulesModal2,
      feeCalcModal: this.feeCalcModal,
      branchSupportModal: this.branchSupportModal,
      securityCheckModal: this.securityCheckModal
    };
  }

  /* ============================================================
     MODAL OPEN / CLOSE
     ============================================================ */
  openModal(modalId: string): void {
    const modal = this.modalMap[modalId];
    if (modal) {
      modal.show();
    } else {
      console.warn('Modal not found:', modalId);
    }
  }

  closeModal(modalId: string): void {
    const modal = this.modalMap[modalId];
    if (modal) {
      modal.hide();
    }
  }

  /* ============================================================
     MULTI-STEP FLOW LOGIC
     ============================================================ */
  initFlows(): void {
    Object.keys(this.flows).forEach(key => {
      this.flows[key].current = 1;
    });
  }

  nextFlow(key: string, total: number): void {
    const f = this.flows[key];
    if (!f) return;

    if (f.current === total - 1) {
      this.simulateLoading(() => {
        f.current = total;
      });
      return;
    }

    if (f.current >= total) {
      const modalId = this.getModalIdFromFlowKey(key);
      if (modalId) {
        this.closeModal(modalId);
      }
      setTimeout(() => { f.current = 1; }, 300);
      return;
    }

    f.current++;
  }

  private getModalIdFromFlowKey(key: string): string {
    const map: Record<string, string> = {
      disp: 'disputeModal',
      ev: 'evidenceUploadModal',
      bulk: 'bulkDisputeModal'
    };
    return map[key] || '';
  }

  getFlowCurrent(key: string): number {
    return this.flows[key]?.current || 1;
  }

  getFlowTotal(key: string): number {
    return this.flows[key]?.total || 1;
  }

  isStepActive(key: string, step: number): boolean {
    return this.getFlowCurrent(key) === step;
  }

  isStepDone(key: string, step: number): boolean {
    return this.getFlowCurrent(key) > step;
  }

  getStepNumberDisplay(key: string, step: number): string {
    return this.isStepDone(key, step) ? 'check' : String(step);
  }

  /* ============================================================
     TAB SWITCHING (inside modals)
     ============================================================ */
  sw(prefix: string, key: string): void {
    this.activeTabs[prefix] = key;
  }

  isTabActive(prefix: string, key: string): boolean {
    return this.activeTabs[prefix] === key;
  }

  /* ============================================================
     QUICK DISPUTE
     ============================================================ */
  quickDispute(type: string): void {
    this.closeModal('disputeModal');
    setTimeout(() => {
      this.openModal('quickDisputeModal');
    }, 150);
  }

  /* ============================================================
     DO ACTION (with loading simulation)
     ============================================================ */
  doAction(modalId: string, msg: string, ref: string): void {
    this.simulateLoading(() => {
      this.closeModal(modalId);
      // Show a simple alert or console log for now
      // In production, use a toast service
      console.log(msg, ref);
    });
  }

  private buildSuccessHtml(msg: string, ref: string): string {
    return `
      <div class="receipt">
        <div class="ri"><i class="bi bi-check-lg"></i></div>
        <h5 style="font-weight:700;color:var(--pm-accent)">${msg}</h5>
        ${ref ? `<p style="font-size:12px;color:var(--pm-muted)">Ref: ${ref}</p>` : ''}
        <div class="d-flex justify-content-center mt-3" style="gap:8px">
          <button class="btn-pm btn-sm" onclick="location.reload()">
            <i class="bi bi-download"></i> Save
          </button>
        </div>
      </div>
    `;
  }

  /* ============================================================
     LOADING SIMULATION
     ============================================================ */
  private simulateLoading(callback: () => void): void {
    setTimeout(() => {
      callback();
    }, 1400);
  }

  private showLoading(target: HTMLElement, callback: () => void): void {
    const ov = document.createElement('div');
    ov.className = 'loading-ov';
    ov.innerHTML = '<div class="spinner"></div><p style="margin-top:12px;font-size:13px;font-weight:600;color:var(--pm-primary)">Processing...</p>';
    target.style.position = 'relative';
    target.appendChild(ov);
    setTimeout(() => {
      ov.remove();
      callback();
    }, 1400);
  }

  /* ============================================================
     UTILITY
     ============================================================ */
  formatCurrency(amount: number): string {
    return 'KES ' + amount.toLocaleString('en-KE');
  }

  trackByIndex(index: number): number {
    return index;
  }
}