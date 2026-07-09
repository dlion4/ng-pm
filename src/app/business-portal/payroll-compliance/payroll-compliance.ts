import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NgClass } from '@angular/common';

interface FlowConfig { labels: string[]; closeOnDone?: boolean; }
interface EmployeeRow { initials: string; name: string; id: string; role: string; basicPay: string; allowances: string; deductions: string; netPay: string; payout: string; payoutStatus: string; payoutBadge: string; }
interface PayrollBatchRow { ref: string; period: string; employees: string; totalNet: string; status: string; approval: string; action: string; modalId: string; }

interface FeeBreakdown {
  paybillFee: string;
  paybillNet: string;
  tillFee: string;
  tillNet: string;
  cardFee: string;
  cardNet: string;
  pesalinkFee: string;
  pesalinkNet: string;
}

@Component({
  selector: 'app-payroll-compliance',
  standalone: true,
  imports: [NgClass],
  templateUrl: './payroll-compliance.html',
  styleUrl: './payroll-compliance.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PayrollComplianceComponent {
  readonly pageTitle = 'PAGE 3.4 — Payroll & Compliance Command Center';
  readonly pageSubtitle = 'Configure salary components, execute bulk salary disbursements via M-Pesa B2C/PesaLink, generate payslips, and export statutory P10/SHIF returns.';
  readonly breadcrumbs = [
    { label: 'Business Portal' },
    { label: 'HR & Operations' },
    { label: 'Payroll Disbursement', active: true },
  ];
  readonly heroStats = {
    nextCycleDate: '28 Jun 2025',
    nextCycleNote: 'June 2025 Regular Salary. Requires CFO approval for execution over KES 1M.',
    totalCost: 'KES 4.2M',
    grossPay: '3.1M',
    employerTax: '0.6M',
    allowances: '0.5M',
    activeEmployees: '142',
    employeeDelta: '+3 this month',
    complianceHealth: '98%',
    complianceNote: '3 Missing PINs',
    kraStatus: 'Ready to file',
    shifStatus: 'Updating specs',
  };
  readonly actionFeed = [
    { initials: 'LA', title: 'Leave approval needed', subtitle: '4 pending requests', modalId: 'p34_leaveApprovalModal', button: 'Review', tone: 'warning' },
    { initials: 'TX', title: 'Compliance alert', subtitle: '3 employees missing PIN', modalId: 'p34_complianceAlertsModal', button: 'Fix', tone: 'danger' },
    { initials: 'EX', title: 'Expense claims', subtitle: '8 awaiting finance', modalId: 'p34_expenseApprovalModal', button: 'Approve', tone: 'info' },
    { initials: 'EM', title: 'Bank details update', subtitle: 'Ali Omondi payout pending', modalId: 'p34_editEmployeeModal', button: 'Update', tone: 'purple' },
  ];
  readonly intelligenceFeed = [
    { initials: 'P9', title: 'Annual P9 ready', subtitle: 'Generate employee tax certificates', modalId: 'p34_annualP9Modal', button: 'Generate' },
    { initials: 'TX', title: 'PAYE bands updated', subtitle: 'Verify July tax configuration', modalId: 'p34_taxConfigModal', button: 'Verify' },
    { initials: 'RP', title: 'Statutory pack', subtitle: 'Export P10 / SHIF / NSSF', modalId: 'p34_generateReportsModal', button: 'Export' },
  ];
  readonly quickActions = [
    { icon: 'bi bi-play-circle text-primary me-1', label: 'Run Payroll', modalId: 'p34_runPayrollModal' },
    { icon: 'bi bi-person-plus text-success me-1', label: 'Add Employee', modalId: 'p34_addEmployeeModal' },
    { icon: 'bi bi-check2-circle text-warning me-1', label: 'Approve Run', modalId: 'p34_approvePayrollModal' },
    { icon: 'bi bi-phone me-1', label: 'B2C Payout', modalId: 'p34_payMpesaBulkModal', iconStyle: 'color:var(--pm-accent)' },
    { icon: 'bi bi-sliders text-info me-1', label: 'Components', modalId: 'p34_salaryComponentsModal' },
    { icon: 'bi bi-file-earmark-bar-graph text-danger me-1', label: 'Tax Reports', modalId: 'p34_generateReportsModal' },
    { icon: 'bi bi-envelope me-1', label: 'Send Payslips', modalId: 'p34_sendPayslipsModal', iconStyle: 'color:var(--pm-purple)' },
    { icon: 'bi bi-phone-flip me-1', label: 'ESS Portal', modalId: 'p34_employeeSelfServiceModal', iconStyle: 'color:var(--pm-muted)' },
  ];
  readonly employees: EmployeeRow[] = [
    { initials: 'JS', name: 'John Smith', id: 'EMP-001', role: 'Sales Manager', basicPay: 'KES 120,000', allowances: 'KES 15,000', deductions: 'KES 34,250', netPay: 'KES 100,750', payout: 'Equity Bank', payoutStatus: 'Verified', payoutBadge: 'pm-badge-success' },
    { initials: 'MK', name: 'Mary Kamau', id: 'EMP-002', role: 'HR Specialist', basicPay: 'KES 85,000', allowances: 'KES 5,000', deductions: 'KES 21,800', netPay: 'KES 68,200', payout: 'M-Pesa B2C', payoutStatus: 'Verified', payoutBadge: 'pm-badge-success' },
    { initials: 'AO', name: 'Ali Omondi', id: 'EMP-003', role: 'Developer', basicPay: 'KES 180,000', allowances: 'KES 0', deductions: 'KES 56,100', netPay: 'KES 123,900', payout: 'KCB Bank', payoutStatus: 'Pending', payoutBadge: 'pm-badge-warning' },
    { initials: 'W', name: 'Wanjiku Ndungu', id: 'EMP-004', role: 'Contractor', basicPay: 'KES 45,000', allowances: 'KES 2,000', deductions: 'KES 6,300', netPay: 'KES 40,700', payout: 'M-Pesa B2C', payoutStatus: 'Verified', payoutBadge: 'pm-badge-success' },
  ];
  readonly payrollBatches: PayrollBatchRow[] = [
    { ref: 'PRL-2025-06-REG', period: 'June 2025', employees: '142', totalNet: 'KES 4.2M', status: 'Pending Appr.', approval: '1 of 2 (CFO)', action: 'Approve', modalId: 'p34_approvePayrollModal' },
    { ref: 'PRL-2025-06-COM', period: 'June Comm.', employees: '18', totalNet: 'KES 0.8M', status: 'Processing', approval: 'Fully Approved', action: 'Track', modalId: 'p34_disbursementTrackingModal' },
  ];
  readonly mockData = { employees: this.employees, payrollBatches: this.payrollBatches };
  readonly flows: Record<string, FlowConfig> = { p34_rp: { labels: ['Define', 'Review', 'Execute', 'Done'], closeOnDone: true }, p34_emp: { labels: ['Personal', 'Role', 'Payment', 'Done'], closeOnDone: true } };
  readonly steps: Record<string, number> = { p34_rp: 1, p34_emp: 1 };
  private readonly defaultTabs: Record<string, string> = { p34_eeTab: 'profile', p34_taxTab: 'paye', p34_compTab: 'allow' };
  readonly tabs: Record<string, string> = { ...this.defaultTabs };

  payrollBatchBadgeClass(status: string): string { return status.includes('Pending') ? 'pm-badge-warning' : status.includes('Processing') ? 'pm-badge-info' : 'pm-badge-success'; }
  badgeClass(status: string): string { return this.payrollBatchBadgeClass(status); }
  customerBadgeClass(): string { return 'pm-badge-success'; }

  readonly openModals = new Set<string>();
  toastMessage = '';
  invoiceFilter = 'all';
  calcAmount = 10000;

  openModal(id: string): void {
    this.openModals.clear();
    this.openModals.add(id);
    this.resetFlowsForModal(id);
  }

  closeModal(id: string): void {
    this.openModals.delete(id);
    this.resetFlowsForModal(id);
  }

  closeAllModals(): void { this.openModals.clear(); }
  isModalOpen(id: string): boolean { return this.openModals.has(id); }
  hasOpenModal(): boolean { return this.openModals.size > 0; }
  currentStep(flow: string): number { return this.steps[flow] ?? 1; }
  isStep(flow: string, step: number): boolean { return this.currentStep(flow) === step; }

  stepperItems(flow: string): Array<{ index: number; label: string; last: boolean }> {
    const labels = this.flows[flow]?.labels ?? [];
    return labels.map((label, i) => ({ index: i + 1, label, last: i === labels.length - 1 }));
  }

  nextStepFlow(flow: string, total: number, modalId: string, message: string, ref = ''): void {
    const next = Math.min((this.steps[flow] ?? 1) + 1, total);
    this.steps[flow] = next;
    if (next >= total) {
      this.notify(ref ? `${message} Ref: ${ref}` : message);
      if (this.flows[flow]?.closeOnDone) { window.setTimeout(() => this.closeModal(modalId), 650); }
    }
  }

  activeTab(prefix: string): string { return this.tabs[prefix] ?? this.defaultTabs[prefix] ?? ''; }

  switchTab(prefix: string, key: string, event?: Event): void {
    this.tabs[prefix] = key;
    const target = event?.currentTarget as HTMLElement | null;
    const parent = target?.parentElement;
    parent?.querySelectorAll('.pm-tab-pill').forEach((btn) => btn.classList.remove('active'));
    target?.classList.add('active');
  }

  setInvoiceFilter(status: string, event?: Event): void {
    this.invoiceFilter = status;
    const target = event?.currentTarget as HTMLElement | null;
    const parent = target?.parentElement;
    parent?.querySelectorAll('.pm-tab-pill').forEach((btn) => btn.classList.remove('active'));
    target?.classList.add('active');
  }

  processAction(modalId: string, message: string, ref = '', nextModal?: string): void {
    this.notify(ref ? `${message} Ref: ${ref}` : message);
    if (nextModal) { this.openModal(nextModal); return; }
    if (modalId) this.closeModal(modalId);
  }

  simulateProcess(modalId: string, message: string, ref = ''): void { this.processAction(modalId, message, ref); }
  simSave(modalId: string, message: string): void { this.processAction(modalId, message); }

  selectRadio(event: Event): void {
    const card = event.currentTarget as HTMLElement | null;
    if (!card?.parentElement) return;
    card.parentElement.querySelectorAll<HTMLElement>('.border').forEach((item) => {
      item.style.borderColor = '';
      item.style.background = '';
      const input = item.querySelector<HTMLInputElement>('input[type="radio"]');
      if (input) input.checked = false;
    });
    card.style.borderColor = 'var(--pm-primary)';
    card.style.background = 'rgba(79,70,229,.04)';
    const radio = card.querySelector<HTMLInputElement>('input[type="radio"]');
    if (radio) radio.checked = true;
  }

  moveFocus(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input?.value?.length === 1) (input.nextElementSibling as HTMLElement | null)?.focus();
  }

  triggerFile(inputId: string): void { document.getElementById(inputId)?.click(); }
  setCalcAmount(event: Event): void { this.calcAmount = Number((event.target as HTMLInputElement | null)?.value || 0); }

  get fee(): FeeBreakdown {
    const amount = Number.isFinite(this.calcAmount) ? this.calcAmount : 0;
    const round = (value: number) => Math.max(0, value).toFixed(0);
    return {
      paybillFee: round(amount * 0.015), paybillNet: round(amount - amount * 0.015),
      tillFee: round(amount * 0.01), tillNet: round(amount - amount * 0.01),
      cardFee: round(amount * 0.029), cardNet: round(amount - amount * 0.029),
      pesalinkFee: '45', pesalinkNet: round(amount - 45),
    };
  }

  notify(message: string): void { this.toastMessage = message || 'Action completed.'; window.setTimeout(() => this.clearToast(), 3200); }
  clearToast(): void { this.toastMessage = ''; }

  private resetFlowsForModal(id: string): void {
    const modalFlows: Record<string, string[]> = {
      p34_runPayrollModal: ['p34_rp'],
      p34_addEmployeeModal: ['p34_emp'],
    };
    for (const flow of modalFlows[id] ?? []) this.steps[flow] = 1;
  }

}
