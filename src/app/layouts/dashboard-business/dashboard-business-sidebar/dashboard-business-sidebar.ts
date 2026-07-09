import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavItem { key: string; label: string; icon: string; route: string; badge?: string | number; }
export interface NavGroup { title: string; items: NavItem[]; }

@Component({
  selector: 'app-dashboard-business-sidebar', standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-business-sidebar.html',
  styleUrls: ['./dashboard-business-sidebar.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardBusinessSidebarComponent {
  @Input() expanded: boolean = false;
  @Input() mobileOpen: boolean = false;
  @Input() activeSection: string = 'dashboard';
  @Output() navClick = new EventEmitter<string>();
  @Output() mobileClose = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  navGroups: NavGroup[] = [
    { title: 'Overview', items: [
      { key: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2', route: '/business' },
      { key: 'insights', label: 'Insights', icon: 'bi-activity', route: '/business/insights', badge: 'New' },
    ]},
    { title: 'Operations', items: [
      { key: 'cash', label: 'Cash Management', icon: 'bi-wallet2', route: '/business/cash' },
      { key: 'movements', label: 'Movements', icon: 'bi-arrow-left-right', route: '/business/movements' },
      { key: 'billing', label: 'Billing', icon: 'bi-receipt', route: '/business/billing' },
      { key: 'vendors', label: 'Vendors', icon: 'bi-people', route: '/business/vendors' },
      { key: 'payroll', label: 'Payroll', icon: 'bi-cash-stack', route: '/business/payroll' },
    ]},
    { title: 'Intelligence', items: [
      { key: 'forecast', label: 'Forecasting', icon: 'bi-pie-chart', route: '/business/forecast' },
      { key: 'tax', label: 'Tax Compliance', icon: 'bi-file-earmark-bar-graph', route: '/business/tax' },
    ]},
    { title: 'Infrastructure', items: [
      { key: 'compliance', label: 'Compliance', icon: 'bi-shield-check', route: '/business/compliance' },
      { key: 'integrations', label: 'Integrations', icon: 'bi-plug', route: '/business/integrations' },
      { key: 'team', label: 'Team', icon: 'bi-people-fill', route: '/business/team' },
      { key: 'settings', label: 'Settings', icon: 'bi-gear', route: '/business/settings' },
    ]}
  ];

  onNavItemClick(item: NavItem): void { this.navClick.emit(item.key); if (!this.isDesktop()) this.mobileClose.emit(); }
  onLogoutClick(): void { this.logout.emit(); }
  onBackdropClick(): void { this.mobileClose.emit(); }
  onCloseMobile(): void { this.mobileClose.emit(); }
  isDesktop(): boolean { return window.innerWidth >= 992; }
  get sidebarClasses(): string { let cls = 'sidebar'; if (this.isDesktop()) cls += this.expanded ? ' expanded' : ''; else cls += this.mobileOpen ? ' mobile-open' : ' mobile-closed'; return cls; }
}
