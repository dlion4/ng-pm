import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { RouterLink } from '@angular/router';
// import { RouterLink } from '@angular/router';


type MfaMethod = 'totp' | 'sms' | 'push' | 'passkey' | 'hardware' | 'recovery';

interface MfaMethodConfig {
  key: MfaMethod;
  icon: string;
  label: string;
  description: string;
  lastUsed?: boolean;
}

interface RiskInfo {
  icon: string;
  iconColor: string;
  text: string;
}

interface SecurityItem {
  icon: string;
  iconColor: string;
  label: string;
}

@Component({
  selector: 'app-mfa-challenge',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mfa-challenge.html',
  styleUrls: ['./mfa-challenge.css'],
  encapsulation: ViewEncapsulation.None
})
export class MfaChallengeComponent implements OnInit, OnDestroy, AfterViewInit {
  // ─── State ─────────────────────────────────────────────
  selectedMethod: MfaMethod = 'totp';
  attempts = 0;
  sessionSeconds = 300;
  totpSeconds = 30;
  smsSent = false;
  smsSeconds = 0;
  pushStatus = 'idle';
  showSuccess = false;
  successFactor = 'Authenticator app';

  // ─── OTP ───────────────────────────────────────────────
  otpValues: string[] = ['', '', '', '', '', ''];
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  // ─── Recovery Code ────────────────────────────────────
  recoveryCode = '';

  // ─── Passkey ─────────────────────────────────────────
  passkeySupported = false;
  passkeyLoading = false;

  // ─── Hardware Key ────────────────────────────────────
  hardwareLoading = false;

  // ─── Shake ────────────────────────────────────────────
  shakePanel = false;

  // ─── Error ────────────────────────────────────────────
  errorMessage = '';

  // ─── Timers ───────────────────────────────────────────
  private sessionInterval: any = null;
  private totpInterval: any = null;
  private smsInterval: any = null;

  // ─── Browser Info ────────────────────────────────────
  browserLabel = 'Browser on this device';

  // ─── Method Configs ──────────────────────────────────
  readonly mfaMethods: MfaMethodConfig[] = [
    { key: 'totp', icon: 'bi-shield-lock', label: 'Authenticator app', description: 'Google Authenticator, Authy, Microsoft', lastUsed: true },
    { key: 'sms', icon: 'bi-phone', label: 'SMS / WhatsApp', description: 'Send code to +234 •••••1234' },
    { key: 'push', icon: 'bi-bell', label: 'Push approval', description: 'Approve from trusted phone' },
    { key: 'passkey', icon: 'bi-fingerprint', label: 'Passkey / biometric', description: 'Face ID, Touch ID, Windows Hello' },
    { key: 'hardware', icon: 'bi-usb-symbol', label: 'Security key', description: 'YubiKey or FIDO2 hardware key' },
    { key: 'recovery', icon: 'bi-key', label: 'Recovery code', description: 'Use a saved backup code' }
  ];

  readonly factorLabels: Record<MfaMethod, string> = {
    totp: 'Authenticator app',
    sms: 'SMS / WhatsApp',
    push: 'Push approval',
    passkey: 'Passkey / biometric',
    hardware: 'Security key',
    recovery: 'Recovery code'
  };

  // ─── Risk Info ───────────────────────────────────────
  readonly riskInfo: RiskInfo[] = [
    { icon: 'bi-browser-chrome', iconColor: 'var(--accent)', text: 'Chrome on Windows' },
    { icon: 'bi-geo-alt', iconColor: 'var(--accent-2)', text: 'Lagos, Nigeria' },
    { icon: 'bi-router', iconColor: 'var(--accent-3)', text: 'IP reputation: trusted' },
    { icon: 'bi-fingerprint', iconColor: 'var(--accent-4)', text: 'Device fingerprint: known' }
  ];

  // ─── Security Strip ──────────────────────────────────
  readonly securityItems: SecurityItem[] = [
    { icon: 'bi-lock-fill', iconColor: 'var(--accent)', label: 'TLS 1.3' },
    { icon: 'bi-shield-check', iconColor: '#86efac', label: 'SOC 2' },
    { icon: 'bi-eye-slash', iconColor: 'var(--accent-3)', label: 'No code logs' },
    { icon: 'bi-clock-history', iconColor: 'var(--accent-4)', label: '30s TOTP' }
  ];

  // ─── SMS Channel ─────────────────────────────────────
  smsChannel = 'SMS';

  // ─── Lifecycle ───────────────────────────────────────
  ngOnInit(): void {
    this.detectBrowser();
    this.passkeySupported = !!(window as any).PublicKeyCredential;
    this.startSessionTimer();
    this.startTotpTimer();
  }

  ngAfterViewInit(): void {
    if (this.selectedMethod === 'totp' || (this.selectedMethod === 'sms' && this.smsSent)) {
      setTimeout(() => this.focusFirstOtp(), 100);
    }
  }

  ngOnDestroy(): void {
    this.clearAllTimers();
  }

  // ─── Browser Detection ──────────────────────────────
  private detectBrowser(): void {
    const ua = navigator.userAgent;
    const browser = ua.includes('Edg') ? 'Edge' : ua.includes('Chrome') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : ua.includes('Safari') ? 'Safari' : 'Browser';
    const os = ua.includes('Windows') ? 'Windows' : ua.includes('Mac') ? 'macOS' : ua.includes('Android') ? 'Android' : ua.includes('iPhone') ? 'iOS' : 'this device';
    this.browserLabel = `${browser} on ${os}`;
  }

  // ─── Timers ──────────────────────────────────────────
  private startSessionTimer(): void {
    this.sessionInterval = setInterval(() => {
      this.sessionSeconds--;
      if (this.sessionSeconds <= 0) this.sessionSeconds = 0;
    }, 1000);
  }

  private startTotpTimer(): void {
    this.totpInterval = setInterval(() => {
      this.totpSeconds--;
      if (this.totpSeconds <= 0) this.totpSeconds = 30;
    }, 1000);
  }

  private startSmsTimer(): void {
    this.smsSeconds = 60;
    this.smsInterval = setInterval(() => {
      this.smsSeconds--;
      if (this.smsSeconds <= 0) {
        this.clearSmsTimer();
      }
    }, 1000);
  }

  private clearSmsTimer(): void {
    if (this.smsInterval) {
      clearInterval(this.smsInterval);
      this.smsInterval = null;
    }
  }

  private clearAllTimers(): void {
    if (this.sessionInterval) clearInterval(this.sessionInterval);
    if (this.totpInterval) clearInterval(this.totpInterval);
    this.clearSmsTimer();
  }

  get sessionTimerDisplay(): string {
    const m = Math.floor(this.sessionSeconds / 60);
    const s = this.sessionSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  get totpProgress(): number {
    return (this.totpSeconds / 30) * 100;
  }

  get totpTimeDisplay(): string {
    return String(this.totpSeconds).padStart(2, '0');
  }

  // ─── Method Selection ────────────────────────────────
  selectMethod(method: MfaMethod): void {
    this.selectedMethod = method;
    this.errorMessage = '';
    this.otpValues = ['', '', '', '', '', ''];
    this.attempts = 0;
    if (method === 'totp' || (method === 'sms' && this.smsSent)) {
      setTimeout(() => this.focusFirstOtp(), 100);
    }
  }

  isMethodActive(method: MfaMethod): boolean {
    return this.selectedMethod === method;
  }

  // ─── OTP Handling ────────────────────────────────────
  onOtpInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\\D/g, '').slice(0, 1);
    this.otpValues[index] = input.value;
    if (input.value && index < 5) {
      const next = this.otpInputs.toArray()[index + 1];
      if (next) next.nativeElement.focus();
    }
  }

  onOtpKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.otpValues[index] && index > 0) {
      const prev = this.otpInputs.toArray()[index - 1];
      if (prev) prev.nativeElement.focus();
    }
    if (event.key === 'Enter') {
      this.verifyCurrent();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const data = event.clipboardData?.getData('text').replace(/\\D/g, '').slice(0, 6) || '';
    data.split('').forEach((n, i) => { if (i < 6) this.otpValues[i] = n; });
    const last = this.otpInputs.toArray()[Math.min(data.length, 6) - 1];
    if (last) last.nativeElement.focus();
  }

  focusFirstOtp(): void {
    const first = this.otpInputs.first;
    if (first) first.nativeElement.focus();
  }

  get isOtpComplete(): boolean {
    return this.otpValues.join('').length === 6;
  }

  // ─── SMS ─────────────────────────────────────────────
  sendSmsCode(): void {
    this.smsSent = true;
    this.startSmsTimer();
    setTimeout(() => this.focusFirstOtp(), 100);
  }

  selectSmsChannel(channel: string): void {
    this.smsChannel = channel;
  }

  get smsSendBtnText(): string {
    return this.smsSent ? 'Resend code' : 'Send code';
  }

  get smsSendBtnIcon(): string {
    return this.smsSent ? 'bi-arrow-clockwise' : 'bi-send';
  }

  get canSendSms(): boolean {
    return this.smsSeconds <= 0;
  }

  // ─── Push ────────────────────────────────────────────
  sendPushRequest(): void {
    this.pushStatus = 'sent';
    setTimeout(() => {
      if (this.pushStatus === 'sent') this.pushStatus = 'waiting';
    }, 1800);
  }

  approvePush(): void {
    this.completeSuccess();
  }

  denyPush(): void {
    this.showError('Approval denied on trusted device.');
  }

  get pushStatusText(): string {
    switch (this.pushStatus) {
      case 'idle': return 'Waiting to send approval request.';
      case 'sent': return 'Waiting for approval...';
      case 'waiting': return 'Request visible on trusted phone. Use the phone preview to approve.';
      default: return '';
    }
  }

  get pushStatusColor(): string {
    switch (this.pushStatus) {
      case 'sent': return 'var(--accent)';
      case 'waiting': return '#86efac';
      default: return 'var(--ink-3)';
    }
  }

  // ─── Passkey ─────────────────────────────────────────
  verifyPasskey(): void {
    this.passkeyLoading = true;
    setTimeout(() => {
      this.passkeyLoading = false;
      this.completeSuccess();
    }, 2200);
  }

  // ─── Hardware Key ────────────────────────────────────
  verifyHardwareKey(): void {
    this.hardwareLoading = true;
    setTimeout(() => {
      this.hardwareLoading = false;
      this.completeSuccess();
    }, 2600);
  }

  // ─── Recovery Code ───────────────────────────────────
  onRecoveryInput(): void {
    this.recoveryCode = this.recoveryCode.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  }

  get isRecoveryValid(): boolean {
    return this.recoveryCode.length >= 8;
  }

  downloadTemplate(): void {
    const codes = ['PAYMO-8F4A2C', 'PAYMO-71B9E0', 'PAYMO-3D6F90', 'PAYMO-A1C778', 'PAYMO-52EE14'];
    const blob = new Blob([`Paymo BAAS recovery code template\\nGenerated locally for demo\\n\\n${codes.join('\\n')}\\n\\nStore these codes in a secure place.`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paymo-recovery-codes-template.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // ─── Verification ──────────────────────────────────────
  verifyCurrent(): void {
    if (this.selectedMethod === 'totp') {
      if (this.isOtpComplete) return this.completeSuccess();
      return this.showError('Enter the full 6-digit authenticator code.');
    }
    if (this.selectedMethod === 'sms') {
      if (this.isOtpComplete) return this.completeSuccess();
      return this.showError('Enter the full 6-digit SMS or WhatsApp code.');
    }
    if (this.selectedMethod === 'recovery') {
      if (this.isRecoveryValid) return this.completeSuccess();
      return this.showError('Enter a valid recovery code.');
    }
  }

  showError(message: string): void {
    this.attempts++;
    this.shakePanel = true;
    this.errorMessage = `${message} Attempt ${this.attempts} of 5.`;
    setTimeout(() => this.shakePanel = false, 400);
  }

  completeSuccess(): void {
    this.showSuccess = true;
    this.successFactor = this.factorLabels[this.selectedMethod];
  }

  // ─── Help Modal ──────────────────────────────────────
  openSupportRecovery(): void {
    this.selectMethod('recovery');
  }

  // ─── Actions ───────────────────────────────────────────
  clearRememberedAccount(): void {
    localStorage.removeItem('paymo_remembered_user');
  }

  continueToDashboard(): void {
    // Route to account type
  }
}