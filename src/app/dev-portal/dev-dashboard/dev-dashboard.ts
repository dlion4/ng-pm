import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ApiKey {
  name: string;
  env: string;
  envBg: string;
  envColor: string;
  token: string;
  created: string;
  lastUsed: string;
  status: string;
}

export interface TeamMember {
  initials: string;
  name: string;
  email: string;
  role: string;
  roleBadge: string;
  gradient: string;
  mfa: string;
  lastLogin: string;
}

export interface LogEntry {
  method: string;
  endpoint: string;
  status: string;
  ok: boolean;
  time: string;
  ip: string;
  latency: string;
}

export interface WebhookLog {
  id: string;
  eventType: string;
  status: string;
  ok: boolean;
  time: string;
}

export interface ChecklistItem {
  label: string;
  done: boolean;
}

export interface GoLiveChecks {
  step1: ChecklistItem[];
  step2: ChecklistItem[];
  step3: ChecklistItem[];
}

export interface Alert {
  icon: string;
  color: string;
  bg: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface SnippetTab {
  key: string;
  label: string;
}

@Component({
  selector: 'app-developer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dev-dashboard.html',
  styleUrls: ['./dev-dashboard.css'],
  encapsulation: ViewEncapsulation.None
})
export class DevDashboardComponent implements OnInit {

  activeModalId: string = '';
  toastMessage: string | null = null;
  activeSnippet = 'curl';
  inviteRole = 'Developer';
  rollKeyConfirmed = false;
  versionUpgradeConfirmed = false;
  goLiveStep = 1;

  snippetTabs: SnippetTab[] = [
    { key: 'curl', label: 'cURL' },
    { key: 'node', label: 'Node.js' },
    { key: 'python', label: 'Python' },
    { key: 'php', label: 'PHP' },
  ];

  currentProject = {
    name: 'JengaPay Core Backend',
    env: 'test',
    requests: 24892,
    apiVersion: 'v2025-01-01',
    region: 'af-east-1',
  };

  stats = {
    latency: 124,
    latencyImprovement: 12,
    latencyBars: [65, 70, 55, 80, 60, 45],
    errorRate: '0.42',
    failedReqs: 104,
    errorBudgetUsed: 42,
    webhookDelivery: '99.8',
    activeEndpoints: 3,
    pendingRetries: 14,
  };

  apiKeys: ApiKey[] = [
    { name: 'Test Secret Key', env: 'TEST', envBg: 'var(--pm-warning-soft)', envColor: '#B45309', token: 'sk_test_8f92****************4a1b', created: '12 Jan 2025', lastUsed: '2 mins ago', status: 'Active' },
    { name: 'Test Publishable Key', env: 'TEST', envBg: 'var(--pm-warning-soft)', envColor: '#B45309', token: 'pk_test_e3b1****************9c0d', created: '12 Jan 2025', lastUsed: '1 hour ago', status: 'Active' },
    { name: 'Live Secret Key', env: 'LIVE', envBg: 'var(--pm-primary-light)', envColor: '#fff', token: 'sk_live_************************', created: '—', lastUsed: '—', status: 'Locked' },
  ];

  teamMembers: TeamMember[] = [
    { initials: 'DK', name: 'David K.', email: 'david@jenga.com', role: 'Owner', roleBadge: 'pm-badge-purple', gradient: 'var(--pm-gradient-hero)', mfa: 'Enabled', lastLogin: 'Today' },
    { initials: 'SO', name: 'Sarah O.', email: 'sarah@jenga.com', role: 'Developer', roleBadge: 'pm-badge-info', gradient: 'var(--pm-gradient-blue)', mfa: 'Enabled', lastLogin: 'Yesterday' },
    { initials: 'MW', name: 'Mike W.', email: 'mike@jenga.com', role: 'Support', roleBadge: '', gradient: 'var(--pm-gradient-rose)', mfa: 'Disabled', lastLogin: '5 days ago' },
  ];

  recentLogs: LogEntry[] = [
    { method: 'POST', endpoint: '/v1/charges/mpesa', status: '200 OK', ok: true, time: '10:42:15 AM', ip: '192.168.1.45', latency: '112ms' },
    { method: 'GET', endpoint: '/v1/customers/cus_9912', status: '200 OK', ok: true, time: '10:41:03 AM', ip: '192.168.1.45', latency: '85ms' },
    { method: 'POST', endpoint: '/v1/disbursements', status: '400 ERR', ok: false, time: '10:38:22 AM', ip: '192.168.1.102', latency: '145ms' },
    { method: 'HOOK', endpoint: 'charge.success', status: '503 ERR', ok: false, time: '10:35:10 AM', ip: 'PayMo Event Bus', latency: '—' },
    { method: 'GET', endpoint: '/v1/balance', status: '200 OK', ok: true, time: '10:30:00 AM', ip: '192.168.1.45', latency: '60ms' },
  ];

  webhookLogs: WebhookLog[] = [
    { id: 'evt_88319a...', eventType: 'charge.success', status: '503 ERR', ok: false, time: '10:35:10 AM' },
    { id: 'evt_88318b...', eventType: 'customer.created', status: '200 OK', ok: true, time: '10:30:05 AM' },
    { id: 'evt_88317c...', eventType: 'charge.failed', status: '200 OK', ok: true, time: '10:22:14 AM' },
    { id: 'evt_88316d...', eventType: 'transfer.success', status: '200 OK', ok: true, time: '09:15:00 AM' },
  ];

  webhookEvents = [
    { name: 'charge.success', selected: true },
    { name: 'charge.failed', selected: true },
    { name: 'transfer.success', selected: true },
    { name: 'customer.created', selected: false },
    { name: 'invoice.paid', selected: false },
  ];

  apiLogsFull: LogEntry[] = [
    { method: 'POST', endpoint: '/v1/charges/mpesa', status: '200 OK', ok: true, time: '10:42:15 AM', ip: '192.168.1.45', latency: '112ms' },
    { method: 'GET', endpoint: '/v1/customers/cus_9912', status: '200 OK', ok: true, time: '10:41:03 AM', ip: '192.168.1.45', latency: '85ms' },
    { method: 'POST', endpoint: '/v1/disbursements', status: '400 ERR', ok: false, time: '10:38:22 AM', ip: '192.168.1.102', latency: '145ms' },
    { method: 'GET', endpoint: '/v1/balance', status: '200 OK', ok: true, time: '10:30:00 AM', ip: '192.168.1.45', latency: '60ms' },
    { method: 'POST', endpoint: '/v1/charges/mpesa', status: '200 OK', ok: true, time: '10:25:11 AM', ip: '192.168.1.45', latency: '98ms' },
    { method: 'GET', endpoint: '/v1/accounts', status: '200 OK', ok: true, time: '10:20:00 AM', ip: '10.0.0.5', latency: '72ms' },
  ];

  docsList = [
    { icon: 'bi-book', bg: 'var(--pm-info-soft)', color: 'var(--pm-info)', title: 'Getting Started', desc: 'Quick integration guide' },
    { icon: 'bi-credit-card', bg: 'var(--pm-accent-soft)', color: 'var(--pm-accent)', title: 'Charges API', desc: 'M-Pesa STK, cards, bank' },
    { icon: 'bi-people', bg: 'var(--pm-purple-soft)', color: 'var(--pm-purple)', title: 'Customers API', desc: 'CRUD for customer objects' },
    { icon: 'bi-broadcast', bg: 'var(--pm-warning-soft)', color: 'var(--pm-warning)', title: 'Webhooks Guide', desc: 'Event handling & signatures' },
    { icon: 'bi-arrow-left-right', bg: 'var(--pm-danger-soft)', color: 'var(--pm-danger)', title: 'Transfers & Payouts', desc: 'Disbursements API' },
    { icon: 'bi-shield-check', bg: 'var(--pm-info-soft)', color: 'var(--pm-info)', title: 'Authentication', desc: 'API keys, OAuth, MFA' },
  ];

  sdks = [
    { icon: 'bi-braces', bg: 'var(--pm-accent-soft)', color: 'var(--pm-accent)', name: 'Node.js SDK', version: 'v3.2.1' },
    { icon: 'bi-filetype-py', bg: 'var(--pm-info-soft)', color: 'var(--pm-info)', name: 'Python SDK', version: 'v2.8.0' },
    { icon: 'bi-filetype-php', bg: 'var(--pm-purple-soft)', color: 'var(--pm-purple)', name: 'PHP SDK', version: 'v4.1.0' },
    { icon: 'bi-gem', bg: 'var(--pm-danger-soft)', color: 'var(--pm-danger)', name: 'Ruby SDK', version: 'v1.5.2' },
  ];

  ipWhitelist: string[] = ['192.168.1.0/24', '10.0.0.0/8'];

  rateLimits = [
    { name: 'Standard Requests', desc: 'GET, POST, PUT, DELETE', limit: '1,000 / min', window: 'minute' },
    { name: 'Bulk Operations', desc: 'Batch create, bulk update', limit: '100 / hour', window: 'hour' },
    { name: 'Webhook Retries', desc: 'Automatic retry attempts', limit: '50 / hour', window: 'hour' },
    { name: 'File Uploads', desc: 'Document & media uploads', limit: '20 / hour', window: 'hour' },
  ];

  goLiveChecks: GoLiveChecks = {
    step1: [
      { label: 'Test environment passes all integration tests', done: true },
      { label: 'Error handling covers all edge cases', done: true },
      { label: 'Webhook endpoints are verified and responding', done: false },
      { label: 'Rate limiting is handled gracefully in code', done: false },
    ],
    step2: [
      { label: 'IP whitelist configured for production servers', done: false },
      { label: 'All team members have MFA enabled', done: false },
      { label: 'Secret keys are stored in a secure vault (not code)', done: false },
      { label: 'Webhook signing verification is implemented', done: false },
    ],
    step3: [
      { label: 'Live API keys generated and stored securely', done: false },
      { label: 'Production webhook URLs are configured', done: false },
      { label: 'Error monitoring and alerting is active', done: false },
      { label: 'Rollback plan documented and tested', done: false },
    ],
  };

  healthStatuses = [
    { name: 'Core API (af-east-1)', ok: true },
    { name: 'M-Pesa STK Integration', ok: true },
    { name: 'Webhook Event Bus', ok: true },
    { name: 'Database Cluster', ok: true },
    { name: 'CDN / Static Assets', ok: true },
  ];

  alerts: Alert[] = [
    { icon: 'bi-exclamation-triangle', color: 'var(--pm-danger)', bg: 'var(--pm-danger-soft)', title: 'Webhook 503 Error', body: 'Endpoint https://api.jenga.com/hooks returned 503 for charge.success event.', time: '5 min ago', read: false },
    { icon: 'bi-key', color: 'var(--pm-warning)', bg: 'var(--pm-warning-soft)', title: 'Key Expiring Soon', body: 'Test Secret Key expires in 14 days. Roll it to avoid service interruption.', time: '1 hour ago', read: false },
    { icon: 'bi-box-arrow-up-right', color: 'var(--pm-info)', bg: 'var(--pm-info-soft)', title: 'New API Version', body: 'v2025-06-01 is available with new features and performance improvements.', time: '3 hours ago', read: false },
  ];

  // --- COMPLIANCE & AUDIT PAGE PROPERTIES ---

  activeRegTab: string = 'cbk';
  activeEpTab: string = 'req';

  environments: any[] = [
    { key: 'sandbox', label: 'Sandbox', url: 'https://sandbox.api.paymo.co.ke', color: 'var(--pm-warning)' },
    { key: 'test', label: 'Test', url: 'https://test.api.paymo.co.ke', color: 'var(--pm-info)' },
    { key: 'live', label: 'Live', url: 'https://api.paymo.co.ke', color: 'var(--pm-accent)' }
  ];
  currentEnv: string = 'test';

  complianceAlerts: any[] = [
    { severity: 'danger', time: '5 min ago', title: 'Filing Overdue', description: 'KRA DST filing is 2 days overdue.', action: 'auditReportModal' },
    { severity: 'warning', time: '1 hr ago', title: 'New AML Rule', description: 'CBK updated Rule 14A thresholds.', action: 'simulateCbkModal' },
    { severity: 'info', time: '3 hrs ago', title: 'Audit Log Synced', description: 'WORM store synced successfully.', action: 'auditLogsModal' }
  ];

  auditLogs: any[] = [
    { timestamp: '2025-06-27 10:42:15', eventId: 'evt_889a', eventType: 'KEY_ROTATE', actor: 'dev.admin@paymo.co.ke', ip: '192.168.1.45' },
    { timestamp: '2025-06-27 09:38:10', eventId: 'evt_889b', eventType: 'LOGIN_FAIL', actor: 'system.hook@paymo.co.ke', ip: '10.0.0.99' },
    { timestamp: '2025-06-27 08:15:22', eventId: 'evt_889c', eventType: 'WEBHOOK_UPDATE', actor: 'admin@paymo.co.ke', ip: '192.168.1.45' }
  ];

  verifyResult: any = null;

  currentEndpoint: any = {
    method: 'POST',
    methodClass: 'api-post',
    url: '/v1/compliance/cbk/large-transaction',
    payload: '{\n  "tx_ref": "TX-12345",\n  "amount": 1500000,\n  "currency": "KES"\n}',
    response: '{\n  "status": "success",\n  "frc_ref": "FRC-2025-001"\n}',
    errors: [
      { code: '400', reason: 'Invalid amount' },
      { code: '401', reason: 'Unauthorized' }
    ],
    authTypes: ['OAuth 2.0', 'JWT'],
    authClasses: ['pm-badge-info', 'pm-badge-slate'],
    scopes: ['compliance:write', 'transactions:read']
  };

  cbkSteps: any[] = [
    { num: 1, label: 'Params' },
    { num: 2, label: 'Payload' },
    { num: 3, label: 'Result' }
  ];
  cbkCurrentStep: number = 1;
  cbkTotalSteps: number = 3;

  isProcessed: boolean = false;
  processedTitle: string = '';
  processedDetail: string = '';

  reportSteps: any[] = [
    { num: 1, label: 'Configure' },
    { num: 2, label: 'Columns' },
    { num: 3, label: 'Generate' }
  ];
  reportCurrentStep: number = 1;
  reportTotalSteps: number = 3;
  selectedReportType: string = 'full';
  reportTypes: any[] = [
    { key: 'full', label: 'Full Audit Trail' },
    { key: 'summary', label: 'Summary Report' },
    { key: 'transactions', label: 'Transactions Only' }
  ];
  reportColumns: any[] = [
    { label: 'Timestamp', checked: true },
    { label: 'Event ID', checked: true },
    { label: 'Actor', checked: true },
    { label: 'IP Address', checked: false },
    { label: 'Hash', checked: false }
  ];

  isoSteps: any[] = [
    { num: 1, label: 'Type' },
    { num: 2, label: 'Payload' },
    { num: 3, label: 'Validate' }
  ];
  isoCurrentStep: number = 1;
  isoTotalSteps: number = 3;
  isoMessageTypes: any[] = [
    { key: 'pain.001', label: 'pain.001', category: 'Customer Credit Transfer' },
    { key: 'camt.053', label: 'camt.053', category: 'Bank Statement' }
  ];
  selectedIsoType: string = 'pain.001';

  routeResult: any = null;

  gpiResult: any = null;

  obConsents: any[] = [
    { id: '1', customer: 'John Doe', scopes: 'AIS', status: 'Active', created: '2025-06-20' }
  ];

  scaRules: any[] = [
    { id: 'sca1', name: 'High Value Transfers', desc: 'Require SCA for > $1000', enabled: true },
    { id: 'sca2', name: 'Cross-Border', desc: 'Require SCA for all cross-border', enabled: true }
  ];

  selectedDoc: any = { title: '', category: '', version: '', content: '' };
  docItems: any[] = [
    { title: 'KYC/AML Implementation Guide', category: 'Compliance', version: 'v2.1', content: 'Detailed guide for implementing KYC and AML checks according to CBK guidelines.' },
    { title: 'Data Privacy Compliance Checklist', category: 'Privacy', version: 'v1.0', content: 'Checklist mapped to Data Protection Act 2019 requirements.' },
    { title: 'KRA e-TIMS API Spec v2.1', category: 'Tax', version: 'v2.1', content: 'Full API specification for KRA e-TIMS integration.' }
  ];

  auditors: any[] = [
    { firm: 'KPMG', contact: 'auditor@kpmg.co.ke', status: 'Active', expires: '2025-07-15' }
  ];

  ngOnInit(): void {}

  navigateTo(route: string): void {
    console.log('Navigate to:', route);
  }

  stopEvent(event: Event): void {
    event.stopPropagation();
  }

  openModal(id: string, param?: string): void {
    if (id === 'goLiveChecklistModal') { this.goLiveStep = 1; }
    if (id === 'rollKeyModal') { this.rollKeyConfirmed = false; }
    if (id === 'apiVersionModal') { this.versionUpgradeConfirmed = false; }
    if (id === 'kraEtimModal' || id === 'dsarRequestModal' || id === 'genAuditTokenModal') {
      this.isProcessed = false;
      this.processedTitle = '';
      this.processedDetail = '';
    }
    if (id === 'isoMessageModal') {
      this.isoCurrentStep = 1;
      this.isProcessed = false;
    }
    if (id === 'simulateCbkModal') {
      this.cbkCurrentStep = 1;
    }
    if (id === 'auditReportModal') {
      this.reportCurrentStep = 1;
      this.isProcessed = false;
    }
    if (id === 'swiftRouteModal') {
      this.routeResult = null;
    }
    if (id === 'gpiTrackerModal') {
      this.gpiResult = null;
    }
    if (id === 'verifyLogModal') {
      this.verifyResult = null;
    }

    this.activeModalId = id;
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    this.activeModalId = '';
    this.toastMessage = null;
    document.body.classList.remove('modal-open');
  }

  removeIp(ip: string): void {
    this.ipWhitelist = this.ipWhitelist.filter(i => i !== ip);
  }

  markAlertsRead(): void {
    this.alerts.forEach(a => a.read = true);
  }

  processAction(title: string, detail: string = ''): void {
    this.isProcessed = true;
    this.processedTitle = title;
    this.processedDetail = detail;
    this.toastMessage = title;
    setTimeout(() => { this.toastMessage = null; }, 3500);
  }

  switchMainTab(group: string, tab: string): void {
    if (group === 'reg') {
      this.activeRegTab = tab;
    }
  }

  switchTab(group: string, tab: string): void {
    if (group === 'epTab') {
      this.activeEpTab = tab;
    }
  }

  getAlertBorder(severity: string): string {
    if (severity === 'danger') return '3px solid var(--pm-danger)';
    if (severity === 'warning') return '3px solid var(--pm-warning)';
    return '3px solid var(--pm-info)';
  }

  nextCbkStep(): void {
    if (this.cbkCurrentStep < this.cbkTotalSteps) { this.cbkCurrentStep++; }
  }

  prevCbkStep(): void {
    if (this.cbkCurrentStep > 1) { this.cbkCurrentStep--; }
  }

  nextReportStep(): void {
    if (this.reportCurrentStep < this.reportTotalSteps) { this.reportCurrentStep++; }
  }

  prevReportStep(): void {
    if (this.reportCurrentStep > 1) { this.reportCurrentStep--; }
  }

  nextIsoStep(): void {
    if (this.isoCurrentStep < this.isoTotalSteps) { this.isoCurrentStep++; }
  }

  prevIsoStep(): void {
    if (this.isoCurrentStep > 1) { this.isoCurrentStep--; }
  }

  verifyLog(): void {
    this.verifyResult = {
      hash: 'a1b2c3d4e5f6...',
      prevHash: 'z9y8x7w6v5u4...'
    };
  }

  switchEnv(key: string): void {
    this.currentEnv = key;
    this.closeModal();
    this.processAction('Environment switched to ' + key, '');
  }

  checkSwiftRoute(): void {
    this.routeResult = {
      chain: [
        { bank: 'KCB', country: 'KE' },
        { bank: 'Barclays', country: 'UK' }
      ],
      estimatedTime: 'T+1'
    };
  }

  trackGpi(): void {
    this.gpiResult = {
      uetr: 'UETR-8812-XYZ',
      status: 'In Transit',
      events: [
        { status: 'ACSP', time: '10:00' },
        { status: 'ACCC', time: '12:30' }
      ]
    };
  }

  toggleSca(id: string): void {
    const rule = this.scaRules.find(r => r.id === id);
    if (rule) { rule.enabled = !rule.enabled; }
  }

  setBorderPrimary(el: EventTarget | null): void {
    if (el instanceof HTMLElement) {
      el.style.borderColor = 'var(--pm-primary)';
    }
  }

  clearBorder(el: EventTarget | null): void {
    if (el instanceof HTMLElement) {
      el.style.borderColor = '';
    }
  }
}