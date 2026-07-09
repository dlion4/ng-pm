import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ApiSdk {
  id: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  amountRule: string;
  timing: string;
  source: string;
  smartLogic: string;
  active: boolean;
}

export interface BudgetCategory {
  name: string;
  spent: number;
  limit: number;
  color: string;
}

export interface HouseholdMember {
  id: number;
  initials: string;
  name: string;
  role: string;
  gradient: string;
  spendLimit: string;
  access: string;
  accessLabel?: string;
  accessColor?: string;
  badge?: string;
  badgeText?: string;
}

export interface Notification {
  icon: string;
  iconColor: string;
  bgColor: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface QuickAction {
  icon: string;
  color: string;
  label: string;
  modal: string;
}

export interface DeliveryLog {
  id: string;
  type: string;
  status: string;
  ok: boolean;
  latency: string;
}

export interface ActivityItem {
  time: string;
  action: string;
  details: string;
  status: string;
}

export interface ActivityHistoryEntry {
  time: string;
  type: string;
  description: string;
  user: string;
}

export interface DlqItem {
  id: string;
  type: string;
  endpoint: string;
  failures: number;
  lastAttempt: string;
}

export interface WebhookEventOption {
  name: string;
  selected: boolean;
}

export interface CatalogEvent {
  icon: string;
  bg: string;
  color: string;
  name: string;
  desc: string;
}

export interface SearchOption {
  name: string;
  selected: boolean;
}

export interface HealthItem {
  name: string;
  ok: boolean;
  detail: string;
}

export interface CopyEventOption {
  name: string;
  selected: boolean;
}

export interface AlertRule {
  name: string;
  enabled: boolean;
}

export interface BudgetWizardItem {
  name: string;
  amount: number;
  color: string;
}

@Component({
  selector: 'app-sdks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sdks.html',
  styleUrls: ['./sdks.css'],
  encapsulation: ViewEncapsulation.None
})
export class SdksComponent implements OnInit {

  activeModalId: string | null = null;

  javaGradleDep = `implementation 'com.paymo:paymo-java:2.1.0'`;


  javaMavenDep = `<dependency>
  <groupId>com.paymo</groupId>
  <artifactId>paymo-java</artifactId>
  <version>2.1.0</version>
</dependency>`;

  toastMessage: string | null = null;
  sdkType: string = 'node';
  jsInsTab: string = 'npm';
  javaInsTab: string = 'maven';
  cwTab: string = 'npm';
  aeStep: number = 1;
  wooStep: number = 1;

  wooInstallSteps = "<li>Log into your WordPress Admin Dashboard.</li><li>Go to <strong>Plugins &gt; Add New</strong>.</li><li>Click <strong>Upload Plugin</strong> and select the downloaded ZIP.</li><li>Click <strong>Install Now</strong>, then <strong>Activate</strong>.</li>";

  bwStep: number = 1;
  bugAllowContact: boolean = false;
  secretConfirmed: boolean = false;
  version: string = 'v3.2.0 (Latest)';
  downloadUrl: string = '';
  hoverBorderColor: string = '';
  playEndpoint: string = 'Charges (M-Pesa STK)';
  playMethod: string = 'POST';
  playBody: string = `{
  "amount": 1500,
  "currency": "KES",
  "phone_number": "254712345678",
  "reference": "INV-2025-001",
  "description": "Payment for web services"
}`;
  notifications: Notification[] = [];

  // ===================== CODE SNIPPETS =====================
  nodeCode1 = `import { PayMoClient } from '@paymo/paymo-node';

const paymo = new PayMoClient({ apiKey: process.env.PAYMO_SECRET_KEY, environment: 'sandbox' });

const response = await paymo.collections.requestMpesaPayment({ amount: 1500, phoneNumber: '254712345678', reference: 'INV-2025-001', description: 'Payment for web services' });
console.log(response.transactionId);`;

  nodeCode2 = `import { PayMoClient } from '@paymo/paymo-node';

const paymo = new PayMoClient({ apiKey: 'your_secret_key' });`;

  reactCode = `import { PayMoProvider, CheckoutElement } from '@paymo/paymo-react';

function App() {
  return (
    <PayMoProvider publicKey="pk_test_123">
      <CheckoutElement amount={1500} onSuccess={handleSuccess} />
    </PayMoProvider>
  );
};`;

  androidCode = `dependencies {
    implementation 'com.paymo.android:core:3.0.1'
    implementation 'com.paymo.android:ui:3.0.1' // Optional UI components
}`;

  simResponse = `{
  "id": "evt_test_xyz123",
  "type": "charge.created",
  "api_version": "2025-01-01",
  "data": {
    "object": {
      "id": "ch_test_abc123",
      "amount": 1500,
      "currency": "KES",
      "status": "successful",
      "customer": "cus_9912ab",
      "metadata": { "order_id": "ORD-2025-4821" }
  }
}`;


  // ===================== ADDITIONAL FORM FIELDS =====================
  npmVersion = 'v3.2.0 (Latest)';
  sdkVersion = 'v3.2.0 (Latest)';
  bugDescription = '';
  activitySearch = '';
  activityItems = [] as any[];

  ngOnInit(): void {
    // Initialization logic here
  }

  processAction(message: string): void {
    this.activeModalId = null;
    document.body.classList.remove('modal-open');
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3500);
  }

  navigateTo(route: string): void {
    console.log('Navigate to:', route);
  }

  openModal(id: string): void {
    this.activeModalId = id;
    document.body.classList.add('modal-open');

    if (id === 'addEndpointModal') {
      this.aeStep = 1;
    }
    if (id === 'installJsSdkModal') {
      this.jsInsTab = 'npm';
    }
    if (id === 'installPythonSdkModal') {
      this.jsInsTab = 'pip';
    }
    if (id === 'installPhpSdkModal') {
      this.jsInsTab = 'php';
    }
    if (id === 'installJavaSdkModal') {
      this.javaInsTab = 'maven';
    }
    if (id === 'installFlutterSdkModal') {
      this.javaInsTab = 'flutter';
    }
    if (id === 'installAndroidSdkModal') {
      this.javaInsTab = 'android';
    }
    if (id === 'installIosSdkModal') {
      this.javaInsTab = 'ios';
    }
  }

  closeModal(): void {
    this.activeModalId = null;
    document.body.classList.remove('modal-open');
  }

  simulateAction(modalId: string, message: string): void {
    this.activeModalId = null;
    document.body.classList.remove('modal-open');
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3500);
  }

  preventDefault(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
  }

  copyCode(eventOrEl: any): void {
    const el = (eventOrEl instanceof HTMLElement) ? eventOrEl : (eventOrEl.target as HTMLElement);
    const codeBlock = el.closest('.pm-code-block');
    if (codeBlock) {
      const textContent = codeBlock.textContent?.replace('Copy', '').trim() || '';
      navigator.clipboard.writeText(textContent).then(() => {
        const originalText = el.textContent;
        el.textContent = 'Copied!';
        setTimeout(() => {
          el.textContent = originalText;
        }, 2000);
      }).catch(() => {
        // Fallback for non-secure contexts
        const textarea = document.createElement('textarea');
        textarea.value = textContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        const originalText = el.textContent;
        el.textContent = 'Copied!';
        setTimeout(() => {
          el.textContent = originalText;
        }, 2000);
      });
    }
  }

  nextAeStep(): void {
    this.aeStep = this.aeStep + 1;
  }

  incrementAeStep(): void {
    this.aeStep = this.aeStep + 1;
  }

  decrementAeStep(): void {
    this.aeStep = this.aeStep - 1;
  }

  nextWooStep(): void {
    this.wooStep = this.wooStep + 1;
  }

  nextBwStep(): void {
    this.bwStep = this.bwStep + 1;
  }

  decrementBwStep(): void {
    this.bwStep = this.bwStep - 1;
  }

  nextCwStep(): void {
    this.cwTab = this.cwTab === 'npm' ? 'cdn' : (this.cwTab === 'cdn' ? 'code' : 'npm');
  }

  markNotifsRead(): void {
    this.notifications.forEach(n => n.read = true);
  }
}