import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- INTERFACES FOR FUTURE API INTEGRATION ---
export interface WaterAccount {
  provider: string;
  account: string;
  nickname: string;
  amount: string;
  dueDate: string;
  status: string;
  statusClass: string;
  type: 'due' | 'paid' | 'active';
}

export interface AlertItem {
  iconHtml: string;
  bgColor: string;
  textColor: string;
  title: string;
  subtitle: string;
  btnText: string;
  modal: string;
  btnClass?: string;
}

export interface ChartBar {
  label: string;
  height: string;
  color: string;
}

export interface BowserSupplier {
  name: string;
  cert: string;
  cost: string;
  sla: string;
}

@Component({
  selector: 'app-water-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './water-management.html',
  styleUrls: ['./water-management.css'],
  encapsulation: ViewEncapsulation.None
})
export class WaterManagementComponent {
  
  // --- STATE VARIABLES ---
  searchQuery: string = '';
  activeModal: string | null = null;
  waterTab: string = 'all';

  // Multi-step Modal States
  waterStep: number = 1;
  addMeterStep: number = 1;
  bowserStep: number = 1;

  // Form States
  selectedWaterAcc: string = '290081';
  waterAmount: number = 3200;
  selectedPayMethod: string = 'mpesa';
  selectedProvider: string = 'NCWSC';
  selectedBowserSup: string = 'Nairobi Pure Water Ltd';
  bowserSize: string = '10000';

  // --- MOCK DATA ---

  waterAccounts: WaterAccount[] = [
    { provider: 'Nairobi Water (NCWSC)', account: '290081', nickname: 'Home Kilimani', amount: 'KES 3,200', dueDate: 'Tomorrow', status: 'Due Soon', statusClass: 'pm-badge-warning', type: 'due' },
    { provider: 'Kisumu Water (KIWASCO)', account: '441092', nickname: 'Kisumu Rental', amount: 'KES 5,150', dueDate: '28 Jun', status: 'Due Soon', statusClass: 'pm-badge-warning', type: 'due' },
    { provider: 'Mombasa Water (MOWASSCO)', account: '112009', nickname: 'Mombasa Office', amount: 'KES 0', dueDate: '10 Jul', status: 'Paid', statusClass: 'pm-badge-success', type: 'paid' },
    { provider: 'Private Borehole', account: 'B01-882', nickname: 'Home Kitengela', amount: 'KES 0', dueDate: 'N/A', status: 'Active', statusClass: 'pm-badge-info', type: 'active' },
    { provider: 'Nakuru Water (NAWASSCO)', account: 'NAW-8821', nickname: 'Guest House', amount: 'KES 0', dueDate: '15 Jun', status: 'Paid', statusClass: 'pm-badge-success', type: 'paid' }
  ];

  waterAlerts: AlertItem[] = [
    { iconHtml: '<i class="bi bi-droplet"></i>', bgColor: 'var(--pm-danger-soft)', textColor: 'var(--pm-danger)', title: 'Continuous flow (Potential leak)', subtitle: 'Rental Unit A · Detected for 48hrs', btnText: 'Report', modal: 'reportLeakModal', btnClass: 'pm-btn-danger' },
    { iconHtml: 'NW', bgColor: 'var(--pm-warning-soft)', textColor: 'var(--pm-warning)', title: 'NCWSC bill due tomorrow', subtitle: 'Acc #290081 · KES 3,200', btnText: 'Pay', modal: 'payWaterModal' },
    { iconHtml: '<i class="bi bi-cone-striped"></i>', bgColor: 'var(--pm-info-soft)', textColor: 'var(--pm-info)', title: 'Low pressure / rationing expected', subtitle: 'Nairobi West area · Thu-Fri', btnText: 'Details', modal: 'outageWaterModal' },
    { iconHtml: '<i class="bi bi-clipboard-check"></i>', bgColor: 'var(--pm-purple-soft)', textColor: 'var(--pm-purple)', title: 'Meter reading required', subtitle: 'Home Kilimani · verify current bill', btnText: 'Upload', modal: 'uploadWaterReadingModal' }
  ];

  waterSuggestions: AlertItem[] = [
    { iconHtml: '<i class="bi bi-truck"></i>', bgColor: 'var(--pm-accent-soft)', textColor: 'var(--pm-accent)', title: 'Pre-book water bowser', subtitle: 'Prepare for rationing in Nairobi West', btnText: 'Order', modal: 'orderBowserModal' },
    { iconHtml: '<i class="bi bi-tools"></i>', bgColor: 'var(--pm-warning-soft)', textColor: 'var(--pm-warning)', title: 'Request plumber for Rental A', subtitle: 'Fix leak to prevent KES 4k penalty/waste', btnText: 'Request', modal: 'serviceWaterModal' },
    { iconHtml: '<i class="bi bi-arrow-repeat"></i>', bgColor: 'var(--pm-info-soft)', textColor: 'var(--pm-info)', title: 'Set auto-pay for NCWSC', subtitle: 'Avoid disconnection fees (KES 1,500)', btnText: 'Setup', modal: 'autoPayWaterModal' },
    { iconHtml: '<i class="bi bi-shield-check"></i>', bgColor: 'var(--pm-primary-light)', textColor: '#fff', title: 'Dispute unusually high bill', subtitle: 'KIWASCO bill is 40% above average', btnText: 'Dispute', modal: 'disputeWaterModal' }
  ];

  consumptionChart: ChartBar[] = [
    { label: 'Jan', height: '55%', color: 'var(--pm-primary-light)' },
    { label: 'Feb', height: '60%', color: 'var(--pm-primary-light)' },
    { label: 'Mar', height: '58%', color: 'var(--pm-primary-light)' },
    { label: 'Apr', height: '70%', color: 'var(--pm-primary-light)' },
    { label: 'May', height: '88%', color: 'var(--pm-danger)' },
    { label: 'Jun', height: '62%', color: 'var(--pm-info)' }
  ];

  bowserSuppliers: BowserSupplier[] = [
    { name: 'Nairobi Pure Water Ltd', cert: 'NEMA Certified', cost: 'KES 7,500', sla: 'Same day (4h)' },
    { name: 'Maji Safi Trucking', cert: 'NEMA Certified', cost: 'KES 6,800', sla: 'Next day' },
    { name: 'Aqua Delivery Co.', cert: 'Borehole Cert.', cost: 'KES 8,000', sla: 'Express (2h)' }
  ];

  // --- COMPUTED PROPERTIES ---
  
  get filteredWaterAccounts(): WaterAccount[] {
    if (this.waterTab === 'all') return this.waterAccounts;
    if (this.waterTab === 'due') return this.waterAccounts.filter(a => a.type === 'due');
    if (this.waterTab === 'paid') return this.waterAccounts.filter(a => a.type === 'paid');
    return this.waterAccounts;
  }

  // --- METHODS ---

  openModal(id: string): void {
    if (id === this.activeModal) {
      return; 
    }
    this.activeModal = id;
    document.body.classList.add('modal-open');
    
    // Reset steps for multi-step modals
    if (id === 'payWaterModal') {
      this.waterStep = 1;
      this.waterAmount = 3200;
      this.selectedPayMethod = 'mpesa';
    } else if (id === 'addWaterMeterModal') {
      this.addMeterStep = 1;
      this.selectedProvider = 'NCWSC';
    } else if (id === 'orderBowserModal') {
      this.bowserStep = 1;
      this.bowserSize = '10000';
      this.selectedBowserSup = 'Nairobi Pure Water Ltd';
    }
  }

  closeModal(): void {
    this.activeModal = null;
    document.body.classList.remove('modal-open');
  }

  filterWater(tab: string): void {
    this.waterTab = tab;
  }

  moveFocus(event: Event, index: number): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.length === 1) {
      const nextInput = inputElement.nextElementSibling as HTMLInputElement;
      if (nextInput && nextInput.tagName === 'INPUT') {
        nextInput.focus();
      }
    }
  }
}