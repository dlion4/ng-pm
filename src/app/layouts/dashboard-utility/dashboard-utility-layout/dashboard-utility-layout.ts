import { Component, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardUtilitySidebarComponent } from '../dashboard-utility-sidebar/dashboard-utility-sidebar';
import { DashboardUtilityHeaderComponent } from '../dashboard-utility-header/dashboard-utility-header';
import { DashboardUtilityMainComponent } from '../dashboard-utility-main/dashboard-utility-main';
import { DashboardUtilityAsideComponent } from '../dashboard-utility-aside/dashboard-utility-aside';

@Component({
  selector: 'app-dashboard-utility-layout', standalone: true,
  imports: [CommonModule, RouterModule, DashboardUtilitySidebarComponent, DashboardUtilityHeaderComponent, DashboardUtilityMainComponent, DashboardUtilityAsideComponent],
  templateUrl: './dashboard-utility-layout.html',
  styleUrls: ['./dashboard-utility-layout.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardUtilityLayoutComponent implements OnInit {
  sidebarExpanded: boolean = true;
  mobileOpen: boolean = false;
  openAsidePanel: string | null = null;
  activeSection: string = 'dashboard';
  isDesktop: boolean = window.innerWidth >= 992;

  ngOnInit(): void { this.sidebarExpanded = this.isDesktop; this.onResize(); }
  @HostListener('window:resize') onResize(): void { const d = window.innerWidth >= 992; if (d !== this.isDesktop) { this.isDesktop = d; if (d) this.mobileOpen = false; else this.sidebarExpanded = false; } }
  @HostListener('document:keydown', ['$event']) onKeydown(e: KeyboardEvent): void { if (e.key === 'Escape') { this.closeAside(); if (!this.isDesktop) this.mobileOpen = false; } }
  onToggleSidebar(): void { if (this.isDesktop) this.sidebarExpanded = !this.sidebarExpanded; else this.mobileOpen = !this.mobileOpen; }
  onMobileClose(): void { this.mobileOpen = false; }
  onOpenAside(type: string): void { this.openAsidePanel = type; }
  closeAside(): void { this.openAsidePanel = null; }
  onLogout(): void { console.log('Logout triggered'); }
  onToast(payload: { message: string; type: string }): void { console.log('Toast:', payload); }
}
