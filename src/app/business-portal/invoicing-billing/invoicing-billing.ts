import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NgClass } from '@angular/common';

interface FlowConfig { labels: string[]; closeOnDone?: boolean; }
interface InvoiceRow { id: string; client: string; date: string; dueDate: string; amount: string; status: 'Overdue' | 'Sent' | 'Paid' | 'Draft' | 'Viewed'; action: string; filterStatus: string; }
interface SubscriptionRow { name: string; email: string; plan: string; status: 'Active' | 'Past Due'; nextBilling: string; mrr: string; action: string; }

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
  selector: 'app-invoicing-billing',
  standalone: true,
  imports: [NgClass],
  templateUrl: './invoicing-billing.html',
  styleUrl: './invoicing-billing.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class InvoicingBillingComponent {
  readonly invoices: InvoiceRow[] = [
    { id: 'INV-2025-042', client: 'Nairobi Tech Ltd', date: '10 Jun 2025', dueDate: '24 Jun 2025', amount: 'KES 85,000', status: 'Overdue', action: 'View', filterStatus: 'unpaid' },
    { id: 'INV-2025-045', client: 'Amina Traders', date: '20 Jun 2025', dueDate: '04 Jul 2025', amount: 'KES 32,500', status: 'Sent', action: 'View', filterStatus: 'unpaid' },
    { id: 'INV-2025-041', client: 'Coast Logistics', date: '05 Jun 2025', dueDate: '19 Jun 2025', amount: 'KES 140,000', status: 'Paid', action: 'View', filterStatus: 'paid' },
    { id: 'INV-2025-046', client: 'Rift Valley Farms', date: '27 Jun 2025', dueDate: '—', amount: 'KES 18,000', status: 'Draft', action: 'Edit', filterStatus: 'draft' },
    { id: 'INV-2025-047', client: 'Global Exporters (USD)', date: '26 Jun 2025', dueDate: '26 Jul 2025', amount: '$ 1,200', status: 'Viewed', action: 'View', filterStatus: 'unpaid' },
  ];
  readonly subscriptions: SubscriptionRow[] = [
    { name: 'Sarah Jenkins', email: 's.jenkins@email.com', plan: 'Premium Plan', status: 'Active', nextBilling: '01 Jul 2025', mrr: 'KES 5,000', action: 'View' },
    { name: 'Alpha Corp', email: 'finance@alpha.co.ke', plan: 'Enterprise', status: 'Active', nextBilling: '15 Aug 2025 (Annual)', mrr: 'KES 3,750', action: 'View' },
    { name: 'James Mwangi', email: 'j.mwangi@email.com', plan: 'Basic Plan', status: 'Past Due', nextBilling: 'Retrying (2/3)', mrr: 'KES 1,500', action: 'Dunning' },
  ];
  readonly mockData = { invoices: this.invoices, subscriptions: this.subscriptions };
  readonly flows: Record<string, FlowConfig> = { p33_inv: { labels: ['Client', 'Items', 'Settings', 'Done'] } };
  readonly steps: Record<string, number> = { p33_inv: 1 };
  private readonly defaultTabs: Record<string, string> = { p33_invDetail: 'preview' };
  readonly tabs: Record<string, string> = { ...this.defaultTabs };

  get filteredInvoices(): InvoiceRow[] { return this.invoiceFilter === 'all' ? this.invoices : this.invoices.filter((invoice) => invoice.filterStatus === this.invoiceFilter); }
  invoiceBadgeClass(status: string): string { return status === 'Paid' || status === 'Viewed' ? 'pm-badge-success' : status === 'Overdue' || status === 'Past Due' ? 'pm-badge-danger' : status === 'Draft' ? 'pm-badge-info' : 'pm-badge-warning'; }
  subscriptionBadgeClass(status: string): string { return status === 'Active' ? 'pm-badge-success' : 'pm-badge-danger'; }
  badgeClass(status: string): string { return this.invoiceBadgeClass(status); }
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

  notify(message: string): void { this.toastMessage = message || 'Action completed.'; }
  clearToast(): void { this.toastMessage = ''; }

  private resetFlowsForModal(id: string): void {
    const modalFlows: Record<string, string[]> = {
      p33_newInvoiceModal: ['p33_inv'],
    };
    for (const flow of modalFlows[id] ?? []) this.steps[flow] = 1;
  }

}
