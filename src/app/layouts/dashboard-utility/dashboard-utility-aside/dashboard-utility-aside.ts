import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-utility-aside',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-utility-aside.html',
  styleUrls: ['./dashboard-utility-aside.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardUtilityAsideComponent {
  @Input() openPanel: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() toast = new EventEmitter<{ message: string; type: string }>();

  savedAccounts = [
    { name: 'Home Meter', provider: 'KPLC', number: '14825739' },
    { name: 'Office Water', provider: 'NCWSC', number: '290081-01' },
    { name: 'Home Internet', provider: 'Safaricom', number: 'SF-40812' },
  ];

  onClose(): void { this.close.emit(); }
  onToast(message: string, type: string): void { this.toast.emit({ message, type }); }
}
