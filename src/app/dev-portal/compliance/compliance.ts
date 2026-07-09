import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ── Interfaces ──────────────────────────────────────────────
export interface AuditLogEntry {
  timestamp: string;
  eventId: string;
  eventType: string;
  actor: string;
  ip: string;
  hashValid: boolean;
}

export interface EndpointDetail {
  method: string;
  methodClass: string;
  url: string;
  description: string;
  payload: string;
  response: string;
  errors: { code: string; reason: string }[];
  authTypes: string[];
  authClasses: string[];
  scopes: string[];
}

export interface ComplianceAlert {
  id: string;
  severity: 'danger' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
  action: string;
}

export interface DocItem {
  title: string;
  category: string;
  version: string;
  content: string;
}

export interface AuditorEntry {
  firm: string;
  contact: string;
  status: string;
  tokenExpiry: string;
}

export interface ScaRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  threshold: string;
}

// ── Component ───────────────────────────────────────────────
@Component({
  selector: 'app-compliance-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compliance.html',
  styleUrls: ['./compliance.css'],
  encapsulation: ViewEncapsulation.None
})
export class ComplianceComponent implements OnInit {

  // ── Modal State ───────────────────────────────────────────
  activeModalId: string | null = null;

  // ── Processed Action Result ───────────────────────────────
  isProcessed = false;
  processedTitle = '';
  processedDetail = '';

  // ── Tab States ────────────────────────────────────────────
  activeRegTab = 'cbk';
  activeEpTab = 'req';

  // ── Multi-Step States ─────────────────────────────────────
  cbkCurrentStep = 1;
  cbkTotalSteps = 3;
  cbkSteps = [
    { num: 1, label: 'Params' },
    { num: 2, label: 'Payload' },
    { num: 3, label: 'Result' },
  ];

  isoCurrentStep = 1;
  isoTotalSteps = 3;
  isoSteps = [
    { num: 1, label: 'Type' },
    { num: 2, label: 'XML' },
    { num: 3, label: 'Result' },
  ];

  reportCurrentStep = 1;
  reportTotalSteps = 3;
  reportSteps = [
    { num: 1, label: 'Config' },
    { num: 2, label: 'Columns' },
    { num: 3, label: 'Generate' },
  ];

  // ── Verify Log Result ─────────────────────────────────────
  verifyResult: { valid: boolean; hash: string; prevHash: string } | null = null;

  // ── Swift Route Result ────────────────────────────────────
  routeResult: { chain: { bank: string; bic: string; }[]; estimatedTime: string; } | null = null;

  // ── GPI Tracker Result ────────────────────────────────────
  gpiResult: { uetr: string; status: string; events: { time: string; status: string; location: string; }[] } | null = null;

  // ── Selected Endpoint ─────────────────────────────────────
  selectedEndpointKey = 'cbkLarge';

  // ── Environment ───────────────────────────────────────────
  currentEnv = 'production';
  environments = [
    { key: 'sandbox', label: 'Sandbox', url: 'https://api.sandbox.paymo.co.ke', color: 'var(--pm-accent)' },
    { key: 'staging', label: 'Staging', url: 'https://api.staging.paymo.co.ke', color: 'var(--pm-warning)' },
    { key: 'production', label: 'Production', url: 'https://api.paymo.co.ke', color: 'var(--pm-danger)' },
  ];

  // ── ISO Message Types ─────────────────────────────────────
  isoMessageTypes = [
    { key: 'pain001', label: 'pain.001 — Customer Credit Transfer Initiation', category: 'Payments' },
    { key: 'pain002', label: 'pain.002 — Payment Status Report', category: 'Payments' },
    { key: 'camt052', label: 'camt.052 — Bank-to-Customer Account Report', category: 'Reports' },
    { key: 'camt053', label: 'camt.053 — Bank-to-Customer Statement', category: 'Reports' },
    { key: 'pacs008', label: 'pacs.008 — FIToFICustomerCreditTransfer', category: 'Interbank' },
  ];
  selectedIsoType = 'pain001';

  // ── Report Types ──────────────────────────────────────────
  reportTypes = [
    { key: 'full', label: 'Full Compliance Audit Report' },
    { key: 'aml', label: 'AML / STR Summary Report' },
    { key: 'kra', label: 'KRA Filing Status Report' },
    { key: 'privacy', label: 'Data Privacy (ODPC) Report' },
    { key: 'access', label: 'Access & Authentication Audit' },
  ];
  selectedReportType = 'full';

  // ── Report Columns ────────────────────────────────────────
  reportColumns = [
    { key: 'timestamp', label: 'Timestamp', checked: true },
    { key: 'eventId', label: 'Event ID', checked: true },
    { key: 'eventType', label: 'Event Type', checked: true },
    { key: 'actor', label: 'Actor / Service', checked: true },
    { key: 'ip', label: 'IP Address', checked: false },
    { key: 'hash', label: 'Hash Valid', checked: true },
    { key: 'details', label: 'Full Details (JSON)', checked: false },
  ];

  // ── Open Banking Consents ─────────────────────────────────
  obConsents = [
    { id: 'CON-001', customer: 'Acme Corp', type: 'AIS', accounts: 3, status: 'Active', expires: '2025-08-15' },
    { id: 'CON-002', customer: 'Jane Wanjiku', type: 'PIS', accounts: 1, status: 'Active', expires: '2025-07-20' },
    { id: 'CON-003', customer: 'GlobalTrader Ltd', type: 'AIS+PIS', accounts: 5, status: 'Expired', expires: '2025-06-01' },
  ];

  // ── SCA Rules ─────────────────────────────────────────────
  scaRules: ScaRule[] = [
    { id: 'sca1', name: 'High-Value Transaction SCA', description: 'Require SCA for transactions above KES 50,000', enabled: true, threshold: 'KES 50,000' },
    { id: 'sca2', name: 'Cross-Border Payment SCA', description: 'Require SCA for all cross-border payments', enabled: true, threshold: 'Any amount' },
    { id: 'sca3', name: 'Login SCA', description: 'Require step-up authentication on login', enabled: true, threshold: 'Every login' },
    { id: 'sca4', name: 'Beneficiary Change SCA', description: 'Require SCA when adding or modifying beneficiaries', enabled: true, threshold: 'Any change' },
    { id: 'sca5', name: 'Low-Value Exemption', description: 'Exempt transactions below threshold from SCA', enabled: false, threshold: 'KES 5,000' },
  ];

  // ── Data ──────────────────────────────────────────────────
  auditLogs: AuditLogEntry[] = [
    { timestamp: '2025-06-27 10:45:12', eventId: 'evt_889a', eventType: 'Webhook Updated', actor: 'j.doe@company.com', ip: '41.220.x.x', hashValid: true },
    { timestamp: '2025-06-27 09:12:05', eventId: 'evt_889b', eventType: 'API Key Rotated', actor: 'dev.admin@paymo', ip: '197.232.x.x', hashValid: true },
    { timestamp: '2025-06-27 08:30:00', eventId: 'evt_889c', eventType: 'DSAR Requested', actor: 'system.compliance', ip: '10.0.1.45', hashValid: true },
    { timestamp: '2025-06-26 23:59:59', eventId: 'evt_889d', eventType: 'Daily Settlement Exec', actor: 'worker.settlement', ip: '10.0.1.22', hashValid: true },
    { timestamp: '2025-06-26 15:20:11', eventId: 'evt_889e', eventType: 'Failed Login (x5)', actor: 'unknown', ip: '8.8.8.8', hashValid: true },
    { timestamp: '2025-06-26 11:10:00', eventId: 'evt_889f', eventType: 'CBK Large Txn Report', actor: 'system.aml', ip: '10.0.1.50', hashValid: true },
  ];

  complianceAlerts: ComplianceAlert[] = [
    { id: 'ALT-001', severity: 'danger', title: 'KRA DST Filing Due in 4 Days', description: 'Monthly Digital Services Tax return for June 2025 is due by July 1. No submission recorded yet.', time: '2 hours ago', action: 'kraEtimModal' },
    { id: 'ALT-002', severity: 'warning', title: 'NSSF Tier II Contribution Mismatch', description: 'Computed Tier II contributions differ from submitted amount by KES 12,400. Review payroll batch #PB-2025-06.', time: '6 hours ago', action: 'auditLogsModal' },
    { id: 'ALT-003', severity: 'info', title: 'New CBK Prudential Guideline Published', description: 'CBK has published updated guidelines on digital lending risk reserves. Review and acknowledge by July 15.', time: '1 day ago', action: 'docViewerModal' },
  ];

  docItems: DocItem[] = [
    { title: 'KYC/AML Implementation Guide', category: 'Compliance', version: 'v3.2', content: 'This guide covers the integration of PayMo\'s KYC and AML endpoints for customer onboarding, ongoing monitoring, and suspicious transaction reporting. It includes payload schemas, risk scoring algorithms, and FRC reporting workflows.' },
    { title: 'Data Privacy Compliance Checklist', category: 'Privacy', version: 'v2.1', content: 'Checklist for Kenya Data Protection Act 2019 compliance. Covers data mapping, consent management, DSAR workflows, right to erasure procedures, and ODPC registration requirements.' },
    { title: 'KRA e-TIMS API Spec v2.1', category: 'Tax', version: 'v2.1', content: 'Technical specification for KRA e-TIMS integration. Covers invoice submission, CU number generation, QR code creation, and reconciliation endpoints. Includes sandbox testing procedures.' },
    { title: 'ISO 20022 Migration Guide', category: 'Standards', version: 'v1.4', content: 'Step-by-step migration guide from legacy MT messages to ISO 20022 XML formats. Covers pain.001, pain.002, camt.052, camt.053, and pacs.008 message types.' },
    { title: 'SWIFT gpi Integration Manual', category: 'Standards', version: 'v1.1', content: 'Manual for integrating SWIFT gpi tracking into cross-border payment flows. Covers UETR generation, tracker API, and end-to-end payment status monitoring.' },
    { title: 'Open Banking PSD2/Kenya Specs', category: 'Open Banking', version: 'v2.0', content: 'Specifications for Account Information Service (AIS) and Payment Initiation Service (PIS) APIs. Includes consent management, SCA requirements, and TPP onboarding.' },
  ];

  auditors: AuditorEntry[] = [
    { firm: 'KPMG Kenya', contact: 'audits@kpmg.co.ke', status: 'Active', tokenExpiry: '2025-07-04' },
    { firm: 'Internal Audit Team', contact: 'internal.audit@paymo.co.ke', status: 'Active', tokenExpiry: '2025-12-31' },
    { firm: 'PwC (Previous Quarter)', contact: 'digital.audit@pwc.com', status: 'Expired', tokenExpiry: '2025-03-31' },
  ];

  endpoints: Record<string, EndpointDetail> = {
    cbkLarge: {
      method: 'POST', methodClass: 'api-post',
      url: 'https://api.paymo.co.ke/v1/compliance/cbk/large-transaction',
      description: 'Report transactions exceeding KES 1M equivalent to the Financial Reporting Centre (FRC).',
      payload: `{
  "transaction_id": "string",
  "amount_kes": "decimal",
  "sender_details": {
    "name": "string",
    "id_number": "string",
    "kyc_tier": "integer"
  },
  "recipient_details": {
    "name": "string",
    "account_number": "string",
    "bank_code": "string"
  },
  "purpose_code": "string"}`,
      response: `{
  "status": "success",
  "data": {
    "frc_reference": "FRC-2025-88491A",
    "submitted_at": "2025-06-27T10:45:00Z",
    "risk_score": 12
  }}`,
      errors: [
        { code: '400', reason: 'Validation Error (e.g. missing ID number)' },
        { code: '401', reason: 'Unauthorized / Invalid Signature' },
        { code: '403', reason: 'Forbidden / Missing Scope' },
      ],
      authTypes: ['Bearer Token', 'HMAC Signature'],
      authClasses: ['pm-badge-purple', 'pm-badge-info'],
      scopes: ['compliance:write', 'transactions:read'],
    },
    cbkStr: {
      method: 'POST', methodClass: 'api-post',
      url: 'https://api.paymo.co.ke/v1/compliance/cbk/str',
      description: 'Submit Suspicious Transaction Reports (STR) algorithmically based on ML risk scoring.',
      payload: `{
  "transaction_ids": ["string"],
  "risk_score": "integer",
  "ml_model_version": "string",
  "suspicion_reasons": ["string"],
  "reporter_details": {
    "name": "string",
    "role": "string"
  }}`,
      response: `{
  "status": "success",
  "data": {
    "str_reference": "STR-2025-4421B",
    "status": "submitted_to_frc",
    "auto_frozen": true
  }}`,
      errors: [
        { code: '400', reason: 'Invalid transaction IDs or risk score' },
        { code: '409', reason: 'STR already filed for these transactions' },
      ],
      authTypes: ['Bearer Token', 'HMAC Signature'],
      authClasses: ['pm-badge-purple', 'pm-badge-info'],
      scopes: ['compliance:write', 'aml:report'],
    },
    cbkKyc: {
      method: 'GET', methodClass: 'api-get',
      url: 'https://api.paymo.co.ke/v1/compliance/kyc/pep-screening',
      description: 'Screen entities against Politically Exposed Persons (PEP) and global sanction lists.',
      payload: `{
  "query_type": "individual",
  "name": "string",
  "id_number": "string",
  "date_of_birth": "string",
  "nationality": "string"}`,
      response: `{
  "status": "success",
  "data": {
    "screening_id": "SCR-8812",
    "match_found": false,
    "lists_checked": ["PEP-KE", "EU-Sanctions", "OFAC"],
    "confidence_score": 0
  }}`,
      errors: [
        { code: '400', reason: 'Missing required query parameters' },
        { code: '429', reason: 'Rate limit exceeded (100 req/min)' },
      ],
      authTypes: ['Bearer Token'],
      authClasses: ['pm-badge-purple'],
      scopes: ['kyc:read', 'compliance:read'],
    },
    kraPaye: {
      method: 'POST', methodClass: 'api-post',
      url: 'https://api.paymo.co.ke/v1/tax/kra/paye/submit',
      description: 'Submit automated monthly PAYE returns from payroll module to iTax.',
      payload: `{
  "tax_period": "2025-06",
  "employer_pin": "string",
  "total_tax": "decimal",
  "employees": [
    {
      "name": "string",
      "pin": "string",
      "gross_pay": "decimal",
      "tax_paid": "decimal",
      "relief": "decimal"
    }
  ]}`,
      response: `{
  "status": "success",
  "data": {
    "itax_reference": "PAYE-2025-06-8812",
    "submission_status": "accepted",
    "acknowledgment_code": "ACK-9912X"
  }}`,
      errors: [
        { code: '400', reason: 'Invalid PIN format or tax period' },
        { code: '503', reason: 'KRA iTax service unavailable (maintenance window 10 PM - 2 AM)' },
      ],
      authTypes: ['Bearer Token'],
      authClasses: ['pm-badge-purple'],
      scopes: ['tax:write', 'payroll:read'],
    },
    kraWht: {
      method: 'POST', methodClass: 'api-post',
      url: 'https://api.paymo.co.ke/v1/tax/kra/wht/certificate',
      description: 'Generate and remit Withholding Tax certificates for supplier payments.',
      payload: `{
  "payment_reference": "string",
  "supplier_pin": "string",
  "supplier_name": "string",
  "gross_amount": "decimal",
  "wht_rate": "decimal",
  "wht_type": "CONTRACTUAL"}`,
      response: `{
  "status": "success",
  "data": {
    "certificate_number": "WHT-2025-8812",
    "tax_withheld": 5000.00,
    "remittance_status": "remitted",
    "kra_receipt": "ITAX-REC-4421"
  }}`,
      errors: [
        { code: '400', reason: 'Invalid WHT type or rate' },
        { code: '404', reason: 'Payment reference not found' },
      ],
      authTypes: ['Bearer Token'],
      authClasses: ['pm-badge-purple'],
      scopes: ['tax:write'],
    },
    odpcErase: {
      method: 'DEL', methodClass: 'api-del',
      url: 'https://api.paymo.co.ke/v1/privacy/data/erase',
      description: 'Execute right to erasure (Right to be Forgotten) across non-immutable financial stores.',
      payload: `{
  "customer_id": "string",
  "request_id": "string",
  "erasable_scopes": [
    "marketing_data",
    "analytics_data",
    "session_data"
  ],
  "retention_exemptions": [
    "regulatory_7yr_financial_records"
  ]}`,
      response: `{
  "status": "success",
  "data": {
    "erasure_id": "ERASE-8812",
    "scopes_processed": 3,
    "scopes_exempted": 1,
    "completion_time": "2025-06-27T11:00:00Z"
  }}`,
      errors: [
        { code: '400', reason: 'No erasable scopes provided' },
        { code: '409', reason: 'Erasure already in progress for this customer' },
      ],
      authTypes: ['Bearer Token'],
      authClasses: ['pm-badge-purple'],
      scopes: ['privacy:write'],
    },
    odpcConsent: {
      method: 'PUT', methodClass: 'api-put',
      url: 'https://api.paymo.co.ke/v1/privacy/consent/update',
      description: 'Manage granular user consent flags (marketing, profiling, third-party sharing).',
      payload: `{
  "customer_id": "string",
  "consents": {
    "marketing_emails": false,
    "marketing_sms": false,
    "profiling": false,
    "third_party_sharing": false
  },
  "reason": "User withdrew consent via self-service portal"}`,
      response: `{
  "status": "success",
  "data": {
    "updated_consents": 4,
    "effective_from": "2025-06-27T11:00:00Z",
    "confirmation_id": "CONSENT-UPD-8812"
  }}`,
      errors: [
        { code: '400', reason: 'Invalid consent keys' },
        { code: '404', reason: 'Customer not found' },
      ],
      authTypes: ['Bearer Token'],
      authClasses: ['pm-badge-purple'],
      scopes: ['privacy:write'],
    },
  };

  // ── Selected Doc ──────────────────────────────────────────
  selectedDoc: DocItem = this.docItems[0];

  // ── Lifecycle ─────────────────────────────────────────────
  ngOnInit(): void {}

  // ── Modal Methods ─────────────────────────────────────────
  openModal(id: string, endpointKey?: string): void {
    if (endpointKey) {
      this.selectedEndpointKey = endpointKey;
    }
    this.isProcessed = false;
    this.activeModalId = id;
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    this.activeModalId = null;
    this.isProcessed = false;
    document.body.classList.remove('modal-open');

    // Reset states
    if (this.activeEpTab !== 'req') { this.activeEpTab = 'req'; }
    if (this.cbkCurrentStep !== 1) { this.cbkCurrentStep = 1; }
    if (this.isoCurrentStep !== 1) { this.isoCurrentStep = 1; }
    if (this.reportCurrentStep !== 1) { this.reportCurrentStep = 1; }
    if (this.verifyResult !== null) { this.verifyResult = null; }
    if (this.routeResult !== null) { this.routeResult = null; }
    if (this.gpiResult !== null) { this.gpiResult = null; }
  }

  // ── Tab Switching ─────────────────────────────────────────
  switchMainTab(group: string, tab: string): void {
    if (group === 'reg') { this.activeRegTab = tab; }
  }

  switchTab(group: string, tab: string): void {
    if (group === 'epTab') { this.activeEpTab = tab; }
  }

  // ── Multi-Step Navigation ─────────────────────────────────
  nextCbkStep(): void {
    if (this.cbkCurrentStep < this.cbkTotalSteps) { this.cbkCurrentStep++; }
  }

  prevCbkStep(): void {
    if (this.cbkCurrentStep > 1) { this.cbkCurrentStep--; }
  }

  nextIsoStep(): void {
    if (this.isoCurrentStep < this.isoTotalSteps) { this.isoCurrentStep++; }
  }

  prevIsoStep(): void {
    if (this.isoCurrentStep > 1) { this.isoCurrentStep--; }
  }

  nextReportStep(): void {
    if (this.reportCurrentStep < this.reportTotalSteps) { this.reportCurrentStep++; }
  }

  prevReportStep(): void {
    if (this.reportCurrentStep > 1) { this.reportCurrentStep--; }
  }

  // ── Process Action ────────────────────────────────────────
  processAction(title: string, detail: string): void {
    this.isProcessed = true;
    this.processedTitle = title;
    this.processedDetail = detail;
  }

  // ── Verify Log Hash ───────────────────────────────────────
  verifyLog(): void {
    this.verifyResult = {
      valid: true,
      hash: 'sha256:a1b2c3d4e5f6...8899aabbccdd',
      prevHash: 'sha256:1122aabbccdd...e5f6a1b2c3d4',
    };
  }

  // ── Swift Route Check ─────────────────────────────────────
  checkSwiftRoute(): void {
    this.routeResult = {
      chain: [
        { bank: 'PayMo Bank Kenya', bic: 'PAYMOKENXXX' },
        { bank: 'Standard Chartered Nairobi', bic: 'SCBLKENX' },
        { bank: 'Standard Chartered London', bic: 'SCBLGB2L' },
        { bank: 'Deutsche Bank Frankfurt', bic: 'DEUTDEFF' },
      ],
      estimatedTime: '2-3 business hours',
    };
  }

  // ── GPI Tracker ───────────────────────────────────────────
  trackGpi(): void {
    this.gpiResult = {
      uetr: 'UETR-20250627-88912ABC',
      status: 'In Progress',
      events: [
        { time: '2025-06-27 10:00:00', status: 'Payment Initiated', location: 'Nairobi, KE' },
        { time: '2025-06-27 10:15:00', status: 'Received by Correspondent', location: 'London, GB' },
        { time: '2025-06-27 10:45:00', status: 'Credited to Beneficiary', location: 'Frankfurt, DE' },
      ],
    };
  }

  // ── Environment Switch ────────────────────────────────────
  switchEnv(key: string): void {
    this.currentEnv = key;
    this.closeModal();
  }

  // ── SCA Toggle ───────────────────────────────────────────
  toggleSca(ruleId: string): void {
    const rule = this.scaRules.find(r => r.id === ruleId);
    if (rule) { rule.enabled = !rule.enabled; }
  }

  // ── Alert Border Helper (avoids parser error with CSS var concatenation) ──
  getAlertBorder(severity: string): string {
    const map: Record<string, string> = {
      danger: 'var(--pm-danger)',
      warning: 'var(--pm-warning)',
      info: 'var(--pm-info)',
    };
    return '3px solid ' + (map[severity] || 'var(--pm-muted)');
  }

  // ── Getters ───────────────────────────────────────────────
  get currentEndpoint(): EndpointDetail {
    return this.endpoints[this.selectedEndpointKey] || this.endpoints['cbkLarge'];
  }

  get currentEnvData() {
    return this.environments.find(e => e.key === this.currentEnv) || this.environments[2];
  }

  // ── Stop Propagation Helper ───────────────────────────────
  stopEvent(event: Event): void {
    event.stopPropagation();
  }
}