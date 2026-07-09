import { Component, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardSidebarComponent } from '../dashboard-sidebar/dashboard-sidebar';
import { DashboardHeaderComponent } from '../dashboard-header/dashboard-header';
import { DashboardMainComponent } from '../dashboard-main/dashboard-main';
import { DashboardAsideComponent } from '../dashboard-aside/dashboard-aside';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DashboardSidebarComponent,
    DashboardHeaderComponent,
    DashboardMainComponent,
    DashboardAsideComponent,
  ],
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardLayoutComponent implements OnInit {

  sidebarExpanded: boolean = true;
  mobileOpen: boolean = false;
  openAsidePanel: string | null = null;
  activeSection: string = 'dashboard';
  isDesktop: boolean = window.innerWidth >= 992;

  ngOnInit(): void {
    this.sidebarExpanded = this.isDesktop;
    this.onResize();
  }

  @HostListener('window:resize')
  onResize(): void {
    const desktop = window.innerWidth >= 992;
    if (desktop !== this.isDesktop) {
      this.isDesktop = desktop;
      if (desktop) {
        this.mobileOpen = false;
      } else {
        this.sidebarExpanded = false;
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.closeAside();
      if (!this.isDesktop) {
        this.mobileOpen = false;
      }
    }
  }

  onToggleSidebar(): void {
    if (this.isDesktop) {
      this.sidebarExpanded = !this.sidebarExpanded;
    } else {
      this.mobileOpen = !this.mobileOpen;
    }
  }

  onMobileClose(): void {
    this.mobileOpen = false;
  }

  onOpenAside(type: string): void {
    this.openAsidePanel = type;
  }

  closeAside(): void {
    this.openAsidePanel = null;
  }

  onLogout(): void {
    // Hook into auth service here
    console.log('Logout triggered');
  }

  onToast(payload: { message: string; type: string }): void {
    // Toast handling — can be connected to a global toast service
    console.log('Toast:', payload);
  }
}