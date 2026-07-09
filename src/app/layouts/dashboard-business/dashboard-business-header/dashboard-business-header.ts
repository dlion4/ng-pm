import { Component, Input, Output, EventEmitter, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NotificationItem { id: number; icon: string; tone: string; title: string; desc: string; time: string; unread: boolean; }
export interface ToastItem { id: number; message: string; type: 'success' | 'danger' | 'warning' | 'info'; isLeaving: boolean; title: string; icon: string; bg: string; color: string; }

@Component({
  selector: 'app-dashboard-business-header', standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-business-header.html',
  styleUrls: ['./dashboard-business-header.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardBusinessHeaderComponent implements OnInit {
  @Input() sidebarExpanded: boolean = true;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() openAside = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();
  @Output() toast = new EventEmitter<ToastItem>();

  notifications: NotificationItem[] = [];
  openDropdown: string | null = null;
  toasts: ToastItem[] = [];
  private toastId = 0;
  isDesktop: boolean = window.innerWidth >= 992;

  ngOnInit(): void { this.onResize(); }
  @HostListener('window:resize') onResize(): void { this.isDesktop = window.innerWidth >= 992; }
  @HostListener('document:click', ['$event']) onDocumentClick(e: MouseEvent): void { if (!(e.target as HTMLElement).closest('[data-dropdown]')) this.closeAllDropdowns(); }
  @HostListener('document:keydown', ['$event']) onKeydown(e: KeyboardEvent): void { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') { e.preventDefault(); this.toggleSidebar.emit(); } if (e.key === 'Escape') this.closeAllDropdowns(); }

  get headerClasses(): string { return 'top-header' + (this.isDesktop && this.sidebarExpanded ? ' sidebar-expanded' : ''); }
  get toggleIconClass(): string { return (this.isDesktop && this.sidebarExpanded) ? 'bi bi-x-lg' : 'bi bi-list'; }
  onToggleSidebar(): void { this.toggleSidebar.emit(); }
  toggleDropdown(name: string, e?: MouseEvent): void { if (e) e.stopPropagation(); if (this.openDropdown === name) { this.closeAllDropdowns(); return; } this.closeAllDropdowns(); this.openDropdown = name; }
  closeAllDropdowns(): void { this.openDropdown = null; }
  isDropdownOpen(name: string): boolean { return this.openDropdown === name; }
  onOpenAside(type: string, e?: MouseEvent): void { if (e) e.stopPropagation(); this.openAside.emit(type); this.closeAllDropdowns(); }
  onLogout(): void { this.logout.emit(); this.addToast('Logged out successfully', 'success'); this.closeAllDropdowns(); }

  addToast(message: string, type: 'success' | 'danger' | 'warning' | 'info'): void {
    const tones: Record<string, { bg: string; color: string; icon: string; title: string }> = {
      success: { bg: 'rgba(16,185,129,0.1)', color: 'var(--paymo-accent)', icon: 'bi-check-lg', title: 'Success' },
      danger: { bg: 'rgba(239,68,68,0.1)', color: 'var(--paymo-danger)', icon: 'bi-x-lg', title: 'Error' },
      warning: { bg: 'rgba(245,158,11,0.1)', color: 'var(--paymo-warning)', icon: 'bi-exclamation-triangle', title: 'Warning' },
      info: { bg: 'rgba(91,77,219,0.1)', color: 'var(--paymo-primary)', icon: 'bi-bell', title: 'Info' },
    };
    const t = tones[type] || tones['info'];
    const toast: ToastItem = { id: ++this.toastId, message, type, isLeaving: false, title: t.title, icon: t.icon, bg: t.bg, color: t.color };
    this.toasts.push(toast); this.toast.emit(toast); setTimeout(() => this.removeToast(toast.id), 4500);
  }
  removeToast(id: number): void { const idx = this.toasts.findIndex(t => t.id === id); if (idx > -1) { this.toasts[idx] = { ...this.toasts[idx], isLeaving: true }; setTimeout(() => { this.toasts = this.toasts.filter(t => t.id !== id); }, 300); } }
}
