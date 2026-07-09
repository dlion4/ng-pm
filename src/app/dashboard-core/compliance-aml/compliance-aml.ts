import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';

/* ─── Data Models ───────────────────────────────────────────────────── */

export interface Transaction {
  time: string;
  reference: string;
  fromTo: string;
  amount: string;
  rail: string;
  risk: number;
  status: 'Alert' | 'Hold' | 'Cleared';
}

export interface Case {
  id: string;
  type: string;
  subject: string;
  risk: number;
  status: string;
  opened: string;
  owner: string;
}

export interface Report {
  id: string;
  type: string;
  subject: string;
  filed: string;
  status: string;
}

export interface AuditEntry {
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  evidence: string;
  ipDevice: string;
}

export interface AttentionItem {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  actionModal: string;
  actionStyle: string;
}

export interface Suggestion {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  actionModal: string;
}

export interface DetectionRule {
  name: string;
  description: string;
  status: 'Active' | 'Paused';
  precision: string;
}

export interface RulePerformance {
  rule: string;
  alerts: number;
  confirmed: number;
  precision: string;
}

export interface ScreeningMatch {
  entity: string;
  list: string;
  score: number;
  risk: string;
}

export interface RiskFactor {
  name: string;
  count: string;
}

export interface EvidenceFile {
  file: string;
  type: string;
  uploaded: string;
  hash: string;
}

export interface NotificationItem {
  title: string;
  subtitle: string;
  bgClass: string;
  textClass: string;
}

export interface Deadline {
  title: string;
  date: string;
  urgency: string;
  badgeClass: string;
  actionLabel: string;
  actionModal: string;
  actionStyle: string;
}

/* ─── Component ─────────────────────────────────────────────────────── */

@Component({
  selector: 'app-compliance-aml',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalModule],
  templateUrl: './compliance-aml.html',
  styleUrls: ['./compliance-aml.css'],
  encapsulation: ViewEncapsulation.None
})
export class ComplianceAmlComponent implements OnInit, AfterViewInit {

  /* ─── Single Modal Reference ─────────────────────────────────────── */
  modalRef?: BsModalRef;

  /* ─── ViewChild references for all modal templates ───────────────── */
  @ViewChild('newCaseModal') newCaseModal!: TemplateRef<any>;
  @ViewChild('caseDetailModal') caseDetailModal!: TemplateRef<any>;
  @ViewChild('sanctionsSearchModal') sanctionsSearchModal!: TemplateRef<any>;
  @ViewChild('amlRulesModal') amlRulesModal!: TemplateRef<any>;
  @ViewChild('riskScoringModal') riskScoringModal!: TemplateRef<any>;
  @ViewChild('regReportModal') regReportModal!: TemplateRef<any>;
  @ViewChild('evidenceLockerModal') evidenceLockerModal!: TemplateRef<any>;
  @ViewChild('auditTrailModal') auditTrailModal!: TemplateRef<any>;
  @ViewChild('pepDetailModal') pepDetailModal!: TemplateRef<any>;
  @ViewChild('liveAlertsModal') liveAlertsModal!: TemplateRef<any>;
  @ViewChild('bulkScreeningModal') bulkScreeningModal!: TemplateRef<any>;
  @ViewChild('emergencyBlockModal') emergencyBlockModal!: TemplateRef<any>;
  @ViewChild('ruleTestModal') ruleTestModal!: TemplateRef<any>;
  @ViewChild('reportDetailModal') reportDetailModal!: TemplateRef<any>;
  @ViewChild('reportCalendarModal') reportCalendarModal!: TemplateRef<any>;
  @ViewChild('monitorSettingsModal') monitorSettingsModal!: TemplateRef<any>;
  @ViewChild('txnDetailModal') txnDetailModal!: TemplateRef<any>;
  @ViewChild('attentionFullModal') attentionFullModal!: TemplateRef<any>;
  @ViewChild('amlHealthModal') amlHealthModal!: TemplateRef<any>;
  @ViewChild('caseExportModal') caseExportModal!: TemplateRef<any>;
  @ViewChild('amlNotifModal') amlNotifModal!: TemplateRef<any>;
  @ViewChild('profileModal') profileModal!: TemplateRef<any>;
  @ViewChild('notifSettingsModal') notifSettingsModal!: TemplateRef<any>;
  @ViewChild('ruleTestResultModal') ruleTestResultModal!: TemplateRef<any>;
  @ViewChild('riskModelModal') riskModelModal!: TemplateRef<any>;
  @ViewChild('railConfigModal') railConfigModal!: TemplateRef<any>;

  /* ─── Search ─────────────────────────────────────────────────────── */
  searchQuery = '';

  /* ─── Case Stepper Flow ──────────────────────────────────────────── */
  caseStepCurrent = 1;
  caseStepTotal = 4;
  caseStepLabels = ['Type', 'Scope', 'Actions', 'Done'];
  caseStepLoading = false;

  /* ─── Case Detail Tabs ───────────────────────────────────────────── */
  caseDetailTab = 'overview';

  /* ─── AML Rules Tabs ─────────────────────────────────────────────── */
  amlRulesTab = 'active';

  /* ─── Risk Scoring Tabs ──────────────────────────────────────────── */
  riskScoringTab = 'factors';

  /* ─── Loading state for modal actions ────────────────────────────── */
  modalActionLoading = false;
  modalActionMessage = '';
  modalActionRef = '';

  /* ─── Data: Hero Stats ───────────────────────────────────────────── */
  heroStats = {
    monitoredToday: 47291,
    highRiskAlerts: 17,
    immediateAction: 4,
    strsToday: 2,
    ctrBreaches: 9,
    detectionRate: 98.7,
    detectionChange: 1.2,
    falsePositiveRate: 4.1,
    avgInvestigationTime: '2.4 hrs',
    regulatoryFilings: 142,
    strsMonth: 31,
    ctrsMonth: 89,
    sarsMonth: 22,
    nextCbkReport: '30 Jun'
  };

  /* ─── Data: Attention Required ──────────────────────────────────── */
  attentionItems: AttentionItem[] = [
    {
      icon: 'bi-exclamation-triangle', iconBg: 'var(--pm-danger-soft)', iconColor: 'var(--pm-danger)',
      title: 'Structuring detected — 3 linked txns', subtitle: 'KSh 2.8M in 48h via multiple accounts',
      actionLabel: 'Investigate', actionModal: 'newCaseModal', actionStyle: 'btn-pm-d'
    },
    {
      icon: 'bi-person-x', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)',
      title: 'PEP match on beneficiary', subtitle: 'TXN-884291 — Requires enhanced due diligence',
      actionLabel: 'Review', actionModal: 'pepDetailModal', actionStyle: ''
    },
    {
      icon: 'bi-globe', iconBg: 'var(--pm-purple-soft)', iconColor: 'var(--pm-purple)',
      title: 'Sanctions list update — 47 new entries', subtitle: 'Screening in progress (12,400 txns)',
      actionLabel: 'Scan', actionModal: 'sanctionsSearchModal', actionStyle: ''
    },
    {
      icon: 'bi-file-earmark-text', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)',
      title: 'STR draft ready for review', subtitle: 'Case #AML-44892 — Due in 18 hours',
      actionLabel: 'Open', actionModal: 'caseDetailModal', actionStyle: ''
    }
  ];

  /* ─── Data: Smart Suggestions ──────────────────────────────────── */
  suggestions: Suggestion[] = [
    {
      icon: 'bi-robot', iconBg: 'var(--pm-accent-soft)', iconColor: 'var(--pm-accent)',
      title: 'Tighten velocity rule for cross-border', subtitle: 'Reduce false positives by 18%',
      actionLabel: 'Tune Rule', actionModal: 'amlRulesModal'
    },
    {
      icon: 'bi-graph-up', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)',
      title: 'Increase risk score weight for crypto exchanges', subtitle: 'Current weight: 25% → Suggested: 40%',
      actionLabel: 'Adjust', actionModal: 'riskScoringModal'
    },
    {
      icon: 'bi-link-45deg', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)',
      title: 'Enable real-time sanctions screening on PesaLink', subtitle: 'Currently batch (every 15 min)',
      actionLabel: 'Enable', actionModal: 'railConfigModal'
    }
  ];

  /* ─── Data: Quick Actions ──────────────────────────────────────── */
  quickActions = [
    { icon: 'bi-folder-plus', iconColor: 'text-danger', label: 'New Investigation', modal: 'newCaseModal' },
    { icon: 'bi-globe', iconColor: 'text-warning', label: 'Sanctions Search', modal: 'sanctionsSearchModal' },
    { icon: 'bi-sliders', iconColor: 'text-primary', label: 'Edit Rules', modal: 'amlRulesModal' },
    { icon: 'bi-file-earmark-text', iconColor: '', customColor: 'var(--pm-purple)', label: 'File STR/CTR', modal: 'regReportModal' },
    { icon: 'bi-speedometer2', iconColor: '', customColor: 'var(--pm-info)', label: 'Risk Engine', modal: 'riskScoringModal' },
    { icon: 'bi-clock-history', iconColor: '', customColor: 'var(--pm-accent)', label: 'Audit Log', modal: 'auditTrailModal' },
    { icon: 'bi-people', iconColor: '', customColor: 'var(--pm-warning)', label: 'Bulk Screen', modal: 'bulkScreeningModal' },
    { icon: 'bi-archive', iconColor: '', customColor: 'var(--pm-muted)', label: 'Evidence Locker', modal: 'evidenceLockerModal' }
  ];

  /* ─── Data: Live Transactions ────────────────────────────────────── */
  transactions: Transaction[] = [
    { time: '14:32', reference: 'TXN-992184', fromTo: 'Equity → KCB', amount: 'KES 2,450,000', rail: 'PesaLink', risk: 92, status: 'Alert' },
    { time: '14:31', reference: 'TXN-992183', fromTo: 'Co-op → Stanbic', amount: 'KES 185,000', rail: 'RTGS', risk: 48, status: 'Cleared' },
    { time: '14:30', reference: 'TXN-992182', fromTo: 'Absa → Family', amount: 'KES 47,500', rail: 'ACH', risk: 12, status: 'Cleared' },
    { time: '14:29', reference: 'TXN-992181', fromTo: 'NCBA → Equity', amount: 'USD 125,000', rail: 'SWIFT', risk: 78, status: 'Hold' },
    { time: '14:28', reference: 'TXN-992180', fromTo: 'KCB → I&M', amount: 'KES 890,000', rail: 'PesaLink', risk: 55, status: 'Cleared' }
  ];

  riskDistribution = [
    { label: 'Low Risk (0-30)', count: '41,882 (88.5%)', width: 88.5, color: 'var(--pm-accent)' },
    { label: 'Medium Risk (31-60)', count: '4,392 (9.3%)', width: 9.3, color: 'var(--pm-warning)' },
    { label: 'High Risk (61-100)', count: '1,017 (2.2%)', width: 2.2, color: 'var(--pm-danger)' }
  ];

  /* ─── Data: Detection Rules ────────────────────────────────────── */
  detectionRules: DetectionRule[] = [
    { name: 'Structuring Detection', description: 'Multiple transactions just below threshold in 48h', status: 'Active', precision: '98.4%' },
    { name: 'Velocity Rule — Cross-border', description: '>3 international txns in 24h from same originator', status: 'Active', precision: '94.1%' },
    { name: 'Round-Tripping Detection', description: 'Funds returning to originator within 7 days', status: 'Active', precision: '87.6%' },
    { name: 'PEP Transaction Spike', description: 'PEP-linked account >300% avg volume', status: 'Active', precision: '91.2%' },
    { name: 'Crypto Exchange Concentration', description: '>40% monthly volume to crypto exchanges', status: 'Paused', precision: '—' }
  ];

  rulePerformance: RulePerformance[] = [
    { rule: 'Structuring', alerts: 412, confirmed: 89, precision: '21.6%' },
    { rule: 'Velocity (Intl)', alerts: 187, confirmed: 61, precision: '32.6%' },
    { rule: 'Round-Trip', alerts: 94, confirmed: 38, precision: '40.4%' },
    { rule: 'PEP Spike', alerts: 31, confirmed: 19, precision: '61.3%' }
  ];

  /* ─── Data: Screening ──────────────────────────────────────────── */
  screeningSummary = {
    totalScreened: 47291,
    matchesFound: 47,
    falsePositives: 38,
    trueMatches: 9,
    pepHits: 12,
    lastRefresh: '27 Jun 2025, 06:00 EAT'
  };

  screeningMatches: ScreeningMatch[] = [
    { entity: 'John Kamau (Beneficiary)', list: 'UN Consolidated', score: 98, risk: 'High Risk' },
    { entity: 'Global Trade Ltd (Originator)', list: 'OFAC SDN', score: 94, risk: 'High Risk' },
    { entity: 'Hon. Peter Ochieng (Director)', list: 'Local PEP DB', score: 72, risk: 'Medium Risk' }
  ];

  /* ─── Data: Risk Scoring ─────────────────────────────────────────── */
  riskScoreDistribution = [
    { label: '0-20 (Very Low)', count: '18,442 (39%)', width: 39, color: 'var(--pm-accent)' },
    { label: '21-40 (Low)', count: '14,188 (30%)', width: 30, color: '#34D399' },
    { label: '41-60 (Medium)', count: '9,458 (20%)', width: 20, color: 'var(--pm-warning)' },
    { label: '61-80 (High)', count: '3,776 (8%)', width: 8, color: 'var(--pm-danger)' },
    { label: '81-100 (Critical)', count: '1,427 (3%)', width: 3, color: '#DC2626' }
  ];

  riskFactors: RiskFactor[] = [
    { name: 'High-risk jurisdiction', count: '2,841 txns' },
    { name: 'PEP relationship', count: '1,992 txns' },
    { name: 'Crypto exchange exposure', count: '1,447 txns' },
    { name: 'Structuring pattern', count: '892 txns' },
    { name: 'Adverse media hit', count: '611 txns' }
  ];

  /* ─── Data: Cases ────────────────────────────────────────────────── */
  cases: Case[] = [
    { id: 'AML-44892', type: 'Structuring', subject: 'John K. & 3 linked accounts', risk: 92, status: 'Investigation', opened: '24 Jun', owner: 'Sarah M.' },
    { id: 'AML-44885', type: 'Sanctions', subject: 'Global Trade Ltd', risk: 94, status: 'Escalated', opened: '23 Jun', owner: 'David O.' },
    { id: 'AML-44871', type: 'PEP', subject: 'Hon. Peter Ochieng', risk: 72, status: 'Under Review', opened: '22 Jun', owner: 'Amina K.' },
    { id: 'AML-44860', type: 'Round-Trip', subject: 'TechFlow Solutions', risk: 61, status: 'Closed', opened: '18 Jun', owner: 'James K.' }
  ];

  /* ─── Data: Reports ──────────────────────────────────────────────── */
  reports: Report[] = [
    { id: 'STR-2025-0612', type: 'STR', subject: 'Structuring — John K. network', filed: '26 Jun', status: 'Submitted' },
    { id: 'CTR-2025-0611', type: 'CTR', subject: 'Cash deposits > KES 1M', filed: '25 Jun', status: 'Acknowledged' },
    { id: 'SAR-2025-0608', type: 'SAR', subject: 'PEP adverse media', filed: '22 Jun', status: 'Submitted' }
  ];

  deadlines: Deadline[] = [
    { title: 'STR Draft #AML-44892', date: 'Due in 18 hours', urgency: 'Critical', badgeClass: 'B-d', actionLabel: 'Complete', actionModal: 'caseDetailModal', actionStyle: 'btn-pm-d' },
    { title: 'Monthly CBK Summary', date: 'Due 30 Jun 2025', urgency: 'High', badgeClass: 'B-w', actionLabel: 'Prepare', actionModal: 'regReportModal', actionStyle: '' },
    { title: 'Quarterly AML Report', date: 'Due 15 Jul 2025', urgency: 'Normal', badgeClass: 'B-i', actionLabel: 'Start', actionModal: 'regReportModal', actionStyle: '' }
  ];

  /* ─── Data: Audit Trail ──────────────────────────────────────────── */
  auditTrail: AuditEntry[] = [
    { timestamp: '27 Jun 14:28', user: 'Sarah M.', action: 'Case escalated to CBK', entity: 'AML-44892', evidence: 'STR-2025-0612', ipDevice: '102.68.XX.XX — MacBook' },
    { timestamp: '27 Jun 13:55', user: 'David O.', action: 'Added evidence file', entity: 'AML-44885', evidence: 'bank_statements.pdf', ipDevice: '102.68.XX.XX — Windows' },
    { timestamp: '27 Jun 11:42', user: 'Amina K.', action: 'Updated risk score', entity: 'PEP-7721', evidence: '—', ipDevice: '102.68.XX.XX — iPhone' },
    { timestamp: '26 Jun 09:15', user: 'System', action: 'Auto-block triggered', entity: 'TXN-992184', evidence: 'Rule: Velocity-INTL', ipDevice: '—' }
  ];

  /* ─── Data: Case Detail Timeline ───────────────────────────────── */
  caseTimeline = [
    { date: '24 Jun 09:12', event: 'Case created by system (Structuring rule triggered)' },
    { date: '24 Jun 10:45', event: 'Sarah M. assigned as lead investigator' },
    { date: '24 Jun 14:30', event: 'Account freeze executed on 3 accounts' },
    { date: '25 Jun 11:20', event: 'Bank statements received (Equity, KCB, NCBA)' },
    { date: '26 Jun 16:05', event: 'Evidence uploaded: 47 transaction screenshots' },
    { date: '27 Jun 08:40', event: 'STR draft submitted for internal review' }
  ];

  /* ─── Data: Evidence Files ──────────────────────────────────────── */
  evidenceFiles: EvidenceFile[] = [
    { file: 'equity_statements_jun25.pdf', type: 'Bank Statement', uploaded: '25 Jun', hash: 'SHA256: a3f2...' },
    { file: 'structuring_pattern.png', type: 'Analysis', uploaded: '26 Jun', hash: 'SHA256: 9c81...' },
    { file: 'PEP_profile_john_kamau.pdf', type: 'Screening', uploaded: '26 Jun', hash: 'SHA256: 4b92...' }
  ];

  /* ─── Data: Notifications ────────────────────────────────────────── */
  notifications: NotificationItem[] = [
    { title: 'Structuring alert — 3 linked txns', subtitle: 'KES 2.45M in 48h • Case opened', bgClass: 'var(--pm-danger-soft)', textClass: '#7F1D1D' },
    { title: 'PEP transaction spike', subtitle: 'Hon. Peter Ochieng — 340% above average', bgClass: 'var(--pm-warning-soft)', textClass: '#92400E' },
    { title: 'Sanctions match', subtitle: 'Global Trade Ltd — OFAC SDN hit', bgClass: 'var(--pm-info-soft)', textClass: '#1E40AF' },
    { title: 'STR draft ready', subtitle: 'AML-44892 • Due in 18 hours', bgClass: 'var(--pm-accent-soft)', textClass: '#065F46' }
  ];

  /* ─── Data: Attention Full Modal ─────────────────────────────────── */
  attentionFullItems = [
    { title: 'Structuring — John Kamau network', subtitle: 'AML-44892 • Due in 18h', actionLabel: 'Open', actionModal: 'caseDetailModal', actionStyle: 'btn-pm-d' },
    { title: 'Sanctions match — Global Trade Ltd', subtitle: 'AML-44885 • Escalated', actionLabel: 'Open', actionModal: 'caseDetailModal', actionStyle: '' },
    { title: 'PEP profile review', subtitle: 'Hon. Peter Ochieng • 72% match', actionLabel: 'Review', actionModal: 'pepDetailModal', actionStyle: '' },
    { title: 'STR draft pending', subtitle: 'AML-44892 • Due 28 Jun', actionLabel: 'File', actionModal: 'regReportModal', actionStyle: '' }
  ];

  /* ─── Data: Calendar ─────────────────────────────────────────────── */
  calendarItems = [
    { title: '28 Jun 2025 — STR Draft #AML-44892 (Due in 18h)', badgeClass: 'B-d' },
    { title: '30 Jun 2025 — Monthly CBK Summary', badgeClass: 'B-w' },
    { title: '15 Jul 2025 — Quarterly AML Report to CBK', badgeClass: 'B-i' },
    { title: '31 Jul 2025 — PEP Annual Review', badgeClass: 'B-i' }
  ];

  /* ─── Data: Audit Trail Full ─────────────────────────────────────── */
  auditTrailFull: AuditEntry[] = [
    { timestamp: '27 Jun 14:28', user: 'Sarah M.', action: 'Escalated to CBK', entity: 'AML-44892', evidence: '—', ipDevice: '102.68.XX.XX (Mac)' },
    { timestamp: '27 Jun 13:55', user: 'David O.', action: 'Uploaded evidence', entity: 'AML-44885', evidence: '—', ipDevice: '102.68.XX.XX (Win)' },
    { timestamp: '27 Jun 11:42', user: 'Amina K.', action: 'Updated risk score', entity: 'PEP-7721', evidence: '—', ipDevice: '102.68.XX.XX (iOS)' },
    { timestamp: '26 Jun 09:15', user: 'System', action: 'Auto-block', entity: 'TXN-992184', evidence: '—', ipDevice: '—' },
    { timestamp: '25 Jun 16:40', user: 'James K.', action: 'Closed case', entity: 'AML-44860', evidence: '—', ipDevice: '102.68.XX.XX (Mac)' }
  ];

  /* ─── Data: Notif Settings ───────────────────────────────────────── */
  notifSettings = [
    { type: 'High-risk alerts', push: true, sms: true, email: true, whatsapp: true },
    { type: 'PEP matches', push: true, sms: true, email: false, whatsapp: false },
    { type: 'Sanctions hits', push: true, sms: true, email: true, whatsapp: true },
    { type: 'Case updates', push: true, sms: false, email: true, whatsapp: false },
    { type: 'Regulatory deadlines', push: true, sms: true, email: true, whatsapp: true }
  ];

  /* ─── Data: AML Rules Active ─────────────────────────────────────── */
  activeRules = [
    { name: 'Structuring v4.2', trigger: 'Multiple txns < threshold', threshold: '48h / KES 1M', precision: '21.6%', status: 'Active' },
    { name: 'Velocity-INTL v3.1', trigger: 'International velocity', threshold: '24h / 3 txns', precision: '32.6%', status: 'Active' },
    { name: 'RoundTrip v2.8', trigger: 'Funds return to originator', threshold: '7 days', precision: '40.4%', status: 'Active' }
  ];

  /* ─── Data: Risk Weights ─────────────────────────────────────────── */
  riskWeights = [
    { factor: 'High-risk jurisdiction', current: 25, recommended: 30, impact: '+12% precision' },
    { factor: 'PEP relationship', current: 20, recommended: 25, impact: '+8% precision' },
    { factor: 'Crypto exposure', current: 15, recommended: 20, impact: '+15% precision' }
  ];

  /* ─── Data: Evidence Locker Files ────────────────────────────────── */
  evidenceLockerFiles = [
    { file: 'equity_jun25.pdf', type: 'Statement', uploaded: '25 Jun', hash: 'a3f2c9e1...', chain: 'Verified' },
    { file: 'structuring_map.png', type: 'Analysis', uploaded: '26 Jun', hash: '9c81b4d2...', chain: 'Verified' },
    { file: 'PEP_profile.pdf', type: 'Screening', uploaded: '26 Jun', hash: '4b92f7a3...', chain: 'Verified' }
  ];

  /* ─── Data: Live Alerts ──────────────────────────────────────────── */
  liveAlerts = [
    { title: 'Structuring detected', subtitle: 'TXN-992184, 992185, 992186 — KES 2.45M in 48h', bgClass: 'var(--pm-danger-soft)', textClass: '#7F1D1D', actionLabel: 'Investigate', actionModal: 'newCaseModal', actionStyle: 'btn-pm-d' },
    { title: 'PEP transaction spike', subtitle: 'Hon. Peter Ochieng — 340% above average', bgClass: 'var(--pm-warning-soft)', textClass: '#92400E', actionLabel: 'Review', actionModal: 'pepDetailModal', actionStyle: '' },
    { title: 'Sanctions match', subtitle: 'Global Trade Ltd — OFAC SDN hit', bgClass: 'var(--pm-info-soft)', textClass: '#1E40AF', actionLabel: 'Screen', actionModal: 'sanctionsSearchModal', actionStyle: '' }
  ];

  /* ─── Data: Transaction Detail ───────────────────────────────────── */
  txnDetail = {
    from: 'Equity Bank — John Kamau',
    to: 'KCB — Mary Wanjiku',
    amount: 'KES 2,450,000',
    rail: 'PesaLink',
    riskScore: 92,
    riskReason: 'Structuring pattern detected'
  };

  /* ─── Data: Case Form ────────────────────────────────────────────── */
  caseForm = {
    caseType: 'Structuring / Smurfing',
    priority: 'Critical — Immediate',
    triggerTxns: 'TXN-992184, TXN-992185, TXN-992186',
    primarySubject: 'John Kamau (ID: 28471920)',
    linkedEntities: 'Mary Wanjiku (Spouse), TechFlow Solutions Ltd, Global Trade EA',
    dateFrom: '2025-05-01',
    dateTo: '2025-06-27',
    freezeAccounts: true,
    requestStatements: true,
    submitSar: false,
    assignTeam: true
  };

  /* ─── Data: Sanctions Search ─────────────────────────────────────── */
  sanctionsSearch = {
    term: 'John Kamau',
    lists: { un: true, ofac: true, eu: true, uk: true, pep: true },
    threshold: 'High (90%+)'
  };

  /* ─── Data: Regulatory Report Form ───────────────────────────────── */
  regReportForm = {
    reportType: 'STR — Suspicious Transaction Report',
    subjectCase: 'AML-44892 — John Kamau Structuring',
    narrative: 'Multiple structured transactions detected across 3 accounts. Total value KES 2.84M within 48 hours. Pattern consistent with deliberate evasion of reporting thresholds.',
    includeTimeline: true,
    attachEvidence: true,
    requestFreeze: false
  };

  /* ─── Data: Emergency Block Form ─────────────────────────────────── */
  emergencyBlockForm = {
    blockType: 'Single Transaction',
    reference: 'TXN-992184 or John Kamau (28471920)',
    reason: 'Active sanctions hit — immediate block required per CBK directive.'
  };

  /* ─── Data: Monitor Settings ─────────────────────────────────────── */
  monitorSettings = {
    realTimeEnabled: true,
    alertThreshold: 65,
    autoBlockThreshold: 85,
    autoNotifyCbk: true,
    aiTriage: false
  };

  /* ─── Data: Rule Test Form ──────────────────────────────────────── */
  ruleTestForm = {
    rule: 'Structuring v4.2',
    dataset: 'Last 30 days (47,291 txns)'
  };

  /* ─── Data: Case Export Form ───────────────────────────────────── */
  caseExportForm = {
    exportType: 'All active cases',
    format: 'PDF'
  };

  /* ─── Data: Profile ────────────────────────────────────────────── */
  profile = {
    name: 'Amina Kamau',
    email: 'amina.k@email.com',
    phone: '+254 712 345 890',
    role: 'Compliance Officer',
    casesManaged: '142 this year',
    memberSince: 'Mar 2022',
    certifications: 'CAMS, CFCS'
  };

  /* ─── Data: New Rule Form ──────────────────────────────────────── */
  newRuleForm = {
    name: 'Crypto Exchange Velocity',
    category: 'Velocity',
    timeWindow: '24 hours',
    threshold: 'KES 5,000,000',
    logic: 'IF (destination == CryptoExchange) AND (amount > threshold) AND (count > 3 in window) THEN alert'
  };

  /* ─── Data: STR Narrative ────────────────────────────────────────── */
  strNarrative = 'Between 12–14 June 2025, John Kamau and linked entities conducted 14 transactions totaling KES 2.84M, all structured just below the KES 1M reporting threshold. Pattern consistent with structuring to evade CTR requirements.';
  strIncludeTimeline = true;
  strAttachEvidence = true;
  strRequestFreeze = false;

  /* ─── Data: PEP Notes ────────────────────────────────────────────── */
  pepNotes = 'Subject appears on UN sanctions list under alias "J. Kamau". Multiple accounts show structuring pattern. Spouse (Mary Wanjiku) also flagged.';

  /* ─── Data: Evidence Upload ──────────────────────────────────────── */
  evidenceCase = 'AML-44892 — Structuring';

  /* ─── Data: Health Stats ─────────────────────────────────────────── */
  healthStats = [
    { value: '98.7', label: 'DETECTION RATE', bg: 'var(--pm-accent-soft)', color: 'var(--pm-accent)', textColor: '#047857', size: '28px' },
    { value: '4.1%', label: 'FALSE POSITIVE', bg: 'var(--pm-warning-soft)', color: 'var(--pm-warning)', textColor: '#B45309', size: '24px' },
    { value: '2.4h', label: 'AVG INVESTIGATION', bg: 'var(--pm-info-soft)', color: 'var(--pm-info)', textColor: '#1D4ED8', size: '24px' },
    { value: '142', label: 'FILINGS THIS MONTH', bg: 'var(--pm-purple-soft)', color: 'var(--pm-purple)', textColor: '#6D28D9', size: '24px' }
  ];

  /* ─── Data: Notification Settings ────────────────────────────────── */
  notifPrefSaved = false;

  /* ─── Data: Bulk Screening ──────────────────────────────────────── */
  bulkScreenLists = { all: true, pep: true };

  /* ─── Data: Report Detail ──────────────────────────────────────── */
  reportDetail = {
    status: 'Submitted to CBK',
    filed: '26 Jun 2025, 14:32',
    confirmation: 'CBK-STR-2025-0612',
    narrative: 'Between 12–14 June 2025, John Kamau and linked entities conducted 14 transactions totaling KES 2.84M, all structured just below the KES 1M reporting threshold. Pattern consistent with structuring to evade CTR requirements.'
  };

  /* ─── Data: Rule Test Result ─────────────────────────────────────── */
  ruleTestResult = {
    rule: 'Structuring v4.2',
    precision: '28.4%',
    precisionChange: '+6.8%',
    recall: '91.2%',
    fpr: '3.1%',
    fprChange: '-31%'
  };

  /* ─── Data: Case Receipt ───────────────────────────────────────── */
  caseReceipt = {
    caseId: 'AML-44901',
    priority: 'Critical',
    due: '28 Jun 2025, 14:32'
  };

  /* ─── Data: Action Result ────────────────────────────────────────── */
  actionResult = {
    show: false,
    message: '',
    ref: ''
  };

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    // Any post-view initialization
  }

  /* ─── Modal Open / Close ─────────────────────────────────────────── */
  
  /**
   * Opens a modal by its string ID. Closes any currently open modal first.
   */
  openModalById(modalId: string): void {
    // Close current modal first (only one open at a time)
    this.closeModal();

    const template = this.getTemplateById(modalId);
    if (!template) {
      console.warn('Modal template not found:', modalId);
      return;
    }

    const modalSizeClass = this.getModalSizeClass(modalId);

    this.modalRef = this.modalService.show(template, {
      ignoreBackdropClick: true,
      keyboard: true,
      animated: true,
      class: `modal-dialog-centered ${modalSizeClass}`
    });
  }

  /**
   * Opens a modal directly from a TemplateRef (for inline template usage).
   * Closes any currently open modal first.
   */
  openModal(template: TemplateRef<any>, modalId?: string): void {
    // Close current modal first (only one open at a time)
    this.closeModal();

    const id = modalId || this.getModalIdFromTemplate(template);
    const modalSizeClass = id ? this.getModalSizeClass(id) : 'modal-lg';

    this.modalRef = this.modalService.show(template, {
      ignoreBackdropClick: true,
      keyboard: true,
      animated: true,
      class: `modal-dialog-centered ${modalSizeClass}`
    });
  }

  /**
   * Closes the currently open modal.
   */
  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = undefined;
    }
  }

  /**
   * Closes current modal and optionally opens another by ID.
   */
  closeAndOpen(modalId: string): void {
    this.closeModal();
    // Small delay to ensure clean transition
    setTimeout(() => this.openModalById(modalId), 100);
  }

  /**
   * Maps modal ID string to TemplateRef.
   */
  private getTemplateById(modalId: string): TemplateRef<any> | undefined {
    const map: Record<string, TemplateRef<any>> = {
      'newCaseModal': this.newCaseModal,
      'caseDetailModal': this.caseDetailModal,
      'sanctionsSearchModal': this.sanctionsSearchModal,
      'amlRulesModal': this.amlRulesModal,
      'riskScoringModal': this.riskScoringModal,
      'regReportModal': this.regReportModal,
      'evidenceLockerModal': this.evidenceLockerModal,
      'auditTrailModal': this.auditTrailModal,
      'pepDetailModal': this.pepDetailModal,
      'liveAlertsModal': this.liveAlertsModal,
      'bulkScreeningModal': this.bulkScreeningModal,
      'emergencyBlockModal': this.emergencyBlockModal,
      'ruleTestModal': this.ruleTestModal,
      'reportDetailModal': this.reportDetailModal,
      'reportCalendarModal': this.reportCalendarModal,
      'monitorSettingsModal': this.monitorSettingsModal,
      'txnDetailModal': this.txnDetailModal,
      'attentionFullModal': this.attentionFullModal,
      'amlHealthModal': this.amlHealthModal,
      'caseExportModal': this.caseExportModal,
      'amlNotifModal': this.amlNotifModal,
      'profileModal': this.profileModal,
      'notifSettingsModal': this.notifSettingsModal,
      'ruleTestResultModal': this.ruleTestResultModal,
      'riskModelModal': this.riskModelModal,
      'railConfigModal': this.railConfigModal
    };
    return map[modalId];
  }

  /**
   * Determines modal size class based on modal ID.
   */
  private getModalSizeClass(modalId: string): string {
    if (modalId.includes('caseDetail') || modalId.includes('amlRules') || modalId.includes('auditTrail')) {
      return 'modal-xl';
    }
    if (modalId.includes('newCase') || modalId.includes('sanctionsSearch') || modalId.includes('riskScoring') ||
        modalId.includes('regReport') || modalId.includes('evidenceLocker') || modalId.includes('pepDetail') ||
        modalId.includes('liveAlerts') || modalId.includes('amlHealth') || modalId.includes('reportDetail') ||
        modalId.includes('ruleTest') || modalId.includes('amlNotif')) {
      return 'modal-lg';
    }
    return 'modal-md';
  }

  /**
   * Attempts to infer modal ID from template (fallback).
   */
  private getModalIdFromTemplate(template: TemplateRef<any>): string | undefined {
    // Check against known templates
    if (template === this.newCaseModal) return 'newCaseModal';
    if (template === this.caseDetailModal) return 'caseDetailModal';
    if (template === this.sanctionsSearchModal) return 'sanctionsSearchModal';
    if (template === this.amlRulesModal) return 'amlRulesModal';
    if (template === this.riskScoringModal) return 'riskScoringModal';
    if (template === this.regReportModal) return 'regReportModal';
    if (template === this.evidenceLockerModal) return 'evidenceLockerModal';
    if (template === this.auditTrailModal) return 'auditTrailModal';
    if (template === this.pepDetailModal) return 'pepDetailModal';
    if (template === this.liveAlertsModal) return 'liveAlertsModal';
    if (template === this.bulkScreeningModal) return 'bulkScreeningModal';
    if (template === this.emergencyBlockModal) return 'emergencyBlockModal';
    if (template === this.ruleTestModal) return 'ruleTestModal';
    if (template === this.reportDetailModal) return 'reportDetailModal';
    if (template === this.reportCalendarModal) return 'reportCalendarModal';
    if (template === this.monitorSettingsModal) return 'monitorSettingsModal';
    if (template === this.txnDetailModal) return 'txnDetailModal';
    if (template === this.attentionFullModal) return 'attentionFullModal';
    if (template === this.amlHealthModal) return 'amlHealthModal';
    if (template === this.caseExportModal) return 'caseExportModal';
    if (template === this.amlNotifModal) return 'amlNotifModal';
    if (template === this.profileModal) return 'profileModal';
    if (template === this.notifSettingsModal) return 'notifSettingsModal';
    if (template === this.ruleTestResultModal) return 'ruleTestResultModal';
    if (template === this.riskModelModal) return 'riskModelModal';
    if (template === this.railConfigModal) return 'railConfigModal';
    return undefined;
  }

  /* ─── Case Stepper Logic ─────────────────────────────────────────── */
  getStepClass(stepIndex: number): string {
    if (stepIndex < this.caseStepCurrent) return 'done';
    if (stepIndex === this.caseStepCurrent) return 'active';
    return '';
  }

  getStepNumber(stepIndex: number): string {
    if (stepIndex < this.caseStepCurrent) return '✓';
    return String(stepIndex + 1);
  }

  nextCaseStep(): void {
    if (this.caseStepCurrent === this.caseStepTotal - 1) {
      this.caseStepLoading = true;
      setTimeout(() => {
        this.caseStepLoading = false;
        this.caseStepCurrent = this.caseStepTotal;
      }, 1500);
      return;
    }
    if (this.caseStepCurrent >= this.caseStepTotal) {
      this.closeModal();
      this.caseStepCurrent = 1;
      return;
    }
    this.caseStepCurrent++;
  }

  prevCaseStep(): void {
    if (this.caseStepCurrent > 1) {
      this.caseStepCurrent--;
    }
  }

  resetCaseStepper(): void {
    this.caseStepCurrent = 1;
    this.caseStepLoading = false;
  }

  isCaseStepActive(step: number): boolean {
    return this.caseStepCurrent === step;
  }

  getCaseStepButtonLabel(): string {
    if (this.caseStepCurrent === this.caseStepTotal - 1) return 'Create Case';
    if (this.caseStepCurrent === this.caseStepTotal) return 'Done';
    return 'Continue';
  }

  /* ─── Tab Switching ──────────────────────────────────────────────── */
  setCaseDetailTab(tab: string): void {
    this.caseDetailTab = tab;
  }

  setAmlRulesTab(tab: string): void {
    this.amlRulesTab = tab;
  }

  setRiskScoringTab(tab: string): void {
    this.riskScoringTab = tab;
  }

  isCaseDetailTab(tab: string): boolean {
    return this.caseDetailTab === tab;
  }

  isAmlRulesTab(tab: string): boolean {
    return this.amlRulesTab === tab;
  }

  isRiskScoringTab(tab: string): boolean {
    return this.riskScoringTab === tab;
  }

  /* ─── Risk Badge Helper ──────────────────────────────────────────── */
  getRiskBadgeClass(risk: number): string {
    if (risk >= 70) return 'B-d';
    if (risk >= 40) return 'B-w';
    return 'B-s';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Alert': return 'B-d';
      case 'Hold': return 'B-w';
      case 'Cleared': return 'B-s';
      case 'Investigation': return 'B-d';
      case 'Escalated': return 'B-w';
      case 'Under Review': return 'B-s';
      case 'Closed': return 'B-s';
      case 'Submitted': return 'B-s';
      case 'Acknowledged': return 'B-s';
      default: return 'B-i';
    }
  }

  getCaseActionLabel(status: string): string {
    return status === 'Closed' ? 'View' : 'Open';
  }

  getTxnActionLabel(status: string): string {
    return status === 'Alert' ? 'Investigate' : 'View';
  }

  getTxnActionModal(status: string): string {
    return status === 'Alert' ? 'newCaseModal' : 'txnDetailModal';
  }

  /* ─── Modal Action (doAction) ────────────────────────────────────── */
  doAction(modalId: string, message: string, ref: string): void {
    this.modalActionLoading = true;
    setTimeout(() => {
      this.modalActionLoading = false;
      this.actionResult = { show: true, message, ref };
    }, 1500);
  }

  resetActionResult(): void {
    this.actionResult = { show: false, message: '', ref: '' };
  }

  /* ─── Search ─────────────────────────────────────────────────────── */
  onSearch(): void {
    console.log('Search:', this.searchQuery);
    // Hook for backend integration
  }

  /* ─── Helpers ────────────────────────────────────────────────────── */
  trackByIndex(index: number): number {
    return index;
  }

  trackByCaseId(index: number, item: Case): string {
    return item.id;
  }

  trackByReportId(index: number, item: Report): string {
    return item.id;
  }

  trackByAuditTimestamp(index: number, item: AuditEntry): string {
    return item.timestamp;
  }
}