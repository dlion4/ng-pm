import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ──────────────────────────────────────────────────────────────
   INTERFACES — ready for dynamic data injection
   Replace these with your API service calls
   ────────────────────────────────────────────────────────────── */

export interface SecurityComponent {
  key: string;
  label: string;
  points: number;
  done: boolean;
}

export interface Session {
  id: number;
  device: string;
  icon: string;
  location: string;
  ip: string;
  last: string;
  status: string;
  current: boolean;
  trusted: boolean;
}

export interface HistoryRow {
  dateTime: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  method: string;
  status: string;
}

export interface AlertSetting {
  key: string;
  label: string;
  desc: string;
  channels: string[];
  enabled: boolean;
  threshold?: number;
}

export interface AppAccess {
  id: string;
  name: string;
  icon: string;
  last: string;
  risk: string;
  perms: string[];
}

export interface Recommendation {
  key: string;
  title: string;
  desc: string;
  link: string;
}

/* ──────────────────────────────────────────────────────────────
   COMPONENT
   ────────────────────────────────────────────────────────────── */

@Component({
  selector: 'app-security-center',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./security-center.html',
  styleUrls: ['./security-center.css'],
  encapsulation: ViewEncapsulation.None
})

export class SecurityCenterComponent implements OnInit {


  historyStatusFilter: string = 'all';
  historyLocationFilter: string = 'all';

  // 2. Add the missing method that the template is calling
  renderHistory(): void {
    // Your filtering or rendering logic goes here
    console.log('Filters changed:', this.historyStatusFilter, this.historyLocationFilter);
  }
  /* ═══════════════════════════════════════════════════════════
     ACTIVE TAB
     ═══════════════════════════════════════════════════════════ */
  activePanel: string = 'sessions';

  /* ═══════════════════════════════════════════════════════════
     FILTERS
     ═══════════════════════════════════════════════════════════ */
 
  autoLogoutValue: string = '480';

  /* ═══════════════════════════════════════════════════════════
     NOTICES
     ═══════════════════════════════════════════════════════════ */
  globalNoticeVisible: boolean = false;
  globalNoticeText: string = '';
  emergencyNoticeVisible: boolean = false;
  emergencyNoticeText: string = '';

  /* ═══════════════════════════════════════════════════════════
     SECURITY SCORE
     ═══════════════════════════════════════════════════════════ */
  scoreValue: number = 85;
  scoreDashOffset: number = 452 - (452 * 85 / 100);

  /* ═══════════════════════════════════════════════════════════
     DATA STATE — swap these arrays with API service calls
     ═══════════════════════════════════════════════════════════ */

  components: SecurityComponent[] = [
    { key: 'password', label: 'Strong password', points: 20, done: true },
    { key: 'twofa', label: '2FA enabled', points: 25, done: true },
    { key: 'passkey', label: 'Passkey enrolled', points: 20, done: true },
    { key: 'biometric', label: 'Biometric enabled', points: 10, done: true },
    { key: 'review', label: 'Recent security review', points: 10, done: false },
    { key: 'clean', label: 'No suspicious activity', points: 15, done: true }
  ];

  sessions: Session[] = [
    { id: 1, device: 'iPhone 15 Pro', icon: 'bi-phone', location: 'Lagos, Nigeria', ip: '192.168.x.x', last: 'Active now', status: 'This device', current: true, trusted: true },
    { id: 2, device: 'Chrome on MacBook', icon: 'bi-laptop', location: 'Nairobi, Kenya', ip: '197.x.x.x', last: '2 hours ago', status: 'Active', current: false, trusted: true },
    { id: 3, device: 'Safari on iPad', icon: 'bi-tablet', location: 'Accra, Ghana', ip: '154.x.x.x', last: '3 days ago', status: 'Inactive', current: false, trusted: false },
    { id: 4, device: 'Edge on Windows', icon: 'bi-pc-display', location: 'London, UK', ip: '82.x.x.x', last: '6 days ago', status: 'Active', current: false, trusted: false }
  ];

  history: HistoryRow[] = [
    { dateTime: 'Jun 11, 2026 09:14', device: 'iPhone 15 Pro', browser: 'Paymo iOS', location: 'Lagos', ip: '192.168.x.x', method: 'Passkey', status: 'Success' },
    { dateTime: 'Jun 11, 2026 06:45', device: 'MacBook Pro', browser: 'Chrome', location: 'Nairobi', ip: '197.x.x.x', method: 'Password + MFA', status: 'Success' },
    { dateTime: 'Jun 10, 2026 23:02', device: 'Unknown Windows', browser: 'Chrome', location: 'Dubai', ip: '51.x.x.x', method: 'Password', status: 'Step-up Required' },
    { dateTime: 'Jun 10, 2026 03:18', device: 'Unknown Android', browser: 'Chrome', location: 'London', ip: '82.x.x.x', method: 'Password', status: 'Failed' },
    { dateTime: 'Jun 09, 2026 18:40', device: 'iPad Pro', browser: 'Safari', location: 'Accra', ip: '154.x.x.x', method: 'PIN', status: 'Success' },
    { dateTime: 'Jun 08, 2026 02:11', device: 'Unknown Linux', browser: 'Firefox', location: 'Moscow', ip: '185.x.x.x', method: 'Password', status: 'Blocked' },
    { dateTime: 'Jun 07, 2026 11:28', device: 'MacBook Pro', browser: 'Chrome', location: 'Nairobi', ip: '197.x.x.x', method: 'Passkey', status: 'Success' }
  ];

  alerts: AlertSetting[] = [
    { key: 'newDevice', label: 'New device login', desc: 'Notify when your account is accessed from a new device.', channels: ['Email', 'Push'], enabled: true },
    { key: 'password', label: 'Password changed', desc: 'Immediate alert when password or PIN changes.', channels: ['Email', 'SMS', 'Push'], enabled: true },
    { key: 'largeTxn', label: 'Large transaction initiated', desc: 'Alert for transactions above your custom threshold.', channels: ['Push'], enabled: true, threshold: 10000 },
    { key: 'apiKey', label: 'API key created or rotated', desc: 'Notify admins when API credentials change.', channels: ['Email'], enabled: true },
    { key: 'failedLogin', label: 'Failed login attempts', desc: 'Warn after repeated failed attempts.', channels: ['Email'], enabled: false },
    { key: 'suspicious', label: 'Suspicious activity detected', desc: 'High priority fraud and risk engine alerts.', channels: ['SMS', 'Push'], enabled: true }
  ];

  apps: AppAccess[] = [
    { id: 'xero', name: 'Xero Accounting', icon: 'bi-receipt', last: 'Used 1 hour ago', risk: 'Low', perms: ['Read balances', 'Read transactions', 'Export statements'] },
    { id: 'slack', name: 'Slack Alerts', icon: 'bi-bell', last: 'Used today', risk: 'Low', perms: ['Send security notifications'] },
    { id: 'payroll', name: 'Northstar Payroll', icon: 'bi-people', last: 'Used 4 days ago', risk: 'Medium', perms: ['Read wallets', 'Initiate payouts', 'View beneficiaries'] },
    { id: 'legacy', name: 'Legacy BI Connector', icon: 'bi-database', last: 'Used 61 days ago', risk: 'High', perms: ['Read transactions', 'Read customers', 'Export CSV'] }
  ];

  recommendations: Recommendation[] = [
    { key: 'twofa', title: 'Enable 2FA', desc: 'Require an additional factor for logins and sensitive actions.', link: 'Already enabled' },
    { key: 'passkey', title: 'Set up a passkey', desc: 'Use phishing-resistant authentication on supported devices.', link: 'Already enrolled' },
    { key: 'review', title: 'Review security settings', desc: 'Confirm devices, alerts, apps, and recovery options.', link: 'Start review' },
    { key: 'questions', title: 'Update security questions', desc: 'Refresh recovery questions and answers.', link: 'Update now' },
    { key: 'recovery', title: 'Generate new recovery codes', desc: 'Keep fresh backup codes offline.', link: 'Generate codes' },
    { key: 'apps', title: 'Review connected apps', desc: 'Remove stale or excessive OAuth permissions.', link: 'Review apps' }
  ];

  /* ═══════════════════════════════════════════════════════════
     COMPUTED GETTERS
     ═══════════════════════════════════════════════════════════ */

  get trustedDevices(): Session[] {
    return this.sessions.filter(s => s.trusted);
  }

  get trustedCount(): number {
    return this.trustedDevices.length;
  }

  get filteredHistory(): HistoryRow[] {
    return this.history.filter(r =>
      (this.historyStatusFilter === 'all' || r.status === this.historyStatusFilter) &&
      (this.historyLocationFilter === 'all' || r.location === this.historyLocationFilter)
    );
  }

  get openActionsCount(): number {
    let count = 0;
    const reviewComp = this.components.find(c => c.key === 'review');
    if (reviewComp && !reviewComp.done) count++;
    // Add one more open action as per original logic
    count += 1;
    return count;
  }

  get appCount(): number {
    return this.apps.length;
  }

  /* ═══════════════════════════════════════════════════════════
     LIFECYCLE
     ═══════════════════════════════════════════════════════════ */

  ngOnInit(): void {
    this.calculateScore();
  }

  /* ═══════════════════════════════════════════════════════════
     SCORE LOGIC
     ═══════════════════════════════════════════════════════════ */

  calculateScore(): void {
    const value = this.components.reduce((sum, c) => sum + (c.done ? c.points : 0), 0);
    this.scoreValue = value;
    this.scoreDashOffset = 452 - (452 * value / 100);
  }

  /* ═══════════════════════════════════════════════════════════
     TAB SWITCHING
     ═══════════════════════════════════════════════════════════ */

  setPanel(panel: string): void {
    this.activePanel = panel;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ═══════════════════════════════════════════════════════════
     NOTICES
     ═══════════════════════════════════════════════════════════ */

  showNotice(text: string): void {
    this.globalNoticeText = text;
    this.globalNoticeVisible = true;
    setTimeout(() => this.globalNoticeVisible = false, 3500);
  }

  showEmergency(text: string): void {
    this.emergencyNoticeText = text;
    this.emergencyNoticeVisible = true;
    this.showNotice(text);
  }

  /* ═══════════════════════════════════════════════════════════
     SESSION ACTIONS
     ═══════════════════════════════════════════════════════════ */

  logoutSession(id: number): void {
    this.sessions = this.sessions.filter(s => s.id !== id);
    this.showNotice('Selected session logged out.');
  }

  logoutAllOthers(): void {
    this.sessions = this.sessions.filter(s => s.current);
    this.showNotice('All other sessions have been logged out.');
  }

  toggleTrust(id: number): void {
    const s = this.sessions.find(x => x.id === id);
    if (s) {
      s.trusted = !s.trusted;
      this.showNotice(s.trusted ? 'Device marked as trusted.' : 'Device removed from trusted list.');
    }
  }

  untrustDevice(id: number): void {
    const s = this.sessions.find(x => x.id === id);
    if (s) {
      s.trusted = false;
      this.showNotice('Trusted device removed.');
    }
  }

  renameDevice(id: number): void {
    const s = this.sessions.find(x => x.id === id);
    if (s) {
      const name = prompt('Rename device', s.device);
      if (name) {
        s.device = name;
        this.showNotice('Device renamed.');
      }
    }
  }

  /* ═══════════════════════════════════════════════════════════
     RECOMMENDATIONS
     ═══════════════════════════════════════════════════════════ */

  isRecommendationDone(key: string): boolean {
    const comp = this.components.find(c => c.key === key);
    return comp ? comp.done : false;
  }

  completeRecommendation(key: string): void {
    if (key === 'apps') {
      this.setPanel('apps');
      return;
    }
    const comp = this.components.find(c => c.key === key);
    if (comp) {
      comp.done = true;
      this.calculateScore();
      this.showNotice('Security recommendation completed.');
    }
  }

  /* ═══════════════════════════════════════════════════════════
     ALERTS
     ═══════════════════════════════════════════════════════════ */

  toggleAlert(key: string, enabled: boolean): void {
    const a = this.alerts.find(x => x.key === key);
    if (a) {
      a.enabled = enabled;
      this.showNotice(`${a.label} ${a.enabled ? 'enabled' : 'disabled'}.`);
    }
  }

  updateAlertThreshold(key: string, value: number): void {
    const a = this.alerts.find(x => x.key === key);
    if (a) {
      a.threshold = value;
      this.showNotice('Alert threshold updated.');
    }
  }

  enableAllAlerts(): void {
    this.alerts.forEach(a => a.enabled = true);
    this.showNotice('All security alerts enabled.');
  }

  /* ═══════════════════════════════════════════════════════════
     APPS
     ═══════════════════════════════════════════════════════════ */

  revokeApp(id: string): void {
    this.apps = this.apps.filter(a => a.id !== id);
    this.showNotice('Third-party app access revoked.');
  }

  /* ═══════════════════════════════════════════════════════════
     EMERGENCY
     ═══════════════════════════════════════════════════════════ */

  applyEmergency(action: string): void {
    if (action === 'panic') {
      this.sessions = this.sessions.filter(s => s.current);
      this.showEmergency('Account secured, sessions revoked, transactions frozen.');
    } else if (action === 'freeze') {
      this.showEmergency('Money movement frozen. Fraud review started.');
    } else if (action === 'lock') {
      this.showEmergency('Account locked for 24 hours. Identity verification required to unlock.');
    }
  }

  /* ═══════════════════════════════════════════════════════════
     AUTO LOGOUT
     ═══════════════════════════════════════════════════════════ */

  onAutoLogoutChange(): void {
    const labels: Record<string, string> = {
      '15': '15 min',
      '60': '1 hour',
      '480': '8 hours',
      'never': 'Never'
    };
    this.showNotice(`Auto-logout updated to ${labels[this.autoLogoutValue] || this.autoLogoutValue}.`);
  }

  /* ═══════════════════════════════════════════════════════════
     EXPORT / DOWNLOAD
     ═══════════════════════════════════════════════════════════ */

  exportSummary(): void {
    const data = {
      score: this.scoreValue,
      sessions: this.sessions,
      alerts: this.alerts,
      apps: this.apps
    };
    this.downloadFile('paymo-security-summary.json', JSON.stringify(data, null, 2), 'application/json');
  }

  exportCSV(): void {
    const header = 'Date/Time,Device,Browser,Location,IP,Method,Status';
    const rows = this.history.map(r => `${r.dateTime},${r.device},${r.browser},${r.location},${r.ip},${r.method},${r.status}`);
    this.downloadFile('paymo-login-history.csv', [header, ...rows].join('\n'), 'text/csv');
  }

  exportPDF(): void {
    const text = 'Paymo BAAS Login History\n\n' + this.history.map(r => `${r.dateTime} | ${r.device} | ${r.browser} | ${r.location} | ${r.ip} | ${r.method} | ${r.status}`).join('\n');
    this.downloadFile('paymo-login-history.txt', text, 'text/plain');
  }

  private downloadFile(name: string, content: string, type: string): void {
    const blob = new Blob([content], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ═══════════════════════════════════════════════════════════
     HELPERS
     ═══════════════════════════════════════════════════════════ */

  badgeForStatus(status: string): string {
    const map: Record<string, string> = {
      'Success': 'badge-ok',
      'Failed': 'badge-soon',
      'Blocked': 'badge-danger-soft',
      'Step-up Required': 'badge-adv'
    };
    return map[status] || 'badge-native';
  }

  appRiskBadge(risk: string): string {
    if (risk === 'High') return 'badge-danger-soft';
    if (risk === 'Medium') return 'badge-soon';
    return 'badge-ok';
  }

  sessionStatusBadge(s: Session): string {
    if (s.current) return 'badge-native';
    if (s.status === 'Active') return 'badge-ok';
    return 'badge-soon';
  }
}