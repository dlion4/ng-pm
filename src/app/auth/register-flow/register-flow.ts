import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ===== DATA MODELS =====
export interface AccountType {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  badge?: string;
  badgeClass?: string;
  tags: string[];
}

export interface SocialProvider {
  name: string;
  icon: string;
  loading: boolean;
}

export interface CountryCode {
  flag: string;
  code: string;
}

export interface Country {
  code: string;
  name: string;
}

export interface NextStep {
  icon: string;
  color: string;
  title: string;
  subtitle: string;
}

export interface PinBox {
  value: string;
}

@Component({
  selector: 'app-register-flow',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-flow.html',
  styleUrls: ['./register-flow.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterFlowComponent implements OnInit, OnDestroy {

  // ===== VIEWCHILDREFS =====
  @ViewChild('docFileInput') docFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('bizFileInput') bizFileInput!: ElementRef<HTMLInputElement>;

  // ===== STEP CONFIG =====
  stepConfig: Record<string, string[]> = {
    personal: ['Basic Info', 'Identity', 'Security'],
    business: ['Business Info', 'KYB', 'Security'],
    developer: ['Profile', 'Verification', 'Security']
  };

  // ===== STATE =====
  currentStep = 0; // 0=type, 1=basic, 2=kyc, 3=security, 4=success
  selectedType: string | null = null;
  selectedLangs: string[] = [];
  kycDocDone = false;
  kycSelfieDone = false;
  bizDocDone = false;
  bizDocCount = 0;
  docDragOver = false;
  docFileName = '';
  selfieCapturing = false;
  verifying = false;
  verifyText = 'Verifying your identity…';
  verifyStage = 0;
  private verifyTimer: any;

  // ===== FORM DATA =====
  formData: any = {
    first: '',
    last: '',
    bizname: '',
    email: '',
    cc: '+234',
    phone: '',
    dob: '',
    country: 'NG',
    usecase: 'Neobank',
    biztype: 'Sole Proprietorship',
    vol: 'Under $1K',
    ref: '',
    docType: 'International Passport',
    pwd: '',
    pwd2: ''
  };

  // ===== UI STATE =====
  panelTitle = 'Create your account';
  panelSub = 'Choose the account type that fits you best.';
  showProgress = false;
  showBasicErrors = false;
  emailValid = false;
  emailInvalid = false;
  dobInvalid = false;
  showPwd = false;
  pwdStrength = 0;
  pwdMatch = false;
  pwdMismatch = false;
  passkeyEnabled = false;
  bioEnabled = false;
  agreeTerms = false;
  agreeAge = false;
  agreeMarketing = false;
  creatingAccount = false;
  gotoLoading = false;
  apiKeyCopied = false;
  apiKeyValue = 'pk_sandbox_3xK9mP2qR7vL8nW4hT6yB1cF';

  // ===== DATA ARRAYS (EASY TO REPLACE WITH API) =====
  socialProviders: SocialProvider[] = [
    { name: 'Google', icon: 'bi-google', loading: false },
    { name: 'Apple', icon: 'bi-apple', loading: false },
    { name: 'Microsoft', icon: 'bi-microsoft', loading: false },
    { name: 'LinkedIn', icon: 'bi-linkedin', loading: false }
  ];

  accountTypes: AccountType[] = [
    {
      id: 'personal',
      title: 'Personal Account',
      description: 'Send money, pay bills, shop online, and manage your finances across Africa.',
      icon: 'bi-person',
      iconBg: 'linear-gradient(135deg,rgba(34,211,238,.2),rgba(96,165,250,.1))',
      iconBorder: '1px solid rgba(34,211,238,.3)',
      iconColor: '#a5f3fc',
      tags: ['Individuals', 'Freelancers']
    },
    {
      id: 'business',
      title: 'Business Account',
      description: 'Accept payments, pay suppliers, manage payroll, and access working capital.',
      icon: 'bi-shop',
      iconBg: 'linear-gradient(135deg,rgba(167,139,250,.2),rgba(96,165,250,.1))',
      iconBorder: '1px solid rgba(167,139,250,.3)',
      iconColor: '#c4b5fd',
      badge: 'Free setup',
      badgeClass: 'badge-ok',
      tags: ['SMEs', 'E-commerce']
    },
    {
      id: 'developer',
      title: 'Developer Account',
      description: 'Build financial products with our APIs. Sandbox, docs, and community.',
      icon: 'bi-code-slash',
      iconBg: 'linear-gradient(135deg,rgba(251,191,36,.2),rgba(96,165,250,.1))',
      iconBorder: '1px solid rgba(251,191,36,.3)',
      iconColor: '#fcd34d',
      badge: 'Free API credits',
      badgeClass: 'badge-gold',
      tags: ['Fintech founders', 'Neobank builders']
    }
  ];

  countryCodes: CountryCode[] = [
    { flag: '🇳🇬', code: '+234' },
    { flag: '🇰🇪', code: '+254' },
    { flag: '🇬🇭', code: '+233' },
    { flag: '🇿🇦', code: '+27' },
    { flag: '🇺🇬', code: '+256' },
    { flag: '🇬🇧', code: '+44' },
    { flag: '🇺🇸', code: '+1' }
  ];

  countries: Country[] = [
    { code: 'NG', name: 'Nigeria' },
    { code: 'KE', name: 'Kenya' },
    { code: 'GH', name: 'Ghana' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'UG', name: 'Uganda' },
    { code: 'TZ', name: 'Tanzania' },
    { code: 'RW', name: 'Rwanda' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' }
  ];

  useCases: string[] = ['Neobank', 'E-commerce', 'Remittance', 'Lending', 'Treasury', 'Other'];
  devLangs: string[] = ['Node.js', 'Python', 'Go', 'PHP', 'Flutter', 'Java'];
  bizTypes: string[] = ['Sole Proprietorship', 'Partnership', 'LLC', 'PLC', 'NGO', 'Cooperative'];
  volumes: string[] = ['Under $1K', '$1K–$10K', '$10K–$100K', '$100K–$1M', '$1M+'];
  docTypes: string[] = ['International Passport', 'National ID Card', "Driver's License", "Voter's Card"];

  // ===== PIN =====
  pinBoxes: PinBox[] = [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }];

  // ===== STRENGTH METER =====
  strengthSegments = [0, 1, 2, 3];
  strengthColors = ['#ef4444', '#fbbf24', '#60a5fa', '#22c55e'];
  strengthLabels = ['Weak', 'Fair', 'Strong', 'Very Strong'];

  // ===== NEXT STEPS =====
  nextSteps: NextStep[] = [];

  // ===== STEP LABELS =====
  stepLabels: string[] = [];

  // ===== YEAR =====
  currentYear = new Date().getFullYear();

  // ===== LIFECYCLE =====
  ngOnInit(): void {
    // Initialize
  }

  ngOnDestroy(): void {
    this.clearVerifyTimer();
  }

  // ===== TYPE SELECTION =====
  selectType(typeId: string): void {
    this.selectedType = typeId;
  }

  continueFromType(): void {
    if (!this.selectedType) return;
    this.setupForType(this.selectedType);
    this.goStep(1);
  }

  // ===== SOCIAL SIGN-IN =====
  socialSignIn(providerName: string): void {
    const provider = this.socialProviders.find(p => p.name === providerName);
    if (!provider) return;
    provider.loading = true;
    setTimeout(() => {
      if (!this.selectedType) {
        this.selectedType = 'personal';
      }
      this.setupForType(this.selectedType);
      // Prefill demo data
      this.formData.first = 'Amara';
      this.formData.last = 'Okafor';
      this.formData.email = 'amara.okafor@' + providerName.toLowerCase() + '.com';
      this.validateEmail();
      provider.loading = false;
      this.goStep(1);
    }, 900);
  }

  // ===== SETUP FOR TYPE =====
  setupForType(type: string): void {
    const titles: Record<string, string> = {
      personal: 'Create your personal account',
      business: 'Create your business account',
      developer: 'Create your developer account'
    };
    const subs: Record<string, string> = {
      personal: 'Tell us a bit about yourself.',
      business: 'Set up your business profile.',
      developer: 'Set up your developer profile.'
    };

    // 👑 FIX: Use bracket notation ['personal'] instead of dot notation
    this.panelTitle = titles[type] || titles['personal'];
    this.panelSub = subs[type] || subs['personal'];
    this.stepLabels = this.stepConfig[type] || this.stepConfig['personal'];
  }

  // ===== STEP NAVIGATION =====
  goStep(n: number): void {
    this.currentStep = n;
    this.showProgress = (n >= 1 && n <= 3);
    // Update titles for steps
    if (n === 2) {
      this.panelTitle = 'Verify your identity';
      this.panelSub = 'Required for secure financial services.';
    }
    if (n === 3) {
      this.panelTitle = 'Secure your account';
      this.panelSub = 'Set up how you\'ll sign in.';
    }
    if (n === 4) {
      this.panelTitle = '';
      this.panelSub = '';
    }
    // Scroll to top
    const panel = document.querySelector('.auth-panel');
    if (panel) panel.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack(): void {
    if (this.currentStep > 0) {
      this.goStep(this.currentStep - 1);
    }
  }

  // ===== DEV LANG CHIPS =====
  toggleLang(lang: string): void {
    if (this.selectedLangs.includes(lang)) {
      this.selectedLangs = this.selectedLangs.filter(l => l !== lang);
    } else {
      this.selectedLangs.push(lang);
    }
  }

  // ===== BASIC FORM =====
  validateEmail(): void {
    const email = (this.formData.email || '').trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      this.emailValid = false;
      this.emailInvalid = false;
    } else if (emailRe.test(email)) {
      this.emailValid = true;
      this.emailInvalid = false;
    } else {
      this.emailValid = false;
      this.emailInvalid = true;
    }
  }

  get canSubmitBasic(): boolean {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let ok = true;
    if (!emailRe.test((this.formData.email || '').trim())) ok = false;
    if (!(this.formData.first || '').trim() || !(this.formData.last || '').trim()) ok = false;
    if (!(this.formData.phone || '').trim()) ok = false;
    if (this.selectedType !== 'developer' && this.formData.dob) {
      const age = (Date.now() - new Date(this.formData.dob).getTime()) / (365.25 * 24 * 3600 * 1000);
      if (age < 18) {
        this.dobInvalid = true;
        ok = false;
      } else {
        this.dobInvalid = false;
      }
    }
    return ok;
  }

  submitBasicForm(): void {
    this.showBasicErrors = true;
    if (!this.canSubmitBasic) return;
    this.goStep(2);
  }

  // ===== KYC =====
  get kycDocLabel(): string {
    return this.selectedType === 'business' ? 'Representative ID type' : 'Document type';
  }

  onDocDragOver(e: DragEvent): void {
    e.preventDefault();
    this.docDragOver = true;
  }

  onDocDrop(e: DragEvent): void {
    e.preventDefault();
    this.docDragOver = false;
    if (e.dataTransfer?.files[0]) {
      this.handleDocFile(e.dataTransfer.files[0]);
    }
  }

  onDocFileChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.handleDocFile(input.files[0]);
    }
  }

  handleDocFile(file: File): void {
    this.docFileName = file.name;
    this.kycDocDone = true;
  }

  onBizFileChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) {
      this.bizDocCount = input.files.length;
      this.bizDocDone = true;
    }
  }

  captureSelfie(): void {
    if (this.kycSelfieDone) return;
    this.selfieCapturing = true;
    setTimeout(() => {
      this.selfieCapturing = false;
      this.kycSelfieDone = true;
    }, 1400);
  }

  get canVerifyKyc(): boolean {
    return this.kycDocDone && this.kycSelfieDone;
  }

  verifyKyc(): void {
    if (!this.canVerifyKyc) return;
    this.verifying = true;
    this.verifyStage = 0;
    const stages = ['Analyzing document…', 'Matching selfie to ID…', 'Running compliance checks…', 'Verified ✓'];
    this.verifyText = stages[0];
    this.clearVerifyTimer();
    this.verifyTimer = setInterval(() => {
      this.verifyStage++;
      if (this.verifyStage < stages.length) {
        this.verifyText = stages[this.verifyStage];
      }
      if (this.verifyStage >= stages.length) {
        this.clearVerifyTimer();
        setTimeout(() => {
          this.verifying = false;
          this.goStep(3);
          this.checkSecurity();
        }, 600);
      }
    }, 800);
  }

  private clearVerifyTimer(): void {
    if (this.verifyTimer) {
      clearInterval(this.verifyTimer);
      this.verifyTimer = null;
    }
  }

  // ===== SECURITY =====
  onPwdInput(): void {
    this.pwdStrength = this.calcPwdStrength(this.formData.pwd || '');
    this.checkSecurity();
  }

  onPwd2Input(): void {
    const match = this.formData.pwd2 && this.formData.pwd === this.formData.pwd2;
    this.pwdMatch = match;
    this.pwdMismatch = !!(this.formData.pwd2 && !match);
    this.checkSecurity();
  }

  calcPwdStrength(p: string): number {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  }

  onPinInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '');
    this.pinBoxes[index].value = val;
    if (val && index < this.pinBoxes.length - 1) {
      const nextInput = document.querySelectorAll('.pin-box')[index + 1] as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
    this.checkSecurity();
  }

  onPinKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.pinBoxes[index].value && index > 0) {
      const prevInput = document.querySelectorAll('.pin-box')[index - 1] as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  }

  getPin(): string {
    return this.pinBoxes.map(b => b.value).join('');
  }

  checkSecurity(): void {
    // Called on various inputs - triggers change detection
  }

  get canCreateAccount(): boolean {
    const strong = this.pwdStrength >= 2;
    const match = !!(this.formData.pwd && this.formData.pwd === this.formData.pwd2);
    const pinOk = this.getPin().length === 6;
    const terms = this.agreeTerms && this.agreeAge;
    return strong && match && pinOk && terms;
  }

  createAccount(): void {
    if (!this.canCreateAccount) return;
    this.creatingAccount = true;
    setTimeout(() => {
      this.buildSuccess();
      this.creatingAccount = false;
      this.goStep(4);
      this.fireConfetti();
    }, 1500);
  }

  // ===== SUCCESS =====
  buildSuccess(): void {
    const nextStepsMap: Record<string, NextStep[]> = {
      personal: [
        { icon: 'bi-wallet2', color: '#a5f3fc', title: 'Add money to your wallet', subtitle: 'Fund via bank, card, or mobile money' },
        { icon: 'bi-receipt', color: '#c4b5fd', title: 'Set up your first bill payment', subtitle: 'Electricity, airtime, subscriptions' },
        { icon: 'bi-people', color: '#fcd34d', title: 'Invite friends and earn', subtitle: 'Get rewards for every referral' }
      ],
      business: [
        { icon: 'bi-building-check', color: '#a5f3fc', title: 'Complete your business profile', subtitle: 'Unlock higher limits' },
        { icon: 'bi-person-plus', color: '#c4b5fd', title: 'Add your first team member', subtitle: 'Assign roles & permissions' },
        { icon: 'bi-link-45deg', color: '#fcd34d', title: 'Create a payment link', subtitle: 'Start accepting payments instantly' }
      ],
      developer: [
        { icon: 'bi-book', color: '#a5f3fc', title: 'Explore the API docs', subtitle: 'REST, GraphQL & 10+ SDKs' },
        { icon: 'bi-discord', color: '#c4b5fd', title: 'Join the Discord community', subtitle: '2,400+ developers' },
        { icon: 'bi-rocket', color: '#fcd34d', title: 'Build your first integration', subtitle: 'Make an API call in 30 seconds' }
      ]
    };
    this.nextSteps = nextStepsMap[this.selectedType || 'personal'] || nextStepsMap['personal'];
  }

  copyApiKey(): void {
    navigator.clipboard?.writeText(this.apiKeyValue);
    this.apiKeyCopied = true;
    setTimeout(() => this.apiKeyCopied = false, 1500);
  }

  goToDashboard(): void {
    this.gotoLoading = true;
    setTimeout(() => {
      this.gotoLoading = false;
      // TODO: navigate to /auth/account-type
      console.log('Redirecting to /auth/account-type');
    }, 800);
  }

  // ===== CONFETTI =====
  fireConfetti(): void {
    const cols = ['#22d3ee', '#60a5fa', '#a78bfa', '#fbbf24', '#22c55e'];
    for (let i = 0; i < 60; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = cols[Math.floor(Math.random() * cols.length)];
      c.style.animationDelay = Math.random() * 0.6 + 's';
      c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 3500);
    }
  }
}