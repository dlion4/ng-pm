import { Component, Pipe, PipeTransform, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- CUSTOM PIPE FOR INLINE FILTERING ---
@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(items: any[], field: string): any[] {
    if (!items) return [];
    return items.filter(item => item.type === field);
  }
}

// --- INTERFACES FOR FUTURE API INTEGRATION ---
export interface Meter {
  id: string;
  name: string;
  type: 'prepaid' | 'postpaid';
  units: string;
  statusColor: string;
}

export interface ActionItem {
  icon: string;
  bgColor: string;
  textColor: string;
  title: string;
  subtitle: string;
  btnText: string;
  modal: string;
  isPrimary?: boolean;
}

export interface LowBalanceAlert {
  name: string;
  id: string;
  units: string;
  status: string;
  badgeClass: string;
}

export interface ChartBar {
  label: string;
  height: string;
  color: string;
}

export interface PostpaidAccount {
  name: string;
  id: string;
  meter: string;
  status: string;
  statusClass: string;
  lastBill: string;
  dueDate: string;
  amount: string;
}

export interface BudgetItem {
  name: string;
  actual: string;
  limit: string;
  percentage: string;
  color: string;
}

export interface Outage {
  location: string;
  time: string;
  cause: string;
}

export interface Dispute {
  ticket: string;
  subject: string;
  status: string;
  statusClass: string;
}

export interface Transaction {
  date: string;
  type: string;
  account: string;
  details: string;
  amount: string;
  status: string;
}

export interface PayMethod {
  id: string;
  name: string;
  icon: string;
  color: string;
  details: string;
}

@Component({
  selector: 'app-electricity-management',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe],
  templateUrl: './electricity-management.html',
  styleUrls: ['./electricity-management.css'],
  encapsulation: ViewEncapsulation.None
})
export class ElectricityManagementComponent {
  
  // --- STATE VARIABLES ---
  searchQuery: string = '';
  activeModal: string | null = null;

  // Multi-step modal states
  tokenStep: number = 1;
  postStep: number = 1;
  meterStep: number = 1;
  
  // Form states
  tokenAmount: number = 2000;
  selectedMeterId: string = '14825739';
  selectedPostpaidId: string = 'KPLC-22901847';
  selectedPayMethod: string = 'mpesa';
  newMeterType: string = 'prepaid';

  // --- MOCK DATA ---

  meters: Meter[] = [
    { id: '14825739', name: 'Home Meter', type: 'prepaid', units: '17', statusColor: 'var(--pm-accent)' },
    { id: '55829103', name: 'Rental Unit A', type: 'prepaid', units: '142', statusColor: 'var(--pm-accent)' },
    { id: '77291045', name: 'Rental Unit B', type: 'prepaid', units: '58', statusColor: 'var(--pm-warning)' },
    { id: '91028374', name: 'Parent Home', type: 'prepaid', units: '210', statusColor: 'var(--pm-accent)' },
    { id: '33920185', name: 'Solar PAYGO', type: 'prepaid', units: '45', statusColor: 'var(--pm-info)' },
    { id: 'KPLC-22901847', name: 'Office Postpaid', type: 'postpaid', units: 'N/A', statusColor: 'var(--pm-danger)' },
    { id: 'KPLC-11029384', name: 'Warehouse Postpaid', type: 'postpaid', units: 'N/A', statusColor: 'var(--pm-accent)' }
  ];

  attentionItems: ActionItem[] = [
    { icon: 'KP', bgColor: 'var(--pm-danger-soft)', textColor: 'var(--pm-danger)', title: 'Office postpaid overdue by 2 days', subtitle: 'Acc #KPLC-22901847 · KES 8,400', btnText: 'Pay', modal: 'payPostpaidModal', isPrimary: true },
    { icon: 'LB', bgColor: 'var(--pm-warning-soft)', textColor: 'var(--pm-warning)', title: 'Home prepaid balance below 20 units', subtitle: 'Meter #14825739 · est. 1.2 days left', btnText: 'Top-up', modal: 'buyTokenModal' },
    { icon: 'OT', bgColor: 'var(--pm-purple-soft)', textColor: 'var(--pm-purple)', title: 'Planned outage near Rental Unit B', subtitle: 'Tomorrow, 9:00 AM – 3:00 PM', btnText: 'Review', modal: 'outageTrackerModal' },
    { icon: 'DR', bgColor: 'var(--pm-info-soft)', textColor: 'var(--pm-info)', title: 'Meter reading dispute response ready', subtitle: 'Ticket #DSP-22419 · action required', btnText: 'Open', modal: 'disputeBillModal' }
  ];

  suggestions: ActionItem[] = [
    { icon: 'AT', bgColor: 'var(--pm-accent-soft)', textColor: 'var(--pm-accent)', title: 'Activate auto-top-up for 3 meters', subtitle: 'Avoid low-balance interruptions and queue penalties', btnText: 'Setup', modal: 'autoTopupModal' },
    { icon: 'TS', bgColor: 'var(--pm-warning-soft)', textColor: 'var(--pm-warning)', title: 'Shift borehole pumping to off-peak time', subtitle: 'Estimated savings: KES 2,100/month', btnText: 'See plan', modal: 'suggestionsModal' },
    { icon: 'BF', bgColor: 'var(--pm-info-soft)', textColor: 'var(--pm-info)', title: 'July office bill likely to exceed budget', subtitle: 'Forecast: KES 11,900 vs budget KES 9,500', btnText: 'Forecast', modal: 'billForecastModal' },
    { icon: 'EC', bgColor: 'var(--pm-danger-soft)', textColor: 'var(--pm-danger)', title: 'Emergency credit available on home meter', subtitle: 'Unlock 15 kWh until next purchase', btnText: 'Activate', modal: 'emergencyCreditModal' }
  ];

  lowBalanceAlerts: LowBalanceAlert[] = [
    { name: 'Home Meter', id: 'Meter 14825739', units: '17 units', status: 'Low', badgeClass: 'pm-badge-warning' },
    { name: 'Rental Unit B', id: 'Meter 77291045', units: '58 units', status: 'Medium', badgeClass: 'pm-badge-info' }
  ];

  tokenSpendChart: ChartBar[] = [
    { label: 'Jan', height: '65%', color: 'var(--pm-primary-light)' },
    { label: 'Feb', height: '80%', color: 'var(--pm-primary-light)' },
    { label: 'Mar', height: '70%', color: 'var(--pm-primary-light)' },
    { label: 'Apr', height: '90%', color: 'var(--pm-primary-light)' },
    { label: 'May', height: '75%', color: 'var(--pm-primary-light)' },
    { label: 'Jun', height: '60%', color: 'var(--pm-primary)' }
  ];

  postpaidAccounts: PostpaidAccount[] = [
    { name: 'Office Postpaid', id: 'KPLC-22901847', meter: '22901847', status: 'Overdue', statusClass: 'pm-badge-danger', lastBill: '15 Jun 2025', dueDate: '25 Jun 2025', amount: 'KES 8,400' },
    { name: 'Warehouse Postpaid', id: 'KPLC-11029384', meter: '11029384', status: 'Active', statusClass: 'pm-badge-success', lastBill: '10 Jun 2025', dueDate: '10 Jul 2025', amount: 'KES 14,050' }
  ];

  budgets: BudgetItem[] = [
    { name: 'Home Prepaid', actual: 'KES 18,400', limit: 'KES 20,000', percentage: '92%', color: 'var(--pm-warning)' },
    { name: 'Office Postpaid', actual: 'KES 8,400', limit: 'KES 9,500', percentage: '88%', color: 'var(--pm-info)' },
    { name: 'Rental Units', actual: 'KES 12,100', limit: 'KES 15,000', percentage: '81%', color: 'var(--pm-accent)' }
  ];

  dailyConsumption: ChartBar[] = [
    { label: 'Mon', height: '80%', color: 'var(--pm-primary-light)' },
    { label: 'Tue', height: '65%', color: 'var(--pm-primary-light)' },
    { label: 'Wed', height: '90%', color: 'var(--pm-warning)' },
    { label: 'Thu', height: '70%', color: 'var(--pm-primary-light)' },
    { label: 'Fri', height: '85%', color: 'var(--pm-primary-light)' },
    { label: 'Sat', height: '50%', color: 'var(--pm-accent)' },
    { label: 'Sun', height: '45%', color: 'var(--pm-accent)' }
  ];

  outages: Outage[] = [
    { location: 'Kilimani Area', time: 'Today, 2:00 PM', cause: 'Transformer Fault' },
    { location: 'Westlands Rd', time: 'Tomorrow, 9:00 AM', cause: 'Planned Maintenance' }
  ];

  disputes: Dispute[] = [
    { ticket: '#DSP-22419', subject: 'Estimated Reading Dispute', status: 'Action Required', statusClass: 'pm-badge-warning' },
    { ticket: '#DSP-21902', subject: 'Meter Malfunction', status: 'Under Review', statusClass: 'pm-badge-info' }
  ];

  transactions: Transaction[] = [
    { date: '27 Jun 2025', type: 'Prepaid', account: '14825739', details: 'Token Purchase', amount: 'KES 2,000', status: 'Success' },
    { date: '25 Jun 2025', type: 'Prepaid', account: '55829103', details: 'Token Purchase', amount: 'KES 5,000', status: 'Success' },
    { date: '22 Jun 2025', type: 'Postpaid', account: 'KPLC-11029384', details: 'Bill Payment', amount: 'KES 14,050', status: 'Success' },
    { date: '20 Jun 2025', type: 'Prepaid', account: '77291045', details: 'Token Purchase', amount: 'KES 3,000', status: 'Success' }
  ];

  payMethods: PayMethod[] = [
    { id: 'mpesa', name: 'M-Pesa', icon: 'bi bi-phone', color: 'var(--pm-accent)', details: 'STK Push to 0712***890 · Fee: KES 0' },
    { id: 'wallet', name: 'PayMo Wallet', icon: 'bi bi-wallet2', color: 'var(--pm-primary)', details: 'Balance: KES 24,500 · Fee: KES 0' },
    { id: 'bank', name: 'Bank Transfer (Equity)', icon: 'bi bi-bank', color: 'var(--pm-info)', details: 'Acc ***4521 · Fee: KES 25' }
  ];

  // --- METHODS ---

  openModal(id: string): void {
    if (id === this.activeModal) {
      return; 
    }
    this.activeModal = id;
    document.body.classList.add('modal-open');
    
    // Reset states for multi-step modals
    if (id === 'buyTokenModal') {
      this.tokenStep = 1;
      this.tokenAmount = 2000;
      this.selectedPayMethod = 'mpesa';
    } else if (id === 'payPostpaidModal') {
      this.postStep = 1;
      this.selectedPayMethod = 'mpesa';
    } else if (id === 'addMeterModal') {
      this.meterStep = 1;
      this.newMeterType = 'prepaid';
    } else if (id === 'receiptModal') {
      // If routing from a multi-step, close the parent first conceptually, 
      // but here we just swap the view cleanly.
    }
  }

  closeModal(): void {
    this.activeModal = null;
    document.body.classList.remove('modal-open');
  }
}