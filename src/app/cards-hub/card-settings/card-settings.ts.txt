import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ─── INTERFACES ──────────────────────────────────────────────

interface Card {
  name: string;
  last4: string;
  type: string;
  status: string;
  expiry: string;
  color: string;
  icon: string;
}

interface HeroStat {
  id: string;
  colClass: string;
  isAccent: boolean;
  cardExtraStyle?: string;
  label: string;
  labelColor?: string;
  value: string;
  valueSuffix?: string;
  badgeText?: string;
  badgeClass?: string;
  badgeIcon?: string;
  descriptionLines: string[];
  buttons?: { label: string; modal: string }[];
  indicatorDot?: string;
}

interface FeedItem {
  id: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonModal: string;
}

interface QuickAction {
  id: string;
  icon: string;
  iconColorClass?: string;
  iconColorStyle?: string;
  label: string;
  modal: string;
}

interface DefaultAssignment {
  id: string;
  label: string;
  description: string;
  badgeClass: string;
  badgeText: string;
  modal: string;
}

interface AlertSetting {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  type: 'switch' | 'threshold' | 'select';
  thresholdValue?: string;
  selectOptions?: string[];
}

interface DeliveryChannel {
  id: string;
  label: string;
  checked: boolean;
}

interface SelfServiceItem {
  id: string;
  title: string;
  description: string;
  modal: string;
}

interface SupportChannel {
  id: string;
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  modal: string;
}

interface EmergencyService {
  id: string;
  bgStyle: string;
  labelColor: string;
  label: string;
  value: string;
  valueColor: string;
  valueFontSize: string;
  buttonLabel: string;
  buttonExtraClass?: string;
  buttonModal: string;
  hasMarginBottom: boolean;
}

interface DisputeCase {
  id: string;
  caseId: string;
  type: string;
  card: string;
  statusBadgeClass: string;
  statusText: string;
  opened: string;
  nextStep: string;
  actionLabel: string;
  actionModal: string;
}

// ─── COMPONENT ───────────────────────────────────────────────

@Component({
  selector: 'app-card-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-settings.html',
  styleUrls: ['./card-settings.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CardSettingsComponent {
  activeModal: string | null = null;

  // Multi-step flow states
  pinStep: number = 1;
  lostStep: number = 1;
  dispStep: number = 1;
  tshootStep: number = 1;

  // Tab state per prefix
  activeTabs: Record<string, string> = { ctrl: 'fields', faq: 'general', org: 'names' };

  // Saved states for action modals
  freezeCardSaved: boolean = false;
  cardControlsSaved: boolean = false;
  defaultCardsSaved: boolean = false;
  cardNamingSaved: boolean = false;
  notifSettingsSaved: boolean = false;
  contactSupportSaved: boolean = false;
  emergencySaved: boolean = false;
  renewCardSaved: boolean = false;
  attentionFullSaved: boolean = false;
  caseExportSaved: boolean = false;

  // Stepper labels
  pinStepperLabels: string[] = ['Verify', 'New PIN', 'Done'];
  lostStepperLabels: string[] = ['Card', 'Details', 'Verify', 'Done'];
  dispStepperLabels: string[] = ['Transaction', 'Evidence', 'Done'];
  tshootStepperLabels: string[] = ['Issue', 'Diagnosis', 'Confirm'];

  // Card portfolio data
  cards: Card[] = [
    {
      name: 'Daily Driver',
      last4: '4521',
      type: 'Visa Debit',
      status: 'active',
      expiry: '07/25',
      color: '#4F46E5',
      icon: 'bi-credit-card-2-front',
    },
    {
      name: 'Tap-Pay Card',
      last4: '3392',
      type: 'MC Debit',
      status: 'active',
      expiry: '11/26',
      color: '#10B981',
      icon: 'bi-nfc',
    },
    {
      name: 'Online Shopping',
      last4: '1190',
      type: 'Virtual Credit',
      status: 'active',
      expiry: '12/27',
      color: '#8B5CF6',
      icon: 'bi-cart',
    },
    {
      name: 'Travel Fund',
      last4: '7788',
      type: 'Virtual Debit',
      status: 'frozen',
      expiry: '03/26',
      color: '#F59E0B',
      icon: 'bi-airplane',
    },
    {
      name: 'Emergency Backup',
      last4: '0091',
      type: 'Credit',
      status: 'blocked',
      expiry: '09/27',
      color: '#EF4444',
      icon: 'bi-shield-exclamation',
    },
  ];

  // ─── HERO STATS ────────────────────────────────────────────

  heroStats: HeroStat[] = [
    {
      id: 'hs-1',
      colClass: 'col-lg-4',
      isAccent: true,
      label: 'Card portfolio configured',
      value: '7 cards managed',
      descriptionLines: [
        '2 physical debit, 3 virtual debit, 1 virtual credit and 1 prepaid card — all preferences and alerts centralised here.',
      ],
      indicatorDot: '#86efac',
      buttons: [
        { label: 'Defaults', modal: 'defaultCardsModal' },
        { label: 'Organise', modal: 'cardNamingModal' },
        { label: 'Alerts', modal: 'notifSettingsModal' },
      ],
    },
    {
      id: 'hs-2',
      colClass: 'col-lg-2 col-md-4 col-6',
      isAccent: false,
      label: 'SECURITY SCORE',
      labelColor: 'var(--pm-accent)',
      value: '91',
      valueSuffix: '/100',
      badgeText: 'Excellent',
      badgeClass: 'B-s',
      badgeIcon: 'bi-shield-check',
      descriptionLines: ['3D Secure on all cards', 'PIN updated 14 days ago'],
    },
    {
      id: 'hs-3',
      colClass: 'col-lg-3 col-md-4 col-6',
      isAccent: false,
      label: 'OPEN SUPPORT CASES',
      labelColor: 'var(--pm-info)',
      value: '2',
      badgeText: '1 awaiting response',
      badgeClass: 'B-w',
      badgeIcon: 'bi-clock',
      descriptionLines: ['Dispute #CDP-44892', 'PIN reset request #PR-11228'],
    },
    {
      id: 'hs-4',
      colClass: 'col-lg-3 col-md-4',
      isAccent: false,
      cardExtraStyle: '3px solid var(--pm-warning)',
      label: 'CARDS NEEDING ACTION',
      labelColor: 'var(--pm-warning)',
      value: '3',
      badgeText: 'Review below',
      badgeClass: 'B-d',
      badgeIcon: 'bi-exclamation-triangle',
      descriptionLines: ['1 expiring, 1 frozen, 1 PIN change due'],
    },
  ];

  // ─── ATTENTION ITEMS ──────────────────────────────────────

  attentionItems: FeedItem[] = [
    {
      id: 'att-1',
      icon: 'bi-credit-card',
      iconBg: 'var(--pm-danger-soft)',
      iconColor: 'var(--pm-danger)',
      title: 'Visa Debit expires in 28 days',
      description: '****4521 · renew or replace',
      buttonLabel: 'Renew',
      buttonModal: 'renewCardModal',
    },
    {
      id: 'att-2',
      icon: 'bi-snow2',
      iconBg: 'var(--pm-warning-soft)',
      iconColor: 'var(--pm-warning)',
      title: 'Travel prepaid card frozen',
      description: '****8890 · unfreeze to use',
      buttonLabel: 'Unfreeze',
      buttonModal: 'freezeCardModal',
    },
    {
      id: 'att-3',
      icon: 'bi-key',
      iconBg: 'var(--pm-info-soft)',
      iconColor: 'var(--pm-info)',
      title: 'PIN change recommended',
      description: 'Corporate card ****6677 · 90+ days',
      buttonLabel: 'Change',
      buttonModal: 'changePinModal',
    },
  ];

  // ─── SUGGESTION ITEMS ─────────────────────────────────────

  suggestionItems: FeedItem[] = [
    {
      id: 'sug-1',
      icon: 'bi-bell',
      iconBg: 'var(--pm-accent-soft)',
      iconColor: 'var(--pm-accent)',
      title: 'Enable transaction alerts on 2 cards',
      description: 'Increase fraud detection coverage',
      buttonLabel: 'Enable',
      buttonModal: 'notifSettingsModal',
    },
    {
      id: 'sug-2',
      icon: 'bi-globe',
      iconBg: 'var(--pm-purple-soft)',
      iconColor: 'var(--pm-purple)',
      title: 'Lock international on daily-use card',
      description: 'Only enable when travelling',
      buttonLabel: 'Configure',
      buttonModal: 'cardControlsModal',
    },
    {
      id: 'sug-3',
      icon: 'bi-star',
      iconBg: 'var(--pm-warning-soft)',
      iconColor: 'var(--pm-warning)',
      title: 'Set default contactless card',
      description: 'No default contactless card selected',
      buttonLabel: 'Set',
      buttonModal: 'defaultCardsModal',
    },
  ];

  // ─── QUICK ACTIONS ────────────────────────────────────────

  quickActions: QuickAction[] = [
    {
      id: 'qa-1',
      icon: 'bi bi-key',
      iconColorClass: 'text-primary',
      label: 'Change PIN',
      modal: 'changePinModal',
    },
    {
      id: 'qa-2',
      icon: 'bi bi-snow2',
      iconColorClass: 'text-info',
      label: 'Freeze/Unfreeze',
      modal: 'freezeCardModal',
    },
    {
      id: 'qa-3',
      icon: 'bi bi-exclamation-diamond',
      iconColorClass: 'text-danger',
      label: 'Report Lost',
      modal: 'reportLostModal',
    },
    {
      id: 'qa-4',
      icon: 'bi bi-sliders',
      iconColorStyle: 'color:var(--pm-purple)',
      label: 'Card Controls',
      modal: 'cardControlsModal',
    },
    {
      id: 'qa-5',
      icon: 'bi bi-shield-exclamation',
      iconColorClass: 'text-warning',
      label: 'Dispute',
      modal: 'disputeModal',
    },
    {
      id: 'qa-6',
      icon: 'bi bi-question-circle',
      iconColorStyle: 'color:var(--pm-accent)',
      label: 'FAQ & Help',
      modal: 'faqModal',
    },
    {
      id: 'qa-7',
      icon: 'bi bi-calculator',
      iconColorClass: 'text-muted',
      label: 'Fee Calculator',
      modal: 'feeCalcModal',
    },
    {
      id: 'qa-8',
      icon: 'bi bi-headset',
      iconColorClass: 'text-primary',
      label: 'Live Support',
      modal: 'contactSupportModal',
    },
  ];

  // ─── DEFAULT CARD ASSIGNMENTS ─────────────────────────────

  defaultAssignments: DefaultAssignment[] = [
    {
      id: 'da-1',
      label: 'Online Payments',
      description: 'Primary card for e-commerce',
      badgeClass: 'B-p',
      badgeText: 'Visa ****4521',
      modal: 'defaultCardsModal',
    },
    {
      id: 'da-2',
      label: 'Contactless / Tap',
      description: 'NFC tap-to-pay default',
      badgeClass: 'B-i',
      badgeText: 'MC ****3392',
      modal: 'defaultCardsModal',
    },
    {
      id: 'da-3',
      label: 'ATM Withdrawals',
      description: 'Primary cash card',
      badgeClass: 'B-s',
      badgeText: 'Visa ****4521',
      modal: 'defaultCardsModal',
    },
    {
      id: 'da-4',
      label: 'Virtual Card Funding',
      description: 'Source for new virtual cards',
      badgeClass: 'B-w',
      badgeText: 'PayMo Wallet',
      modal: 'defaultCardsModal',
    },
    {
      id: 'da-5',
      label: 'International Currency',
      description: 'Default FX currency',
      badgeClass: '',
      badgeText: 'USD',
      modal: 'defaultCardsModal',
    },
  ];

  // ─── TRANSACTION ALERTS ───────────────────────────────────

  transactionAlerts: AlertSetting[] = [
    {
      id: 'ta-1',
      label: 'All transactions',
      description: 'Notify on every card transaction',
      checked: true,
      type: 'switch',
    },
    {
      id: 'ta-2',
      label: 'Large transactions only',
      description: 'Notify if amount exceeds threshold',
      checked: false,
      type: 'threshold',
      thresholdValue: '10,000',
    },
    {
      id: 'ta-3',
      label: 'International transactions',
      description: 'Alert for non-KES payments',
      checked: true,
      type: 'switch',
    },
    {
      id: 'ta-4',
      label: 'Declined transactions',
      description: 'With decline reason code',
      checked: true,
      type: 'switch',
    },
    {
      id: 'ta-5',
      label: 'Contactless limit reached',
      description: 'When tap-to-pay limit hit',
      checked: true,
      type: 'switch',
    },
  ];

  // ─── SECURITY & BILLING ALERTS ────────────────────────────

  securityAlerts: AlertSetting[] = [
    { id: 'sa-1', label: 'New device login', checked: true, type: 'switch' },
    { id: 'sa-2', label: 'PIN / password change', checked: true, type: 'switch' },
    { id: 'sa-3', label: 'Card freeze / unfreeze', checked: true, type: 'switch' },
    { id: 'sa-4', label: 'Statement ready', checked: true, type: 'switch' },
    { id: 'sa-5', label: 'Payment due reminder', checked: true, type: 'switch' },
    {
      id: 'sa-6',
      label: 'Expiry reminders',
      checked: true,
      type: 'select',
      selectOptions: ['90, 60, 30, 7 days', '60, 30, 7 days', '30, 7 days'],
    },
  ];

  // ─── DELIVERY CHANNELS ────────────────────────────────────

  deliveryChannels: DeliveryChannel[] = [
    { id: 'ch-1', label: 'Push', checked: true },
    { id: 'ch-2', label: 'SMS', checked: true },
    { id: 'ch-3', label: 'Email', checked: false },
    { id: 'ch-4', label: 'WhatsApp', checked: false },
  ];

  // ─── SELF-SERVICE HELP ITEMS ──────────────────────────────

  selfServiceItems: SelfServiceItem[] = [
    {
      id: 'ssh-1',
      title: 'FAQ by card type',
      description: '120+ answered questions',
      modal: 'faqModal',
    },
    {
      id: 'ssh-2',
      title: 'Troubleshoot wizard',
      description: 'Step-by-step decline diagnosis',
      modal: 'troubleshootModal',
    },
    {
      id: 'ssh-3',
      title: 'Card status checker',
      description: 'Real-time card health',
      modal: 'cardStatusModal',
    },
    {
      id: 'ssh-4',
      title: 'BIN lookup tool',
      description: 'Verify card issuer / type',
      modal: 'binLookupModal',
    },
    {
      id: 'ssh-5',
      title: 'Fee calculator',
      description: 'Estimate fees before action',
      modal: 'feeCalcModal',
    },
  ];

  // ─── SUPPORT CHANNELS ─────────────────────────────────────

  supportChannels: SupportChannel[] = [
    {
      id: 'sc-1',
      icon: 'bi-chat-left-text',
      iconBg: 'var(--pm-primary)',
      title: 'In-app chat',
      description: 'Avg response: 45 seconds',
      modal: 'contactSupportModal',
    },
    {
      id: 'sc-2',
      icon: 'bi-telephone',
      iconBg: 'var(--pm-accent)',
      title: 'Card hotline',
      description: '+254 800 723 001 · 24/7',
      modal: 'contactSupportModal',
    },
    {
      id: 'sc-3',
      icon: 'bi-envelope',
      iconBg: 'var(--pm-warning)',
      title: 'Email support',
      description: 'cards@paymo.co.ke',
      modal: 'contactSupportModal',
    },
    {
      id: 'sc-4',
      icon: 'bi-whatsapp',
      iconBg: '#25D366',
      title: 'WhatsApp',
      description: '+254 712 000 001',
      modal: 'contactSupportModal',
    },
    {
      id: 'sc-5',
      icon: 'bi-geo-alt',
      iconBg: 'var(--pm-purple)',
      title: 'Branch locator',
      description: 'In-person card assistance',
      modal: 'branchLocatorModal',
    },
  ];

  // ─── EMERGENCY SERVICES ───────────────────────────────────

  emergencyServices: EmergencyService[] = [
    {
      id: 'em-1',
      bgStyle: 'var(--pm-danger-soft)',
      labelColor: '#991B1B',
      label: '24/7 LOST / STOLEN HOTLINE',
      value: '+254 800 999 001',
      valueColor: 'var(--pm-danger)',
      valueFontSize: '22px',
      buttonLabel: 'Report Lost / Stolen Now',
      buttonExtraClass: 'btn-pm-d',
      buttonModal: 'reportLostModal',
      hasMarginBottom: true,
    },
    {
      id: 'em-2',
      bgStyle: 'var(--pm-warning-soft)',
      labelColor: '#B45309',
      label: 'EMERGENCY REPLACEMENT',
      value: 'Express courier within 4 hours',
      valueColor: 'var(--pm-warning)',
      valueFontSize: '14px',
      buttonLabel: 'Request Replacement',
      buttonModal: 'renewCardModal',
      hasMarginBottom: true,
    },
    {
      id: 'em-3',
      bgStyle: 'var(--pm-info-soft)',
      labelColor: '#1D4ED8',
      label: 'TRAVEL EMERGENCY',
      value: 'Cash advance & concierge',
      valueColor: 'var(--pm-info)',
      valueFontSize: '14px',
      buttonLabel: 'Get Help Abroad',
      buttonModal: 'emergencyModal',
      hasMarginBottom: false,
    },
  ];

  // ─── DISPUTE CASES ────────────────────────────────────────

  disputeCases: DisputeCase[] = [
    {
      id: 'case-1',
      caseId: 'CDP-44892',
      type: 'Chargeback',
      card: 'Visa ****4521',
      statusBadgeClass: 'B-w',
      statusText: 'Awaiting evidence',
      opened: '24 Jun 2025',
      nextStep: 'Upload merchant receipt',
      actionLabel: 'Respond',
      actionModal: 'disputeModal',
    },
    {
      id: 'case-2',
      caseId: 'PR-11228',
      type: 'PIN Reset',
      card: 'MC ****3392',
      statusBadgeClass: 'B-i',
      statusText: 'Processing',
      opened: '26 Jun 2025',
      nextStep: 'OTP verification pending',
      actionLabel: 'Complete',
      actionModal: 'changePinModal',
    },
    {
      id: 'case-3',
      caseId: 'FRZ-88100',
      type: 'Freeze request',
      card: 'Prepaid ****8890',
      statusBadgeClass: 'B-s',
      statusText: 'Resolved',
      opened: '20 Jun 2025',
      nextStep: 'Card re-frozen by cardholder',
      actionLabel: 'Review',
      actionModal: 'freezeCardModal',
    },
    {
      id: 'case-4',
      caseId: 'RPL-22019',
      type: 'Replacement',
      card: 'Visa ****4521',
      statusBadgeClass: 'B-p',
      statusText: 'Awaiting dispatch',
      opened: '22 Jun 2025',
      nextStep: 'Card personalised, courier pending',
      actionLabel: 'Track',
      actionModal: 'renewCardModal',
    },
  ];

  // ─── MODAL OPEN / CLOSE ──────────────────────────────────

  openModal(id: string): void {
    this.activeModal = id;
  }

  closeModal(): void {
    this.activeModal = null;
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.closeModal();
  }

  // ─── MULTI-STEP FLOWS ───────────────────────────────────

  nextFlow(key: string, total: number): void {
    const stepProp = (key + 'Step') as keyof this;
    const current = (this as any)[stepProp] as number;
    if (current >= total) {
      this.closeModal();
      this.resetFlow(key);
      return;
    }
    (this as any)[stepProp] = current + 1;
  }

  resetFlow(key: string): void {
    const stepProp = (key + 'Step') as keyof this;
    (this as any)[stepProp] = 1;
  }

  resetAllFlows(): void {
    this.pinStep = 1;
    this.lostStep = 1;
    this.dispStep = 1;
    this.tshootStep = 1;
  }

  // ─── TAB SWITCHING ───────────────────────────────────────

  switchTab(prefix: string, key: string, event: Event): void {
    this.activeTabs[prefix] = key;
    const btn = event.target as HTMLElement;
    if (btn && btn.parentElement) {
      btn.parentElement
        .querySelectorAll('.pill')
        .forEach((b: Element) => b.classList.remove('active'));
      btn.classList.add('active');
    }
  }

  // ─── BOX SELECTION ───────────────────────────────────────

  selectBox(event: Event): void {
    const el = (event.target as HTMLElement).closest('.border');
    if (!el || !el.closest('.row')) return;
    (el.closest('.row') as HTMLElement).querySelectorAll('.border').forEach((b: Element) => {
      (b as HTMLElement).style.borderColor = '';
      (b as HTMLElement).style.background = '';
    });
    (el as HTMLElement).style.borderColor = 'var(--pm-primary)';
    (el as HTMLElement).style.background = 'rgba(79,70,229,.04)';
  }

  // ─── PIN INPUT AUTO-FOCUS ────────────────────────────────

  onPinInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && input.nextElementSibling) {
      (input.nextElementSibling as HTMLElement).focus();
    }
  }

  // ─── PROCESS ACTION ──────────────────────────────────────

  processAction(modalId: string, msg: string, ref: string): void {
    const savedVar = modalId.replace('Modal', 'Saved') as keyof this;
    (this as any)[savedVar] = true;
  }

  // ─── RESET ALL ───────────────────────────────────────────

  resetAllModals(): void {
    this.activeModal = null;
    this.pinStep = 1;
    this.lostStep = 1;
    this.dispStep = 1;
    this.tshootStep = 1;
    this.freezeCardSaved = false;
    this.cardControlsSaved = false;
    this.defaultCardsSaved = false;
    this.cardNamingSaved = false;
    this.notifSettingsSaved = false;
    this.contactSupportSaved = false;
    this.emergencySaved = false;
    this.renewCardSaved = false;
    this.attentionFullSaved = false;
    this.caseExportSaved = false;
    this.activeTabs = { ctrl: 'fields', faq: 'general', org: 'names' };
  }
}
