import { Component, OnInit, OnDestroy, TrackByFunction, ViewEncapsulation  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ─── Data Models ──────────────────────────────────────────────

interface VerificationMethod {
  id: string;
  icon: string;
  title: string;
  description: string;
  badges: { label: string; class: string }[];
}

interface VerificationStep {
  id: string;
  label: string;
  icon: string;
}

interface DoneAction {
  icon: string;
  title: string;
  description: string;
  btnLabel: string;
  btnClass: string;
}

interface SlotOption {
  label: string;
  active: boolean;
}

interface QualityCheck {
  label: string;
  status: string;
  badgeClass: string;
}

interface StatusLine {
  icon: string;
  title: string;
  description: string;
  done: boolean;
  active: boolean;
}

interface DetailStat {
  label: string;
  value: string;
}

// ─── Component ──────────────────────────────────────────────────

@Component({
  selector: 'app-identity-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './identity-verification.html',
  styleUrls: ['./identity-verification.css'],
  encapsulation: ViewEncapsulation.None
})
export class IdentityVerificationComponent implements OnInit, OnDestroy {

  // ─── Static Config ───────────────────────────────────────────

  logoMark = 'P';
  brandTitle = 'Paymo';
  brandSubtitle = 'Identity Verification';
  pillText = 'High assurance recovery';
  heroHeading = 'Verify your';
  heroAccent = 'identity.';
  heroDescription = 'We need to confirm it is really you. This protects your Paymo account from unauthorized recovery, fraud, and sensitive-action abuse.';

  reasonOptions = [
    'Account recovery',
    'Large transaction above $10,000',
    'Sensitive action: API key rotation',
    'Regulatory requirement: KYC refresh'
  ];
  selectedReason = 'Account recovery';

  detailStats: DetailStat[] = [
    { label: 'Auto review', value: '2-5 min' },
    { label: 'Video calls', value: '4h SLA' },
    { label: 'Languages', value: '8' },
    { label: 'Encryption', value: 'TLS 1.3' }
  ];

  sectionLabel = 'Page 59 - Account Recovery & Identity Verification';
  sectionTitle = 'Choose a verification path';
  sectionDescription = 'Select the assurance level that matches your risk prompt.';

  // ─── Steps ───────────────────────────────────────────────────

  stepOrder = ['select', 'verify', 'review', 'done'];
  currentStep = 'select';

  stepChips: VerificationStep[] = [
    { id: 'select', label: 'Method', icon: 'bi-grid' },
    { id: 'verify', label: 'Verify', icon: 'bi-person-vcard' },
    { id: 'review', label: 'Review', icon: 'bi-hourglass-split' },
    { id: 'done', label: 'Next steps', icon: 'bi-check2-circle' }
  ];

  // ─── Methods ─────────────────────────────────────────────────

  methods: VerificationMethod[] = [
    {
      id: 'basic', icon: 'bi-shield-check', title: 'Level 1 - Basic',
      description: 'Dual-channel OTP plus security questions for low-risk recovery.',
      badges: [{ label: 'Email', class: 'badge-ok' }, { label: 'SMS', class: 'badge-ok' }]
    },
    {
      id: 'document', icon: 'bi-person-vcard', title: 'Level 2 - Standard',
      description: 'Government ID, selfie match, and automated document review.',
      badges: [{ label: 'ID', class: 'badge-native' }, { label: 'Selfie', class: 'badge-native' }]
    },
    {
      id: 'video', icon: 'bi-camera-video', title: 'Level 3 - Video',
      description: 'Live agent verification for high-risk recovery and legal holds.',
      badges: [{ label: '4h slots', class: 'badge-adv' }]
    },
    {
      id: 'bank', icon: 'bi-bank', title: 'Bank Micro-deposit',
      description: 'Confirm ownership of a linked bank account with two small amounts.',
      badges: [{ label: '1-2 days', class: 'badge-soon' }]
    },
    {
      id: 'enterprise', icon: 'bi-building-lock', title: 'Enterprise Courier',
      description: 'Document courier verification for enterprise admins and signatories.',
      badges: [{ label: 'High assurance', class: 'badge-warn' }]
    },
    {
      id: 'affidavit', icon: 'bi-file-earmark-lock', title: 'Notarized Affidavit',
      description: 'Legal dispute recovery with notarized statement and compliance review.',
      badges: [{ label: '3-5 days', class: 'badge-warn' }]
    }
  ];

  selectedMethod = 'basic';

  // ─── Verify Flow State ───────────────────────────────────────

  // Basic flow
  emailOtp = '';
  smsOtp = '';
  securityQ1 = '';
  securityQ2 = '';

  // Document flow
  docType = 'Passport';
  docTypes = ['Passport', 'National ID', "Driver's License", "Voter's Card"];
  docUploaded = false;
  qualityChecks: QualityCheck[] = [
    { label: 'Lighting', status: 'Pending', badgeClass: 'badge-soon' },
    { label: 'Glare detection', status: 'Pending', badgeClass: 'badge-soon' },
    { label: 'Frame quality', status: 'Pending', badgeClass: 'badge-soon' }
  ];
  liveness = { blink: false, turn: false, smile: false };
  faceScore = 'Not captured';

  // Video flow
  callLang = 'English';
  callLangs = ['English', 'French', 'Portuguese', 'Swahili', 'Arabic', 'Hausa', 'Yoruba', 'Zulu'];
  timezone = 'WAT - Lagos';
  timezones = ['WAT - Lagos', 'EAT - Nairobi', 'GMT - Accra/London', 'GST - Dubai'];
  slotOptions: SlotOption[] = [
    { label: 'Today 14:00', active: false },
    { label: 'Today 16:30', active: false },
    { label: 'Tomorrow 09:00', active: false },
    { label: 'Tomorrow 11:30', active: false },
    { label: 'Tomorrow 15:00', active: false },
    { label: '+2 days 10:00', active: false },
    { label: '+2 days 13:30', active: false },
    { label: '+2 days 17:00', active: false }
  ];
  selectedSlot: string | null = null;
  callConfirmText = '';

  // Bank flow
  bankName = 'GTBank';
  banks = ['GTBank', 'Equity Bank', 'Stanbic Bank', 'Standard Bank'];
  accountNumber = '';
  depositsSent = false;
  deposit1 = '';
  deposit2 = '';

  // Enterprise flow
  enterpriseName = '';
  enterpriseCountry = 'Nigeria';
  enterpriseCountries = ['Nigeria', 'Kenya', 'Ghana', 'South Africa', 'United Kingdom'];
  pickupAddress = '';

  // Affidavit flow
  caseType = 'Lost access to all factors';
  caseTypes = ['Lost access to all factors', 'Business signatory dispute', 'Estate/legal representative', 'Regulatory hold appeal'];
  jurisdiction = '';
  affidavitText = '';

  // ─── Review State ────────────────────────────────────────────

  statusLines: StatusLine[] = [
    { icon: 'bi-check-lg', title: 'Submitted', description: 'Evidence package received', done: true, active: false },
    { icon: 'bi-hourglass-split', title: 'Under review', description: 'Automated and human checks running', done: false, active: true },
    { icon: 'bi-info', title: 'Decision', description: 'Approved, rejected, or additional info required', done: false, active: false }
  ];

  caseId = 'IDV-0000';
  caseEta = '2-5 min';
  reviewProgress = 38;
  private reviewTimer: any;

  // ─── Done State ──────────────────────────────────────────────

  doneCopy = 'Your account recovery can continue. Please secure your account with the next actions.';

  doneActions: DoneAction[] = [
    { icon: 'bi-key', title: 'Set new password', description: 'Create a strong password and revoke older login credentials.', btnLabel: 'Start password reset', btnClass: 'btn-outline-paymo' },
    { icon: 'bi-phone', title: 'Re-enroll MFA', description: 'Refresh authenticator, SMS, WhatsApp, or passkey factors.', btnLabel: 'Open MFA setup', btnClass: 'btn-outline-paymo' },
    { icon: 'bi-clock-history', title: 'Review login activity', description: 'Check recent logins and mark unauthorized devices.', btnLabel: 'Review sessions', btnClass: 'btn-outline-paymo' },
    { icon: 'bi-shield-lock', title: 'Set up passkey', description: 'Add phishing-resistant recovery for future access.', btnLabel: 'Create passkey', btnClass: 'btn-primary-paymo' }
  ];

  actionBtnStates: { label: string; disabled: boolean }[] = [];

  // ─── Lifecycle ───────────────────────────────────────────────

  ngOnInit(): void {
    this.actionBtnStates = this.doneActions.map(a => ({ label: a.btnLabel, disabled: false }));
  }

  ngOnDestroy(): void {
    if (this.reviewTimer) clearInterval(this.reviewTimer);
  }

  // ─── Computed ────────────────────────────────────────────────

  get riskBadgeText(): string {
    return this.selectedMethod === 'basic' ? 'Risk: Low' :
      this.selectedMethod === 'document' || this.selectedMethod === 'bank' ? 'Risk: Medium' : 'Risk: High';
  }

  get riskBadgeClass(): string {
    return this.selectedMethod === 'basic' ? 'badge-ok' :
      this.selectedMethod === 'document' || this.selectedMethod === 'bank' ? 'badge-native' : 'badge-warn';
  }

  isStepDone(stepId: string): boolean {
    const idx = this.stepOrder.indexOf(stepId);
    const currentIdx = this.stepOrder.indexOf(this.currentStep);
    return idx < currentIdx;
  }

  isStepActive(stepId: string): boolean {
    return stepId === this.currentStep;
  }

  // ─── TrackBy ─────────────────────────────────────────────────

  trackByIndex: TrackByFunction<any> = (index) => index;
  trackById: TrackByFunction<any> = (index, item) => item.id;

  // ─── Navigation ──────────────────────────────────────────────

  goto(step: string): void {
    this.currentStep = step;
    if (step === 'review') {
      this.startReviewProgress();
    }
  }

  showFlow(): void {
    this.goto('verify');
  }

  backToSelect(): void {
    this.goto('select');
  }

  // ─── Method Selection ────────────────────────────────────────

  selectMethod(id: string): void {
    this.selectedMethod = id;
  }

  simulateRiskRouting(): void {
    const routes = ['basic', 'document', 'video', 'bank', 'enterprise', 'affidavit'];
    this.selectedMethod = routes[Math.floor(Math.random() * routes.length)];
    this.selectedReason = this.reasonOptions[Math.floor(Math.random() * this.reasonOptions.length)];
  }

  // ─── Document Upload ─────────────────────────────────────────

  onUploadZoneClick(): void {
    document.getElementById('docFile')?.click();
  }

  onDocFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.docUploaded = true;
      this.qualityChecks = [
        { label: 'Lighting', status: 'Passed', badgeClass: 'badge-ok' },
        { label: 'Glare detection', status: 'Passed', badgeClass: 'badge-ok' },
        { label: 'Frame quality', status: 'Passed', badgeClass: 'badge-ok' }
      ];
    }
  }

  // ─── Liveness ──────────────────────────────────────────────────

  onLivenessAction(action: 'blink' | 'turn' | 'smile'): void {
    this.liveness[action] = true;
    if (this.liveness.blink && this.liveness.turn && this.liveness.smile) {
      this.faceScore = '97.8% match';
    }
  }

  // ─── Video Slots ─────────────────────────────────────────────

  selectSlot(index: number): void {
    this.slotOptions.forEach((s, i) => s.active = i === index);
    this.selectedSlot = this.slotOptions[index].label;
    this.callConfirmText = `Video call reserved for ${this.selectedSlot}. Calendar invite will be sent after submission.`;
  }

  // ─── Bank Flow ───────────────────────────────────────────────

  sendDeposits(): void {
    if (!this.accountNumber.trim()) {
      document.getElementById('acctNum')?.focus();
      return;
    }
    this.depositsSent = true;
  }

  // ─── Submit Verification ─────────────────────────────────────

  submitVerification(): void {
    if (this.selectedMethod === 'document' && !this.docUploaded) {
      return;
    }
    if (this.selectedMethod === 'bank' && this.depositsSent) {
      if (this.deposit1 !== '0.23' || this.deposit2 !== '0.47') {
        document.getElementById('dep1')?.focus();
        return;
      }
    }
    this.caseId = 'IDV-' + Math.floor(1000 + Math.random() * 9000);
    this.caseEta = this.selectedMethod === 'video' ? 'After video call' :
      this.selectedMethod === 'enterprise' || this.selectedMethod === 'affidavit' ? '3-5 days' : '2-5 min';
    this.goto('review');
  }

  // ─── Review Progress ─────────────────────────────────────────

  startReviewProgress(): void {
    this.reviewProgress = 38;
    if (this.reviewTimer) clearInterval(this.reviewTimer);
    this.reviewTimer = setInterval(() => {
      this.reviewProgress += 12;
      if (this.reviewProgress >= 100) {
        this.reviewProgress = 100;
        clearInterval(this.reviewTimer);
        setTimeout(() => this.goto('done'), 500);
      }
    }, 650);
  }

  // ─── Done Actions ────────────────────────────────────────────

  onActionClick(index: number): void {
    this.actionBtnStates[index] = { label: 'Action queued', disabled: true };
  }
}