import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-partner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './partner.html',
  styleUrls: ['./partner.css'],
  encapsulation: ViewEncapsulation.None
})
export class PartnerComponent implements OnInit {

  modals: Record<string, boolean> = {};
  toast = { show: false, message: '' };

  applyStep = 1;
  appStep = 1;

  selectedTier: string = 'certified';

  applyForm = {
    volume: '10M - 50M',
    description: 'Scaling our ERP integration to serve 500+ merchants.',
    check1: true,
    check2: true,
    check3: false
  };

  appForm = {
    name: '',
    desc: '',
    category: 'E-commerce Plugin',
    logo: '',
    video: '',
    email: '',
    billing: 'Free',
    price: 0
  };

  campaignName = '';

  leads = [
    { name: 'Acme Retailers', industry: 'E-commerce', interest: 'WooCommerce Sync', date: 'Today', status: 'New', statusClass: 'pm-badge-info' },
    { name: 'Global Logistics', industry: 'Transport', interest: 'Payroll Importer', date: 'Yesterday', status: 'New', statusClass: 'pm-badge-info' },
    { name: 'Nairobi Traders', industry: 'Retail', interest: 'WooCommerce Sync', date: '10 Nov', status: 'In Progress', statusClass: 'pm-badge-warning' },
    { name: 'TechHub EA', industry: 'Software', interest: 'Custom SDK', date: '01 Nov', status: 'Closed Won', statusClass: 'pm-badge-success' }
  ];

  payouts = [
    { month: 'Oct 2026', merchants: '42', volume: 'KES 128M', commission: 'KES 128,450', status: 'Processing', statusClass: 'pm-badge-info' },
    { month: 'Sep 2026', merchants: '38', volume: 'KES 115M', commission: 'KES 115,000', status: 'Paid', statusClass: 'pm-badge-success' },
    { month: 'Aug 2026', merchants: '34', volume: 'KES 95M', commission: 'KES 95,000', status: 'Paid', statusClass: 'pm-badge-success' },
    { month: 'Jul 2026', merchants: '30', volume: 'KES 80M', commission: 'KES 80,000', status: 'Paid', statusClass: 'pm-badge-success' }
  ];

  roadmapItems = [
    { title: 'Batch Payouts v2 Structure', status: 'Planned for Q1 2027', votes: 124 },
    { title: 'Webhook Retry UI Dashboard', status: 'In Development', votes: 89 },
    { title: 'GraphQL API Support', status: 'Under Review', votes: 56 }
  ];

  notifications = [
    { title: 'New lead assigned: Acme Retailers', time: '2 mins ago', color: 'var(--pm-primary)', action: 'View' },
    { title: 'WooCommerce Sync reached 210 installs!', time: '1 hour ago', color: 'var(--pm-accent)', action: 'Celebrate' },
    { title: 'Commission payout of KES 115,000 processed.', time: 'Yesterday', color: 'var(--pm-info)', action: 'Viewed' },
    { title: 'Partner Summit 2026 registration is open.', time: '2 days ago', color: 'var(--pm-warning)', action: 'RSVP' }
  ];

  ngOnInit(): void {
    const modalIds = [
      'applyPartnerModal', 'certExamModal', 'securityAssessmentModal', 'perfBenchmarkModal',
      'revenueShareModal', 'coMarketingModal', 'leadSharingModal', 'submitAppModal',
      'editAppModal', 'appReviewsModal', 'roiCalculatorModal', 'referralLinkModal',
      'payoutHistoryModal', 'forumTopicModal', 'roadmapVoteModal', 'betaEnrollModal',
      'hackathonModal', 'newsletterSubscribeModal', 'officeHoursModal', 'techWorkshopModal',
      'partnerSummitModal', 'healthCheckModal', 'notificationModal', 'exportReportModal'
    ];
    modalIds.forEach(id => this.modals[id] = false);
  }

  openModal(id: string): void {
    this.modals[id] = true;
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }

  closeModal(id: string): void {
    this.modals[id] = false;
    const anyOpen = Object.values(this.modals).some(v => v);
    if (!anyOpen) {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
  }

  onBackdropClick(event: Event, id: string): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeModal(id);
    }
  }

  dismissToast(): void {
    this.toast.show = false;
  }

  prevApplyStep(): void { this.applyStep--; }
  nextApplyStep(): void { this.applyStep++; }
  prevAppStep(): void { this.appStep--; }
  nextAppStep(): void { this.appStep++; }

  cancelApply(): void {
    this.closeModal('applyPartnerModal');
    this.applyStep = 1;
  }

  submitApply(): void {
    this.processAction('applyPartnerModal', 'Partner tier upgrade application submitted!');
  }

  cancelApp(): void {
    this.closeModal('submitAppModal');
    this.appStep = 1;
  }

  submitApp(): void {
    this.processAction('submitAppModal', 'App submitted for marketplace review!');
  }

  exportPayouts(): void {
    this.closeModal('payoutHistoryModal');
    this.openModal('exportReportModal');
  }

  voteRoadmap(item: { votes: number }): void {
    item.votes++;
    this.processAction('roadmapVoteModal', 'Vote recorded!');
  }

  processAction(modalId: string, message: string, ref?: string): void {
    this.closeModal(modalId);
    this.toast = {
      show: true,
      message: ref ? `${message} (Ref: ${ref})` : message
    };
    setTimeout(() => { this.toast.show = false; }, 4000);
    if (modalId === 'applyPartnerModal') { this.applyStep = 1; }
    if (modalId === 'submitAppModal') { this.appStep = 1; }
  }

  copyToClipboard(text: string): void {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.toast = { show: true, message: 'Copied to clipboard!' };
        setTimeout(() => { this.toast.show = false; }, 2000);
      }).catch(() => this.fallbackCopy(text));
    } else {
      this.fallbackCopy(text);
    }
  }

  private fallbackCopy(text: string): void {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      this.toast = { show: true, message: 'Copied to clipboard!' };
      setTimeout(() => { this.toast.show = false; }, 2000);
    } catch (err) {
      this.toast = { show: true, message: 'Failed to copy.' };
      setTimeout(() => { this.toast.show = false; }, 2000);
    }
    document.body.removeChild(ta);
  }
}