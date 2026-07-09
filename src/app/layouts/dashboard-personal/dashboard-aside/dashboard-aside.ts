import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-aside',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-aside.html',
  styleUrls: ['./dashboard-aside.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardAsideComponent {
  @Input() openPanel: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() toast = new EventEmitter<{ message: string; type: string }>();

  onClose(): void {
    this.close.emit();
  }

  onToggle2FA(e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    this.toast.emit({ message: checked ? '2FA enabled' : '2FA disabled', type: 'info' });
  }

  onToggleSandbox(e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    this.toast.emit({ message: checked ? 'Sandbox mode enabled' : 'Live mode enabled', type: 'info' });
  }
}