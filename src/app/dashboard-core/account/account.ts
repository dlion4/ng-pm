// account-settings.component.ts
import { Component, OnInit, ViewChild, ElementRef, Renderer2, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

interface Session {
  device: string;
  detail: string;
  location: string;
  lastActive: string;
  status: string;
  statusClass: string;
  ip?: string;
  isCurrent?: boolean;
}

interface Document {
  name: string;
  type: string;
  status: string;
  statusClass: string;
  uploaded: string;
  expiry: string;
}

interface SecurityEvent {
  event: string;
  detail: string;
  action?: string;
  modal?: string;
}

interface TrustedDevice {
  name: string;
  lastUsed: string;
  status: string;
  statusClass?: string;
}

interface NotificationPref {
  name: string;
  enabled: boolean;
}

interface KycDoc {
  name: string;
  status: string;
  statusClass: string;
  uploaded: string;
  action?: string;
}

interface AuditCheck {
  check: string;
  status: string;
  recommendation: string;
}

interface LinkedAccount {
  name: string;
  detail: string;
  status: string;
}

interface AttentionItem {
  title: string;
  actionLabel: string;
  modalTarget: string;
}

interface AdvancedNotification {
  category: string;
  push: boolean;
  sms: boolean;
  email: boolean;
  whatsapp: boolean;
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.html',
  styleUrls: ['./account.css'],
  encapsulation: ViewEncapsulation.None
})
export class AccountComponent implements OnInit {
  @ViewChild('closeAccountModal') closeAccountModalRef!: ElementRef;

  // Profile data

  profile = {
    fullName: 'Amina Grace Kamau',
    preferredName: 'Amina K.',
    dob: '1992-03-14',
    gender: 'Female',
    primaryPhone: '+254 712 345 890',
    secondaryPhone: '',
    primaryEmail: 'amina.kamau@personal.co.ke',
    workEmail: 'amina@company.co.ke',
    residentialAddress: 'Apt 3A, Lavington Green, Nairobi, Kenya',
    postalAddress: 'P.O. Box 4521-00100, Nairobi',
    nationality: 'Kenyan',
    idNumber: '32****891',
    displayDob: '14 Mar 1992',
    genderDisplay: 'Female',
    initials: 'AK',
    memberSince: 'Jan 2023',
    tier: 'Premium',
    monthlyLimit: 'KES 2,000,000',
    currentUsage: 'KES 1,284,300',
    usagePercent: 64
  };

  // Security data
  passwordLastChanged = '89 days ago';
  twoFAMethod = 'Google Authenticator';
  biometricEnabled = true;
  securityQuestionsCount = 3;

  // Stats
  accountHealthScore = 92;
  profileCompleteness = 98;
  activeSessions = 4;
  documentsOnFile = 7;

  // Tab states
  activeTab: { [key: string]: string } = {
    '2fa': 'app',
    'kyc': 'upload',
    'priv': 'sharing'
  };

  // Stepper state
  closeStep = 1;
  closeTotalSteps = 3;
  closeStepLabels = ['Reason', 'Settlement', 'Done'];

  // Loading states
  isProcessing = false;
  processingMessage = 'Processing...';

  // Sessions data
  sessions: Session[] = [
    { device: 'iPhone 15 Pro', detail: 'iOS 18.5 • App v4.2.1', location: 'Nairobi, KE', lastActive: 'Just now', status: 'Current', statusClass: 'B-s', isCurrent: true },
    { device: 'MacBook Pro', detail: 'macOS 15.4 • Safari', location: 'Nairobi, KE', lastActive: '14:22 today', status: 'Active', statusClass: 'B-s' },
    { device: 'Windows PC', detail: 'Windows 11 • Chrome', location: 'Nairobi, KE', lastActive: '26 Jun 2025', status: 'New', statusClass: 'B-w' },
    { device: 'iPad Air', detail: 'iPadOS 18.4 • App', location: 'Mombasa, KE', lastActive: '20 Jun 2025', status: 'Active', statusClass: 'B-s' }
  ];

  // KYC Documents
  kycDocuments: Document[] = [
    { name: 'National ID', type: 'Identity', status: 'Verified', statusClass: 'B-s', uploaded: '12 Jan 2023', expiry: '—' },
    { name: 'Passport', type: 'Identity', status: 'Verified', statusClass: 'B-s', uploaded: '03 Mar 2024', expiry: 'Mar 2031' },
    { name: 'Utility Bill', type: 'Address', status: 'Expiring', statusClass: 'B-w', uploaded: '15 May 2025', expiry: '15 Aug 2025' },
    { name: 'Selfie', type: 'Identity', status: 'Verified', statusClass: 'B-s', uploaded: '12 Jan 2023', expiry: '—' },
    { name: 'Bank Statement', type: 'Financial', status: 'Verified', statusClass: 'B-s', uploaded: '20 Jun 2025', expiry: '—' }
  ];

  // Security events
  securityEvents: SecurityEvent[] = [
    { event: 'Password changed', detail: '28 Mar 2025 • 14:22' },
    { event: '2FA enabled', detail: '15 Feb 2025 • 09:41' },
    { event: 'New device login', detail: 'Windows PC • 26 Jun 2025', action: 'Review', modal: 'sessionModal' },
    { event: 'Failed login attempt', detail: 'Nairobi • 12 Jun 2025', action: 'Investigate', modal: 'securityAuditModal' }
  ];

  // Trusted devices
  trustedDevices: TrustedDevice[] = [
    { name: 'iPhone 15 Pro', lastUsed: 'Today', status: 'Trusted', statusClass: 'B-s' },
    { name: 'MacBook Pro', lastUsed: 'Today', status: 'Trusted', statusClass: 'B-s' },
    { name: 'Windows PC', lastUsed: '26 Jun', status: 'Manage' },
    { name: 'iPad Air', lastUsed: '20 Jun', status: 'Manage' }
  ];

  // Notification preferences
  accountSecurityNotifs: NotificationPref[] = [
    { name: 'Login from new device', enabled: true },
    { name: 'Password or PIN change', enabled: true },
    { name: 'Failed login attempts', enabled: true },
    { name: 'Account recovery requests', enabled: true },
    { name: '2FA code requests', enabled: true }
  ];

  financialNotifs: NotificationPref[] = [
    { name: 'Transaction alerts', enabled: true },
    { name: 'Large transaction warnings', enabled: true },
    { name: 'KYC document expiry', enabled: true },
    { name: 'Statement ready', enabled: true },
    { name: 'Account limit changes', enabled: true }
  ];

  // KYC modal view documents
  kycViewDocs: KycDoc[] = [
    { name: 'National ID', status: 'Verified', statusClass: 'B-s', uploaded: '12 Jan 2023', action: 'Download' },
    { name: 'Passport', status: 'Verified', statusClass: 'B-s', uploaded: '03 Mar 2024', action: 'Download' },
    { name: 'Utility Bill', status: 'Expiring', statusClass: 'B-w', uploaded: '15 May 2025', action: 'Renew' }
  ];

  // Privacy data sharing
  dataSharing = {
    anonymized: true,
    thirdParty: false,
    personalized: true,
    creditBureaus: false
  };

  // Marketing preferences
  marketing = {
    email: true,
    sms: false,
    push: true,
    whatsapp: false
  };

  // Modal data
  editProfileData = { ...this.profile };
  changePassword = { current: '', new: '', confirm: '' };
  twoFAData = { phone: '+254 712 345 890', biometric: true };
  kycUpload = { type: 'National ID', expiry: '', file: null as File | null };
  downloadData = { range: 'All data (Jan 2023 – Present)', format: 'JSON (complete)' };
  closeAccount = { reason: 'Moving to another provider', comments: '', confirmed: false };
  reactivateReason = '';
  securityQ = {
    q1: 'What is your mother\'s maiden name?', a1: '',
    q2: 'What was the name of your first pet?', a2: '',
    q3: 'What city were you born in?', a3: ''
  };
  notifMatrix = [
    { category: 'Security alerts', push: true, sms: true, email: true, whatsapp: false },
    { category: 'Transaction alerts', push: true, sms: false, email: false, whatsapp: false },
    { category: 'Marketing', push: false, sms: false, email: false, whatsapp: false },
    { category: 'Document expiry', push: true, sms: true, email: true, whatsapp: false }
  ];

  // Processing state for doAction
  processingModalId: string | null = null;

  // ========== NEW PROPERTIES TO FIX TEMPLATE ERRORS ==========

  // Modal visibility state (for modals that use [class.show] instead of bootstrap)
  modals: { [key: string]: boolean } = {
    closeAccountModal: false,
    securityAuditModal: false,
    viewDocModal: false,
    downloadDataModal: false,
    reactivateModal: false,
    securityQuestionsModal: false,
    notifSettingsModal: false,
    linkedAccountsModal: false,
    attentionModal: false,
    profileModal: false,
    terminateAllSessionsModal: false
  };

  // Close account multi-step form
  closeAccountForm = {
    reason: 'Moving to another provider',
    comments: '',
    acknowledged: false
  };

  closeAccountStep = 1;
  closeAccountProcessing = false;
  closeAccountLabels = ['Reason', 'Settlement', 'Done'];

  // Security audit
  securityScore = 92;
  openIncidents = 0;
  recommendations = 2;

  auditChecks: AuditCheck[] = [
    { check: 'Password strength', status: 'Strong', recommendation: 'No action needed' },
    { check: 'Two-factor authentication', status: 'Enabled', recommendation: 'No action needed' },
    { check: 'Biometric login', status: 'Enabled', recommendation: 'No action needed' },
    { check: 'Security questions', status: 'Enabled', recommendation: 'No action needed' },
    { check: 'Trusted devices', status: 'Review', recommendation: 'Review Windows PC login' },
    { check: 'Recent failed logins', status: 'Review', recommendation: 'Monitor for suspicious activity' }
  ];

  // Document viewer
  viewingDoc = {
    name: 'National ID',
    number: '32****891',
    verified: '12 Jan 2023'
  };

  // Processing modal state (used in template)
  processingModal: string | null = null;

  // Download data form
  downloadDataForm = {
    range: 'All data (Jan 2023 – Present)',
    format: 'JSON (complete)'
  };

  // Reactivation form
  reactivateForm = {
    reason: ''
  };

  // Security questions form
  securityQuestionsForm = {
    q1: 'What is your mother\'s maiden name?',
    a1: '',
    q2: 'What was the name of your first pet?',
    a2: '',
    q3: 'What city were you born in?',
    a3: ''
  };

  // Advanced notifications
  advancedNotifications: AdvancedNotification[] = [
    { category: 'Security alerts', push: true, sms: true, email: true, whatsapp: false },
    { category: 'Transaction alerts', push: true, sms: false, email: false, whatsapp: false },
    { category: 'Marketing', push: false, sms: false, email: false, whatsapp: false },
    { category: 'Document expiry', push: true, sms: true, email: true, whatsapp: false }
  ];

  // Linked accounts
  linkedAccounts: LinkedAccount[] = [
    { name: 'Google Account', detail: 'amina.kamau@gmail.com', status: 'linked' },
    { name: 'Apple ID', detail: 'Not connected', status: 'unlinked' },
    { name: 'Facebook', detail: 'Not connected', status: 'unlinked' }
  ];

  // Attention items
  allAttentionItems: AttentionItem[] = [
    { title: 'Password expires in 12 days', actionLabel: 'Update', modalTarget: 'changePasswordModal' },
    { title: 'Secondary phone not verified', actionLabel: 'Verify', modalTarget: 'editProfileModal' },
    { title: 'New login from Windows PC', actionLabel: 'Review', modalTarget: 'sessionModal' }
  ];

  // User object for profile modal
  user = {
    avatar: 'AK',
    fullLegalName: 'Amina Grace Kamau',
    membershipTier: 'Premium',
    accountSince: 'Jan 2023',
    primaryEmail: 'amina.kamau@personal.co.ke',
    primaryPhone: '+254 712 345 890'
  };

  private modalInstances: { [key: string]: any } = {};

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    // Initialize any data from API here
  }

  // ========== MODAL METHODS ==========

  openModal(modalId: string): void {
    // First try bootstrap modal
    const element = document.getElementById(modalId);
    if (element && element.classList.contains('fade')) {
      if (!this.modalInstances[modalId]) {
        this.modalInstances[modalId] = new bootstrap.Modal(element);
      }
      this.modalInstances[modalId].show();
    } else {
      // Use custom modal state
      this.modals[modalId] = true;
    }
  }

  closeModal(modalId: string): void {
    // Try bootstrap first
    const instance = this.modalInstances[modalId];
    if (instance) {
      instance.hide();
    } else {
      const element = document.getElementById(modalId);
      if (element) {
        const m = bootstrap.Modal.getInstance(element);
        if (m) {
          m.hide();
          return;
        }
      }
    }
    // Fallback to custom modal state
    this.modals[modalId] = false;
    this.processingModal = null;
  }

  anyModalOpen(): boolean {
    return Object.values(this.modals).some(v => v === true);
  }

  // ========== TAB METHODS ==========

  switchTab(prefix: string, key: string): void {
    this.activeTab[prefix] = key;
  }

  // ========== CLOSE ACCOUNT FLOW ==========

  nextCloseAccountStep(): void {
    if (this.closeAccountStep === 2) {
      this.closeAccountProcessing = true;
      setTimeout(() => {
        this.closeAccountProcessing = false;
        this.closeAccountStep = 3;
      }, 1400);
      return;
    }
    if (this.closeAccountStep >= 3) {
      this.closeModal('closeAccountModal');
      this.closeAccountStep = 1;
      this.closeAccountForm = { reason: 'Moving to another provider', comments: '', acknowledged: false };
      return;
    }
    this.closeAccountStep++;
  }

  getStepNumber(step: number): string {
    if (step < this.closeAccountStep) {
      return '\u2713';
    }
    return String(step);
  }

  // ========== SESSION METHODS ==========

  terminateSession(index: number): void {
    if (this.sessions[index]) {
      this.sessions[index].status = 'Terminated';
      this.sessions[index].statusClass = 'B-d';
    }
  }

  terminateAllSessions(): void {
    this.closeModal('sessionModal');
    setTimeout(() => this.openModal('terminateAllSessionsModal'), 300);
  }

  confirmTerminateAll(): void {
    this.sessions.forEach((s, i) => {
      if (!s.isCurrent) {
        s.status = 'Terminated';
        s.statusClass = 'B-d';
      }
    });
    this.closeModal('terminateAllSessionsModal');
  }

  // ========== ACTION METHODS ==========

  doAction(modalId: string, message: string, ref: string): void {
    this.processingModalId = modalId;
    this.processingModal = modalId;
    this.isProcessing = true;

    setTimeout(() => {
      this.isProcessing = false;
      this.processingModal = null;
      // Replace modal body with success receipt
      const modal = document.getElementById(modalId);
      if (modal) {
        const body = modal.querySelector('.modal-body');
        const footer = modal.querySelector('.modal-footer');
        if (body) {
          body.innerHTML = `
            <div class="receipt">
              <div class="ri"><i class="bi bi-check-lg"></i></div>
              <h5 style="font-weight:700;color:var(--pm-accent)">${message}</h5>
              ${ref ? `<p style="font-size:12px;color:var(--pm-muted)">Reference: ${ref}</p>` : ''}
              <div class="d-flex justify-content-center mt-3" style="gap:8px">
                <button class="btn-pm btn-sm" onclick="window.location.reload()"><i class="bi bi-download"></i> Save</button>
              </div>
            </div>
          `;
        }
        if (footer) {
          footer.innerHTML = '<button class="btn-pm btn-pm-p" data-bs-dismiss="modal">Done</button>';
        }
      }
    }, 1400);
  }

  // ========== DATA EXPORT ==========

  requestDataExport(): void {
    this.processingModal = 'downloadDataModal';
    setTimeout(() => {
      this.processingModal = null;
      this.closeModal('downloadDataModal');
      alert('Data export requested. You will receive an email when it is ready.');
    }, 1400);
  }

  // ========== REACTIVATION ==========

  submitReactivation(): void {
    this.processingModal = 'reactivateModal';
    setTimeout(() => {
      this.processingModal = null;
      this.closeModal('reactivateModal');
      alert('Reactivation request submitted successfully.');
      this.reactivateForm.reason = '';
    }, 1400);
  }

  // ========== SECURITY QUESTIONS ==========

  saveSecurityQuestions(): void {
    this.processingModal = 'securityQuestionsModal';
    setTimeout(() => {
      this.processingModal = null;
      this.closeModal('securityQuestionsModal');
      alert('Security questions saved successfully.');
    }, 1400);
  }

  // ========== NOTIFICATIONS ==========

  saveNotifications(): void {
    this.processingModal = 'notifSettingsModal';
    setTimeout(() => {
      this.processingModal = null;
      this.closeModal('notifSettingsModal');
      alert('Notification settings saved successfully.');
    }, 1400);
  }

  // ========== FILE UPLOAD ==========

  onFileSelected(event: any): void {
    this.kycUpload.file = event.target.files[0];
  }

  // ========== LEGACY METHODS (for backward compat) ==========

  nextFlow(): void {
    if (this.closeStep === 2) {
      this.isProcessing = true;
      setTimeout(() => {
        this.isProcessing = false;
        this.closeStep = 3;
      }, 1400);
      return;
    }
    if (this.closeStep >= 3) {
      this.closeModal('closeAccountModal');
      this.closeStep = 1;
      return;
    }
    this.closeStep++;
  }

  resetCloseFlow(): void {
    this.closeStep = 1;
    this.closeAccount = { reason: 'Moving to another provider', comments: '', confirmed: false };
  }

  getStepClass(stepNum: number): string {
    if (stepNum < this.closeStep) return 'done';
    if (stepNum === this.closeStep) return 'active';
    return '';
  }

  getStepNumberDisplay(stepNum: number): string {
    if (stepNum < this.closeStep) {
      return '<i class="bi bi-check"></i>';
    }
    return String(stepNum);
  }

  reloadPage(): void {
    window.location.reload();
  }
}