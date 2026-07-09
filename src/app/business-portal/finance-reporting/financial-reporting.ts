import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SavedModal { message: string; ref: string; }

interface AttentionItem {
  id: string; iconText: string; iconBg: string; iconColor: string;
  title: string; subtitle: string; buttonLabel: string; modalId: string;
}

interface ReportCard {
  id: string; title: string; subtitle: string; icon: string; modalId: string;
}

@Component({
  selector: 'app-financial-reporting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './financial-reporting.html',
  styleUrls: ['./financial-reporting.css'],
  encapsulation: ViewEncapsulation.None
})
export class FinancialReportingComponent {
  activeModal: string | null = null;
  loadingModal: string | null = null;
  toastMessage = '';
  savedModals: Record<string, SavedModal> = {};
  modalTableHeaders: string[] = ['Item', 'Detail', 'Value', 'Status'];

  stepState: Record<string, number> = { gcr: 1, mec: 1 };
  stepperLabels: Record<string, string[]> = {
    gcr: ['Type', 'Filters', 'Delivery'],
    mec: ['Checks', 'Lock', 'Done'],
  };
  flowButtonDefaults: Record<string, string> = { gcr: 'Continue', mec: 'Continue' };

  // legacy aliases used by older template bindings
  gcrStep = 1;
  mecStep = 1;
  gcrStepperLabels: string[] = ['Type', 'Filters', 'Delivery'];
  mecStepperLabels: string[] = ['Checks', 'Lock', 'Done'];
  generateCustomReportSaved = false;

  activeTabs: Record<string, string> = { cfTab: '7day', veTab: 'category' };

  attentionItems: AttentionItem[] = [
    { id: 'a1', iconText: 'ME', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'Month-end close due', subtitle: '3 open journals remaining', buttonLabel: 'Close', modalId: 'runMonthEndModal' },
    { id: 'a2', iconText: 'TX', iconBg: 'var(--pm-danger-soft)', iconColor: 'var(--pm-danger)', title: 'VAT filing window', subtitle: 'KRA due in 4 days', buttonLabel: 'Export', modalId: 'exportKRAVATModal' },
    { id: 'a3', iconText: 'RC', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', title: '12 recon exceptions', subtitle: 'Unmatched bank lines', buttonLabel: 'Resolve', modalId: 'reconciliationExceptionsModal' },
  ];

  reportCards: ReportCard[] = [
    { id: 'r1', title: 'Trial Balance', subtitle: 'Period-locked GL export', icon: 'bi bi-file-earmark-spreadsheet', modalId: 'exportTrialBalanceModal' },
    { id: 'r2', title: 'P&L Snapshot', subtitle: 'Management view', icon: 'bi bi-pie-chart', modalId: 'plSnapshotModal' },
    { id: 'r3', title: 'Cash Flow', subtitle: '7/30/90 day forecast', icon: 'bi bi-graph-up', modalId: 'cashFlowForecastModal' },
    { id: 'r4', title: 'Tax Readiness', subtitle: 'PAYE / VAT / WHT', icon: 'bi bi-shield-check', modalId: 'taxReadinessModal' },
  ];

  auditRows: string[][] = [
    ['28 Jun 09:12', 'CFO', 'Exported VAT pack', 'Success'],
    ['27 Jun 18:40', 'Controller', 'Locked AP subledger', 'Success'],
    ['27 Jun 11:02', 'Auditor', 'Viewed trial balance', 'Info'],
  ];

  openModal(id: string): void {
    this.activeModal = id;
    this.loadingModal = null;
    this.stepState = { gcr: 1, mec: 1 };
    this.gcrStep = 1; this.mecStep = 1;
  }

  closeModal(): void { this.activeModal = null; this.loadingModal = null; }

  @HostListener('document:keydown.escape')
  onEsc(): void { this.closeModal(); }

  isStepActive(flow: string, index: number): boolean { return (this.stepState[flow] ?? 1) === index + 1; }
  isStepCompleted(flow: string, index: number): boolean { return (this.stepState[flow] ?? 1) > index + 1; }
  getFlowButtonLabel(flow: string, total: number): string {
    const cur = this.stepState[flow] ?? 1;
    if (cur >= total) return 'Done';
    if (cur === total - 1) return flow === 'mec' ? 'Lock Ledgers' : 'Generate';
    return this.flowButtonDefaults[flow] || 'Continue';
  }

  nextFlow(flow: string, total: number, modalId: string, message: string, ref: string): void {
    const cur = this.stepState[flow] ?? 1;
    if (cur >= total) { this.processAction(modalId, message, ref); return; }
    if (cur === total - 1) {
      this.loadingModal = modalId;
      setTimeout(() => {
        this.stepState[flow] = total;
        if (flow === 'gcr') this.gcrStep = total;
        if (flow === 'mec') this.mecStep = total;
        this.loadingModal = null;
        this.processAction(modalId, message, ref);
      }, 1000);
      return;
    }
    this.stepState[flow] = cur + 1;
    if (flow === 'gcr') this.gcrStep = this.stepState[flow];
    if (flow === 'mec') this.mecStep = this.stepState[flow];
  }

  nextGcrStep(): void { this.nextFlow('gcr', 3, 'generateCustomReportModal', 'Report generated and scheduled for delivery.', 'REP-19028'); }
  nextMecStep(): void { this.nextFlow('mec', 3, 'runMonthEndModal', 'Ledgers locked for period.', 'MEC-1'); }

  switchTab(prefix: string, key: string, event: Event): void {
    this.activeTabs[prefix] = key;
    const btn = event.target as HTMLElement;
    btn?.parentElement?.querySelectorAll('.pm-tab-pill').forEach((b) => b.classList.remove('active'));
    btn?.classList.add('active');
  }

  selectBox(event: Event): void {
    const card = (event.target as HTMLElement).closest('.border');
    if (!card?.parentElement) return;
    card.parentElement.querySelectorAll('.border').forEach((b) => {
      (b as HTMLElement).style.borderColor = '';
      (b as HTMLElement).style.background = '';
    });
    (card as HTMLElement).style.borderColor = 'var(--pm-primary)';
    (card as HTMLElement).style.background = 'rgba(79,70,229,.04)';
  }

  processAction(modalId: string, msg: string, ref: string): void {
    this.loadingModal = modalId;
    setTimeout(() => {
      this.savedModals[modalId] = { message: msg, ref };
      const savedVar = modalId.replace('Modal', 'Saved');
      (this as any)[savedVar] = true;
      this.loadingModal = null;
      this.notify(ref ? `${msg} Ref: ${ref}` : msg);
    }, 800);
  }

  getModalRows(modalId: string): string[][] {
    const map: Record<string, string[][]> = {
      viewAuditLogModal: this.auditRows,
      branchPerformanceModal: [['Nairobi HQ', 'KES 42.1M', '+8%', 'On track'], ['Mombasa', 'KES 11.4M', '+2%', 'Watch'], ['Kisumu', 'KES 6.8M', '-1%', 'Review']],
      reconciliationExceptionsModal: [['Bank line 8821', 'Unmatched inflow', 'KES 120,000', 'Open'], ['Card batch 19', 'Fee variance', 'KES 2,450', 'Open']],
      userActivityLogModal: [['CFO', 'Export TB', '28 Jun', 'OK'], ['Auditor', 'View P&L', '27 Jun', 'OK']],
    };
    return map[modalId] ?? [['Metric', 'Value', '—', 'Ready']];
  }

  resetAllModals(): void {
    this.closeModal();
    this.savedModals = {};
    this.stepState = { gcr: 1, mec: 1 };
    this.gcrStep = 1; this.mecStep = 1;
  }

  notify(message: string): void { this.toastMessage = message; setTimeout(() => this.clearToast(), 3200); }
  clearToast(): void { this.toastMessage = ''; }
}
