import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const bootstrap: any;

/* ─── Interfaces ─── */
interface BankFloat {
  name: string;
  account: string;
  float: string;
  threshold: string;
  status: string;
  action: string;
}

interface Agent {
  name: string;
  location: string;
  current: string;
  min: string;
  status: string;
}

interface Partner {
  name: string;
  balance: string;
  status: string;
}

interface Alert {
  title: string;
  detail: string;
  severity: string;
}

interface Rebalance {
  time: string;
  from: string;
  to: string;
  amount: string;
  status: string;
  ref: string;
}

interface Settlement {
  batch: string;
  counterparty: string;
  amount: string;
  status: string;
  variance: string;
}

interface Governance {
  time: string;
  action: string;
  initiator: string;
  approver: string;
  amount: string;
  status: string;
}

interface Activity {
  time: string;
  action: string;
  from: string;
  to: string;
  amount: string;
  status: string;
  ref: string;
}

@Component({
  selector: 'app-liquidity-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './liquidity-management.html',
  styleUrls: ['./liquidity-management.css'],
  encapsulation: ViewEncapsulation.None
})
export class LiquidityManagementComponent implements OnInit {

  /* ─── Dynamic Data (replace with API calls) ──────────────────── */
  bankFloats: BankFloat[] = [
    { name: 'KCB Bank', account: 'KCB-447291', float: 'KES 142.8M', threshold: 'KES 80M', status: 'Healthy', action: 'Manage' },
    { name: 'Equity Bank', account: 'EQB-991023', float: 'KES 98.4M', threshold: 'KES 60M', status: 'Healthy', action: 'Manage' },
    { name: 'Co-op Bank', account: 'COOP-334871', float: 'KES 41.2M', threshold: 'KES 45M', status: 'Warning', action: 'Top-up' },
    { name: 'Absa Bank', account: 'ABSA-772910', float: 'KES 67.9M', threshold: 'KES 40M', status: 'Healthy', action: 'Manage' },
    { name: 'Stanbic Bank', account: 'STB-556102', float: 'KES 12.4M', threshold: 'KES 25M', status: 'Critical', action: 'Emergency' },
  ];

  criticalAgents: Agent[] = [
    { name: "John's M-Pesa", location: 'Kawangware', current: 'KES 18,400', min: 'KES 50,000', status: 'Critical' },
    { name: 'Grace Kiosk', location: 'Kayole', current: 'KES 29,100', min: 'KES 40,000', status: 'Low' },
    { name: 'Peter Agent', location: 'Embakasi', current: 'KES 12,800', min: 'KES 35,000', status: 'Critical' },
  ];

  partners: Partner[] = [
    { name: 'Safaricom M-Pesa', balance: 'KES 1.24B', status: 'Healthy' },
    { name: 'Airtel Money', balance: 'KES 312M', status: 'Healthy' },
    { name: 'Telkom T-Kash', balance: 'KES 87M', status: 'Warning' },
    { name: 'Equity Pay', balance: 'KES 156M', status: 'Healthy' },
  ];

  alerts: Alert[] = [
    { title: 'Stanbic Bank float critical', detail: '12.4M / 25M threshold', severity: 'Critical' },
    { title: 'Co-op Bank warning', detail: '41.2M / 45M threshold', severity: 'Warning' },
    { title: '12 agents below minimum', detail: 'Auto-replenishment failed', severity: 'Warning' },
    { title: 'Equity settlement variance', detail: 'KES 1.8M mismatch', severity: 'Investigate' },
  ];

  rebalances: Rebalance[] = [
    { time: '27 Jun 14:22', from: 'PayMo Main', to: 'Stanbic Bank', amount: 'KES 25.0M', status: 'Completed', ref: 'RB-44291' },
    { time: '27 Jun 11:45', from: 'Equity Bank', to: 'Co-op Bank', amount: 'KES 12.5M', status: 'Completed', ref: 'RB-44288' },
    { time: '27 Jun 09:10', from: 'PayMo Main', to: 'Agent Pool', amount: 'KES 8.0M', status: 'Completed', ref: 'RB-44285' },
  ];

  settlements: Settlement[] = [
    { batch: 'SB-44291', counterparty: 'Equity Bank', amount: 'KES 87.4M', status: 'Variance', variance: 'KES 1.8M' },
    { batch: 'SB-44290', counterparty: 'KCB Bank', amount: 'KES 112.6M', status: 'Matched', variance: 'KES 0' },
    { batch: 'SB-44289', counterparty: 'Co-op Bank', amount: 'KES 54.2M', status: 'Matched', variance: 'KES 0' },
  ];

  governance: Governance[] = [
    { time: '26 Jun 22:14', action: 'Emergency top-up', initiator: 'System', approver: 'CFO (auto)', amount: 'KES 80M', status: 'Executed' },
    { time: '25 Jun 14:02', action: 'Float rebalance override', initiator: 'Liquidity Mgr', approver: 'Treasurer', amount: 'KES 45M', status: 'Executed' },
    { time: '24 Jun 09:30', action: 'Threshold change', initiator: 'Ops Lead', approver: 'Risk Committee', amount: '—', status: 'Approved' },
  ];

  activities: Activity[] = [
    { time: '27 Jun 14:22', action: 'Rebalance', from: 'PayMo Main', to: 'Stanbic', amount: 'KES 25.0M', status: 'Success', ref: 'RB-44291' },
    { time: '27 Jun 11:45', action: 'Top-up', from: 'KCB', to: 'Co-op', amount: 'KES 12.5M', status: 'Success', ref: 'TP-44288' },
    { time: '27 Jun 09:10', action: 'Agent top-up', from: 'Agent Pool', to: "John's M-Pesa", amount: 'KES 50,000', status: 'Success', ref: 'AG-44285' },
    { time: '26 Jun 22:14', action: 'Emergency', from: 'Reserve', to: 'Equity', amount: 'KES 80.0M', status: 'Success', ref: 'EM-44279' },
  ];

  /* ─── Tab State ──────────────────────────────────────────────── */
  activeAgentTab = 'agent-low';
  activeForeTab = 'fore-48h';
  activeSettTab = 'sett-today';
  activeGovTab = 'gov-actions';

  /* ─── Flow State ─────────────────────────────────────────────── */
  rebalSteps = ['Source', 'Amount', 'Approve', 'Done'];
  rebalCurrentStep = 1;

  emergSteps = ['Facility', 'Amount', 'Approve', 'Done'];
  emergCurrentStep = 1;

  /* ─── Modal Backups ──────────────────────────────────────────── */
  private modalBackups: Map<string, { body: string; footer: string }> = new Map();

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.cacheModals();
  }

  /* ─── Modal helpers ─── */
  openModal(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      const modal = bootstrap.Modal.getOrCreateInstance(el);
      modal.show();
    }
  }

  closeModal(id: string): void {
    const el = document.getElementById(id);
    if (!el) return;
    const m = bootstrap.Modal.getInstance(el);
    if (m) { m.hide(); }
  }

  /* ─── Tab switcher ─── */
  sw(prefix: string, key: string, event?: Event): void {
    if (event) {
      const btn = event.target as HTMLElement;
      const parent = btn.parentElement;
      if (parent) {
        parent.querySelectorAll('.pill').forEach((b: any) => b.classList.remove('active'));
      }
      btn.classList.add('active');
    }
    const tabId = prefix + '-' + key;
    if (prefix === 'agent') this.activeAgentTab = tabId;
    if (prefix === 'fore') this.activeForeTab = tabId;
    if (prefix === 'sett') this.activeSettTab = tabId;
    if (prefix === 'gov') this.activeGovTab = tabId;
  }

  /* ─── Stepper flow ─── */
  nextFlow(key: string, total: number): void {
    const stepKey = (key + 'CurrentStep') as 'rebalCurrentStep' | 'emergCurrentStep';
    let current = this[stepKey];
    const modalMap: Record<string, string> = { rebal: 'rebalanceModal', emerg: 'emergencyLiquidityModal' };

    if (current === total - 1) {
      this.showLoading(modalMap[key], () => { this[stepKey] = total; });
      return;
    }
    if (current >= total) {
      this.closeModal(modalMap[key]);
      this.resetFlow(key);
      return;
    }
    this[stepKey]++;
  }

  resetFlow(key: string): void {
    if (key === 'rebal') this.rebalCurrentStep = 1;
    if (key === 'emerg') this.emergCurrentStep = 1;
  }

  /* ─── Loading overlay ─── */
  showLoading(modalId: string, cb: () => void): void {
    const modal = document.getElementById(modalId);
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
    const modal = document.getElementById(modalId);
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
    document.querySelectorAll('.R').forEach((m: any) => {
      const b = m.querySelector('.modal-body');
      const f = m.querySelector('.modal-footer');
      if (b) {
        this.modalBackups.set(m.id, { body: b.innerHTML, footer: f ? f.innerHTML : '' });
      }
    });

    document.querySelectorAll('.R').forEach((m: any) => {
      m.addEventListener('hidden.bs.modal', () => {
        const backup = this.modalBackups.get(m.id);
        if (backup) {
          const b = m.querySelector('.modal-body');
          const f = m.querySelector('.modal-footer');
          if (b) b.innerHTML = backup.body;
          if (f && backup.footer) f.innerHTML = backup.footer;
        }
        this.resetFlow('rebal');
        this.resetFlow('emerg');
      });
    });
  }
}