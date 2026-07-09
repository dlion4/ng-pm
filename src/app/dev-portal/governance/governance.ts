import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-governance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './governance.html',
  styleUrls: ['./governance.css'],
})
export class GovernanceComponent {
  toast = { show: false, message: '' };
  relStep = 1;
  depStep = 1;
  migTab = 'v1v2';
  linterState = 'pre';
  selectedExportFmt = 'json';

  modals: Record<string, boolean> = {
    publishReleaseModal: false,
    deprecateVersionModal: false,
    migrationGuideModal: false,
    changelogDetailModal: false,
    runLinterModal: false,
    exportSpecModal: false,
    submitFeatureModal: false,
    featureDetailModal: false,
    roadmapItemModal: false,
    enrollBetaModal: false,
    performanceBenchmarkModal: false,
    healthCheckModal: false,
    developerAlertsModal: false,
    versionActionModal: false,
    broadcastChangeModal: false,
    configureDeprecationModal: false,
    apiGovernanceAuditModal: false,
    testAutomationConfigModal: false,
    sdkGenerationModal: false,
    featureListModal: false
  };

  apiVersions = [
    { version: 'v3.0.0-beta', desc: 'GraphQL + REST hybrid', status: 'Beta', statusClass: 'pm-badge-info', traffic: 2, trafficColor: 'var(--pm-info)', sunset: 'N/A', sunsetColor: 'var(--pm-muted)', actionModal: 'enrollBetaModal', actionText: 'Join Beta' },
    { version: 'v2.4.1', desc: 'Current stable', status: 'Active', statusClass: 'pm-badge-success', traffic: 94, trafficColor: 'var(--pm-accent)', sunset: 'N/A', sunsetColor: 'var(--pm-muted)', actionModal: 'changelogDetailModal', actionText: 'View Notes' },
    { version: 'v1.8.4', desc: 'Legacy stable', status: 'Deprecated', statusClass: 'pm-badge-warning', traffic: 6, trafficColor: 'var(--pm-warning)', sunset: 'Dec 31, 2026', sunsetColor: 'var(--pm-danger)', actionModal: 'deprecateVersionModal', actionText: 'Deprecate' }
  ];

  govStats = [
    { label: 'OAS 3.0', value: '98%', color: 'var(--pm-success)', clickable: true, modal: 'apiGovernanceAuditModal' },
    { label: 'REST Principles', value: '100%', color: 'var(--pm-success)', clickable: false, modal: '' },
    { label: 'Linter Warnings', value: '12', color: 'var(--pm-warning)', clickable: true, modal: 'runLinterModal' },
    { label: 'Breaking Changes', value: '0', color: 'var(--pm-success)', clickable: false, modal: '' }
  ];

  roadmapReview = [
    { title: 'GraphQL Support', desc: 'Query multiple resources in a single request', votes: 89 },
    { title: 'Webhook v2', desc: 'HMAC-SHA256 verification + dead letter queues', votes: 34 },
    { title: 'Bulk Disbursements', desc: 'Process 10,000+ payments in a single API call', votes: 21 }
  ];

  roadmapPlanned = [
    { title: 'Real-time Analytics', desc: 'Live transaction dashboards via WebSocket', progress: 35 },
    { title: 'Multi-currency Settlement', desc: 'Auto-conversion for 40+ currencies', progress: 10 }
  ];

  roadmapBeta = [
    { title: 'PesaLink B2B', desc: 'Real-time corporate bank transfers', tag: 'Beta', showJoin: true },
    { title: 'Mobile SDK v3', desc: 'Flutter + React Native unified SDK', tag: 'Early Access', showJoin: true }
  ];

  benchmarks = [
    { endpoint: 'POST /v2/disbursements', method: 'POST', p95: '112', status: 'Healthy', statusClass: 'pm-badge-success' },
    { endpoint: 'GET /v2/wallet/balance', method: 'GET', p95: '45', status: 'Healthy', statusClass: 'pm-badge-success' },
    { endpoint: 'POST /v2/collections', method: 'POST', p95: '185', status: 'Warning', statusClass: 'pm-badge-warning' }
  ];

  alerts = [
    { title: 'v1.8.4 Sunset Notice Sent', time: '2 hours ago', color: 'var(--pm-warning)' },
    { title: 'New Linter Warning: GET /v2/temp/stats', time: '5 hours ago', color: 'var(--pm-info)' },
    { title: 'P95 Latency Spike Detected', time: '1 day ago', color: 'var(--pm-danger)' }
  ];

  auditChecks = [
    { rule: 'All endpoints have OpenAPI annotations' },
    { rule: 'Consistent HTTP status codes (2xx, 4xx, 5xx)' },
    { rule: 'Idempotency keys required for mutating ops' },
    { rule: 'Pagination via cursor, not offset' },
    { rule: 'Webhook signatures use HMAC-SHA256' }
  ];

  migrationPayloadV2 = `{
  "amount": 10000,
  "currency": "KES",
  "phoneNumber": "254712345678",
  "idempotencyKey": "uuid-v4-here"
}`;

  openModal(key: string) {
    this.modals[key] = true;
  }

  closeModal(key: string) {
    this.modals[key] = false;
  }

  onBackdropClick(event: MouseEvent, key: string) {
    if (event.target === event.currentTarget) {
      this.closeModal(key);
    }
  }

  processAction(key: string, message: string) {
    this.toast = { show: true, message };
    this.closeModal(key);
    setTimeout(() => this.toast.show = false, 3000);
  }

  prevRelStep(): void { if (this.relStep > 1) this.relStep--; }

  nextRelStep(): void { if (this.relStep < 4) this.relStep++; }

  prevDepStep(): void { if (this.depStep > 1) this.depStep--; }

  nextDepStep(): void { if (this.depStep < 4) this.depStep++; }


  simulateLinter() {
    this.linterState = 'loading';
    setTimeout(() => this.linterState = 'result', 1500);
  }
}