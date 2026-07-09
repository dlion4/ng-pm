import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavItem { key: string; label: string; icon: string; route: string; badge?: string | number; }
export interface NavGroup { title: string; items: NavItem[]; }

@Component({
  selector: 'app-dashboard-cards-sidebar', standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-cards-sidebar.html',
  styleUrls: ['./dashboard-cards-sidebar.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardCardsSidebarComponent {
  @Input() expanded: boolean = false;
  @Input() mobileOpen: boolean = false;
  @Input() activeSection: string = 'hub';
  @Output() navClick = new EventEmitter<string>();
  @Output() mobileClose = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  navGroups: NavGroup[] = [
    { title: 'Overview', items: [
      { key: 'hub', label: 'Hub Overview', icon: 'bi-grid-1x2', route: '/cards' },
      { key: 'analytics', label: 'Usage Analytics', icon: 'bi-graph-up', route: '/cards/analytics' },
    ]},
    { title: 'Management', items: [
      { key: 'issue', label: 'Issue Card', icon: 'bi-plus-circle', route: '/cards/issue' },
      { key: 'security', label: 'Security Control', icon: 'bi-shield-lock', route: '/cards/security' },
      { key: 'limits', label: 'Spend Limits', icon: 'bi-sliders', route: '/cards/limits' },
      { key: 'geofencing', label: 'Geofencing', icon: 'bi-geo-alt', route: '/cards/geofencing' },
    ]},
    { title: 'Settings', items: [
      { key: 'program', label: 'Card Program', icon: 'bi-gear', route: '/cards/program' },
      { key: 'support', label: 'Support', icon: 'bi-life-preserver', route: '/cards/support' },
    ]}
  ];

  onNavItemClick(item: NavItem): void { this.navClick.emit(item.key); if (!this.isDesktop()) this.mobileClose.emit(); }
  onLogoutClick(): void { this.logout.emit(); }
  onBackdropClick(): void { this.mobileClose.emit(); }
  onCloseMobile(): void { this.mobileClose.emit(); }
  isDesktop(): boolean { return window.innerWidth >= 992; }
  get sidebarClasses(): string { let cls = 'sidebar'; if (this.isDesktop()) cls += this.expanded ? ' expanded' : ''; else cls += this.mobileOpen ? ' mobile-open' : ' mobile-closed'; return cls; }
}
