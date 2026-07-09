import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sandbox-environment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sandbox-environment.html',
  styleUrls: ['./sandbox-environment.css'],
  encapsulation: ViewEncapsulation.None
})
export class SandboxEnvironmentComponent implements OnInit {

  // ===================== MODAL STATE =====================
  modals: Record<string, boolean> = {};
  toast = { show: false, message: '' };
  envMode: 'sandbox' | 'prod' = 'sandbox';
  showSecret = false;
  resetConfirmText = '';

  // ===================== TAB STATES =====================
  contractTab: 'endpoints' | 'schemas' | 'changelog' = 'endpoints';
  logsTab: 'live' | 'filtered' | 'export' = 'live';
  logFilter = '';
  logTotalCount = 1247;

  // ===================== MULTI-STEP STATES =====================
  supportStep = 1;
  certStep = 1;

  // ===================== SANDBOX CREDENTIALS =====================
  sandboxCreds = {
    clientId: 'sbx_pk_9a8b7c6d5e4f3g2h1i0j',
    clientSecret: 'sbx_sk_z9y8x7w6v5u4t3s2r1q0'
  };

  // ===================== GENERATE CUSTOMERS FORM =====================
  genCustomerForm = {
    count: 50,
    prefix: 'Random (Safaricom/Airtel/Telkom)',
    includeKyc: true,
    includeAddress: true
  };

  // ===================== GENERATE INVOICES FORM =====================
  genInvoiceForm = {
    volume: 20,
    state: 'Mixed (Paid, Unpaid, Overdue)',
    minAmount: '500',
    maxAmount: '50000'
  };

  // ===================== SIM MPESA FORM =====================
  simMpesaForm = {
    condition: '0 - Success (Completed)',
    phone: '254712345678',
    amount: '1000',
    fireWebhook: true
  };

  // ===================== SIM BANK FORM =====================
  simBankForm = {
    type: 'Inbound EFT Collection',
    bank: '068 - Equity Bank',
    account: '0681234567',
    amount: '50000',
    result: 'Success - Settled'
  };

  // ===================== SIM CARD FORM =====================
  simCardForm = {
    card: '4242 4242 4242 4242 (Success)',
    currency: 'KES',
    amount: '2500'
  };

  // ===================== SIM FX FORM =====================
  simFxForm = {
    pair: 'USD/KES',
    behavior: 'Static (130.50)',
    spread: 1.5
  };

  // ===================== SUPPORT TICKET FORM =====================
  supportForm = {
    type: 'Technical Issue',
    subject: '',
    description: '',
    priority: 'High'
  };

  // ===================== PAYLOAD DIFF FORM =====================
  payloadDiffForm = {
    leftPayload: `{
  "amount": 1500,
  "phone_number": "254712345678",
  "reference": "INV-2025-001"
}`,
    rightPayload: `{
  "amount": 1500,
  "phone_number": "254712345678",
  "reference": "INV-2025-001",
  "description": "Payment for services"
}`,
    diffMode: 'side-by-side'
  };

  // ===================== DEVELOPER PROFILE =====================
  devProfile = {
    name: 'Alex Dev',
    email: 'alex.dev@company.com',
    role: 'Lead Engineer',
    company: 'Acme Technologies',
    phone: '+254 712 345 678',
    team: 'Payments Integration',
    timezone: 'Africa/Nairobi (EAT, UTC+3)',
    joinedDate: '15 Mar 2024',
    lastLogin: 'Today, 09:15 AM',
    twoFactorEnabled: true,
    apiCallsThisMonth: 24592,
    sandboxResetCount: 3
  };

  // ===================== EMERGENCY HOTLINE =====================
  emergencyHotline = {
    primary: '+254 700 123 456',
    secondary: '+254 700 789 012',
    email: 'emergency@paymo.co.ke',
    slackChannel: '#paymo-emergency',
    responseTime: '< 15 minutes for SEV-1',
    hours: '24/7/365'
  };

  // ===================== CURL EXPORT =====================
  curlEndpoint = '/v1/payments/stk-push';
  curlMethod = 'POST';

  get curlCommand(): string {
    return `curl -X ${this.curlMethod} \\
  https://api.sandbox.paymo.co.ke${this.curlEndpoint} \\
  -H "Authorization: Bearer ${this.sandboxCreds.clientSecret}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 1500,
    "phone_number": "254712345678",
    "reference": "INV-2025-001",
    "description": "Payment for services",
    "callback_url": "https://api.merchant.com/webhook"
  }'`;
  }

  // ===================== ERROR CODES =====================
  errorCodeFilter = '';
  errorCodes = [
    { code: 'PAY_INSUFFICIENT_FUNDS', http: '400', description: 'Customer M-Pesa balance is too low', action: 'Ask customer to top up', httpClass: 'pm-badge-warning' },
    { code: 'PAY_TIMEOUT', http: '408', description: 'MNO did not respond within 60s', action: 'Retry or check MNO status', httpClass: 'pm-badge-warning' },
    { code: 'PAY_INVALID_PHONE', http: '400', description: 'Phone number format not recognized', action: 'Validate format (2547XXXXXXXX)', httpClass: 'pm-badge-warning' },
    { code: 'AUTH_INVALID_KEY', http: '401', description: 'API key is invalid or revoked', action: 'Regenerate keys in dashboard', httpClass: 'pm-badge-danger' },
    { code: 'AUTH_KEY_EXPIRED', http: '401', description: 'API key has expired', action: 'Rotate keys before expiry', httpClass: 'pm-badge-danger' },
    { code: 'RATE_LIMIT_EXCEEDED', http: '429', description: 'Too many requests. Limit: 500/sec', action: 'Implement exponential backoff', httpClass: 'pm-badge-warning' },
    { code: 'WEBHOOK_URL_UNREACHABLE', http: '400', description: 'Callback URL returned non-2xx', action: 'Verify endpoint is live and responds', httpClass: 'pm-badge-warning' },
    { code: 'REFUND_ALREADY_PROCESSED', http: '409', description: 'This transaction was already refunded', action: 'Check refund history by txn_id', httpClass: 'pm-badge-info' },
    { code: 'INTERNAL_ERROR', http: '500', description: 'Unexpected server error', action: 'Retry with idempotency key', httpClass: 'pm-badge-danger' },
    { code: 'MAINTENANCE_MODE', http: '503', description: 'Sandbox under scheduled maintenance', action: 'Check status page for ETA', httpClass: 'pm-badge-info' }
  ];

  get filteredErrorCodes() {
    if (!this.errorCodeFilter) return this.errorCodes;
    const f = this.errorCodeFilter.toLowerCase();
    return this.errorCodes.filter(e =>
      e.code.toLowerCase().includes(f) ||
      e.http.includes(f) ||
      e.description.toLowerCase().includes(f)
    );
  }

  // ===================== TEST DATA SETS =====================
  testDataSets = [
    { type: 'Customers', description: '100 users with valid KE phone numbers (07XX)', lastGenerated: 'Today, 10:45 AM', icon: 'bi bi-people', modal: 'genCustomersModal' },
    { type: 'Invoices', description: '50 active invoices with mixed aging states', lastGenerated: 'Yesterday, 2:10 PM', icon: 'bi bi-receipt', modal: 'genInvoicesModal' },
    { type: 'Payroll', description: 'Dummy payroll run with 200 employees + KRA logic', lastGenerated: '24 Jun 2025', icon: 'bi bi-cash-stack', modal: 'runPayrollTestModal' }
  ];

  // ===================== SCENARIOS =====================
  scenarios = [
    { title: 'Successful End-to-End Payment', desc: 'Initiation → Auth → Capture → Webhook', modal: 'scenarioE2eModal' },
    { title: 'Failed Payment w/ Retry', desc: 'Simulates insufficient funds, then success', modal: 'scenarioFailedModal' },
    { title: 'Partial Refund Processing', desc: 'Refunds 50% of captured transaction', modal: 'scenarioRefundModal' },
    { title: 'Subscription Upgrade & Proration', desc: 'Mid-cycle tier change validation', modal: 'scenarioSubModal' },
    { title: 'Bulk Disbursement w/ Mixed Results', desc: '10 txns: 8 success, 2 failed callbacks', modal: 'scenarioBulkModal' }
  ];

  // ===================== CONTRACT ENDPOINTS =====================
  contractEndpoints = [
    { endpoint: '/v1/payments', method: 'POST', schemaValid: 'Yes' },
    { endpoint: '/v1/payments/:id', method: 'GET', schemaValid: 'Yes' },
    { endpoint: '/v1/refunds', method: 'POST', schemaValid: 'Yes' },
    { endpoint: '/v1/customers', method: 'POST', schemaValid: 'Yes' },
    { endpoint: '/v1/invoices', method: 'GET', schemaValid: 'Yes' },
    { endpoint: '/v1/disbursements/batch', method: 'POST', schemaValid: 'Yes' },
    { endpoint: '/v1/subscriptions', method: 'POST', schemaValid: 'Yes' },
    { endpoint: '/v1/webhooks', method: 'PUT', schemaValid: 'Yes' }
  ];

  // ===================== CONTRACT CHANGELOG =====================
  contractChangelog = [
    { title: 'Added disbursement.batch.v2 response field', date: '22 Jun 2025' },
    { title: 'Deprecated callback_url in favor of webhook_id', date: '15 Jun 2025' },
    { title: 'Added 3DS challenge object to card responses', date: '08 Jun 2025' },
    { title: 'Rate limit headers added to all responses', date: '01 Jun 2025' }
  ];

  // ===================== TEST SUITE CASES =====================
  testSuiteCases = [
    { name: 'STK Push - Success Flow', category: 'M-Pesa', duration: '1.2s', badgeClass: 'pm-badge-success' },
    { name: 'STK Push - Insufficient Funds', category: 'M-Pesa', duration: '1.8s', badgeClass: 'pm-badge-success' },
    { name: 'Bank EFT - Success', category: 'Bank', duration: '2.1s', badgeClass: 'pm-badge-info' },
    { name: 'Bank EFT - Invalid Account', category: 'Bank', duration: '1.5s', badgeClass: 'pm-badge-info' },
    { name: 'Card Charge - 3DS Challenge', category: 'Card', duration: '3.4s', badgeClass: 'pm-badge-purple' },
    { name: 'Card Charge - Decline Fraud', category: 'Card', duration: '1.1s', badgeClass: 'pm-badge-purple' },
    { name: 'Refund - Full', category: 'Refund', duration: '1.9s', badgeClass: 'pm-badge-warning' },
    { name: 'Refund - Partial', category: 'Refund', duration: '2.0s', badgeClass: 'pm-badge-warning' },
    { name: 'Webhook Delivery - Success', category: 'Webhook', duration: '0.8s', badgeClass: 'pm-badge-dark' },
    { name: 'Webhook Retry - 3 Attempts', category: 'Webhook', duration: '5.2s', badgeClass: 'pm-badge-dark' }
  ];

  // ===================== OWASP FINDINGS =====================
  owaspFindings = [
    { check: 'TLS Configuration', severity: 'Info', details: 'TLS 1.3 enforced. HSTS enabled.', severityClass: 'pm-badge-info' },
    { check: 'SQL Injection', severity: 'Info', details: 'Parameterized queries used throughout.', severityClass: 'pm-badge-info' },
    { check: 'XSS Prevention', severity: 'Info', details: 'Output encoding and CSP headers present.', severityClass: 'pm-badge-info' },
    { check: 'Rate Limiting', severity: 'Warning', details: 'Endpoint /v1/payments lacks per-key rate limit.', severityClass: 'pm-badge-warning' },
    { check: 'Key Rotation', severity: 'Warning', details: 'Keys older than 90 days detected.', severityClass: 'pm-badge-warning' },
    { check: 'CSRF Protection', severity: 'Info', details: 'SameSite cookies + token validation.', severityClass: 'pm-badge-info' },
    { check: 'Sensitive Data Exposure', severity: 'Info', details: 'No PII in logs. Masking applied.', severityClass: 'pm-badge-info' }
  ];

  // ===================== LIVE LOG ENTRIES =====================
  liveLogEntries = [
    { method: 'POST', statusCode: '200 OK', path: '/v1/payments/stk-push', duration: '142ms', statusClass: 'text-success', payload: '{\n  "amount": 1500,\n  "phone": "254712345678",\n  "result": "Success"\n}' },
    { method: 'POST', statusCode: '200 OK', path: '/v1/refunds', duration: '231ms', statusClass: 'text-success', payload: '{\n  "refund_amount": 500,\n  "txn_id": "txn_98f2a1b",\n  "status": "processed"\n}' },
    { method: 'GET', statusCode: '200 OK', path: '/v1/payments/txn_88c3d2f', duration: '45ms', statusClass: 'text-success', payload: '{\n  "status": "captured",\n  "amount": 2000,\n  "method": "card"\n}' },
    { method: 'POST', statusCode: '400 Bad Request', path: '/v1/payments/stk-push', duration: '12ms', statusClass: 'text-warning', payload: '{\n  "error": "PAY_INVALID_PHONE",\n  "message": "Phone format invalid"\n}' },
    { method: 'POST', statusCode: '200 OK', path: '/v1/disbursements/batch', duration: '1850ms', statusClass: 'text-success', payload: '{\n  "batch_id": "bat_201",\n  "total": 10,\n  "success": 8,\n  "failed": 2\n}' }
  ];

  // ===================== CERTIFICATION CHECKLISTS =====================
  certIntegration = [
    { title: 'STK Push end-to-end', desc: 'Initiate, receive callback, verify status', checked: true },
    { title: 'Bank transfer (EFT/RTGS)', desc: 'Simulate inbound & outbound flows', checked: true },
    { title: 'Card payment (3DS)', desc: 'Trigger 3DS challenge flow', checked: true },
    { title: 'Refund processing', desc: 'Full and partial refunds', checked: true },
    { title: 'Webhook delivery', desc: 'Verify all event types received', checked: true },
    { title: 'Idempotency key handling', desc: 'Retry same request, ensure no duplicate', checked: false }
  ];

  certSecurity = [
    { title: 'TLS 1.2+ enforced', desc: 'All API calls use secure transport', checked: true },
    { title: 'API key in header (not URL)', desc: 'No credentials in query params', checked: true },
    { title: 'IP allowlist configured', desc: 'Restrict to known server IPs', checked: false },
    { title: 'Webhook signature validation', desc: 'Verify Paymo-HMAC-SHA256 header', checked: true },
    { title: 'OWASP scan passed', desc: 'No critical or high findings', checked: false }
  ];

  certOps = [
    { title: 'Error handling implemented', desc: 'Graceful fallback for all error codes', checked: true },
    { title: 'Retry logic with backoff', desc: 'Exponential backoff on 429/5xx', checked: true },
    { title: 'Logging & monitoring', desc: 'Structured logs with request IDs', checked: true },
    { title: 'Fallback payment method', desc: 'Offer alternative if primary fails', checked: false },
    { title: 'Support escalation path', desc: 'Team knows who to contact', checked: true }
  ];

  get allCertItems() {
    return [...this.certIntegration, ...this.certSecurity, ...this.certOps];
  }

  get totalCertItems(): number {
    return this.allCertItems.length;
  }

  get totalCertChecked(): number {
    return this.allCertItems.filter(c => c.checked).length;
  }

  get certProgress(): number {
    if (this.totalCertItems === 0) return 0;
    return Math.round((this.totalCertChecked / this.totalCertItems) * 100);
  }

  // ===================== SUPPORT TICKET TYPES =====================
  supportTicketTypes = [
    'Technical Issue',
    'API Bug',
    'Sandbox Environment',
    'Go-Live Assistance',
    'Documentation Feedback',
    'Feature Request',
    'Billing Inquiry',
    'Other'
  ];

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    const modalIds = [
      'sandboxCredsModal', 'resetSandboxModal', 'generateTestDataModal',
      'genCustomersModal', 'genInvoicesModal', 'simMpesaModal',
      'simBankModal', 'simCardModal', 'simFxModal', 'scenarioE2eModal',
      'scenarioFailedModal', 'scenarioRefundModal', 'scenarioSubModal',
      'scenarioBulkModal', 'runPayrollTestModal', 'apiContractModal',
      'testSuiteModal', 'owaspReportModal', 'liveLogsModal',
      'curlExportModal', 'payloadDiffModal', 'errorCodeModal',
      'supportTicketModal', 'devProfileModal', 'emergencyHotlineModal',
      'certificationModal'
    ];
    modalIds.forEach(id => this.modals[id] = false);
  }

  // ===================== MODAL METHODS =====================
  openModal(id: string): void {
    this.modals[id] = true;
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    if (id === 'certificationModal') {
      this.certStep = 1;
    }
    if (id === 'supportTicketModal') {
      this.supportStep = 1;
    }
  }

  closeModal(id: string): void {
    this.modals[id] = false;
    const anyOpen = Object.values(this.modals).some(v => v);
    if (!anyOpen) {
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

  // ===================== PROCESS ACTION =====================
  processAction(modalId: string, message: string): void {
    this.closeModal(modalId);
    this.toast = { show: true, message };
    setTimeout(() => { this.toast.show = false; }, 4000);
  }

  // ===================== ENV SWITCH =====================
  switchEnv(mode: 'sandbox' | 'prod'): void {
    if (mode === 'prod') {
      this.toast = { show: true, message: 'Switching to production requires 2FA verification.' };
      setTimeout(() => { this.toast.show = false; }, 4000);
      return;
    }
    this.envMode = mode;
  }

  // ===================== CERTIFICATION STEP NAVIGATION =====================
  prevCertStep(): void {
    if (this.certStep > 1) this.certStep--;
  }

  nextCertStep(): void {
    if (this.certStep < 3) this.certStep++;
  }

  // ===================== SUPPORT STEP NAVIGATION =====================
  prevSupportStep(): void {
    if (this.supportStep > 1) this.supportStep--;
  }

  nextSupportStep(): void {
    if (this.supportStep < 2) this.supportStep++;
  }

  // ===================== TOGGLE CERT CHECKBOX =====================
  toggleCertCheck(list: 'certIntegration' | 'certSecurity' | 'certOps', index: number): void {
    this[list][index].checked = !this[list][index].checked;
  }

  // ===================== CLIPBOARD =====================
  copyToClipboard(text: string): void {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.toast = { show: true, message: 'Copied to clipboard!' };
        setTimeout(() => { this.toast.show = false; }, 2000);
      }).catch(() => {
        this.fallbackCopy(text);
      });
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
      this.toast = { show: true, message: 'Failed to copy. Please copy manually.' };
      setTimeout(() => { this.toast.show = false; }, 2000);
    }
    document.body.removeChild(ta);
  }

  // ===================== MODAL CHAINING HELPERS =====================
  openGenCustomersFromHub(): void {
    this.closeModal('generateTestDataModal');
    setTimeout(() => this.openModal('genCustomersModal'), 150);
  }

  openGenInvoicesFromHub(): void {
    this.closeModal('generateTestDataModal');
    setTimeout(() => this.openModal('genInvoicesModal'), 150);
  }

  // ===================== SUBMIT SUPPORT TICKET =====================
  submitSupportTicket(): void {
    if (!this.supportForm.subject || !this.supportForm.description) {
      this.toast = { show: true, message: 'Please fill in all required fields.' };
      setTimeout(() => { this.toast.show = false; }, 3000);
      return;
    }
    this.processAction('supportTicketModal', `Support ticket submitted. Reference: #TKT-${Date.now().toString(36).toUpperCase()}`);
    this.supportForm = {
      type: 'Technical Issue',
      subject: '',
      description: '',
      priority: 'High'
    };
    this.supportStep = 1;
  }

  // ===================== MARK CERT COMPLETE =====================
  markCertificationComplete(): void {
    const uncheckedCount = this.totalCertItems - this.totalCertChecked;
    if (uncheckedCount > 0) {
      this.toast = { show: true, message: `Please complete all ${uncheckedCount} remaining checklist items.` };
      setTimeout(() => { this.toast.show = false; }, 3000);
      return;
    }
    this.processAction('certificationModal', 'Go-live certification submitted! Our team will review within 24 hours.');
  }
}
