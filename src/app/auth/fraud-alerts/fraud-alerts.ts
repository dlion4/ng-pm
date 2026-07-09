import { Component, OnInit, AfterViewInit, TrackByFunction, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

// ─── Data Models ──────────────────────────────────────────────

interface StatusBadge {
  label: string;
  type: 'frozen' | 'flagged' | 'verification' | 'dormant';
}

interface FlowStep {
  icon: string;
  label: string;
  active: boolean;
}

interface ModuleTag {
  label: string;
  locked: boolean;
}

interface DetailRow {
  label: string;
  value: string;
  highlight?: boolean; // applies accent-red color
}

interface MetaItem {
  icon: string;
  label: string;
}

interface ActionCard {
  id: string;
  href: string;
  cardClass: string;
  icon: string;
  iconClass: string;
  status: string;
  statusClass: string;
  title: string;
  description: string;
  details: DetailRow[];
  meta: MetaItem[];
  actionLabel: string;
  progressWidth: number; // percentage
}

interface WarningTip {
  icon: string;
  text: string;
}

interface ContactButton {
  href: string;
  icon: string;
  label: string;
}

// ─── Component ──────────────────────────────────────────────────

@Component({
  selector: 'app-fraud-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fraud-alerts.html',
  styleUrls: ['./fraud-alerts.css'],
  encapsulation: ViewEncapsulation.None
})
export class FraudAlertsComponent implements OnInit, AfterViewInit {

  // ─── Static / Config Data ───────────────────────────────────

  brandLogo = 'P';
  brandTitle = 'Paymo BAAS';
  brandSubtitle = 'Account Recovery Center';

  sessionBadgeText = 'Secured session verified';

  userAvatar = 'AO';
  userName = 'Amara Okafor';
  userStatus = 'Limited Access Mode';

  alertIcon = 'fa-lock';
  alertTitle = 'Account Access Restricted';
  alertDescription = 'Your account has been temporarily restricted due to security concerns. Complete the required verification steps below to restore full access to your account and resume all transactions.';

  alertBadges: StatusBadge[] = [
    { label: 'Account Frozen', type: 'frozen' },
    { label: 'Under Review', type: 'flagged' }
  ];

  pageIndicator = 'Page 56 · Account Security & Recovery';
  heroTitle = 'Restore your account';
  heroTitleAccent = 'access.';
  heroDescription = 'Your account security is our priority. Select the appropriate verification path below to unlock your account. Each section addresses specific restrictions placed on your account. Complete all required steps to regain full functionality.';
  riskText = 'Risk Level:';
  riskLevel = 'High';
  riskSuffix = '— Immediate action required';

  summaryType = 'Account Status';
  summaryTitle = 'Restricted Access';
  summaryIcon = 'fa-user-lock';

  routeInfo = 'Route: /recovery/verify?status=restricted&priority=high';

  flowSteps: FlowStep[] = [
    { icon: 'fa-check', label: 'Login', active: true },
    { icon: 'fa-lock', label: 'Verify', active: false },
    { icon: 'fa-unlock', label: 'Access', active: false }
  ];

  moduleTags: ModuleTag[] = [
    { label: 'Transfers', locked: true },
    { label: 'Withdrawals', locked: true },
    { label: 'Bill Payments', locked: true },
    { label: 'View Only', locked: false },
    { label: 'Support', locked: false }
  ];

  sectionTitle = 'Verification Required';
  sectionDescription = 'Complete these verification steps to restore full account functionality. Required actions must be completed before access is restored.';

  actionCards: ActionCard[] = [
    {
      id: 'identity-verification',
      href: 'https://verify.paymo.com/identity/kyc',
      cardClass: 'identity-verification',
      icon: 'fa-id-card',
      iconClass: 'identity-verification',
      status: 'Required',
      statusClass: 'required',
      title: 'Verify Your Identity',
      description: 'Complete KYC verification to confirm your identity. Upload government-issued ID, proof of address, and complete facial verification to unlock account features.',
      details: [
        { label: 'Documents Needed', value: '3 items' },
        { label: 'Est. Time', value: '5-10 minutes' },
        { label: 'Review Time', value: '24-48 hours' }
      ],
      meta: [
        { icon: 'fa-shield-alt', label: 'Bank-grade security' },
        { icon: 'fa-camera', label: 'Live selfie required' }
      ],
      actionLabel: 'Start Verification',
      progressWidth: 0
    },
    {
      id: 'bank-verification',
      href: 'https://verify.paymo.com/linked-accounts',
      cardClass: 'bank-verification',
      icon: 'fa-university',
      iconClass: 'bank-verification',
      status: 'Required',
      statusClass: 'required',
      title: 'Verify Linked Accounts',
      description: 'Confirm ownership of all linked bank accounts and mobile wallets. This prevents unauthorized access and ensures secure transaction processing across all your connected financial accounts.',
      details: [
        { label: 'Bank Accounts', value: '2 pending' },
        { label: 'Mobile Wallets', value: '1 pending' },
        { label: 'Verification Method', value: 'Micro-deposit' }
      ],
      meta: [
        { icon: 'fa-clock', label: '1-2 business days' },
        { icon: 'fa-sync', label: 'Auto-verification' }
      ],
      actionLabel: 'Verify Accounts',
      progressWidth: 25
    },
    {
      id: 'transaction-review',
      href: 'https://verify.paymo.com/transactions/review',
      cardClass: 'transaction-review',
      icon: 'fa-exchange-alt',
      iconClass: 'transaction-review',
      status: '4 Pending',
      statusClass: 'pending',
      title: 'Review Flagged Transactions',
      description: 'Several transactions on your account have been flagged for review due to unusual patterns. Confirm these transactions were authorized by you to remove the hold on your account.',
      details: [
        { label: 'Flagged Count', value: '4 transactions' },
        { label: 'Total Amount', value: 'NGN 2,450,000' },
        { label: 'Date Range', value: 'Last 14 days' }
      ],
      meta: [
        { icon: 'fa-search', label: 'Detailed review' },
        { icon: 'fa-comments', label: 'Add notes' }
      ],
      actionLabel: 'Review Now',
      progressWidth: 40
    },
    {
      id: 'dispute-resolution',
      href: 'https://verify.paymo.com/disputes/resolve',
      cardClass: 'dispute-resolution',
      icon: 'fa-handshake',
      iconClass: 'dispute-resolution',
      status: '1 Active',
      statusClass: 'pending',
      title: 'Resolve Customer Disputes',
      description: 'A customer has flagged a transaction from your account through another channel. Provide evidence of transaction legitimacy including invoices, delivery confirmations, or communication records.',
      details: [
        { label: 'Dispute ID', value: '#DSP-2024-8842' },
        { label: 'Amount in Dispute', value: 'NGN 150,000' },
        { label: 'Response Due', value: '48 hours', highlight: true }
      ],
      meta: [
        { icon: 'fa-gavel', label: 'Arbitration ready' },
        { icon: 'fa-file-upload', label: 'Upload proof' }
      ],
      actionLabel: 'Resolve Dispute',
      progressWidth: 15
    },
    {
      id: 'fraud-appeal',
      href: 'https://verify.paymo.com/compliance/fraud-appeal',
      cardClass: 'fraud-appeal',
      icon: 'fa-exclamation-circle',
      iconClass: 'fraud-appeal',
      status: 'High Priority',
      statusClass: 'required',
      title: 'Fraud Flag Appeal',
      description: 'Your account has been flagged for potential fraudulent activity. Submit comprehensive documentation to prove your business legitimacy and transaction authenticity to our compliance team.',
      details: [
        { label: 'Flag Reason', value: 'Unusual volume spike' },
        { label: 'Evidence Required', value: 'Business docs' },
        { label: 'Case Priority', value: 'Urgent', highlight: true }
      ],
      meta: [
        { icon: 'fa-user-shield', label: 'Compliance review' },
        { icon: 'fa-building', label: 'Business verify' }
      ],
      actionLabel: 'Submit Appeal',
      progressWidth: 5
    },
    {
      id: 'business-verification',
      href: 'https://verify.paymo.com/business/kyb',
      cardClass: 'business-verification',
      icon: 'fa-building',
      iconClass: 'business-verification',
      status: 'Business',
      statusClass: 'optional',
      title: 'Business Verification (KYB)',
      description: 'For business accounts, complete Know Your Business verification. Submit corporate documents, beneficial ownership information, and business registration certificates to unlock higher transaction limits.',
      details: [
        { label: 'Business Type', value: 'Private Limited' },
        { label: 'Documents', value: 'CAC, Tax ID, etc.' },
        { label: 'Current Limit', value: 'NGN 10M/month' }
      ],
      meta: [
        { icon: 'fa-chart-line', label: 'Higher limits' },
        { icon: 'fa-certificate', label: 'Verified badge' }
      ],
      actionLabel: 'Start KYB',
      progressWidth: 60
    }
  ];

  warnings: WarningTip[] = [
    { icon: 'fa-times-circle', text: 'Do not create new accounts to bypass restrictions — this will result in permanent suspension of all associated accounts.' },
    { icon: 'fa-times-circle', text: 'Providing false documentation or misleading information is a criminal offense and will be reported to authorities.' },
    { icon: 'fa-times-circle', text: 'Account recovery must be completed within 30 days or your account will be converted to dormant status with fund remittance to unclaimed property.' },
    { icon: 'fa-times-circle', text: 'Third-party account recovery services are fraudulent — Paymo will never ask for your password or PIN via email or phone.' }
  ];

  tips: WarningTip[] = [
    { icon: 'fa-check-circle', text: 'Ensure all uploaded documents are clear, high-resolution, and not cropped — blurry documents delay review by 3-5 days.' },
    { icon: 'fa-check-circle', text: 'Use the same name across all documents that matches your Paymo profile exactly, including middle names.' },
    { icon: 'fa-check-circle', text: 'For disputed transactions, provide complete communication history — screenshots, emails, delivery receipts help resolve cases faster.' },
    { icon: 'fa-check-circle', text: 'Check your email and SMS regularly for verification codes and additional requests from our compliance team.' },
    { icon: 'fa-check-circle', text: 'Complete identity verification during daytime hours for better lighting during the facial recognition step.' }
  ];

  contactTitle = 'Need Help With Recovery?';
  contactDescription = 'Our specialized account recovery team is available 24/7 to assist you through the verification process.';
  contactButtons: ContactButton[] = [
    { href: 'tel:+234800PAYMO', icon: 'fa-phone', label: 'Call Support: 800-PAYMO-HELP' },
    { href: 'mailto:recovery@paymo.com', icon: 'fa-envelope', label: 'Email Recovery Team' },
    { href: 'https://support.paymo.com/live-chat', icon: 'fa-comments', label: 'Live Chat' },
    { href: 'https://support.paymo.com/schedule-callback', icon: 'fa-calendar', label: 'Schedule Callback' }
  ];

  // ─── Lifecycle ────────────────────────────────────────────────

  ngOnInit(): void {
    // Data initialization if async services are added later
  }

  ngAfterViewInit(): void {
    // Replicates DOMContentLoaded progress bar animation
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach((bar, index) => {
      setTimeout(() => {
        const targetWidth = (bar as HTMLElement).style.width;
        (bar as HTMLElement).style.width = targetWidth;
      }, index * 200);
    });
  }

  // ─── TrackBy Functions ────────────────────────────────────────

  trackByCardId: TrackByFunction<ActionCard> = (index, card) => card.id;
  trackByIndex: TrackByFunction<any> = (index) => index;
}