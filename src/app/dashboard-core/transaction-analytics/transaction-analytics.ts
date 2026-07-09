import { Component, OnInit, Renderer2, ViewEncapsulation, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

declare const bootstrap: any;

/* ─── Interfaces ─── */
export interface FlowState {
  current: number;
  total: number;
  steps: string[];
}

@Component({
  selector: 'app-transaction-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./transaction-analytics.html',
  styleUrls: ['./transaction-analytics.css'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionAnalyticsComponent implements OnInit {

  /* ─── Flow State ─────────────────────────────────────────────── */
  flows: Record<string, FlowState> = {
    rb: { current: 1, total: 4, steps: ['Type', 'Columns', 'Delivery', 'Done'] }
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
    const modalMap: Record<string, string> = { rb: 'reportBuilderModal' };

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
        this.resetFlow('rb');
      });
    });
  }
}