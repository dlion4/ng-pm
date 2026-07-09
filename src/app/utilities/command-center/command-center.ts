import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- INTERFACES FOR FUTURE API INTEGRATION ---
export interface ConnectedService {
  id: string;
  name: string;
  provider: string;
  iconClass: string;
  statusColor: string;
  modalLink: string;
}

export interface ServiceTableRow {
  serviceType: string;
  provider: string;
  account: string;
  status: string;
  statusClass: string;
  lastPayment: string;
  nextDue: string;
  amount: string;
  autoPay: boolean;
  iconClass: string;
  modalLink: string;
}

export interface ActionItem {
  icon: string;
  bgColor: string;
  textColor: string;
  title: string;
  subtitle: string;
  btnText: string;
  modalLink: string;
  isPrimary?: boolean;
}

export interface SpendCategory {
  label: string;
  height: string;
  color: string;
  amount: string;
}

export interface Budget {
  name: string;
  actual: string;
  limit: string;
  limitRaw: number;
  percentage: string;
  color: string;
}

export interface Transaction {
  date: string;
  utility: string;
  provider: string;
  account: string;
  amount: string;
  method: string;
  status: string;
  statusClass: string;
  iconClass: string;
}

export interface PayMethod {
  id: string;
  name: string;
  icon: string;
  color: string;
  details: string;
}

@Component({
  selector: 'app-utilities-command-center',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './command-center.html',
  styleUrls: ['./command-center.css'],
  encapsulation: ViewEncapsulation.None
})
export class UtilitiesCommandCenterComponent {

  // --- STATE VARIABLES ---
  searchQuery: string = '';
  activeModal: string | null = null;
  activeServiceTab: string = 'all';

  // Electricity Modal Multi-step State
  elecStep: number = 1;
  elecType: string = 'prepaid';
  elecMeter: string = '14825739';
  elecAmount: number = 2000;
  selectedPayMethod: string = 'mpesa';

  // --- MOCK DATA (Replace with API calls) ---

  serviceTabs = [
    { key: 'all', label: 'All (14)' },
    { key: 'active', label: 'Active (11)' },
    { key: 'pending', label: 'Pending (2)' },
    { key: 'paused', label: 'Paused (1)' }
  ];

  connectedServices: ConnectedService[] = [
    { id: '1', name: 'KPLC Home', provider: 'KPLC Prepaid', iconClass: 'bi bi-lightning-charge text-warning', statusColor: 'var(--pm-accent)', modalLink: 'payElectricityModal' },
    { id: '2', name: 'KPLC Office', provider: 'KPLC Prepaid', iconClass: 'bi bi-lightning-charge text-warning', statusColor: 'var(--pm-accent)', modalLink: 'payElectricityModal' },
    { id: '3', name: 'KPLC Rental A', provider: 'KPLC Prepaid', iconClass: 'bi bi-lightning-charge text-warning', statusColor: 'var(--pm-danger)', modalLink: 'payElectricityModal' },
    { id: '4', name: 'NCWSC Home', provider: 'NCWSC', iconClass: 'bi bi-droplet text-info', statusColor: 'var(--pm-warning)', modalLink: 'payWaterModal' },
    { id: '5', name: 'NCWSC Rental', provider: 'NCWSC', iconClass: 'bi bi-droplet text-info', statusColor: 'var(--pm-accent)', modalLink: 'payWaterModal' },
    { id: '6', name: 'DSTV Home', provider: 'DSTV', iconClass: 'bi bi-tv', statusColor: 'var(--pm-purple)', modalLink: 'payTVModal' },
    { id: '7', name: 'GOtv Rental', provider: 'GOtv', iconClass: 'bi bi-tv', statusColor: 'var(--pm-accent)', modalLink: 'payTVModal' },
    { id: '8', name: 'Safaricom Fibre', provider: 'Safaricom', iconClass: 'bi bi-wifi text-primary', statusColor: 'var(--pm-warning)', modalLink: 'payInternetModal' },
    { id: '9', name: 'Zuku Internet', provider: 'Zuku', iconClass: 'bi bi-wifi text-primary', statusColor: 'var(--pm-accent)', modalLink: 'payInternetModal' },
    { id: '10', name: 'Safaricom Airtime', provider: 'Safaricom', iconClass: 'bi bi-phone text-success', statusColor: 'var(--pm-accent)', modalLink: 'buyAirtimeModal' },
    { id: '11', name: 'Airtel Airtime', provider: 'Airtel', iconClass: 'bi bi-phone text-success', statusColor: 'var(--pm-accent)', modalLink: 'buyAirtimeModal' },
    { id: '12', name: 'Gas Home 13kg', provider: 'K-Gas', iconClass: 'bi bi-fire text-danger', statusColor: 'var(--pm-accent)', modalLink: 'orderGasModal' },
    { id: '13', name: 'Gas Office 6kg', provider: 'Hashi', iconClass: 'bi bi-fire text-danger', statusColor: 'var(--pm-muted)', modalLink: 'orderGasModal' },
    { id: '14', name: 'Solar Backup', provider: 'SolarNow', iconClass: 'bi bi-sun text-warning', statusColor: 'var(--pm-accent)', modalLink: 'manageUtilitiesModal' }
  ];

  allServiceRows: ServiceTableRow[] = [
    { serviceType: 'Electricity', provider: 'KPLC Prepaid', account: '14825739', status: 'Active', statusClass: 'pm-badge-success', lastPayment: '27 Jun', nextDue: '10 Jul', amount: 'KES 4,850', autoPay: true, iconClass: 'bi bi-lightning-charge text-warning', modalLink: 'payElectricityModal' },
    { serviceType: 'Electricity', provider: 'KPLC Prepaid', account: '22901847', status: 'Active', statusClass: 'pm-badge-success', lastPayment: '20 Jun', nextDue: '15 Jul', amount: 'KES 6,200', autoPay: true, iconClass: 'bi bi-lightning-charge text-warning', modalLink: 'payElectricityModal' },
    { serviceType: 'Electricity', provider: 'KPLC Prepaid', account: '33741092', status: 'Overdue', statusClass: 'pm-badge-danger', lastPayment: '25 May', nextDue: '24 Jun', amount: 'KES 3,100', autoPay: false, iconClass: 'bi bi-lightning-charge text-warning', modalLink: 'payElectricityModal' },
    { serviceType: 'Water', provider: 'NCWSC', account: '290081', status: 'Due Soon', statusClass: 'pm-badge-warning', lastPayment: '25 Jun', nextDue: '28 Jun', amount: 'KES 3,200', autoPay: false, iconClass: 'bi bi-droplet text-info', modalLink: 'payWaterModal' },
    { serviceType: 'Water', provider: 'NCWSC', account: '410293', status: 'Active', statusClass: 'pm-badge-success', lastPayment: '22 Jun', nextDue: '22 Jul', amount: 'KES 2,800', autoPay: true, iconClass: 'bi bi-droplet text-info', modalLink: 'payWaterModal' },
    { serviceType: 'TV', provider: 'DSTV', account: '20491867421', status: 'Expiring', statusClass: 'pm-badge-warning', lastPayment: '24 Jun', nextDue: '29 Jun', amount: 'KES 11,500', autoPay: true, iconClass: 'bi bi-tv', modalLink: 'payTVModal' },
    { serviceType: 'TV', provider: 'GOtv', account: '9018273645', status: 'Active', statusClass: 'pm-badge-success', lastPayment: '10 Jun', nextDue: '10 Jul', amount: 'KES 3,500', autoPay: false, iconClass: 'bi bi-tv', modalLink: 'payTVModal' },
    { serviceType: 'Internet', provider: 'Safaricom Fibre', account: 'SF-40812', status: 'Pending', statusClass: 'pm-badge-warning', lastPayment: '20 Jun', nextDue: '20 Jul', amount: 'KES 5,999', autoPay: true, iconClass: 'bi bi-wifi text-primary', modalLink: 'payInternetModal' },
    { serviceType: 'Internet', provider: 'Zuku', account: 'ZK-88291', status: 'Active', statusClass: 'pm-badge-success', lastPayment: '15 Jun', nextDue: '15 Jul', amount: 'KES 4,999', autoPay: false, iconClass: 'bi bi-wifi text-primary', modalLink: 'payInternetModal' },
    { serviceType: 'Gas', provider: 'K-Gas', account: 'KG-10293', status: 'Active', statusClass: 'pm-badge-success', lastPayment: '01 Jun', nextDue: '28 Jun', amount: 'KES 3,500', autoPay: false, iconClass: 'bi bi-fire text-danger', modalLink: 'orderGasModal' },
    { serviceType: 'Gas', provider: 'Hashi', account: 'HS-4421', status: 'Paused', statusClass: 'pm-badge-info', lastPayment: '12 May', nextDue: 'N/A', amount: 'KES 2,200', autoPay: false, iconClass: 'bi bi-fire text-danger', modalLink: 'orderGasModal' }
  ];

  attentionItems: ActionItem[] = [
    { icon: 'EL', bgColor: 'var(--pm-danger-soft)', textColor: 'var(--pm-danger)', title: 'KPLC bill overdue by 3 days', subtitle: 'Meter #14825739 · KES 4,850', btnText: 'Pay', modalLink: 'payElectricityModal', isPrimary: true },
    { icon: 'WT', bgColor: 'var(--pm-warning-soft)', textColor: 'var(--pm-warning)', title: 'Water bill due tomorrow', subtitle: 'NCWSC Acc #290081 · KES 3,200', btnText: 'Pay', modalLink: 'payWaterModal', isPrimary: false },
    { icon: 'TV', bgColor: 'var(--pm-purple-soft)', textColor: 'var(--pm-purple)', title: 'DSTV expires in 2 days', subtitle: 'Compact Plus · KES 11,500', btnText: 'Renew', modalLink: 'payTVModal', isPrimary: false },
    { icon: 'IN', bgColor: 'var(--pm-info-soft)', textColor: 'var(--pm-info)', title: 'Zuku Internet low data', subtitle: '3.2GB remaining · Resets in 8 days', btnText: 'Top-up', modalLink: 'payInternetModal', isPrimary: false }
  ];

  suggestions: ActionItem[] = [
    { icon: 'AP', bgColor: 'var(--pm-accent-soft)', textColor: 'var(--pm-accent)', title: 'Auto-pay 5 recurring bills', subtitle: 'Save KES 1,200/mo in late fees', btnText: 'Setup', modalLink: 'autoPaySetupModal' },
    { icon: 'BD', bgColor: 'var(--pm-info-soft)', textColor: 'var(--pm-info)', title: 'Switch to Faiba 40Mbps plan', subtitle: 'Save KES 1,500/mo vs current plan', btnText: 'Compare', modalLink: 'serviceComparisonModal' },
    { icon: 'TK', bgColor: 'var(--pm-warning-soft)', textColor: 'var(--pm-warning)', title: 'Buy KPLC tokens in bulk', subtitle: 'KES 5,000 tokens save 3% on tariff', btnText: 'Buy', modalLink: 'buyTokenModal' },
    { icon: 'GS', bgColor: 'var(--pm-purple-soft)', textColor: 'var(--pm-purple)', title: '13kg gas refill due soon', subtitle: 'Based on 28-day usage cycle', btnText: 'Order', modalLink: 'orderGasModal' }
  ];

  spendCategories: SpendCategory[] = [
    { label: 'Electric', height: '85%', color: 'var(--pm-warning)', amount: 'KES 18,400' },
    { label: 'Water', height: '50%', color: 'var(--pm-info)', amount: 'KES 6,800' },
    { label: 'TV', height: '70%', color: 'var(--pm-purple)', amount: 'KES 14,500' },
    { label: 'Internet', height: '60%', color: 'var(--pm-primary)', amount: 'KES 8,500' },
    { label: 'Airtime', height: '35%', color: 'var(--pm-accent)', amount: 'KES 5,200' },
    { label: 'Gas', height: '45%', color: 'var(--pm-danger)', amount: 'KES 7,800' },
    { label: 'Solar', height: '25%', color: '#64748B', amount: 'KES 6,200' }
  ];

  budgets: Budget[] = [
    { name: 'Electricity', actual: 'KES 18,400', limit: 'KES 20,000', limitRaw: 20000, percentage: '92%', color: 'var(--pm-warning)' },
    { name: 'Water', actual: 'KES 6,800', limit: 'KES 8,000', limitRaw: 8000, percentage: '85%', color: 'var(--pm-info)' },
    { name: 'TV & Streaming', actual: 'KES 14,500', limit: 'KES 15,000', limitRaw: 15000, percentage: '97%', color: 'var(--pm-danger)' },
    { name: 'Internet', actual: 'KES 8,500', limit: 'KES 12,000', limitRaw: 12000, percentage: '71%', color: 'var(--pm-primary)' },
    { name: 'Gas & Energy', actual: 'KES 7,800', limit: 'KES 10,000', limitRaw: 10000, percentage: '78%', color: 'var(--pm-accent)' }
  ];

  monthlyTrends = [
    { label: 'Jan', height: '70%', color: 'var(--pm-primary-light)' },
    { label: 'Feb', height: '85%', color: 'var(--pm-primary-light)' },
    { label: 'Mar', height: '75%', color: 'var(--pm-primary-light)' },
    { label: 'Apr', height: '90%', color: 'var(--pm-primary-light)' },
    { label: 'May', height: '65%', color: 'var(--pm-primary-light)' },
    { label: 'Jun', height: '60%', color: 'var(--pm-primary)' }
  ];

  payMethods: PayMethod[] = [
    { id: 'mpesa', name: 'M-Pesa', icon: 'bi bi-phone', color: 'var(--pm-accent)', details: 'STK Push to 0712***890 · Fee: KES 0' },
    { id: 'wallet', name: 'PayMo Wallet', icon: 'bi bi-wallet2', color: 'var(--pm-primary)', details: 'Balance: KES 24,500 · Fee: KES 0' },
    { id: 'bank', name: 'Bank Transfer (Equity)', icon: 'bi bi-bank', color: 'var(--pm-info)', details: 'Acc ***4521 · Fee: KES 25' }
  ];

  autoPayRules = [
    { name: 'KPLC Home', details: 'Due date · M-Pesa' },
    { name: 'DSTV Home', details: 'Bill arrival · Wallet' },
    { name: 'Safaricom Fibre', details: '3 days before · M-Pesa' }
  ];

  scheduledPayments = [
    { name: 'NCWSC Rental', date: '28 Jun 2025', amount: 'KES 2,800' },
    { name: 'GOtv Rental', date: '10 Jul 2025', amount: 'KES 3,500' }
  ];

  householdMembers = [
    { initials: 'JK', name: 'James K.', role: 'Admin' },
    { initials: 'SK', name: 'Sarah K.', role: 'Member' },
    { initials: 'DK', name: 'David K.', role: 'Viewer' }
  ];

  recentTransactions: Transaction[] = [
    { date: '27 Jun 2025', utility: 'Electricity', provider: 'KPLC Prepaid', account: '14825739', amount: 'KES 3,000', method: 'M-Pesa', status: 'Success', statusClass: 'pm-badge-success', iconClass: 'bi bi-lightning-charge text-warning' },
    { date: '25 Jun 2025', utility: 'Water', provider: 'NCWSC', account: '290081', amount: 'KES 3,200', method: 'PayMo Wallet', status: 'Success', statusClass: 'pm-badge-success', iconClass: 'bi bi-droplet text-info' },
    { date: '24 Jun 2025', utility: 'TV', provider: 'DSTV', account: '20491867421', amount: 'KES 11,500', method: 'M-Pesa', status: 'Success', statusClass: 'pm-badge-success', iconClass: 'bi bi-tv' },
    { date: '22 Jun 2025', utility: 'Airtime', provider: 'Safaricom', account: '0712***890', amount: 'KES 1,000', method: 'M-Pesa', status: 'Success', statusClass: 'pm-badge-success', iconClass: 'bi bi-phone text-success' },
    { date: '20 Jun 2025', utility: 'Internet', provider: 'Safaricom Fibre', account: 'SF-40812', amount: 'KES 5,999', method: 'Bank Transfer', status: 'Pending', statusClass: 'pm-badge-warning', iconClass: 'bi bi-wifi text-primary' }
  ];

  // --- COMPUTED PROPERTIES ---

  get filteredServices(): ServiceTableRow[] {
    if (this.activeServiceTab === 'all') return this.allServiceRows;
    if (this.activeServiceTab === 'active') return this.allServiceRows.filter(s => s.status === 'Active');
    if (this.activeServiceTab === 'pending') return this.allServiceRows.filter(s => s.status === 'Pending' || s.status === 'Due Soon' || s.status === 'Expiring');
    if (this.activeServiceTab === 'paused') return this.allServiceRows.filter(s => s.status === 'Paused' || s.status === 'Overdue');
    return this.allServiceRows;
  }

  // --- METHODS ---

  openModal(id: string): void {
    if (id === this.activeModal) {
      return; // Prevent re-opening same modal and resetting steps
    }
    this.activeModal = id;
    document.body.classList.add('modal-open'); // Prevent background scroll

    // Reset multi-step modals on open
    if (id === 'payElectricityModal') {
      this.elecStep = 1;
      this.elecType = 'prepaid';
      this.elecMeter = '14825739';
      this.elecAmount = 2000;
      this.selectedPayMethod = 'mpesa';
    }
  }

  closeModal(): void {
    this.activeModal = null;
    document.body.classList.remove('modal-open');
  }

  filterServices(key: string): void {
    this.activeServiceTab = key;
  }

  moveFocus(event: Event, index: number): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.length === 1) {
      const nextInput = inputElement.nextElementSibling as HTMLInputElement;
      if (nextInput && nextInput.tagName === 'INPUT') {
        nextInput.focus();
      } else {
        // Auto-submit or validate if on last pin
      }
    }
  }
}
