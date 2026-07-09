import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type RecoveryMethod = 'email' | 'sms' | 'questions' | 'magic';

interface SecurityQuestion {
  label: string;
  answer: string;
}

interface PasswordRequirement {
  label: string;
  met: boolean;
}

@Component({
  selector: 'app-account-recovery',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './recovery.html',
  styleUrls: ['./recovery.css'],
  encapsulation: ViewEncapsulation.None
})
export class AccountRecoveryComponent implements OnInit, OnDestroy, AfterViewInit {
  // ─── State ─────────────────────────────────────────────
  currentStep = 1;
  selectedMethod: RecoveryMethod = 'email';
  resendSeconds = 60;
  private resendInterval: any = null;
  isResetting = false;
  showSuccess = false;
  showStepIndicator = true;

  // ─── Form Models ─────────────────────────────────────
  emailInput = '';
  phoneInput = '';
  identifierInput = '';
  magicEmailInput = '';
  otpValues: string[] = ['', '', '', '', '', ''];
  newPassword = '';
  confirmPassword = '';
  logoutDevices = true;

  // ─── Security Questions ──────────────────────────────
  securityQuestions: SecurityQuestion[] = [
    { label: "What is your mother's maiden name?", answer: '' },
    { label: "What was the name of your first pet?", answer: '' },
    { label: "What city were you born in?", answer: '' }
  ];

  // ─── Password Requirements ───────────────────────────
  passwordRequirements: PasswordRequirement[] = [
    { label: 'At least 8 characters', met: false },
    { label: 'One uppercase letter', met: false },
    { label: 'One number', met: false },
    { label: 'One special character', met: false }
  ];

  strengthPercent = 0;
  strengthColor = 'var(--danger)';
  resetBtnDisabled = true;

  // ─── Password Visibility ─────────────────────────────
  showNewPassword = false;
  showConfirmPassword = false;

  // ─── Shake State ─────────────────────────────────────
  shakeStep1 = false;
  shakeOtp = false;
  shakeQuestions = false;

  // ─── Resend Button State ─────────────────────────────
  resendBtnText = '<i class="bi bi-arrow-clockwise me-1"></i> Resend Code';
  showResendBtn = false;
  showTimer = true;

  // ─── OTP Refs ────────────────────────────────────────
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  // ─── Recovery Methods Config ─────────────────────────
  readonly recoveryMethods: { key: RecoveryMethod; icon: string; label: string }[] = [
    { key: 'email', icon: 'bi-envelope', label: 'Email' },
    { key: 'sms', icon: 'bi-phone', label: 'SMS' },
    { key: 'questions', icon: 'bi-shield-question', label: 'Security Qs' },
    { key: 'magic', icon: 'bi-link-45deg', label: 'Magic Link' }
  ];

  // ─── Left Panel Features ─────────────────────────────
  readonly leftPanelFeatures = [
    { icon: 'bi-shield-check', iconColor: '#a5f3fc', bgColor: 'rgba(34,211,238,0.15)', title: 'End-to-End Encrypted', subtitle: '256-bit encryption' },
    { icon: 'bi-eye-slash', iconColor: '#c4b5fd', bgColor: 'rgba(167,139,250,0.15)', title: 'Privacy Protected', subtitle: 'Zero-knowledge architecture' },
    { icon: 'bi-clock-history', iconColor: '#86efac', bgColor: 'rgba(34,197,94,0.15)', title: 'Fast Recovery', subtitle: 'Under 2 minutes' }
  ];

  // ─── Lifecycle ───────────────────────────────────────
  ngOnInit(): void {
    this.startResendTimer();
  }

  ngAfterViewInit(): void {
    this.setupOtpListeners();
  }

  ngOnDestroy(): void {
    this.clearResendTimer();
  }

  // ─── Step Navigation ─────────────────────────────────
  goToStep(step: number): void {
    this.currentStep = step;
    if (step === 2) {
      this.setupVerification();
    }
  }

  getStepDotClass(step: number): string {
    if (step < this.currentStep) return 'completed';
    if (step === this.currentStep) return 'active';
    return '';
  }

  // ─── Method Selection ────────────────────────────────
  selectMethod(method: RecoveryMethod): void {
    this.selectedMethod = method;
  }

  isMethodActive(method: RecoveryMethod): boolean {
    return this.selectedMethod === method;
  }

  // ─── Continue (Step 1 → Step 2) ──────────────────────
  handleContinue(): void {
    let isValid = false;
    switch (this.selectedMethod) {
      case 'email':
        isValid = !!this.emailInput.trim();
        break;
      case 'sms':
        isValid = !!this.phoneInput.trim();
        break;
      case 'questions':
        isValid = !!this.identifierInput.trim();
        break;
      case 'magic':
        isValid = !!this.magicEmailInput.trim();
        break;
    }

    if (isValid) {
      this.goToStep(2);
    } else {
      this.shakeStep1 = true;
      setTimeout(() => this.shakeStep1 = false, 400);
    }
  }

  // ─── Setup Verification (Step 2) ─────────────────────
  setupVerification(): void {
    this.otpValues = ['', '', '', '', '', ''];
    this.showResendBtn = false;
    this.showTimer = true;
    this.resendSeconds = 60;
    this.clearResendTimer();

    if (this.selectedMethod === 'email' || this.selectedMethod === 'sms') {
      this.startResendTimer();
    }

    if (this.selectedMethod === 'magic') {
      setTimeout(() => this.goToStep(3), 3000);
    }
  }

  getVerifyIcon(): string {
    switch (this.selectedMethod) {
      case 'email': return 'bi-envelope-check';
      case 'sms': return 'bi-phone';
      case 'questions': return 'bi-shield-question';
      case 'magic': return 'bi-envelope-check';
      default: return 'bi-envelope-check';
    }
  }

  getVerifySubtitle(): string {
    switch (this.selectedMethod) {
      case 'email': return 'Enter the 6-digit code sent to your email';
      case 'sms': return 'Enter the 6-digit code sent to your phone';
      case 'questions': return 'Answer your security questions to verify identity';
      case 'magic': return 'Check your email for a secure recovery link';
      default: return '';
    }
  }

  // ─── OTP Handling ────────────────────────────────────
  private setupOtpListeners(): void {
    // Handled via Angular template bindings and (input)/(keydown) events
  }

  onOtpInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (value.length === 1 && index < 5) {
      const next = this.otpInputs.toArray()[index + 1];
      if (next) next.nativeElement.focus();
    }
  }

  onOtpKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.otpValues[index] && index > 0) {
      const prev = this.otpInputs.toArray()[index - 1];
      if (prev) prev.nativeElement.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text').slice(0, 6) || '';
    pasteData.split('').forEach((char, i) => {
      if (i < 6) this.otpValues[i] = char;
    });
    if (pasteData.length === 6) {
      const last = this.otpInputs.toArray()[5];
      if (last) last.nativeElement.focus();
    }
  }

  // ─── Resend Timer ────────────────────────────────────
  startResendTimer(): void {
    this.resendSeconds = 60;
    this.showResendBtn = false;
    this.showTimer = true;
    this.clearResendTimer();
    this.resendInterval = setInterval(() => {
      this.resendSeconds--;
      if (this.resendSeconds <= 0) {
        this.clearResendTimer();
        this.showTimer = false;
        this.showResendBtn = true;
      }
    }, 1000);
  }

  clearResendTimer(): void {
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
      this.resendInterval = null;
    }
  }

  handleResend(): void {
    this.startResendTimer();
    this.resendBtnText = '<i class="bi bi-check-circle me-1"></i> Code Resent!';
    setTimeout(() => {
      this.resendBtnText = '<i class="bi bi-arrow-clockwise me-1"></i> Resend Code';
    }, 2000);
  }

  // ─── Verify (Step 2 → Step 3) ────────────────────────
  handleVerify(): void {
    let isValid = false;

    if (this.selectedMethod === 'questions') {
      isValid = this.securityQuestions.every(q => q.answer.trim().length > 0);
      if (!isValid) {
        this.shakeQuestions = true;
        setTimeout(() => this.shakeQuestions = false, 400);
      }
    } else {
      const otp = this.otpValues.join('');
      isValid = otp.length === 6;
      if (!isValid) {
        this.shakeOtp = true;
        setTimeout(() => this.shakeOtp = false, 400);
      }
    }

    if (isValid) {
      this.goToStep(3);
    }
  }

  // ─── Password Strength ───────────────────────────────
  onPasswordInput(): void {
    const password = this.newPassword;
    let strength = 0;

    this.passwordRequirements[0].met = password.length >= 8;
    this.passwordRequirements[1].met = /[A-Z]/.test(password);
    this.passwordRequirements[2].met = /[0-9]/.test(password);
    this.passwordRequirements[3].met = /[^A-Za-z0-9]/.test(password);

    strength = this.passwordRequirements.filter(r => r.met).length;
    this.strengthPercent = (strength / 4) * 100;

    if (strength <= 1) this.strengthColor = 'var(--danger)';
    else if (strength <= 2) this.strengthColor = 'var(--accent-4)';
    else if (strength <= 3) this.strengthColor = 'var(--accent)';
    else this.strengthColor = 'var(--success)';

    this.checkPasswordMatch();
  }

  onConfirmPasswordInput(): void {
    this.checkPasswordMatch();
  }

  checkPasswordMatch(): void {
    const hasMinStrength = this.passwordRequirements.every(r => r.met);
    const match = this.newPassword === this.confirmPassword && this.confirmPassword.length > 0;
    this.resetBtnDisabled = !(hasMinStrength && match);
  }

  // ─── Toggle Password Visibility ──────────────────────
  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // ─── Reset Password ──────────────────────────────────
  handleReset(): void {
    this.isResetting = true;
    // Simulate API call
    setTimeout(() => {
      this.isResetting = false;
      this.showSuccess = true;
      this.showStepIndicator = false;
    }, 2000);
  }

  // ─── Keyboard Support ────────────────────────────────
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if (this.currentStep === 1) {
        this.handleContinue();
      } else if (this.currentStep === 2 && this.selectedMethod !== 'magic') {
        this.handleVerify();
      }
    }
  }
}