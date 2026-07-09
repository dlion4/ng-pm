import { Component, OnInit, Renderer2, ViewEncapsulation, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

declare const bootstrap: any;

/* ─── Interfaces ─── */
export interface Bank {
  name: string;
  status: string;
  health: string;
  rails: string;
  settle: string;
  limit: string;
  color: string;
}

export interface RoutingRule {
  name: string;
  amount: string;
  rail: string;
  fallback: string;
  priority: number;
  status: string;
}

export interface RailConfig {
  name: string;
  enabled: boolean;
  cutoff: string;
  perTx: string;
  daily: string;
  webhook: string;
}

export interface NostroAccount {
  name: string;
  currency: string;
  balance: string;
  bank: string;
  status: string;
}

export interface FlowState {
  current: number;
  total: number;
  steps: string[];
}

@Component({
  selector: 'app-payment-rails',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-rails.html',
  styleUrls: ['./payment-rails.css'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentRailsComponent implements OnInit {

  /* ─── Dynamic Data (replace with API calls) ──────────────────── */
  banks: Bank[] = [
    { name: 'Equity Bank', status: 'active', health: 'degraded', rails: 'PesaLink,RTGS,ACH', settle: '09:00-16:00', limit: 'KES 100M', color: '#EF4444' },
    { name: 'KCB Bank', status: 'active', health: 'healthy', rails: 'PesaLink,RTGS,ACH,Card', settle: '08:00-17:00', limit: 'KES 200M', color: '#10B981' },
    { name: 'Co-operative Bank', status: 'active', health: 'healthy', rails: 'PesaLink,RTGS,ACH', settle: '09:00-16:00', limit: 'KES 150M', color: '#10B981' },
    { name: 'Absa Bank', status: 'active', health: 'healthy', rails: 'PesaLink,RTGS,SWIFT', settle: '08:30-16:30', limit: 'KES 250M', color: '#10B981' },
    { name: 'Stanbic Bank', status: 'active', health: 'healthy', rails: 'PesaLink,RTGS,ACH,SWIFT', settle: '09:00-17:00', limit: 'KES 300M', color: '#10B981' },
    { name: 'Family Bank', status: 'paused', health: 'paused', rails: 'PesaLink,ACH', settle: '09:00-15:00', limit: 'KES 50M', color: '#9CA3AF' },
    { name: 'DTB Bank', status: 'active', health: 'healthy', rails: 'PesaLink,RTGS,Card', settle: '08:00-16:00', limit: 'KES 120M', color: '#10B981' },
    { name: 'I&M Bank', status: 'active', health: 'healthy', rails: 'PesaLink,RTGS,ACH', settle: '09:00-16:00', limit: 'KES 180M', color: '#10B981' }
  ];

  routingRules: RoutingRule[] = [
    { name: 'High-Value Instant', amount: 'KES 1M–50M', rail: 'PesaLink', fallback: 'RTGS', priority: 1, status: 'Active' },
    { name: 'Salary Batch', amount: 'KES 500K+', rail: 'ACH', fallback: 'PesaLink', priority: 2, status: 'Active' },
    { name: 'International USD', amount: 'USD 10K+', rail: 'SWIFT', fallback: '—', priority: 3, status: 'Paused' },
    { name: 'Low-Value Fast', amount: 'KES 1–100K', rail: 'Card-to-Bank', fallback: 'PesaLink', priority: 1, status: 'Active' }
  ];

  railConfigs: RailConfig[] = [
    { name: 'PesaLink Instant', enabled: true, cutoff: '16:00', perTx: 'KES 100M', daily: 'KES 2B', webhook: 'Active' },
    { name: 'RTGS', enabled: true, cutoff: '15:30', perTx: 'KES 500M', daily: 'KES 10B', webhook: 'Active' },
    { name: 'ACH', enabled: true, cutoff: '14:00', perTx: 'KES 50M', daily: 'KES 1B', webhook: 'Active' },
    { name: 'SWIFT', enabled: false, cutoff: '12:00', perTx: 'USD 1M', daily: 'USD 50M', webhook: 'Inactive' },
    { name: 'Card-to-Bank', enabled: true, cutoff: '23:59', perTx: 'KES 500K', daily: 'KES 5M', webhook: 'Active' }
  ];

  nostroAccounts: NostroAccount[] = [
    { name: 'Nostro USD', currency: 'USD', balance: '$2,847,500', bank: 'Standard Chartered NY', status: 'Matched' },
    { name: 'Nostro EUR', currency: 'EUR', balance: '€1,204,800', bank: 'Deutsche Bank Frankfurt', status: 'Matched' },
    { name: 'Nostro GBP', currency: 'GBP', balance: '£892,400', bank: 'Barclays London', status: 'Investigate' },
    { name: 'Vostro KES', currency: 'KES', balance: 'KES 184.2M', bank: 'PayMo Settlement', status: 'Matched' }
  ];

  /* ─── Flow State ─────────────────────────────────────────────── */
  flows: Record<string, FlowState> = {
    addBank: { current: 1, total: 4, steps: ['Bank', 'Rails', 'Limits', 'Done'] }
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

  /* ─── Tab switcher (for pills) ─── */
  sw(prefix: string, key: string, event?: Event): void {
    if (event) {
      const btn = event.target as HTMLElement;
      const parent = btn.parentElement;
      if (parent) {
        parent.querySelectorAll('.pill').forEach((b: any) => b.classList.remove('active'));
      }
      btn.classList.add('active');
      this.document.querySelectorAll('[id^="' + prefix + '-"]').forEach((p: any) => p.classList.remove('active'));
      const panel = this.document.getElementById(prefix + '-' + key);
      if (panel) panel.classList.add('active');
    }
  }

  /* ─── Stepper flow ─── */
  nextFlow(key: string, total: number): void {
    const flow = this.flows[key];
    const modalMap: Record<string, string> = { addBank: 'addBankModal' };

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
        this.resetFlow('addBank');
      });
    });
  }
}