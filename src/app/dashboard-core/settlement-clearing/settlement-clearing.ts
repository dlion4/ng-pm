import { Component, OnInit, Renderer2, ViewEncapsulation, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

declare const bootstrap: any;

/* ─── Interfaces ─── */
export interface SettlementChannel {
  channel: string;
  volumeToday: string;
  success: string;
  successClass: string;
  pending: string;
  avgTime: string;
  status: string;
  statusClass: string;
}

export interface ActiveSettlement {
  ref: string;
  fromTo: string;
  amount: string;
  channel: string;
  status: string;
  statusClass: string;
  eta: string;
  actionLabel: string;
}

export interface ReconciliationItem {
  batch: string;
  expected: string;
  actual: string;
  variance: string;
  varianceClass: string;
  status: string;
  statusClass: string;
}

export interface ActivityItem {
  time: string;
  ref: string;
  fromTo: string;
  amount: string;
  channel: string;
  status: string;
  statusClass: string;
  actionLabel: string;
}

export interface AttentionItem {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  actionClass: string;
  modalTarget: string;
}

export interface SuggestionItem {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  modalTarget: string;
}

export interface NostroAccount {
  account: string;
  bank: string;
  currency: string;
  balance: string;
  lastMovement: string;
}

export interface RegulatoryReport {
  name: string;
  dateInfo: string;
  status: string;
  statusClass: string;
}

export interface AutoRule {
  name: string;
  description: string;
  active: boolean;
}

export interface BatchItem {
  batch: string;
  channel: string;
  items: number;
  amount: string;
  status: string;
  statusClass: string;
}

export interface DisputeItem {
  id: string;
  parties: string;
  amount: string;
}

export interface HeroStats {
  settledToday: string;
  transactions: string;
  successRate: string;
  batchesProcessed: string;
  disputesUnderReview: string;
  pendingClearing: string;
  pendingBatches: string;
  rtgsPending: string;
  pesalinkPending: string;
  openDisputes: number;
  atRiskAmount: string;
  highValueDisputes: number;
  mediumDisputes: number;
  autoResolvedToday: number;
}

export interface FlowState {
  current: number;
  total: number;
  steps: string[];
}

@Component({
  selector: 'app-settlement-clearing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settlement-clearing.html',
  styleUrls: ['./settlement-clearing.css'],
  encapsulation: ViewEncapsulation.None
})
export class SettlementClearingComponent implements OnInit {

  /* ─── Hero Stats ─────────────────────────────────────────────── */
  heroStats: HeroStats = {
    settledToday: 'KES 2.84B',
    transactions: '1,284',
    successRate: '99.7%',
    batchesProcessed: '14',
    disputesUnderReview: '3',
    pendingClearing: 'KES 184.6M',
    pendingBatches: '47',
    rtgsPending: 'KES 92M',
    pesalinkPending: 'KES 92.6M',
    openDisputes: 3,
    atRiskAmount: 'KES 4.2M',
    highValueDisputes: 1,
    mediumDisputes: 2,
    autoResolvedToday: 9
  };

  /* ─── Dynamic Data (replace with API calls) ──────────────────── */
  channels: SettlementChannel[] = [
    { channel: 'RTGS (KES)', volumeToday: 'KES 1.42B', success: '99.4%', successClass: 'B-s', pending: 'KES 92M', avgTime: '42m', status: 'Healthy', statusClass: 'B-s' },
    { channel: 'PesaLink', volumeToday: 'KES 984M', success: '99.9%', successClass: 'B-s', pending: 'KES 41M', avgTime: '8s', status: 'Healthy', statusClass: 'B-s' },
    { channel: 'EFT / ACH', volumeToday: 'KES 312M', success: '98.1%', successClass: 'B-w', pending: 'KES 51M', avgTime: '3.2h', status: 'Delayed', statusClass: 'B-w' },
    { channel: 'SWIFT (Cross-border)', volumeToday: 'USD 4.8M', success: '100%', successClass: 'B-s', pending: 'USD 0.2M', avgTime: '4.1h', status: 'Healthy', statusClass: 'B-s' }
  ];

  activeSettlements: ActiveSettlement[] = [
    { ref: 'SET-88421', fromTo: 'Equity → KCB', amount: 'KES 45.0M', channel: 'RTGS', status: 'In Progress', statusClass: 'B-i', eta: '14m', actionLabel: 'Track' },
    { ref: 'SET-88422', fromTo: 'Co-op → Stanbic', amount: 'KES 12.8M', channel: 'PesaLink', status: 'Settled', statusClass: 'B-s', eta: '—', actionLabel: 'Receipt' },
    { ref: 'SET-88423', fromTo: 'Absa → NCBA', amount: 'KES 8.4M', channel: 'RTGS', status: 'Retry #2', statusClass: 'B-w', eta: '32m', actionLabel: 'Force' }
  ];

  reconciliationItems: ReconciliationItem[] = [
    { batch: 'BAT-21092', expected: 'KES 184.2M', actual: 'KES 184.2M', variance: '0', varianceClass: 'B-s', status: 'Matched', statusClass: 'B-s' },
    { batch: 'BAT-21093', expected: 'KES 67.8M', actual: 'KES 65.1M', variance: '-KES 2.7M', varianceClass: 'B-d', status: 'Exception', statusClass: 'B-w' }
  ];

  activities: ActivityItem[] = [
    { time: '14:32', ref: 'SET-88422', fromTo: 'Co-op → Stanbic', amount: 'KES 12.8M', channel: 'PesaLink', status: 'Settled', statusClass: 'B-s', actionLabel: 'Receipt' },
    { time: '14:28', ref: 'SET-88421', fromTo: 'Equity → KCB', amount: 'KES 45.0M', channel: 'RTGS', status: 'In Progress', statusClass: 'B-i', actionLabel: 'Track' },
    { time: '14:15', ref: 'BAT-21093', fromTo: 'Multiple', amount: 'KES 67.8M', channel: 'RTGS', status: 'Exception', statusClass: 'B-w', actionLabel: 'Investigate' }
  ];

  attentionItems: AttentionItem[] = [
    { icon: 'bi-exclamation-triangle', iconBg: 'var(--pm-danger-soft)', iconColor: 'var(--pm-danger)', title: 'High-value settlement failed', subtitle: 'Equity → KCB • KES 18.4M • Retry pending', actionLabel: 'Retry', actionClass: 'btn-pm-d', modalTarget: 'retrySettlementModal' },
    { icon: 'bi-clock', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'RTGS cut-off in 47 minutes', subtitle: '14 batches queued • KES 92M', actionLabel: 'Prioritize', actionClass: '', modalTarget: 'batchInboxModal' },
    { icon: 'bi-shield-exclamation', iconBg: 'var(--pm-purple-soft)', iconColor: 'var(--pm-purple)', title: 'Dispute #SET-44892 awaiting evidence', subtitle: 'Co-op Bank • KES 2.1M', actionLabel: 'Respond', actionClass: '', modalTarget: 'disputeModal' }
  ];

  suggestions: SuggestionItem[] = [
    { icon: 'bi-lightning-charge', iconBg: 'var(--pm-accent-soft)', iconColor: 'var(--pm-accent)', title: 'Enable auto-retry on 3 failed batches', subtitle: 'Recover KES 12.4M automatically', modalTarget: 'autoRulesModal' },
    { icon: 'bi-graph-up', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', title: 'Shift 4 batches to PesaLink', subtitle: 'Save KES 18,400 in RTGS fees', modalTarget: 'batchInboxModal' },
    { icon: 'bi-calendar-event', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'Schedule weekend settlement run', subtitle: 'Reduce Monday morning backlog', modalTarget: 'settlementCalendarModal' }
  ];

  nostroAccounts: NostroAccount[] = [
    { account: 'USD Nostro', bank: 'Citibank NY', currency: 'USD', balance: '8,420,000', lastMovement: '26 Jun 2025' },
    { account: 'EUR Nostro', bank: 'Deutsche Bank', currency: 'EUR', balance: '3,210,000', lastMovement: '25 Jun 2025' },
    { account: 'Vostro KES', bank: 'Standard Chartered', currency: 'KES', balance: '124,500,000', lastMovement: '27 Jun 2025' }
  ];

  regulatoryReports: RegulatoryReport[] = [
    { name: 'CBK Daily Settlement Return', dateInfo: '27 Jun 2025 • Submitted 09:12', status: 'Submitted', statusClass: 'B-s' },
    { name: 'KRA Withholding Tax', dateInfo: 'Due 29 Jun 2025', status: 'Pending', statusClass: 'B-w' },
    { name: 'AML Large Transaction Report', dateInfo: '26 Jun 2025 • Submitted', status: 'Submitted', statusClass: 'B-s' }
  ];

  autoRules: AutoRule[] = [
    { name: 'Auto-retry failed RTGS', description: 'Max 3 attempts • 15 min interval', active: true },
    { name: 'Auto-escalate high-value disputes', description: '> KES 5M → Treasury Manager', active: true },
    { name: 'Weekend deferral', description: 'Non-urgent batches held until Monday', active: false }
  ];

  batchItems: BatchItem[] = [
    { batch: 'BAT-21092', channel: 'RTGS', items: 184, amount: 'KES 184.2M', status: 'Ready', statusClass: 'B-s' },
    { batch: 'BAT-21093', channel: 'PesaLink', items: 892, amount: 'KES 67.8M', status: 'Exception', statusClass: 'B-w' }
  ];

  openDisputes: DisputeItem[] = [
    { id: '#SET-44892', parties: 'Co-op vs KCB', amount: 'KES 2.1M' },
    { id: '#SET-44889', parties: 'Equity vs Absa', amount: 'KES 1.8M' }
  ];

  /* ─── Flow State ─────────────────────────────────────────────── */
  flows: Record<string, FlowState> = {
    init: { current: 1, total: 4, steps: ['Parties', 'Channel', 'Confirm', 'Done'] },
    recon: { current: 1, total: 4, steps: ['Select', 'Match', 'Resolve', 'Done'] },
    disp: { current: 1, total: 3, steps: ['Details', 'Evidence', 'Done'] }
  };

  /* ─── Modal Backups ──────────────────────────────────────────── */
  private modalBackups: Map<string, { body: string; footer: string }> = new Map();

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.cacheModals();
  }

  /* ─── Modal helpers ─── */
  openModal(id: string): void {
    const el = this.document.getElementById(id);
    if (el) {
      const modal = bootstrap.Modal.getOrCreateInstance(el);
      modal.show();
    }
  }

  closeModal(id: string): void {
    const el = this.document.getElementById(id);
    if (!el) return;
    const m = bootstrap.Modal.getInstance(el);
    if (m) { m.hide(); }
  }

  /* ─── Tab switcher (for batch inbox pills) ─── */
  sw(prefix: string, key: string, event?: Event): void {
    if (event) {
      const btn = event.target as HTMLElement;
      const parent = btn.parentElement;
      if (parent) {
        parent.querySelectorAll('.pill').forEach((b: any) => b.classList.remove('active'));
      }
      btn.classList.add('active');
    }
  }

  /* ─── Stepper flow ─── */
  nextFlow(key: string, total: number): void {
    const flow = this.flows[key];
    const modalMap: Record<string, string> = { init: 'initiateSettlementModal', recon: 'reconciliationWizardModal', disp: 'disputeModal' };

    if (flow.current === total - 1) {
      this.showLoading(modalMap[key], () => { flow.current = total; });
      return;
    }
    if (flow.current >= total) {
      this.closeModal(modalMap[key]);
      this.resetFlow(key);
      return;
    }
    flow.current++;
  }

  resetFlow(key: string): void {
    this.flows[key].current = 1;
  }

  isStepActive(key: string, step: number): boolean {
    return this.flows[key].current === step;
  }

  isStepDone(key: string, step: number): boolean {
    return this.flows[key].current > step;
  }

  getStepNumber(key: string, step: number): string | number {
    return this.isStepDone(key, step) ? '✓' : step;
  }

  getStepLabel(key: string, step: number): string {
    return this.flows[key].steps[step - 1] || ('Step ' + step);
  }

  shouldShowStepContent(key: string, step: number): boolean {
    return this.flows[key].current === step;
  }

  getNextButtonLabel(key: string): string {
    const flow = this.flows[key];
    return flow.current >= flow.total ? 'Done' : 'Continue';
  }

  /* ─── Loading overlay ─── */
  showLoading(modalId: string, cb: () => void): void {
    const modal = this.document.getElementById(modalId);
    if (!modal) { cb(); return; }
    const body = modal.querySelector('.modal-body');
    if (!body) { cb(); return; }

    const ov = this.renderer.createElement('div');
    this.renderer.addClass(ov, 'loading-ov');
    ov.innerHTML = '<div class="spinner"></div><p style="margin-top:12px;font-size:13px;font-weight:600;color:var(--pm-primary)">Processing...</p>';
    this.renderer.setStyle(body, 'position', 'relative');
    this.renderer.appendChild(body, ov);

    setTimeout(() => {
      this.renderer.removeChild(body, ov);
      cb();
    }, 1500);
  }

  /* ─── Generic action handler ─── */
  doAction(modalId: string, msg: string, ref: string): void {
    const modal = this.document.getElementById(modalId);
    if (!modal) return;

    const body = modal.querySelector('.modal-body') as HTMLElement;
    const footer = modal.querySelector('.modal-footer') as HTMLElement;

    this.showLoading(modalId, () => {
      if (body) {
        body.innerHTML = `
          <div class="receipt">
            <div class="ri"><i class="bi bi-check-lg"></i></div>
            <h5 style="font-weight:700;color:var(--pm-accent)">${msg}</h5>
            ${ref ? `<p style="font-size:12px;color:var(--pm-muted)">Reference: ${ref}</p>` : ''}
            <div class="d-flex justify-content-center mt-3" style="gap:8px">
              <button class="btn-pm btn-sm reload-btn"><i class="bi bi-download"></i> Save</button>
              <button class="btn-pm btn-sm reload-btn"><i class="bi bi-share"></i> Continue</button>
            </div>
          </div>`;
        body.querySelectorAll('.reload-btn').forEach((btn: any) =>
          btn.addEventListener('click', () => this.reloadPage())
        );
      }
      if (footer) {
        footer.innerHTML = '<button class="btn-pm btn-pm-p" data-bs-dismiss="modal">Done</button>';
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

  /* ─── PIN auto-focus ─── */
  nf(event: Event): void {
    const el = event.target as HTMLInputElement;
    if (el.value.length === 1 && el.nextElementSibling) {
      (el.nextElementSibling as HTMLElement).focus();
    }
  }

  /* ─── Modal cache & reset ─── */
  private cacheModals(): void {
    this.document.querySelectorAll('.R').forEach((m: any) => {
      const b = m.querySelector('.modal-body');
      const f = m.querySelector('.modal-footer');
      if (b) {
        this.modalBackups.set(m.id, { body: b.innerHTML, footer: f ? f.innerHTML : '' });
      }
    });

    this.document.querySelectorAll('.R').forEach((m: any) => {
      m.addEventListener('hidden.bs.modal', () => {
        const backup = this.modalBackups.get(m.id);
        if (backup) {
          const b = m.querySelector('.modal-body');
          const f = m.querySelector('.modal-footer');
          if (b) b.innerHTML = backup.body;
          if (f && backup.footer) f.innerHTML = backup.footer;
        }
        this.resetFlow('init');
        this.resetFlow('recon');
        this.resetFlow('disp');
      });
    });
  }
}