import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

interface FlowState {
  current: number;
  total: number;
  labels: string[];
}

interface Wallet {
  name: string;
  provider: string;
  balance: string;
  dailyLimit: string;
  health: number;
  txns24h: number;
}

interface LinkedWallet {
  phone: string;
  provider: string;
  owner: string;
  kyc: string;
  status: string;
  permissions: string;
}

interface Transfer {
  date: string;
  fromTo: string;
  amount: string;
  status: string;
  ref: string;
}

interface Psp {
  name: string;
  type: string;
  status: string;
  apiHealth: string;
  settlement: string;
}

interface AttentionItem {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  btnText: string;
  btnClass: string;
  modalTarget: string;
}

interface Suggestion {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  btnText: string;
  modalTarget: string;
}

@Component({
  selector: 'app-mobile-money-hub',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mobile-money-hub.html',
  styleUrls: ['./mobile-money-hub.css'],
  encapsulation: ViewEncapsulation.None
})
export class MobileMoneyHubComponent implements OnInit, AfterViewInit {

  // Flow states for multi-step modals
  flows: { [key: string]: FlowState } = {
    send: { current: 1, total: 4, labels: ['Wallets', 'Amount', 'Confirm', 'Done'] },
    bulk: { current: 1, total: 3, labels: ['Upload', 'Review', 'Done'] },
    disp: { current: 1, total: 3, labels: ['Transaction', 'Evidence', 'Done'] },
    tshoot: { current: 1, total: 3, labels: ['Issue', 'Diagnosis', 'Confirm'] }
  };

  // Data arrays for dynamic binding
  wallets: Wallet[] = [
    { name: 'Business Paybill', provider: 'M-Pesa', balance: 'KES 8,420,500', dailyLimit: 'KES 50M', health: 98, txns24h: 1842 },
    { name: 'Disbursement Till', provider: 'Airtel Money', balance: 'KES 2,184,000', dailyLimit: 'KES 20M', health: 94, txns24h: 892 },
    { name: 'Collections Till', provider: 'T-Kash', balance: 'KES 941,200', dailyLimit: 'KES 10M', health: 87, txns24h: 312 },
    { name: 'Payroll Float', provider: 'Pesalink', balance: 'KES 12,500,000', dailyLimit: 'KES 100M', health: 99, txns24h: 48 }
  ];

  linkedWallets: LinkedWallet[] = [
    { phone: '0712 345 890', provider: 'M-Pesa', owner: 'James Kamau', kyc: 'Full', status: 'Active', permissions: 'Send, Receive, Bulk' },
    { phone: '0733 112 445', provider: 'Airtel Money', owner: 'Finance Dept', kyc: 'Full', status: 'Active', permissions: 'Send, Bulk' },
    { phone: '0700 998 112', provider: 'T-Kash', owner: 'Procurement', kyc: 'Partial', status: 'Pending KYC', permissions: 'Receive only' }
  ];

  recentTransfers: Transfer[] = [
    { date: '27 Jun', fromTo: 'M-Pesa → 0712***890', amount: 'KES 250,000', status: 'Success', ref: 'MP-882910' },
    { date: '27 Jun', fromTo: 'Airtel → 200 suppliers', amount: 'KES 4,820,000', status: 'Partial', ref: 'AT-991203' },
    { date: '26 Jun', fromTo: 'T-Kash → 0733***445', amount: 'KES 85,000', status: 'Success', ref: 'TK-774501' }
  ];

  psps: Psp[] = [
    { name: 'Safaricom M-Pesa', type: 'B2C / C2B', status: 'Live', apiHealth: '99.98%', settlement: 'T+0' },
    { name: 'Airtel Money', type: 'B2C / C2B', status: 'Live', apiHealth: '99.71%', settlement: 'T+1' },
    { name: 'Pesalink', type: 'Bank Transfer', status: 'Live', apiHealth: '100%', settlement: 'Real-time' },
    { name: 'Cellulant', type: 'PSP Aggregator', status: 'Maintenance', apiHealth: '94.2%', settlement: 'T+1' }
  ];

  attentionItems: AttentionItem[] = [
    { icon: 'bi-exclamation-triangle', iconBg: 'var(--pm-danger-soft)', iconColor: 'var(--pm-danger)', title: 'M-Pesa B2C batch failed (47 txns)', subtitle: 'KES 1.24M — retry or manual review', btnText: 'Retry', btnClass: 'btn-pm-d', modalTarget: 'bulkRetryModal' },
    { icon: 'bi-person-exclamation', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'KYC refresh required (45 accounts)', subtitle: 'Due by 30 Jun 2025', btnText: 'Start', btnClass: '', modalTarget: 'kycBulkModal' },
    { icon: 'bi-link-45deg', iconBg: 'var(--pm-info-soft)', iconColor: 'var(--pm-info)', title: 'Airtel Money API token expiring', subtitle: 'In 6 days — renew credentials', btnText: 'Renew', btnClass: '', modalTarget: 'pspSettingsModal' }
  ];

  suggestions: Suggestion[] = [
    { icon: 'bi-lightning-charge', iconBg: 'var(--pm-accent-soft)', iconColor: 'var(--pm-accent)', title: 'Enable instant M-Pesa B2B for 3 suppliers', subtitle: 'Save 2–4 hours per payment cycle', btnText: 'Enable', modalTarget: 'pspSettingsModal' },
    { icon: 'bi-graph-down', iconBg: 'var(--pm-warning-soft)', iconColor: 'var(--pm-warning)', title: 'Switch 18% of volume to T-Kash', subtitle: 'Lower fees on small disbursements', btnText: 'Compare', modalTarget: 'pspCompareModal' },
    { icon: 'bi-shield-check', iconBg: 'var(--pm-purple-soft)', iconColor: 'var(--pm-purple)', title: 'Run daily reconciliation at 10 PM', subtitle: 'Catch 99.8% of mismatches automatically', btnText: 'Schedule', modalTarget: 'reconcileModal' }
  ];

  quickActions = [
    { icon: 'bi-send', color: 'text-success', text: 'Send Money', modal: 'sendMoneyModal' },
    { icon: 'bi-collection', color: 'text-primary', text: 'Bulk Transfer', modal: 'bulkTransferModal' },
    { icon: 'bi-plus-circle', color: 'text-info', text: 'Link Wallet', modal: 'linkWalletModal' },
    { icon: 'bi-arrow-repeat', color: 'text-warning', text: 'Reconcile', modal: 'reconcileModal' },
    { icon: 'bi-exclamation-triangle', color: 'text-danger', text: 'Dispute', modal: 'disputeModal' },
    { icon: 'bi-gear', color: 'text-purple', text: 'PSP Settings', modal: 'pspSettingsModal' },
    { icon: 'bi-person-check', color: 'var(--pm-accent)', text: 'KYC Refresh', modal: 'kycBulkModal' },
    { icon: 'bi-download', color: 'var(--pm-muted)', text: 'Statements', modal: 'statementModal' }
  ];

  // Form models
  sendFrom = 'M-Pesa Business (KES 8.42M)';
  sendTo = '0712 345 890 — James Kamau';
  sendAmount = '250000';
  sendReason = 'Monthly supplier payment - June';
  sendChargeBearer = 'Sender pays fee';
  sendPin = ['', '', '', ''];

  bulkFile: any = null;

  linkProvider = 'M-Pesa';
  linkPhone = '0712 345 890';
  linkAccountType = 'Business Paybill';
  linkNotifications = true;
  linkAutoReconcile = true;

  scheduleFrom = 'M-Pesa Business';
  scheduleTo = '0712 345 890';
  scheduleAmount = '100000';
  scheduleDate = '2025-07-01T09:00';
  scheduleFrequency = 'One-time';

  disputeRef = 'MP-882910';
  disputeReason = 'Amount not received by recipient';
  disputeDescription = 'Recipient claims they never received the funds. Transaction shows successful on our side.';
  disputeFile: any = null;

  pspName = '';
  pspType = 'B2C Aggregator';
  pspEndpoint = '';
  pspSettlement = 'T+0';

  supportSubject = 'API Integration Issue';
  supportMessage = 'Need assistance with Pesalink integration.';

  reconcileWallets = ['M-Pesa Business', 'Airtel Disbursement'];
  reconcileFromDate = '2025-06-20';
  reconcileToDate = '2025-06-27';

  statementWallet = 'All Wallets';
  statementFrom = '2025-06-01';
  statementTo = '2025-06-27';
  statementFormat = 'PDF';

  limitPerTxn = '1000000';
  limitDaily = '50000000';
  limitMonthly = '500000000';
  limitApproval = true;

  pauseReason = 'Security review';
  pauseOutgoing = true;
  pauseIncoming = true;

  walletDetailTab = 'overview';
  pspSettingsTab = 'creds';

  // Alert toggles
  alertFailed = true;
  alertDowntime = true;
  alertSettlement = true;
  alertKyc = false;

  // Permissions
  permSend = true;
  permReceive = true;
  permBulk = true;
  permView = false;
  permManage = false;

  // PIN input refs
  @ViewChild('pin1') pin1!: ElementRef;
  @ViewChild('pin2') pin2!: ElementRef;
  @ViewChild('pin3') pin3!: ElementRef;
  @ViewChild('pin4') pin4!: ElementRef;

  modalInstances: { [key: string]: any } = {};
  modalOriginalContent: { [key: string]: { body: string, footer: string } } = {};

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Initialize all modals
    const modalIds = [
      'sendMoneyModal', 'bulkTransferModal', 'linkWalletModal', 'walletDetailModal',
      'bulkRetryModal', 'reconcileModal', 'pspSettingsModal', 'kycBulkModal',
      'disputeModal', 'walletPermissionsModal', 'scheduleTransferModal', 'pspHealthModal',
      'limitSettingsModal', 'transferReceiptModal', 'pauseWalletModal', 'statementModal',
      'walletHealthModal', 'addPspModal', 'contactSupportModal', 'healthCheckModal',
      'attentionModal', 'pspCompareModal', 'notifModal', 'profileModal', 'pauseConfirmModal'
    ];

    modalIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        this.modalInstances[id] = new bootstrap.Modal(el);
        // Store original content for reset
        const body = el.querySelector('.modal-body');
        const footer = el.querySelector('.modal-footer');
        if (body && footer) {
          this.modalOriginalContent[id] = {
            body: body.innerHTML,
            footer: footer.innerHTML
          };
        }
        // Reset on hide
        el.addEventListener('hidden.bs.modal', () => {
          this.resetModal(id);
        });
      }
    });

    // Initialize steppers
    Object.keys(this.flows).forEach(key => {
      this.renderStepper(key);
      this.showFlowStep(key);
    });
  }

  openModal(id: string): void {
    if (this.modalInstances[id]) {
      this.modalInstances[id].show();
    }
  }

  closeModal(id: string): void {
    if (this.modalInstances[id]) {
      this.modalInstances[id].hide();
    }
  }

  resetModal(id: string): void {
    const original = this.modalOriginalContent[id];
    const el = document.getElementById(id);
    if (!el || !original) return;

    const body = el.querySelector('.modal-body');
    const footer = el.querySelector('.modal-footer');
    if (body) body.innerHTML = original.body;
    if (footer) footer.innerHTML = original.footer;

    // Reset flows
    Object.keys(this.flows).forEach(key => {
      this.flows[key].current = 1;
      this.renderStepper(key);
      this.showFlowStep(key);
    });
  }

  onPinInput(index: number, event: any): void {
    const value = event.target.value;
    this.sendPin[index] = value;
    if (value.length === 1) {
      const nextInputs = [this.pin2, this.pin3, this.pin4];
      if (index < 3 && nextInputs[index]) {
        nextInputs[index].nativeElement.focus();
      }
    }
  }

  switchTab(prefix: string, key: string): void {
    if (prefix === 'wd') {
      this.walletDetailTab = key;
    } else if (prefix === 'psp') {
      this.pspSettingsTab = key;
    }
  }

  renderStepper(key: string): void {
    const f = this.flows[key];
    const wrap = document.getElementById(key + 'Stepper');
    if (!wrap) return;

    let html = '';
    f.labels.forEach((l, i) => {
      const stepNum = i + 1;
      let stepClass = '';
      let stepContent = '' + stepNum;
      if (stepNum < f.current) {
        stepClass = 'done';
        stepContent = '<i class="bi bi-check"></i>';
      } else if (stepNum === f.current) {
        stepClass = 'active';
      }
      html += `<div class="step ${stepClass}"><div class="step-n">${stepContent}</div><div class="step-l">${l}</div></div>`;
      if (i < f.labels.length - 1) {
        html += '<div class="step-line"></div>';
      }
    });
    wrap.innerHTML = html;
  }

  showFlowStep(key: string): void {
    const f = this.flows[key];
    for (let i = 1; i <= f.total; i++) {
      const el = document.getElementById(key + 'S' + i);
      if (el) {
        el.classList.remove('active');
        (el as HTMLElement).style.display = 'none';
      }
    }
    const active = document.getElementById(key + 'S' + f.current);
    if (active) {
      active.classList.add('active');
      (active as HTMLElement).style.display = 'block';
    }
  }

  nextFlow(key: string): void {
    const f = this.flows[key];
    const modalMap: { [key: string]: string } = {
      send: 'sendMoneyModal',
      bulk: 'bulkTransferModal',
      disp: 'disputeModal'
    };

    if (f.current === f.total - 1) {
      // Show loading then final step
      const modalBody = document.querySelector('#' + modalMap[key] + ' .modal-body');
      if (modalBody) {
        this.showLoading(modalBody as HTMLElement, () => {
          f.current = f.total;
          this.renderStepper(key);
          this.showFlowStep(key);
          const nextBtn = document.getElementById(key + 'Next');
          if (nextBtn) nextBtn.textContent = 'Done';
        });
      }
      return;
    }

    if (f.current >= f.total) {
      this.closeModal(modalMap[key]);
      return;
    }

    f.current++;
    this.renderStepper(key);
    this.showFlowStep(key);

    if (f.current === f.total - 1) {
      const btn = document.getElementById(key + 'Next');
      if (btn) {
        if (key === 'send') btn.innerHTML = 'Send Money <i class="bi bi-lock"></i>';
        else if (key === 'disp') btn.innerHTML = 'Submit Dispute <i class="bi bi-send"></i>';
        else btn.innerHTML = 'Execute <i class="bi bi-check-lg"></i>';
      }
    }
  }

  showLoading(target: HTMLElement, callback: () => void): void {
    const ov = this.renderer.createElement('div');
    this.renderer.addClass(ov, 'loading-ov');
    ov.innerHTML = '<div class="spinner"></div><p style="margin-top:12px;font-size:13px;font-weight:600;color:var(--pm-primary)">Processing...</p>';
    this.renderer.setStyle(target, 'position', 'relative');
    this.renderer.appendChild(target, ov);

    setTimeout(() => {
      this.renderer.removeChild(target, ov);
      callback();
    }, 1500);
  }

  doAction(modalId: string, msg: string, ref: string): void {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const body = modal.querySelector('.modal-body');
    const footer = modal.querySelector('.modal-footer');
    if (!body) return;

    this.showLoading(body as HTMLElement, () => {
      const refHtml = ref ? `<p style="font-size:12px;color:var(--pm-muted)">Reference: ${ref}</p>` : '';
      body.innerHTML = `<div class="receipt"><div class="ri"><i class="bi bi-check-lg"></i></div><h5 style="font-weight:700;color:var(--pm-accent)">${msg}</h5>${refHtml}<div class="d-flex justify-content-center mt-3" style="gap:8px"><button class="btn-pm btn-sm" onclick="location.reload()"><i class="bi bi-download"></i> Save</button><button class="btn-pm btn-sm" onclick="location.reload()"><i class="bi bi-share"></i> Continue</button></div></div>`;
      if (footer) footer.innerHTML = '<button class="btn-pm btn-pm-p" data-bs-dismiss="modal">Done</button>';
    });
  }

  getBadgeClass(health: number): string {
    if (health >= 95) return 'B-s';
    if (health >= 85) return 'B-w';
    return 'B-d';
  }

  getStatusBadgeClass(status: string): string {
    if (status === 'Success' || status === 'Live' || status === 'Active' || status === 'Full') return 'B-s';
    if (status === 'Partial' || status === 'Maintenance' || status === 'Pending KYC') return 'B-w';
    if (status === 'Failed') return 'B-d';
    return 'B-i';
  }

  getProviderBadgeClass(provider: string): string {
    if (provider === 'M-Pesa') return 'B-s';
    if (provider === 'Airtel Money') return 'B-i';
    if (provider === 'T-Kash') return 'B-w';
    if (provider === 'Pesalink') return 'B-p';
    return 'B-s';
  }

  onFileChange(event: any, type: string): void {
    const file = event.target.files[0];
    if (type === 'bulk') this.bulkFile = file;
    if (type === 'dispute') this.disputeFile = file;
  }
}