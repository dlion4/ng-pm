import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NgClass } from '@angular/common';

type StatusKey =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'open'
  | 'pending'
  | 'evidence'
  | 'network'
  | 'critical'
  | 'high'
  | 'medium';
interface FlowConfig {
  labels: string[];
  closeOnDone?: boolean;
  doneMessage: string;
}
interface SupportTicket {
  id: string;
  type: 'Customer' | 'Merchant' | 'Technical' | 'Chargeback' | 'Refund';
  party: string;
  subject: string;
  priority: 'Critical' | 'High' | 'Medium';
  status: string;
  age: string;
  modal: string;
}
interface ChargebackCase {
  id: string;
  card: string;
  merchant: string;
  amount: string;
  stage: string;
  due: string;
  actionLabel: string;
  actionModal: string;
}
interface RefundCase {
  id: string;
  customer: string;
  originalTxn: string;
  amount: string;
  status: StatusKey;
  statusLabel: string;
  actionLabel: string;
  actionModal: string;
}
interface ActivitySummary {
  time: string;
  action: string;
  caseId: string;
  user: string;
  result: StatusKey;
  resultLabel: string;
}
interface BulkRefundResult {
  id: string;
  customer: string;
  amount: string;
  status: StatusKey;
  statusLabel: string;
}
interface SlaHealthRow {
  category: string;
  target: string;
  actual: string;
  breaches: number;
  trend: string;
}
interface ActivityLogEntry {
  time: string;
  user: string;
  action: string;
  caseId: string;
  details: string;
  result: StatusKey;
  resultLabel: string;
}
interface NotificationSetting {
  alertType: string;
  push: boolean;
  email: boolean;
  sms: boolean;
  slack: boolean;
}
interface SupportMockData {
  tickets: SupportTicket[];
  chargebackCases: ChargebackCase[];
  refunds: RefundCase[];
  recentActivity: ActivitySummary[];
  bulkRefundResults: BulkRefundResult[];
  slaHealthRows: SlaHealthRow[];
  activityLog: ActivityLogEntry[];
  notificationSettings: NotificationSetting[];
}

@Component({
  selector: 'app-support-disputes-refunds',
  standalone: true,
  imports: [NgClass],
  templateUrl: './support-disputes-refunds.html',
  styleUrl: './support-disputes-refunds.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SupportDisputesRefundsComponent {
  // === PAGE METADATA (data-driven) ===
  readonly pageTitle = 'PAGE 3.13 — Support, Disputes & Refunds Center';
  readonly pageSubtitle = 'Manage customer tickets, chargebacks, refunds and SLA compliance from a single operations hub.';
  readonly breadcrumbStrong = 'Support, Disputes & Refunds';

  readonly quickActions = [
    { icon: 'ticket-detailed', label: 'New Ticket', modal: 'ticketDetailModal', color: 'primary' },
    { icon: 'exclamation-triangle', label: 'Chargeback', modal: 'chargebackModal', color: 'danger' },
    { icon: 'cash-stack', label: 'Refund', modal: 'refundModal', color: 'accent' },
    { icon: 'cloud-upload', label: 'Bulk Refund', modal: 'bulkRefundModal', color: 'info' },
  ];

  readonly mockData: SupportMockData = {
    tickets: [
      {
        id: 'T-8821',
        type: 'Customer',
        party: 'Grace Wanjiku (VIP)',
        subject: 'Failed delivery',
        priority: 'Critical',
        status: 'Open',
        age: '4h',
        modal: 'ticketDetailModal',
      },
      {
        id: 'T-8803',
        type: 'Merchant',
        party: 'TechHub KE',
        subject: 'Settlement duplicate',
        priority: 'High',
        status: 'Open',
        age: '12h',
        modal: 'ticketDetailModal',
      },
      {
        id: 'T-8799',
        type: 'Technical',
        party: 'API Integration',
        subject: 'Webhook timeout',
        priority: 'Medium',
        status: 'Open',
        age: '18h',
        modal: 'ticketDetailModal',
      },
      {
        id: 'CB-9912',
        type: 'Chargeback',
        party: 'Online Store XYZ',
        subject: 'Fraud — KES 124,000',
        priority: 'Critical',
        status: 'Evidence',
        age: '8h',
        modal: 'chargebackModal',
      },
      {
        id: 'CB-9908',
        type: 'Chargeback',
        party: 'TechHub KE',
        subject: 'Merchandise not received',
        priority: 'High',
        status: 'Network',
        age: '2d',
        modal: 'chargebackModal',
      },
      {
        id: 'RF-4421',
        type: 'Refund',
        party: 'Grace Wanjiku',
        subject: 'Delivery failure',
        priority: 'High',
        status: 'Pending',
        age: '6h',
        modal: 'refundModal',
      },
      {
        id: 'RF-4408',
        type: 'Refund',
        party: 'David Kimani',
        subject: 'Duplicate request',
        priority: 'Medium',
        status: 'Pending',
        age: '1d',
        modal: 'duplicateCheckModal',
      },
    ],
    chargebackCases: [
      {
        id: 'CB-9912',
        card: 'Visa ****4521',
        merchant: 'Online Store XYZ',
        amount: 'KES 124,000',
        stage: 'Evidence',
        due: '8h',
        actionLabel: 'Respond',
        actionModal: 'chargebackModal',
      },
      {
        id: 'CB-9908',
        card: 'Mastercard ****2214',
        merchant: 'TechHub KE',
        amount: 'KES 82,000',
        stage: 'Network',
        due: '2d',
        actionLabel: 'View',
        actionModal: 'chargebackModal',
      },
      {
        id: 'CB-9901',
        card: 'Visa ****8821',
        merchant: 'Safari Tours',
        amount: 'KES 31,500',
        stage: 'Pre-arb',
        due: '4d',
        actionLabel: 'Evidence',
        actionModal: 'evidenceUploadModal',
      },
      {
        id: 'CB-9894',
        card: 'Visa ****1108',
        merchant: 'Gadget World',
        amount: 'KES 18,900',
        stage: 'Won',
        due: 'Closed',
        actionLabel: 'View',
        actionModal: 'ticketDetailModal',
      },
    ],
    refunds: [
      {
        id: 'RF-4421',
        customer: 'Grace Wanjiku',
        originalTxn: 'TXN-884291',
        amount: 'KES 47,800',
        status: 'pending',
        statusLabel: 'Pending approval',
        actionLabel: 'Approve',
        actionModal: 'refundModal',
      },
      {
        id: 'RF-4419',
        customer: 'David Kimani',
        originalTxn: 'TXN-884200',
        amount: 'KES 12,400',
        status: 'warning',
        statusLabel: 'Duplicate check',
        actionLabel: 'Check',
        actionModal: 'duplicateCheckModal',
      },
      {
        id: 'RF-4408',
        customer: 'Mary Achieng',
        originalTxn: 'TXN-883991',
        amount: 'KES 6,200',
        status: 'success',
        statusLabel: 'Processed',
        actionLabel: 'View',
        actionModal: 'refundModal',
      },
      {
        id: 'RF-4401',
        customer: 'John Mwangi',
        originalTxn: 'TXN-883821',
        amount: 'KES 3,900',
        status: 'pending',
        statusLabel: 'Pending review',
        actionLabel: 'Review',
        actionModal: 'refundModal',
      },
    ],
    recentActivity: [
      {
        time: '14:32',
        action: 'Refund approved',
        caseId: 'RF-4421',
        user: 'Finance — Grace',
        result: 'success',
        resultLabel: 'Success',
      },
      {
        time: '13:48',
        action: 'Evidence uploaded',
        caseId: 'CB-9912',
        user: 'Disputes — Alan',
        result: 'success',
        resultLabel: 'Success',
      },
      {
        time: '12:20',
        action: 'Ticket escalated',
        caseId: 'T-8821',
        user: 'Support — Jane',
        result: 'warning',
        resultLabel: 'Escalated',
      },
      {
        time: '11:12',
        action: 'Customer contacted',
        caseId: 'RF-4419',
        user: 'Support — Kevin',
        result: 'success',
        resultLabel: 'Sent',
      },
      {
        time: '10:05',
        action: 'SLA breach risk',
        caseId: 'CB-9908',
        user: 'System',
        result: 'warning',
        resultLabel: 'Warning',
      },
    ],
    bulkRefundResults: [
      {
        id: 'RF-4421',
        customer: 'Grace Wanjiku',
        amount: 'KES 47,800',
        status: 'success',
        statusLabel: 'Success',
      },
      {
        id: 'RF-4419',
        customer: 'David Kimani',
        amount: 'KES 12,400',
        status: 'success',
        statusLabel: 'Success',
      },
    ],
    slaHealthRows: [
      {
        category: 'Customer Tickets',
        target: '98%',
        actual: '97.2%',
        breaches: 11,
        trend: '↑ 1.2%',
      },
      {
        category: 'Merchant Tickets',
        target: '96%',
        actual: '95.1%',
        breaches: 8,
        trend: '↓ 0.4%',
      },
      { category: 'Chargebacks', target: '99%', actual: '98.4%', breaches: 4, trend: '↑ 0.8%' },
      { category: 'Refunds', target: '97%', actual: '98.1%', breaches: 2, trend: '↑ 2.1%' },
    ],
    activityLog: [
      {
        time: '14:45',
        user: 'Finance — Grace',
        action: 'Refund approved',
        caseId: 'RF-4421',
        details: 'KES 47,800 to Grace Wanjiku',
        result: 'success',
        resultLabel: 'Success',
      },
      {
        time: '14:10',
        user: 'Disputes — Alan',
        action: 'Evidence package uploaded',
        caseId: 'CB-9912',
        details: 'Invoice, delivery proof, AVS match',
        result: 'success',
        resultLabel: 'Success',
      },
      {
        time: '13:20',
        user: 'Support — Jane',
        action: 'Escalation triggered',
        caseId: 'T-8821',
        details: 'VIP customer unresolved after 4h',
        result: 'warning',
        resultLabel: 'Escalated',
      },
      {
        time: '12:40',
        user: 'System',
        action: 'Duplicate detected',
        caseId: 'RF-4419',
        details: 'Linked to RF-4408',
        result: 'warning',
        resultLabel: 'Review',
      },
      {
        time: '11:55',
        user: 'Support — Kevin',
        action: 'Customer contacted',
        caseId: 'T-8803',
        details: 'WhatsApp message sent',
        result: 'success',
        resultLabel: 'Success',
      },
    ],
    notificationSettings: [
      { alertType: 'SLA breach risk', push: true, email: true, sms: true, slack: true },
      { alertType: 'Chargeback evidence due', push: true, email: true, sms: false, slack: true },
      { alertType: 'High-value refund approval', push: true, email: true, sms: true, slack: false },
      { alertType: 'Emergency escalation', push: true, email: true, sms: true, slack: true },
    ],
  };
  ticketFilter = 'all';
  readonly flows: Record<string, FlowConfig> = {
    cb: {
      labels: ['Case', 'Evidence', 'Submit', 'Done'],
      closeOnDone: true,
      doneMessage: 'Chargeback response submitted to network.',
    },
    rf: {
      labels: ['Review', 'Approve', 'Done'],
      closeOnDone: true,
      doneMessage: 'Refund executed successfully.',
    },
    brf: {
      labels: ['Upload', 'Review', 'Done'],
      closeOnDone: true,
      doneMessage: 'Bulk refund batch executed.',
    },
  };
  readonly steps: Record<string, number> = { cb: 1, rf: 1, brf: 1 };
  readonly tabs: Record<string, string> = { tkt: 'details' };
  openModals = new Set<string>();
  toastMessage = '';
  get filteredTickets(): SupportTicket[] {
    if (this.ticketFilter === 'all') return this.mockData.tickets;
    const map: Record<string, string> = {
      customer: 'Customer',
      merchant: 'Merchant',
      chargeback: 'Chargeback',
      refund: 'Refund',
    };
    return this.mockData.tickets.filter((t) => t.type === map[this.ticketFilter]);
  }
  setTicketFilter(filter: string, event?: Event): void {
    this.ticketFilter = filter;
    this.activatePill(event);
  }
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
  nextFlow(flow: string, total = this.flows[flow]?.labels.length ?? 1): void {
    const next = Math.min((this.steps[flow] ?? 1) + 1, total);
    this.steps[flow] = next;
    if (next >= total) {
      this.notify(this.flows[flow]?.doneMessage || 'Flow completed.');
      const modal = { cb: 'chargebackModal', rf: 'refundModal', brf: 'bulkRefundModal' }[flow];
      if (modal) window.setTimeout(() => this.closeModal(modal), 650);
    }
  }
  activeTab(prefix: string): string {
    return this.tabs[prefix] ?? '';
  }
  switchTab(prefix: string, key: string, event?: Event): void {
    this.tabs[prefix] = key;
    this.activatePill(event);
  }
  activatePill(event?: Event): void {
    const target = event?.currentTarget as HTMLElement | null;
    const parent = target?.parentElement;
    parent?.querySelectorAll('.pill').forEach((p) => p.classList.remove('active'));
    target?.classList.add('active');
  }
  processAction(modalId: string, message: string, ref = ''): void {
    this.notify(ref ? `${message} Reference: ${ref}` : message);
    if (modalId) this.closeModal(modalId);
  }
  priorityBadgeClass(priority: string): string {
    if (priority === 'Critical') return 'B-d';
    if (priority === 'High') return 'B-w';
    return 'B-i';
  }
  statusBadgeClass(status: string): string {
    const s = status.toLowerCase();
    if (['success', 'won', 'resolved', 'processed'].includes(s)) return 'B-s';
    if (['critical', 'danger', 'failed'].includes(s)) return 'B-d';
    if (['pending', 'evidence', 'warning', 'review', 'escalated'].includes(s)) return 'B-w';
    return 'B-i';
  }
  trendBadgeClass(trend: string): string {
    return trend.includes('↑') ? 'B-s' : 'B-w';
  }
  moveFocus(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input?.value?.length === 1) (input.nextElementSibling as HTMLElement | null)?.focus();
  }
  notify(message: string): void {
    this.toastMessage = message || 'Action completed.';
  }
  clearToast(): void {
    this.toastMessage = '';
  }
  private resetFlowsForModal(id: string): void {
    const map: Record<string, string[]> = {
      chargebackModal: ['cb'],
      refundModal: ['rf'],
      bulkRefundModal: ['brf'],
    };
    for (const flow of map[id] ?? []) this.steps[flow] = 1;
  }
}
