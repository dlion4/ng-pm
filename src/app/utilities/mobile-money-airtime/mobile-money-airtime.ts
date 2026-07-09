
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Transaction {
  date: string;
  type: string;
  details: string;
  amount: string;
  network: string;
  status: string;
  statusClass: string;
}

export interface LinkedLine {
  phone: string;
  network: string;
  networkColor: string;
  airtimeBalance: string;
  activeData: string;
  voiceSms: string;
  autoRenew: string;
  autoRenewClass: string;
}

@Component({
  selector: 'app-mobile-money-hub',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mobile-money-airtime.html',
  styleUrls: ['./mobile-money-airtime.css'],
  encapsulation: ViewEncapsulation.None
})
export class MobileMoneyHubComponent implements OnInit {
  
  isModalOpen: { [key: string]: boolean } = {};
  activeTabs: { [key: string]: string } = {
    dataNet: 'saf',
    agentView: 'list',
    mshwariTab: 'save',
    kcbTab: 'save'
  };
  chips: { [key: string]: string } = {
    airAmt: '250'
  };
  selectedBundle: string = '12GB';
  selectedBonga: string = '1GB';
  paymentMethod: string = 'mpesa';

  flows: { [key: string]: number } = { airtime: 1, xnet: 1, global: 1 };
  processLoading: { [key: string]: boolean } = {};
  modalState: { [key: string]: { loading: boolean; processed: boolean; msg?: string; ref?: string } } = {};

  // Dynamic Data Models ready for API integration
  linkedLines: LinkedLine[] = [
    { phone: '0712 345 890', network: 'Safaricom', networkColor: '#047857', airtimeBalance: 'KES 1,200.00', activeData: '11.7 GB (30 Days)', voiceSms: '500 Min, 1000 SMS', autoRenew: 'On (12GB)', autoRenewClass: 'pm-badge-success' },
    { phone: '0733 987 456', network: 'Airtel', networkColor: '#DC2626', airtimeBalance: 'KES 250.00', activeData: '2.5 GB (Exp. 2 Days)', voiceSms: '100 Min', autoRenew: 'Alert Only', autoRenewClass: 'pm-badge-info' },
    { phone: '0777 112 233', network: 'Telkom', networkColor: '#3B82F6', airtimeBalance: 'KES 30.00', activeData: '0 MB', voiceSms: '0 Min', autoRenew: 'Off', autoRenewClass: '' }
  ];

  recentTransactions: Transaction[] = [
    { date: '27 Jun 2025', type: 'Send Money', details: 'To: John Doe (Airtel)', amount: '-KES 1,500', network: 'M-Pesa', status: 'Completed', statusClass: 'pm-badge-success' },
    { date: '27 Jun 2025', type: 'Buy Data', details: '12GB Monthly Bundle', amount: '-KES 1,000', network: 'Safaricom', status: 'Active', statusClass: 'pm-badge-success' },
    { date: '26 Jun 2025', type: 'Pochi Payment', details: 'From: Jane Smith', amount: '+KES 4,500', network: 'M-Pesa Pochi', status: 'Received', statusClass: 'pm-badge-success' },
    { date: '25 Jun 2025', type: 'Fuliza Repay', details: 'Auto-deduction', amount: '-KES 500', network: 'M-Pesa', status: 'Cleared', statusClass: 'pm-badge-success' },
    { date: '24 Jun 2025', type: 'Buy Airtime', details: 'For 0733***456', amount: '-KES 250', network: 'Airtel', status: 'Completed', statusClass: 'pm-badge-success' }
  ];

  historyTransactions: any[] = [
    { date: '27 Jun', type: 'Send Money', ref: 'John Doe', amount: '-KES 1,500', status: 'Success' },
    { date: '27 Jun', type: 'Data Bundle', ref: 'Safaricom', amount: '-KES 1,000', status: 'Success' },
    { date: '26 Jun', type: 'Pochi Payment', ref: 'Jane Smith', amount: '+KES 4,500', status: 'Success' },
    { date: '25 Jun', type: 'Fuliza Repay', ref: 'Auto', amount: '-KES 500', status: 'Success' },
    { date: '24 Jun', type: 'Buy Airtime', ref: 'Airtel 0733***', amount: '-KES 250', status: 'Success' },
    { date: '22 Jun', type: 'Withdrawal', ref: 'Agent #44512', amount: '-KES 5,000', status: 'Success' },
    { date: '21 Jun', type: 'Mali Invest', ref: 'Unit Trust', amount: '-KES 10,000', status: 'Success' }
  ];

  pochiTransactions: any[] = [
    { time: '14:30', customer: '0711***222', amount: '+KES 1,200', status: 'Success' },
    { time: '12:15', customer: '0722***444', amount: '+KES 500', status: 'Success' },
    { time: '10:05', customer: '0799***888', amount: '+KES 6,800', status: 'Success' }
  ];

  constructor() {}

  ngOnInit(): void {}

  openModal(id: string) {
    this.isModalOpen[id] = true;
    document.body.classList.add('modal-open');
  }

  closeModal(id: string) {
    this.isModalOpen[id] = false;
    this.modalState[id] = { loading: false, processed: false };
    document.body.classList.remove('modal-open');
    // Reset flow if it's a step modal
    const flowKey = id === 'buyAirtimeModal' ? 'airtime' : id === 'sendMoneyCrossNetworkModal' ? 'xnet' : id === 'mPesaGlobalModal' ? 'global' : '';
    if (flowKey) {
      this.flows[flowKey] = 1;
    }
  }

  getLabels(flow: string): string[] {
    if (flow === 'airtime') return ['Details', 'Pay', 'Done'];
    if (flow === 'xnet') return ['Recipient', 'Amount', 'Done'];
    if (flow === 'global') return ['Destination', 'Amount', 'Done'];
    return [];
  }

  getModalId(flow: string): string {
    if (flow === 'airtime') return 'buyAirtimeModal';
    if (flow === 'xnet') return 'sendMoneyCrossNetworkModal';
    if (flow === 'global') return 'mPesaGlobalModal';
    return '';
  }

  nextFlowStep(flow: string, total: number) {
    const current = this.flows[flow];
    if (current === total - 1) {
      this.processLoading[flow] = true;
      setTimeout(() => {
        this.processLoading[flow] = false;
        this.flows[flow]++;
      }, 1200);
      return;
    }
    if (current >= total) {
      this.closeModal(this.getModalId(flow));
      return;
    }
    this.flows[flow]++;
  }

  processAction(modalId: string, msg: string, ref: string) {
    this.modalState[modalId] = { loading: true, processed: false };
    setTimeout(() => {
      this.modalState[modalId] = { loading: false, processed: true, msg, ref };
    }, 1200);
  }
}
