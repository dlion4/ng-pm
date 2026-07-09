import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ─── COMPONENT ─────────────────────────────────────────────────────────

@Component({
  selector: 'app-financial-reporting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./financial-reporting.html',
  styleUrls: ['./financial-reporting.css'],
  encapsulation: ViewEncapsulation.None
})
export class FinancialReportingComponent {
  activeModal: string | null = null;
  gcrStep: number = 1;
  mecStep: number = 1;

  // Stepper labels for multi-step modals
  gcrStepperLabels: string[] = ['Type', 'Filters', 'Delivery'];
  mecStepperLabels: string[] = ['Checks', 'Lock', 'Done'];

  // Tab state per prefix
  activeTabs: Record<string, string> = {
    cfTab: '7day',
    veTab: 'category'
  };

  // Saved states for action modals
  exportKRAVATSaved: boolean = false;
  scheduleReportSaved: boolean = false;
  inviteAuditorSaved: boolean = false;
  eTimsReconciliationSaved: boolean = false;
  reconciliationExceptionsSaved: boolean = false;
  downloadStatementSaved: boolean = false;
  configureDashboardsSaved: boolean = false;
  statutoryDeductionsSaved: boolean = false;
  exportTrialBalanceSaved: boolean = false;
  reportDeliverySettingsSaved: boolean = false;
  generateCustomReportSaved: boolean = false;

  // ─── MODAL OPEN / CLOSE ──────────────────────────────────────────

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

  // ─── MULTI-STEP: GENERATE CUSTOM REPORT ──────────────────────────

  nextGcrStep(): void {
    if (this.gcrStep >= 3) {
      this.processAction('generateCustomReportModal', 'Report generated and scheduled for delivery.', 'REP-19028');
      return;
    }
    this.gcrStep++;
  }

  // ─── MULTI-STEP: MONTH-END CLOSE ─────────────────────────────────

  nextMecStep(): void {
    if (this.mecStep >= 3) {
      this.closeModal();
      return;
    }
    this.mecStep++;
  }

  // ─── TAB SWITCHING ───────────────────────────────────────────────

  switchTab(prefix: string, key: string, event: Event): void {
    this.activeTabs[prefix] = key;
    const btn = event.target as HTMLElement;
    if (btn && btn.parentElement) {
      btn.parentElement.querySelectorAll('.pm-tab-pill').forEach((b: Element) => b.classList.remove('active'));
      btn.classList.add('active');
    }
  }

  // ─── REPORT CARD SELECTION ───────────────────────────────────────

  selectBox(event: Event): void {
    const card = (event.target as HTMLElement).closest('.border');
    if (!card || !card.parentElement) return;
    card.parentElement.querySelectorAll('.border').forEach((b: Element) => {
      (b as HTMLElement).style.borderColor = '';
      (b as HTMLElement).style.background = '';
    });
    (card as HTMLElement).style.borderColor = 'var(--pm-primary)';
    (card as HTMLElement).style.background = 'rgba(79,70,229,.04)';
  }

  // ─── PROCESS ACTION (sets saved state) ───────────────────────────

  processAction(modalId: string, msg: string, ref: string): void {
    const savedVar = modalId.replace('Modal', 'Saved') as keyof this;
    (this as any)[savedVar] = true;
  }

  // ─── RESET ALL ───────────────────────────────────────────────────

  resetAllModals(): void {
    this.activeModal = null;
    this.gcrStep = 1;
    this.mecStep = 1;
    this.activeTabs = { cfTab: '7day', veTab: 'category' };
    this.exportKRAVATSaved = false;
    this.scheduleReportSaved = false;
    this.inviteAuditorSaved = false;
    this.eTimsReconciliationSaved = false;
    this.reconciliationExceptionsSaved = false;
    this.downloadStatementSaved = false;
    this.configureDashboardsSaved = false;
    this.statutoryDeductionsSaved = false;
    this.exportTrialBalanceSaved = false;
    this.reportDeliverySettingsSaved = false;
    this.generateCustomReportSaved = false;
  }
}