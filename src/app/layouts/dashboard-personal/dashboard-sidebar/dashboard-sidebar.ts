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
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-sidebar.html',
  styleUrls: ['./dashboard-sidebar.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardSidebarComponent {

  @Input() expanded: boolean = false;
  @Input() mobileOpen: boolean = false;
  @Input() activeSection: string = 'dashboard';

  @Output() navClick = new EventEmitter<string>();
  @Output() mobileClose = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  navGroups: NavGroup[] = [
    {
      title: 'Platform',
      items: [
        { key: 'dashboard',   label: 'Dashboard',       icon: 'bi-house-door',        route: '/dashboard' },
        { key: 'transfers',   label: 'Transfers',        icon: 'bi-arrow-left-right',  route: '/transfers' },
        { key: 'payments',    label: 'Payments',         icon: 'bi-currency-dollar',   route: '/payments' },
        { key: 'wallets',     label: 'Wallets',          icon: 'bi-wallet2',           route: '/wallets' },
        { key: 'cards',       label: 'Virtual Cards',    icon: 'bi-credit-card',       route: '/cards' },
      ]
    },
    {
      title: 'Banking',
      items: [
        { key: 'beneficiaries', label: 'Beneficiaries',  icon: 'bi-people',            route: '/beneficiaries' },
        { key: 'scheduled',     label: 'Scheduled',      icon: 'bi-calendar-event',    route: '/scheduled', badge: 3 },
        { key: 'qrpay',         label: 'QR Pay',         icon: 'bi-qr-code-scan',      route: '/qr-pay' },
        { key: 'international', label: 'International',  icon: 'bi-globe2',            route: '/international' },
      ]
    },
    {
      title: 'Business',
      items: [
        { key: 'business',    label: 'Business Accounts', icon: 'bi-building',         route: '/business' },
        { key: 'analytics',   label: 'Analytics',         icon: 'bi-graph-up-arrow',   route: '/analytics' },
        { key: 'developers',  label: 'Developers',        icon: 'bi-terminal',         route: '/developers' },
        { key: 'apikeys',     label: 'API Keys',          icon: 'bi-key',              route: '/api-keys' },
        { key: 'webhooks',    label: 'Webhooks',          icon: 'bi-broadcast',        route: '/webhooks', badge: 'Live' },
      ]
    },
    {
      title: 'Account',
      items: [
        { key: 'security',  label: 'Security',  icon: 'bi-shield-check',    route: '/security' },
        { key: 'settings',  label: 'Settings',   icon: 'bi-gear',            route: '/settings' },
        { key: 'support',   label: 'Support',    icon: 'bi-life-preserver',  route: '/support' },
      ]
    }
  ];

  onNavItemClick(item: NavItem): void {
    this.navClick.emit(item.key);
    if (!this.isDesktop()) {
      this.mobileClose.emit();
    }
  }

  onLogoutClick(): void {
    this.logout.emit();
  }

  onBackdropClick(): void {
    this.mobileClose.emit();
  }

  onCloseMobile(): void {
    this.mobileClose.emit();
  }

  isDesktop(): boolean {
    return window.innerWidth >= 992;
  }

  get sidebarClasses(): string {
    let cls = 'sidebar';
    if (this.isDesktop()) {
      cls += this.expanded ? ' expanded' : '';
    } else {
      cls += this.mobileOpen ? ' mobile-open' : ' mobile-closed';
    }
    return cls;
  }
}
