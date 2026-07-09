import { Component, OnInit, OnDestroy, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ===== DATA MODELS =====
export interface SocialProvider {
  id: string;
  label: string;
  icon: string;
}

export interface SecurityItem {
  icon: string;
  label: string;
}

export type AuthTab = 'passkey' | 'password' | 'pin' | 'magic' | 'social';

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-hub.html',
  styleUrls: ['./login-hub.css'],
  encapsulation: ViewEncapsulation.None
})
export class AuthSigninComponent implements OnInit, OnDestroy {

  // ===== CONFIG / THEME (injectable or configurable) =====
  welcomeTitle = 'Welcome back';
  welcomeSub = 'Sign in to your Paymo account securely.';
  showContextBanner = false;
  contextBannerText = 'Please sign in to access your Treasury Dashboard.';

  // ===== DEVICE =====
  deviceText = 'Detecting your device…';

  // ===== TABS =====
  activeTab: AuthTab = 'passkey';

  // ===== PASSKEY =====
  passkeyScanning = false;
  passkeyUnsupported = false;

  // ===== PASSWORD =====
  pwEmail = '';
  pwPass = '';
  showPassword = false;
  rememberMe = false;
  pwLoading = false;
  pwEmailValid = false;
  pwEmailInvalid = false;
  pwEmailHintText = '';

  // ===== PIN =====
  pinValue = '';
  pinError = false;
  pinDots = [0, 1, 2, 3, 4, 5];
  pinKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'bio', '0', 'del'];

  // ===== MAGIC LINK =====
  magicEmail = '';
  magicSent = false;
  magicEmailValid = false;
  magicEmailInvalid = false;
  magicHintText = '';
  magicResendDisabled = true;
  magicCountdown = 60;
  private magicTimer: any;

  // ===== SOCIAL =====
  socialProviders: SocialProvider[] = [
    { id: 'google', label: 'Continue with Google', icon: 'bi-google' },
    { id: 'microsoft', label: 'Continue with Microsoft', icon: 'bi-microsoft' },
    { id: 'apple', label: 'Continue with Apple', icon: 'bi-apple' },
    { id: 'github', label: 'Continue with GitHub', icon: 'bi-github' }
  ];

  // ===== SECURITY STRIP =====
  securityItems: SecurityItem[] = [
    { icon: 'bi-shield-check', label: 'End-to-end encrypted' },
    { icon: 'bi-lock', label: '256-bit TLS' },
    { icon: 'bi-fingerprint', label: 'Biometric ready' },
    { icon: 'bi-shield-shaded', label: 'Fraud protected' }
  ];

  // ===== TOAST =====
  toastVisible = false;
  toastMessage = '';
  toastIcon = 'bi-info-circle';
  toastBg = 'rgba(34,211,238,.12)';
  toastBorder = '1px solid rgba(34,211,238,.3)';
  toastColor = '#a5f3fc';
  private toastTimer: any;

  // ===== YEAR =====
  currentYear = new Date().getFullYear();

  // ===== LIFECYCLE =====
  ngOnInit(): void {
    this.detectDevice();
    this.checkPasskeySupport();
    // Example: read query params for contextual banner
    // this.showContextBanner = true; // set dynamically
  }

  ngOnDestroy(): void {
    this.clearMagicTimer();
    this.clearToastTimer();
  }

  // ===== TAB SWITCHING =====
  switchTab(tab: AuthTab): void {
    this.activeTab = tab;
    this.pinError = false;
  }

  // ===== DEVICE DETECTION =====
  detectDevice(): void {
    const ua = navigator.userAgent;
    let device = 'Unknown device';
    if (/iPhone|iPad|iPod/.test(ua)) device = 'Apple device detected';
    else if (/Android/.test(ua)) device = 'Android device detected';
    else if (/Windows/.test(ua)) device = 'Windows PC detected';
    else if (/Mac/.test(ua)) device = 'Mac detected';
    else if (/Linux/.test(ua)) device = 'Linux device detected';
    this.deviceText = device;
  }

  // ===== PASSKEY =====
  checkPasskeySupport(): void {
    this.passkeyUnsupported = !(window as any).PublicKeyCredential;
  }

  signInWithPasskey(): void {
    if (this.passkeyUnsupported) return;
    this.passkeyScanning = true;
    // TODO: replace with real WebAuthn / passkey API call
    setTimeout(() => {
      this.passkeyScanning = false;
      this.showToast('Passkey authentication simulated', 'success');
    }, 2000);
  }

  setupPasskey(): void {
    this.showToast('Passkey setup will be available after login', 'info');
  }

  // ===== PASSWORD =====
  validatePwEmail(): void {
    const val = this.pwEmail.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^[+]?[\d\s()-]{7,20}$/;
    if (!val) {
      this.pwEmailValid = false;
      this.pwEmailInvalid = false;
      this.pwEmailHintText = '';
    } else if (emailRe.test(val) || phoneRe.test(val)) {
      this.pwEmailValid = true;
      this.pwEmailInvalid = false;
      this.pwEmailHintText = 'Looks good';
    } else {
      this.pwEmailValid = false;
      this.pwEmailInvalid = true;
      this.pwEmailHintText = 'Enter a valid email or phone';
    }
  }

  get canSubmitPassword(): boolean {
    return this.pwEmailValid && this.pwPass.length >= 6 && !this.pwLoading;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  signInWithPassword(): void {
    if (!this.canSubmitPassword) return;
    this.pwLoading = true;
    // TODO: replace with real auth API call
    const payload = {
      email: this.pwEmail,
      password: this.pwPass,
      rememberMe: this.rememberMe
    };
    console.log('Password sign-in payload:', payload);
    setTimeout(() => {
      this.pwLoading = false;
      this.showToast('Password sign-in simulated', 'success');
    }, 1500);
  }

  goToRecovery(): void {
    this.showToast('Password recovery flow triggered', 'info');
    // TODO: navigate to recovery page
  }

  // ===== PIN =====
  onPinKey(key: string): void {
    if (key === 'bio') {
      this.useBiometric();
      return;
    }
    if (key === 'del') {
      this.pinValue = this.pinValue.slice(0, -1);
      this.pinError = false;
      return;
    }
    if (this.pinValue.length < 6) {
      this.pinValue += key;
      if (this.pinValue.length === 6) {
        this.submitPin();
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.activeTab !== 'pin') return;
    const key = event.key;
    if (key >= '0' && key <= '9') {
      this.onPinKey(key);
    } else if (key === 'Backspace') {
      this.onPinKey('del');
    } else if (key === 'Enter' && this.pinValue.length === 6) {
      this.submitPin();
    }
  }

  submitPin(): void {
    // TODO: replace with real PIN verification API call
    const payload = { pin: this.pinValue };
    console.log('PIN sign-in payload:', payload);
    setTimeout(() => {
      if (this.pinValue === '123456') {
        this.showToast('PIN sign-in simulated', 'success');
        this.pinValue = '';
      } else {
        this.pinError = true;
        this.pinValue = '';
        this.showToast('Invalid PIN. Please try again.', 'error');
      }
    }, 500);
  }

  useBiometric(): void {
    this.showToast('Biometric authentication requested', 'info');
    // TODO: integrate with WebAuthn / device biometric API
  }

  // ===== MAGIC LINK =====
  validateMagicEmail(): void {
    const val = this.magicEmail.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      this.magicEmailValid = false;
      this.magicEmailInvalid = false;
      this.magicHintText = '';
    } else if (emailRe.test(val)) {
      this.magicEmailValid = true;
      this.magicEmailInvalid = false;
      this.magicHintText = 'Valid email address';
    } else {
      this.magicEmailValid = false;
      this.magicEmailInvalid = true;
      this.magicHintText = 'Enter a valid email address';
    }
  }

  get canSendMagicLink(): boolean {
    return this.magicEmailValid && !this.magicSent;
  }

  sendMagicLink(): void {
    if (!this.canSendMagicLink) return;
    // TODO: replace with real magic link API call
    const payload = { email: this.magicEmail };
    console.log('Magic link payload:', payload);
    this.magicSent = true;
    this.magicResendDisabled = true;
    this.magicCountdown = 60;
    this.startMagicCountdown();
    this.showToast('Magic link sent to ' + this.magicEmail, 'success');
  }

  startMagicCountdown(): void {
    this.clearMagicTimer();
    this.magicTimer = setInterval(() => {
      this.magicCountdown--;
      if (this.magicCountdown <= 0) {
        this.magicResendDisabled = false;
        this.clearMagicTimer();
      }
    }, 1000);
  }

  resendMagicLink(): void {
    if (this.magicResendDisabled) return;
    this.sendMagicLink();
  }

  magicBack(): void {
    this.magicSent = false;
    this.magicEmail = '';
    this.magicEmailValid = false;
    this.magicEmailInvalid = false;
    this.magicHintText = '';
    this.clearMagicTimer();
  }

  private clearMagicTimer(): void {
    if (this.magicTimer) {
      clearInterval(this.magicTimer);
      this.magicTimer = null;
    }
  }

  // ===== SOCIAL =====
  signInWithSocial(providerId: string): void {
    // TODO: replace with real OAuth redirect
    console.log('Social sign-in provider:', providerId);
    this.showToast('Redirecting to ' + providerId + '...', 'info');
  }

  // ===== TOAST =====
  showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.toastMessage = message;
    this.toastVisible = true;
    if (type === 'success') {
      this.toastIcon = 'bi-check-circle-fill';
      this.toastBg = 'rgba(34,197,94,.12)';
      this.toastBorder = '1px solid rgba(34,197,94,.3)';
      this.toastColor = '#86efac';
    } else if (type === 'error') {
      this.toastIcon = 'bi-x-circle-fill';
      this.toastBg = 'rgba(239,68,68,.12)';
      this.toastBorder = '1px solid rgba(239,68,68,.3)';
      this.toastColor = '#fca5a5';
    } else {
      this.toastIcon = 'bi-info-circle';
      this.toastBg = 'rgba(34,211,238,.12)';
      this.toastBorder = '1px solid rgba(34,211,238,.3)';
      this.toastColor = '#a5f3fc';
    }
    this.clearToastTimer();
    this.toastTimer = setTimeout(() => {
      this.toastVisible = false;
    }, 3500);
  }

  private clearToastTimer(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
  }
}