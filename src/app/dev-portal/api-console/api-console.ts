import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ===== Interfaces =====
export interface ApiKey {
  id: string;
  name: string;
  env: 'test' | 'live';
  envBg: string;
  envColor: string;
  token: string;
  created: string;
  lastUsed: string;
  status: 'Active' | 'Locked';
}

export interface TeamMember {
  name: string;
  initials: string;
  gradient: string;
  email: string;
  role: string;
  roleBadge: string;
  mfa: string;
  lastLogin: string;
}

export interface RecentLog {
  method: string;
  endpoint: string;
  status: number;
  statusOk: boolean;
  time: string;
  ip: string;
  latency: string;
}

export interface WebhookLog {
  id: string;
  eventType: string;
  status: string;
  ok: boolean;
  time: string;
}

export interface WebhookEvent {
  name: string;
  selected: boolean;
}

export interface ApiLogFull {
  method: string;
  endpoint: string;
  status: number;
  ok: boolean;
  latency: string;
  ip: string;
  time: string;
}

export interface SnippetTab {
  key: string;
  label: string;
}

export interface RateLimit {
  name: string;
  desc: string;
  limit: string;
  window: string;
}

export interface DocItem {
  title: string;
  desc: string;
  icon: string;
  bg: string;
  color: string;
}

export interface SdkItem {
  name: string;
  icon: string;
  bg: string;
  color: string;
  version: string;
}

@Component({
  selector: 'app-api-reference',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './api-console.html',
  styleUrls: ['./api-console.css'],
  encapsulation: ViewEncapsulation.None
})
export class ApiConsoleComponent implements OnInit {

  activeModalId: string | null = null;
  rollKeyConfirmed = false;
  inviteRole = 'Developer';
  activeSnippet = 'curl';

  currentProject = {
    name: 'E-Commerce App',
    env: 'test',
    apiVersion: 'v2025-01-01',
    region: 'KE',
    requests: 28431
  };

  stats = {
    latency: 112,
    latencyImprovement: 18,
    latencyBars: [40, 55, 35, 70, 60, 45, 80, 50, 65, 42, 55, 38],
    errorRate: 0.12,
    failedReqs: 34,
    errorBudgetUsed: 24,
    webhookDelivery: 98.7,
    activeEndpoints: 2,
    pendingRetries: 1
  };

  snippetTabs: SnippetTab[] = [];
  apiKeys: ApiKey[] = [];
  teamMembers: TeamMember[] = [];
  recentLogs: RecentLog[] = [];
  webhookLogs: WebhookLog[] = [];
  webhookEvents: WebhookEvent[] = [];
  apiLogsFull: ApiLogFull[] = [];
  ipWhitelist: string[] = [];
  rateLimits: RateLimit[] = [];
  docsList: DocItem[] = [];
  sdks: SdkItem[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.snippetTabs = [
      { key: 'curl', label: 'cURL' },
      { key: 'node', label: 'Node.js' },
      { key: 'python', label: 'Python' },
      { key: 'php', label: 'PHP' }
    ];

    this.apiKeys = [
      { id: '1', name: 'Main Production Key', env: 'live', envBg: '#dcfce7', envColor: '#166534', token: 'sk_live_8f92...xxxx', created: '12 Mar 2024', lastUsed: '2 mins ago', status: 'Active' },
      { id: '2', name: 'Test Secret Key', env: 'test', envBg: '#fef9c3', envColor: '#854d0e', token: 'sk_test_1a9b...xxxx', created: '01 Jun 2025', lastUsed: '1 hr ago', status: 'Active' },
      { id: '3', name: 'Deprecated Live Key', env: 'live', envBg: '#dcfce7', envColor: '#166534', token: 'sk_live_3f4e...xxxx', created: '05 Jan 2024', lastUsed: '30 days ago', status: 'Locked' }
    ];

    this.teamMembers = [
      { name: 'Alex M.', initials: 'AM', gradient: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', email: 'alex@jenga.com', role: 'Owner', roleBadge: 'pm-badge-purple', mfa: 'Enabled', lastLogin: '2 mins ago' },
      { name: 'Sarah O.', initials: 'SO', gradient: 'linear-gradient(135deg,#10b981,#047857)', email: 'sarah@jenga.com', role: 'Admin', roleBadge: 'pm-badge-info', mfa: 'Enabled', lastLogin: '1 hr ago' },
      { name: 'James K.', initials: 'JK', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', email: 'james@jenga.com', role: 'Developer', roleBadge: 'pm-badge-success', mfa: 'Disabled', lastLogin: '3 hrs ago' }
    ];

    this.recentLogs = [
      { method: 'POST', endpoint: '/v1/charges/mpesa', status: 200, statusOk: true, time: '14:32:01', ip: '192.168.1.45', latency: '112ms' },
      { method: 'GET', endpoint: '/v1/customers/cus_123', status: 401, statusOk: false, time: '14:28:15', ip: '10.0.0.12', latency: '42ms' },
      { method: 'HOOK', endpoint: 'charge.success', status: 200, statusOk: true, time: '14:15:22', ip: '52.14.88.0', latency: '340ms' },
      { method: 'POST', endpoint: '/v1/disbursements/b2c', status: 429, statusOk: false, time: '13:45:09', ip: '192.168.1.45', latency: '11ms' }
    ];

    this.webhookLogs = [
      { id: 'evt_8f92a1', eventType: 'charge.success', status: '200 OK', ok: true, time: '14:32:01' },
      { id: 'evt_1a9b3c', eventType: 'charge.success', status: '200 OK', ok: true, time: '14:28:15' },
      { id: 'evt_3f4e5d', eventType: 'transfer.failed', status: '503 Service Unavailable', ok: false, time: '13:15:44' },
      { id: 'evt_7g8h9i', eventType: 'charge.failed', status: '200 OK', ok: true, time: '12:01:22' }
    ];

    this.webhookEvents = [
      { name: 'charge.success', selected: true },
      { name: 'charge.failed', selected: true },
      { name: 'transfer.success', selected: false },
      { name: 'transfer.failed', selected: false },
      { name: 'customer.created', selected: false },
      { name: 'customer.updated', selected: false }
    ];

    this.apiLogsFull = [
      { method: 'POST', endpoint: '/v1/charges/mpesa', status: 200, ok: true, latency: '112ms', ip: '192.168.1.45', time: '14:32:01' },
      { method: 'GET', endpoint: '/v1/customers/cus_123', status: 401, ok: false, latency: '42ms', ip: '10.0.0.12', time: '14:28:15' },
      { method: 'POST', endpoint: '/v1/disbursements/b2c', status: 429, ok: false, latency: '11ms', ip: '192.168.1.45', time: '13:45:09' },
      { method: 'POST', endpoint: '/v1/charges/card', status: 200, ok: true, latency: '890ms', ip: '192.168.1.46', time: '13:10:00' },
      { method: 'GET', endpoint: '/v1/balance', status: 200, ok: true, latency: '85ms', ip: '192.168.1.45', time: '12:55:33' }
    ];

    this.ipWhitelist = ['192.168.1.0/24', '10.0.0.0/16'];

    this.rateLimits = [
      { name: 'Collections API', desc: 'STK Push, Card, PayBill', limit: '1,000 req/min', window: 'minute' },
      { name: 'Disbursements API', desc: 'B2C, B2B, Bank', limit: '500 req/min', window: 'minute' },
      { name: 'Identity API', desc: 'ID, KRA, KYC checks', limit: '200 req/min', window: 'minute' },
      { name: 'Webhooks', desc: 'Event delivery', limit: '5,000 evt/hr', window: 'hour' }
    ];

    this.docsList = [
      { title: 'Getting Started', desc: 'Quick integration guide', icon: 'bi-rocket', bg: '#eff6ff', color: '#2563eb' },
      { title: 'Authentication', desc: 'API keys & signatures', icon: 'bi-shield-lock', bg: '#fef9c3', color: '#d97706' },
      { title: 'Collections', desc: 'M-Pesa, Card, PayBill', icon: 'bi-wallet2', bg: '#dcfce7', color: '#059669' },
      { title: 'Disbursements', desc: 'B2C, B2B, PesaLink', icon: 'bi-send', bg: '#e0f2fe', color: '#0284c7' },
      { title: 'Webhooks', desc: 'Event notifications', icon: 'bi-broadcast', bg: '#f3e8ff', color: '#7c3aed' },
      { title: 'Error Codes', desc: 'Full error reference', icon: 'bi-bug', bg: '#fee2e2', color: '#dc2626' }
    ];

    this.sdks = [
      { name: 'Node.js SDK', icon: 'bi-filetype-js', bg: '#fef9c3', color: '#d97706', version: 'v3.2.1' },
      { name: 'Python SDK', icon: 'bi-filetype-py', bg: '#e0f2fe', color: '#0284c7', version: 'v2.1.0' },
      { name: 'PHP SDK', icon: 'bi-filetype-php', bg: '#f3e8ff', color: '#7c3aed', version: 'v1.8.4' },
      { name: 'Java SDK', icon: 'bi-filetype-java', bg: '#fee2e2', color: '#dc2626', version: 'v2.1.0' }
    ];
  }

  openModal(id: string): void {
    this.activeModalId = id;
  }

  closeModal(): void {
    this.activeModalId = null;
    this.rollKeyConfirmed = false;
  }

  processAction(message: string): void {
    alert(message);
    this.activeModalId = null;
  }

  navigateTo(route: string): void {
    console.log('Navigate to:', route);
  }

  removeIp(ip: string): void {
    this.ipWhitelist = this.ipWhitelist.filter(i => i !== ip);
  }

  onDocHover(event: Event, active: boolean): void {
    const el = event.currentTarget as HTMLElement | null;
    if (el) {
      el.style.borderColor = active ? 'var(--pm-primary)' : '';
    }
  }
}