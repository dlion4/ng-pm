import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavItem { key: string; label: string; icon: string; route: string; badge?: string | number; }
export interface NavGroup { title: string; items: NavItem[]; }

@Component({
  selector: 'app-dashboard-utility-sidebar', standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-utility-sidebar.html',
  styleUrls: ['./dashboard-utility-sidebar.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardUtilitySidebarComponent {
  @Input() expanded: boolean = false;
  @Input() mobileOpen: boolean = false;
  @Input() activeSection: string = 'electricity';
  @Output() navClick = new EventEmitter<string>();
  @Output() mobileClose = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  navGroups: NavGroup[] = [
    { title: 'Utility Services', items: [
      { key: 'electricity', label: 'Electricity', icon: 'bi-lightning-charge', route: '/utility/electricity' },
      { key: 'water', label: 'Water Bills', icon: 'bi-droplet', route: '/utility/water' },
      { key: 'tv', label: 'Cable TV', icon: 'bi-tv', route: '/utility/tv' },
      { key: 'internet', label: 'Internet / Fiber', icon: 'bi-wifi', route: '/utility/internet' },
      { key: 'airtime', label: 'Airtime & Data', icon: 'bi-phone', route: '/utility/airtime' },
      { key: 'gas', label: 'Gas & Fuel', icon: 'bi-fuel-pump', route: '/utility/gas' },
    ]},
    { title: 'Management', items: [
      { key: 'autopay', label: 'Auto-Pay', icon: 'bi-calendar-check', route: '/utility/autopay', badge: 3 },
      { key: 'history', label: 'History', icon: 'bi-clock-history', route: '/utility/history' },
      { key: 'saved', label: 'Saved Accounts', icon: 'bi-bookmark', route: '/utility/saved' },
    ]},
    { title: 'System', items: [
      { key: 'security', label: 'Security', icon: 'bi-shield-check', route: '/utility/security' },
      { key: 'settings', label: 'Settings', icon: 'bi-gear', route: '/utility/settings' },
      { key: 'support', label: 'Support', icon: 'bi-life-preserver', route: '/utility/support' },
    ]}
  ];

  onNavItemClick(item: NavItem): void { this.navClick.emit(item.key); if (!this.isDesktop()) this.mobileClose.emit(); }
  onLogoutClick(): void { this.logout.emit(); }
  onBackdropClick(): void { this.mobileClose.emit(); }
  onCloseMobile(): void { this.mobileClose.emit(); }
  isDesktop(): boolean { return window.innerWidth >= 992; }
  get sidebarClasses(): string { let cls = 'sidebar'; if (this.isDesktop()) cls += this.expanded ? ' expanded' : ''; else cls += this.mobileOpen ? ' mobile-open' : ' mobile-closed'; return cls; }
}
