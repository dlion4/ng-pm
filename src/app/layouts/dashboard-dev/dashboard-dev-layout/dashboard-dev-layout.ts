import { Component, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardDevSidebarComponent } from '../dashboard-dev-sidebar/dashboard-dev-sidebar';
import { DashboardDevHeaderComponent } from '../dashboard-dev-header/dashboard-dev-header';
import { DashboardDevMainComponent } from '../dashboard-dev-main/dashboard-dev-main';
import { DashboardDevAsideComponent } from '../dashboard-dev-aside/dashboard-dev-aside';

@Component({
  selector: 'app-dashboard-dev-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, DashboardDevSidebarComponent, DashboardDevHeaderComponent, DashboardDevMainComponent, DashboardDevAsideComponent],
  templateUrl: './dashboard-dev-layout.html',
  styleUrls: ['./dashboard-dev-layout.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardDevLayoutComponent implements OnInit {
  sidebarExpanded: boolean = true;
  mobileOpen: boolean = false;
  openAsidePanel: string | null = null;
  activeSection: string = 'dashboard';
  isDesktop: boolean = window.innerWidth >= 992;

  ngOnInit(): void { this.sidebarExpanded = this.isDesktop; this.onResize(); }

  @HostListener('window:resize') onResize(): void {
    const desktop = window.innerWidth >= 992;
    if (desktop !== this.isDesktop) { this.isDesktop = desktop; if (desktop) this.mobileOpen = false; else this.sidebarExpanded = false; }
  }
  @HostListener('document:keydown', ['$event']) onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') { this.closeAside(); if (!this.isDesktop) this.mobileOpen = false; }
  }

  onToggleSidebar(): void { if (this.isDesktop) this.sidebarExpanded = !this.sidebarExpanded; else this.mobileOpen = !this.mobileOpen; }
  onMobileClose(): void { this.mobileOpen = false; }
  onOpenAside(type: string): void { this.openAsidePanel = type; }
  closeAside(): void { this.openAsidePanel = null; }
  onLogout(): void { console.log('Logout triggered'); }
  onToast(payload: { message: string; type: string }): void { console.log('Toast:', payload); }
}
