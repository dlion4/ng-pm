import { Component, Input, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-cards-main',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-cards-main.html',
  styleUrls: ['./dashboard-cards-main.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardCardsMainComponent implements OnInit {
  @Input() sidebarExpanded: boolean = false;
  isDesktop: boolean = window.innerWidth >= 992;

  ngOnInit(): void { this.onResize(); }

  @HostListener('window:resize')
  onResize(): void { this.isDesktop = window.innerWidth >= 992; }

  get mainClasses(): string {
    return 'main-content' + (this.isDesktop && this.sidebarExpanded ? ' sidebar-expanded' : '');
  }
}
