import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-production-access',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './production-access.html',
  styleUrls: ['./production-access.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductionAccessComponent implements OnInit {

  // ===================== MODAL STATE =====================
  modals: Record<string, boolean> = {};
  toast = { show: false, message: '' };

  // ===================== MULTI-STEP & TAB STATES =====================
  oauthStep = 1;
  consentTab: 'active' | 'dsar' = 'active';
  revokeConfirmText = '';

  // ===================== FORM MODELS =====================
  oauthForm = {
    name: '',
    desc: '',
    logo: '',
    grantAuth: true,
    grantClient: true,
    grantPkce: false,
    redirects: ''
  };

  rotateKeyForm = {
    key: 'Production Secret Key (sk_live_***)',
    grace: '24 Hours',
    otp: ''
  };

  newIp = '';
  ipList = ['192.168.1.50', '203.0.113.0/24', '198.51.100.12'];

  jwtForm = {
    accessExp: '1 Hour',
    refreshExp: '30 Days',
    blacklist: true,
    claims: true
  };

  kmsForm = {
    mode: 'PayMo Managed Keys (Default)'
  };

  riskForm = {
    decline: 85,
    challenge: 60,
    velocity: true,
    sanctions: true
  };

  deviceForm = {
    rooted: true,
    emulators: true,
    biometrics: false
  };

  kycForm = {
    iprs: 'Strict Match (Name + DOB)',
    liveness: 'Active Liveness (Turn head, blink)',
    webhook: 'https://api.yourdomain.com/kyc-callbacks',
    pep: true,
    cr12: false
  };

  // ===================== DATA ARRAYS =====================
  oauthApps = [
    { name: 'Main Web App', clientId: 'app_lv_11a', flow: 'Auth Code' },
    { name: 'Mobile iOS App', clientId: 'app_lv_22b', flow: 'PKCE' }
  ];

  // ===================== CODE SNIPPETS =====================
  webhookSigCode = `const crypto = require("crypto");
const sig = crypto.createHmac("sha256", secret)
  .update(rawBody)
  .digest("hex");
if (sig === headerSig) { // Verified }`;

  consents = [
    { userId: 'usr_99812', type: 'Marketing SMS', date: '12 Jun 2025' },
    { userId: 'usr_99812', type: 'Financial Profiling', date: '12 Jun 2025' },
    { userId: 'usr_44122', type: 'Location Tracking', date: '01 May 2025' }
  ];

  scopes = [
    { name: 'payments:write', desc: 'Execute transfers/disbursements', sensitivity: 'High', sensitivityClass: 'pm-badge-danger', enabled: true },
    { name: 'customers:pii:read', desc: 'View full names, ID docs, phone', sensitivity: 'High', sensitivityClass: 'pm-badge-danger', enabled: false },
    { name: 'invoices:read', desc: 'Read invoice data', sensitivity: 'Low', sensitivityClass: 'pm-badge-info', enabled: true },
    { name: 'webhook:config', desc: 'Change webhook URLs via API', sensitivity: 'Med', sensitivityClass: 'pm-badge-warning', enabled: false }
  ];

  auditLogs = [
    { time: '2025-06-25 14:32:01', actor: 'Admin Dev', action: 'Key Rotation', details: 'Rotated Production Secret Key', badgeClass: 'pm-badge-warning' },
    { time: '2025-06-25 12:15:44', actor: 'System', action: 'Blocked IP', details: 'Blocked 45.33.32.156 (Rate limit exceeded)', badgeClass: 'pm-badge-danger' },
    { time: '2025-06-25 09:08:12', actor: 'Admin Dev', action: 'Scope Update', details: 'Disabled customers:pii:read default scope', badgeClass: 'pm-badge-info' },
    { time: '2025-06-24 16:45:00', actor: 'System', action: 'Fraud Alert', details: 'Auto-declined txn (Risk score 91)', badgeClass: 'pm-badge-danger' },
    { time: '2025-06-24 11:20:33', actor: 'Admin Dev', action: 'OAuth App', details: 'Registered "Mobile iOS App" (PKCE)', badgeClass: 'pm-badge-success' }
  ];

  rateLimits = [
    { endpoint: '/v1/payments/*', limit: '500 req/s', window: 'Per Second', usage: '120 req/s', status: 'Healthy', statusClass: 'pm-badge-success' },
    { endpoint: '/v1/payments/stk-push', limit: '100 req/s', window: 'Per Second', usage: '95 req/s', status: 'Warning', statusClass: 'pm-badge-warning' },
    { endpoint: '/v1/customers/*', limit: '200 req/min', window: 'Per Minute', usage: '45 req/min', status: 'Healthy', statusClass: 'pm-badge-success' },
    { endpoint: '/v1/webhooks/*', limit: '50 req/min', window: 'Per Minute', usage: '12 req/min', status: 'Healthy', statusClass: 'pm-badge-success' }
  ];

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    const modalIds = [
      'oauthRegisterModal', 'oauthManageModal', 'deleteAppModal', 'rotateKeysModal',
      'ipWhitelistModal', 'webhookSigModal', 'jwtConfigModal', 'certPinningModal',
      'pciUploadModal', 'consentViewerModal', 'encryptionSettingsModal', 'scopeManageModal',
      'riskThresholdsModal', 'deviceFingerprintModal', 'kycWebhookModal', 'healthCheckModal',
      'notificationSettingsModal', 'auditLogModal', 'sandboxTestingModal', 'secretRevealModal',
      'supportEscalationModal', 'rateLimitAlertModal', 'dpaModal'
    ];
    modalIds.forEach(id => this.modals[id] = false);
  }

  // ===================== MODAL METHODS =====================
  openModal(id: string): void {
    this.modals[id] = true;
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
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

  // ===================== PROCESS ACTION =====================
  processAction(modalId: string, message: string, ref?: string): void {
    this.closeModal(modalId);
    this.toast = { 
      show: true, 
      message: ref ? `${message} (Ref: ${ref})` : message 
    };
    setTimeout(() => { this.toast.show = false; }, 4000);
    
    // Reset specific forms on success
    if (modalId === 'oauthRegisterModal') {
      this.oauthStep = 1;
    }
    if (modalId === 'deleteAppModal') {
      this.revokeConfirmText = '';
    }
  }

  // ===================== IP WHITELIST LOGIC =====================
  addIp(): void {
    if (this.newIp.trim()) {
      this.ipList.push(this.newIp.trim());
      this.newIp = '';
    }
  }

  removeIp(index: number): void {
    this.ipList.splice(index, 1);
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

  prevOauthStep(): void { if (this.oauthStep > 1) this.oauthStep--; }

  nextOauthStep(): void { if (this.oauthStep < 4) this.oauthStep++; }
}