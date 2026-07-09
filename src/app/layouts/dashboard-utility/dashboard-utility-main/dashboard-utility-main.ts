import { Component, Input, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-utility-main',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-utility-main.html',
  styleUrls: ['./dashboard-utility-main.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardUtilityMainComponent implements OnInit {
  @Input() sidebarExpanded: boolean = false;
  isDesktop: boolean = window.innerWidth >= 992;

  ngOnInit(): void { this.onResize(); }

  @HostListener('window:resize')
  onResize(): void { this.isDesktop = window.innerWidth >= 992; }

  get mainClasses(): string {
    return 'main-content' + (this.isDesktop && this.sidebarExpanded ? ' sidebar-expanded' : '');
  }
}
