import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Endpoint {
  method: string;
  path: string;
  desc: string;
  title: string;
  methodClass: string;
  params: { name: string; type: string; required: string; description: string }[];
}

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tools.html',
  styleUrls: ['./tools.css'],
  encapsulation: ViewEncapsulation.None
})
export class ToolsComponent implements OnInit {

  // ===================== MODAL STATE =====================
  activeModal: string | null = null;
  toast = { show: false, message: '' };
  toastMessage: string | null = null;
  revokeConfirmText = '';
  newAppName = '';
  newAppDesc = '';
  newAppEnv = 'Sandbox';
  newAppCallback = '';
  ticketCategory = 'API Integration Issue';
  ticketSubject = '';
  ticketDesc = '';
  ticketPriority = 'High';
  appName = '';
  appDescription = '';
  archDesc = '';
  archVolume = '< 10,000 transactions';
  archDatetime = '';
  exportType = 'Transaction History';
  exportFrom = '';
  exportTo = '';
  exportFormat = 'CSV';
  selectedEndpoint: Endpoint | null = null;
  defaultParams = [
    { name: 'amount', type: 'integer', required: 'Yes', description: 'Transaction amount in KES' },
    { name: 'phone_number', type: 'string', required: 'Yes', description: 'MSISDN in 254... format' },
    { name: 'reference', type: 'string', required: 'Yes', description: 'Unique merchant reference' }
  ];

  // ===================== MULTI-STEP STATES =====================
  keyStep = 1;
  authStep = 1;
  kycStep = 1;
  appStep = 1;
  ticketStep = 1;

  // ===================== TAB STATES =====================
  whTab = 'list';

  // ===================== STATS =====================
  stats = {
    totalRequests: '1.2M',
    activeApps: 3,
    apps: [
      { name: 'Main App', status: 'Live' },
      { name: 'Staging', status: 'Test' },
      { name: 'Mobile SDK', status: 'Live' }
    ],
    errorRate: '0.12%',
    rateLimitHits: 3,
    rateLimitPercent: 6,
    webhookDelivery: '98.4%',
    avgLatency: '210ms'
  };

  // ===================== ENDPOINTS =====================
  coreEndpoints: Endpoint[] = [
    { method: 'POST', path: '/v1/collections/stk-push', desc: 'Initiate M-Pesa STK push payment', title: 'STK Push', methodClass: 'api-post', params: this.defaultParams },
    { method: 'POST', path: '/v1/collections/paybill', desc: 'PayBill & Till number collections', title: 'PayBill Collection', methodClass: 'api-post', params: this.defaultParams },
    { method: 'POST', path: '/v1/collections/card-charge', desc: 'Direct card payment (Visa/Mastercard)', title: 'Card Charge', methodClass: 'api-post', params: this.defaultParams },
    { method: 'GET', path: '/v1/collections/status/{id}', desc: 'Query transaction status', title: 'Transaction Status', methodClass: 'api-get', params: [] },
    { method: 'POST', path: '/v1/disbursements/b2c', desc: 'Business-to-Customer payouts', title: 'B2C Payout', methodClass: 'api-post', params: this.defaultParams },
    { method: 'POST', path: '/v1/disbursements/b2b', desc: 'Business-to-Business transfers', title: 'B2B Transfer', methodClass: 'api-post', params: this.defaultParams },
    { method: 'POST', path: '/v1/disbursements/bank', desc: 'Bank account transfers', title: 'Bank Transfer', methodClass: 'api-post', params: this.defaultParams }
  ];

  kycEndpoints: Endpoint[] = [
    { method: 'POST', path: '/v1/kyc/verify-id', desc: 'Verify national ID or passport', title: 'ID Verification', methodClass: 'api-post', params: [] },
    { method: 'POST', path: '/v1/kyc/verify-business', desc: 'Business registration verification (KYB)', title: 'Business KYB', methodClass: 'api-post', params: [] },
    { method: 'GET', path: '/v1/accounts/balance', desc: 'Check wallet and float balances', title: 'Account Balance', methodClass: 'api-get', params: [] },
    { method: 'POST', path: '/v1/accounts/sub-wallets', desc: 'Create and manage sub-wallets', title: 'Sub-Wallets', methodClass: 'api-post', params: [] }
  ];

  webhookAnalyticsEndpoints: Endpoint[] = [
    { method: 'GET', path: '/v1/webhooks/events', desc: 'List available webhook event types', title: 'Event Catalog', methodClass: 'api-get', params: [] },
    { method: 'POST', path: '/v1/webhooks/endpoints', desc: 'Register a new webhook endpoint', title: 'Register Endpoint', methodClass: 'api-post', params: [] },
    { method: 'GET', path: '/v1/analytics/realtime', desc: 'Real-time transaction streaming', title: 'Realtime Stream', methodClass: 'api-get', params: [] },
    { method: 'POST', path: '/v1/analytics/export', desc: 'Export historical transaction data', title: 'Data Export', methodClass: 'api-post', params: [] }
  ];

  // ===================== RECENT LOGS =====================
  recentLogs = [
    { code: '200', endpoint: 'POST /v1/collections/stk-push', time: '2 sec ago', detail: 'KES 500 · 254***78', badgeBg: 'var(--pm-accent-soft)', badgeColor: 'var(--pm-accent)' },
    { code: '200', endpoint: 'GET /v1/collections/status/txn_672b', time: '15 sec ago', detail: 'Status query successful', badgeBg: 'var(--pm-accent-soft)', badgeColor: 'var(--pm-accent)' },
    { code: '429', endpoint: 'POST /v1/collections/stk-push', time: '1 min ago', detail: 'Rate limit exceeded', badgeBg: 'var(--pm-warning-soft)', badgeColor: 'var(--pm-warning)' },
    { code: '401', endpoint: 'POST /v1/disbursements/b2c', time: '5 min ago', detail: 'Invalid API key', badgeBg: 'var(--pm-danger-soft)', badgeColor: 'var(--pm-danger)' }
  ];

  // ===================== API KEYS =====================
  newKeyName = '';
  newKeyEnv = 'Sandbox (Test Mode)';
  newKeyPassword = '';
  keySaved = false;

  apiKeysList = [
    { name: 'Production Main Key', env: 'Production', envClass: 'pm-badge-danger', prefix: 'sk_live_48a9...', created: '01 Oct 2026' },
    { name: 'Sandbox Test Key', env: 'Sandbox', envClass: 'pm-badge-info', prefix: 'sk_test_9f8e...', created: '15 Sep 2026' }
  ];

  // ===================== WEBHOOKS =====================
  newWebhookUrl = '';
  webhookEndpoints = [
    { name: 'Primary Handler', url: 'https://api.myapp.com/webhooks/paymo', status: 'Active', statusClass: 'pm-badge-success' },
    { name: 'Backup Handler', url: 'https://backup.myapp.com/webhooks', status: 'Inactive', statusClass: 'pm-badge-muted' }
  ];

  webhookEvents = [
    { name: 'payment.success', checked: true },
    { name: 'payment.failed', checked: true },
    { name: 'transfer.completed', checked: false },
    { name: 'kyc.verified', checked: false }
  ];

  webhookLogs = [
    { timestamp: '12:30:05', event: 'payment.success', url: 'https://api.myapp.com/webhooks/paymo', status: 'Delivered', statusClass: 'pm-badge-success', response: '200 OK' },
    { timestamp: '12:29:58', event: 'payment.failed', url: 'https://api.myapp.com/webhooks/paymo', status: 'Delivered', statusClass: 'pm-badge-success', response: '200 OK' },
    { timestamp: '12:28:10', event: 'payment.success', url: 'https://backup.myapp.com/webhooks', status: 'Failed', statusClass: 'pm-badge-danger', response: 'Timeout' }
  ];

  // ===================== IP WHITELIST =====================
  ipWhitelistEnabled = true;
  newIp = '';
  whitelistedIps = [
    { address: '192.168.1.50', label: 'Office Primary' },
    { address: '10.0.0.0/24', label: 'Internal Network' }
  ];

  // ===================== TEST CONSOLE =====================
  testMethod = 'POST';
  testEndpoint = '/v1/collections/stk-push';
  testEnv = 'Sandbox (api.sandbox.paymo.co.ke)';
  testBody = '{\n  "amount": 100,\n  "phone_number": "254712345678",\n  "reference": "TEST-001"\n}';
  defaultTestResponse = 'Send a request to see the response here.';
  testResponse = this.defaultTestResponse;
  testResponseHtml = '<span style="color:var(--pm-muted)">Send a request to see the response here.</span>';

  // ===================== ERROR CODES =====================
  errorCodes = [
    { code: 'AUTH_INVALID_KEY', http: '401', desc: 'Invalid or revoked API key', resolution: 'Check key in dashboard, regenerate if needed.', badgeClass: 'pm-badge-danger' },
    { code: 'AUTH_INSUFFICIENT_PERMISSIONS', http: '403', desc: 'Key lacks required permission scope', resolution: 'Generate a new key with correct permissions.', badgeClass: 'pm-badge-danger' },
    { code: 'RATE_LIMIT_EXCEEDED', http: '429', desc: 'Too many requests in a short time', resolution: 'Implement exponential backoff, check rate limit headers.', badgeClass: 'pm-badge-warning' },
    { code: 'INVALID_PHONE_NUMBER', http: '400', desc: 'Phone number format is incorrect', resolution: 'Ensure format is 254XXXXXXXXX without + or spaces.', badgeClass: 'pm-badge-warning' },
    { code: 'INSUFFICIENT_BALANCE', http: '400', desc: 'Not enough float balance for payout', resolution: 'Top up your float via the dashboard.', badgeClass: 'pm-badge-warning' },
    { code: 'IDEMPOTENCY_CONFLICT', http: '409', desc: 'Duplicate idempotency key detected', resolution: 'Use a unique UUID for each new request.', badgeClass: 'pm-badge-info' }
  ];

  // ===================== SDKS =====================
  sdks = [
    { name: 'Node.js SDK', version: 'v3.2.1', size: '45 KB', icon: 'bi-braces-asterisk' },
    { name: 'Python SDK', version: 'v2.8.0', size: '38 KB', icon: 'bi-filetype-py' },
    { name: 'PHP SDK', version: 'v4.1.0', size: '52 KB', icon: 'bi-filetype-php' },
    { name: 'Java SDK', version: 'v2.5.3', size: '120 KB', icon: 'bi-filetype-java' }
  ];

  // ===================== HEALTH =====================
  healthServices = [
    { name: 'Core Payments API', detail: 'Collections & Disbursements', status: 'Operational', statusClass: 'pm-badge-success' },
    { name: 'Webhook Delivery', detail: 'Event dispatch service', status: 'Degraded', statusClass: 'pm-badge-warning' },
    { name: 'KYC Verification', detail: 'ID & Business lookup', status: 'Operational', statusClass: 'pm-badge-success' },
    { name: 'Sandbox Environment', detail: 'Test API endpoints', status: 'Operational', statusClass: 'pm-badge-success' }
  ];

  // ===================== NOTIFICATIONS =====================
  notifications = [
    { title: 'Rate limit warning triggered', time: '5 min ago', icon: 'bi-exclamation-triangle', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', action: 'View' },
    { title: 'New webhook endpoint registered', time: '1 hour ago', icon: 'bi-broadcast', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', action: null },
    { title: 'API key "Staging" expires in 7 days', time: 'Yesterday', icon: 'bi-key', iconBg: 'var(--pm-danger-soft)', iconColor: 'var(--pm-danger)', action: 'Renew' }
  ];

  // ===================== KYC SIMULATOR =====================
  kycIdType = 'National ID';
  kycIdNumber = '';
  kycOutcome = 'Verified';

  // ===================== ALL API LOGS =====================
  allApiLogs = [
    { timestamp: '12:30:05', method: 'POST', endpoint: '/v1/collections/stk-push', status: '200', statusClass: 'pm-badge-success', duration: '142ms', ip: '192.168.1.50' },
    { timestamp: '12:29:58', method: 'GET', endpoint: '/v1/collections/status/txn_672b', status: '200', statusClass: 'pm-badge-success', duration: '45ms', ip: '192.168.1.50' },
    { timestamp: '12:28:10', method: 'POST', endpoint: '/v1/collections/stk-push', status: '429', statusClass: 'pm-badge-warning', duration: '12ms', ip: '192.168.1.51' },
    { timestamp: '12:25:00', method: 'POST', endpoint: '/v1/disbursements/b2c', status: '401', statusClass: 'pm-badge-danger', duration: '8ms', ip: '10.0.0.15' }
  ];

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    // No modal map needed since we use activeModal string
  }

  // ===================== MODAL METHODS =====================
  openModal(id: string): void {
    this.activeModal = id;
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }

  closeModal(id: string): void {
    this.activeModal = null;
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  onModalBackdropClick(event: Event, id: string): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeModal(id);
    }
  }

  // ===================== ENDPOINT MODAL =====================
  openEndpointModal(ep: Endpoint): void {
    this.selectedEndpoint = ep;
    this.openModal('endpointDetailModal');
  }

  // ===================== STEP NAVIGATION (API Keys) =====================
  goToKeyStep2(): void { this.keyStep = 2; }
  goToKeyStep3(): void { this.keyStep = 3; }
  prevKeyStep(): void { this.keyStep = this.keyStep - 1; }

  // ===================== STEP NAVIGATION (Auth Guide) =====================
  nextAuthStep(): void { this.authStep = this.authStep + 1; }
  prevAuthStep(): void { this.authStep = this.authStep - 1; }

  // ===================== STEP NAVIGATION (KYC Sim) =====================
  runKycSim(): void { this.kycStep = 2; }
  resetKycSim(): void { this.kycStep = 1; this.kycIdNumber = ''; }

  // ===================== WEBHOOK METHODS =====================
  addWebhook(): void {
    if (this.newWebhookUrl) {
      this.webhookEndpoints.push({
        name: 'New Endpoint',
        url: this.newWebhookUrl,
        status: 'Active',
        statusClass: 'pm-badge-success'
      });
      this.newWebhookUrl = '';
      this.whTab = 'list';
    }
  }

  rotateWebhookSecret(): void {
    this.showToast('Webhook secret rotated successfully.');
  }

  retryWebhook(log: any): void {
    this.showToast('Retrying webhook delivery for ' + log.event + '...');
  }

  // ===================== IP WHITELIST =====================
  addIp(): void {
    if (this.newIp) {
      this.whitelistedIps.push({ address: this.newIp, label: 'Manually added' });
      this.newIp = '';
    }
  }

  removeIp(index: number): void {
    this.whitelistedIps.splice(index, 1);
  }

  saveIpWhitelist(): void {
    this.showToast('IP whitelist settings saved.');
    this.closeModal('ipWhitelistModal');
  }

  // ===================== TEST CONSOLE =====================
  runApiTest(): void {
    this.testResponse = '{\n  "status": "success",\n  "message": "Request processed successfully",\n  "data": {\n    "transaction_id": "txn_test_672b1a9e",\n    "merchant_request_id": "test-12345",\n    "checkout_request_id": "ws_CO_test_27062025"\n  }\n}';
    this.testResponseHtml = this.formatJson(this.testResponse);
  }

  // ===================== NOTIFICATIONS =====================
  handleNotificationAction(n: any): void {
    if (n.action === 'Renew') {
      this.closeModal('notificationsModal');
      this.openModal('apiKeysModal');
    }
  }

  markAllRead(): void {
    this.notifications = [];
    this.showToast('All notifications marked as read.');
  }
  viewWebhookLogDetail(): void {
    this.closeModal('webhookLogsModal');
    this.openModal('logDetailModal');
  }

  viewApiLogDetail(): void {
    this.closeModal('apiLogsModal');
    this.openModal('logDetailModal');
  }

  viewWebhookLogs(): void {
    this.closeModal('webhookSetupModal');
    this.openModal('webhookLogsModal');
  }

  revokeApiKey(): void {
    this.closeModal('apiKeysModal');
    this.openModal('revokeKeyModal');
  }

  openTestConsoleFromEndpoint(): void {
    this.closeModal('endpointDetailModal');
    this.openModal('testConsoleModal');
  }

  // ===================== SDK =====================
  downloadSdk(sdk: any): void {
    this.showToast('Downloading ' + sdk.name + ' ' + sdk.version + '...');
  }

  // ===================== CLIPBOARD =====================
  copyCode(type: string): void {
    const snippets: Record<string, string> = {
      curl: 'curl -X POST https://api.sandbox.paymo.co.ke/v1/collections/stk-push -H "Authorization: Bearer sk_test_..." -H "Content-Type: application/json" -d \'{"amount": 500, "phone_number": "254712345678", "reference": "INV-2025-001"}\'',
      response: '{"status": "success", "message": "Request processed successfully", "data": {"transaction_id": "txn_672b1a9e", "merchant_request_id": "12345-67890-1", "checkout_request_id": "ws_CO_27062025123000"}}',
      pubkey: 'pk_test_48a9b2c7e1f0d3a56b8c9d0e1f2a3b4c',
      seckey: 'sk_test_9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0',
      whsec: 'whsec_88f2a1b9c8d7e6f5a4b3c2d1e0f9a8b7',
      keys: 'Public Key: pk_live_8f2a1b9c...\nSecret Key: sk_live_9f8e7d6c...',
      auth: 'Authorization: Bearer sk_live_9f8e7d6c...\nX-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000\nContent-Type: application/json',
      log: '{"request_id": "req_672b1a9e8f2c", "status": 200, "duration": "142ms", "body": {"amount": 500}}'
    };
    const text = snippets[type] || '';
    if (text) {
      this.copyToClipboard(text);
    }
  }

  copyToClipboard(text: string): void {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast('Copied to clipboard!');
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
      this.showToast('Copied to clipboard!');
    } catch (err) {
      this.showToast('Failed to copy.');
    }
    document.body.removeChild(ta);
  }

  // ===================== TOAST =====================
  showToast(message: string): void {
    this.toast = { show: true, message };
    this.toastMessage = message;
    setTimeout(() => { this.toast.show = false; }, 3000);
  }

  // ===================== UTILS =====================
  private formatJson(json: string): string {
    try {
      const obj = JSON.parse(json);
      let html = '{<br>';
      const lines: string[] = [];
      this.flattenJson(obj, lines, 2);
      html += lines.join('<br>');
      html += '<br>}';
      return html;
    } catch (e) {
      return '<span style="color:var(--pm-muted)">' + json + '</span>';
    }
  }

  private flattenJson(obj: any, lines: string[], indent: number): void {
    const spaces = '&nbsp;'.repeat(indent);
    const keys = Object.keys(obj);
    keys.forEach((key, i) => {
      const val = obj[key];
      const comma = i < keys.length - 1 ? ',' : '';
      if (typeof val === 'object' && val !== null) {
        lines.push(spaces + '<span style="color:var(--code-key)">"' + key + '"</span>: {' + comma);
        this.flattenJson(val, lines, indent + 2);
        lines[lines.length - 1] += '}';
      } else if (typeof val === 'string') {
        lines.push(spaces + '<span style="color:var(--code-key)">"' + key + '"</span>: <span style="color:var(--code-str)">"' + val + '"</span>' + comma);
      } else if (typeof val === 'number') {
        lines.push(spaces + '<span style="color:var(--code-key)">"' + key + '"</span>: <span style="color:var(--code-num)">' + val + '</span>' + comma);
      } else {
        lines.push(spaces + '<span style="color:var(--code-key)">"' + key + '"</span>: <span style="color:var(--code-num)">' + val + '</span>' + comma);
      }
    });
  }

  revokeKey(): void {
    if (this.revokeConfirmText === 'REVOKE') {
      this.showToast('API key revoked.');
      this.closeModal('revokeKeyModal');
      this.revokeConfirmText = '';
    }
  }

  downloadPostman(): void { this.showToast('Postman collection download started.'); }

  createApp(): void { this.showToast('Application created successfully.'); this.closeModal('createAppModal'); this.appStep = 1; }

  joinSlack(): void { window.open('https://slack.paymo.co.ke', '_blank'); this.closeModal('slackCommunityModal'); }

  submitArchReview(): void { this.showToast('Architecture review request submitted.'); this.closeModal('archReviewModal'); }

  exportData(): void { this.showToast('Data export started. Download will begin shortly.'); this.closeModal('analyticsExportModal'); }
}