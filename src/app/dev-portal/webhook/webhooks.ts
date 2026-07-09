import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface WebhookEndpoint {
  name: string;
  url: string;
  status: string;
  statusIcon: string;
  iconColor: string;
  detail: string;
}

export interface DeliveryLog {
  id: string;
  type: string;
  status: string;
  ok: boolean;
  latency: string;
}

export interface DlqItem {
  id: string;
  type: string;
  endpoint: string;
  failures: number;
  lastAttempt: string;
}

export interface QuickAction {
  icon: string;
  color: string;
  label: string;
  modal: string;
}

export interface CatalogEvent {
  icon: string;
  bg: string;
  color: string;
  name: string;
  desc: string;
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

export interface WebhookEventOption {
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-webhooks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './webhooks.html',
  styleUrls: ['./webhooks.css'],
  encapsulation: ViewEncapsulation.None
})
export class WebhooksComponent implements OnInit {

  activeModalId: string | null = null;
  toastMessage: string | null = null;
  aeStep = 1;
  pauseConfirmed = false;
  secretConfirmed = false;

  stats = {
    throughput: '1.48M',
    throughputChange: '14% vs last month',
    eventsPerSec: '32',
    deliveryRate: '99.85%',
    deliveryPercent: 99.85,
    p95Latency: '140ms',
    dlqCount: 2143,
    activeSubs: 14,
    webhookCount: 8,
    sqsCount: 4,
    kafkaCount: 2,
  };

  quickActions: QuickAction[] = [
    { icon: 'bi-plus-circle', color: 'var(--pm-primary)', label: 'Add Endpoint', modal: 'addEndpointModal' },
    { icon: 'bi-bug', color: 'var(--pm-accent)', label: 'Test Webhook', modal: 'testWebhookModal' },
    { icon: 'bi-play-circle', color: 'var(--pm-warning)', label: 'Simulate Event', modal: 'simulateEventModal' },
    { icon: 'bi-envelope-x', color: 'var(--pm-danger)', label: 'DLQ Manager', modal: 'dlqManagerModal' },
    { icon: 'bi-shield-lock', color: 'var(--pm-purple)', label: 'Rotate Secrets', modal: 'generateSecretModal' },
    { icon: 'bi-arrow-repeat', color: 'var(--pm-info)', label: 'Idempotency', modal: 'idempotencySettingsModal' },
    { icon: 'bi-book', color: 'var(--pm-muted)', label: 'Event Catalog', modal: 'eventCatalogModal' },
    { icon: 'bi-bell-fill', color: '#FBBF24', label: 'Alert Rules', modal: 'alertSettingsModal' },
  ];

  endpoints: WebhookEndpoint[] = [
    { name: 'Core Payment Processor', url: 'https://api.merchant.com/v1/paymo/webhooks', status: 'Healthy', statusIcon: 'bi-check2-circle', iconColor: 'var(--pm-accent)', detail: '14 events · TLS 1.2+ verified' },
    { name: 'Payroll Status Sync', url: 'https://hr.merchant.com/api/paymo-events', status: 'Failing', statusIcon: 'bi-x-circle', iconColor: 'var(--pm-danger)', detail: '3 events · Last response: 503' },
    { name: 'Sandbox Environment', url: 'https://staging.merchant.com/webhook', status: 'Sandbox', statusIcon: 'bi-asterisk', iconColor: 'var(--pm-muted)', detail: 'All events · Signature verified' },
  ];

  deliveryLogs: DeliveryLog[] = [
    { id: 'evt_9x8f7a', type: 'payment.success', status: '200 OK', ok: true, latency: '142ms' },
    { id: 'evt_2b3c4d', type: 'customer.created', status: '200 OK', ok: true, latency: '98ms' },
    { id: 'evt_5e6f7g', type: 'payment.failed', status: '503 ERR', ok: false, latency: '5021ms' },
    { id: 'evt_8h9i0j', type: 'transfer.success', status: '200 OK', ok: true, latency: '115ms' },
  ];

  dlqItems: DlqItem[] = [
    { id: 'evt_dlq_a1b2', type: 'payment.failed', endpoint: '.../webhooks', failures: 5, lastAttempt: '10:35:10 AM' },
    { id: 'evt_dlq_c3d4', type: 'charge.timeout', endpoint: '.../webhooks', failures: 3, lastAttempt: '10:22:05 AM' },
    { id: 'evt_dlq_e5f6', type: 'payment.failed', endpoint: '.../paymo-events', failures: 5, lastAttempt: '09:45:00 AM' },
  ];

  allWebhookEvents: WebhookEventOption[] = [
    { name: 'payment.success', selected: true },
    { name: 'payment.failed', selected: true },
    { name: 'payment.refunded', selected: true },
    { name: 'customer.created', selected: false },
    { name: 'customer.updated', selected: false },
    { name: 'transfer.success', selected: true },
    { name: 'transfer.failed', selected: true },
    { name: 'invoice.paid', selected: false },
    { name: 'subscription.created', selected: false },
    { name: 'subscription.cancelled', selected: false },
  ];

  eventCatalog: CatalogEvent[] = [
    { icon: 'bi-credit-card', bg: 'var(--pm-accent-soft)', color: 'var(--pm-accent)', name: 'payment.success', desc: 'Payment completed successfully' },
    { icon: 'bi-x-circle', bg: 'var(--pm-danger-soft)', color: 'var(--pm-danger)', name: 'payment.failed', desc: 'Payment attempt failed' },
    { icon: 'bi-arrow-left-right', bg: 'var(--pm-info-soft)', color: 'var(--pm-info)', name: 'transfer.success', desc: 'Funds transfer completed' },
    { icon: 'bi-person-plus', bg: 'var(--pm-purple-soft)', color: 'var(--pm-purple)', name: 'customer.created', desc: 'New customer registered' },
    { icon: 'bi-receipt', bg: 'var(--pm-warning-soft)', color: 'var(--pm-warning)', name: 'invoice.paid', desc: 'Invoice marked as paid' },
    { icon: 'bi-arrow-return-left', bg: 'var(--pm-danger-soft)', color: 'var(--pm-danger)', name: 'payment.refunded', desc: 'Payment refunded to customer' },
  ];

  notifications: Notification[] = [
    { icon: 'bi-exclamation-triangle', iconColor: 'var(--pm-danger)', bgColor: 'var(--pm-danger-soft)', title: 'Webhook 503 Error', body: 'Core Payment Processor endpoint failing since 10:30 AM', time: '5 min ago', read: false },
    { icon: 'bi-envelope-x', iconColor: 'var(--pm-warning)', bgColor: 'var(--pm-warning-soft)', title: 'DLQ Threshold Exceeded', body: '2,143 payloads in Dead Letter Queue — review recommended', time: '1 hour ago', read: false },
    { icon: 'bi-diagram-3', iconColor: 'var(--pm-purple)', bgColor: 'var(--pm-purple-soft)', title: 'Kafka Consumer Lag', body: 'Group payroll-events lagging by 4,200 offsets', time: '3 hours ago', read: false },
  ];

  searchResults = [
    { id: 'evt_9x8f7a2d41', type: 'payment.success', created: 'Today 10:42 AM', status: '200 OK', ok: true },
    { id: 'evt_2b3c4d5e6f', type: 'customer.created', created: 'Today 10:40 AM', status: '200 OK', ok: true },
    { id: 'evt_5e6f7g8h9i', type: 'payment.failed', created: 'Today 10:38 AM', status: '503 ERR', ok: false },
    { id: 'evt_8h9i0j1k2l', type: 'transfer.success', created: 'Today 10:35 AM', status: '200 OK', ok: true },
    { id: 'evt_3m4n5o6p7q', type: 'invoice.paid', created: 'Today 10:30 AM', status: '200 OK', ok: true },
  ];

  simulateEventPayload = `{ "id": "evt_test_abc123", "type": "payment.success", "data": { "object": { "id": "ch_24a1b", "amount": 5000, "currency": "KES", "status": "successful" } }, "created": 1717500135 }`;

  viewPayloadData = `{ "id": "evt_9x8f7a2d41", "type": "payment.success", "api_version": "2025-01-01", "created": 1717500135, "data": { "object": { "id": "ch_24a1b8c3d", "object": "charge", "amount": 5000, "currency": "KES", "status": "successful", "customer": "cus_9912ab", "metadata": { "order_id": "ORD-2025-4821" } } }, "livemode": false, "pending_webhooks": 2 }`;

  healthItems = [
    { name: 'Core Payment Processor (HTTPS)', ok: true },
    { name: 'Payroll Status Sync (HTTPS)', ok: false },
    { name: 'Sandbox Environment (HTTPS)', ok: true },
    { name: 'Event Bus Internal', ok: true },
  ];

  ngOnInit(): void {}

  navigateTo(route: string): void { console.log('Navigate to:', route); }

  openModal(id: string): void {
    if (id === 'addEndpointModal') { this.aeStep = 1; }
    if (id === 'pauseEndpointModal') { this.pauseConfirmed = false; }
    if (id === 'generateSecretModal') { this.secretConfirmed = false; }
    this.activeModalId = id;
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    this.activeModalId = null;
    this.toastMessage = null;
    document.body.classList.remove('modal-open');
  }

  markNotifsRead(): void {
    this.notifications.forEach(n => n.read = true);
  }

  processAction(message: string): void {
    this.activeModalId = null;
    document.body.classList.remove('modal-open');
    this.toastMessage = message;
    setTimeout(() => { this.toastMessage = null; }, 3500);
  }
}