import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- INTERFACES FOR FUTURE API INTEGRATION ---
export interface FibreConnection {
  provider: string;
  account: string;
  location: string;
  speed: string;
  status: string;
  statusClass: string;
  nextBill: string;
}

export interface SimCard {
  number: string;
  provider: string;
  nickname: string;
  dataBal: string;
  status: string;
  statusClass: string;
  statusColor: string;
  iconColor: string;
}

export interface ChartBar {
  label: string;
  height: string;
  color: string;
}

export interface AutoRenewal {
  name: string;
  details: string;
  status: string;
  statusClass: string;
}

export interface NetworkStatusItem {
  name: string;
  icon: string;
  details: string;
  bg: string;
  borderColor: string;
}

export interface Outage {
  name: string;
  status: string;
  statusClass: string;
  color: string;
  details: string;
}

@Component({
  selector: 'app-internet-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './internet-connectivity.html',
  styleUrls: ['./internet-connectivity.css'],
  encapsulation: ViewEncapsulation.None
})
export class InternetManagementComponent {
  
  // --- STATE VARIABLES ---
  searchQuery: string = '';
  activeModal: string | null = null;

  // Multi-step Modal States
  fibreStep: number = 1;
  addConnStep: number = 1;
  
  // Form States
  payMethod: string = 'mpesa';
  selectedFibre: string = 'SF-40812';
  selectedBundle: string = '1000';
  activeDataTab: string = 'saf';
  selectedUpgrade: string = '';
  connType: string = 'fibre';
  speedTestDone: boolean = false;

  // --- MOCK DATA ---

  networks: string[] = [
    'Safaricom Home', 'Zuku Office', 'Starlink Roam', 'Safaricom SIM', 'Airtel SIM', 'Telkom SIM'
  ];

  fibreConnections: FibreConnection[] = [
    { provider: 'Safaricom Home', account: 'SF-40812', location: 'Kilimani, Nairobi', speed: '40 Mbps', status: 'Active', statusClass: 'pm-badge-success', nextBill: '01 Jul 2025' },
    { provider: 'Zuku', account: 'ZK-11928', location: 'Westlands, Nairobi', speed: '20 Mbps', status: 'Degraded', statusClass: 'pm-badge-warning', nextBill: '05 Jul 2025' },
    { provider: 'Starlink', account: 'STK-99182', location: 'Kitengela, Nairobi', speed: '100 Mbps', status: 'Online', statusClass: 'pm-badge-success', nextBill: '15 Jul 2025' }
  ];

  simCards: SimCard[] = [
    { number: '0712 *** 890', provider: 'Safaricom', nickname: 'My Primary Line', dataBal: '4.2 GB', status: 'Active', statusClass: 'pm-badge-success', statusColor: 'var(--pm-accent)', iconColor: '#10B981' },
    { number: '0722 *** 111', provider: 'Safaricom', nickname: 'Wife Line', dataBal: '1.8 GB', status: 'Active', statusClass: 'pm-badge-success', statusColor: 'var(--pm-accent)', iconColor: '#10B981' },
    { number: '0733 *** 456', provider: 'Airtel', nickname: 'Work Line', dataBal: '0.4 GB', status: 'Low Data', statusClass: 'pm-badge-danger', statusColor: 'var(--pm-danger)', iconColor: 'var(--pm-danger)' }
  ];

  usageChart: ChartBar[] = [
    { label: 'Jan', height: '40%', color: 'var(--pm-primary-light)' },
    { label: 'Feb', height: '55%', color: 'var(--pm-primary-light)' },
    { label: 'Mar', height: '48%', color: 'var(--pm-primary-light)' },
    { label: 'Apr', height: '80%', color: 'var(--pm-primary)' },
    { label: 'May', height: '65%', color: 'var(--pm-primary)' },
    { label: 'Jun', height: '70%', color: 'var(--pm-primary)' }
  ];

  autoRenewals: AutoRenewal[] = [
    { name: 'Safaricom Home', details: 'KES 5,999 on 1st', status: 'Active', statusClass: 'pm-badge-success' },
    { name: 'Starlink Roam', details: 'KES 6,500 on 15th', status: 'Active', statusClass: 'pm-badge-success' },
    { name: 'Airtel Data 12GB', details: 'KES 1,000 monthly', status: 'Paused', statusClass: 'pm-badge-warning' }
  ];

  networkStatus: NetworkStatusItem[] = [
    { name: 'Safaricom Fibre', icon: 'bi bi-check-circle', details: '100% uptime last 7 days', bg: 'var(--pm-accent-soft)', borderColor: '#10B981' },
    { name: 'Zuku Kilimani', icon: 'bi bi-exclamation-triangle', details: 'Degraded speeds in area', bg: 'var(--pm-warning-soft)', borderColor: '#F59E0B' },
    { name: 'Starlink', icon: 'bi bi-globe', details: 'Normal operation (45ms latency)', bg: 'var(--pm-surface-2)', borderColor: 'var(--pm-border)' }
  ];

  outages: Outage[] = [
    { name: 'Zuku Kilimani Node', status: 'Investigating', statusClass: 'pm-badge-warning', color: 'var(--pm-warning)', details: 'Fibre cut reported near Yaya Centre. Teams on site. ETR: 4:00 PM.' },
    { name: 'Safaricom Mobile Data (Mombasa)', status: 'Major', statusClass: 'pm-badge-danger', color: 'var(--pm-danger)', details: 'Core switch failure. 3G/4G degraded. ETR: Undetermined.' },
    { name: 'Faiba JTL Planned Maintenance', status: 'Scheduled', statusClass: 'pm-badge-info', color: 'var(--pm-info)', details: 'Tomorrow 2AM - 4AM. Expected downtime 30 mins.' }
  ];

  // --- METHODS ---

  openModal(id: string): void {
    if (id === this.activeModal) {
      return; 
    }
    this.activeModal = id;
    document.body.classList.add('modal-open');
    
    // Reset states for multi-step modals to avoid stale data
    if (id === 'payFibreModal') {
      this.fibreStep = 1;
      this.payMethod = 'mpesa';
    } else if (id === 'addConnectionModal') {
      this.addConnStep = 1;
      this.connType = 'fibre';
    } else if (id === 'runSpeedTestModal') {
      this.speedTestDone = false;
    } else if (id === 'buyDataModal') {
      this.activeDataTab = 'saf';
      this.selectedBundle = '1000';
    }
  }

  closeModal(): void {
    this.activeModal = null;
    document.body.classList.remove('modal-open');
  }
}
