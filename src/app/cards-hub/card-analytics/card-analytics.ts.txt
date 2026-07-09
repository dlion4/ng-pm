import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ═══════════════════════════════════════════════════════════════════
   TYPED INTERFACES
   ═══════════════════════════════════════════════════════════════════ */

interface HeroStatBadge {
  icon: string;
  text: string;
  badgeClass: string;
  badgeStyle?: string;
}

interface HeroStatBreakdown {
  label: string;
  value: string;
  valueStyle?: string;
}

interface HeroStat {
  label: string;
  labelStyle: string;
  value: string;
  cardExtraClass?: string;
  cardStyle?: string;
  badge: HeroStatBadge;
  breakdownStyle: string;
  breakdowns: HeroStatBreakdown[];
}

interface FunnelStep {
  label: string;
  value: string;
  width: number;
  color: string;
}

interface RevenueBox {
  label: string;
  labelStyle: string;
  value: string;
  valueStyle: string;
  bgStyle: string;
}

interface ChannelBar {
  label: string;
  height: number;
  color: string;
  title: string;
  showInLegend: boolean;
}

interface StatusRow {
  name: string;
  subtitle: string;
  value: string;
}

interface PredictiveCallout {
  extraClass?: string;
  bgStyle: string;
  label: string;
  labelStyle: string;
  value: string;
  valueStyle: string;
  subtitle: string;
  subtitleStyle: string;
  buttonText: string;
  buttonClass: string;
  modalId: string;
}

interface CorpSpendRow {
  company: string;
  department: string;
  activeCards: string;
  spendMtd: string;
  budgetPct: number;
  budgetAmount: string;
  progressColor: string;
  violationText: string;
  violationBadgeClass: string;
}

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

@Component({
  selector: 'app-card-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-analytics.html',
  styleUrls: ['./card-analytics.css'],
  encapsulation: ViewEncapsulation.None                       
})
export class CardAnalyticsComponent {
  activeModal: string | null = null;

  // Multi-step states
  exportStep: number = 1;
  schedStep: number = 1;

  // Tab state per prefix
  activeTabs: Record<string, string> = {'build': 'fields', 'repl': 'reasons'};

  // Saved states for action modals
  buildReportSaved: boolean = false;
  globalFilterSaved: boolean = false;
  merchantCrossSellSaved: boolean = false;
  churnRiskSaved: boolean = false;
  upsellOpportunitySaved: boolean = false;
  complianceTaxSaved: boolean = false;

  // Stepper labels
  exportStepperLabels: string[] = ['Data', 'Options', 'Ready'];
  schedStepperLabels: string[] = ['Report', 'Timing', 'Delivery'];

  /* ─── MOCK DATA ARRAYS ────────────────────────────────────────── */

  heroStats: HeroStat[] = [
    {
      label: 'TOTAL ACTIVE CARDS',
      labelStyle: 'color:var(--pm-accent-soft)',
      value: '45,210',
      cardExtraClass: 'pm-card-hero',
      badge: {
        icon: 'bi bi-arrow-up',
        text: '+1,200 this week',
        badgeClass: 'pm-badge-success',
        badgeStyle: 'background:rgba(16,185,129,0.2);color:#A7F3D0'
      },
      breakdownStyle: 'font-size:11px;color:rgba(255,255,255,0.7)',
      breakdowns: [
        { label: 'Debit (Physical/Virtual)', value: '32,010' },
        { label: 'Credit', value: '10,050' },
        { label: 'Prepaid', value: '3,150' }
      ]
    },
    {
      label: 'MONTHLY CARD VOLUME',
      labelStyle: 'color:var(--pm-info)',
      value: 'KES 1.2B',
      badge: {
        icon: 'bi bi-graph-up-arrow',
        text: '+8.4% MoM',
        badgeClass: 'pm-badge-success'
      },
      breakdownStyle: 'font-size:11px;color:var(--pm-ink-soft)',
      breakdowns: [
        { label: 'Total Transactions', value: '2.1M' },
        { label: 'Avg Ticket Size', value: 'KES 571' },
        { label: 'Auth Rate', value: '98.2%', valueStyle: 'color:var(--pm-accent)' }
      ]
    },
    {
      label: 'GROSS REVENUE (MTD)',
      labelStyle: 'color:var(--pm-accent)',
      value: 'KES 18.5M',
      badge: {
        icon: 'bi bi-cash-coin',
        text: '+12.1% YoY',
        badgeClass: 'pm-badge-success'
      },
      breakdownStyle: 'font-size:11px;color:var(--pm-ink-soft)',
      breakdowns: [
        { label: 'Interchange', value: 'KES 12.2M' },
        { label: 'FX Spread', value: 'KES 4.1M' },
        { label: 'Card Fees', value: 'KES 2.2M' }
      ]
    },
    {
      label: 'RISK & COMPLIANCE',
      labelStyle: 'color:var(--pm-warning)',
      value: '1,420',
      cardStyle: 'border-left:3px solid var(--pm-warning)',
      badge: {
        icon: 'bi bi-exclamation-triangle',
        text: 'Cards at Churn Risk',
        badgeClass: 'pm-badge-warning'
      },
      breakdownStyle: 'font-size:11px;color:var(--pm-ink-soft)',
      breakdowns: [
        { label: 'Corp. Policy Violations', value: '42 Flags', valueStyle: 'color:var(--pm-danger)' },
        { label: 'Chargebacks (Rate)', value: '18 (0.01%)' },
        { label: 'Unactivated Cards', value: '890' }
      ]
    }
  ];

  issuanceFunnel: FunnelStep[] = [
    { label: 'Applications / Requested', value: '5,200', width: 100, color: 'var(--pm-border-2)' },
    { label: 'Approved & Issued', value: '4,500 (86%)', width: 86, color: 'var(--pm-info)' },
    { label: 'Activated', value: '3,690 (82%)', width: 71, color: 'var(--pm-primary)' },
    { label: 'First Transaction Made', value: '3,100 (84%)', width: 60, color: 'var(--pm-accent)' }
  ];

  revenueBoxes: RevenueBox[] = [
    {
      label: 'NET REVENUE / CARD',
      labelStyle: 'font-size:11px;font-weight:700;color:#047857',
      value: 'KES 410',
      valueStyle: 'font-size:24px;font-weight:700;color:var(--pm-accent)',
      bgStyle: 'background:var(--pm-accent-soft)'
    },
    {
      label: 'LIFETIME VALUE (EST)',
      labelStyle: 'font-size:11px;font-weight:700;color:#1D4ED8',
      value: 'KES 12,400',
      valueStyle: 'font-size:24px;font-weight:700;color:var(--pm-info)',
      bgStyle: 'background:var(--pm-info-soft)'
    }
  ];

  channelBars: ChannelBar[] = [
    { label: 'POS', height: 45, color: 'var(--pm-warning)', title: 'POS: 45%', showInLegend: true },
    { label: 'Online', height: 35, color: 'var(--pm-info)', title: 'Online: 35%', showInLegend: true },
    { label: 'ATM', height: 15, color: 'var(--pm-primary)', title: 'ATM: 15%', showInLegend: true },
    { label: 'Mobile', height: 5, color: 'var(--pm-accent)', title: 'Mobile: 5%', showInLegend: false }
  ];

  consumerInsights: StatusRow[] = [
    { name: 'Supermarkets & Grocery', subtitle: '22% of total spend', value: 'KES 264M' },
    { name: 'Dining & Restaurants', subtitle: '18% of total spend', value: 'KES 216M' },
    { name: 'Fuel & Auto', subtitle: '14% of total spend', value: 'KES 168M' },
    { name: 'Travel & Airline', subtitle: '10% of total spend', value: 'KES 120M' }
  ];

  merchantIntelligence: StatusRow[] = [
    { name: 'Naivas Supermarket', subtitle: '98k txns · High Loyalty', value: '#1' },
    { name: 'Safaricom Postpay/Airtime', subtitle: '85k txns · Recurring', value: '#2' }
  ];

  predictiveCallouts: PredictiveCallout[] = [
    {
      extraClass: 'mb-2',
      bgStyle: 'background:var(--pm-danger-soft)',
      label: 'CHURN WARNING',
      labelStyle: 'font-size:11px;font-weight:700;color:#991B1B',
      value: '1,420 Cards',
      valueStyle: 'font-size:18px;font-weight:700;color:var(--pm-danger)',
      subtitle: 'Cards with >30% volume drop last 60 days',
      subtitleStyle: 'font-size:11px;color:#7F1D1D;margin-top:4px',
      buttonText: 'Action',
      buttonClass: 'pm-btn pm-btn-sm pm-btn-danger',
      modalId: 'churnRiskModal'
    },
    {
      bgStyle: 'background:var(--pm-accent-soft)',
      label: 'UPSELL OPPORTUNITIES',
      labelStyle: 'font-size:11px;font-weight:700;color:#047857',
      value: '412 Users',
      valueStyle: 'font-size:18px;font-weight:700;color:var(--pm-accent)',
      subtitle: 'Debit users eligible for Credit Limits',
      subtitleStyle: 'font-size:11px;color:#065F46;margin-top:4px',
      buttonText: 'View',
      buttonClass: 'pm-btn pm-btn-sm pm-btn-accent',
      modalId: 'upsellOpportunityModal'
    }
  ];

  corpSpendRows: CorpSpendRow[] = [
    {
      company: 'Acme Logistics',
      department: 'Fleet & Ops',
      activeCards: '145',
      spendMtd: 'KES 3.4M',
      budgetPct: 78,
      budgetAmount: 'KES 4.3M',
      progressColor: 'var(--pm-info)',
      violationText: '12 Flagged',
      violationBadgeClass: 'pm-badge-warning'
    },
    {
      company: 'TechStart Inc',
      department: 'Engineering & SaaS',
      activeCards: '42',
      spendMtd: 'KES 1.8M',
      budgetPct: 92,
      budgetAmount: 'KES 1.9M',
      progressColor: 'var(--pm-warning)',
      violationText: '2 Critical',
      violationBadgeClass: 'pm-badge-danger'
    },
    {
      company: 'Nairobi Hospital',
      department: 'Procurement',
      activeCards: '18',
      spendMtd: 'KES 8.5M',
      budgetPct: 45,
      budgetAmount: 'KES 18.0M',
      progressColor: 'var(--pm-accent)',
      violationText: '0 Flags',
      violationBadgeClass: 'pm-badge-success'
    }
  ];

  /* ─── MODAL OPEN / CLOSE ────────────────────────────────────────── */

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

  /* ─── MULTI-STEP: EXPORT REPORT ─────────────────────────────────── */

  nextExportStep(): void {
    if (this.exportStep === 2) {
      this.exportStep = 3;
      return;
    }
    if (this.exportStep >= 3) {
      this.closeModal();
      this.resetExportFlow();
      return;
    }
    this.exportStep++;
  }

  resetExportFlow(): void {
    this.exportStep = 1;
  }

  /* ─── MULTI-STEP: SCHEDULE REPORT ───────────────────────────────── */

  nextSchedStep(): void {
    if (this.schedStep === 2) {
      this.schedStep = 3;
      return;
    }
    if (this.schedStep >= 3) {
      this.closeModal();
      this.resetSchedFlow();
      return;
    }
    this.schedStep++;
  }

  resetSchedFlow(): void {
    this.schedStep = 1;
  }

  /* ─── TAB SWITCHING ─────────────────────────────────────────────── */

  switchTab(prefix: string, key: string, event: Event): void {
    this.activeTabs[prefix] = key;
    const btn = event.target as HTMLElement;
    if (btn && btn.parentElement) {
      btn.parentElement.querySelectorAll('.pm-tab-pill').forEach((b: Element) => b.classList.remove('active'));
      btn.classList.add('active');
    }
  }

  /* ─── RADIO CARD SELECTION ──────────────────────────────────────── */

  selectRadioCard(event: Event): void {
    const card = (event.target as HTMLElement).closest('.border');
    if (!card || !card.parentElement) return;
    card.parentElement.querySelectorAll('.border').forEach((b: Element) => {
      (b as HTMLElement).style.borderColor = '';
      (b as HTMLElement).style.background = '';
      const r = b.querySelector('input[type=radio]') as HTMLInputElement;
      if (r) r.checked = false;
    });
    (card as HTMLElement).style.borderColor = 'var(--pm-primary)';
    (card as HTMLElement).style.background = 'rgba(79,70,229,.04)';
    const radio = card.querySelector('input[type=radio]') as HTMLInputElement;
    if (radio) radio.checked = true;
  }

  /* ─── PROCESS ACTION ────────────────────────────────────────────── */

  processAction(modalId: string, msg: string, ref: string): void {
    const savedVar = modalId.replace('Modal', 'Saved') as keyof this;
    (this as any)[savedVar] = true;
  }

  /* ─── RESET ALL ─────────────────────────────────────────────────── */

  resetAllModals(): void {
    this.activeModal = null;
    this.exportStep = 1;
    this.schedStep = 1;
    this.buildReportSaved = false;
    this.globalFilterSaved = false;
    this.merchantCrossSellSaved = false;
    this.churnRiskSaved = false;
    this.upsellOpportunitySaved = false;
    this.complianceTaxSaved = false;
    this.activeTabs = {'build': 'fields', 'repl': 'reasons'};
  }
}