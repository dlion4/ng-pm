import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, ViewEncapsulation, inject } from '@angular/core';

type OperationState = 'idle' | 'loading' | 'success';
type ActionKind = 'open' | 'close' | 'process' | 'next' | 'notify';
interface UiAction { label: string; showLabel?: boolean; iconClass: string; variantClass: string; style?: string; kind: ActionKind; target?: string; nextTarget?: string; message?: string; reference?: string; disabled: boolean; replaceCurrent?: boolean; stepLabels?: string[]; }
interface UiBadge { text: string; className: string; iconClass: string; style?: string; }
interface UiListItem { title: string; subtitle?: string | null; value?: string; iconClass?: string; iconContainerClass?: string; iconContainerStyle?: string; badge?: UiBadge | null; action?: UiAction; }
interface UiCell { text: string; strong: boolean; className: string; style?: string; secondary?: string; avatar?: string; badge?: UiBadge; actions?: UiAction[]; colspan?: number; }
interface UiTableRow { cells: UiCell[]; filterKey: string; }
interface UiTable { columns: string[]; rows: UiTableRow[]; }
interface UiChartBar { label: string; value: number; color: string; }
interface UiTabFilter { key: string; label: string; }
interface UiCard { id: string; columnClass: string; cardClass: string; style?: string; iconClass?: string; title: string; subtitle: string; label: string; value: string; description: string; badge: UiBadge | null; lines: string[]; items: UiListItem[]; quickActions: UiAction[]; actions: UiAction[]; table: UiTable | null; chart: UiChartBar[]; children: UiCard[]; tabs: UiTabFilter[]; action: UiAction | null; }
interface UiPageBlock { id: string; wrapperClass: string; cards: UiCard[]; }
interface BreadcrumbItem { label: string; href: string; action: UiAction; }
interface PageConfig { breadcrumbs: BreadcrumbItem[]; title: string; description: string; actions: UiAction[]; }
interface UiField { key: string; label: string; type: string; value: string; placeholder: string; options: string[]; style?: string; checked: boolean; disabled: boolean; columnClass: string; pinLength?: number; }
interface UiAlert { text: string; tone: string; }
interface UiDetail { label: string; value: string; }
interface UiStat { label: string; value: string; className: string; }
interface UiImage { src: string; alt: string; className: string; style?: string; }
interface UiReceipt { title: string; description: string; iconClass: string; }
interface ModalContent { notes: string[]; alerts: UiAlert[]; stats: UiStat[]; fields: UiField[]; details: UiDetail[]; items: UiListItem[]; tables: UiTable[]; actions: UiAction[]; image: UiImage | null; receipt: UiReceipt | null; }
interface ModalStep { label: string; content: ModalContent; }
interface ModalTab { id: string; label: string; content: ModalContent; }
interface ModalConfig { id: string; title: string; iconClass: string; sizeClass: string; content: ModalContent | null; steps: ModalStep[]; tabs: ModalTab[]; actions: UiAction[]; }
interface UiCopy { processingTitle: string; processingHint: string; completedTitle: string; successIconClass: string; toastIconClass: string; dismissNotificationLabel: string; closeModalLabel: string; closeSymbol: string; completedStepSymbol: string; breadcrumbSeparator: string; defaultIconContainerClass: string; }

@Component({
  selector: 'app-invoicing-billing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoicing-billing.html',
  styleUrl: './invoicing-billing.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class InvoicingBillingComponent implements OnDestroy {
  readonly ui: UiCopy = {
  "processingTitle": "Processing…",
  "processingHint": "Please wait while your request is completed.",
  "completedTitle": "Completed",
  "successIconClass": "bi bi-check-lg",
  "toastIconClass": "bi bi-check-circle-fill",
  "dismissNotificationLabel": "Dismiss notification",
  "closeModalLabel": "Close dialog",
  "closeSymbol": "×",
  "completedStepSymbol": "✓",
  "breadcrumbSeparator": "/",
  "defaultIconContainerClass": "pm-icon-circle"
};
  readonly pageConfig: PageConfig = {
  "breadcrumbs": [
    {
      "label": "Business Portal",
      "href": "#",
      "action": {
        "label": "Business Portal",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "",
        "kind": "notify",
        "message": "Business Portal selected.",
        "disabled": false
      }
    },
    {
      "label": "Collections",
      "href": "#",
      "action": {
        "label": "Collections",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "",
        "kind": "notify",
        "message": "Collections selected.",
        "disabled": false
      }
    },
    {
      "label": "Invoicing & Billing",
      "href": "",
      "action": {
        "label": "Invoicing & Billing",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "",
        "kind": "notify",
        "message": "Invoicing & Billing selected.",
        "disabled": false
      }
    }
  ],
  "title": "PAGE 3.3 — Invoicing & Billing",
  "description": "Create invoices, manage payment links, automate DSOs, and track recurring subscriptions in real-time.",
  "actions": [
    {
      "label": "Payment Link",
      "showLabel": true,
      "iconClass": "bi bi-link-45deg",
      "variantClass": "pm-btn",
      "style": "",
      "kind": "open",
      "message": "",
      "disabled": false,
      "target": "p33_newPaymentLinkModal"
    },
    {
      "label": "Subscription",
      "showLabel": true,
      "iconClass": "bi bi-arrow-repeat",
      "variantClass": "pm-btn",
      "style": "",
      "kind": "open",
      "message": "",
      "disabled": false,
      "target": "p33_newSubscriptionModal"
    },
    {
      "label": "New Invoice",
      "showLabel": true,
      "iconClass": "bi bi-plus-lg",
      "variantClass": "pm-btn-primary pm-btn",
      "style": "",
      "kind": "open",
      "message": "",
      "disabled": false,
      "target": "p33_newInvoiceModal"
    }
  ]
} as PageConfig;
  readonly pageBlocks: UiPageBlock[] = [
  {
    "id": "block-1",
    "wrapperClass": "row g-3",
    "cards": [
      {
        "id": "total-outstanding",
        "columnClass": "col-lg-3 col-md-6",
        "cardClass": "pm-card pm-card-accent",
        "style": "min-height:160px",
        "iconClass": "",
        "title": "",
        "subtitle": "",
        "label": "TOTAL OUTSTANDING",
        "value": "KES 482,500",
        "description": "",
        "badge": null,
        "lines": [
          "●",
          "Overdue:",
          "KES 168k"
        ],
        "items": [],
        "quickActions": [],
        "actions": [
          {
            "label": "Aging Report",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn",
            "style": "color:#fff;text-decoration:underline",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_agingReportModal"
          }
        ],
        "table": null,
        "chart": [
          {
            "label": "",
            "value": 45.0,
            "color": "#10B981"
          },
          {
            "label": "",
            "value": 25.0,
            "color": "#FBBF24"
          },
          {
            "label": "",
            "value": 20.0,
            "color": "#F59E0B"
          },
          {
            "label": "",
            "value": 10.0,
            "color": "#EF4444"
          }
        ],
        "children": [],
        "tabs": [],
        "action": null
      },
      {
        "id": "this-month-invoiced",
        "columnClass": "col-lg-3 col-md-6",
        "cardClass": "pm-card",
        "style": "min-height:160px",
        "iconClass": "",
        "title": "",
        "subtitle": "",
        "label": "THIS MONTH INVOICED",
        "value": "KES 1.2M",
        "description": "",
        "badge": {
          "text": "14% vs last mo",
          "className": "pm-badge pm-badge-success",
          "iconClass": "bi bi-arrow-up-right",
          "style": ""
        },
        "lines": [
          "Collection Rate",
          "82%"
        ],
        "items": [],
        "quickActions": [],
        "actions": [],
        "table": null,
        "chart": [],
        "children": [],
        "tabs": [],
        "action": null
      },
      {
        "id": "monthly-recurring-mrr",
        "columnClass": "col-lg-3 col-md-6",
        "cardClass": "pm-card",
        "style": "min-height:160px",
        "iconClass": "",
        "title": "",
        "subtitle": "",
        "label": "MONTHLY RECURRING (MRR)",
        "value": "KES 345,000",
        "description": "",
        "badge": {
          "text": "124 Active Subs",
          "className": "pm-badge pm-badge-info",
          "iconClass": "bi bi-arrow-repeat",
          "style": ""
        },
        "lines": [],
        "items": [],
        "quickActions": [],
        "actions": [],
        "table": null,
        "chart": [],
        "children": [],
        "tabs": [],
        "action": null
      },
      {
        "id": "days-sales-outstanding",
        "columnClass": "col-lg-3 col-md-6",
        "cardClass": "pm-card",
        "style": "min-height:160px;border-left:3px solid var(--pm-warning)",
        "iconClass": "",
        "title": "",
        "subtitle": "",
        "label": "DAYS SALES OUTSTANDING",
        "value": "28 Days",
        "description": "",
        "badge": {
          "text": "Healthy",
          "className": "pm-badge pm-badge-success",
          "iconClass": "bi bi-check-circle",
          "style": ""
        },
        "lines": [
          "Link Conversions:",
          "68% paid",
          "Avg time to pay:",
          "1.2 days",
          "(via Link)"
        ],
        "items": [],
        "quickActions": [],
        "actions": [],
        "table": null,
        "chart": [],
        "children": [],
        "tabs": [],
        "action": null
      }
    ]
  },
  {
    "id": "block-2",
    "wrapperClass": "row g-3",
    "cards": [
      {
        "id": "attention-required",
        "columnClass": "col-lg-4",
        "cardClass": "pm-card",
        "style": "height:100%",
        "iconClass": "",
        "title": "Attention Required",
        "subtitle": "",
        "label": "",
        "value": "",
        "description": "",
        "badge": null,
        "lines": [
          "INV-2025-042 is 14 days overdue",
          "Nairobi Tech Ltd · KES 85,000",
          "Subscription payment failed",
          "Premium Plan · KES 5,000/mo (Retry 2)",
          "High value link abandoned",
          "Link LNK-992 · KES 120,000 viewed 3x"
        ],
        "items": [
          {
            "title": "INV-2025-042 is 14 days overdue Nairobi Tech Ltd · KES 85,000",
            "subtitle": "INV",
            "value": "",
            "iconClass": "",
            "iconContainerClass": "pm-icon-circle",
            "iconContainerStyle": "background:var(--pm-danger-soft);color:var(--pm-danger);font-size:12px",
            "badge": null,
            "action": {
              "label": "Remind",
              "showLabel": true,
              "iconClass": "",
              "variantClass": "pm-btn pm-btn-sm pm-btn-danger",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p33_bulkRemindersModal"
            }
          },
          {
            "title": "Subscription payment failed Premium Plan · KES 5,000/mo (Retry 2)",
            "subtitle": "SUB",
            "value": "",
            "iconClass": "",
            "iconContainerClass": "pm-icon-circle",
            "iconContainerStyle": "background:var(--pm-warning-soft);color:var(--pm-warning);font-size:12px",
            "badge": null,
            "action": {
              "label": "Dunning",
              "showLabel": true,
              "iconClass": "",
              "variantClass": "pm-btn pm-btn-sm",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p33_dunningSettingsModal"
            }
          },
          {
            "title": "High value link abandoned Link LNK-992 · KES 120,000 viewed 3x",
            "subtitle": "LNK",
            "value": "",
            "iconClass": "",
            "iconContainerClass": "pm-icon-circle",
            "iconContainerStyle": "background:var(--pm-purple-soft);color:var(--pm-purple);font-size:12px",
            "badge": null,
            "action": {
              "label": "Track",
              "showLabel": true,
              "iconClass": "",
              "variantClass": "pm-btn pm-btn-sm",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p33_linkAnalyticsModal"
            }
          }
        ],
        "quickActions": [],
        "actions": [
          {
            "label": "View all",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_attentionModal"
          }
        ],
        "table": null,
        "chart": [],
        "children": [],
        "tabs": [],
        "action": null
      },
      {
        "id": "smart-suggestions",
        "columnClass": "col-lg-4",
        "cardClass": "pm-card",
        "style": "height:100%",
        "iconClass": "",
        "title": "Smart Suggestions",
        "subtitle": "",
        "label": "",
        "value": "",
        "description": "",
        "badge": {
          "text": "AI",
          "className": "pm-badge pm-badge-purple",
          "iconClass": "bi bi-stars",
          "style": ""
        },
        "lines": [
          "Enable auto-reminders",
          "Reduce DSO by approx 4 days",
          "Offer early payment discount",
          "To 3 clients with 60+ days aging",
          "TAX",
          "Update Withholding Tax rates",
          "New KRA brackets detected for services"
        ],
        "items": [
          {
            "title": "Enable auto-reminders Reduce DSO by approx 4 days",
            "subtitle": "AR",
            "value": "",
            "iconClass": "",
            "iconContainerClass": "pm-icon-circle",
            "iconContainerStyle": "background:var(--pm-accent-soft);color:var(--pm-accent);font-size:12px",
            "badge": null,
            "action": {
              "label": "Setup",
              "showLabel": true,
              "iconClass": "",
              "variantClass": "pm-btn pm-btn-sm",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p33_reminderSettingsModal"
            }
          },
          {
            "title": "Offer early payment discount To 3 clients with 60+ days aging",
            "subtitle": "UP",
            "value": "",
            "iconClass": "",
            "iconContainerClass": "pm-icon-circle",
            "iconContainerStyle": "background:var(--pm-info-soft);color:var(--pm-info);font-size:12px",
            "badge": null,
            "action": {
              "label": "Review",
              "showLabel": true,
              "iconClass": "",
              "variantClass": "pm-btn pm-btn-sm",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p33_suggestionsModal"
            }
          },
          {
            "title": "Update Withholding Tax rates New KRA brackets detected for services",
            "subtitle": "TAX  Withholding Tax rates New KRA brackets detected for services Update",
            "value": "",
            "iconClass": "",
            "iconContainerClass": "pm-icon-circle",
            "iconContainerStyle": "background:var(--pm-warning-soft);color:var(--pm-warning);font-size:12px",
            "badge": null,
            "action": {
              "label": "Update",
              "showLabel": true,
              "iconClass": "",
              "variantClass": "pm-btn pm-btn-sm",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p33_taxSettingsModal"
            }
          }
        ],
        "quickActions": [],
        "actions": [],
        "table": null,
        "chart": [],
        "children": [],
        "tabs": [],
        "action": null
      },
      {
        "id": "quick-actions",
        "columnClass": "col-lg-4",
        "cardClass": "pm-card",
        "style": "height:100%",
        "iconClass": "",
        "title": "Quick Actions",
        "subtitle": "Common billing workflows",
        "label": "",
        "value": "",
        "description": "",
        "badge": null,
        "lines": [],
        "items": [],
        "quickActions": [
          {
            "label": "New Invoice",
            "showLabel": true,
            "iconClass": "bi bi-receipt",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_newInvoiceModal"
          },
          {
            "label": "Payment Link",
            "showLabel": true,
            "iconClass": "bi bi-link-45deg",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_newPaymentLinkModal"
          },
          {
            "label": "Subscription",
            "showLabel": true,
            "iconClass": "bi bi-arrow-repeat",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_newSubscriptionModal"
          },
          {
            "label": "Credit Note",
            "showLabel": true,
            "iconClass": "bi bi-file-earmark-minus",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_creditNoteModal"
          },
          {
            "label": "Record Pay",
            "showLabel": true,
            "iconClass": "bi bi-cash",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_recordPaymentModal"
          },
          {
            "label": "Reminders",
            "showLabel": true,
            "iconClass": "bi bi-bell",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_bulkRemindersModal"
          },
          {
            "label": "Customers",
            "showLabel": true,
            "iconClass": "bi bi-people",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_customerSelectModal"
          },
          {
            "label": "Templates",
            "showLabel": true,
            "iconClass": "bi bi-palette",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_invoiceTemplatesModal"
          }
        ],
        "actions": [],
        "table": null,
        "chart": [],
        "children": [],
        "tabs": [],
        "action": null
      }
    ]
  },
  {
    "id": "block-3",
    "wrapperClass": "row g-3",
    "cards": [
      {
        "id": "3-3-1-invoice-creation-management",
        "columnClass": "col-12",
        "cardClass": "pm-card mt-3",
        "style": "",
        "iconClass": "bi bi-file-earmark-text-fill",
        "title": "3.3.1 — Invoice Creation & Management",
        "subtitle": "Create, send, and track professional invoices. Manage templates, taxes, and multi-currency billing.",
        "label": "",
        "value": "",
        "description": "",
        "badge": {
          "text": "Overdue",
          "className": "pm-badge pm-badge-danger",
          "iconClass": "",
          "style": ""
        },
        "lines": [
          "All Invoices",
          "Drafts (2)",
          "Unpaid (5)"
        ],
        "items": [],
        "quickActions": [],
        "actions": [
          {
            "label": "Templates",
            "showLabel": true,
            "iconClass": "bi bi-palette",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_invoiceTemplatesModal"
          },
          {
            "label": "Create Invoice",
            "showLabel": true,
            "iconClass": "bi bi-plus-lg",
            "variantClass": "pm-btn pm-btn-sm pm-btn-primary",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_newInvoiceModal"
          }
        ],
        "table": {
          "columns": [
            "Invoice #",
            "Client",
            "Date",
            "Due Date",
            "Amount",
            "Status",
            "Actions"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "INV-2025-042",
                  "strong": true,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Nairobi Tech Ltd",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "10 Jun 2025",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "24 Jun 2025",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 85,000",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "badge": {
                    "text": "Overdue",
                    "className": "pm-badge pm-badge-danger",
                    "iconClass": "",
                    "style": ""
                  }
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "actions": [
                    {
                      "label": "View",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "open",
                      "message": "",
                      "disabled": false,
                      "target": "p33_invoiceDetailModal"
                    },
                    {
                      "label": "Action",
                      "showLabel": false,
                      "iconClass": "bi bi-send",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "open",
                      "message": "",
                      "disabled": false,
                      "target": "p33_sendInvoiceModal"
                    }
                  ]
                }
              ],
              "filterKey": "unpaid"
            },
            {
              "cells": [
                {
                  "text": "INV-2025-045",
                  "strong": true,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Amina Traders",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "20 Jun 2025",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "04 Jul 2025",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 32,500",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "badge": {
                    "text": "Sent",
                    "className": "pm-badge pm-badge-warning",
                    "iconClass": "",
                    "style": ""
                  }
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "actions": [
                    {
                      "label": "View",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "open",
                      "message": "",
                      "disabled": false,
                      "target": "p33_invoiceDetailModal"
                    },
                    {
                      "label": "Action",
                      "showLabel": false,
                      "iconClass": "bi bi-cash",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "open",
                      "message": "",
                      "disabled": false,
                      "target": "p33_recordPaymentModal"
                    }
                  ]
                }
              ],
              "filterKey": "unpaid"
            },
            {
              "cells": [
                {
                  "text": "INV-2025-041",
                  "strong": true,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Coast Logistics",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "05 Jun 2025",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "19 Jun 2025",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 140,000",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "badge": {
                    "text": "Paid",
                    "className": "pm-badge pm-badge-success",
                    "iconClass": "",
                    "style": ""
                  }
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "actions": [
                    {
                      "label": "View",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "open",
                      "message": "",
                      "disabled": false,
                      "target": "p33_invoiceDetailModal"
                    }
                  ]
                }
              ],
              "filterKey": "paid"
            },
            {
              "cells": [
                {
                  "text": "INV-2025-046",
                  "strong": true,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Rift Valley Farms",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "27 Jun 2025",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "—",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 18,000",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "badge": {
                    "text": "Draft",
                    "className": "pm-badge pm-badge-gray",
                    "iconClass": "",
                    "style": ""
                  }
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "actions": [
                    {
                      "label": "Edit",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "open",
                      "message": "",
                      "disabled": false,
                      "target": "p33_newInvoiceModal"
                    }
                  ]
                }
              ],
              "filterKey": "draft"
            },
            {
              "cells": [
                {
                  "text": "INV-2025-047",
                  "strong": true,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Global Exporters (USD)",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "26 Jun 2025",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "26 Jul 2025",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "$ 1,200",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "badge": {
                    "text": "Viewed",
                    "className": "pm-badge pm-badge-info",
                    "iconClass": "",
                    "style": ""
                  }
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "actions": [
                    {
                      "label": "View",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "open",
                      "message": "",
                      "disabled": false,
                      "target": "p33_invoiceDetailModal"
                    }
                  ]
                }
              ],
              "filterKey": "unpaid"
            }
          ]
        },
        "chart": [],
        "children": [],
        "tabs": [
          {
            "key": "all",
            "label": "All Invoices"
          },
          {
            "key": "draft",
            "label": "Drafts (2)"
          },
          {
            "key": "unpaid",
            "label": "Unpaid (5)"
          },
          {
            "key": "paid",
            "label": "Paid"
          }
        ],
        "action": null
      }
    ]
  },
  {
    "id": "block-4",
    "wrapperClass": "row g-3",
    "cards": [
      {
        "id": "3-3-2-payment-links-checkout",
        "columnClass": "col-12",
        "cardClass": "pm-card",
        "style": "",
        "iconClass": "bi bi-link-45deg",
        "title": "3.3.2 — Payment Links & Checkout",
        "subtitle": "Generate branded payment links, track views and conversions, and accept M-Pesa or Cards instantly.",
        "label": "Generate branded payment links, track views and conversions, and accept M-Pesa or Cards instantly.",
        "value": "68.4%",
        "description": "",
        "badge": {
          "text": "Active",
          "className": "pm-badge pm-badge-success",
          "iconClass": "",
          "style": ""
        },
        "lines": [
          "Avg. Conversion Rate"
        ],
        "items": [],
        "quickActions": [],
        "actions": [
          {
            "label": "Create Link",
            "showLabel": true,
            "iconClass": "bi bi-plus-lg",
            "variantClass": "pm-btn pm-btn-sm pm-btn-accent",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_newPaymentLinkModal"
          }
        ],
        "table": null,
        "chart": [],
        "children": [
          {
            "id": "active-payment-links",
            "columnClass": "col-lg-8",
            "cardClass": "utility-block",
            "style": "",
            "iconClass": "",
            "title": "Active Payment Links",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": {
              "text": "Active",
              "className": "pm-badge pm-badge-success",
              "iconClass": "",
              "style": ""
            },
            "lines": [
              "pay.apexretail.co.ke/l/ret-01 · KES 50,000",
              "12",
              "views ·",
              "4",
              "paid",
              "pay.apexretail.co.ke/l/open-don · Any Amount",
              "84",
              "32"
            ],
            "items": [
              {
                "title": "Consulting Retainer",
                "subtitle": "pay.apexretail.co.ke/l/ret-01 · KES 50,000 12 views · 4 paid",
                "value": "",
                "iconClass": "",
                "iconContainerClass": "",
                "iconContainerStyle": "",
                "badge": {
                  "text": "Active",
                  "className": "pm-badge pm-badge-success",
                  "iconClass": "",
                  "style": ""
                },
                "action": {
                  "label": "Action",
                  "showLabel": false,
                  "iconClass": "bi bi-bar-chart",
                  "variantClass": "pm-btn pm-btn-sm",
                  "style": "",
                  "kind": "open",
                  "message": "",
                  "disabled": false,
                  "target": "p33_linkAnalyticsModal"
                }
              },
              {
                "title": "Open Donation / Harambee",
                "subtitle": "pay.apexretail.co.ke/l/open-don · Any Amount 84 views · 32 paid",
                "value": "",
                "iconClass": "",
                "iconContainerClass": "",
                "iconContainerStyle": "",
                "badge": {
                  "text": "Active",
                  "className": "pm-badge pm-badge-success",
                  "iconClass": "",
                  "style": ""
                },
                "action": {
                  "label": "Action",
                  "showLabel": false,
                  "iconClass": "bi bi-bar-chart",
                  "variantClass": "pm-btn pm-btn-sm",
                  "style": "",
                  "kind": "open",
                  "message": "",
                  "disabled": false,
                  "target": "p33_linkAnalyticsModal"
                }
              }
            ],
            "quickActions": [],
            "actions": [],
            "table": null,
            "chart": [],
            "children": [],
            "tabs": [],
            "action": null
          },
          {
            "id": "link-conversions",
            "columnClass": "col-lg-4",
            "cardClass": "utility-block text-center",
            "style": "",
            "iconClass": "",
            "title": "Link Conversions",
            "subtitle": "",
            "label": "Avg. Conversion Rate",
            "value": "68.4%",
            "description": "",
            "badge": null,
            "lines": [
              "1.2s",
              "LOAD TIME",
              "92",
              "TOTAL PAYMENTS"
            ],
            "items": [],
            "quickActions": [],
            "actions": [],
            "table": null,
            "chart": [],
            "children": [],
            "tabs": [],
            "action": null
          }
        ],
        "tabs": [],
        "action": null
      }
    ]
  },
  {
    "id": "block-5",
    "wrapperClass": "row g-3",
    "cards": [
      {
        "id": "3-3-3-collections-tracking-aging",
        "columnClass": "col-12",
        "cardClass": "pm-card",
        "style": "",
        "iconClass": "bi bi-graph-down",
        "title": "3.3.3 — Collections Tracking & Aging",
        "subtitle": "Monitor accounts receivable, Days Sales Outstanding (DSO), and automate your reminder sequences.",
        "label": "",
        "value": "",
        "description": "",
        "badge": {
          "text": "Promise: 30 Jun",
          "className": "pm-badge pm-badge-info",
          "iconClass": "",
          "style": ""
        },
        "lines": [],
        "items": [],
        "quickActions": [],
        "actions": [
          {
            "label": "Reminder Rules",
            "showLabel": true,
            "iconClass": "bi bi-bell",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_reminderSettingsModal"
          },
          {
            "label": "Send Batch Reminders",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm pm-btn-danger",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_bulkRemindersModal"
          }
        ],
        "table": null,
        "chart": [],
        "children": [
          {
            "id": "receivables-aging-breakdown",
            "columnClass": "col-lg-6",
            "cardClass": "utility-block",
            "style": "",
            "iconClass": "",
            "title": "Receivables Aging Breakdown",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": null,
            "lines": [
              "0-30 Days",
              "KES 220k",
              "31-60 Days",
              "KES 145k",
              "61-90 Days",
              "KES 85k",
              "90+ Days",
              "KES 32k"
            ],
            "items": [],
            "quickActions": [],
            "actions": [
              {
                "label": "View Full Aging Report",
                "showLabel": true,
                "iconClass": "",
                "variantClass": "pm-btn pm-btn-sm",
                "style": "",
                "kind": "open",
                "message": "",
                "disabled": false,
                "target": "p33_agingReportModal"
              }
            ],
            "table": null,
            "chart": [],
            "children": [],
            "tabs": [],
            "action": null
          },
          {
            "id": "active-escalations-promises-to-pay",
            "columnClass": "col-lg-6",
            "cardClass": "utility-block",
            "style": "",
            "iconClass": "",
            "title": "Active Escalations & Promises to Pay",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": {
              "text": "Promise: 30 Jun",
              "className": "pm-badge pm-badge-info",
              "iconClass": "",
              "style": ""
            },
            "lines": [],
            "items": [
              {
                "title": "Nairobi Tech Ltd",
                "subtitle": "14 days overdue · KES 85,000",
                "value": "",
                "iconClass": "",
                "iconContainerClass": "",
                "iconContainerStyle": "",
                "badge": {
                  "text": "Promise: 30 Jun",
                  "className": "pm-badge pm-badge-info",
                  "iconClass": "",
                  "style": ""
                },
                "action": {
                  "label": "Resolve",
                  "showLabel": true,
                  "iconClass": "",
                  "variantClass": "pm-btn pm-btn-sm",
                  "style": "",
                  "kind": "open",
                  "message": "",
                  "disabled": false,
                  "target": "p33_recordPaymentModal"
                }
              },
              {
                "title": "Mwangi Hardware",
                "subtitle": "65 days overdue · KES 42,000",
                "value": "",
                "iconClass": "",
                "iconContainerClass": "",
                "iconContainerStyle": "",
                "badge": {
                  "text": "Escalated: Legal",
                  "className": "pm-badge pm-badge-warning",
                  "iconClass": "",
                  "style": ""
                },
                "action": {
                  "label": "View",
                  "showLabel": true,
                  "iconClass": "",
                  "variantClass": "pm-btn pm-btn-sm",
                  "style": "",
                  "kind": "open",
                  "message": "",
                  "disabled": false,
                  "target": "p33_attentionModal"
                }
              }
            ],
            "quickActions": [],
            "actions": [],
            "table": null,
            "chart": [],
            "children": [],
            "tabs": [],
            "action": null
          }
        ],
        "tabs": [],
        "action": null
      }
    ]
  },
  {
    "id": "block-6",
    "wrapperClass": "row g-3",
    "cards": [
      {
        "id": "3-3-4-subscription-recurring-billing",
        "columnClass": "col-12",
        "cardClass": "pm-card",
        "style": "",
        "iconClass": "bi bi-arrow-repeat",
        "title": "3.3.4 — Subscription & Recurring Billing",
        "subtitle": "Manage subscription plans, recurring invoices, customer upgrades, and dunning (failed payment retries).",
        "label": "",
        "value": "",
        "description": "",
        "badge": {
          "text": "Monthly",
          "className": "pm-badge pm-badge-gray",
          "iconClass": "",
          "style": ""
        },
        "lines": [],
        "items": [],
        "quickActions": [],
        "actions": [
          {
            "label": "Dunning Rules",
            "showLabel": true,
            "iconClass": "bi bi-shield-exclamation",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_dunningSettingsModal"
          },
          {
            "label": "New Subscription",
            "showLabel": true,
            "iconClass": "bi bi-plus-lg",
            "variantClass": "pm-btn pm-btn-sm pm-btn-info",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_newSubscriptionModal"
          }
        ],
        "table": {
          "columns": [
            "Subscriber",
            "Plan",
            "Status",
            "Next Billing",
            "MRR",
            "Actions"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Sarah Jenkins",
                  "strong": true,
                  "className": "",
                  "style": "",
                  "secondary": "s.jenkins@email.com"
                },
                {
                  "text": "Premium Plan",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "badge": {
                    "text": "Active",
                    "className": "pm-badge pm-badge-success",
                    "iconClass": "",
                    "style": ""
                  }
                },
                {
                  "text": "01 Jul 2025",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 5,000",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "actions": [
                    {
                      "label": "View",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "open",
                      "message": "",
                      "disabled": false,
                      "target": "p33_subscriptionDetailModal"
                    }
                  ]
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "Alpha Corp",
                  "strong": true,
                  "className": "",
                  "style": "",
                  "secondary": "finance@alpha.co.ke"
                },
                {
                  "text": "Enterprise",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "badge": {
                    "text": "Active",
                    "className": "pm-badge pm-badge-success",
                    "iconClass": "",
                    "style": ""
                  }
                },
                {
                  "text": "15 Aug 2025 (Annual)",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 3,750",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "actions": [
                    {
                      "label": "View",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "open",
                      "message": "",
                      "disabled": false,
                      "target": "p33_subscriptionDetailModal"
                    }
                  ]
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "James Mwangi",
                  "strong": true,
                  "className": "",
                  "style": "",
                  "secondary": "j.mwangi@email.com"
                },
                {
                  "text": "Basic Plan",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "badge": {
                    "text": "Past Due",
                    "className": "pm-badge pm-badge-warning",
                    "iconClass": "",
                    "style": ""
                  }
                },
                {
                  "text": "Retrying (2/3)",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 1,500",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "actions": [
                    {
                      "label": "Dunning",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "open",
                      "message": "",
                      "disabled": false,
                      "target": "p33_dunningSettingsModal"
                    }
                  ]
                }
              ],
              "filterKey": ""
            }
          ]
        },
        "chart": [],
        "children": [
          {
            "id": "card",
            "columnClass": "col-md-4",
            "cardClass": "p-3 border rounded",
            "style": "",
            "iconClass": "",
            "title": "",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": {
              "text": "Monthly",
              "className": "pm-badge pm-badge-gray",
              "iconClass": "",
              "style": ""
            },
            "lines": [
              "Basic Plan",
              "KES 1,500",
              "85 Active Subscribers"
            ],
            "items": [],
            "quickActions": [],
            "actions": [
              {
                "label": "Manage Plan",
                "showLabel": true,
                "iconClass": "",
                "variantClass": "pm-btn pm-btn-sm",
                "style": "",
                "kind": "open",
                "message": "",
                "disabled": false,
                "target": "p33_subscriptionDetailModal"
              }
            ],
            "table": null,
            "chart": [],
            "children": [],
            "tabs": [],
            "action": null
          },
          {
            "id": "card",
            "columnClass": "col-md-4",
            "cardClass": "p-3 border rounded",
            "style": "border-color:var(--pm-primary)!important;background:rgba(79,70,229,.02)",
            "iconClass": "",
            "title": "",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": {
              "text": "Monthly",
              "className": "pm-badge pm-badge-gray",
              "iconClass": "",
              "style": ""
            },
            "lines": [
              "Premium Plan",
              "KES 5,000",
              "32 Active Subscribers"
            ],
            "items": [],
            "quickActions": [],
            "actions": [
              {
                "label": "Manage Plan",
                "showLabel": true,
                "iconClass": "",
                "variantClass": "pm-btn pm-btn-sm pm-btn-primary",
                "style": "",
                "kind": "open",
                "message": "",
                "disabled": false,
                "target": "p33_subscriptionDetailModal"
              }
            ],
            "table": null,
            "chart": [],
            "children": [],
            "tabs": [],
            "action": null
          },
          {
            "id": "card",
            "columnClass": "col-md-4",
            "cardClass": "p-3 border rounded",
            "style": "",
            "iconClass": "",
            "title": "",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": {
              "text": "Annual",
              "className": "pm-badge pm-badge-gray",
              "iconClass": "",
              "style": ""
            },
            "lines": [
              "Enterprise",
              "KES 45,000",
              "7 Active Subscribers"
            ],
            "items": [],
            "quickActions": [],
            "actions": [
              {
                "label": "Manage Plan",
                "showLabel": true,
                "iconClass": "",
                "variantClass": "pm-btn pm-btn-sm",
                "style": "",
                "kind": "open",
                "message": "",
                "disabled": false,
                "target": "p33_subscriptionDetailModal"
              }
            ],
            "table": null,
            "chart": [],
            "children": [],
            "tabs": [],
            "action": null
          }
        ],
        "tabs": [],
        "action": null
      }
    ]
  }
] as UiPageBlock[];
  readonly modals: ModalConfig[] = [
  {
    "id": "p33_newInvoiceModal",
    "title": "Create New Invoice",
    "iconClass": "bi bi-receipt",
    "sizeClass": "modal-xl",
    "content": null,
    "steps": [
      {
        "label": "Client Details",
        "content": {
          "notes": [
            "Client Details"
          ],
          "alerts": [],
          "stats": [],
          "fields": [
            {
              "key": "select_client",
              "label": "Select Client",
              "type": "select",
              "value": "Select existing...",
              "placeholder": "",
              "options": [
                "Select existing...",
                "Nairobi Tech Ltd",
                "Amina Traders"
              ],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-md-8"
            },
            {
              "key": "currency",
              "label": "Currency",
              "type": "select",
              "value": "KES - Kenyan Shilling",
              "placeholder": "",
              "options": [
                "KES - Kenyan Shilling",
                "USD - US Dollar"
              ],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-md-4"
            },
            {
              "key": "invoice_date",
              "label": "Invoice Date",
              "type": "date",
              "value": "2025-06-27",
              "placeholder": "",
              "options": [],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-md-6"
            },
            {
              "key": "due_date",
              "label": "Due Date",
              "type": "date",
              "value": "2025-07-11",
              "placeholder": "",
              "options": [],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-md-6"
            }
          ],
          "details": [],
          "items": [],
          "tables": [],
          "actions": [
            {
              "label": "Action",
              "showLabel": false,
              "iconClass": "bi bi-person-plus",
              "variantClass": "pm-btn pm-btn-primary",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p33_customerSelectModal"
            }
          ],
          "image": null,
          "receipt": null
        }
      },
      {
        "label": "Line Items",
        "content": {
          "notes": [
            "Line Items",
            "Description",
            "Qty",
            "Unit Price",
            "Tax",
            "Amount",
            "VAT 16%",
            "Exempt"
          ],
          "alerts": [],
          "stats": [],
          "fields": [],
          "details": [
            {
              "label": "Subtotal",
              "value": "100,000"
            },
            {
              "label": "VAT (16%)",
              "value": "16,000"
            },
            {
              "label": "Total (KES)",
              "value": "116,000"
            }
          ],
          "items": [],
          "tables": [],
          "actions": [
            {
              "label": "Catalog",
              "showLabel": true,
              "iconClass": "bi bi-list",
              "variantClass": "pm-btn pm-btn-sm",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p33_itemCatalogModal"
            },
            {
              "label": "Add Item",
              "showLabel": true,
              "iconClass": "bi bi-plus",
              "variantClass": "pm-btn pm-btn-sm",
              "style": "",
              "kind": "notify",
              "message": "Add Item selected.",
              "disabled": false
            }
          ],
          "image": null,
          "receipt": null
        }
      },
      {
        "label": "Settings & Attachments",
        "content": {
          "notes": [
            "Settings & Attachments"
          ],
          "alerts": [],
          "stats": [],
          "fields": [
            {
              "key": "notes_terms",
              "label": "Notes / Terms",
              "type": "textarea",
              "value": "Payment due within 14 days. Late payments subject to 2% penalty.",
              "placeholder": "",
              "options": [],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-12"
            },
            {
              "key": "attach_pdf_payment_link_via_paymo_checkout",
              "label": "Attach PDF Payment Link via PayMo Checkout",
              "type": "checkbox",
              "value": "",
              "placeholder": "",
              "options": [],
              "style": "",
              "checked": true,
              "disabled": false,
              "columnClass": "col-12"
            },
            {
              "key": "enable_automated_email_reminders",
              "label": "Enable automated email reminders",
              "type": "checkbox",
              "value": "",
              "placeholder": "",
              "options": [],
              "style": "",
              "checked": true,
              "disabled": false,
              "columnClass": "col-12"
            },
            {
              "key": "attachments_po_timesheet",
              "label": "Attachments (PO, Timesheet)",
              "type": "file",
              "value": "",
              "placeholder": "",
              "options": [],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-12"
            }
          ],
          "details": [],
          "items": [],
          "tables": [],
          "actions": [],
          "image": null,
          "receipt": null
        }
      },
      {
        "label": "Invoice Ready",
        "content": {
          "notes": [],
          "alerts": [],
          "stats": [],
          "fields": [],
          "details": [],
          "items": [],
          "tables": [],
          "actions": [
            {
              "label": "Send Now",
              "showLabel": true,
              "iconClass": "bi bi-send",
              "variantClass": "pm-btn pm-btn-sm",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p33_sendInvoiceModal"
            },
            {
              "label": "Preview",
              "showLabel": true,
              "iconClass": "bi bi-eye",
              "variantClass": "pm-btn pm-btn-sm",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p33_invoiceDetailModal"
            }
          ],
          "image": null,
          "receipt": {
            "title": "Invoice Ready",
            "description": "INV-2025-048 for KES 116,000 has been created.",
            "iconClass": "bi bi-check-lg"
          }
        }
      }
    ],
    "tabs": [],
    "actions": [
      {
        "label": "Cancel",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Cancel selected.",
        "disabled": false,
        "target": "p33_newInvoiceModal"
      },
      {
        "label": "Next",
        "showLabel": true,
        "iconClass": "bi bi-arrow-right",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "next",
        "message": "Next completed.",
        "disabled": false,
        "target": "p33_newInvoiceModal",
        "stepLabels": [
          "Continue",
          "Continue",
          "Continue",
          "Done"
        ]
      }
    ]
  },
  {
    "id": "p33_newPaymentLinkModal",
    "title": "Create Payment Link",
    "iconClass": "bi bi-link-45deg",
    "sizeClass": "",
    "content": {
      "notes": [],
      "alerts": [],
      "stats": [],
      "fields": [
        {
          "key": "link_title_purpose",
          "label": "Link Title / Purpose",
          "type": "text",
          "value": "",
          "placeholder": "e.g. Deposit for Project X",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "amount_type",
          "label": "Amount Type",
          "type": "select",
          "value": "Fixed Amount",
          "placeholder": "",
          "options": [
            "Fixed Amount",
            "Customer decides (Donation/Open)"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "amount_kes",
          "label": "Amount (KES)",
          "type": "number",
          "value": "10000",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "collect_customer_shipping_address",
          "label": "Collect customer shipping address",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": true,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "limit_number_of_uses",
          "label": "Limit number of uses",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        }
      ],
      "details": [],
      "items": [],
      "tables": [],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Cancel",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Cancel selected.",
        "disabled": false,
        "target": "p33_newPaymentLinkModal"
      },
      {
        "label": "Generate Link",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Payment Link Created!",
        "disabled": false,
        "target": "p33_newPaymentLinkModal",
        "reference": "pay.apex.co.ke/l/dep-10k",
        "nextTarget": "p33_paymentLinkShareModal"
      }
    ]
  },
  {
    "id": "p33_newSubscriptionModal",
    "title": "New Subscription",
    "iconClass": "bi bi-arrow-repeat",
    "sizeClass": "",
    "content": {
      "notes": [],
      "alerts": [],
      "stats": [],
      "fields": [
        {
          "key": "customer",
          "label": "Customer",
          "type": "select",
          "value": "Select Customer...",
          "placeholder": "",
          "options": [
            "Select Customer...",
            "Nairobi Tech Ltd"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "select_plan",
          "label": "Select Plan",
          "type": "select",
          "value": "Basic Plan - KES 1,500/mo",
          "placeholder": "",
          "options": [
            "Basic Plan - KES 1,500/mo",
            "Premium Plan - KES 5,000/mo",
            "Enterprise - KES 45,000/yr"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "billing_cycle_anchor",
          "label": "Billing Cycle Anchor",
          "type": "select",
          "value": "Start immediately (Today)",
          "placeholder": "",
          "options": [
            "Start immediately (Today)",
            "1st of the month",
            "Custom date"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "add_14_day_free_trial",
          "label": "Add 14-day free trial",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": true,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "send_initial_payment_link_via_email",
          "label": "Send initial payment link via email",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": true,
          "disabled": false,
          "columnClass": "col-12"
        }
      ],
      "details": [],
      "items": [],
      "tables": [],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Cancel",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Cancel selected.",
        "disabled": false,
        "target": "p33_newSubscriptionModal"
      },
      {
        "label": "Start Subscription",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Subscription activated and payment link sent.",
        "disabled": false,
        "target": "p33_newSubscriptionModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p33_invoiceDetailModal",
    "title": "Invoice #INV-2025-042",
    "iconClass": "",
    "sizeClass": "modal-lg",
    "content": null,
    "steps": [],
    "tabs": [
      {
        "id": "invDetail-preview",
        "label": "Preview",
        "content": {
          "notes": [
            "Nairobi, Kenya PIN: P051***49G",
            "INVOICE",
            "Apex Retail Ltd.",
            "Nairobi, Kenya",
            "PIN: P051***49G",
            "INV-2025-042",
            "Overdue",
            "Billed To:",
            "Nairobi Tech Ltd",
            "Westlands, Nairobi",
            "Date:",
            "10 Jun 2025",
            "Due:",
            "24 Jun 2025",
            "Total: KES 85,000"
          ],
          "alerts": [],
          "stats": [],
          "fields": [],
          "details": [],
          "items": [],
          "tables": [
            {
              "columns": [
                "Description",
                "Amount"
              ],
              "rows": [
                {
                  "cells": [
                    {
                      "text": "Software Licenses",
                      "strong": false,
                      "className": "",
                      "style": ""
                    },
                    {
                      "text": "KES 85,000",
                      "strong": false,
                      "className": "",
                      "style": ""
                    }
                  ],
                  "filterKey": ""
                }
              ]
            }
          ],
          "actions": [],
          "image": null,
          "receipt": null
        }
      },
      {
        "id": "invDetail-history",
        "label": "Timeline",
        "content": {
          "notes": [
            "By Sarah A.",
            "10 Jun, 09:00",
            "Delivered to accounts@nairobits.com",
            "10 Jun, 09:02",
            "Via Payment Link",
            "11 Jun, 14:30",
            "3 days before due",
            "21 Jun, 08:00"
          ],
          "alerts": [],
          "stats": [],
          "fields": [],
          "details": [],
          "items": [
            {
              "title": "Invoice Created",
              "subtitle": "By Sarah A. 10 Jun, 09:00",
              "value": "",
              "iconClass": "",
              "iconContainerClass": "",
              "iconContainerStyle": "",
              "badge": null
            },
            {
              "title": "Emailed to client",
              "subtitle": "Delivered to accounts@nairobits.com 10 Jun, 09:02",
              "value": "",
              "iconClass": "",
              "iconContainerClass": "",
              "iconContainerStyle": "",
              "badge": null
            },
            {
              "title": "Viewed by client",
              "subtitle": "Via Payment Link 11 Jun, 14:30",
              "value": "",
              "iconClass": "",
              "iconContainerClass": "",
              "iconContainerStyle": "",
              "badge": null
            },
            {
              "title": "Auto-Reminder Sent",
              "subtitle": "3 days before due 21 Jun, 08:00",
              "value": "",
              "iconClass": "",
              "iconContainerClass": "",
              "iconContainerStyle": "",
              "badge": null
            }
          ],
          "tables": [],
          "actions": [],
          "image": null,
          "receipt": null
        }
      }
    ],
    "actions": [
      {
        "label": "Remind",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-danger",
        "style": "",
        "kind": "open",
        "message": "",
        "disabled": false,
        "target": "p33_bulkRemindersModal"
      },
      {
        "label": "Record Payment",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-success",
        "style": "",
        "kind": "open",
        "message": "",
        "disabled": false,
        "target": "p33_recordPaymentModal"
      },
      {
        "label": "Share Link",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "open",
        "message": "",
        "disabled": false,
        "target": "p33_sendInvoiceModal"
      }
    ]
  },
  {
    "id": "p33_linkAnalyticsModal",
    "title": "Link Analytics: Consulting Retainer",
    "iconClass": "bi bi-bar-chart",
    "sizeClass": "",
    "content": {
      "notes": [
        "Recent Activity",
        "12",
        "VIEWS",
        "4",
        "PAYMENTS",
        "33%",
        "CONVERSION"
      ],
      "alerts": [
        {
          "text": "Total Revenue Generated KES 200,000 Avg Time to Pay 45 mins",
          "tone": "info"
        }
      ],
      "stats": [],
      "fields": [],
      "details": [
        {
          "label": "Total Revenue Generated",
          "value": "KES 200,000"
        },
        {
          "label": "Avg Time to Pay",
          "value": "45 mins"
        }
      ],
      "items": [
        {
          "title": "Payment via M-Pesa (0712***890)",
          "subtitle": null,
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": {
            "text": "KES 50k",
            "className": "pm-badge pm-badge-success",
            "iconClass": "",
            "style": ""
          }
        },
        {
          "title": "Link viewed (Mobile Safari)",
          "subtitle": "2 hrs ago",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": null
        }
      ],
      "tables": [],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Close",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Close selected.",
        "disabled": false,
        "target": "p33_linkAnalyticsModal"
      },
      {
        "label": "Share Link Again",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "open",
        "message": "",
        "disabled": false,
        "target": "p33_paymentLinkShareModal"
      }
    ]
  },
  {
    "id": "p33_reminderSettingsModal",
    "title": "Automated Reminders",
    "iconClass": "bi bi-bell",
    "sizeClass": "",
    "content": {
      "notes": [
        "Before Due Date",
        "3 days before",
        "On Due Date",
        "Morning of due date",
        "Overdue Reminders",
        "3, 7, and 14 days after"
      ],
      "alerts": [],
      "stats": [],
      "fields": [
        {
          "key": "enable_auto_reminders",
          "label": "Enable Auto-Reminders",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": true,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "channels",
          "label": "Channels",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": true,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "email",
          "label": "Email",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": true,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "sms",
          "label": "SMS",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": true,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "whatsapp",
          "label": "WhatsApp",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        }
      ],
      "details": [],
      "items": [],
      "tables": [],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Cancel",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Cancel selected.",
        "disabled": false,
        "target": "p33_reminderSettingsModal"
      },
      {
        "label": "Save Settings",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Reminder settings saved.",
        "disabled": false,
        "target": "p33_reminderSettingsModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p33_subscriptionDetailModal",
    "title": "Manage Premium Plan",
    "iconClass": "bi bi-arrow-repeat",
    "sizeClass": "",
    "content": {
      "notes": [
        "KES 5,000",
        "per month",
        "Active"
      ],
      "alerts": [],
      "stats": [],
      "fields": [],
      "details": [
        {
          "label": "Active Subscribers",
          "value": "32"
        },
        {
          "label": "MRR",
          "value": "KES 160,000"
        },
        {
          "label": "Churn Rate",
          "value": "1.2%"
        }
      ],
      "items": [],
      "tables": [],
      "actions": [
        {
          "label": "Add Subscriber to Plan",
          "showLabel": true,
          "iconClass": "",
          "variantClass": "pm-btn",
          "style": "",
          "kind": "open",
          "message": "",
          "disabled": false,
          "target": "p33_newSubscriptionModal"
        },
        {
          "label": "Edit Retry Logic (Dunning)",
          "showLabel": true,
          "iconClass": "",
          "variantClass": "pm-btn",
          "style": "",
          "kind": "open",
          "message": "",
          "disabled": false,
          "target": "p33_dunningSettingsModal"
        },
        {
          "label": "Archive Plan",
          "showLabel": true,
          "iconClass": "",
          "variantClass": "pm-btn",
          "style": "",
          "kind": "open",
          "message": "",
          "disabled": false,
          "target": "p33_cancelSubscriptionModal"
        }
      ],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Close",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Close selected.",
        "disabled": false,
        "target": "p33_subscriptionDetailModal"
      }
    ]
  },
  {
    "id": "p33_recordPaymentModal",
    "title": "Record Manual Payment",
    "iconClass": "bi bi-cash",
    "sizeClass": "",
    "content": {
      "notes": [],
      "alerts": [],
      "stats": [],
      "fields": [
        {
          "key": "invoice",
          "label": "Invoice",
          "type": "select",
          "value": "INV-2025-042 (KES 85,000)",
          "placeholder": "",
          "options": [
            "INV-2025-042 (KES 85,000)",
            "INV-2025-045 (KES 32,500)"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "amount_paid",
          "label": "Amount Paid",
          "type": "number",
          "value": "85000",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "payment_date",
          "label": "Payment Date",
          "type": "date",
          "value": "2025-06-27",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "payment_method",
          "label": "Payment Method",
          "type": "select",
          "value": "Bank Transfer / RTGS",
          "placeholder": "",
          "options": [
            "Bank Transfer / RTGS",
            "Cash",
            "Cheque",
            "M-Pesa (External)"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "reference_notes",
          "label": "Reference / Notes",
          "type": "text",
          "value": "",
          "placeholder": "e.g. Cheque #12345",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "send_thank_you_receipt_to_customer",
          "label": "Send \"Thank You\" receipt to customer",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": true,
          "disabled": false,
          "columnClass": "col-12"
        }
      ],
      "details": [],
      "items": [],
      "tables": [],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Cancel",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Cancel selected.",
        "disabled": false,
        "target": "p33_recordPaymentModal"
      },
      {
        "label": "Record Payment",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Payment recorded successfully. Invoice marked as Paid.",
        "disabled": false,
        "target": "p33_recordPaymentModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p33_sendInvoiceModal",
    "title": "Send Invoice",
    "iconClass": "bi bi-send",
    "sizeClass": "",
    "content": {
      "notes": [
        "Sending INV-2025-042 to Nairobi Tech Ltd.",
        "Sending",
        "INV-2025-042",
        "to Nairobi Tech Ltd."
      ],
      "alerts": [],
      "stats": [],
      "fields": [
        {
          "key": "channels",
          "label": "Channels",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": true,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "email_accounts_nairobits_com",
          "label": "Email (accounts@nairobits.com)",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": true,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "whatsapp_254_711_222_333",
          "label": "WhatsApp (+254 711 222 333)",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "sms_link",
          "label": "SMS Link",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "message_template",
          "label": "Message Template",
          "type": "textarea",
          "value": "Hi Team, attached is invoice INV-2025-042 for KES 85,000. You can pay securely online via the attached link. Thank you!",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "attach_pdf_copy",
          "label": "Attach PDF copy",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": true,
          "disabled": false,
          "columnClass": "col-12"
        }
      ],
      "details": [],
      "items": [],
      "tables": [],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Cancel",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Cancel selected.",
        "disabled": false,
        "target": "p33_sendInvoiceModal"
      },
      {
        "label": "Send Invoice",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Invoice sent via selected channels.",
        "disabled": false,
        "target": "p33_sendInvoiceModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p33_creditNoteModal",
    "title": "Issue Credit Note",
    "iconClass": "bi bi-file-earmark-minus",
    "sizeClass": "",
    "content": {
      "notes": [],
      "alerts": [],
      "stats": [],
      "fields": [
        {
          "key": "against_invoice",
          "label": "Against Invoice",
          "type": "select",
          "value": "INV-2025-042 (Nairobi Tech Ltd)",
          "placeholder": "",
          "options": [
            "INV-2025-042 (Nairobi Tech Ltd)",
            "INV-2025-041 (Coast Logistics)"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "credit_amount_kes",
          "label": "Credit Amount (KES)",
          "type": "number",
          "value": "",
          "placeholder": "Enter amount to refund/credit",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "reason",
          "label": "Reason",
          "type": "select",
          "value": "Overcharged",
          "placeholder": "",
          "options": [
            "Overcharged",
            "Items returned",
            "Discount applied late",
            "Other"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "email_credit_note_to_client",
          "label": "Email credit note to client",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": true,
          "disabled": false,
          "columnClass": "col-12"
        }
      ],
      "details": [],
      "items": [],
      "tables": [],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Cancel",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Cancel selected.",
        "disabled": false,
        "target": "p33_creditNoteModal"
      },
      {
        "label": "Issue Credit Note",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Credit note CN-2025-001 issued successfully.",
        "disabled": false,
        "target": "p33_creditNoteModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p33_dunningSettingsModal",
    "title": "Dunning (Retry) Rules",
    "iconClass": "bi bi-shield-exclamation",
    "sizeClass": "",
    "content": {
      "notes": [
        "What happens when a recurring subscription card or token fails?",
        "First Retry",
        "1 Day later",
        "Send email",
        "Second Retry",
        "3 Days later",
        "Send email + SMS",
        "Third Retry",
        "7 Days later",
        "Final warning"
      ],
      "alerts": [],
      "stats": [],
      "fields": [
        {
          "key": "action_after_final_failure",
          "label": "Action after final failure",
          "type": "select",
          "value": "Cancel subscription automatically",
          "placeholder": "",
          "options": [
            "Cancel subscription automatically",
            "Pause subscription and notify admin",
            "Leave active but mark unpaid"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        }
      ],
      "details": [],
      "items": [],
      "tables": [],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Cancel",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Cancel selected.",
        "disabled": false,
        "target": "p33_dunningSettingsModal"
      },
      {
        "label": "Save Logic",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Dunning schedule updated.",
        "disabled": false,
        "target": "p33_dunningSettingsModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p33_customerSelectModal",
    "title": "Customer Directory",
    "iconClass": "bi bi-people",
    "sizeClass": "",
    "content": {
      "notes": [],
      "alerts": [],
      "stats": [],
      "fields": [],
      "details": [],
      "items": [
        {
          "title": "Nairobi Tech Ltd",
          "subtitle": "info@nairobits.com",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": null,
          "action": {
            "label": "Select",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "notify",
            "message": "Select selected.",
            "disabled": false
          }
        },
        {
          "title": "Amina Traders",
          "subtitle": "sales@amina.co.ke",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": null,
          "action": {
            "label": "Select",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "notify",
            "message": "Select selected.",
            "disabled": false
          }
        },
        {
          "title": "Coast Logistics",
          "subtitle": "accounts@coastlog.com",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": null,
          "action": {
            "label": "Select",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "notify",
            "message": "Select selected.",
            "disabled": false
          }
        }
      ],
      "tables": [],
      "actions": [
        {
          "label": "Add New Customer",
          "showLabel": true,
          "iconClass": "bi bi-plus",
          "variantClass": "pm-btn pm-btn-accent",
          "style": "",
          "kind": "notify",
          "message": "Add New Customer selected.",
          "disabled": false
        }
      ],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Close",
        "iconClass": "",
        "variantClass": "pm-btn",
        "kind": "close",
        "target": "p33_customerSelectModal",
        "message": "",
        "disabled": false
      }
    ]
  },
  {
    "id": "p33_itemCatalogModal",
    "title": "Product/Service Catalog",
    "iconClass": "bi bi-list",
    "sizeClass": "",
    "content": {
      "notes": [],
      "alerts": [],
      "stats": [],
      "fields": [],
      "details": [],
      "items": [
        {
          "title": "Consulting Hour",
          "subtitle": "KES 5,000 / hr",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": null,
          "action": {
            "label": "Add",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "notify",
            "message": "Add selected.",
            "disabled": false
          }
        },
        {
          "title": "Software License (Monthly)",
          "subtitle": "KES 12,000 / unit",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": null,
          "action": {
            "label": "Add",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "notify",
            "message": "Add selected.",
            "disabled": false
          }
        },
        {
          "title": "Setup Fee",
          "subtitle": "KES 25,000 / flat",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": null,
          "action": {
            "label": "Add",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "notify",
            "message": "Add selected.",
            "disabled": false
          }
        }
      ],
      "tables": [],
      "actions": [
        {
          "label": "Create New Item",
          "showLabel": true,
          "iconClass": "bi bi-plus",
          "variantClass": "pm-btn pm-btn-primary",
          "style": "",
          "kind": "notify",
          "message": "Create New Item selected.",
          "disabled": false
        }
      ],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Close",
        "iconClass": "",
        "variantClass": "pm-btn",
        "kind": "close",
        "target": "p33_itemCatalogModal",
        "message": "",
        "disabled": false
      }
    ]
  },
  {
    "id": "p33_agingReportModal",
    "title": "A/R Aging Report",
    "iconClass": "bi bi-graph-down",
    "sizeClass": "modal-lg",
    "content": {
      "notes": [],
      "alerts": [],
      "stats": [],
      "fields": [],
      "details": [],
      "items": [],
      "tables": [
        {
          "columns": [
            "Customer",
            "0-30 Days",
            "31-60 Days",
            "61-90 Days",
            "90+ Days",
            "Total Due"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Nairobi Tech Ltd",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "-",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "-",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 85,000",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "-",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 85,000",
                  "strong": true,
                  "className": "",
                  "style": ""
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "Amina Traders",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 32,500",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "-",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "-",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "-",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 32,500",
                  "strong": true,
                  "className": "",
                  "style": ""
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "Mwangi Hardware",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "-",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "-",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "-",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 42,000",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 42,000",
                  "strong": true,
                  "className": "",
                  "style": ""
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "TOTALS",
                  "strong": true,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 220k",
                  "strong": true,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 145k",
                  "strong": true,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 85k",
                  "strong": true,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 32k",
                  "strong": true,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 482,000",
                  "strong": true,
                  "className": "",
                  "style": ""
                }
              ],
              "filterKey": ""
            }
          ]
        }
      ],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Close",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Close selected.",
        "disabled": false,
        "target": "p33_agingReportModal"
      },
      {
        "label": "Export CSV",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "open",
        "message": "",
        "disabled": false,
        "target": "p33_exportBillingModal"
      }
    ]
  },
  {
    "id": "p33_invoiceTemplatesModal",
    "title": "Invoice Templates",
    "iconClass": "bi bi-palette",
    "sizeClass": "",
    "content": {
      "notes": [
        "Active Default",
        "Clean B&W",
        "With Watermark"
      ],
      "alerts": [
        {
          "text": "Modern Active Default",
          "tone": "info"
        }
      ],
      "stats": [
        {
          "label": "",
          "value": "Modern",
          "className": "p-3 border rounded text-center"
        },
        {
          "label": "",
          "value": "Classic",
          "className": "p-3 border rounded text-center"
        },
        {
          "label": "",
          "value": "Corporate",
          "className": "p-3 border rounded text-center"
        }
      ],
      "fields": [
        {
          "key": "brand_color",
          "label": "Brand Color",
          "type": "color",
          "value": "#4F46E5",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "logo",
          "label": "Logo",
          "type": "file",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        }
      ],
      "details": [],
      "items": [],
      "tables": [],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Cancel",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Cancel selected.",
        "disabled": false,
        "target": "p33_invoiceTemplatesModal"
      },
      {
        "label": "Save Template",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Template preferences saved!",
        "disabled": false,
        "target": "p33_invoiceTemplatesModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p33_cancelSubscriptionModal",
    "title": "Archive/Cancel Plan",
    "iconClass": "bi bi-x-circle",
    "sizeClass": "",
    "content": {
      "notes": [
        "You are about to archive the Premium Plan . Existing subscribers will not be renewed at the end of their current cycle.",
        "You are about to archive the",
        "Premium Plan",
        ". Existing subscribers will not be renewed at the end of their current cycle."
      ],
      "alerts": [],
      "stats": [],
      "fields": [
        {
          "key": "reason",
          "label": "Reason",
          "type": "select",
          "value": "Plan deprecated/replaced",
          "placeholder": "",
          "options": [
            "Plan deprecated/replaced",
            "Pricing update",
            "Temporary pause"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "email_notification_to_all_32_active_subscribers",
          "label": "Email notification to all 32 active subscribers",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": true,
          "disabled": false,
          "columnClass": "col-12"
        }
      ],
      "details": [],
      "items": [],
      "tables": [],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Cancel",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Cancel selected.",
        "disabled": false,
        "target": "p33_cancelSubscriptionModal"
      },
      {
        "label": "Confirm Archive",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-danger",
        "style": "",
        "kind": "process",
        "message": "Plan archived successfully.",
        "disabled": false,
        "target": "p33_cancelSubscriptionModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p33_duplicateInvoiceModal",
    "title": "Duplicate Invoice",
    "iconClass": "bi bi-copy",
    "sizeClass": "",
    "content": {
      "notes": [
        "Duplicate INV-2025-042 ?",
        "Duplicate",
        "INV-2025-042",
        "?"
      ],
      "alerts": [],
      "stats": [],
      "fields": [
        {
          "key": "new_client_optional",
          "label": "New Client (Optional)",
          "type": "select",
          "value": "Same as original (Nairobi Tech)",
          "placeholder": "",
          "options": [
            "Same as original (Nairobi Tech)",
            "Amina Traders"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "new_date",
          "label": "New Date",
          "type": "date",
          "value": "2025-06-27",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        }
      ],
      "details": [],
      "items": [],
      "tables": [],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Cancel",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Cancel selected.",
        "disabled": false,
        "target": "p33_duplicateInvoiceModal"
      },
      {
        "label": "Duplicate",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Invoice duplicated as Draft.",
        "disabled": false,
        "target": "p33_duplicateInvoiceModal",
        "reference": "",
        "nextTarget": "p33_newInvoiceModal"
      }
    ]
  },
  {
    "id": "p33_bulkRemindersModal",
    "title": "Send Batch Reminders",
    "iconClass": "bi bi-bell",
    "sizeClass": "",
    "content": {
      "notes": [
        "You are about to send reminders to",
        "5 clients",
        "with overdue invoices totaling KES 168,000."
      ],
      "alerts": [
        {
          "text": "You are about to send reminders to 5 clients with overdue invoices totaling KES 168,000.",
          "tone": "warning"
        }
      ],
      "stats": [],
      "fields": [
        {
          "key": "template",
          "label": "Template",
          "type": "select",
          "value": "Gentle Reminder (1-14 days)",
          "placeholder": "",
          "options": [
            "Gentle Reminder (1-14 days)",
            "Firm Reminder (15-30 days)",
            "Final Notice (30+ days)"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "send_via_email",
          "label": "Send via Email",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": true,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "send_via_sms_with_payment_link",
          "label": "Send via SMS (with payment link)",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": true,
          "disabled": false,
          "columnClass": "col-12"
        }
      ],
      "details": [],
      "items": [],
      "tables": [],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Cancel",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Cancel selected.",
        "disabled": false,
        "target": "p33_bulkRemindersModal"
      },
      {
        "label": "Send Batch",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-danger",
        "style": "",
        "kind": "process",
        "message": "5 Reminders sent successfully.",
        "disabled": false,
        "target": "p33_bulkRemindersModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p33_paymentLinkShareModal",
    "title": "Share Link",
    "iconClass": "bi bi-share",
    "sizeClass": "",
    "content": {
      "notes": [],
      "alerts": [],
      "stats": [],
      "fields": [],
      "details": [],
      "items": [],
      "tables": [],
      "actions": [
        {
          "label": "Copy",
          "showLabel": true,
          "iconClass": "bi bi-clipboard",
          "variantClass": "pm-btn pm-btn-primary",
          "style": "",
          "kind": "notify",
          "message": "Copy selected.",
          "disabled": false
        },
        {
          "label": "WhatsApp",
          "showLabel": true,
          "iconClass": "bi bi-whatsapp",
          "variantClass": "pm-btn pm-btn-success",
          "style": "",
          "kind": "notify",
          "message": "WhatsApp selected.",
          "disabled": false
        },
        {
          "label": "Email",
          "showLabel": true,
          "iconClass": "bi bi-envelope",
          "variantClass": "pm-btn",
          "style": "",
          "kind": "notify",
          "message": "Email selected.",
          "disabled": false
        }
      ],
      "image": {
        "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWAQMAAAAGz+OhAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABIUlEQVRIib2WTa6DMAyEjVhkyRE4Cher+LkZR+EIWWaBOp1xaJ946rKxhSLysbHG9hizL7GAsfeZr10ZdSk/Zw9ehh15Iijjqi8xbMA57D3guWzAFsmYS8Jq4YwyFIoRyVx74fFpt3q0ZbXXyCj8vf/ask+o1/4PVEPGXM5B6QBrOmY+McynedJJDWxOeMYw1x6aaVskP88oxlzgM41j4RPD+jzRSHimwxLqbP2aLTLnSVZ5eE9plCIYfaPH7jdA6aDEMJsENL9kNI0uiGkpaA+quIothtU4XYOi1pothFWfdHvsbrPVmNW9oP0r8K5HAKv7l+Hal6vHo1i2ax/JN+KYai7VuRe6IGbv/zqWX40WxK5ey7Roqj6nv3+BtuxLvADvTKnwGGpHsQAAAABJRU5ErkJggg==",
        "alt": "QR Code",
        "className": "mb-3 rounded border p-2",
        "style": ""
      },
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Close",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Close selected.",
        "disabled": false,
        "target": "p33_paymentLinkShareModal"
      }
    ]
  },
  {
    "id": "p33_exportBillingModal",
    "title": "Export Billing Data",
    "iconClass": "bi bi-download",
    "sizeClass": "",
    "content": {
      "notes": [],
      "alerts": [],
      "stats": [],
      "fields": [
        {
          "key": "data_set",
          "label": "Data Set",
          "type": "select",
          "value": "All Invoices",
          "placeholder": "",
          "options": [
            "All Invoices",
            "Aging Report",
            "Subscription MRR",
            "Payment Links"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "from",
          "label": "From",
          "type": "date",
          "value": "2025-01-01",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-6"
        },
        {
          "key": "to",
          "label": "To",
          "type": "date",
          "value": "2025-06-27",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-6"
        },
        {
          "key": "format",
          "label": "Format",
          "type": "select",
          "value": "CSV Spreadsheet",
          "placeholder": "",
          "options": [
            "CSV Spreadsheet",
            "Excel (.xlsx)",
            "PDF Report",
            "iTax Upload Format (KRA)"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        }
      ],
      "details": [],
      "items": [],
      "tables": [],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Cancel",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Cancel selected.",
        "disabled": false,
        "target": "p33_exportBillingModal"
      },
      {
        "label": "Generate File",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Export generated and downloading.",
        "disabled": false,
        "target": "p33_exportBillingModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p33_taxSettingsModal",
    "title": "Tax & Compliance Settings",
    "iconClass": "bi bi-calculator",
    "sizeClass": "",
    "content": {
      "notes": [],
      "alerts": [],
      "stats": [],
      "fields": [
        {
          "key": "value_added_tax_vat",
          "label": "Value Added Tax (VAT)",
          "type": "number",
          "value": "16",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "withholding_tax_wht",
          "label": "Withholding Tax (WHT)",
          "type": "number",
          "value": "5",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "kra_pin_display",
          "label": "KRA PIN Display",
          "type": "text",
          "value": "P051***49G",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "auto_calculate_vat_on_new_invoices",
          "label": "Auto-calculate VAT on new invoices",
          "type": "checkbox",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": true,
          "disabled": false,
          "columnClass": "col-12"
        }
      ],
      "details": [],
      "items": [],
      "tables": [],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Cancel",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Cancel selected.",
        "disabled": false,
        "target": "p33_taxSettingsModal"
      },
      {
        "label": "Save",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Tax settings updated to reflect KRA requirements.",
        "disabled": false,
        "target": "p33_taxSettingsModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p33_healthCheckModal",
    "title": "Billing Health Check",
    "iconClass": "bi bi-activity",
    "sizeClass": "",
    "content": {
      "notes": [
        "Recommendation: Implement early payment discounts to reduce the 60+ days aging bucket.",
        "A-",
        "SCORE",
        "82% Collection Rate",
        "28 Days DSO",
        "14% Aging > 60 days"
      ],
      "alerts": [
        {
          "text": "A- SCORE",
          "tone": "success"
        }
      ],
      "stats": [],
      "fields": [],
      "details": [],
      "items": [],
      "tables": [],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Close",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Close selected.",
        "disabled": false,
        "target": "p33_healthCheckModal"
      },
      {
        "label": "View Suggestions",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "open",
        "message": "",
        "disabled": false,
        "target": "p33_suggestionsModal"
      }
    ]
  },
  {
    "id": "p33_attentionModal",
    "title": "All Attention Items",
    "iconClass": "bi bi-exclamation-circle",
    "sizeClass": "modal-lg",
    "content": {
      "notes": [],
      "alerts": [],
      "stats": [],
      "fields": [],
      "details": [],
      "items": [
        {
          "title": "INV-2025-042 Overdue",
          "subtitle": "KES 85,000 (14 Days)",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": null,
          "action": {
            "label": "Remind",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm pm-btn-danger",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_bulkRemindersModal"
          }
        },
        {
          "title": "Subscription Failed",
          "subtitle": "James Mwangi - Basic Plan",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": null,
          "action": {
            "label": "Dunning",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_dunningSettingsModal"
          }
        },
        {
          "title": "Link Abandoned",
          "subtitle": "LNK-992 (KES 120,000)",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": null,
          "action": {
            "label": "Track",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_linkAnalyticsModal"
          }
        },
        {
          "title": "Mwangi Hardware Escalation",
          "subtitle": "KES 42,000 (65 Days Overdue)",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": null,
          "action": {
            "label": "Resolve",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_recordPaymentModal"
          }
        }
      ],
      "tables": [],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Close",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Close selected.",
        "disabled": false,
        "target": "p33_attentionModal"
      }
    ]
  },
  {
    "id": "p33_suggestionsModal",
    "title": "AI Suggestions",
    "iconClass": "bi bi-stars",
    "sizeClass": "",
    "content": {
      "notes": [],
      "alerts": [],
      "stats": [],
      "fields": [],
      "details": [],
      "items": [
        {
          "title": "Offer 2% Early Pay Discount",
          "subtitle": "To 3 clients > 60 days overdue to stimulate cashflow.",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": null,
          "action": {
            "label": "Apply",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm pm-btn-primary",
            "style": "",
            "kind": "process",
            "message": "Discount applied and updated invoices sent.",
            "disabled": false,
            "target": "p33_suggestionsModal",
            "reference": ""
          }
        },
        {
          "title": "Enable Auto-Reminders",
          "subtitle": "Reduce DSO by ~4 days historically.",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": null,
          "action": {
            "label": "Setup",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_reminderSettingsModal"
          }
        },
        {
          "title": "Switch Drafts to Links",
          "subtitle": "Send payment links via WhatsApp for 2x faster pay.",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": null,
          "action": {
            "label": "Generate",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p33_newPaymentLinkModal"
          }
        }
      ],
      "tables": [],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Close",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Close selected.",
        "disabled": false,
        "target": "p33_suggestionsModal"
      }
    ]
  },
  {
    "id": "p33_notificationsModal",
    "title": "Notifications (4)",
    "iconClass": "bi bi-bell",
    "sizeClass": "",
    "content": {
      "notes": [
        "Payment Received!",
        "Coast Logistics paid KES 140,000 for INV-2025-041.",
        "Link Viewed",
        "Global Exporters viewed their USD invoice.",
        "Overdue Alert",
        "INV-2025-042 is 14 days overdue.",
        "System Update",
        "New KRA VAT API integration is live."
      ],
      "alerts": [
        {
          "text": "Payment Received! Coast Logistics paid KES 140,000 for INV-2025-041.",
          "tone": "success"
        },
        {
          "text": "Link Viewed Global Exporters viewed their USD invoice.",
          "tone": "info"
        },
        {
          "text": "Overdue Alert INV-2025-042 is 14 days overdue.",
          "tone": "danger"
        },
        {
          "text": "System Update New KRA VAT API integration is live.",
          "tone": "warning"
        }
      ],
      "stats": [],
      "fields": [],
      "details": [],
      "items": [],
      "tables": [],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Mark All Read",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-sm",
        "style": "",
        "kind": "notify",
        "message": "Mark All Read selected.",
        "disabled": false
      },
      {
        "label": "Close",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Close selected.",
        "disabled": false,
        "target": "p33_notificationsModal"
      }
    ]
  },
  {
    "id": "p33_profileModal",
    "title": "Business Profile",
    "iconClass": "bi bi-building",
    "sizeClass": "",
    "content": {
      "notes": [
        "Apex Retail Ltd.",
        "KRA PIN: P051***49G · Nairobi, Kenya",
        "AP",
        "Role",
        "Finance Admin (Sarah A.)",
        "Active Users",
        "4 Users",
        "Subscription",
        "Enterprise",
        "Verification",
        "KYB Verified"
      ],
      "alerts": [],
      "stats": [],
      "fields": [],
      "details": [],
      "items": [],
      "tables": [],
      "actions": [],
      "image": null,
      "receipt": null
    },
    "steps": [],
    "tabs": [],
    "actions": [
      {
        "label": "Close",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Close selected.",
        "disabled": false,
        "target": "p33_profileModal"
      }
    ]
  }
] as ModalConfig[];


  private readonly document = inject(DOCUMENT);
  private readonly cdr = inject(ChangeDetectorRef);
  private operationTimer?: ReturnType<typeof setTimeout>;
  private completionTimer?: ReturnType<typeof setTimeout>;
  private toastTimer?: ReturnType<typeof setTimeout>;
  private returnFocus: HTMLElement | null = null;
  private readonly modalStack: string[] = [];
  private readonly steps: Record<string, number> = {};
  private readonly modalTabs: Record<string, string> = {};
  private readonly filters: Record<string, string> = {};
  readonly openModals = new Set<string>();
  toastMessage = '';
  operationState: OperationState = 'idle';
  operationMessage = '';

  trackById = (_: number, item: { id: string }): string => item.id;
  trackByIndex = (index: number): number => index;

  activeFilter(owner: string): string { return this.filters[owner] ?? 'all'; }
  setFilter(owner: string, key: string): void { this.filters[owner] = key; this.cdr.markForCheck(); }
  visibleRows(table: UiTable, owner: string): UiTableRow[] { const key=this.activeFilter(owner); return key==='all' ? table.rows : table.rows.filter(row => !row.filterKey || row.filterKey===key); }

  openModal(id: string): void {
    if (this.operationState !== 'idle') return;
    if (!this.modalStack.length) this.returnFocus = this.document.activeElement instanceof HTMLElement ? this.document.activeElement : null;
    this.removeFromStack(id); this.modalStack.push(id); this.openModals.add(id); this.steps[id]=1;
    const modal=this.modals.find(item=>item.id===id); if (modal?.tabs.length) this.modalTabs[id]=modal.tabs[0].id;
    this.setBodyLocked(true); this.cdr.markForCheck(); window.setTimeout(()=>this.document.getElementById(id)?.focus(),0);
  }
  closeModal(id: string): void { this.openModals.delete(id); this.removeFromStack(id); delete this.steps[id]; const parent=this.modalStack.at(-1); if(!parent){this.setBodyLocked(false);window.setTimeout(()=>this.returnFocus?.focus(),0);}else window.setTimeout(()=>this.document.getElementById(parent)?.focus(),0); this.cdr.markForCheck(); }
  isModalOpen(id: string): boolean { return this.modalStack.at(-1)===id; }
  hasOpenModal(): boolean { return this.modalStack.length>0; }
  @HostListener('document:keydown.escape') onEscape(): void { if(this.operationState!=='idle')return; const top=this.modalStack.at(-1); if(top)this.closeModal(top); }

  currentStep(modalId: string): number { return this.steps[modalId] ?? 1; }
  activeModalTab(modalId: string): string { return this.modalTabs[modalId] ?? ''; }
  setModalTab(modalId: string, tabId: string): void { this.modalTabs[modalId]=tabId; this.cdr.markForCheck(); }
  modalContent(modal: ModalConfig): ModalContent { if(modal.steps.length)return modal.steps[Math.min(this.currentStep(modal.id)-1,modal.steps.length-1)].content; if(modal.tabs.length)return modal.tabs.find(tab=>tab.id===this.activeModalTab(modal.id))?.content ?? modal.tabs[0].content; return modal.content ?? this.emptyContent(); }
  actionLabel(action: UiAction, contextModal?: string): string { if(action.kind==='next'&&contextModal&&action.stepLabels?.length)return action.stepLabels[Math.min(this.currentStep(contextModal)-1,action.stepLabels.length-1)] ?? action.label; return action.label; }

  handleAction(action: UiAction, contextModal=''): void {
    if(action.disabled)return;
    switch(action.kind){
      case 'open': if(action.target){this.openModal(action.target);if(action.replaceCurrent&&contextModal)this.closeModal(contextModal);} break;
      case 'close': this.closeModal(action.target||contextModal); break;
      case 'process': this.processAction(action.target||contextModal,action.message||action.label,action.reference||'',action.nextTarget); break;
      case 'next': this.nextModalStep(contextModal||action.target||'',action); break;
      default: this.notify(action.message||action.label);
    }
  }
  nextModalStep(modalId: string, action: UiAction): void { const modal=this.modals.find(item=>item.id===modalId); if(!modal?.steps.length)return; const current=this.currentStep(modalId); if(current>=modal.steps.length){this.processAction(modalId,action.message||modal.title,action.reference||'');return;} const advance=()=>{this.steps[modalId]=current+1;this.cdr.markForCheck();}; if(current===modal.steps.length-1)this.runLoader(advance);else advance(); }

  processAction(modalId: string, message: string, reference='', nextTarget?: string): void { if(this.operationState!=='idle')return; const finalMessage=reference?`${message} ${reference}`:message; this.operationMessage=finalMessage;this.operationState='loading';this.cdr.markForCheck();this.operationTimer=window.setTimeout(()=>{this.operationState='success';this.notify(finalMessage);this.cdr.markForCheck();this.completionTimer=window.setTimeout(()=>{this.operationState='idle';if(modalId)this.closeModal(modalId);if(nextTarget)this.openModal(nextTarget);this.cdr.markForCheck();},850);},950); }
  notify(message: string): void { this.toastMessage=message;if(this.toastTimer)clearTimeout(this.toastTimer);this.toastTimer=window.setTimeout(()=>{this.toastMessage='';this.cdr.markForCheck();},4200);this.cdr.markForCheck(); }
  clearToast(): void { this.toastMessage='';if(this.toastTimer)clearTimeout(this.toastTimer);this.cdr.markForCheck(); }
  updateField(field: UiField,event: Event): void { const input=event.target as HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement; if(field.type==='checkbox')field.checked=(input as HTMLInputElement).checked;else if(field.type!=='file')field.value=input.value; this.cdr.markForCheck(); }
  moveFocus(event: Event): void { const input=event.target as HTMLInputElement;if(input.value.length===1)(input.nextElementSibling as HTMLElement|null)?.focus(); }
  pinSlots(length=4): number[] { return Array.from({length},(_,index)=>index); }
  ngOnDestroy(): void { if(this.operationTimer)clearTimeout(this.operationTimer);if(this.completionTimer)clearTimeout(this.completionTimer);if(this.toastTimer)clearTimeout(this.toastTimer);this.setBodyLocked(false); }
  private runLoader(callback:()=>void): void { this.operationState='loading';this.cdr.markForCheck();this.operationTimer=window.setTimeout(()=>{this.operationState='idle';callback();this.cdr.markForCheck();},900); }
  private removeFromStack(id:string):void{const index=this.modalStack.lastIndexOf(id);if(index>=0)this.modalStack.splice(index,1);}
  private setBodyLocked(locked:boolean):void{this.document.body.style.overflow=locked?'hidden':'';}
  private emptyContent():ModalContent{return{notes:[],alerts:[],stats:[],fields:[],details:[],items:[],tables:[],actions:[],image:null,receipt:null};}

}
