import { Component, ViewEncapsulation } from '@angular/core';
import { NgClass } from '@angular/common';

type StatusKey =
  'success' | 'warning' | 'danger' | 'info' | 'pending' | 'valid' | 'ready' | 'review';
interface FlowConfig {
  labels: string[];
  closeOnDone?: boolean;
  doneMessage: string;
}
interface DocumentQueueItem {
  id: string;
  business: string;
  document: string;
  status: StatusKey;
  statusLabel: string;
  uploaded: string;
  expiry: string;
  actionLabel: string;
  actionModal: string;
}
interface ActivityItem {
  date: string;
  business: string;
  action: string;
  user: string;
  status: StatusKey;
  statusLabel: string;
  reference: string;
  actionLabel: string;
  actionModal: string;
}
interface BulkPreviewItem {
  business: string;
  status: StatusKey;
  statusLabel: string;
  issues: string;
}
interface ComplianceCheck {
  business: string;
  tcc: string;
  permit: string;
  ubo: string;
  directors: string;
  score: number;
}
interface PendingApplication {
  business: string;
  type: string;
  stage: string;
  daysOpen: number;
  actionLabel: string;
  actionModal: string;
}
interface PendingKyc {
  director: string;
  business: string;
  status: StatusKey;
  statusLabel: string;
  actionLabel: string;
  actionModal: string;
}
interface PendingDocument {
  document: string;
  business: string;
  status: StatusKey;
  statusLabel: string;
  actionLabel: string;
  actionModal: string;
}
interface ApprovalItem {
  business: string;
  level: string;
  submitted: string;
  approver: string;
}
interface BulkRenewal {
  business: string;
  currentExpiry: string;
  newExpiry: string;
  status: StatusKey;
  statusLabel: string;
}
interface AuditEntry {
  timestamp: string;
  business: string;
  action: string;
  user: string;
  ip: string;
  details: string;
}
interface SecurityMetric {
  metric: string;
  value: string;
  status: StatusKey;
  statusLabel: string;
}
interface NotificationSetting {
  alertType: string;
  push: boolean;
  sms: boolean;
  email: boolean;
}
interface OnboardingMockData {
  documentQueue: DocumentQueueItem[];
  recentActivity: ActivityItem[];
  bulkOnboardingPreview: BulkPreviewItem[];
  complianceChecks: ComplianceCheck[];
  pendingApplications: PendingApplication[];
  pendingDirectorKyc: PendingKyc[];
  pendingDocuments: PendingDocument[];
  approvalQueue: ApprovalItem[];
  bulkRenewals: BulkRenewal[];
  auditTrail: AuditEntry[];
  securityMetrics: SecurityMetric[];
  notificationSettings: NotificationSetting[];
}

@Component({
  selector: 'app-business-onboarding',
  standalone: true,
  imports: [NgClass],
  templateUrl: './business-onboarding.html',
  styleUrl: './business-onboarding.css',
    encapsulation: ViewEncapsulation.None })
export class BusinessOnboardingComponent {
  readonly pageTitle = 'PAGE 3.12 — Business Onboarding & KYB/KYC Center';
  readonly pageSubtitle = 'Onboard sole proprietors, partnerships, LLCs, SACCOs and NGOs. Manage KYB/KYC intake, beneficial ownership declarations, director verification, compliance scoring and full audit trails.';
  readonly breadcrumbStrong = 'Onboarding & KYB/KYC';
  readonly breadcrumbs: string[] = ['Home', 'Business Portal'];
  readonly headerActions: Array<{label:string;icon:string;modalId:string;primary?:boolean}> = [
    { label: 'Compliance Check', icon: 'bi bi-shield-check', modalId: 'complianceCheckModal', primary: false },
    { label: 'Pending Queue', icon: 'bi bi-list-task', modalId: 'pendingQueueModal', primary: false },
    { label: 'Onboard Business', icon: 'bi bi-plus-lg', modalId: 'onboardNewModal', primary: false },
    { label: 'Bulk Onboard', icon: 'bi bi-upload', modalId: 'bulkOnboardModal', primary: true },
  ];
  readonly hero = {
    liveLabel: 'Onboarding pipeline live',
    primaryValue: '84 businesses onboarded',
    primaryNote: 'Sole props, partnerships, LLCs, SACCOs, NGOs & corporate groups with complete KYB/KYC records and audit trails.',
    primaryActions: [
      { label: 'New Onboarding', modalId: 'onboardNewModal' },
      { label: 'Review Queue', modalId: 'pendingQueueModal' },
      { label: 'Bulk Import', modalId: 'bulkOnboardModal' },
    ],
    stats: [
      { label: 'COMPLIANCE SCORE', value: '87/100', badge: 'Strong', badgeClass: 'B B-s', icon: 'bi bi-check2-circle', note: 'TCC expiry alerts: 9 · Beneficial ownership: 94%', color: 'var(--pm-accent)', border: false },
      { label: 'PENDING VERIFICATION', value: '18', badge: '7 awaiting director KYC', badgeClass: 'B B-w', icon: 'bi bi-clock', note: '12 new applications · 6 renewal reviews', color: 'var(--pm-info)', border: false },
      { label: 'EXPIRING DOCUMENTS', value: '11', badge: 'Action required', badgeClass: 'B B-d', icon: 'bi bi-exclamation-triangle', note: 'TCC: 7 | Permits: 3 | ID: 1', color: 'var(--pm-warning)', border: true },
    ] };
  readonly attentionItems: Array<{icon:string;bg:string;color:string;title:string;subtitle:string;button:string;modalId:string}> = [
    { icon: 'bi bi-building', bg: 'var(--pm-danger-soft)', color: 'var(--pm-danger)', title: 'Nairobi SACCO — TCC expires in 4 days', subtitle: 'KRA-TCC-88291 · Renewal required', button: 'Renew', modalId: 'renewTCCModal' },
    { icon: 'bi bi-person-badge', bg: 'var(--pm-warning-soft)', color: 'var(--pm-warning)', title: 'Director KYC pending — 7 days', subtitle: 'Peter Ochieng · Huduma ID upload', button: 'Verify', modalId: 'directorKYCModal' },
    { icon: 'bi bi-exclamation-triangle', bg: 'var(--pm-purple-soft)', color: 'var(--pm-purple)', title: 'Beneficial ownership declaration overdue', subtitle: 'Greenfield Logistics · 5 days', button: 'Declare', modalId: 'beneficialOwnerModal' },
  ];
  readonly suggestionItems: Array<{icon:string;bg:string;color:string;title:string;subtitle:string;button:string;modalId:string}> = [
    { icon: 'bi bi-upload', bg: 'var(--pm-accent-soft)', color: 'var(--pm-accent)', title: 'Bulk-renew 7 TCC documents', subtitle: 'Save ~2 hours of manual review', button: 'Bulk Renew', modalId: 'bulkRenewalModal' },
    { icon: 'bi bi-shield-check', bg: 'var(--pm-info-soft)', color: 'var(--pm-info)', title: 'Run compliance score refresh', subtitle: 'Last full scan 9 days ago', button: 'Run', modalId: 'complianceCheckModal' },
    { icon: 'bi bi-file-earmark', bg: 'var(--pm-warning-soft)', color: 'var(--pm-warning)', title: 'Pre-fill from CR12 registry', subtitle: '3 applications missing registry data', button: 'Prefill', modalId: 'preFillModal' },
  ];
  readonly quickActions: Array<{icon:string;label:string;modalId:string;style?:string}> = [
    { icon: 'bi bi-plus-lg text-primary me-1', label: 'Onboard New', modalId: 'onboardNewModal' },
    { icon: 'bi bi-upload text-success me-1', label: 'Bulk Onboard', modalId: 'bulkOnboardModal' },
    { icon: 'bi bi-person-badge text-info me-1', label: 'Director KYC', modalId: 'directorKYCModal' },
    { icon: 'bi bi-file-earmark-arrow-up me-1', label: 'Upload Docs', modalId: 'uploadDocumentModal' },
    { icon: 'bi bi-list-check text-warning me-1', label: 'Approval Queue', modalId: 'approvalQueueModal' },
    { icon: 'bi bi-shield-check text-danger me-1', label: 'Compliance', modalId: 'complianceCheckModal' },
    { icon: 'bi bi-journal-text me-1', label: 'Audit Trail', modalId: 'auditTrailModal' },
    { icon: 'bi bi-arrow-repeat me-1', label: 'Bulk Renew', modalId: 'bulkRenewalModal' },
  ];
  loadingModal: string | null = null;

  readonly mockData: OnboardingMockData = {
    documentQueue: [
      {
        id: 'DOC-88291',
        business: 'Greenfield Logistics',
        document: 'TCC (KRA)',
        status: 'review',
        statusLabel: 'Pending Review',
        uploaded: '25 Jun 2025',
        expiry: '30 Jun 2025',
        actionLabel: 'Review',
        actionModal: 'verifyDocumentModal' },
      {
        id: 'DOC-88292',
        business: 'Amani Foods Ltd',
        document: 'Business Permit',
        status: 'success',
        statusLabel: 'Verified',
        uploaded: '24 Jun 2025',
        expiry: '18 Dec 2025',
        actionLabel: 'View',
        actionModal: 'viewDocumentModal' },
      {
        id: 'DOC-88293',
        business: 'Blue Nile Imports',
        document: 'CR12',
        status: 'warning',
        statusLabel: 'Missing Stamp',
        uploaded: '23 Jun 2025',
        expiry: '—',
        actionLabel: 'Review',
        actionModal: 'verifyDocumentModal' },
      {
        id: 'DOC-88294',
        business: 'Mavuno Supplies',
        document: 'Director ID',
        status: 'pending',
        statusLabel: 'Pending KYC',
        uploaded: '22 Jun 2025',
        expiry: '—',
        actionLabel: 'KYC',
        actionModal: 'directorKYCModal' },
      {
        id: 'DOC-88295',
        business: 'Orbit Agency',
        document: 'TCC (KRA)',
        status: 'danger',
        statusLabel: 'Expired',
        uploaded: '20 Jun 2025',
        expiry: '21 Jun 2025',
        actionLabel: 'Renew',
        actionModal: 'renewTCCModal' },
    ],
    recentActivity: [
      {
        date: '27 Jun 2025',
        business: 'Greenfield Logistics',
        action: 'TCC Upload',
        user: 'Compliance Analyst',
        status: 'review',
        statusLabel: 'Under Review',
        reference: 'DOC-88291',
        actionLabel: 'Review',
        actionModal: 'verifyDocumentModal' },
      {
        date: '26 Jun 2025',
        business: 'Amani Foods Ltd',
        action: 'Director KYC',
        user: 'Peter O.',
        status: 'success',
        statusLabel: 'Verified',
        reference: 'KYC-7712',
        actionLabel: 'View',
        actionModal: 'directorKYCModal' },
      {
        date: '25 Jun 2025',
        business: 'Blue Nile Imports',
        action: 'UBO Declaration',
        user: 'System',
        status: 'warning',
        statusLabel: 'Needs Update',
        reference: 'UBO-4491',
        actionLabel: 'Update',
        actionModal: 'beneficialOwnerModal' },
      {
        date: '24 Jun 2025',
        business: 'Mavuno Supplies',
        action: 'Application Submit',
        user: 'Jane M.',
        status: 'pending',
        statusLabel: 'Pending',
        reference: 'APP-5521',
        actionLabel: 'Continue',
        actionModal: 'pendingQueueModal' },
      {
        date: '23 Jun 2025',
        business: 'Orbit Agency',
        action: 'Risk Assessment',
        user: 'Risk Engine',
        status: 'warning',
        statusLabel: 'Medium Risk',
        reference: 'RISK-2291',
        actionLabel: 'Assess',
        actionModal: 'riskAssessmentModal' },
    ],
    bulkOnboardingPreview: [
      { business: 'ABC Traders Ltd', status: 'valid', statusLabel: 'Valid', issues: '—' },
      {
        business: 'Delta Hardware',
        status: 'warning',
        statusLabel: 'Warnings',
        issues: 'Missing KRA PIN' },
      {
        business: 'Nairobi Pharma',
        status: 'danger',
        statusLabel: 'Invalid',
        issues: 'Duplicate registration number' },
    ],
    complianceChecks: [
      {
        business: 'Greenfield Logistics',
        tcc: 'Expires 4d',
        permit: 'Valid',
        ubo: '3/3',
        directors: '4/4',
        score: 82 },
      {
        business: 'Amani Foods Ltd',
        tcc: 'Valid',
        permit: 'Valid',
        ubo: '2/2',
        directors: '2/2',
        score: 96 },
      {
        business: 'Orbit Agency',
        tcc: 'Expired',
        permit: 'Valid',
        ubo: '1/2',
        directors: '2/3',
        score: 61 },
    ],
    pendingApplications: [
      {
        business: 'Greenfield Logistics',
        type: 'LLC',
        stage: 'Director KYC',
        daysOpen: 7,
        actionLabel: 'Continue',
        actionModal: 'directorKYCModal' },
      {
        business: 'Blue Nile Imports',
        type: 'Importer',
        stage: 'Document Review',
        daysOpen: 4,
        actionLabel: 'Review',
        actionModal: 'verifyDocumentModal' },
      {
        business: 'Orbit Agency',
        type: 'Agency',
        stage: 'Risk Assessment',
        daysOpen: 9,
        actionLabel: 'Assess',
        actionModal: 'riskAssessmentModal' },
    ],
    pendingDirectorKyc: [
      {
        director: 'Peter Ochieng',
        business: 'Greenfield Logistics',
        status: 'pending',
        statusLabel: 'Pending Selfie',
        actionLabel: 'Upload',
        actionModal: 'directorKYCModal' },
      {
        director: 'Mary Wanjiku',
        business: 'Orbit Agency',
        status: 'warning',
        statusLabel: 'ID mismatch',
        actionLabel: 'Resolve',
        actionModal: 'directorKYCModal' },
    ],
    pendingDocuments: [
      {
        document: 'TCC',
        business: 'Greenfield Logistics',
        status: 'review',
        statusLabel: 'Pending Review',
        actionLabel: 'Review',
        actionModal: 'verifyDocumentModal' },
      {
        document: 'CR12',
        business: 'Blue Nile Imports',
        status: 'warning',
        statusLabel: 'Missing Stamp',
        actionLabel: 'Review',
        actionModal: 'verifyDocumentModal' },
    ],
    approvalQueue: [
      {
        business: 'Greenfield Logistics',
        level: 'Level 2',
        submitted: '25 Jun 2025',
        approver: 'James M.' },
      {
        business: 'Blue Nile Imports',
        level: 'Level 1',
        submitted: '26 Jun 2025',
        approver: 'Sarah A.' },
      {
        business: 'Orbit Agency',
        level: 'Enhanced Review',
        submitted: '21 Jun 2025',
        approver: 'Risk Team' },
    ],
    bulkRenewals: [
      {
        business: 'Greenfield Logistics',
        currentExpiry: '30 Jun 2025',
        newExpiry: '30 Jun 2026',
        status: 'ready',
        statusLabel: 'Ready' },
      {
        business: 'Orbit Agency',
        currentExpiry: '21 Jun 2025',
        newExpiry: '21 Jun 2026',
        status: 'ready',
        statusLabel: 'Ready' },
      {
        business: 'Mavuno Supplies',
        currentExpiry: '02 Jul 2025',
        newExpiry: '02 Jul 2026',
        status: 'ready',
        statusLabel: 'Ready' },
      {
        business: 'Blue Nile Imports',
        currentExpiry: '05 Jul 2025',
        newExpiry: '05 Jul 2026',
        status: 'ready',
        statusLabel: 'Ready' },
    ],
    auditTrail: [
      {
        timestamp: '27 Jun 14:32',
        business: 'Greenfield Logistics',
        action: 'TCC Upload',
        user: 'Compliance Analyst',
        ip: '102.134.45.12',
        details: 'Document DOC-88291 uploaded' },
      {
        timestamp: '27 Jun 12:10',
        business: 'Amani Foods Ltd',
        action: 'KYC Verified',
        user: 'System',
        ip: '10.0.4.22',
        details: 'Director KYC passed' },
      {
        timestamp: '26 Jun 16:44',
        business: 'Orbit Agency',
        action: 'Risk Flag',
        user: 'Risk Engine',
        ip: '10.0.5.13',
        details: 'Medium risk assigned' },
      {
        timestamp: '25 Jun 09:20',
        business: 'Blue Nile Imports',
        action: 'Document Review',
        user: 'Sarah A.',
        ip: '102.134.45.18',
        details: 'CR12 marked for correction' },
    ],
    securityMetrics: [
      {
        metric: 'Director Verification Rate',
        value: '94%',
        status: 'success',
        statusLabel: 'Good' },
      {
        metric: 'Duplicate Application Detection',
        value: '3 flagged',
        status: 'warning',
        statusLabel: 'Review' },
      {
        metric: 'Expired Document Exposure',
        value: '5 businesses',
        status: 'warning',
        statusLabel: 'Action' },
      { metric: 'High Risk Businesses', value: '2', status: 'danger', statusLabel: 'Monitor' },
    ],
    notificationSettings: [
      { alertType: 'TCC Expiry (30/14/7/1 days)', push: true, sms: true, email: true },
      { alertType: 'Director KYC Failure', push: true, sms: false, email: true },
      { alertType: 'Approval Queue SLA Breach', push: true, sms: true, email: true },
      { alertType: 'High Risk Assessment', push: true, sms: true, email: true },
      { alertType: 'Bulk Upload Complete', push: true, sms: false, email: true },
    ] };
  readonly flows: Record<string, FlowConfig> = {
    onboard: {
      labels: ['Business', 'Directors', 'Documents', 'Review', 'Done'],
      closeOnDone: true,
      doneMessage: 'Business onboarding application submitted.' },
    kyc: {
      labels: ['Identity', 'Selfie', 'Screening', 'Done'],
      closeOnDone: true,
      doneMessage: 'Director KYC completed.' },
    bulk: {
      labels: ['Upload', 'Validate', 'Done'],
      closeOnDone: true,
      doneMessage: 'Bulk onboarding batch submitted.' } };
  readonly steps: Record<string, number> = { onboard: 1, kyc: 1, bulk: 1 };
  readonly tabs: Record<string, string> = { queue: 'all' };
  openModals = new Set<string>();
  toastMessage = '';
  openModal(id: string): void {
    this.openModals = new Set([id]);
    this.loadingModal = null;
    this.resetFlowsForModal(id);
  }
  closeModal(id: string): void {
    const next = new Set(this.openModals);
    next.delete(id);
    this.openModals = next;
    this.loadingModal = null;
    this.resetFlowsForModal(id);
  }
  closeAllModals(): void { this.openModals = new Set(); this.loadingModal = null; }
  isModalOpen(id: string): boolean {
    return this.openModals.has(id);
  }
  hasOpenModal(): boolean {
    return this.openModals.size > 0;
  }
  currentStep(flow: string): number {
    return this.steps[flow] ?? 1;
  }
  isStep(flow: string, step: number): boolean {
    return this.currentStep(flow) === step;
  }
  stepperItems(flow: string): Array<{ index: number; label: string; last: boolean }> {
    const labels = this.flows[flow]?.labels ?? [];
    return labels.map((label, i) => ({ index: i + 1, label, last: i === labels.length - 1 }));
  }
  nextFlow(flow: string, total = this.flows[flow]?.labels.length ?? 1): void {
    const next = Math.min((this.steps[flow] ?? 1) + 1, total);
    this.steps[flow] = next;
    if (next >= total) {
      const modalMap: Record<string, string> = { onboard: 'onboardNewModal', kyc: 'directorKYCModal', bulk: 'bulkOnboardModal' };
      const modal = modalMap[flow];
      this.loadingModal = modal || null;
      window.setTimeout(() => {
        this.loadingModal = null;
        this.notify(this.flows[flow]?.doneMessage || 'Flow completed.');
        if (modal) window.setTimeout(() => this.closeModal(modal), 650);
      }, 500);
    }
  }
  activeTab(prefix: string): string {
    return this.tabs[prefix] ?? '';
  }
  switchTab(prefix: string, key: string, event?: Event): void {
    this.tabs[prefix] = key;
    this.activatePill(event);
  }
  activatePill(event?: Event): void {
    const target = event?.currentTarget as HTMLElement | null;
    const parent = target?.parentElement;
    parent?.querySelectorAll('.pill').forEach((p) => p.classList.remove('active'));
    target?.classList.add('active');
  }
  processAction(modalId: string, message: string, ref = ''): void {
    this.notify(ref ? `${message} Reference: ${ref}` : message);
    if (modalId) this.closeModal(modalId);
  }
  badgeClass(status: string): string {
    if (['success', 'valid', 'ready'].includes(status)) return 'B-s';
    if (['warning', 'pending', 'review', 'info'].includes(status)) return 'B-w';
    if (['danger'].includes(status)) return 'B-d';
    return 'B-s';
  }
  moveFocus(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input?.value?.length === 1) (input.nextElementSibling as HTMLElement | null)?.focus();
  }
  notify(message: string): void { this.toastMessage = message || 'Action completed.'; window.setTimeout(() => this.clearToast(), 3200); }
  clearToast(): void {
    this.toastMessage = '';
  }
  private resetFlowsForModal(id: string): void {
    const map: Record<string, string[]> = {
      onboardNewModal: ['onboard'],
      directorKYCModal: ['kyc'],
      bulkOnboardModal: ['bulk'] };
    for (const flow of map[id] ?? []) this.steps[flow] = 1;
  }
}