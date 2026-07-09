import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NgClass } from '@angular/common';

interface FlowConfig {
  labels: string[];
  closeOnDone?: boolean;
}
interface CollectionTransaction {
  time: string;
  customer: string;
  ref: string;
  method: string;
  amount: string;
  status: 'Success' | 'Failed' | 'Pending';
}
interface CollectionCustomer {
  name: string;
  phone: string;
  segment: 'VIP' | 'Regular' | 'Churn Risk' | 'New';
  ltv: string;
  lastPayment: string;
}

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
  selector: 'app-collections-merchant',
  standalone: true,
  imports: [NgClass],
  templateUrl: './collections-merchant.html',
  styleUrl: './collections-merchant.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CollectionsMerchantComponent {
  readonly collectionTransactions: CollectionTransaction[] = [
    {
      time: '14:32',
      customer: 'Alice W.',
      ref: 'TXN-892110',
      method: 'PayBill',
      amount: 'KES 4,500',
      status: 'Success',
    },
    {
      time: '14:15',
      customer: 'John M.',
      ref: 'TXN-892109',
      method: 'Till',
      amount: 'KES 1,200',
      status: 'Success',
    },
    {
      time: '13:40',
      customer: 'Sarah K.',
      ref: 'TXN-892108',
      method: 'Visa',
      amount: 'KES 8,500',
      status: 'Success',
    },
    {
      time: '13:12',
      customer: 'David O.',
      ref: 'TXN-892107',
      method: 'PayBill',
      amount: 'KES 2,000',
      status: 'Failed',
    },
    {
      time: '12:55',
      customer: 'Mary J.',
      ref: 'TXN-892106',
      method: 'Till',
      amount: 'KES 550',
      status: 'Success',
    },
  ];
  readonly collectionCustomers: CollectionCustomer[] = [
    {
      name: 'Alice Wanjiku',
      phone: '0722 *** 112',
      segment: 'VIP',
      ltv: 'KES 142,500',
      lastPayment: 'Today',
    },
    {
      name: 'John Mark',
      phone: '0711 *** 443',
      segment: 'Regular',
      ltv: 'KES 12,400',
      lastPayment: 'Today',
    },
    {
      name: 'Sarah K.',
      phone: '0733 *** 991',
      segment: 'VIP',
      ltv: 'KES 85,000',
      lastPayment: 'Yesterday',
    },
    {
      name: 'David O.',
      phone: '0721 *** 220',
      segment: 'Churn Risk',
      ltv: 'KES 8,000',
      lastPayment: '45 days ago',
    },
    {
      name: 'Mary J.',
      phone: '0755 *** 881',
      segment: 'New',
      ltv: 'KES 550',
      lastPayment: 'Today',
    },
  ];
  readonly mockData = {
    collectionTransactions: this.collectionTransactions,
    collectionCustomers: this.collectionCustomers,
  };
  readonly flows: Record<string, FlowConfig> = {
    p32_recv: { labels: ['Details', 'Method', 'Execute', 'Done'], closeOnDone: true },
    p32_ref: { labels: ['Select', 'Details', 'Done'], closeOnDone: true },
  };
  readonly steps: Record<string, number> = { p32_recv: 1, p32_ref: 1 };
  private readonly defaultTabs: Record<string, string> = { p32_qr: 'dynamic', p32_api: 'keys' };
  readonly tabs: Record<string, string> = { ...this.defaultTabs };

  badgeClass(status: string): string {
    return status === 'Success'
      ? 'pm-badge-success'
      : status === 'Failed'
        ? 'pm-badge-danger'
        : 'pm-badge-info';
  }
  customerBadgeClass(segment: string): string {
    return segment === 'VIP'
      ? 'pm-badge-purple'
      : segment === 'Churn Risk'
        ? 'pm-badge-danger'
        : segment === 'New'
          ? 'pm-badge-info'
          : 'pm-badge-success';
  }

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

  closeAllModals(): void {
    this.openModals.clear();
  }
  isModalOpen(id: string): boolean {
    return this.openModals.has(id);
  }
  hasOpenModal(): boolean {
    return this.openModals.size > 0;
  }
  currentStep(flow: string): number {
    return this.steps[flow] ?? 1;
  }
  isStep(flow: string, step: number): boolean {
    return this.currentStep(flow) === step;
  }

  stepperItems(flow: string): Array<{ index: number; label: string; last: boolean }> {
    const labels = this.flows[flow]?.labels ?? [];
    return labels.map((label, i) => ({ index: i + 1, label, last: i === labels.length - 1 }));
  }

  nextStepFlow(flow: string, total: number, modalId: string, message: string, ref = ''): void {
    const next = Math.min((this.steps[flow] ?? 1) + 1, total);
    this.steps[flow] = next;
    if (next >= total) {
      this.notify(ref ? `${message} Ref: ${ref}` : message);
      if (this.flows[flow]?.closeOnDone) {
        window.setTimeout(() => this.closeModal(modalId), 650);
      }
    }
  }

  activeTab(prefix: string): string {
    return this.tabs[prefix] ?? this.defaultTabs[prefix] ?? '';
  }

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
    if (nextModal) {
      this.openModal(nextModal);
      return;
    }
    if (modalId) this.closeModal(modalId);
  }

  simulateProcess(modalId: string, message: string, ref = ''): void {
    this.processAction(modalId, message, ref);
  }
  simSave(modalId: string, message: string): void {
    this.processAction(modalId, message);
  }

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

  triggerFile(inputId: string): void {
    document.getElementById(inputId)?.click();
  }
  setCalcAmount(event: Event): void {
    this.calcAmount = Number((event.target as HTMLInputElement | null)?.value || 0);
  }

  get fee(): FeeBreakdown {
    const amount = Number.isFinite(this.calcAmount) ? this.calcAmount : 0;
    const round = (value: number) => Math.max(0, value).toFixed(0);
    return {
      paybillFee: round(amount * 0.015),
      paybillNet: round(amount - amount * 0.015),
      tillFee: round(amount * 0.01),
      tillNet: round(amount - amount * 0.01),
      cardFee: round(amount * 0.029),
      cardNet: round(amount - amount * 0.029),
      pesalinkFee: '45',
      pesalinkNet: round(amount - 45),
    };
  }

  notify(message: string): void {
    this.toastMessage = message || 'Action completed.';
  }
  clearToast(): void {
    this.toastMessage = '';
  }

  private resetFlowsForModal(id: string): void {
    const modalFlows: Record<string, string[]> = {
      p32_receivePaymentModal: ['p32_recv'],
      p32_refundModal: ['p32_ref'],
    };
    for (const flow of modalFlows[id] ?? []) this.steps[flow] = 1;
  }
}
