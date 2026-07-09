import { Component, Input, Output, EventEmitter, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NotificationItem {
  id: number;
  icon: string;
  tone: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

export interface AccountItem {
  id: string;
  name: string;
  role: string;
}

export interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  isLeaving: boolean; // <-- Updated name to prevent type conflicts with template classes
  title: string;
  icon: string;
  bg: string;
  color: string;
}

@Component({
  selector: 'app-dashboard-header',
  standalone: true, // <-- Confirmed standalone for dashboard-layout imports
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-header.html',
  styleUrls: ['./dashboard-header.css'],
  encapsulation: ViewEncapsulation.None // <-- Ensures styles are applied globally for this component
})
export class DashboardHeaderComponent implements OnInit {

  @Input() sidebarExpanded: boolean = true;
  @Input() accountId: string = 'ACC-8X29-KL4';

  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() openAside = new EventEmitter<string>();
  @Output() accountSwitch = new EventEmitter<AccountItem>();
  @Output() logout = new EventEmitter<void>();
  @Output() toast = new EventEmitter<ToastItem>();

  notifications: NotificationItem[] = [
    { id: 1, icon: 'bi-cpu', tone: 'primary', title: 'Developer API key rotated', desc: 'Production key was refreshed 2 min ago.', time: '2m', unread: true },
    { id: 2, icon: 'bi-currency-dollar', tone: 'success', title: 'Incoming settlement received', desc: 'KES 2.84M settled to operating wallet.', time: '15m', unread: true },
    { id: 3, icon: 'bi-shield-check', tone: 'warning', title: "New login from Safari · Nairobi", desc: "If this wasn't you, review active sessions.", time: '1h', unread: true },
    { id: 4, icon: 'bi-arrow-left-right', tone: 'danger', title: 'Bulk transfer partially failed', desc: '12 of 340 transactions need retry.', time: '3h', unread: false },
  ];

  accounts: AccountItem[] = [
    { id: 'ACC-8X29-KL4', name: 'Operating Account', role: 'Primary' },
    { id: 'ACC-2P91-MNQ', name: 'Developer Sandbox', role: 'Test' },
    { id: 'ACC-7L44-XYZ', name: 'Treasury Reserve', role: 'Restricted' },
  ];

  openDropdown: string | null = null;
  toasts: ToastItem[] = [];
  private toastId = 0;

  isDesktop: boolean = window.innerWidth >= 992;

  ngOnInit(): void {
    this.onResize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isDesktop = window.innerWidth >= 992;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.closest('[data-dropdown]')) {
      this.closeAllDropdowns();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      this.toggleSidebar.emit();
    }
    if (e.key === 'Escape') {
      this.closeAllDropdowns();
    }
  }

  get headerClasses(): string {
    return 'top-header' + (this.isDesktop && this.sidebarExpanded ? ' sidebar-expanded' : '');
  }

  get toggleIconClass(): string {
    const open = (!this.isDesktop && false) || (this.isDesktop && this.sidebarExpanded);
    return open ? 'bi bi-x-lg' : 'bi bi-list';
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleDropdown(name: string, e?: MouseEvent): void {
    if (e) e.stopPropagation();
    if (this.openDropdown === name) {
      this.closeAllDropdowns();
      return;
    }
    this.closeAllDropdowns();
    this.openDropdown = name;
  }

  closeAllDropdowns(): void {
    this.openDropdown = null;
  }

  isDropdownOpen(name: string): boolean {
    return this.openDropdown === name;
  }

  onOpenAside(type: string, e?: MouseEvent): void {
    if (e) e.stopPropagation();
    this.openAside.emit(type);
    this.closeAllDropdowns();
  }

  onSwitchAccount(acc: AccountItem): void {
    this.accountSwitch.emit(acc);
    this.addToast(`Switched to ${acc.name}`, 'info');
    this.closeAllDropdowns();
  }

  async copyAccountId(): Promise<void> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(this.accountId);
      } else {
        const ta = document.createElement('textarea');
        ta.value = this.accountId;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      this.addToast('Account ID copied to clipboard', 'success');
    } catch {
      this.addToast('Failed to copy', 'danger');
    }
  }

  onLogout(): void {
    this.logout.emit();
    this.addToast('Logged out successfully', 'success');
    this.closeAllDropdowns();
  }

  addToast(message: string, type: 'success' | 'danger' | 'warning' | 'info'): void {
    const tones: Record<string, { bg: string; color: string; icon: string; title: string }> = {
      success: { bg: 'rgba(16,185,129,0.1)', color: 'var(--paymo-accent)', icon: 'bi-check-lg', title: 'Success' },
      danger: { bg: 'rgba(239,68,68,0.1)', color: 'var(--paymo-danger)', icon: 'bi-x-lg', title: 'Error' },
      warning: { bg: 'rgba(245,158,11,0.1)', color: 'var(--paymo-warning)', icon: 'bi-exclamation-triangle', title: 'Warning' },
      info: { bg: 'rgba(91,77,219,0.1)', color: 'var(--paymo-primary)', icon: 'bi-bell', title: 'Info' },
    };
    const t = tones[type] || tones['info'];
    const toast: ToastItem = {
      id: ++this.toastId,
      message,
      type,
      isLeaving: false, // Updated here
      title: t.title,
      icon: t.icon,
      bg: t.bg,
      color: t.color,
    };
    this.toasts.push(toast);
    this.toast.emit(toast);
    setTimeout(() => this.removeToast(toast.id), 4500);
  }

  removeToast(id: number): void {
    const idx = this.toasts.findIndex(t => t.id === id);
    if (idx > -1) {
      this.toasts[idx] = { ...this.toasts[idx], isLeaving: true }; // Updated here
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id);
      }, 300);
    }
  }
}