import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ========== INTERFACES ==========
export interface FlowState {
  current: number;
  total: number;
  labels: string[];
}

export interface TabState {
  [key: string]: string;
}

export interface ServiceItem {
  name: string;
  status: string;
  statusClass: string;
  uptime: string;
  latency: string;
  errorRate: string;
  lastIncident: string;
  actionLabel: string;
  actionModal: string;
  actionClass: string;
}

export interface RegionItem {
  region: string;
  status: string;
  statusClass: string;
}

export interface CorridorItem {
  corridor: string;
  count: string;
  success: string;
  avgTime: string;
  actionClass: string;
}

export interface FailureItem {
  reason: string;
  count: string;
  badgeClass: string;
}

export interface PartnerItem {
  partner: string;
  status: string;
  statusClass: string;
  latency: string;
  success: string;
}

export interface WebhookItem {
  partner: string;
  endpoint: string;
  delivered: string;
  failed: string;
  retryQueue: string;
  actionClass: string;
}

export interface FraudRule {
  rule: string;
  threshold: string;
  triggered: string;
  blocked: string;
  fpRate: string;
  enabled: boolean;
}

export interface FraudAlert {
  id: string;
  transaction: string;
  riskScore: string;
  riskClass: string;
  reason: string;
  status: string;
  statusClass: string;
}

export interface InfraComponent {
  name: string;
  cpu: string;
  memory: string;
  disk: string;
  status: string;
  statusClass: string;
}

export interface ScalingEvent {
  component: string;
  change: string;
  changeClass: string;
}

export interface Ticket {
  id: string;
  type: string;
  priority: string;
  priorityClass: string;
  assignee: string;
  sla: string;
  status: string;
  statusClass: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: string;
  severityClass: string;
  started: string;
  owner: string;
  status: string;
  statusClass: string;
}

export interface AuditLog {
  time: string;
  actor: string;
  action: string;
  details: string;
  ip: string;
}

export interface LiveTransaction {
  time: string;
  id: string;
  corridor: string;
  amount: string;
  status: string;
  statusClass: string;
}

export interface UptimeRecord {
  date: string;
  uptime: string;
  incidents: string;
  mttr: string;
}

export interface SettlementRecon {
  bank: string;
  expected: string;
  received: string;
  matched: string;
  status: string;
  statusClass: string;
}

export interface ApiEndpoint {
  endpoint: string;
  requests: string;
  p95: string;
  errors: string;
  status: string;
  statusClass: string;
}

export interface GlobalRegion {
  region: string;
  status: string;
  statusClass: string;
  uptime: string;
  incidents: string;
  lastUpdate: string;
}

export interface AttentionItem {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  detail: string;
  actionLabel: string;
  actionClass: string;
  actionModal: string;
}

export interface Suggestion {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  detail: string;
  actionLabel: string;
  actionModal: string;
}

export interface QuickAction {
  icon: string;
  iconColor: string;
  label: string;
  modal: string;
}

export interface SettlementBatch {
  id: string;
  corridor: string;
  amount: string;
  status: string;
  statusClass: string;
  progress: number;
  progressColor: string;
  eta: string;
}

export interface TimelineEvent {
  time: string;
  event: string;
}

@Component({
  selector: 'app-system-health',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './system-health.html',
  styleUrls: ['./system-health.css'],
  encapsulation: ViewEncapsulation.None
})
export class SystemHealthComponent implements OnInit {

  // ========== MODAL STATE ==========
  modals: { [key: string]: boolean } = {
    globalStatusModal: false,
    incidentQueueModal: false,
    runHealthCheckModal: false,
    settlementDetailModal: false,
    fraudModelModal: false,
    apiPerformanceModal: false,
    webhookMonitorModal: false,
    fraudAlertQueueModal: false,
    fraudReviewModal: false,
    incidentDetailModal: false,
    createIncidentModal: false,
    partnerApiDetailModal: false,
    infraDetailModal: false,
    infraScalingModal: false,
    capacityPlanningModal: false,
    ticketDetailModal: false,
    escalationModal: false,
    auditLogModal: false,
    liveTransactionFeedModal: false,
    failureAnalysisModal: false,
    corridorDetailModal: false,
    reconciliationModal: false,
    profileModal: false,
    slaReportModal: false,
    uptimeHistoryModal: false,
    opsNotifModal: false,
    serviceDetailModal: false,
    corridorPerformanceModal: false,
    caseExportModal: false,
    notifSettingsModal: false,
    supportTicketModal: false
  };

  // ========== TAB STATE ==========
  activeTab: TabState = {
    gs: 'all',
    fm: 'rules',
    pa: 'health'
  };

  // ========== FLOW STATE ==========
  flows: { [key: string]: FlowState } = {
    settle: { current: 1, total: 4, labels: ['Overview', 'Reconciliation', 'Resolution', 'Done'] },
    inc: { current: 1, total: 4, labels: ['Summary', 'Timeline', 'Resolution', 'Done'] }
  };

  // ========== PROCESSING STATE ==========
  processingModal: string | null = null;
  isProcessing = false;
  actionSuccess: { modalId: string; message: string; ref: string } | null = null;

  // ========== FORM DATA (Two-way bound, ready for API) ==========
  healthCheckScope = 'Full Platform Check';
  healthCheckDiagnostics = { dbPerf: true, queueDepth: true, reconTest: false };
  settlementAction = 'Request manual push from Stanbic';
  settlementNotes = 'Please investigate connectivity issues on your end. We have 26% of the batch still pending acknowledgment.';
  fraudDecision = 'Block Transaction';
  fraudNotes = 'High velocity + impossible travel. Strong fraud signal. Recommend block.';
  incidentPostMortem = false;
  createIncidentTitle = 'New incident title';
  createIncidentSeverity = 'High';
  createIncidentComponent = 'Settlement Engine';
  createIncidentDesc = 'Describe the incident...';
  partnerApiBaseUrl = 'https://api.stanbic.co.ug/b2b';
  partnerApiTimeout = '5000';
  partnerApiRetries = '3';
  infraScalingComponent = 'API Gateway Cluster';
  infraScalingMin = '12';
  infraScalingMax = '48';
  infraScalingUp = '70% CPU for 5 min';
  infraScalingDown = '30% CPU for 15 min';
  capacityForecast = 'Next 30 days';
  ticketStatus = 'In Progress';
  ticketAssignee = 'James K.';
  ticketNotes = 'Partner has been contacted. Awaiting response on their API endpoint change.';
  escalationTicket = 'OP-44291 — Partner Integration';
  escalationTo = 'Head of Operations';
  escalationReason = 'Partner not responding within SLA. Business impact increasing.';
  auditSearch = '';
  auditRange = 'Last 24 hours';
  failureTimeRange = 'Last 60 minutes';
  reconScope = 'Full Platform (All Corridors)';
  reconDate = '2025-06-27';
  exportFormat = 'CSV';
  exportDate = '2025-06-01';
  notifEmailCritical = true;
  notifSmsHigh = true;
  notifDailySummary = false;

  // ========== DATA ARRAYS (Replace with API calls) ==========
  services: ServiceItem[] = [
    { name: 'Transaction Engine', status: 'Healthy', statusClass: 'B-s', uptime: '99.98%', latency: '142ms', errorRate: '0.12%', lastIncident: '12 Jun 2025', actionLabel: 'Details', actionModal: 'serviceDetailModal', actionClass: '' },
    { name: 'Settlement Engine', status: 'Degraded', statusClass: 'B-w', uptime: '99.71%', latency: '890ms', errorRate: '1.84%', lastIncident: '27 Jun 2025', actionLabel: 'Investigate', actionModal: 'settlementDetailModal', actionClass: 'btn-pm-d' },
    { name: 'API Gateway', status: 'Healthy', statusClass: 'B-s', uptime: '99.99%', latency: '187ms', errorRate: '0.08%', lastIncident: '19 Jun 2025', actionLabel: 'Metrics', actionModal: 'apiPerformanceModal', actionClass: '' },
    { name: 'Fraud Detection', status: 'Degraded', statusClass: 'B-w', uptime: '99.82%', latency: '310ms', errorRate: '4.2% FP', lastIncident: '27 Jun 2025', actionLabel: 'Tune', actionModal: 'fraudModelModal', actionClass: '' },
    { name: 'Reconciliation Service', status: 'Healthy', statusClass: 'B-s', uptime: '99.95%', latency: '420ms', errorRate: '0.31%', lastIncident: '25 Jun 2025', actionLabel: 'Run Now', actionModal: 'reconciliationModal', actionClass: '' },
    { name: 'Notification Service', status: 'Healthy', statusClass: 'B-s', uptime: '99.97%', latency: '89ms', errorRate: '0.05%', lastIncident: '20 Jun 2025', actionLabel: 'Details', actionModal: 'serviceDetailModal', actionClass: '' }
  ];

  regions: RegionItem[] = [
    { region: 'Kenya (Primary)', status: 'All Green', statusClass: 'B-s' },
    { region: 'Uganda', status: 'All Green', statusClass: 'B-s' },
    { region: 'Tanzania', status: 'API Degraded', statusClass: 'B-w' },
    { region: 'Rwanda', status: 'All Green', statusClass: 'B-s' },
    { region: 'Nigeria', status: 'Settlement Delayed', statusClass: 'B-w' },
    { region: 'Ghana', status: 'All Green', statusClass: 'B-s' }
  ];

  corridors: CorridorItem[] = [
    { corridor: 'Kenya → Uganda', count: '8,421', success: '99.7%', avgTime: '1.8s', actionClass: '' },
    { corridor: 'Kenya → Tanzania', count: '6,112', success: '99.2%', avgTime: '2.4s', actionClass: '' },
    { corridor: 'Uganda → Kenya', count: '5,890', success: '99.5%', avgTime: '1.6s', actionClass: '' },
    { corridor: 'Nigeria → Ghana', count: '3,421', success: '98.1%', avgTime: '4.2s', actionClass: 'btn-pm-w' }
  ];

  failures: FailureItem[] = [
    { reason: 'Insufficient Funds', count: '2,841', badgeClass: 'B-d' },
    { reason: 'Invalid Account', count: '1,102', badgeClass: 'B-w' },
    { reason: 'Network Timeout', count: '892', badgeClass: 'B-w' },
    { reason: 'Fraud Block', count: '421', badgeClass: 'B-d' },
    { reason: 'Daily Limit Exceeded', count: '312', badgeClass: 'B-w' },
    { reason: 'Other', count: '844', badgeClass: 'B-i' }
  ];

  partners: PartnerItem[] = [
    { partner: 'Equity Bank', status: 'Healthy', statusClass: 'B-s', latency: '98ms', success: '99.9%' },
    { partner: 'KCB Bank', status: 'Healthy', statusClass: 'B-s', latency: '112ms', success: '99.8%' },
    { partner: 'Stanbic Bank', status: 'Degraded', statusClass: 'B-w', latency: '420ms', success: '97.1%' },
    { partner: 'Co-op Bank', status: 'Healthy', statusClass: 'B-s', latency: '76ms', success: '99.9%' }
  ];

  webhooks: WebhookItem[] = [
    { partner: 'Equity Bank', endpoint: 'https://api.equity.co.ke/webhook', delivered: '84,291', failed: '12', retryQueue: '3', actionClass: '' },
    { partner: 'KCB Bank', endpoint: 'https://webhook.kcbgroup.com/b2b', delivered: '42,891', failed: '89', retryQueue: '41', actionClass: '' },
    { partner: 'Stanbic Bank', endpoint: 'https://api.stanbic.co.ug/callback', delivered: '18,421', failed: '211', retryQueue: '178', actionClass: 'btn-pm-w' }
  ];

  fraudRules: FraudRule[] = [
    { rule: 'Velocity (5 txns/5min)', threshold: '5', triggered: '892', blocked: '312', fpRate: '2.1%', enabled: true },
    { rule: 'Geo Anomaly', threshold: '500km', triggered: '421', blocked: '89', fpRate: '4.8%', enabled: true },
    { rule: 'Device Mismatch', threshold: '—', triggered: '312', blocked: '18', fpRate: '1.2%', enabled: true },
    { rule: 'New Device + High Amount', threshold: 'KES 50K', triggered: '189', blocked: '—', fpRate: '3.4%', enabled: false }
  ];

  fraudAlerts: FraudAlert[] = [
    { id: 'FA-99142', transaction: 'KE-UG-4428191', riskScore: '94', riskClass: 'B-d', reason: 'Velocity + New Device', status: 'Pending Review', statusClass: 'B-w' },
    { id: 'FA-99141', transaction: 'KE-TZ-4428188', riskScore: '72', riskClass: 'B-w', reason: 'Geo Anomaly', status: 'Under Review', statusClass: 'B-i' },
    { id: 'FA-99140', transaction: 'UG-KE-4428182', riskScore: '68', riskClass: 'B-w', reason: 'Amount Pattern', status: 'Approved', statusClass: 'B-s' }
  ];

  infraComponents: InfraComponent[] = [
    { name: 'Transaction DB Primary', cpu: '42%', memory: '68%', disk: '54%', status: 'Healthy', statusClass: 'B-s' },
    { name: 'API Gateway Cluster', cpu: '71%', memory: '82%', disk: '39%', status: 'Warning', statusClass: 'B-w' },
    { name: 'Redis Cache', cpu: '18%', memory: '44%', disk: '12%', status: 'Healthy', statusClass: 'B-s' },
    { name: 'Kafka Brokers', cpu: '55%', memory: '61%', disk: '47%', status: 'Healthy', statusClass: 'B-s' }
  ];

  scalingEvents: ScalingEvent[] = [
    { component: 'API Gateway', change: '+12 nodes', changeClass: 'B-i' },
    { component: 'Worker Nodes', change: '+8 nodes', changeClass: 'B-i' },
    { component: 'DB Read Replicas', change: '+3 replicas', changeClass: 'B-i' }
  ];

  tickets: Ticket[] = [
    { id: 'OP-44291', type: 'Partner Integration', priority: 'High', priorityClass: 'B-d', assignee: 'James K.', sla: '2h remaining', status: 'In Progress', statusClass: 'B-w' },
    { id: 'OP-44288', type: 'Settlement Dispute', priority: 'Medium', priorityClass: 'B-w', assignee: 'Grace M.', sla: '18h remaining', status: 'Waiting Partner', statusClass: 'B-i' },
    { id: 'OP-44285', type: 'API Key Request', priority: 'Low', priorityClass: 'B-i', assignee: 'Auto', sla: '48h remaining', status: 'Resolved', statusClass: 'B-s' }
  ];

  incidents: Incident[] = [
    { id: 'INC-88219', title: 'Settlement batch delay', severity: 'High', severityClass: 'B-d', started: '2h 14m ago', owner: 'James K.', status: 'Investigating', statusClass: 'B-w' },
    { id: 'INC-88218', title: 'Stanbic API degradation', severity: 'Medium', severityClass: 'B-w', started: '47m ago', owner: 'Auto', status: 'Monitoring', statusClass: 'B-w' },
    { id: 'INC-88217', title: 'Fraud false positive spike', severity: 'Medium', severityClass: 'B-w', started: '1h 02m ago', owner: 'Grace M.', status: 'In Progress', statusClass: 'B-i' },
    { id: 'INC-88216', title: 'Nigeria settlement retry loop', severity: 'High', severityClass: 'B-d', started: '3h 41m ago', owner: 'James K.', status: 'Investigating', statusClass: 'B-w' },
    { id: 'INC-88215', title: 'Webhook delivery backlog', severity: 'Medium', severityClass: 'B-w', started: '19m ago', owner: 'Auto', status: 'Monitoring', statusClass: 'B-w' }
  ];

  auditLogs: AuditLog[] = [
    { time: '14:42', actor: 'James K.', action: 'Incident Updated', details: 'INC-88219 status changed to Investigating', ip: '102.68.XX.XX' },
    { time: '14:38', actor: 'System', action: 'Health Check', details: 'Full platform check completed — 99.97% healthy', ip: '—' },
    { time: '14:22', actor: 'Grace M.', action: 'Fraud Rule Tuned', details: 'Velocity threshold changed from 5 to 6', ip: '102.68.XX.XX' }
  ];

  liveTransactions: LiveTransaction[] = [
    { time: '14:42:18', id: 'KE-UG-4429218', corridor: 'Kenya → Uganda', amount: 'KES 12,500', status: 'Success', statusClass: 'B-s' },
    { time: '14:42:17', id: 'KE-TZ-4429217', corridor: 'Kenya → Tanzania', amount: 'KES 45,000', status: 'Success', statusClass: 'B-s' },
    { time: '14:42:15', id: 'UG-KE-4429216', corridor: 'Uganda → Kenya', amount: 'KES 8,200', status: 'Failed', statusClass: 'B-w' }
  ];

  uptimeRecords: UptimeRecord[] = [
    { date: '27 Jun 2025', uptime: '99.98%', incidents: '2', mttr: '12m' },
    { date: '26 Jun 2025', uptime: '100%', incidents: '0', mttr: '—' },
    { date: '25 Jun 2025', uptime: '99.71%', incidents: '1', mttr: '2h 14m' }
  ];

  settlementRecons: SettlementRecon[] = [
    { bank: 'Equity Bank', expected: 'KES 92.1M', received: 'KES 92.1M', matched: '100%', status: 'Complete', statusClass: 'B-s' },
    { bank: 'Stanbic Bank', expected: 'KES 67.4M', received: 'KES 41.2M', matched: '61%', status: 'Partial', statusClass: 'B-w' },
    { bank: 'KCB Bank', expected: 'KES 24.7M', received: 'KES 24.7M', matched: '100%', status: 'Complete', statusClass: 'B-s' }
  ];

  apiEndpoints: ApiEndpoint[] = [
    { endpoint: '/v1/transactions/initiate', requests: '18,421', p95: '142ms', errors: '0.04%', status: 'Healthy', statusClass: 'B-s' },
    { endpoint: '/v1/settlements/batch', requests: '4,892', p95: '890ms', errors: '1.84%', status: 'Degraded', statusClass: 'B-w' },
    { endpoint: '/v1/fraud/score', requests: '12,310', p95: '310ms', errors: '0.12%', status: 'Healthy', statusClass: 'B-s' }
  ];

  globalRegions: GlobalRegion[] = [
    { region: 'Kenya (Primary)', status: 'Operational', statusClass: 'B-s', uptime: '99.98%', incidents: '2', lastUpdate: '2 min ago' },
    { region: 'Uganda', status: 'Operational', statusClass: 'B-s', uptime: '99.95%', incidents: '1', lastUpdate: '5 min ago' },
    { region: 'Tanzania', status: 'Degraded', statusClass: 'B-w', uptime: '99.71%', incidents: '3', lastUpdate: '1 min ago' },
    { region: 'Rwanda', status: 'Operational', statusClass: 'B-s', uptime: '99.99%', incidents: '0', lastUpdate: '8 min ago' },
    { region: 'Nigeria', status: 'Degraded', statusClass: 'B-w', uptime: '99.68%', incidents: '4', lastUpdate: '3 min ago' },
    { region: 'Ghana', status: 'Operational', statusClass: 'B-s', uptime: '99.92%', incidents: '1', lastUpdate: '12 min ago' }
  ];

  attentionItems: AttentionItem[] = [
    { icon: 'bi-exclamation-triangle', iconBg: 'var(--pm-danger-soft)', iconColor: 'var(--pm-danger)', title: 'Settlement batch #S-88219 delayed', detail: '2h 14m behind SLA • KES 184M', actionLabel: 'Investigate', actionClass: 'btn-pm-d', actionModal: 'settlementDetailModal' },
    { icon: 'bi-graph-up', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'Fraud detection false positive rate 4.2%', detail: 'Above threshold (2.5%)', actionLabel: 'Tune Model', actionClass: '', actionModal: 'fraudModelModal' },
    { icon: 'bi-server', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', title: 'API Gateway P99 latency 420ms', detail: 'SLA breach risk (SLA: 300ms)', actionLabel: 'Scale', actionClass: '', actionModal: 'apiPerformanceModal' }
  ];

  suggestions: Suggestion[] = [
    { icon: 'bi-lightning-charge', iconBg: 'var(--pm-accent-soft)', iconColor: 'var(--pm-accent)', title: 'Enable auto-scaling on API Gateway', detail: 'Reduce P99 latency by 35%', actionLabel: 'Enable', actionModal: 'infraScalingModal' },
    { icon: 'bi-shield-check', iconBg: 'var(--pm-purple-soft)', iconColor: 'var(--pm-purple)', title: 'Update fraud rules for weekend patterns', detail: 'Reduce false positives by 1.8%', actionLabel: 'Apply', actionModal: 'fraudModelModal' },
    { icon: 'bi-clock-history', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'Schedule reconciliation catch-up job', detail: 'Clear 4 pending settlement batches', actionLabel: 'Schedule', actionModal: 'settlementDetailModal' }
  ];

  quickActions: QuickAction[] = [
    { icon: 'bi-play-circle', iconColor: 'text-success', label: 'Run Health Check', modal: 'runHealthCheckModal' },
    { icon: 'bi-exclamation-triangle', iconColor: 'text-danger', label: 'View Incidents', modal: 'incidentQueueModal' },
    { icon: 'bi-bank', iconColor: 'text-primary', label: 'Settlement Status', modal: 'settlementDetailModal' },
    { icon: 'bi-shield-exclamation', iconColor: 'text-warning', label: 'Fraud Console', modal: 'fraudModelModal' },
    { icon: 'bi-speedometer2', iconColor: 'text-info', label: 'API Metrics', modal: 'apiPerformanceModal' },
    { icon: 'bi-file-earmark-text', iconColor: '', label: 'Audit Logs', modal: 'auditLogModal' },
    { icon: 'bi-headset', iconColor: '', label: 'Support Queue', modal: 'supportTicketModal' },
    { icon: 'bi-server', iconColor: '', label: 'Scale Services', modal: 'infraScalingModal' }
  ];

  settlementBatches: SettlementBatch[] = [
    { id: 'S-88219', corridor: 'KE → UG', amount: 'KES 184.2M', status: 'Delayed', statusClass: 'B-w', progress: 67, progressColor: 'var(--pm-warning)', eta: '+2h 14m' },
    { id: 'S-88220', corridor: 'KE → TZ', amount: 'KES 92.4M', status: 'Processing', statusClass: 'B-s', progress: 89, progressColor: 'var(--pm-accent)', eta: '41m' },
    { id: 'S-88221', corridor: 'UG → KE', amount: 'KES 67.8M', status: 'Completed', statusClass: 'B-s', progress: 100, progressColor: 'var(--pm-accent)', eta: '—' }
  ];

  incidentTimeline: TimelineEvent[] = [
    { time: '14:22', event: 'Incident created' },
    { time: '14:45', event: 'Assigned to James K.' },
    { time: '15:10', event: 'Stanbic contacted' },
    { time: '16:30', event: 'Partial settlement executed' }
  ];

  constructor() {}

  ngOnInit(): void {}

  // ========== MODAL METHODS ==========
  openModal(modalId: string): void {
    this.modals[modalId] = true;
    document.body.classList.add('modal-open');
  }

  closeModal(modalId: string): void {
    this.modals[modalId] = false;
    this.processingModal = null;
    this.checkAnyModalOpen();
  }

  closeAllModals(): void {
    Object.keys(this.modals).forEach(key => this.modals[key] = false);
    this.processingModal = null;
    this.resetAllFlows();
    document.body.classList.remove('modal-open');
  }

  checkAnyModalOpen(): void {
    const anyOpen = Object.values(this.modals).some(v => v);
    if (!anyOpen) {
      document.body.classList.remove('modal-open');
    }
  }

  anyModalOpen(): boolean {
    return Object.values(this.modals).some(v => v);
  }

  // ========== TAB METHODS ==========
  switchTab(prefix: string, key: string): void {
    this.activeTab[prefix] = key;
  }

  isTabActive(prefix: string, key: string): boolean {
    return this.activeTab[prefix] === key;
  }

  // ========== FLOW / STEPPER METHODS ==========
  nextFlow(key: string, total: number): void {
    const flow = this.flows[key];
    if (flow.current === total - 1) {
      this.processingModal = key === 'settle' ? 'settlementDetailModal' : 'incidentDetailModal';
      this.isProcessing = true;
      setTimeout(() => {
        this.isProcessing = false;
        this.processingModal = null;
        flow.current = total;
      }, 1400);
      return;
    }
    if (flow.current >= total) {
      this.closeModal(key === 'settle' ? 'settlementDetailModal' : 'incidentDetailModal');
      flow.current = 1;
      return;
    }
    flow.current++;
  }

  resetFlow(key: string): void {
    this.flows[key].current = 1;
  }

  resetAllFlows(): void {
    Object.keys(this.flows).forEach(k => this.flows[k].current = 1);
  }

  getStepClass(key: string, stepNum: number): string {
    const flow = this.flows[key];
    if (stepNum < flow.current) return 'done';
    if (stepNum === flow.current) return 'active';
    return '';
  }

  getStepNumber(key: string, stepNum: number): string {
    return stepNum < this.flows[key].current ? '✓' : String(stepNum);
  }

  isFlowStepActive(key: string, stepNum: number): boolean {
    return this.flows[key].current === stepNum;
  }

  // ========== ACTION METHODS ==========
  doAction(modalId: string, message: string, ref: string): void {
    this.processingModal = modalId;
    this.isProcessing = true;
    setTimeout(() => {
      this.isProcessing = false;
      this.processingModal = null;
      this.actionSuccess = { modalId, message, ref };
    }, 1400);
  }

  isActionSuccess(modalId: string): boolean {
    return this.actionSuccess?.modalId === modalId;
  }

  getActionMessage(): string {
    return this.actionSuccess?.message || '';
  }

  getActionRef(): string {
    return this.actionSuccess?.ref || '';
  }

  resetActionSuccess(): void {
    this.actionSuccess = null;
  }

  getFailurePercent(count: string): string {
    const num = parseInt(count.replace(/,/g, ''), 10);
    return ((num / 7412) * 100).toFixed(1);
  }

  reloadPage(): void {
    window.location.reload();
  }
}