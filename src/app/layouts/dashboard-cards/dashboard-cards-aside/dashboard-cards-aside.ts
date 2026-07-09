import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-cards-aside',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-cards-aside.html',
  styleUrls: ['./dashboard-cards-aside.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardCardsAsideComponent {
  @Input() openPanel: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() toast = new EventEmitter<{ message: string; type: string }>();

  onClose(): void { this.close.emit(); }
  onToast(message: string, type: string): void { this.toast.emit({ message, type }); }
}
