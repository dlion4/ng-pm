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
  selector: 'app-business-command-center',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './business-command-center.html',
  styleUrl: './business-command-center.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class BusinessCommandCenterComponent implements OnDestroy {
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
      "label": "Command Center",
      "href": "",
      "action": {
        "label": "Command Center",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "",
        "kind": "notify",
        "message": "Command Center selected.",
        "disabled": false
      }
    }
  ],
  "title": "PAGE 3.1 — Business Command Center",
  "description": "Consolidated overview of collections, payroll, invoices, and business health.",
  "actions": [
    {
      "label": "Reports",
      "showLabel": true,
      "iconClass": "bi bi-file-earmark-bar-graph",
      "variantClass": "pm-btn",
      "style": "",
      "kind": "open",
      "message": "",
      "disabled": false,
      "target": "p31_consolidatedReportModal"
    },
    {
      "label": "Add User",
      "showLabel": true,
      "iconClass": "bi bi-person-plus",
      "variantClass": "pm-btn",
      "style": "",
      "kind": "open",
      "message": "",
      "disabled": false,
      "target": "p31_inviteUserModal"
    },
    {
      "label": "New Invoice",
      "showLabel": true,
      "iconClass": "bi bi-plus-lg",
      "variantClass": "pm-btn pm-btn-dark",
      "style": "",
      "kind": "open",
      "message": "",
      "disabled": false,
      "target": "p31_newInvoiceModal"
    }
  ]
} as PageConfig;
  readonly pageBlocks: UiPageBlock[] = [
  {
    "id": "block-1",
    "wrapperClass": "row g-3",
    "cards": [
      {
        "id": "available-cash-position",
        "columnClass": "col-lg-3 col-md-6",
        "cardClass": "pm-card pm-card-biz",
        "style": "cursor:pointer",
        "iconClass": "",
        "title": "",
        "subtitle": "",
        "label": "AVAILABLE CASH POSITION",
        "value": "KES 2.45M",
        "description": "",
        "badge": {
          "text": "+ KES 850K in transit",
          "className": "pm-badge pm-badge-dark",
          "iconClass": "bi bi-bank",
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
        "action": {
          "label": "AVAILABLE CASH POSITION",
          "showLabel": false,
          "iconClass": "bi bi-bank",
          "variantClass": "pm-btn",
          "style": "cursor:pointer",
          "kind": "open",
          "message": "",
          "disabled": false,
          "target": "p31_cashFlowDetailsModal"
        }
      },
      {
        "id": "monthly-revenue",
        "columnClass": "col-lg-3 col-md-6",
        "cardClass": "pm-card",
        "style": "cursor:pointer",
        "iconClass": "",
        "title": "",
        "subtitle": "",
        "label": "MONTHLY REVENUE",
        "value": "KES 1.82M",
        "description": "",
        "badge": {
          "text": "+12% vs last month",
          "className": "pm-badge pm-badge-success",
          "iconClass": "bi bi-graph-up-arrow",
          "style": ""
        },
        "lines": [
          "Target: 2.0M"
        ],
        "items": [],
        "quickActions": [],
        "actions": [],
        "table": null,
        "chart": [],
        "children": [],
        "tabs": [],
        "action": {
          "label": "MONTHLY REVENUE",
          "showLabel": false,
          "iconClass": "bi bi-graph-up-arrow",
          "variantClass": "pm-btn",
          "style": "cursor:pointer",
          "kind": "open",
          "message": "",
          "disabled": false,
          "target": "p31_revenueDetailsModal"
        }
      },
      {
        "id": "monthly-expenses",
        "columnClass": "col-lg-3 col-md-6",
        "cardClass": "pm-card",
        "style": "cursor:pointer",
        "iconClass": "",
        "title": "",
        "subtitle": "",
        "label": "MONTHLY EXPENSES",
        "value": "KES 940K",
        "description": "",
        "badge": null,
        "lines": [
          "Payroll: 450K",
          "Supplier: 320K"
        ],
        "items": [],
        "quickActions": [],
        "actions": [],
        "table": null,
        "chart": [],
        "children": [],
        "tabs": [],
        "action": {
          "label": "MONTHLY EXPENSES",
          "showLabel": false,
          "iconClass": "",
          "variantClass": "pm-btn",
          "style": "cursor:pointer",
          "kind": "open",
          "message": "",
          "disabled": false,
          "target": "p31_expenseDetailsModal"
        }
      },
      {
        "id": "pending-approvals",
        "columnClass": "col-lg-3 col-md-6",
        "cardClass": "pm-card",
        "style": "border-left:3px solid var(--pm-warning)",
        "iconClass": "",
        "title": "",
        "subtitle": "",
        "label": "PENDING APPROVALS",
        "value": "5 Actionable",
        "description": "",
        "badge": null,
        "lines": [],
        "items": [],
        "quickActions": [],
        "actions": [
          {
            "label": "Review Queue",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "flex:1",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p31_pendingApprovalsModal"
          }
        ],
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
        "id": "attention-operations",
        "columnClass": "col-lg-8",
        "cardClass": "pm-card h-100",
        "style": "",
        "iconClass": "",
        "title": "Attention & Operations",
        "subtitle": "",
        "label": "",
        "value": "",
        "description": "",
        "badge": null,
        "lines": [
          "Payroll Run: October 2025 Requires Approval",
          "24 Employees · Total KES 450,500 · Maker: HR Dept",
          "KYB Update Required: Annual Returns",
          "Upload 2024 CR12 to maintain Tier 3 limit (Overdue in 5 days)",
          "3 Invoices Aging > 60 Days",
          "Total outstanding: KES 145,000 · Action recommended"
        ],
        "items": [
          {
            "title": "Payroll Run: October 2025 Requires Approval 24 Employees · Total KES 450,500 · Maker: HR Dept",
            "subtitle": null,
            "value": "",
            "iconClass": "bi bi-people",
            "iconContainerClass": "pm-icon-circle",
            "iconContainerStyle": "background:var(--pm-warning-soft);color:var(--pm-warning)",
            "badge": null,
            "action": {
              "label": "Review & Approve",
              "showLabel": true,
              "iconClass": "",
              "variantClass": "pm-btn pm-btn-sm pm-btn-primary",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p31_runPayrollModal"
            }
          },
          {
            "title": "KYB Update Required: Annual Returns Upload 2024 CR12 to maintain Tier 3 limit (Overdue in 5 days)",
            "subtitle": null,
            "value": "",
            "iconClass": "bi bi-shield-exclamation",
            "iconContainerClass": "pm-icon-circle",
            "iconContainerStyle": "background:var(--pm-danger-soft);color:var(--pm-danger)",
            "badge": null,
            "action": {
              "label": "Upload Doc",
              "showLabel": true,
              "iconClass": "",
              "variantClass": "pm-btn pm-btn-sm pm-btn-danger",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p31_kybUploadModal"
            }
          },
          {
            "title": "3 Invoices Aging > 60 Days Total outstanding: KES 145,000 · Action recommended",
            "subtitle": null,
            "value": "",
            "iconClass": "bi bi-receipt",
            "iconContainerClass": "pm-icon-circle",
            "iconContainerStyle": "background:var(--pm-info-soft);color:var(--pm-info)",
            "badge": null,
            "action": {
              "label": "Send Reminders",
              "showLabel": true,
              "iconClass": "",
              "variantClass": "pm-btn pm-btn-sm",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p31_agingInvoicesModal"
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
            "target": "p31_notificationsModal"
          }
        ],
        "table": null,
        "chart": [],
        "children": [],
        "tabs": [],
        "action": null
      },
      {
        "id": "quick-actions",
        "columnClass": "col-lg-4",
        "cardClass": "pm-card h-100",
        "style": "",
        "iconClass": "",
        "title": "Quick Actions",
        "subtitle": "",
        "label": "",
        "value": "",
        "description": "",
        "badge": null,
        "lines": [
          "Smart Suggestion",
          "You have KES 1.2M idle cash. Consider moving 500K to the Money Market Fund to earn ~11% p.a."
        ],
        "items": [],
        "quickActions": [
          {
            "label": "Invoice",
            "showLabel": true,
            "iconClass": "bi bi-receipt",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p31_newInvoiceModal"
          },
          {
            "label": "Payroll",
            "showLabel": true,
            "iconClass": "bi bi-people",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p31_runPayrollModal"
          },
          {
            "label": "Disburse",
            "showLabel": true,
            "iconClass": "bi bi-send",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p31_disburseFundsModal"
          },
          {
            "label": "Transfer",
            "showLabel": true,
            "iconClass": "bi bi-arrow-left-right",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p31_interCompanyTransferModal"
          },
          {
            "label": "Add Team",
            "showLabel": true,
            "iconClass": "bi bi-person-plus",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p31_inviteUserModal"
          },
          {
            "label": "KYB",
            "showLabel": true,
            "iconClass": "bi bi-shield-check",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p31_kybUploadModal"
          }
        ],
        "actions": [
          {
            "label": "View Investment Options",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "background:#fff;color:#047857;border-color:rgba(16,185,129,0.3)",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p31_interCompanyTransferModal"
          }
        ],
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
        "id": "3-1-1-business-overview-dashboard",
        "columnClass": "col-12",
        "cardClass": "pm-card",
        "style": "",
        "iconClass": "bi bi-graph-up",
        "title": "3.1.1 — Business Overview Dashboard",
        "subtitle": "Collections vs Targets, Aging Invoices, and Disbursement Rates.",
        "label": "",
        "value": "",
        "description": "",
        "badge": null,
        "lines": [],
        "items": [],
        "quickActions": [],
        "actions": [
          {
            "label": "Edit Targets",
            "showLabel": true,
            "iconClass": "bi bi-sliders",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p31_collectionTargetModal"
          }
        ],
        "table": null,
        "chart": [],
        "children": [
          {
            "id": "collections-vs-target-last-6-months",
            "columnClass": "col-lg-6",
            "cardClass": "status-block",
            "style": "",
            "iconClass": "",
            "title": "Collections vs Target (Last 6 Months)",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": null,
            "lines": [
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Target",
              "Actual"
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
            "id": "outstanding-invoices-aging",
            "columnClass": "col-lg-6",
            "cardClass": "status-block",
            "style": "",
            "iconClass": "",
            "title": "Outstanding Invoices Aging",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": null,
            "lines": [
              "0-30 Days",
              "KES 420K",
              "31-60 Days",
              "KES 185K",
              "61-90+ Days",
              "KES 145K"
            ],
            "items": [],
            "quickActions": [],
            "actions": [
              {
                "label": "Send Auto-Reminders to All Overdue",
                "showLabel": true,
                "iconClass": "bi bi-envelope",
                "variantClass": "pm-btn pm-btn-sm",
                "style": "",
                "kind": "open",
                "message": "",
                "disabled": false,
                "target": "p31_agingInvoicesModal"
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
  },
  {
    "id": "block-4",
    "wrapperClass": "row g-3",
    "cards": [
      {
        "id": "3-1-2-business-profile-settings",
        "columnClass": "col-lg-6",
        "cardClass": "pm-card h-100",
        "style": "",
        "iconClass": "bi bi-building-check",
        "title": "3.1.2 — Business Profile & Settings",
        "subtitle": "KYC/KYB status and corporate details.",
        "label": "",
        "value": "",
        "description": "",
        "badge": {
          "text": "Verified",
          "className": "pm-badge pm-badge-success",
          "iconClass": "bi bi-check-circle",
          "style": ""
        },
        "lines": [
          "Verification & KYB Status",
          "Certificate of Incorporation",
          "KRA PIN Certificate",
          "Tax Compliance Certificate",
          "Valid till Dec 2025",
          "Annual Returns (CR12)",
          "Missing 2024"
        ],
        "items": [],
        "quickActions": [],
        "actions": [
          {
            "label": "Action",
            "showLabel": false,
            "iconClass": "bi bi-pencil",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p31_businessSettingsModal"
          },
          {
            "label": "Manage Documents",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p31_kybUploadModal"
          }
        ],
        "table": null,
        "chart": [],
        "children": [
          {
            "id": "card",
            "columnClass": "col-sm-6",
            "cardClass": "p-2 border rounded",
            "style": "",
            "iconClass": "",
            "title": "",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": null,
            "lines": [
              "Company Name",
              "TechSolutions Ltd"
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
            "id": "card",
            "columnClass": "col-sm-6",
            "cardClass": "p-2 border rounded",
            "style": "",
            "iconClass": "",
            "title": "",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": null,
            "lines": [
              "KRA PIN",
              "P051234567M"
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
            "id": "card",
            "columnClass": "col-sm-6",
            "cardClass": "p-2 border rounded",
            "style": "",
            "iconClass": "",
            "title": "",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": null,
            "lines": [
              "Registration Number",
              "PVT-2022/10492"
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
            "id": "card",
            "columnClass": "col-sm-6",
            "cardClass": "p-2 border rounded",
            "style": "",
            "iconClass": "",
            "title": "",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": null,
            "lines": [
              "Business Type / Sector",
              "LLC · IT Services"
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
      },
      {
        "id": "3-1-3-multi-business-management",
        "columnClass": "col-lg-6",
        "cardClass": "pm-card h-100",
        "style": "",
        "iconClass": "bi bi-diagram-3",
        "title": "3.1.3 — Multi-Business Management",
        "subtitle": "Switch accounts, view consolidated data, inter-company transfers.",
        "label": "",
        "value": "",
        "description": "",
        "badge": null,
        "lines": [
          "CONSOLIDATED GROUP CASH (3 ENTITIES)",
          "KES 12.8M",
          "(Current)"
        ],
        "items": [],
        "quickActions": [],
        "actions": [
          {
            "label": "Switch",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p31_switchBusinessModal"
          },
          {
            "label": "View Group Report",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "border-color:var(--pm-purple);color:var(--pm-purple)",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p31_consolidatedReportModal"
          }
        ],
        "table": {
          "columns": [
            "Entity Name",
            "Role",
            "Cash Bal",
            "Action"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "TechSolutions Ltd",
                  "strong": true,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Owner",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "2.45M",
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
                      "label": "Active",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "notify",
                      "message": "Active selected.",
                      "disabled": true
                    }
                  ]
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "TS Logistics & Delivery",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Owner",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "8.10M",
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
                      "label": "Transfer",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "open",
                      "message": "",
                      "disabled": false,
                      "target": "p31_interCompanyTransferModal"
                    }
                  ]
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "TechSolutions Foundation",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Admin",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "2.25M",
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
                      "label": "Switch",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "open",
                      "message": "",
                      "disabled": false,
                      "target": "p31_switchBusinessModal"
                    }
                  ]
                }
              ],
              "filterKey": ""
            }
          ]
        },
        "chart": [],
        "children": [],
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
        "id": "3-1-4-team-user-management",
        "columnClass": "col-12",
        "cardClass": "pm-card",
        "style": "",
        "iconClass": "bi bi-people",
        "title": "3.1.4 — Team & User Management",
        "subtitle": "Manage roles, permissions, approval limits, and MFA requirements.",
        "label": "",
        "value": "",
        "description": "",
        "badge": {
          "text": "Owner",
          "className": "pm-badge",
          "iconClass": "",
          "style": "background:#1E293B;color:#fff"
        },
        "lines": [
          "amina@techsol.co.ke",
          "peter.k@techsol.co.ke",
          "sarah.hr@techsol.co.ke",
          "john@techsol.co.ke"
        ],
        "items": [],
        "quickActions": [],
        "actions": [
          {
            "label": "View Roles Matrix",
            "showLabel": true,
            "iconClass": "bi bi-shield-lock",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p31_rolePermissionsModal"
          },
          {
            "label": "Invite User",
            "showLabel": true,
            "iconClass": "bi bi-person-plus",
            "variantClass": "pm-btn pm-btn-sm pm-btn-primary",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p31_inviteUserModal"
          }
        ],
        "table": {
          "columns": [
            "User",
            "Role / Dept",
            "Approval Limit",
            "MFA Status",
            "Last Active",
            "Actions"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Amina D.",
                  "strong": true,
                  "className": "",
                  "style": "",
                  "secondary": "AD",
                  "avatar": "AD"
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "badge": {
                    "text": "Owner",
                    "className": "pm-badge",
                    "iconClass": "",
                    "style": "background:#1E293B;color:#fff"
                  }
                },
                {
                  "text": "Unlimited",
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
                    "text": "Enforced",
                    "className": "pm-badge pm-badge-success",
                    "iconClass": "bi bi-phone",
                    "style": ""
                  }
                },
                {
                  "text": "Today, 09:41 AM",
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
                      "label": "Edit",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "open",
                      "message": "",
                      "disabled": false,
                      "target": "p31_viewUserModal"
                    }
                  ]
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "Peter K.",
                  "strong": true,
                  "className": "",
                  "style": "",
                  "secondary": "PK",
                  "avatar": "PK"
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "badge": {
                    "text": "Finance Admin",
                    "className": "pm-badge pm-badge-info",
                    "iconClass": "",
                    "style": ""
                  }
                },
                {
                  "text": "KES 1,000,000",
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
                    "text": "Enforced",
                    "className": "pm-badge pm-badge-success",
                    "iconClass": "bi bi-phone",
                    "style": ""
                  }
                },
                {
                  "text": "Today, 08:15 AM",
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
                      "label": "Edit",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "open",
                      "message": "",
                      "disabled": false,
                      "target": "p31_viewUserModal"
                    }
                  ]
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "Sarah W.",
                  "strong": true,
                  "className": "",
                  "style": "",
                  "secondary": "SW",
                  "avatar": "SW"
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "badge": {
                    "text": "HR Manager",
                    "className": "pm-badge pm-badge-warning",
                    "iconClass": "",
                    "style": ""
                  }
                },
                {
                  "text": "KES 5,000,000 (Payroll)",
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
                    "text": "Enforced",
                    "className": "pm-badge pm-badge-success",
                    "iconClass": "bi bi-phone",
                    "style": ""
                  }
                },
                {
                  "text": "Yesterday",
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
                      "label": "Edit",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "open",
                      "message": "",
                      "disabled": false,
                      "target": "p31_viewUserModal"
                    }
                  ]
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "John M.",
                  "strong": true,
                  "className": "",
                  "style": "",
                  "secondary": "JM",
                  "avatar": "JM"
                },
                {
                  "text": "",
                  "strong": false,
                  "className": "",
                  "style": "",
                  "badge": {
                    "text": "Sales (Invoicing)",
                    "className": "pm-badge",
                    "iconClass": "",
                    "style": "background:#f1f5f9;color:var(--pm-ink-soft)"
                  }
                },
                {
                  "text": "None (Maker only)",
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
                    "text": "Pending Setup",
                    "className": "pm-badge pm-badge-danger",
                    "iconClass": "bi bi-exclamation-circle",
                    "style": ""
                  }
                },
                {
                  "text": "Never (Invited)",
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
                      "label": "Manage",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "open",
                      "message": "",
                      "disabled": false,
                      "target": "p31_viewUserModal"
                    }
                  ]
                }
              ],
              "filterKey": ""
            }
          ]
        },
        "chart": [],
        "children": [],
        "tabs": [],
        "action": null
      }
    ]
  }
] as UiPageBlock[];
  readonly modals: ModalConfig[] = [
  {
    "id": "p31_newInvoiceModal",
    "title": "Create Quick Invoice",
    "iconClass": "bi bi-receipt",
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
          "value": "Acme Corp",
          "placeholder": "",
          "options": [
            "Acme Corp",
            "Global Industries",
            "+ Add New Customer"
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
          "value": "150000",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "description",
          "label": "Description",
          "type": "textarea",
          "value": "IT Consulting Services - October 2025",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "due_date",
          "label": "Due Date",
          "type": "date",
          "value": "2025-11-15",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "send_payment_link_via_email_sms",
          "label": "Send payment link via Email/SMS",
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
        "target": "p31_newInvoiceModal"
      },
      {
        "label": "Create Invoice",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Invoice #INV-2025-142 created & sent successfully!",
        "disabled": false,
        "target": "p31_newInvoiceModal",
        "reference": "INV-2025-142"
      }
    ]
  },
  {
    "id": "p31_runPayrollModal",
    "title": "Run & Approve Payroll",
    "iconClass": "bi bi-people",
    "sizeClass": "modal-lg",
    "content": null,
    "steps": [
      {
        "label": "Select",
        "content": {
          "notes": [
            "Select Payroll Period"
          ],
          "alerts": [
            {
              "text": "Gross Pay KES 620,000 PAYE & Statutory - KES 169,500 Net Disbursement KES 450,500",
              "tone": "info"
            }
          ],
          "stats": [
            {
              "label": "Net Disbursement KES 450,500",
              "value": "Gross Pay KES 620,000",
              "className": "p-3 border rounded"
            }
          ],
          "fields": [
            {
              "key": "month",
              "label": "Month",
              "type": "select",
              "value": "October 2025",
              "placeholder": "",
              "options": [
                "October 2025",
                "September 2025"
              ],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-md-6"
            },
            {
              "key": "department_group",
              "label": "Department / Group",
              "type": "select",
              "value": "All Employees (24)",
              "placeholder": "",
              "options": [
                "All Employees (24)",
                "Management (4)",
                "Engineering (12)"
              ],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-md-6"
            }
          ],
          "details": [
            {
              "label": "Gross Pay",
              "value": "KES 620,000"
            },
            {
              "label": "PAYE & Statutory",
              "value": "- KES 169,500"
            },
            {
              "label": "Net Disbursement",
              "value": "KES 450,500"
            }
          ],
          "items": [],
          "tables": [],
          "actions": [],
          "image": null,
          "receipt": null
        }
      },
      {
        "label": "Review",
        "content": {
          "notes": [
            "Review Discrepancies"
          ],
          "alerts": [
            {
              "text": "1 employee banking detail missing. They will be paid via M-Pesa.",
              "tone": "warning"
            }
          ],
          "stats": [],
          "fields": [],
          "details": [],
          "items": [],
          "tables": [
            {
              "columns": [
                "Employee",
                "Gross",
                "Net",
                "Method"
              ],
              "rows": [
                {
                  "cells": [
                    {
                      "text": "James K.",
                      "strong": false,
                      "className": "",
                      "style": ""
                    },
                    {
                      "text": "120,000",
                      "strong": false,
                      "className": "",
                      "style": ""
                    },
                    {
                      "text": "86,400",
                      "strong": false,
                      "className": "",
                      "style": ""
                    },
                    {
                      "text": "Bank Transfer",
                      "strong": false,
                      "className": "",
                      "style": ""
                    }
                  ],
                  "filterKey": ""
                },
                {
                  "cells": [
                    {
                      "text": "Grace M.",
                      "strong": false,
                      "className": "",
                      "style": ""
                    },
                    {
                      "text": "95,000",
                      "strong": false,
                      "className": "",
                      "style": ""
                    },
                    {
                      "text": "71,200",
                      "strong": false,
                      "className": "",
                      "style": ""
                    },
                    {
                      "text": "Bank Transfer",
                      "strong": false,
                      "className": "",
                      "style": ""
                    }
                  ],
                  "filterKey": ""
                },
                {
                  "cells": [
                    {
                      "text": "David O.",
                      "strong": false,
                      "className": "",
                      "style": ""
                    },
                    {
                      "text": "60,000",
                      "strong": false,
                      "className": "",
                      "style": ""
                    },
                    {
                      "text": "48,500",
                      "strong": false,
                      "className": "",
                      "style": ""
                    },
                    {
                      "text": "M-Pesa B2C",
                      "strong": false,
                      "className": "",
                      "style": ""
                    }
                  ],
                  "filterKey": ""
                },
                {
                  "cells": [
                    {
                      "text": "... 21 more rows",
                      "strong": false,
                      "className": "text-center text-muted",
                      "style": "",
                      "colspan": 4
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
        "label": "Approve",
        "content": {
          "notes": [
            "Authorize Execution",
            "Authorization required for",
            "KES 450,500",
            "disbursement to 24 employees. Funds will be deducted from TechSolutions Ltd main wallet."
          ],
          "alerts": [
            {
              "text": "Authorization required for KES 450,500 disbursement to 24 employees. Funds will be deducted from TechSolutions Ltd main wallet.",
              "tone": "info"
            }
          ],
          "stats": [],
          "fields": [
            {
              "key": "auto_file_kra_p10_nssf_and_shif_returns",
              "label": "Auto-file KRA P10, NSSF, and SHIF returns",
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
              "key": "authorization_pin",
              "label": "Enter your Director PIN",
              "type": "pin",
              "value": "",
              "placeholder": "",
              "options": [],
              "checked": false,
              "disabled": false,
              "columnClass": "col-12",
              "pinLength": 4
            }
          ],
          "details": [],
          "items": [],
          "tables": [],
          "actions": [],
          "image": null,
          "receipt": null
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
        "target": "p31_runPayrollModal"
      },
      {
        "label": "Continue",
        "showLabel": true,
        "iconClass": "bi bi-arrow-right",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "next",
        "message": "Continue completed.",
        "disabled": false,
        "target": "p31_runPayrollModal",
        "stepLabels": [
          "Continue",
          "Continue",
          "Done"
        ]
      }
    ]
  },
  {
    "id": "p31_interCompanyTransferModal",
    "title": "Inter-Company Transfer",
    "iconClass": "bi bi-arrow-left-right",
    "sizeClass": "",
    "content": null,
    "steps": [
      {
        "label": "Step 1",
        "content": {
          "notes": [],
          "alerts": [],
          "stats": [],
          "fields": [
            {
              "key": "transfer_from",
              "label": "Transfer From",
              "type": "select",
              "value": "TechSolutions Ltd (Bal: 2.45M)",
              "placeholder": "",
              "options": [
                "TechSolutions Ltd (Bal: 2.45M)"
              ],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-12"
            },
            {
              "key": "transfer_to",
              "label": "Transfer To",
              "type": "select",
              "value": "TS Logistics & Delivery (Bal: 8.10M)",
              "placeholder": "",
              "options": [
                "TS Logistics & Delivery (Bal: 8.10M)",
                "TechSolutions Foundation (Bal: 2.25M)",
                "PayMo Money Market Fund (Yield: 11%)"
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
        }
      },
      {
        "label": "Step 2",
        "content": {
          "notes": [],
          "alerts": [
            {
              "text": "Inter-company transfers settle instantly. Zero fees applied.",
              "tone": "info"
            }
          ],
          "stats": [],
          "fields": [
            {
              "key": "amount_kes",
              "label": "Amount (KES)",
              "type": "number",
              "value": "500000",
              "placeholder": "",
              "options": [],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-12"
            },
            {
              "key": "reference_reason",
              "label": "Reference / Reason",
              "type": "text",
              "value": "Fleet expansion capital",
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
        "label": "Confirm Transfer",
        "content": {
          "notes": [
            "Confirm Transfer",
            "KES 500,000",
            "To TS Logistics & Delivery"
          ],
          "alerts": [],
          "stats": [],
          "fields": [
            {
              "key": "authorization_pin",
              "label": "Reference / Reason",
              "type": "pin",
              "value": "",
              "placeholder": "",
              "options": [],
              "checked": false,
              "disabled": false,
              "columnClass": "col-12",
              "pinLength": 4
            }
          ],
          "details": [],
          "items": [],
          "tables": [],
          "actions": [],
          "image": null,
          "receipt": null
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
        "target": "p31_interCompanyTransferModal"
      },
      {
        "label": "Continue",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "next",
        "message": "Continue completed.",
        "disabled": false,
        "target": "p31_interCompanyTransferModal",
        "stepLabels": [
          "Continue",
          "Continue",
          "Done"
        ]
      }
    ]
  },
  {
    "id": "p31_inviteUserModal",
    "title": "Invite Team Member",
    "iconClass": "bi bi-person-plus",
    "sizeClass": "",
    "content": null,
    "steps": [
      {
        "label": "Details",
        "content": {
          "notes": [],
          "alerts": [],
          "stats": [],
          "fields": [
            {
              "key": "full_name",
              "label": "Full Name",
              "type": "text",
              "value": "",
              "placeholder": "e.g. Jane Doe",
              "options": [],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-12"
            },
            {
              "key": "work_email",
              "label": "Work Email",
              "type": "email",
              "value": "",
              "placeholder": "jane@techsol.co.ke",
              "options": [],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-12"
            },
            {
              "key": "department",
              "label": "Department",
              "type": "select",
              "value": "Finance",
              "placeholder": "",
              "options": [
                "Finance",
                "HR",
                "Sales",
                "Operations"
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
        }
      },
      {
        "label": "Role",
        "content": {
          "notes": [
            "Admin",
            "- Manage settings, approve payments",
            "Finance / Maker",
            "- Create invoices, initiate payments",
            "Viewer",
            "- Read-only access to reports"
          ],
          "alerts": [],
          "stats": [],
          "fields": [
            {
              "key": "assign_role",
              "label": "Assign Role",
              "type": "radio",
              "value": "",
              "placeholder": "",
              "options": [],
              "style": "",
              "checked": true,
              "disabled": false,
              "columnClass": "col-12"
            },
            {
              "key": "admin_manage_settings_approve_payments",
              "label": "Admin - Manage settings, approve payments",
              "type": "radio",
              "value": "",
              "placeholder": "",
              "options": [],
              "style": "",
              "checked": true,
              "disabled": false,
              "columnClass": "col-12"
            },
            {
              "key": "finance_maker_create_invoices_initiate_payments",
              "label": "Finance / Maker - Create invoices, initiate payments",
              "type": "radio",
              "value": "",
              "placeholder": "",
              "options": [],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-12"
            },
            {
              "key": "viewer_read_only_access_to_reports",
              "label": "Viewer - Read-only access to reports",
              "type": "radio",
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
        "label": "Limits",
        "content": {
          "notes": [],
          "alerts": [],
          "stats": [],
          "fields": [
            {
              "key": "approval_limit_kes",
              "label": "Approval Limit (KES)",
              "type": "number",
              "value": "1000000",
              "placeholder": "",
              "options": [],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-12"
            },
            {
              "key": "require_2fa_mfa_enforced_for_admin",
              "label": "Require 2FA/MFA (Enforced for Admin)",
              "type": "checkbox",
              "value": "",
              "placeholder": "",
              "options": [],
              "style": "",
              "checked": true,
              "disabled": true,
              "columnClass": "col-12"
            },
            {
              "key": "allow_access_to_multi_business_switcher",
              "label": "Allow access to multi-business switcher",
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
        "target": "p31_inviteUserModal"
      },
      {
        "label": "Continue",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "next",
        "message": "Continue completed.",
        "disabled": false,
        "target": "p31_inviteUserModal",
        "stepLabels": [
          "Continue",
          "Continue",
          "Done"
        ]
      }
    ]
  },
  {
    "id": "p31_kybUploadModal",
    "title": "KYB Document Upload",
    "iconClass": "bi bi-shield-check",
    "sizeClass": "",
    "content": {
      "notes": [
        "Click to browse or drag file here",
        "PDF, JPG, PNG (Max 5MB)"
      ],
      "alerts": [
        {
          "text": "Missing Annual Returns (CR12). Limit restrictions will apply in 5 days.",
          "tone": "danger"
        }
      ],
      "stats": [],
      "fields": [
        {
          "key": "document_type",
          "label": "Document Type",
          "type": "select",
          "value": "CR12 / Annual Returns",
          "placeholder": "",
          "options": [
            "CR12 / Annual Returns"
          ],
          "style": "",
          "checked": false,
          "disabled": true,
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
        "target": "p31_kybUploadModal"
      },
      {
        "label": "Submit for Verification",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Document uploaded and sent for verification.",
        "disabled": false,
        "target": "p31_kybUploadModal",
        "reference": "KYB-99120"
      }
    ]
  },
  {
    "id": "p31_businessSettingsModal",
    "title": "Business Settings",
    "iconClass": "bi bi-gear",
    "sizeClass": "modal-lg",
    "content": {
      "notes": [
        "General",
        "Address & Contacts",
        "Signatories"
      ],
      "alerts": [],
      "stats": [],
      "fields": [
        {
          "key": "trading_name",
          "label": "Trading Name",
          "type": "text",
          "value": "TechSolutions Ltd",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-md-6"
        },
        {
          "key": "industry_sector",
          "label": "Industry Sector",
          "type": "select",
          "value": "Information Technology",
          "placeholder": "",
          "options": [
            "Information Technology",
            "Retail"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-md-6"
        },
        {
          "key": "support_email",
          "label": "Support Email",
          "type": "email",
          "value": "support@techsol.co.ke",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-md-6"
        },
        {
          "key": "support_phone",
          "label": "Support Phone",
          "type": "text",
          "value": "+254 700 000 000",
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
        "target": "p31_businessSettingsModal"
      },
      {
        "label": "Save Changes",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Settings updated successfully!",
        "disabled": false,
        "target": "p31_businessSettingsModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p31_switchBusinessModal",
    "title": "Switch Business Account",
    "iconClass": "bi bi-diagram-3",
    "sizeClass": "",
    "content": {
      "notes": [
        "TS",
        "TechSolutions Ltd",
        "Owner · Current",
        "TL",
        "TS Logistics & Delivery",
        "Owner",
        "TF",
        "TechSolutions Foundation",
        "Admin"
      ],
      "alerts": [
        {
          "text": "TS TechSolutions Ltd Owner · Current",
          "tone": "info"
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
        "iconClass": "",
        "variantClass": "pm-btn",
        "kind": "close",
        "target": "p31_switchBusinessModal",
        "message": "",
        "disabled": false
      }
    ]
  },
  {
    "id": "p31_cashFlowDetailsModal",
    "title": "Cash Position & Liquidity",
    "iconClass": "bi bi-bank",
    "sizeClass": "modal-lg",
    "content": {
      "notes": [
        "Pending Settlements (T+1)"
      ],
      "alerts": [],
      "stats": [
        {
          "label": "KES 2,450,000",
          "value": "PAYMO BUSINESS WALLET",
          "className": "p-3 border rounded h-100"
        },
        {
          "label": "KES 8,120,500",
          "value": "LINKED ACCOUNTS (EQUITY BANK)",
          "className": "p-3 border rounded h-100"
        }
      ],
      "fields": [],
      "details": [],
      "items": [],
      "tables": [
        {
          "columns": [
            "Source",
            "Amount",
            "Expected Date"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "M-Pesa Till (Buy Goods)",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 450,000",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Tomorrow, 8:00 AM",
                  "strong": false,
                  "className": "",
                  "style": ""
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "Visa/Mastercard Gateway",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 400,000",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Tomorrow, 2:00 PM",
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
      "actions": [
        {
          "label": "Transfer Funds",
          "showLabel": true,
          "iconClass": "",
          "variantClass": "pm-btn pm-btn-sm",
          "style": "",
          "kind": "open",
          "message": "",
          "disabled": false,
          "target": "p31_interCompanyTransferModal"
        },
        {
          "label": "Manage Connections",
          "showLabel": true,
          "iconClass": "",
          "variantClass": "pm-btn pm-btn-sm",
          "style": "",
          "kind": "open",
          "message": "",
          "disabled": false,
          "target": "p31_connectBankModal"
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
        "target": "p31_cashFlowDetailsModal"
      }
    ]
  },
  {
    "id": "p31_agingInvoicesModal",
    "title": "Outstanding Invoices (Aging Report)",
    "iconClass": "bi bi-receipt",
    "sizeClass": "modal-lg",
    "content": {
      "notes": [
        "All (750K)",
        "0-30 Days (420K)",
        "31-60 Days (185K)",
        "61-90+ Days (145K)"
      ],
      "alerts": [],
      "stats": [],
      "fields": [],
      "details": [],
      "items": [],
      "tables": [
        {
          "columns": [
            "Invoice",
            "Customer",
            "Amount",
            "Days Overdue",
            "Actions"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "INV-2025-081",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Acme Corp",
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
                    "text": "72 days",
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
                      "label": "Remind",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "notify",
                      "message": "Remind selected.",
                      "disabled": false
                    }
                  ]
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "INV-2025-084",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Global Industries",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 60,000",
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
                    "text": "65 days",
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
                      "label": "Remind",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "notify",
                      "message": "Remind selected.",
                      "disabled": false
                    }
                  ]
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "INV-2025-092",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "StartUp Inc",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 185,000",
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
                    "text": "45 days",
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
                      "label": "Remind",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm",
                      "style": "",
                      "kind": "notify",
                      "message": "Remind selected.",
                      "disabled": false
                    }
                  ]
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "INV-2025-104",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Retail Chain A",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 420,000",
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
                    "text": "15 days",
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
                      "kind": "notify",
                      "message": "View selected.",
                      "disabled": false
                    }
                  ]
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
        "target": "p31_agingInvoicesModal"
      },
      {
        "label": "Send Batch Reminders",
        "showLabel": true,
        "iconClass": "bi bi-envelope-check",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Reminders sent to all overdue customers via Email & SMS.",
        "disabled": false,
        "target": "p31_agingInvoicesModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p31_viewUserModal",
    "title": "Edit User: Peter K.",
    "iconClass": "bi bi-person",
    "sizeClass": "",
    "content": {
      "notes": [],
      "alerts": [],
      "stats": [],
      "fields": [
        {
          "key": "role",
          "label": "Role",
          "type": "select",
          "value": "Finance Admin",
          "placeholder": "",
          "options": [
            "Admin",
            "Finance Admin",
            "HR Manager",
            "Viewer"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "approval_limit_kes",
          "label": "Approval Limit (KES)",
          "type": "number",
          "value": "1000000",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "mfa_enforced",
          "label": "MFA Enforced",
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
          "key": "suspend_account",
          "label": "Suspend Account",
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
        "target": "p31_viewUserModal"
      },
      {
        "label": "Save",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "User settings updated!",
        "disabled": false,
        "target": "p31_viewUserModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p31_disburseFundsModal",
    "title": "Disburse Funds",
    "iconClass": "bi bi-send",
    "sizeClass": "",
    "content": {
      "notes": [
        "Upload Beneficiary CSV",
        "Format: Name, Phone, Account, Amount"
      ],
      "alerts": [],
      "stats": [],
      "fields": [
        {
          "key": "disbursement_type",
          "label": "Disbursement Type",
          "type": "select",
          "value": "Single Vendor Payment",
          "placeholder": "",
          "options": [
            "Single Vendor Payment",
            "Bulk CSV Upload (M-Pesa B2C)",
            "Expense Reimbursement"
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
      "actions": [
        {
          "label": "Browse File",
          "showLabel": true,
          "iconClass": "",
          "variantClass": "pm-btn pm-btn-sm",
          "style": "",
          "kind": "notify",
          "message": "Browse File selected.",
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
        "label": "Cancel",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Cancel selected.",
        "disabled": false,
        "target": "p31_disburseFundsModal"
      },
      {
        "label": "Upload & Validate",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "CSV Uploaded. Sent to Maker/Checker queue.",
        "disabled": false,
        "target": "p31_disburseFundsModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p31_pendingApprovalsModal",
    "title": "Approval Queue",
    "iconClass": "bi bi-shield-lock",
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
            "Request",
            "Maker",
            "Amount",
            "Timestamp",
            "Action"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Payroll Run Oct",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Sarah W. (HR)",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 450,500",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Today, 08:00 AM",
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
                      "label": "Review",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm pm-btn-primary",
                      "style": "",
                      "kind": "open",
                      "message": "",
                      "disabled": false,
                      "target": "p31_runPayrollModal",
                      "replaceCurrent": true
                    }
                  ]
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "Supplier: OfficeMart",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Peter K. (Fin)",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 120,000",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Yesterday",
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
                      "label": "Approve",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm pm-btn-primary",
                      "style": "",
                      "kind": "process",
                      "message": "Payment approved!",
                      "disabled": false,
                      "target": "p31_pendingApprovalsModal",
                      "reference": ""
                    }
                  ]
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "Vendor: AWS Hosting",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Peter K. (Fin)",
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
                  "text": "Yesterday",
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
                      "label": "Approve",
                      "showLabel": true,
                      "iconClass": "",
                      "variantClass": "pm-btn pm-btn-sm pm-btn-primary",
                      "style": "",
                      "kind": "process",
                      "message": "Payment approved!",
                      "disabled": false,
                      "target": "p31_pendingApprovalsModal",
                      "reference": ""
                    }
                  ]
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
        "target": "p31_pendingApprovalsModal"
      }
    ]
  },
  {
    "id": "p31_consolidatedReportModal",
    "title": "Export Business Reports",
    "iconClass": "bi bi-file-earmark-bar-graph",
    "sizeClass": "",
    "content": {
      "notes": [],
      "alerts": [],
      "stats": [],
      "fields": [
        {
          "key": "report_type",
          "label": "Report Type",
          "type": "select",
          "value": "Consolidated Cash Flow",
          "placeholder": "",
          "options": [
            "Consolidated Cash Flow",
            "Group Revenue Summary",
            "Payroll Audit Trail",
            "Tax / Statutory Deductions"
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
          "value": "",
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
          "value": "",
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
          "value": "PDF",
          "placeholder": "",
          "options": [
            "PDF",
            "Excel"
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
        "target": "p31_consolidatedReportModal"
      },
      {
        "label": "Download",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Report generated and downloaded.",
        "disabled": false,
        "target": "p31_consolidatedReportModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p31_notificationsModal",
    "title": "Business Alerts",
    "iconClass": "bi bi-bell",
    "sizeClass": "",
    "content": {
      "notes": [
        "Payroll Approval Required",
        "Sarah W. initiated Oct Payroll.",
        "Review",
        "KYB Expiring",
        "Annual returns due in 5 days.",
        "Upload",
        "Settlement Completed",
        "KES 850K settled to Equity Bank.",
        "New User Invite Accepted",
        "John M. joined as Sales."
      ],
      "alerts": [
        {
          "text": "Payroll Approval Required Sarah W. initiated Oct Payroll. Review",
          "tone": "warning"
        },
        {
          "text": "KYB Expiring Annual returns due in 5 days. Upload",
          "tone": "danger"
        },
        {
          "text": "Settlement Completed KES 850K settled to Equity Bank.",
          "tone": "info"
        },
        {
          "text": "New User Invite Accepted John M. joined as Sales.",
          "tone": "info"
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
        "target": "p31_notificationsModal"
      }
    ]
  },
  {
    "id": "p31_rolePermissionsModal",
    "title": "Role Permissions Matrix",
    "iconClass": "bi bi-shield-lock",
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
            "Feature",
            "Owner",
            "Admin",
            "Fin/HR",
            "Sales",
            "Viewer"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Multi-Business Toggle",
                  "strong": false,
                  "className": "text-start",
                  "style": ""
                },
                {
                  "text": "✅",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "❌",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "❌",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "❌",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "❌",
                  "strong": false,
                  "className": "",
                  "style": ""
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "Manage Team",
                  "strong": false,
                  "className": "text-start",
                  "style": ""
                },
                {
                  "text": "✅",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "✅",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "❌",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "❌",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "❌",
                  "strong": false,
                  "className": "",
                  "style": ""
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "Approve Payroll",
                  "strong": false,
                  "className": "text-start",
                  "style": ""
                },
                {
                  "text": "✅",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "✅",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "❌",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "❌",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "❌",
                  "strong": false,
                  "className": "",
                  "style": ""
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "Initiate Payments",
                  "strong": false,
                  "className": "text-start",
                  "style": ""
                },
                {
                  "text": "✅",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "✅",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "✅",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "❌",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "❌",
                  "strong": false,
                  "className": "",
                  "style": ""
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "Create Invoices",
                  "strong": false,
                  "className": "text-start",
                  "style": ""
                },
                {
                  "text": "✅",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "✅",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "✅",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "✅",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "❌",
                  "strong": false,
                  "className": "",
                  "style": ""
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "View Reports",
                  "strong": false,
                  "className": "text-start",
                  "style": ""
                },
                {
                  "text": "✅",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "✅",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "✅",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "✅",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "✅",
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
        "target": "p31_rolePermissionsModal"
      }
    ]
  },
  {
    "id": "p31_connectBankModal",
    "title": "Manage Linked Banks",
    "iconClass": "bi bi-bank",
    "sizeClass": "",
    "content": {
      "notes": [
        "Equity Bank Ltd",
        "***4521 · Open Banking Sync Active",
        "Connect New Bank Account",
        "via PesaLink Open API"
      ],
      "alerts": [],
      "stats": [],
      "fields": [],
      "details": [],
      "items": [],
      "tables": [],
      "actions": [
        {
          "label": "Unlink",
          "showLabel": true,
          "iconClass": "",
          "variantClass": "pm-btn pm-btn-sm pm-btn-danger",
          "style": "",
          "kind": "notify",
          "message": "Unlink selected.",
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
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Close selected.",
        "disabled": false,
        "target": "p31_connectBankModal"
      }
    ]
  },
  {
    "id": "p31_healthCheckModal",
    "title": "Business Health Snapshot",
    "iconClass": "bi bi-activity",
    "sizeClass": "",
    "content": {
      "notes": [
        "92",
        "SCORE"
      ],
      "alerts": [],
      "stats": [],
      "fields": [],
      "details": [],
      "items": [
        {
          "title": "Liquidity Ratio",
          "subtitle": "Cash available to cover payroll",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": {
            "text": "Excellent",
            "className": "pm-badge pm-badge-success",
            "iconClass": "",
            "style": ""
          }
        },
        {
          "title": "Collections Rate",
          "subtitle": "Invoices paid within 30 days",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": {
            "text": "Needs Focus",
            "className": "pm-badge pm-badge-warning",
            "iconClass": "",
            "style": ""
          }
        },
        {
          "title": "Compliance",
          "subtitle": "KYB and KRA Returns",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": {
            "text": "Action Reqd",
            "className": "pm-badge pm-badge-danger",
            "iconClass": "",
            "style": ""
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
        "target": "p31_healthCheckModal"
      }
    ]
  },
  {
    "id": "p31_revenueDetailsModal",
    "title": "Revenue Breakdown",
    "iconClass": "bi bi-graph-up",
    "sizeClass": "",
    "content": {
      "notes": [
        "KES 1.82M"
      ],
      "alerts": [],
      "stats": [],
      "fields": [],
      "details": [],
      "items": [],
      "tables": [
        {
          "columns": [
            "Source",
            "Amount",
            "% of Total"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Invoices Paid",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 1.20M",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "66%",
                  "strong": false,
                  "className": "",
                  "style": ""
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "M-Pesa Till (Walk-in)",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 420K",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "23%",
                  "strong": false,
                  "className": "",
                  "style": ""
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "Payment Links",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 200K",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "11%",
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
        "target": "p31_revenueDetailsModal"
      }
    ]
  },
  {
    "id": "p31_expenseDetailsModal",
    "title": "Expense Breakdown",
    "iconClass": "bi bi-graph-down",
    "sizeClass": "",
    "content": {
      "notes": [
        "KES 940K"
      ],
      "alerts": [],
      "stats": [],
      "fields": [],
      "details": [],
      "items": [],
      "tables": [
        {
          "columns": [
            "Category",
            "Amount",
            "% of Total"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Payroll & Salaries",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 450K",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "48%",
                  "strong": false,
                  "className": "",
                  "style": ""
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "Supplier Payments",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 320K",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "34%",
                  "strong": false,
                  "className": "",
                  "style": ""
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "KRA Taxes & Levies",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 120K",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "13%",
                  "strong": false,
                  "className": "",
                  "style": ""
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "Utilities & Internet",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 50K",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "5%",
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
        "target": "p31_expenseDetailsModal"
      }
    ]
  },
  {
    "id": "p31_collectionTargetModal",
    "title": "Set Collection Targets",
    "iconClass": "bi bi-bullseye",
    "sizeClass": "",
    "content": {
      "notes": [],
      "alerts": [
        {
          "text": "Setting targets updates the dashboard charts for the entire team to track progress.",
          "tone": "info"
        }
      ],
      "stats": [],
      "fields": [
        {
          "key": "target_month",
          "label": "Target Month",
          "type": "select",
          "value": "November 2025",
          "placeholder": "",
          "options": [
            "November 2025",
            "December 2025"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "gross_revenue_target_kes",
          "label": "Gross Revenue Target (KES)",
          "type": "number",
          "value": "2500000",
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
        "target": "p31_collectionTargetModal"
      },
      {
        "label": "Save Targets",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Targets updated for November!",
        "disabled": false,
        "target": "p31_collectionTargetModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p31_businessProfileModal",
    "title": "My Profile",
    "iconClass": "bi bi-person-badge",
    "sizeClass": "",
    "content": {
      "notes": [
        "Amina D.",
        "Director (Admin) · TechSolutions Ltd",
        "AD"
      ],
      "alerts": [],
      "stats": [],
      "fields": [],
      "details": [
        {
          "label": "Approval Limit",
          "value": "Unlimited"
        },
        {
          "label": "Security",
          "value": "MFA Active"
        },
        {
          "label": "Connected Entities",
          "value": "3 Businesses"
        }
      ],
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
        "label": "Log Out",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-danger",
        "style": "",
        "kind": "close",
        "message": "Log Out selected.",
        "disabled": false,
        "target": "p31_businessProfileModal"
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
