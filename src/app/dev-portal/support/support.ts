import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Toast {
  visible: boolean;
  hiding: boolean;
  message: string;
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support.html',
  styleUrls: ['./support.css'],
  encapsulation: ViewEncapsulation.None
})
export class SupportComponent implements OnInit {

  // ===================== TAB STATE =====================
  supportTab = 'overview';

  // ===================== STEP STATES =====================
  ticketStep = 1;
  incidentStep = 1;

  // ===================== SEVERITY =====================
  selectedSeverity: string | null = null;

  // ===================== MODAL STATE =====================
  activeModal: string | null = null;

  // ===================== TOAST =====================
  toast: Toast = { visible: false, hiding: false, message: '' };

  // ===================== TICKET FORM =====================
  ticketCategory = 'API Integration Issue';
  ticketSubject = '';
  ticketDesc = '';
  ticketPriority = 'High';

  // ===================== INCIDENT FORM =====================
  incidentTitle = '';
  incidentSeverity = 'Medium';
  incidentDesc = '';

  // ===================== TIER / RADIO =====================
  selectedTier: string | null = null;
  selectedRadio: string | null = null;

  ngOnInit(): void {}

  // ===================== NAVIGATION =====================
  navigateTo(route: string): void {
    console.log('Navigate to:', route);
  }

  // ===================== MODAL METHODS =====================
  openModal(id: string): void {
    this.activeModal = id;
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }

  // FIX: closeModal now accepts an optional id parameter (called from template with args)
  closeModal(id?: string): void {
    this.activeModal = null;
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  // FIX: processAction method added (called from template with 2 args)
  processAction(modalId: string, message: string): void {
    this.closeModal();
    this.showToast(message);
  }

  // ===================== TOAST METHODS =====================
  showToast(message: string): void {
    this.toast.message = message;
    this.toast.visible = true;
    this.toast.hiding = false;
    setTimeout(() => {
      this.toast.hiding = true;
      setTimeout(() => {
        this.toast.visible = false;
        this.toast.hiding = false;
      }, 300);
    }, 3000);
  }

  dismissToast(): void {
    this.toast.hiding = true;
    setTimeout(() => {
      this.toast.visible = false;
      this.toast.hiding = false;
    }, 300);
  }

  // ===================== SEVERITY SELECTION =====================
  selectSeverity(sev: string): void {
    this.selectedSeverity = sev;
    const blocks = document.querySelectorAll('.sev-block');
    blocks.forEach((b: Element) => {
      (b as HTMLElement).style.borderColor = '';
    });
    const selected = document.querySelector('.sev-block.' + sev);
    if (selected) {
      (selected as HTMLElement).style.borderColor = 'var(--pm-danger)';
    }
  }

  // ===================== RADIO CARD SELECTION =====================
  selectRadioCard(event: Event): void {
    const target = event.target as HTMLElement;
    const container = target.closest('.sev-1, .sev-2') || target;
    const input = container.querySelector('input[type="radio"]') as HTMLInputElement;
    if (input) {
      input.checked = true;
      this.selectedRadio = input.value;
    }
  }

  // ===================== TIER CARD SELECTION =====================
  selectTierCard(event: Event): void {
    const target = event.target as HTMLElement;
    const card = target.closest('.tier-card') as HTMLElement;
    if (card) {
      document.querySelectorAll('.tier-card').forEach((c: Element) => {
        c.classList.remove('active');
      });
      card.classList.add('active');
      const input = card.querySelector('input[type="radio"]') as HTMLInputElement;
      if (input) {
        input.checked = true;
        this.selectedTier = input.value;
      }
    }
  }

  // ===================== STEP NAVIGATION =====================
  prevTicketStep(): void { this.ticketStep = this.ticketStep - 1; }
  nextTicketStep(): void { this.ticketStep = this.ticketStep + 1; }

  prevIncidentStep(): void { this.incidentStep = this.incidentStep - 1; }
  nextIncidentStep(): void { this.incidentStep = this.incidentStep + 1; }

  resetTicket(): void {
    this.ticketStep = 1;
    this.ticketSubject = '';
    this.ticketDesc = '';
  }

  resetIncident(): void {
    this.incidentStep = 1;
    this.incidentTitle = '';
    this.incidentDesc = '';
  }

  submitTicket(): void {
    this.ticketStep = 2;
    this.showToast('Ticket submitted successfully!');
  }

  submitIncident(): void {
    this.incidentStep = 2;
    this.showToast('Incident acknowledged!');
  }
}