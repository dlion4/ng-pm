import { Component, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardBusinessSidebarComponent } from '../dashboard-business-sidebar/dashboard-business-sidebar';
import { DashboardBusinessHeaderComponent } from '../dashboard-business-header/dashboard-business-header';
import { DashboardBusinessMainComponent } from '../dashboard-business-main/dashboard-business-main';
import { DashboardBusinessAsideComponent } from '../dashboard-business-aside/dashboard-business-aside';

@Component({
  selector: 'app-dashboard-business-layout', standalone: true,
  imports: [CommonModule, RouterModule, DashboardBusinessSidebarComponent, DashboardBusinessHeaderComponent, DashboardBusinessMainComponent, DashboardBusinessAsideComponent],
  templateUrl: './dashboard-business-layout.html',
  styleUrls: ['./dashboard-business-layout.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardBusinessLayoutComponent implements OnInit {
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
