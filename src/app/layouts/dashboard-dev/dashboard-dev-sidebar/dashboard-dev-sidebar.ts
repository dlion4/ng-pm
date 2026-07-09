import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavItem {
  key: string;
  label: string;
  icon: string;
  route: string;
  badge?: string | number;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-dashboard-dev-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-dev-sidebar.html',
  styleUrls: ['./dashboard-dev-sidebar.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardDevSidebarComponent {

  @Input() expanded: boolean = false;
  @Input() mobileOpen: boolean = false;
  @Input() activeSection: string = 'dashboard';

  @Output() navClick = new EventEmitter<string>();
  @Output() mobileClose = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  navGroups: NavGroup[] = [
    {
      title: 'Development',
      items: [
        { key: 'dashboard',   label: 'Dashboard',      icon: 'bi-speedometer2',        route: '/dev' },
        { key: 'explorer',    label: 'API Explorer',    icon: 'bi-terminal',            route: '/dev/explorer', badge: 'Beta' },
        { key: 'playground',  label: 'Playground',      icon: 'bi-code-square',         route: '/dev/playground' },
      ]
    },
    {
      title: 'Integration',
      items: [
        { key: 'apikeys',     label: 'API Keys',        icon: 'bi-key',                 route: '/dev/api-keys' },
        { key: 'oauth',       label: 'OAuth Apps',      icon: 'bi-shield-check',        route: '/dev/oauth' },
        { key: 'webhooks',    label: 'Webhooks',        icon: 'bi-broadcast',           route: '/dev/webhooks' },
        { key: 'sdks',        label: 'SDKs & Libraries', icon: 'bi-journal-text',       route: '/dev/sdks' },
      ]
    },
    {
      title: 'Monitoring',
      items: [
        { key: 'logs',        label: 'Request Logs',    icon: 'bi-activity',            route: '/dev/logs' },
        { key: 'errors',      label: 'Error Insights',  icon: 'bi-exclamation-triangle', route: '/dev/errors' },
        { key: 'metrics',     label: 'Usage Metrics',   icon: 'bi-bar-chart',           route: '/dev/metrics' },
      ]
    },
    {
      title: 'Infrastructure',
      items: [
        { key: 'servers',     label: 'Web Servers',     icon: 'bi-hdd-network',         route: '/dev/servers' },
        { key: 'storage',     label: 'Data Storage',    icon: 'bi-database',            route: '/dev/storage' },
        { key: 'settings',    label: 'Dev Settings',    icon: 'bi-gear',                route: '/dev/settings' },
      ]
    }
  ];

  onNavItemClick(item: NavItem): void {
    this.navClick.emit(item.key);
    if (!this.isDesktop()) this.mobileClose.emit();
  }

  onLogoutClick(): void { this.logout.emit(); }
  onBackdropClick(): void { this.mobileClose.emit(); }
  onCloseMobile(): void { this.mobileClose.emit(); }
  isDesktop(): boolean { return window.innerWidth >= 992; }

  get sidebarClasses(): string {
    let cls = 'sidebar';
    if (this.isDesktop()) cls += this.expanded ? ' expanded' : '';
    else cls += this.mobileOpen ? ' mobile-open' : ' mobile-closed';
    return cls;
  }
}
