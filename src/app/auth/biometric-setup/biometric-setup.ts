import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ──────────────────────────────────────────────────────────────
   INTERFACES — ready for dynamic data injection
   Replace these with your API service calls
   ────────────────────────────────────────────────────────────── */

export interface Passkey {
  id: string;
  name: string;
  device: string;
  created: string;
  lastUsed: string;
  status: 'primary' | 'active';
  sync: string;
}

export interface WizardStep {
  t: string;
  d: string;
  icon: string;
}

export interface EnterprisePolicy {
  label: string;
  desc: string;
  enabled: boolean;
}

/* ──────────────────────────────────────────────────────────────
   COMPONENT
   ────────────────────────────────────────────────────────────── */

@Component({
  selector: 'app-biometric-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './biometric-setup.html',
  styleUrls: ['./biometric-setup.css'],
  encapsulation: ViewEncapsulation.None
})
export class BiometricSetupComponent implements OnInit, OnDestroy {

  /* ═══════════════════════════════════════════════════════════
     DATA STATE — swap these arrays with API service calls
     ═══════════════════════════════════════════════════════════ */

  passkeys: Passkey[] = [
    { id: 'pk_iphone15', name: 'iPhone 15 Pro', device: 'iOS · Face ID', created: '2026-01-14', lastUsed: 'Active today', status: 'primary', sync: 'iCloud Keychain' },
    { id: 'pk_workmac', name: 'Work MacBook', device: 'macOS · Touch ID', created: '2025-12-02', lastUsed: '2 hours ago', status: 'active', sync: '1Password' },
    { id: 'pk_pixel', name: 'Pixel 9', device: 'Android · Fingerprint', created: '2025-10-19', lastUsed: '12 days ago', status: 'active', sync: 'Google Password Manager' }
  ];

  wizardSteps: WizardStep[] = [
    { t: 'Check compatibility', d: 'Detect secure context, platform authenticator, and WebAuthn support.', icon: 'bi-device-ssd' },
    { t: 'Create passkey', d: 'Use your device security prompt or a password manager.', icon: 'bi-fingerprint' },
    { t: 'Name your passkey', d: 'Choose a clear label for future management.', icon: 'bi-pencil-square' },
    { t: 'Test passkey', d: 'Authenticate once to confirm it works.', icon: 'bi-check2-circle' },
    { t: 'Success', d: 'Passwordless sign-in is ready.', icon: 'bi-stars' }
  ];

  enterprisePolicies: EnterprisePolicy[] = [
    { label: 'Require passkeys', desc: 'All admin accounts.', enabled: true },
    { label: 'Disable password-only', desc: 'Sensitive roles.', enabled: true },
    { label: 'Bulk enrollment', desc: 'Corporate devices.', enabled: false },
    { label: 'Auto-remediation', desc: 'Notify unenrolled users.', enabled: true }
  ];

  /* ═══════════════════════════════════════════════════════════
     UI STATE
     ═══════════════════════════════════════════════════════════ */

  activeBiometricTab: string = 'ios';
  wizardIndex: number = 0;
  newPasskeyName: string = '';
  creatingPasskey: boolean = false;
  testingPasskey: boolean = false;

  // Compatibility
  webAuthnAvailable: boolean = false;
  secureContext: boolean = false;

  // QR / Pairing
  qrCells: boolean[] = [];
  pairProgress: number = 0;
  pairStatusText: string = 'Waiting for phone scan.';
  pairingActive: boolean = false;
  qrTimerText: string = '02:00';
  private qrTimerInterval: any;
  private qrEndTime: number = 0;

  // Modal
  modalTitle: string = 'Confirm action';
  modalBody: string = '';
  modalConfirmAction: (() => void) | null = null;
  modalVisible: boolean = false;

  // Reveal animation
  private revealObserver: IntersectionObserver | null = null;

  @ViewChild('wizardPanel') wizardPanelRef!: ElementRef;

  /* ═══════════════════════════════════════════════════════════
     LIFECYCLE
     ═══════════════════════════════════════════════════════════ */

  ngOnInit(): void {
    this.loadPasskeys();
    this.checkCompatibility();
    this.detectDeviceName();
    this.renderQR();
    this.startQRTimer();
    this.initRevealObserver();
  }

  ngOnDestroy(): void {
    if (this.qrTimerInterval) clearInterval(this.qrTimerInterval);
    if (this.revealObserver) this.revealObserver.disconnect();
  }

  /* ═══════════════════════════════════════════════════════════
     LOCAL STORAGE
     ═══════════════════════════════════════════════════════════ */

  private readonly STORAGE_KEY = 'paymo_passkeys_v1';

  loadPasskeys(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.passkeys = JSON.parse(stored);
      }
    } catch { /* keep defaults */ }
  }

  savePasskeys(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.passkeys));
  }

  /* ═══════════════════════════════════════════════════════════
     COMPATIBILITY
     ═══════════════════════════════════════════════════════════ */

  checkCompatibility(): void {
    this.webAuthnAvailable = !!(window as any).PublicKeyCredential;
    this.secureContext = window.isSecureContext;
  }

  get compatBadgeClass(): string {
    return this.webAuthnAvailable && this.secureContext ? 'badge-ok' : 'badge-warn';
  }

  get compatBadgeText(): string {
    return this.webAuthnAvailable && this.secureContext ? 'supported' : 'limited';
  }

  get compatText(): string {
    return this.webAuthnAvailable && this.secureContext
      ? 'This browser supports WebAuthn in a secure context. You can create platform or synced passkeys.'
      : 'Passkey APIs are limited in this context. You can still review setup steps and manage existing passkeys.';
  }

  /* ═══════════════════════════════════════════════════════════
     BIOMETRIC TABS
     ═══════════════════════════════════════════════════════════ */

  setBiometricTab(tab: string): void {
    this.activeBiometricTab = tab;
  }

  /* ═══════════════════════════════════════════════════════════
     WIZARD
     ═══════════════════════════════════════════════════════════ */

  nextWizard(): void {
    if (this.wizardIndex < this.wizardSteps.length - 1) {
      this.wizardIndex++;
      this.creatingPasskey = false;
      this.testingPasskey = false;
    }
  }

  detectDeviceName(): void {
    const ua = navigator.userAgent;
    let name = 'This device passkey';
    if (/iPhone/i.test(ua)) name = 'iPhone passkey';
    else if (/Android/i.test(ua)) name = 'Android passkey';
    else if (/Mac/i.test(ua)) name = 'MacBook passkey';
    else if (/Windows/i.test(ua)) name = 'Windows Hello passkey';
    this.newPasskeyName = name;
  }

  simulateCreatePasskey(): void {
    this.creatingPasskey = true;
    setTimeout(() => {
      this.creatingPasskey = false;
      this.nextWizard();
    }, 1200);
  }

  nameNewPasskey(): void {
    const name = this.newPasskeyName.trim() || this.detectDeviceNameFallback();
    this.passkeys.push({
      id: 'pk_' + Date.now(),
      name,
      device: navigator.platform || 'This device',
      created: new Date().toISOString().slice(0, 10),
      lastUsed: 'Just now',
      status: this.passkeys.length ? 'active' : 'primary',
      sync: 'Device-only'
    });
    this.savePasskeys();
    this.nextWizard();
  }

  testPasskey(): void {
    this.testingPasskey = true;
    setTimeout(() => {
      this.testingPasskey = false;
      this.nextWizard();
    }, 1000);
  }

  private detectDeviceNameFallback(): string {
    const ua = navigator.userAgent;
    if (/iPhone/i.test(ua)) return 'iPhone passkey';
    if (/Android/i.test(ua)) return 'Android passkey';
    if (/Mac/i.test(ua)) return 'MacBook passkey';
    if (/Windows/i.test(ua)) return 'Windows Hello passkey';
    return 'This device passkey';
  }

  scrollToManage(): void {
    const el = document.getElementById('manage');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToWizard(): void {
    const el = document.getElementById('wizard');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  /* ═══════════════════════════════════════════════════════════
     PASSKEY MANAGEMENT
     ═══════════════════════════════════════════════════════════ */

  renamePasskey(id: string): void {
    const pk = this.passkeys.find(p => p.id === id);
    if (!pk) return;
    const name = prompt('Rename passkey', pk.name);
    if (name) {
      pk.name = name;
      this.savePasskeys();
    }
  }

  setPrimary(id: string): void {
    this.passkeys.forEach(p => p.status = p.id === id ? 'primary' : 'active');
    this.savePasskeys();
  }

  removePasskey(id: string): void {
    const pk = this.passkeys.find(p => p.id === id);
    if (!pk) return;
    this.modalTitle = 'Remove passkey?';
    this.modalBody = `Remove <strong>${pk.name}</strong>? You will need a password or another passkey on this device.`;
    this.modalConfirmAction = () => {
      this.passkeys = this.passkeys.filter(p => p.id !== id);
      if (this.passkeys.length && !this.passkeys.some(p => p.status === 'primary')) {
        this.passkeys[0].status = 'primary';
      }
      this.savePasskeys();
      this.closeModal();
    };
    this.modalVisible = true;
  }

  addSampleDevice(): void {
    this.passkeys.push({
      id: 'pk_sample_' + Date.now(),
      name: 'Security key',
      device: 'YubiKey 5C NFC',
      created: new Date().toISOString().slice(0, 10),
      lastUsed: 'Never',
      status: 'active',
      sync: 'Hardware key'
    });
    this.savePasskeys();
  }

  /* ═══════════════════════════════════════════════════════════
     MODAL
     ═══════════════════════════════════════════════════════════ */

  closeModal(): void {
    this.modalVisible = false;
    this.modalConfirmAction = null;
  }

  confirmModal(): void {
    if (this.modalConfirmAction) {
      this.modalConfirmAction();
    }
  }

  /* ═══════════════════════════════════════════════════════════
     QR / PAIRING
     ═══════════════════════════════════════════════════════════ */

  renderQR(): void {
    this.qrCells = [];
    for (let i = 0; i < 81; i++) {
      const finder = (i < 21 && i % 9 < 3) || (i < 27 && i % 9 > 5) || (i > 53 && i % 9 < 3);
      this.qrCells.push(finder || Math.random() > 0.42);
    }
  }

  startQRTimer(): void {
    this.qrEndTime = Date.now() + 120000;
    this.qrTimerInterval = setInterval(() => {
      const left = Math.max(0, this.qrEndTime - Date.now());
      const m = String(Math.floor(left / 60000)).padStart(2, '0');
      const s = String(Math.floor(left % 60000 / 1000)).padStart(2, '0');
      this.qrTimerText = `${m}:${s}`;
    }, 1000);
  }

  simulatePair(): void {
    if (this.pairingActive) return;
    this.pairingActive = true;
    this.pairProgress = 0;
    const steps = ['QR scanned by trusted phone.', 'Face ID approved on phone.', 'Registering this browser.', 'New device passkey ready.'];
    let i = 0;
    const timer = setInterval(() => {
      this.pairStatusText = steps[i];
      this.pairProgress = ((i + 1) / steps.length) * 100;
      i++;
      if (i === steps.length) {
        clearInterval(timer);
        setTimeout(() => {
          this.passkeys.push({
            id: 'pk_pair_' + Date.now(),
            name: 'Paired browser',
            device: 'Chrome · Cross-device',
            created: new Date().toISOString().slice(0, 10),
            lastUsed: 'Just now',
            status: 'active',
            sync: 'Phone passkey'
          });
          this.savePasskeys();
          this.pairingActive = false;
        }, 500);
      }
    }, 800);
  }

  /* ═══════════════════════════════════════════════════════════
     DOWNLOADS
     ═══════════════════════════════════════════════════════════ */

  downloadAudit(): void {
    const header = 'name,device,created,lastUsed,status,sync';
    const rows = this.passkeys.map(p => `${p.name},${p.device},${p.created},${p.lastUsed},${p.status},${p.sync}`);
    this.downloadFile('paymo-passkey-audit.csv', [header, ...rows].join('\n'), 'text/csv');
  }

  exportEnterprise(): void {
    const text = 'policy,status\nRequire passkeys,on\nDisable password-only,on\nBulk enrollment,off\nAuto-remediation,on';
    this.downloadFile('paymo-enterprise-passkey-policy.csv', text, 'text/csv');
  }

  private downloadFile(filename: string, text: string, type: string): void {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ═══════════════════════════════════════════════════════════
     REVEAL ANIMATION
     ═══════════════════════════════════════════════════════════ */

  private initRevealObserver(): void {
    this.revealObserver = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.12 }
    );
    // Observer will be applied via directive or after view init
    setTimeout(() => {
      document.querySelectorAll('.reveal, .glass, .glass-strong, .device-card, .passkey-card, .enterprise-card')
        .forEach(el => this.revealObserver?.observe(el));
    }, 100);
  }
}