import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager.html',
  styleUrls: ['./manager.css'],
  encapsulation: ViewEncapsulation.None
})
export class ManagerComponent implements OnInit {

  // ===================== TOAST STATE =====================
  toast = { show: false, message: '' };

  // ===================== TAB STATES =====================
  healthTab: string = 'latency';
  alertListTab: string = 'active';

  // ===================== MULTI-STEP STATES =====================
  alertStep = 1;
  warStep = 1;

  // ===================== FORM MODELS =====================
  selectedTier: string = 'certified';

  applyForm = {
    volume: '10M - 50M',
    description: 'Scaling our ERP integration to serve 500+ merchants.',
    check1: true,
    check2: true,
    check3: false
  };

  appForm = {
    name: '',
    desc: '',
    category: 'E-commerce Plugin',
    logo: '',
    video: '',
    email: '',
    billing: 'Free',
    price: 0
  };

  campaignName = '';

  postmortemForm = {
    selected: 'INC-003'
  };

  maintenanceForm = {
    title: '',
    start: '',
    end: '',
    impact: 'No downtime expected',
    description: '',
    notifyNow: true
  };

  alertRuleForm = {
    name: '',
    metric: 'HTTP 5xx Error Rate',
    severity: 'Warning',
    threshold: null as number | null,
    window: '5 minutes',
    chPagerDuty: false,
    chSlack: true,
    chEmail: false,
    chWebhook: false,
    webhookUrl: '',
    cooldown: '15 minutes',
    get channelSummary(): string {
      const ch: string[] = [];
      if (this.chPagerDuty) ch.push('PagerDuty');
      if (this.chSlack) ch.push('Slack');
      if (this.chEmail) ch.push('Email');
      if (this.chWebhook) ch.push('Webhook');
      return ch.length > 0 ? ch.join(', ') : 'None';
    }
  };

  logSearchForm = {
    query: '',
    service: 'All Services',
    level: 'All Levels',
    traceId: ''
  };

  traceForm = {
    traceId: '',
    duration: 'Last 15 minutes'
  };

  webhookRetryForm = {
    action: 'Retry all failed deliveries now',
    preserveOrder: true
  };

  warForm = {
    title: '',
    severity: 'SEV-3 (Minor)',
    service: 'Collections API',
    summary: '',
    commander: 'John D. (Lead Engineer)',
    slackChannel: '#incidents-active',
    pagePD: true,
    statusUpdate: 'Auto-post "Investigating"',
    rootCause: '',
    resolution: '',
    createPostmortem: true
  };

  // ===================== MISSING FORM MODELS (FIXED) =====================
  pdForm = {
    serviceMap: 'Map all SEV-1/2 alerts to PD Service',
    autoResolve: true
  };

  escForm = {
    l1: 'John D. — Lead Engineer',
    l2: 'Sarah W. — Senior SRE',
    l3: 'Mike K. — Platform Lead',
    l4: 'CTO / VP Engineering',
    loop: true
  };

  bizMetricForm = {
    query: 'sum(rate(paymo_transactions_total{status="success"}[1h]))'
  };

  statusSubForm = {
    email: '',
    incidents: true,
    maintenance: true,
    recovery: false,
    slack: true
  };

  promForm = {
    auth: 'Bearer Token (Service Account)',
    histograms: true
  };

  logRetentionForm = {
    hot: '30 days',
    warm: '1 year',
    cold: '7 years'
  };

  projectForm = {
    selected: 'proj-001'
  };

  projects = [
    { id: 'proj-001', name: 'Acme Payments', env: 'Production', status: 'Active', badgeClass: 'success' },
    { id: 'proj-002', name: 'Beta Sandbox', env: 'Sandbox', status: 'Active', badgeClass: 'info' },
    { id: 'proj-003', name: 'Legacy Migration', env: 'Staging', status: 'Paused', badgeClass: 'warning' }
  ];

  get selectedProjectName(): string {
    const p = this.projects.find(x => x.id === this.projectForm.selected);
    return p ? p.name : 'Unknown';
  }

  profileForm = {
    email: 'john.d@paymo.com',
    timezone: 'Africa/Nairobi (EAT)',
    onCall: true
  };

  // ===================== KPI STATS =====================
  stats = {
    uptime: '99.99%',
    uptimeDesc: 'No incidents in the last 30 days across all core API endpoints.',
    latency: '184 ms',
    latencyDelta: '-12ms vs last week',
    errorRate: '0.04%',
    errorNote: 'Slightly above 0.03% target',
    slaBudget: '99.96% remaining',
    slaPercent: 99.96,
    throughput: '1,247',
    trafficStatus: 'Normal',
    peakThroughput: '2,180',
    activeWebhooks: '8,412'
  };

  // ===================== SUBSYSTEM DATA =====================
  subsystems = [
    { name: 'Collections API', status: 'Operational', statusClass: 'success', uptime: '99.99%', latency: '45 ms', trendIcon: 'bi-graph-down-arrow', trendColor: 'text-success' },
    { name: 'Disbursements API', status: 'Operational', statusClass: 'success', uptime: '99.98%', latency: '62 ms', trendIcon: 'bi-dash', trendColor: 'text-muted' },
    { name: 'Webhook Delivery', status: 'Degraded', statusClass: 'warning', uptime: '98.20%', latency: '210 ms', trendIcon: 'bi-graph-up-arrow', trendColor: 'text-danger' },
    { name: 'Auth / OAuth', status: 'Operational', statusClass: 'success', uptime: '100%', latency: '12 ms', trendIcon: 'bi-dash', trendColor: 'text-muted' },
    { name: 'Card Gateway', status: 'Operational', statusClass: 'success', uptime: '99.97%', latency: '88 ms', trendIcon: 'bi-graph-down-arrow', trendColor: 'text-success' },
    { name: 'Settlements Engine', status: 'Operational', statusClass: 'success', uptime: '99.99%', latency: '150 ms', trendIcon: 'bi-dash', trendColor: 'text-muted' }
  ];

  dependencies = [
    { name: 'Safaricom Daraja (M-Pesa)', desc: 'STK Push & C2B', status: 'Healthy', badgeClass: 'success' },
    { name: 'PesaLink (IPS Kenya)', desc: 'Bank-to-bank transfers', status: 'Healthy', badgeClass: 'success' },
    { name: 'Visa / Mastercard Gateway', desc: 'Card processing', status: 'Healthy', badgeClass: 'success' },
    { name: 'Sendy Logistics', desc: 'Delivery tracking', status: 'Healthy', badgeClass: 'success' }
  ];

  depHealthDetails = [
    { name: 'Safaricom Daraja (M-Pesa)', detail: 'STK Push avg: 180ms · Timeout rate: 0.8%', status: 'Healthy', badgeClass: 'success' },
    { name: 'PesaLink (IPS Kenya)', detail: 'Transfer avg: 320ms · Error rate: 0.1%', status: 'Healthy', badgeClass: 'success' },
    { name: 'Visa / Mastercard Gateway', detail: 'Auth avg: 95ms · Decline rate: 2.4%', status: 'Healthy', badgeClass: 'success' },
    { name: 'Sendy Logistics', detail: 'Webhook avg: 210ms · Uptime: 99.5%', status: 'Healthy', badgeClass: 'success' },
    { name: 'Equity Bank EFT', detail: 'Batch processing avg: 1.2s · Queue depth: 3', status: 'Slow', badgeClass: 'warning' }
  ];

  // ===================== ALERT RULES =====================
  alertRules = [
    { name: 'High 5xx Error Rate', condition: '> 1% over 5m', severity: 'Critical', sevClass: 'danger', channels: '<i class="bi bi-telephone-outbound text-danger"></i> <i class="bi bi-slack" style="color:var(--pm-purple)"></i>', status: 'Active', statusClass: 'success' },
    { name: 'Webhook Fail > 5%', condition: '> 5% fail rate over 15m', severity: 'Warning', sevClass: 'warning', channels: '<i class="bi bi-slack" style="color:var(--pm-purple)"></i>', status: 'Active', statusClass: 'success' },
    { name: 'Latency p95 > 500ms', condition: '> 500ms over 5m', severity: 'Warning', sevClass: 'warning', channels: '<i class="bi bi-envelope text-info"></i>', status: 'Active', statusClass: 'success' },
    { name: 'Throughput Drop 50%', condition: '< 50% of baseline over 15m', severity: 'Critical', sevClass: 'danger', channels: '<i class="bi bi-telephone-outbound text-danger"></i> <i class="bi bi-slack" style="color:var(--pm-purple)"></i> <i class="bi bi-envelope text-info"></i>', status: 'Paused', statusClass: 'muted' }
  ];

  // ===================== ON-CALL DATA =====================
  onCall = {
    l1: 'John D. (Lead SRE)',
    l2: 'Sarah W. (Senior SRE)',
    pdStatus: 'Synced'
  };

  // ===================== LIVE LOGS =====================
  liveLogs = [
    { level: 'INFO', text: '[14:32:01] INFO  api-gateway — POST /v2/collections/stk → 200 (45ms) tx-99128a' },
    { level: 'INFO', text: '[14:32:00] INFO  auth-svc — Token validated for merchant_acme (12ms)' },
    { level: 'WARN', text: '[14:31:58] WARN  mpesa-bridge — STK Push timeout after 30s for phone 2547***890 (retrying)' },
    { level: 'ERROR', text: '[14:31:55] ERROR webhook-worker — Delivery failed for evt_8821a to https://api.merchant.com/hook (HTTP 503)' },
    { level: 'INFO', text: '[14:31:54] INFO  db-writer — Transaction record inserted: ch_kes_20250622_1842 (8ms)' },
    { level: 'INFO', text: '[14:31:52] INFO  api-gateway — GET /v2/balances → 200 (22ms) tx-99127f' },
    { level: 'WARN', text: '[14:31:50] WARN  db-replica-02 — p99 latency 512ms exceeds 500ms threshold' }
  ];

  // ===================== STATUS PAGE DATA =====================
  statusEndpoints = [
    { service: 'Collections API (M-Pesa, Cards)', status: 'Operational', colorClass: 'success', icon: 'bi-check-circle-fill', uptime: '99.99%' },
    { service: 'Disbursements API (B2C, B2B)', status: 'Operational', colorClass: 'success', icon: 'bi-check-circle-fill', uptime: '99.98%' },
    { service: 'Webhook Delivery', status: 'Degraded Performance', colorClass: 'warning', icon: 'bi-exclamation-triangle-fill', uptime: '98.20%' },
    { service: 'Auth / OAuth 2.0', status: 'Operational', colorClass: 'success', icon: 'bi-check-circle-fill', uptime: '100%' },
    { service: 'Developer Dashboard', status: 'Operational', colorClass: 'success', icon: 'bi-check-circle-fill', uptime: '99.99%' },
    { service: 'Settlements & Reconciliation', status: 'Operational', colorClass: 'success', icon: 'bi-check-circle-fill', uptime: '99.99%' }
  ];

  // ===================== POST-MORTEM DATA =====================
  postmortems = [
    { id: 'INC-001', title: 'Auth API Certificate Expiry', sev: 'SEV-2', date: '15 Jun 2025', duration: '45 min', impact: 'All API calls failed with SSL errors', rootCause: 'Automated certificate renewal failed due to DNS misconfiguration on the internal ACME resolver.', actions: ['Fix ACME DNS resolver configuration', 'Add certificate expiry monitoring (14-day warning)', 'Implement dual-certificate rotation'] },
    { id: 'INC-002', title: 'Webhook Queue Backlog', sev: 'SEV-3', date: '05 Jun 2025', duration: '2h 10min', impact: 'Webhook delivery delayed up to 15 minutes', rootCause: 'Redis cluster node failure during peak traffic caused queue processing to slow to 200 events/sec (normal: 5,000/sec).', actions: ['Migrate to Redis Cluster with automatic failover', 'Add dead-letter queue for events older than 1 hour', 'Implement backpressure mechanism on webhook worker'] },
    { id: 'INC-003', title: 'PesaLink Settlement Delay', sev: 'SEV-3', date: '22 Jun 2025', duration: '1h 30min', impact: 'Batch settlement delayed, merchants saw pending status', rootCause: 'IPS Kenya scheduled maintenance window was not communicated. Our retry logic held batches instead of queueing for later.', actions: ['Subscribe to IPS Kenya maintenance calendar', 'Implement scheduled maintenance-aware retry logic', 'Add merchant notification for settlement delays > 30min'] }
  ];

  get selectedPostmortem() {
    return this.postmortems.find(p => p.id === this.postmortemForm.selected) || this.postmortems[this.postmortems.length - 1];
  }

  // ===================== HEALTH METRICS DATA =====================
  slowEndpoints = [
    { endpoint: '/v2/collections/stk', method: 'POST', latency: '184 ms' },
    { endpoint: '/v2/disbursements/bank', method: 'POST', latency: '210 ms' },
    { endpoint: '/v2/transfers/pesalink', method: 'POST', latency: '195 ms' },
    { endpoint: '/v1/balances', method: 'GET', latency: '120 ms' }
  ];

  errorBreakdown = [
    { status: '500', count: '1,247', pct: '0.028%', endpoint: '/v2/collections/stk', bg: '#ef4444', color: '#fff' },
    { status: '502', count: '432', pct: '0.010%', endpoint: '/v2/disbursements/bank', bg: '#f97316', color: '#fff' },
    { status: '503', count: '318', pct: '0.007%', endpoint: '/v2/webhooks/deliveries', bg: '#eab308', color: '#000' },
    { status: '504', count: '89', pct: '0.002%', endpoint: '/v2/transfers/pesalink', bg: '#a855f7', color: '#fff' }
  ];

  // ===================== ALERT LIST DATA =====================
  alerts = [
    { icon: 'WH', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'Webhook delivery failing — /callbacks/payment > 5% fail rate', time: '2 mins ago', severity: 'Warning', badgeClass: 'warning', state: 'active' },
    { icon: 'DB', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', title: 'Database query latency high — p99 crossed 500ms on Read Replica', time: '18 mins ago', severity: 'Warning', badgeClass: 'warning', state: 'active' },
    { icon: 'MP', iconBg: 'var(--pm-danger-soft)', iconColor: 'var(--pm-danger)', title: 'Dependency: M-Pesa STK Timeouts — Safaricom Daraja API slow', time: '45 mins ago', severity: 'Critical', badgeClass: 'danger', state: 'active' },
    { icon: 'TH', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'Throughput drop detected — 40% below baseline for 10 min', time: '2 hours ago', severity: 'Warning', badgeClass: 'warning', state: 'acked' },
    { icon: 'CD', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', title: 'Card gateway latency spike — p95 at 320ms', time: '3 hours ago', severity: 'Info', badgeClass: 'info', state: 'acked' },
    { icon: 'WH', iconBg: 'var(--pm-surface-2)', iconColor: 'var(--pm-muted)', title: 'Webhook queue backlog — resolved after Redis failover', time: '1 day ago', severity: 'Warning', badgeClass: 'warning', state: 'resolved' },
    { icon: 'AU', iconBg: 'var(--pm-surface-2)', iconColor: 'var(--pm-muted)', title: 'Auth certificate expiry — resolved with manual rotation', time: '2 days ago', severity: 'Critical', badgeClass: 'danger', state: 'resolved' }
  ];

  get filteredAlerts() {
    return this.alerts.filter(a => a.state === this.alertListTab);
  }

  // ===================== PARTNER DATA (kept for other sections) =====================
  leads = [
    { name: 'Acme Retailers', industry: 'E-commerce', interest: 'WooCommerce Sync', date: 'Today', status: 'New', statusClass: 'pm-badge-info' },
    { name: 'Global Logistics', industry: 'Transport', interest: 'Payroll Importer', date: 'Yesterday', status: 'New', statusClass: 'pm-badge-info' },
    { name: 'Nairobi Traders', industry: 'Retail', interest: 'WooCommerce Sync', date: '10 Nov', status: 'In Progress', statusClass: 'pm-badge-warning' },
    { name: 'TechHub EA', industry: 'Software', interest: 'Custom SDK', date: '01 Nov', status: 'Closed Won', statusClass: 'pm-badge-success' }
  ];

  payouts = [
    { month: 'Oct 2026', merchants: '42', volume: 'KES 128M', commission: 'KES 128,450', status: 'Processing', statusClass: 'pm-badge-info' },
    { month: 'Sep 2026', merchants: '38', volume: 'KES 115M', commission: 'KES 115,000', status: 'Paid', statusClass: 'pm-badge-success' },
    { month: 'Aug 2026', merchants: '34', volume: 'KES 95M', commission: 'KES 95,000', status: 'Paid', statusClass: 'pm-badge-success' },
    { month: 'Jul 2026', merchants: '30', volume: 'KES 80M', commission: 'KES 80,000', status: 'Paid', statusClass: 'pm-badge-success' }
  ];

  roadmapItems = [
    { title: 'Batch Payouts v2 Structure', status: 'Planned for Q1 2027', votes: 124 },
    { title: 'Webhook Retry UI Dashboard', status: 'In Development', votes: 89 },
    { title: 'GraphQL API Support', status: 'Under Review', votes: 56 }
  ];

  notifications = [
    { title: 'New lead assigned: Acme Retailers', time: '2 mins ago', color: 'var(--pm-primary)', action: 'View' },
    { title: 'WooCommerce Sync reached 210 installs!', time: '1 hour ago', color: 'var(--pm-accent)', action: 'Celebrate' },
    { title: 'Commission payout of KES 115,000 processed.', time: 'Yesterday', color: 'var(--pm-info)', action: 'Viewed' },
    { title: 'Partner Summit 2026 registration is open.', time: '2 days ago', color: 'var(--pm-warning)', action: 'RSVP' }
  ];

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    // No modal boolean map needed — modals use class-based toggling
  }

  // ===================== NAVIGATION =====================
  navigateTo(route: string): void {
    console.log('Navigate to:', route);
  }

  // ===================== MODAL METHODS (Class-based for Bootstrap HTML) =====================
  openModal(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('show', 'd-block');
      el.setAttribute('aria-hidden', 'false');
    }
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    // Reset multi-step forms when opening
    if (id === 'addAlertRuleModal') { this.alertStep = 1; }
    if (id === 'incidentWarRoomModal') { this.warStep = 1; }
  }

  closeModal(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('show', 'd-block');
      el.setAttribute('aria-hidden', 'true');
    }
    const anyOpen = document.querySelectorAll('.modal.show.d-block');
    if (anyOpen.length === 0) {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
  }

  onBackdropClick(event: Event, id: string): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeModal(id);
    }
  }

  // ===================== TOAST METHOD =====================
  dismissToast(): void {
    this.toast.show = false;
  }

  // ===================== STEP NAVIGATION (Alert Rule Modal) =====================
  prevAlertStep(): void { this.alertStep--; }
  nextAlertStep(): void { this.alertStep++; }

  // ===================== STEP NAVIGATION (War Room Modal) =====================
  prevWarStep(): void { this.warStep--; }
  nextWarStep(): void { this.warStep++; }

  // ===================== MODAL CHAINING HELPERS =====================
  openStatusSubscription(): void {
    this.closeModal('systemStatusModal');
    setTimeout(() => this.openModal('statusSubscriptionModal'), 200);
  }

  openPrometheusExport(): void {
    this.closeModal('apiHealthMetricsModal');
    setTimeout(() => this.openModal('prometheusExportModal'), 200);
  }

  declareIncidentFromDep(): void {
    this.closeModal('dependencyHealthModal');
    setTimeout(() => this.openModal('incidentWarRoomModal'), 200);
  }

  openNewAlertRule(): void {
    this.closeModal('developerAlertsModal');
    setTimeout(() => this.openModal('addAlertRuleModal'), 200);
  }

  openGrafanaFromBottleneck(): void {
    this.closeModal('bottleneckDetailsModal');
    setTimeout(() => this.openModal('grafanaDashboardModal'), 200);
  }

  openLogRetention(): void {
    this.closeModal('centralizedLogModal');
    setTimeout(() => this.openModal('logRetentionModal'), 200);
  }

  // ===================== PROCESS ACTION =====================
  processAction(modalId: string, message: string, ref?: string): void {
    this.closeModal(modalId);
    this.toast = {
      show: true,
      message: ref ? `${message} (Ref: ${ref})` : message
    };
    setTimeout(() => { this.toast.show = false; }, 4000);
  }

  // ===================== CLIPBOARD =====================
  copyToClipboard(text: string): void {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.toast = { show: true, message: 'Copied to clipboard!' };
        setTimeout(() => { this.toast.show = false; }, 2000);
      }).catch(() => this.fallbackCopy(text));
    } else {
      this.fallbackCopy(text);
    }
  }

  private fallbackCopy(text: string): void {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      this.toast = { show: true, message: 'Copied to clipboard!' };
      setTimeout(() => { this.toast.show = false; }, 2000);
    } catch (err) {
      this.toast = { show: true, message: 'Failed to copy.' };
      setTimeout(() => { this.toast.show = false; }, 2000);
    }
    document.body.removeChild(ta);
  }
}