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
  selector: 'app-collections-merchant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collections-merchant.html',
  styleUrl: './collections-merchant.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class CollectionsMerchantComponent implements OnDestroy {
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
      "label": "Commerce",
      "href": "#",
      "action": {
        "label": "Commerce",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "",
        "kind": "notify",
        "message": "Commerce selected.",
        "disabled": false
      }
    },
    {
      "label": "Collections",
      "href": "",
      "action": {
        "label": "Collections",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "",
        "kind": "notify",
        "message": "Collections selected.",
        "disabled": false
      }
    }
  ],
  "title": "PAGE 3.2 — Collections & Merchant Services",
  "description": "Manage your PayBill, Till, Card, and PesaLink collections. Track real-time settlements, handle refunds, and manage customer payment data.",
  "actions": [
    {
      "label": "Generate QR",
      "showLabel": true,
      "iconClass": "bi bi-qr-code",
      "variantClass": "pm-btn",
      "style": "",
      "kind": "open",
      "message": "",
      "disabled": false,
      "target": "p32_generateQRModal"
    },
    {
      "label": "Settlements",
      "showLabel": true,
      "iconClass": "bi bi-clock-history",
      "variantClass": "pm-btn",
      "style": "",
      "kind": "open",
      "message": "",
      "disabled": false,
      "target": "p32_settlementModal"
    },
    {
      "label": "Collect Payment",
      "showLabel": true,
      "iconClass": "bi bi-plus-lg",
      "variantClass": "pm-btn pm-btn-primary",
      "style": "",
      "kind": "open",
      "message": "",
      "disabled": false,
      "target": "p32_receivePaymentModal"
    }
  ]
} as PageConfig;
  readonly pageBlocks: UiPageBlock[] = [
  {
    "id": "block-1",
    "wrapperClass": "row g-3",
    "cards": [
      {
        "id": "collections-engine-is-live",
        "columnClass": "col-lg-4",
        "cardClass": "pm-card pm-card-accent",
        "style": "min-height:170px",
        "iconClass": "",
        "title": "",
        "subtitle": "",
        "label": "Collections engine is live ●",
        "value": "KES 412,500",
        "description": "",
        "badge": null,
        "lines": [
          "Collected today across 184 transactions.",
          "Collections engine is live",
          "●"
        ],
        "items": [],
        "quickActions": [],
        "actions": [
          {
            "label": "Collect Now",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.22);color:#fff",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p32_receivePaymentModal"
          },
          {
            "label": "Refund",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.22);color:#fff",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p32_refundModal"
          }
        ],
        "table": null,
        "chart": [],
        "children": [],
        "tabs": [],
        "action": null
      },
      {
        "id": "pending-settlement",
        "columnClass": "col-lg-2 col-md-4 col-6",
        "cardClass": "pm-card",
        "style": "min-height:170px",
        "iconClass": "",
        "title": "",
        "subtitle": "",
        "label": "PENDING SETTLEMENT",
        "value": "KES 89,200",
        "description": "",
        "badge": {
          "text": "T+1 schedule",
          "className": "pm-badge pm-badge-info",
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
        "action": null
      },
      {
        "id": "success-rate-today",
        "columnClass": "col-lg-3 col-md-4 col-6",
        "cardClass": "pm-card",
        "style": "min-height:170px",
        "iconClass": "",
        "title": "",
        "subtitle": "",
        "label": "SUCCESS RATE (TODAY)",
        "value": "98.4%",
        "description": "",
        "badge": {
          "text": "181 successful",
          "className": "pm-badge pm-badge-success",
          "iconClass": "bi bi-check-circle",
          "style": ""
        },
        "lines": [
          "Failed (3 txn)",
          "1.6%"
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
        "id": "disputes-refunds",
        "columnClass": "col-lg-3 col-md-4",
        "cardClass": "pm-card",
        "style": "min-height:170px;border-left:3px solid var(--pm-warning)",
        "iconClass": "",
        "title": "",
        "subtitle": "",
        "label": "DISPUTES & REFUNDS",
        "value": "4 Active",
        "description": "",
        "badge": {
          "text": "Needs attention",
          "className": "pm-badge pm-badge-warning",
          "iconClass": "bi bi-exclamation-triangle",
          "style": ""
        },
        "lines": [
          "Pending Refunds:",
          "2",
          "Open Disputes:"
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
        "style": "",
        "iconClass": "",
        "title": "Attention Required",
        "subtitle": "",
        "label": "",
        "value": "",
        "description": "",
        "badge": null,
        "lines": [
          "Chargeback received",
          "Visa ***4112 · KES 12,500",
          "Refund approval needed",
          "Customer: John Mark · KES 3,400",
          "KYC",
          "PayBill KYC update required",
          "Upload CR12 for PB 512234",
          "API",
          "LNMO API token expires soon",
          "Rotate keys in 3 days"
        ],
        "items": [
          {
            "title": "Chargeback received Visa ***4112 · KES 12,500",
            "subtitle": "CB",
            "value": "",
            "iconClass": "",
            "iconContainerClass": "pm-icon-circle",
            "iconContainerStyle": "background:var(--pm-danger-soft);color:var(--pm-danger);font-size:12px",
            "badge": null,
            "action": {
              "label": "Defend",
              "showLabel": true,
              "iconClass": "",
              "variantClass": "pm-btn pm-btn-sm pm-btn-danger",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p32_disputeModal"
            }
          },
          {
            "title": "Refund approval needed Customer: John Mark · KES 3,400",
            "subtitle": "RF",
            "value": "",
            "iconClass": "",
            "iconContainerClass": "pm-icon-circle",
            "iconContainerStyle": "background:var(--pm-warning-soft);color:var(--pm-warning);font-size:12px",
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
              "target": "p32_refundModal"
            }
          },
          {
            "title": "PayBill KYC update required Upload CR12 for PB 512234",
            "subtitle": "KYC PayBill KYC update required  CR12 for PB 512234 Upload",
            "value": "",
            "iconClass": "",
            "iconContainerClass": "pm-icon-circle",
            "iconContainerStyle": "background:var(--pm-info-soft);color:var(--pm-info);font-size:12px",
            "badge": null,
            "action": {
              "label": "Upload",
              "showLabel": true,
              "iconClass": "",
              "variantClass": "pm-btn pm-btn-sm",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p32_paybillConfigModal"
            }
          },
          {
            "title": "LNMO API token expires soon Rotate keys in 3 days",
            "subtitle": "API LNMO API token expires soon  keys in 3 days Rotate",
            "value": "",
            "iconClass": "",
            "iconContainerClass": "pm-icon-circle",
            "iconContainerStyle": "background:var(--pm-purple-soft);color:var(--pm-purple);font-size:12px",
            "badge": null,
            "action": {
              "label": "Rotate",
              "showLabel": true,
              "iconClass": "",
              "variantClass": "pm-btn pm-btn-sm",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p32_apiConfigModal"
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
            "target": "p32_attentionDetailModal"
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
        "style": "",
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
          "Deploy Dynamic QR for delivery",
          "Reduce manual entry errors by 40%",
          "Send reminders to 14 customers",
          "Invoices due this week · KES 142k",
          "TK",
          "Enable card tokenization",
          "Increase repeat purchase checkout speed",
          "New VIP segment detected",
          "24 customers have spent >KES 50k"
        ],
        "items": [
          {
            "title": "Deploy Dynamic QR for delivery Reduce manual entry errors by 40%",
            "subtitle": "QR",
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
              "target": "p32_generateQRModal"
            }
          },
          {
            "title": "Send reminders to 14 customers Invoices due this week · KES 142k",
            "subtitle": "PR",
            "value": "",
            "iconClass": "",
            "iconContainerClass": "pm-icon-circle",
            "iconContainerStyle": "background:var(--pm-warning-soft);color:var(--pm-warning);font-size:12px",
            "badge": null,
            "action": {
              "label": "Remind",
              "showLabel": true,
              "iconClass": "",
              "variantClass": "pm-btn pm-btn-sm",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p32_sendReminderModal"
            }
          },
          {
            "title": "Enable card tokenization Increase repeat purchase checkout speed",
            "subtitle": "TK  card tokenization Increase repeat purchase checkout speed Enable",
            "value": "",
            "iconClass": "",
            "iconContainerClass": "pm-icon-circle",
            "iconContainerStyle": "background:var(--pm-info-soft);color:var(--pm-info);font-size:12px",
            "badge": null,
            "action": {
              "label": "Enable",
              "showLabel": true,
              "iconClass": "",
              "variantClass": "pm-btn pm-btn-sm",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p32_cardConfigModal"
            }
          },
          {
            "title": "New VIP segment detected 24 customers have spent >KES 50k",
            "subtitle": "SG",
            "value": "",
            "iconClass": "",
            "iconContainerClass": "pm-icon-circle",
            "iconContainerStyle": "background:var(--pm-purple-soft);color:var(--pm-purple);font-size:12px",
            "badge": null,
            "action": {
              "label": "View",
              "showLabel": true,
              "iconClass": "",
              "variantClass": "pm-btn pm-btn-sm",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p32_customerSegmentModal"
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
        "style": "",
        "iconClass": "",
        "title": "Quick Actions",
        "subtitle": "Frequent merchant workflows",
        "label": "",
        "value": "",
        "description": "",
        "badge": null,
        "lines": [],
        "items": [],
        "quickActions": [
          {
            "label": "Collect Pay",
            "showLabel": true,
            "iconClass": "bi bi-wallet2",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p32_receivePaymentModal"
          },
          {
            "label": "New QR",
            "showLabel": true,
            "iconClass": "bi bi-qr-code",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p32_generateQRModal"
          },
          {
            "label": "Refund",
            "showLabel": true,
            "iconClass": "bi bi-arrow-return-left",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p32_refundModal"
          },
          {
            "label": "Dispute",
            "showLabel": true,
            "iconClass": "bi bi-shield-exclamation",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p32_disputeModal"
          },
          {
            "label": "API Keys",
            "showLabel": true,
            "iconClass": "bi bi-code-slash",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p32_apiConfigModal"
          },
          {
            "label": "Reminder",
            "showLabel": true,
            "iconClass": "bi bi-chat-dots",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p32_sendReminderModal"
          },
          {
            "label": "Calculate Fees",
            "showLabel": true,
            "iconClass": "bi bi-calculator",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p32_feeCalculatorModal"
          },
          {
            "label": "Export Data",
            "showLabel": true,
            "iconClass": "bi bi-file-earmark-spreadsheet",
            "variantClass": "pm-btn",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p32_exportReportModal"
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
        "id": "3-2-1-payment-collection-methods",
        "columnClass": "col-12",
        "cardClass": "pm-card",
        "style": "",
        "iconClass": "bi bi-grid-fill",
        "title": "3.2.1 — Payment Collection Methods",
        "subtitle": "Manage your active payment rails, integrations, and POS channels.",
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
          "Shortcode 512234. Supports LNMO, STK Push & account validation.",
          "Till number 882001. Ideal for in-person POS transactions.",
          "Visa/Mastercard with 3D Secure. Tokenization ready.",
          "Real-time collections from 50+ banks. Awaiting KYC approval."
        ],
        "items": [],
        "quickActions": [],
        "actions": [
          {
            "label": "API",
            "showLabel": true,
            "iconClass": "bi bi-code",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p32_apiConfigModal"
          },
          {
            "label": "New Transaction",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm pm-btn-primary",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p32_receivePaymentModal"
          }
        ],
        "table": null,
        "chart": [],
        "children": [
          {
            "id": "m-pesa-paybill",
            "columnClass": "col-md-3",
            "cardClass": "method-card",
            "style": "",
            "iconClass": "",
            "title": "M-Pesa PayBill",
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
              "Shortcode 512234. Supports LNMO, STK Push & account validation.",
              "MDR: 1.5%"
            ],
            "items": [],
            "quickActions": [],
            "actions": [],
            "table": null,
            "chart": [],
            "children": [],
            "tabs": [],
            "action": {
              "label": "M-Pesa PayBill",
              "showLabel": false,
              "iconClass": "bi bi-phone",
              "variantClass": "pm-btn",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p32_paybillConfigModal"
            }
          },
          {
            "id": "m-pesa-till-buy-goods",
            "columnClass": "col-md-3",
            "cardClass": "method-card",
            "style": "",
            "iconClass": "",
            "title": "M-Pesa Till (Buy Goods)",
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
              "Till number 882001. Ideal for in-person POS transactions.",
              "MDR: 1.0%"
            ],
            "items": [],
            "quickActions": [],
            "actions": [],
            "table": null,
            "chart": [],
            "children": [],
            "tabs": [],
            "action": {
              "label": "M-Pesa Till (Buy Goods)",
              "showLabel": false,
              "iconClass": "bi bi-shop",
              "variantClass": "pm-btn",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p32_tillConfigModal"
            }
          },
          {
            "id": "card-payments",
            "columnClass": "col-md-3",
            "cardClass": "method-card",
            "style": "",
            "iconClass": "",
            "title": "Card Payments",
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
              "Visa/Mastercard with 3D Secure. Tokenization ready.",
              "MDR: 2.9%"
            ],
            "items": [],
            "quickActions": [],
            "actions": [],
            "table": null,
            "chart": [],
            "children": [],
            "tabs": [],
            "action": {
              "label": "Card Payments",
              "showLabel": false,
              "iconClass": "bi bi-credit-card",
              "variantClass": "pm-btn",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p32_cardConfigModal"
            }
          },
          {
            "id": "pesalink-collections",
            "columnClass": "col-md-3",
            "cardClass": "method-card",
            "style": "",
            "iconClass": "",
            "title": "PesaLink Collections",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": {
              "text": "Pending",
              "className": "pm-badge pm-badge-warning",
              "iconClass": "",
              "style": ""
            },
            "lines": [
              "Real-time collections from 50+ banks. Awaiting KYC approval.",
              "MDR: Fixed KES 45"
            ],
            "items": [],
            "quickActions": [],
            "actions": [],
            "table": null,
            "chart": [],
            "children": [],
            "tabs": [],
            "action": {
              "label": "PesaLink Collections",
              "showLabel": false,
              "iconClass": "bi bi-bank",
              "variantClass": "pm-btn",
              "style": "",
              "kind": "open",
              "message": "",
              "disabled": false,
              "target": "p32_pesalinkConfigModal"
            }
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
        "id": "3-2-2-collections-dashboard-settlement",
        "columnClass": "col-12",
        "cardClass": "pm-card",
        "style": "",
        "iconClass": "bi bi-bar-chart-line-fill",
        "title": "3.2.2 — Collections Dashboard & Settlement",
        "subtitle": "Monitor live transaction feeds, analyze volume trends, and track bank settlements.",
        "label": "",
        "value": "",
        "description": "",
        "badge": null,
        "lines": [],
        "items": [],
        "quickActions": [],
        "actions": [
          {
            "label": "Deep Analytics",
            "showLabel": true,
            "iconClass": "bi bi-graph-up",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p32_analyticsModal"
          }
        ],
        "table": null,
        "chart": [],
        "children": [
          {
            "id": "live-transaction-feed",
            "columnClass": "col-lg-8",
            "cardClass": "utility-block",
            "style": "",
            "iconClass": "",
            "title": "Live Transaction Feed",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": null,
            "lines": [
              "All",
              "Successful",
              "Failed"
            ],
            "items": [],
            "quickActions": [],
            "actions": [],
            "table": {
              "columns": [
                "Time",
                "Customer",
                "Ref / ID",
                "Method",
                "Amount",
                "Status",
                "Action"
              ],
              "rows": [
                {
                  "cells": [
                    {
                      "text": "14:32",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "Alice W.",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "TXN-892110",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "PayBill",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "KES 4,500",
                      "strong": true,
                      "className": ""
                    },
                    {
                      "text": "Success",
                      "strong": false,
                      "className": "",
                      "badge": {
                        "text": "Success",
                        "className": "pm-badge pm-badge-success",
                        "iconClass": ""
                      }
                    },
                    {
                      "text": "",
                      "strong": false,
                      "className": "",
                      "actions": [
                        {
                          "label": "View",
                          "iconClass": "",
                          "variantClass": "pm-btn pm-btn-sm",
                          "kind": "open",
                          "target": "p32_txnDetailModal",
                          "message": "",
                          "disabled": false
                        }
                      ]
                    }
                  ],
                  "filterKey": "success"
                },
                {
                  "cells": [
                    {
                      "text": "14:15",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "John M.",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "TXN-892109",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "Till",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "KES 1,200",
                      "strong": true,
                      "className": ""
                    },
                    {
                      "text": "Success",
                      "strong": false,
                      "className": "",
                      "badge": {
                        "text": "Success",
                        "className": "pm-badge pm-badge-success",
                        "iconClass": ""
                      }
                    },
                    {
                      "text": "",
                      "strong": false,
                      "className": "",
                      "actions": [
                        {
                          "label": "View",
                          "iconClass": "",
                          "variantClass": "pm-btn pm-btn-sm",
                          "kind": "open",
                          "target": "p32_txnDetailModal",
                          "message": "",
                          "disabled": false
                        }
                      ]
                    }
                  ],
                  "filterKey": "success"
                },
                {
                  "cells": [
                    {
                      "text": "13:40",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "Sarah K.",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "TXN-892108",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "Visa",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "KES 8,500",
                      "strong": true,
                      "className": ""
                    },
                    {
                      "text": "Success",
                      "strong": false,
                      "className": "",
                      "badge": {
                        "text": "Success",
                        "className": "pm-badge pm-badge-success",
                        "iconClass": ""
                      }
                    },
                    {
                      "text": "",
                      "strong": false,
                      "className": "",
                      "actions": [
                        {
                          "label": "View",
                          "iconClass": "",
                          "variantClass": "pm-btn pm-btn-sm",
                          "kind": "open",
                          "target": "p32_txnDetailModal",
                          "message": "",
                          "disabled": false
                        }
                      ]
                    }
                  ],
                  "filterKey": "success"
                },
                {
                  "cells": [
                    {
                      "text": "13:12",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "David O.",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "TXN-892107",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "PayBill",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "KES 2,000",
                      "strong": true,
                      "className": ""
                    },
                    {
                      "text": "Failed",
                      "strong": false,
                      "className": "",
                      "badge": {
                        "text": "Failed",
                        "className": "pm-badge pm-badge-danger",
                        "iconClass": ""
                      }
                    },
                    {
                      "text": "",
                      "strong": false,
                      "className": "",
                      "actions": [
                        {
                          "label": "View",
                          "iconClass": "",
                          "variantClass": "pm-btn pm-btn-sm",
                          "kind": "open",
                          "target": "p32_txnDetailModal",
                          "message": "",
                          "disabled": false
                        }
                      ]
                    }
                  ],
                  "filterKey": "failed"
                },
                {
                  "cells": [
                    {
                      "text": "12:55",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "Mary J.",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "TXN-892106",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "Till",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "KES 550",
                      "strong": true,
                      "className": ""
                    },
                    {
                      "text": "Success",
                      "strong": false,
                      "className": "",
                      "badge": {
                        "text": "Success",
                        "className": "pm-badge pm-badge-success",
                        "iconClass": ""
                      }
                    },
                    {
                      "text": "",
                      "strong": false,
                      "className": "",
                      "actions": [
                        {
                          "label": "View",
                          "iconClass": "",
                          "variantClass": "pm-btn pm-btn-sm",
                          "kind": "open",
                          "target": "p32_txnDetailModal",
                          "message": "",
                          "disabled": false
                        }
                      ]
                    }
                  ],
                  "filterKey": "success"
                }
              ]
            },
            "chart": [],
            "children": [],
            "tabs": [
              {
                "key": "all",
                "label": "All"
              },
              {
                "key": "success",
                "label": "Successful"
              },
              {
                "key": "failed",
                "label": "Failed"
              }
            ],
            "action": null
          },
          {
            "id": "collection-breakdown",
            "columnClass": "col-lg-4",
            "cardClass": "utility-block mb-3",
            "style": "",
            "iconClass": "",
            "title": "Collection Breakdown",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": null,
            "lines": [
              "PayBill: 62%",
              "Till: 24%",
              "Card: 11%",
              "PesaLink: 3%"
            ],
            "items": [],
            "quickActions": [],
            "actions": [],
            "table": null,
            "chart": [
              {
                "label": "PayBill",
                "value": 85.0,
                "color": "var(--pm-accent)"
              },
              {
                "label": "Till",
                "value": 60.0,
                "color": "var(--pm-info)"
              },
              {
                "label": "Card",
                "value": 40.0,
                "color": "var(--pm-purple)"
              },
              {
                "label": "Bank",
                "value": 15.0,
                "color": "var(--pm-warning)"
              }
            ],
            "children": [],
            "tabs": [],
            "action": null
          },
          {
            "id": "settlement-pipeline",
            "columnClass": "col-lg-4",
            "cardClass": "utility-block",
            "style": "",
            "iconClass": "",
            "title": "Settlement Pipeline",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": null,
            "lines": [
              "M-Pesa balance",
              "KES 304,100",
              "Card & Bank batches",
              "KES 89,200"
            ],
            "items": [
              {
                "title": "T+0 (Today)",
                "subtitle": "M-Pesa balance KES 304,100",
                "value": "",
                "iconClass": "",
                "iconContainerClass": "",
                "iconContainerStyle": "",
                "badge": null
              },
              {
                "title": "T+1 (Tomorrow)",
                "subtitle": "Card & Bank batches KES 89,200",
                "value": "",
                "iconClass": "",
                "iconContainerClass": "",
                "iconContainerStyle": "",
                "badge": null
              }
            ],
            "quickActions": [],
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
                "target": "p32_settlementModal"
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
    "id": "block-5",
    "wrapperClass": "row g-3",
    "cards": [
      {
        "id": "3-2-3-customer-management",
        "columnClass": "col-12",
        "cardClass": "pm-card",
        "style": "",
        "iconClass": "bi bi-people-fill",
        "title": "3.2.3 — Customer Management",
        "subtitle": "Customer directory, lifetime value tracking, communication and segmentation.",
        "label": "",
        "value": "",
        "description": "",
        "badge": null,
        "lines": [],
        "items": [],
        "quickActions": [],
        "actions": [
          {
            "label": "Message",
            "showLabel": true,
            "iconClass": "bi bi-chat-dots",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p32_sendReminderModal"
          },
          {
            "label": "Add Customer",
            "showLabel": true,
            "iconClass": "bi bi-person-plus",
            "variantClass": "pm-btn pm-btn-sm pm-btn-primary",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p32_addCustomerModal"
          }
        ],
        "table": null,
        "chart": [],
        "children": [
          {
            "id": "card",
            "columnClass": "col-lg-3",
            "cardClass": "utility-block text-center",
            "style": "",
            "iconClass": "",
            "title": "",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": null,
            "lines": [
              "1,204",
              "Total Customers",
              "VIP (>KES 50k)",
              "142",
              "Regular",
              "810",
              "New (30 days)",
              "252"
            ],
            "items": [],
            "quickActions": [],
            "actions": [
              {
                "label": "Manage Segments",
                "showLabel": true,
                "iconClass": "",
                "variantClass": "pm-btn pm-btn-sm",
                "style": "",
                "kind": "open",
                "message": "",
                "disabled": false,
                "target": "p32_customerSegmentModal"
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
            "columnClass": "col-lg-9",
            "cardClass": "utility-block",
            "style": "",
            "iconClass": "",
            "title": "",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": null,
            "lines": [],
            "items": [],
            "quickActions": [],
            "actions": [],
            "table": {
              "columns": [
                "Customer Name",
                "Contact",
                "Segment",
                "LTV (Total Spend)",
                "Last Payment",
                "Action"
              ],
              "rows": [
                {
                  "cells": [
                    {
                      "text": "Alice Wanjiku",
                      "strong": true,
                      "className": ""
                    },
                    {
                      "text": "0722 *** 112",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "VIP",
                      "strong": false,
                      "className": "",
                      "badge": {
                        "text": "VIP",
                        "className": "pm-badge pm-badge-purple",
                        "iconClass": ""
                      }
                    },
                    {
                      "text": "KES 142,500",
                      "strong": true,
                      "className": ""
                    },
                    {
                      "text": "Today",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "",
                      "strong": false,
                      "className": "",
                      "actions": [
                        {
                          "label": "Msg",
                          "iconClass": "",
                          "variantClass": "pm-btn pm-btn-sm",
                          "kind": "open",
                          "target": "p32_sendReminderModal",
                          "message": "",
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
                      "text": "John Mark",
                      "strong": true,
                      "className": ""
                    },
                    {
                      "text": "0711 *** 443",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "Regular",
                      "strong": false,
                      "className": "",
                      "badge": {
                        "text": "Regular",
                        "className": "pm-badge pm-badge-success",
                        "iconClass": ""
                      }
                    },
                    {
                      "text": "KES 12,400",
                      "strong": true,
                      "className": ""
                    },
                    {
                      "text": "Today",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "",
                      "strong": false,
                      "className": "",
                      "actions": [
                        {
                          "label": "Msg",
                          "iconClass": "",
                          "variantClass": "pm-btn pm-btn-sm",
                          "kind": "open",
                          "target": "p32_sendReminderModal",
                          "message": "",
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
                      "text": "Sarah K.",
                      "strong": true,
                      "className": ""
                    },
                    {
                      "text": "0733 *** 991",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "VIP",
                      "strong": false,
                      "className": "",
                      "badge": {
                        "text": "VIP",
                        "className": "pm-badge pm-badge-purple",
                        "iconClass": ""
                      }
                    },
                    {
                      "text": "KES 85,000",
                      "strong": true,
                      "className": ""
                    },
                    {
                      "text": "Yesterday",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "",
                      "strong": false,
                      "className": "",
                      "actions": [
                        {
                          "label": "Msg",
                          "iconClass": "",
                          "variantClass": "pm-btn pm-btn-sm",
                          "kind": "open",
                          "target": "p32_sendReminderModal",
                          "message": "",
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
                      "text": "David O.",
                      "strong": true,
                      "className": ""
                    },
                    {
                      "text": "0721 *** 220",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "Churn Risk",
                      "strong": false,
                      "className": "",
                      "badge": {
                        "text": "Churn Risk",
                        "className": "pm-badge pm-badge-danger",
                        "iconClass": ""
                      }
                    },
                    {
                      "text": "KES 8,000",
                      "strong": true,
                      "className": ""
                    },
                    {
                      "text": "45 days ago",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "",
                      "strong": false,
                      "className": "",
                      "actions": [
                        {
                          "label": "Msg",
                          "iconClass": "",
                          "variantClass": "pm-btn pm-btn-sm",
                          "kind": "open",
                          "target": "p32_sendReminderModal",
                          "message": "",
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
                      "text": "Mary J.",
                      "strong": true,
                      "className": ""
                    },
                    {
                      "text": "0755 *** 881",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "New",
                      "strong": false,
                      "className": "",
                      "badge": {
                        "text": "New",
                        "className": "pm-badge pm-badge-info",
                        "iconClass": ""
                      }
                    },
                    {
                      "text": "KES 550",
                      "strong": true,
                      "className": ""
                    },
                    {
                      "text": "Today",
                      "strong": false,
                      "className": ""
                    },
                    {
                      "text": "",
                      "strong": false,
                      "className": "",
                      "actions": [
                        {
                          "label": "Msg",
                          "iconClass": "",
                          "variantClass": "pm-btn pm-btn-sm",
                          "kind": "open",
                          "target": "p32_sendReminderModal",
                          "message": "",
                          "disabled": false
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
        "id": "3-2-4-refund-dispute-management",
        "columnClass": "col-12",
        "cardClass": "pm-card",
        "style": "",
        "iconClass": "bi bi-shield-exclamation",
        "title": "3.2.4 — Refund & Dispute Management",
        "subtitle": "Process full/partial refunds, manage chargebacks, and track resolution workflows.",
        "label": "",
        "value": "",
        "description": "",
        "badge": {
          "text": "2 Action Required",
          "className": "pm-badge pm-badge-warning",
          "iconClass": "",
          "style": ""
        },
        "lines": [],
        "items": [],
        "quickActions": [],
        "actions": [
          {
            "label": "Process Refund",
            "showLabel": true,
            "iconClass": "bi bi-arrow-return-left",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p32_refundModal"
          }
        ],
        "table": null,
        "chart": [],
        "children": [
          {
            "id": "active-disputes-chargebacks",
            "columnClass": "col-lg-6",
            "cardClass": "utility-block",
            "style": "",
            "iconClass": "",
            "title": "Active Disputes (Chargebacks)",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": {
              "text": "2 Action Required",
              "className": "pm-badge pm-badge-warning",
              "iconClass": "",
              "style": ""
            },
            "lines": [
              "Reason: Fraudulent transaction claim",
              "Visa ***4112 · KES 12,500",
              "Reason: Goods not as described",
              "M-Pesa · KES 4,200"
            ],
            "items": [
              {
                "title": "CB-20250627-01",
                "subtitle": "Reason: Fraudulent transaction claim Visa ***4112 · KES 12,500",
                "value": "",
                "iconClass": "",
                "iconContainerClass": "",
                "iconContainerStyle": "",
                "badge": {
                  "text": "Due in 2 days",
                  "className": "pm-badge pm-badge-danger mb-2",
                  "iconClass": "",
                  "style": ""
                },
                "action": {
                  "label": "Defend",
                  "showLabel": true,
                  "iconClass": "",
                  "variantClass": "pm-btn pm-btn-sm pm-btn-danger",
                  "style": "",
                  "kind": "open",
                  "message": "",
                  "disabled": false,
                  "target": "p32_disputeModal"
                }
              },
              {
                "title": "CB-20250625-04",
                "subtitle": "Reason: Goods not as described M-Pesa · KES 4,200",
                "value": "",
                "iconClass": "",
                "iconContainerClass": "",
                "iconContainerStyle": "",
                "badge": {
                  "text": "Reviewing",
                  "className": "pm-badge pm-badge-warning mb-2",
                  "iconClass": "",
                  "style": ""
                },
                "action": {
                  "label": "Details",
                  "showLabel": true,
                  "iconClass": "",
                  "variantClass": "pm-btn pm-btn-sm",
                  "style": "",
                  "kind": "open",
                  "message": "",
                  "disabled": false,
                  "target": "p32_disputeModal"
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
            "id": "refund-queue",
            "columnClass": "col-lg-6",
            "cardClass": "utility-block",
            "style": "",
            "iconClass": "",
            "title": "Refund Queue",
            "subtitle": "",
            "label": "",
            "value": "",
            "description": "",
            "badge": {
              "text": "2 Pending Approval",
              "className": "pm-badge pm-badge-info",
              "iconClass": "",
              "style": ""
            },
            "lines": [
              "Customer: John Mark · M-Pesa",
              "KES 3,400 (Full)",
              "Customer: Sarah W. · Visa ***1180",
              "KES 1,500 (Partial)"
            ],
            "items": [
              {
                "title": "RF-20250627-11",
                "subtitle": "Customer: John Mark · M-Pesa KES 3,400 (Full)",
                "value": "",
                "iconClass": "",
                "iconContainerClass": "",
                "iconContainerStyle": "",
                "badge": {
                  "text": "Pending",
                  "className": "pm-badge pm-badge-info mb-2",
                  "iconClass": "",
                  "style": ""
                },
                "action": {
                  "label": "Approve",
                  "showLabel": true,
                  "iconClass": "",
                  "variantClass": "pm-btn pm-btn-sm",
                  "style": "",
                  "kind": "open",
                  "message": "",
                  "disabled": false,
                  "target": "p32_refundModal"
                }
              },
              {
                "title": "RF-20250626-09",
                "subtitle": "Customer: Sarah W. · Visa ***1180 KES 1,500 (Partial)",
                "value": "",
                "iconClass": "",
                "iconContainerClass": "",
                "iconContainerStyle": "",
                "badge": {
                  "text": "Pending",
                  "className": "pm-badge pm-badge-info mb-2",
                  "iconClass": "",
                  "style": ""
                },
                "action": {
                  "label": "Approve",
                  "showLabel": true,
                  "iconClass": "",
                  "variantClass": "pm-btn pm-btn-sm",
                  "style": "",
                  "kind": "open",
                  "message": "",
                  "disabled": false,
                  "target": "p32_refundModal"
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
  }
] as UiPageBlock[];
  readonly modals: ModalConfig[] = [
  {
    "id": "p32_receivePaymentModal",
    "title": "Receive Payment",
    "iconClass": "bi bi-wallet2",
    "sizeClass": "modal-lg",
    "content": null,
    "steps": [
      {
        "label": "Step 1: Transaction Details",
        "content": {
          "notes": [
            "Step 1: Transaction Details"
          ],
          "alerts": [],
          "stats": [],
          "fields": [
            {
              "key": "amount_kes",
              "label": "Amount (KES)",
              "type": "number",
              "value": "1500",
              "placeholder": "",
              "options": [],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-12"
            },
            {
              "key": "customer_name_optional",
              "label": "Customer Name (Optional)",
              "type": "text",
              "value": "",
              "placeholder": "Enter customer name",
              "options": [],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-12"
            },
            {
              "key": "reference_order_id",
              "label": "Reference / Order ID",
              "type": "text",
              "value": "ORD-2025-0891",
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
        "label": "Step 2: Collection Method",
        "content": {
          "notes": [
            "Step 2: Collection Method",
            "M-Pesa STK Push",
            "Send prompt to customer's phone",
            "Dynamic QR Code",
            "Customer scans to pay",
            "Payment Link",
            "Send link via SMS/WhatsApp"
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
        }
      },
      {
        "label": "Step 3: Execute",
        "content": {
          "notes": [
            "Step 3: Execute",
            "Clicking submit will trigger an M-Pesa PIN prompt on the customer's phone."
          ],
          "alerts": [
            {
              "text": "Amount KES 1,500 Method M-Pesa STK Push",
              "tone": "info"
            }
          ],
          "stats": [],
          "fields": [
            {
              "key": "customer_phone_number",
              "label": "Customer Phone Number",
              "type": "text",
              "value": "0712345678",
              "placeholder": "07XX XXX XXX",
              "options": [],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-12"
            }
          ],
          "details": [
            {
              "label": "Amount",
              "value": "KES 1,500"
            },
            {
              "label": "Method",
              "value": "M-Pesa STK Push"
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
        "label": "STK Push Sent!",
        "content": {
          "notes": [
            "Awaiting customer to enter PIN.",
            "Loading...",
            "Status will update automatically once payment is received."
          ],
          "alerts": [],
          "stats": [],
          "fields": [],
          "details": [],
          "items": [],
          "tables": [],
          "actions": [],
          "image": null,
          "receipt": {
            "title": "STK Push Sent!",
            "description": "Awaiting customer to enter PIN. Status will update automatically once payment is received.",
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
        "target": "p32_receivePaymentModal"
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
        "target": "p32_receivePaymentModal",
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
    "id": "p32_generateQRModal",
    "title": "Generate Payment QR",
    "iconClass": "bi bi-qr-code",
    "sizeClass": "",
    "content": null,
    "steps": [],
    "tabs": [
      {
        "id": "qr-dynamic",
        "label": "Dynamic (Specific Amount)",
        "content": {
          "notes": [
            "Scan with PayMo or M-Pesa App"
          ],
          "alerts": [],
          "stats": [],
          "fields": [
            {
              "key": "amount_kes",
              "label": "Amount (KES)",
              "type": "number",
              "value": "2500",
              "placeholder": "",
              "options": [],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-12"
            },
            {
              "key": "order_reference",
              "label": "Order Reference",
              "type": "text",
              "value": "INV-99201",
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
          "image": {
            "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWAQMAAAAGz+OhAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABG0lEQVRIib2VMY7EIAxFjVJQcgSOwsVGYbhZjsIRUlKg8Xyb7K5WSjnzrRTxawD721/kJqoiDknHyG1kS8bH2QPnpGOmQ/JL8lMkkFhSAyIDWW6qjclQBu0idLadEpExmddez4KGj3/9+C5bWps3+vsuW7GpSv7NGAx3mUlRA/vte+w7iZ1lSrlmWvaoLw6DyuQar+o9r4PC6ileAJtpVR5Dtze1mUbDo0mtfZ7h3M2O9qWB5vqTCQzz60Uuw1/vH4W5mCGt2KsPbyAxcV2BadOr9gy2wq3BLwI3pLBrT0JoPaxVOShs+QLk5lUPJjcOW/5rzHue/zyZwyzMf5XJps0WTMHdn8O89riC+xG+wGE/Wiu2O6+xZrCbeAOPkabORzx8XAAAAABJRU5ErkJggg==",
            "alt": "QR Code",
            "className": "",
            "style": "width:150px;height:150px;mix-blend-mode:multiply"
          },
          "receipt": null
        }
      },
      {
        "id": "qr-static",
        "label": "Static (Any Amount)",
        "content": {
          "notes": [
            "Customer will scan and enter the amount manually."
          ],
          "alerts": [],
          "stats": [],
          "fields": [
            {
              "key": "till_paybill_routing",
              "label": "Till / PayBill Routing",
              "type": "select",
              "value": "Till Number 882001",
              "placeholder": "",
              "options": [
                "Till Number 882001",
                "PayBill 512234"
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
      }
    ],
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
        "target": "p32_generateQRModal"
      },
      {
        "label": "Download / Print",
        "showLabel": true,
        "iconClass": "bi bi-download",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "QR Code Generated & Saved to Gallery",
        "disabled": false,
        "target": "p32_generateQRModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p32_paybillConfigModal",
    "title": "M-Pesa PayBill Settings",
    "iconClass": "bi bi-phone",
    "sizeClass": "",
    "content": {
      "notes": [],
      "alerts": [
        {
          "text": "KYC Update Required: Please upload your latest CR12 document to avoid service suspension.",
          "tone": "warning"
        }
      ],
      "stats": [],
      "fields": [
        {
          "key": "shortcode",
          "label": "Shortcode",
          "type": "text",
          "value": "512234",
          "placeholder": "",
          "options": [],
          "style": "background:var(--pm-surface-2)",
          "checked": false,
          "disabled": true,
          "columnClass": "col-12"
        },
        {
          "key": "account_number_validation",
          "label": "Account Number Validation",
          "type": "select",
          "value": "Enabled (Strict API Lookup)",
          "placeholder": "",
          "options": [
            "Enabled (Strict API Lookup)",
            "Regex Pattern matching",
            "Disabled (Accept any)"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "customer_fee_configuration",
          "label": "Customer Fee Configuration",
          "type": "select",
          "value": "Customer pays M-Pesa fee",
          "placeholder": "",
          "options": [
            "Customer pays M-Pesa fee",
            "Merchant absorbs fee (Zero-rated)"
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
        "target": "p32_paybillConfigModal"
      },
      {
        "label": "Save Settings",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "PayBill configuration saved. KYC document uploaded.",
        "disabled": false,
        "target": "p32_paybillConfigModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p32_tillConfigModal",
    "title": "M-Pesa Till Settings",
    "iconClass": "bi bi-shop",
    "sizeClass": "",
    "content": {
      "notes": [],
      "alerts": [
        {
          "text": "Current MDR Rate 1.0% Settlement Real-time to Wallet",
          "tone": "info"
        }
      ],
      "stats": [],
      "fields": [
        {
          "key": "till_number",
          "label": "Till Number",
          "type": "text",
          "value": "882001",
          "placeholder": "",
          "options": [],
          "style": "background:var(--pm-surface-2)",
          "checked": false,
          "disabled": true,
          "columnClass": "col-12"
        },
        {
          "key": "store_branch_name",
          "label": "Store / Branch Name",
          "type": "text",
          "value": "Nairobi CBD Branch",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "enable_lnmo_api_for_online_checkout",
          "label": "Enable LNMO API for online checkout",
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
          "key": "allow_staff_to_initiate_reversals",
          "label": "Allow staff to initiate reversals",
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
      "details": [
        {
          "label": "Current MDR Rate",
          "value": "1.0%"
        },
        {
          "label": "Settlement",
          "value": "Real-time to Wallet"
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
        "label": "Cancel",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Cancel selected.",
        "disabled": false,
        "target": "p32_tillConfigModal"
      },
      {
        "label": "Save Settings",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Till settings updated successfully.",
        "disabled": false,
        "target": "p32_tillConfigModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p32_pesalinkConfigModal",
    "title": "PesaLink Collections",
    "iconClass": "bi bi-bank",
    "sizeClass": "",
    "content": {
      "notes": [
        "Awaiting KYC Approval",
        "Your PesaLink merchant account request is currently under review by the acquiring bank. This usually takes 24-48 hours.",
        "Features once activated:",
        "Receive funds from 50+ local banks instantly",
        "Alias routing (Pay to phone number/Till)",
        "Fixed KES 45 fee per transaction regardless of amount",
        "Higher transaction limits (up to KES 999,999)"
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
        "target": "p32_pesalinkConfigModal"
      }
    ]
  },
  {
    "id": "p32_cardConfigModal",
    "title": "Card Payment Settings",
    "iconClass": "bi bi-credit-card",
    "sizeClass": "",
    "content": {
      "notes": [
        "Enable Tokenization",
        "Allow customers to save cards securely for 1-click checkout. Recommended by AI.",
        "Accepted Currencies",
        "KES",
        "USD",
        "EUR",
        "GBP"
      ],
      "alerts": [],
      "stats": [],
      "fields": [
        {
          "key": "accept_visa_mastercard",
          "label": "Accept Visa / Mastercard",
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
          "key": "enforce_3d_secure_authentication",
          "label": "Enforce 3D Secure Authentication",
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
        "target": "p32_cardConfigModal"
      },
      {
        "label": "Save Settings",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Card settings updated. Tokenization activated.",
        "disabled": false,
        "target": "p32_cardConfigModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p32_apiConfigModal",
    "title": "API Integration & Keys",
    "iconClass": "bi bi-code-slash",
    "sizeClass": "modal-lg",
    "content": null,
    "steps": [],
    "tabs": [
      {
        "id": "api-keys",
        "label": "API Keys",
        "content": {
          "notes": [],
          "alerts": [
            {
              "text": "Your LNMO Production Keys will expire in 3 days. Please rotate them.",
              "tone": "purple"
            }
          ],
          "stats": [],
          "fields": [
            {
              "key": "consumer_key",
              "label": "Consumer Key",
              "type": "password",
              "value": "asdfasdfasdfasdf",
              "placeholder": "",
              "options": [],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-12"
            },
            {
              "key": "consumer_secret",
              "label": "Consumer Secret",
              "type": "password",
              "value": "asdfasdfasdfasdf",
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
          "actions": [
            {
              "label": "Action",
              "showLabel": false,
              "iconClass": "bi bi-clipboard",
              "variantClass": "pm-btn pm-btn-sm",
              "style": "",
              "kind": "notify",
              "message": "Action selected.",
              "disabled": false
            },
            {
              "label": "Action",
              "showLabel": false,
              "iconClass": "bi bi-clipboard",
              "variantClass": "pm-btn pm-btn-sm",
              "style": "",
              "kind": "notify",
              "message": "Action selected.",
              "disabled": false
            },
            {
              "label": "Rotate Keys",
              "showLabel": true,
              "iconClass": "bi bi-arrow-repeat",
              "variantClass": "pm-btn pm-btn-sm pm-btn-danger",
              "style": "",
              "kind": "process",
              "message": "Keys rotated successfully. Update your application.",
              "disabled": false,
              "target": "p32_apiConfigModal",
              "reference": ""
            }
          ],
          "image": null,
          "receipt": null
        }
      },
      {
        "id": "api-webhooks",
        "label": "Webhooks",
        "content": {
          "notes": [],
          "alerts": [],
          "stats": [],
          "fields": [
            {
              "key": "validation_url",
              "label": "Validation URL",
              "type": "text",
              "value": "https://api.yourdomain.com/paymo/validate",
              "placeholder": "",
              "options": [],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-12"
            },
            {
              "key": "confirmation_url",
              "label": "Confirmation URL",
              "type": "text",
              "value": "https://api.yourdomain.com/paymo/confirm",
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
          "actions": [
            {
              "label": "Save Endpoints",
              "showLabel": true,
              "iconClass": "",
              "variantClass": "pm-btn pm-btn-sm pm-btn-primary",
              "style": "",
              "kind": "notify",
              "message": "Save Endpoints selected.",
              "disabled": false
            }
          ],
          "image": null,
          "receipt": null
        }
      },
      {
        "id": "api-logs",
        "label": "Logs",
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
                "Time",
                "Endpoint",
                "Status"
              ],
              "rows": [
                {
                  "cells": [
                    {
                      "text": "10:41 AM",
                      "strong": false,
                      "className": "",
                      "style": ""
                    },
                    {
                      "text": "/v1/stkpush/process",
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
                        "text": "200 OK",
                        "className": "pm-badge pm-badge-success",
                        "iconClass": "",
                        "style": ""
                      }
                    }
                  ],
                  "filterKey": ""
                },
                {
                  "cells": [
                    {
                      "text": "10:35 AM",
                      "strong": false,
                      "className": "",
                      "style": ""
                    },
                    {
                      "text": "/v1/validation",
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
                        "text": "200 OK",
                        "className": "pm-badge pm-badge-success",
                        "iconClass": "",
                        "style": ""
                      }
                    }
                  ],
                  "filterKey": ""
                },
                {
                  "cells": [
                    {
                      "text": "09:12 AM",
                      "strong": false,
                      "className": "",
                      "style": ""
                    },
                    {
                      "text": "/v1/stkpush/process",
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
                        "text": "500 ERR",
                        "className": "pm-badge pm-badge-danger",
                        "iconClass": "",
                        "style": ""
                      }
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
      }
    ],
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
        "target": "p32_apiConfigModal"
      }
    ]
  },
  {
    "id": "p32_settlementModal",
    "title": "Settlement Pipeline",
    "iconClass": "bi bi-bank",
    "sizeClass": "modal-lg",
    "content": {
      "notes": [
        "Scheduled Bank Payouts",
        "KES 304,100",
        "KES 89,200",
        "KES 25,000"
      ],
      "alerts": [
        {
          "text": "CLEARED (WALLET) KES 304,100 Available for payout",
          "tone": "info"
        },
        {
          "text": "PENDING (T+1) KES 89,200 Card & Bank clearing",
          "tone": "info"
        },
        {
          "text": "HELD (RESERVE) KES 25,000 Chargeback rolling reserve",
          "tone": "warning"
        }
      ],
      "stats": [
        {
          "label": "Available for payout",
          "value": "CLEARED (WALLET)",
          "className": "p-3 rounded"
        },
        {
          "label": "Card & Bank clearing",
          "value": "PENDING (T+1)",
          "className": "p-3 rounded"
        },
        {
          "label": "Chargeback rolling reserve",
          "value": "HELD (RESERVE)",
          "className": "p-3 rounded"
        }
      ],
      "fields": [],
      "details": [],
      "items": [],
      "tables": [
        {
          "columns": [
            "Batch ID",
            "Date",
            "Gross",
            "Fees",
            "Net Payout",
            "Status"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "SET-8821",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Today 4PM",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 142,500",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 2,137",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 140,363",
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
                    "text": "Processing",
                    "className": "pm-badge pm-badge-info",
                    "iconClass": "",
                    "style": ""
                  }
                }
              ],
              "filterKey": ""
            },
            {
              "cells": [
                {
                  "text": "SET-8820",
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
                  "text": "KES 210,000",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 3,150",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 206,850",
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
                    "text": "Cleared",
                    "className": "pm-badge pm-badge-success",
                    "iconClass": "",
                    "style": ""
                  }
                }
              ],
              "filterKey": ""
            }
          ]
        }
      ],
      "actions": [
        {
          "label": "Withdraw Available Funds to Bank",
          "showLabel": true,
          "iconClass": "",
          "variantClass": "pm-btn pm-btn-sm pm-btn-primary",
          "style": "",
          "kind": "process",
          "message": "Manual withdrawal of KES 304,100 initiated to Equity Bank.",
          "disabled": false,
          "target": "p32_settlementModal",
          "reference": ""
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
        "target": "p32_settlementModal"
      }
    ]
  },
  {
    "id": "p32_analyticsModal",
    "title": "Collection Analytics",
    "iconClass": "bi bi-graph-up",
    "sizeClass": "modal-xl",
    "content": {
      "notes": [
        "Volume Trend (Last 7 Days)",
        "Key Metrics",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
      ],
      "alerts": [],
      "stats": [
        {
          "label": "KES 2,240",
          "value": "Avg Transaction Value",
          "className": "p-3 border rounded mb-2"
        },
        {
          "label": "1:00 PM - 2:00 PM",
          "value": "Peak Collection Hour",
          "className": "p-3 border rounded mb-2"
        },
        {
          "label": "32% / 68%",
          "value": "New vs Repeat Customers",
          "className": "p-3 border rounded"
        }
      ],
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
        "target": "p32_analyticsModal"
      },
      {
        "label": "Export Data",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "open",
        "message": "",
        "disabled": false,
        "target": "p32_exportReportModal"
      }
    ]
  },
  {
    "id": "p32_refundModal",
    "title": "Process Refund",
    "iconClass": "bi bi-arrow-return-left",
    "sizeClass": "",
    "content": null,
    "steps": [
      {
        "label": "Step 1: Select Transaction",
        "content": {
          "notes": [
            "Step 1: Select Transaction",
            "TXN-99120 • M-Pesa • Today 11:42 AM",
            "TXN-88192 • Visa • Yesterday"
          ],
          "alerts": [
            {
              "text": "John Mark KES 3,400 TXN-99120 • M-Pesa • Today 11:42 AM",
              "tone": "info"
            }
          ],
          "stats": [],
          "fields": [],
          "details": [
            {
              "label": "John Mark",
              "value": "KES 3,400"
            },
            {
              "label": "Sarah W.",
              "value": "KES 1,500"
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
        "label": "Step 2: Refund Details",
        "content": {
          "notes": [
            "Step 2: Refund Details"
          ],
          "alerts": [
            {
              "text": "Original Transaction: KES 3,400 (John Mark)",
              "tone": "info"
            }
          ],
          "stats": [],
          "fields": [
            {
              "key": "refund_type",
              "label": "Refund Type",
              "type": "select",
              "value": "Full Refund (KES 3,400)",
              "placeholder": "",
              "options": [
                "Full Refund (KES 3,400)",
                "Partial Refund"
              ],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-12"
            },
            {
              "key": "reason",
              "label": "Reason",
              "type": "select",
              "value": "Customer requested cancellation",
              "placeholder": "",
              "options": [
                "Customer requested cancellation",
                "Out of stock / Unavailable",
                "Fraudulent transaction",
                "Duplicate charge"
              ],
              "style": "",
              "checked": false,
              "disabled": false,
              "columnClass": "col-12"
            },
            {
              "key": "authorization_pin",
              "label": "PIN to authorize",
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
      },
      {
        "label": "Refund Initiated",
        "content": {
          "notes": [
            "KES 3,400 will be reversed to John Mark's M-Pesa account.",
            "Ref: REF-PM-20250627-011"
          ],
          "alerts": [],
          "stats": [],
          "fields": [],
          "details": [],
          "items": [],
          "tables": [],
          "actions": [],
          "image": null,
          "receipt": {
            "title": "Refund Initiated",
            "description": "KES 3,400 will be reversed to John Mark's M-Pesa account. Ref: REF-PM-20250627-011",
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
        "target": "p32_refundModal"
      },
      {
        "label": "Continue",
        "showLabel": true,
        "iconClass": "bi bi-arrow-right",
        "variantClass": "pm-btn pm-btn-warning",
        "style": "color:#fff",
        "kind": "next",
        "message": "Continue completed.",
        "disabled": false,
        "target": "p32_refundModal",
        "stepLabels": [
          "Continue",
          "Continue",
          "Done"
        ]
      }
    ]
  },
  {
    "id": "p32_disputeModal",
    "title": "Dispute / Chargeback Management",
    "iconClass": "bi bi-shield-exclamation",
    "sizeClass": "modal-lg",
    "content": {
      "notes": [
        "Action: Defend Chargeback",
        "Dispute Details"
      ],
      "alerts": [
        {
          "text": "Dispute Details ID CB-20250627-01 Amount KES 12,500 Method Visa ***4112 Reason Fraud Claim Deadline 2 days",
          "tone": "info"
        }
      ],
      "stats": [
        {
          "label": "Deadline 2 days",
          "value": "ID CB-20250627-01",
          "className": "p-3 border rounded"
        }
      ],
      "fields": [
        {
          "key": "defense_evidence",
          "label": "Defense Evidence",
          "type": "select",
          "value": "Proof of delivery / receipt",
          "placeholder": "",
          "options": [
            "Proof of delivery / receipt",
            "Customer communication logs",
            "Digital service access logs"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-md-7"
        },
        {
          "key": "upload_documents",
          "label": "Upload Documents",
          "type": "file",
          "value": "",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-md-7"
        },
        {
          "key": "notes",
          "label": "Notes",
          "type": "textarea",
          "value": "Customer signed for the delivery on 25 Jun. Attached is the signed waybill and GPS logs.",
          "placeholder": "",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-md-7"
        }
      ],
      "details": [
        {
          "label": "ID",
          "value": "CB-20250627-01"
        },
        {
          "label": "Amount",
          "value": "KES 12,500"
        },
        {
          "label": "Method",
          "value": "Visa ***4112"
        },
        {
          "label": "Reason",
          "value": "Fraud Claim"
        },
        {
          "label": "Deadline",
          "value": "2 days"
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
        "label": "Accept Chargeback (Refund)",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-danger",
        "style": "",
        "kind": "process",
        "message": "Chargeback accepted. KES 12,500 reversed.",
        "disabled": false,
        "target": "p32_disputeModal",
        "reference": ""
      },
      {
        "label": "Submit Evidence",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Evidence submitted to acquiring bank. Status changed to Reviewing.",
        "disabled": false,
        "target": "p32_disputeModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p32_txnDetailModal",
    "title": "Transaction Details",
    "iconClass": "bi bi-receipt",
    "sizeClass": "",
    "content": {
      "notes": [
        "KES 4,500",
        "Success"
      ],
      "alerts": [],
      "stats": [],
      "fields": [],
      "details": [
        {
          "label": "Txn ID",
          "value": "TXN-PM-892110"
        },
        {
          "label": "Date",
          "value": "27 Jun 2025, 14:32"
        },
        {
          "label": "Customer",
          "value": "Alice Wanjiku"
        },
        {
          "label": "Phone",
          "value": "0722 *** 112"
        },
        {
          "label": "Method",
          "value": "M-Pesa PayBill"
        },
        {
          "label": "MDR Fee",
          "value": "KES 67.50"
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
        "label": "Refund",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "open",
        "message": "",
        "disabled": false,
        "target": "p32_refundModal",
        "replaceCurrent": true
      },
      {
        "label": "Send Receipt",
        "showLabel": true,
        "iconClass": "bi bi-send",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Receipt sent to customer via SMS.",
        "disabled": false,
        "target": "p32_txnDetailModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p32_customerSegmentModal",
    "title": "Customer Segments & VIPs",
    "iconClass": "bi bi-pie-chart",
    "sizeClass": "modal-lg",
    "content": {
      "notes": [
        "Auto-Segmentation Rules",
        "Mark as VIP if Lifetime Value > KES 50,000",
        "Mark as Churn Risk if no payment in 90 days"
      ],
      "alerts": [],
      "stats": [
        {
          "label": "142",
          "value": "VIP (>KES 50k LTV)",
          "className": "p-3 border rounded text-center"
        },
        {
          "label": "810",
          "value": "REGULAR (Repeat)",
          "className": "p-3 border rounded text-center"
        },
        {
          "label": "45",
          "value": "CHURN RISK",
          "className": "p-3 border rounded text-center"
        }
      ],
      "fields": [],
      "details": [],
      "items": [],
      "tables": [],
      "actions": [
        {
          "label": "Message VIPs",
          "showLabel": true,
          "iconClass": "",
          "variantClass": "pm-btn pm-btn-sm",
          "style": "",
          "kind": "open",
          "message": "",
          "disabled": false,
          "target": "p32_sendReminderModal"
        },
        {
          "label": "View List",
          "showLabel": true,
          "iconClass": "",
          "variantClass": "pm-btn pm-btn-sm",
          "style": "",
          "kind": "notify",
          "message": "View List selected.",
          "disabled": false
        },
        {
          "label": "Send Promo",
          "showLabel": true,
          "iconClass": "",
          "variantClass": "pm-btn pm-btn-sm",
          "style": "",
          "kind": "notify",
          "message": "Send Promo selected.",
          "disabled": false
        },
        {
          "label": "Action",
          "showLabel": false,
          "iconClass": "bi bi-pencil",
          "variantClass": "pm-btn pm-btn-sm",
          "style": "",
          "kind": "notify",
          "message": "Action selected.",
          "disabled": false
        },
        {
          "label": "Action",
          "showLabel": false,
          "iconClass": "bi bi-pencil",
          "variantClass": "pm-btn pm-btn-sm",
          "style": "",
          "kind": "notify",
          "message": "Action selected.",
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
        "target": "p32_customerSegmentModal"
      }
    ]
  },
  {
    "id": "p32_sendReminderModal",
    "title": "Send Message / Reminder",
    "iconClass": "bi bi-chat-dots",
    "sizeClass": "",
    "content": {
      "notes": [],
      "alerts": [],
      "stats": [],
      "fields": [
        {
          "key": "target_audience",
          "label": "Target Audience",
          "type": "select",
          "value": "Customers with Pending Invoices (14)",
          "placeholder": "",
          "options": [
            "Customers with Pending Invoices (14)",
            "VIP Customers (142)",
            "Churn Risk Customers (45)",
            "Single Customer"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "channel",
          "label": "Channel",
          "type": "select",
          "value": "SMS",
          "placeholder": "",
          "options": [
            "SMS",
            "WhatsApp Business",
            "Email"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "message_template",
          "label": "Message Template",
          "type": "select",
          "value": "Payment Reminder",
          "placeholder": "",
          "options": [
            "Payment Reminder",
            "Promo Offer",
            "Thank You",
            "Custom"
          ],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "message_body",
          "label": "Message Body",
          "type": "textarea",
          "value": "Hi [Name], this is a reminder that your invoice [Invoice_No] for KES [Amount] is due. Click here to pay: [Pay_Link]",
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
        "target": "p32_sendReminderModal"
      },
      {
        "label": "Send Campaign",
        "showLabel": true,
        "iconClass": "bi bi-send",
        "variantClass": "pm-btn pm-btn-success",
        "style": "",
        "kind": "process",
        "message": "Messages sent successfully to 14 customers.",
        "disabled": false,
        "target": "p32_sendReminderModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p32_addCustomerModal",
    "title": "Add New Customer",
    "iconClass": "bi bi-person-plus",
    "sizeClass": "",
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
          "placeholder": "Enter name",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "phone_number",
          "label": "Phone Number",
          "type": "text",
          "value": "",
          "placeholder": "07XX XXX XXX",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "email_optional",
          "label": "Email (Optional)",
          "type": "text",
          "value": "",
          "placeholder": "email@domain.com",
          "options": [],
          "style": "",
          "checked": false,
          "disabled": false,
          "columnClass": "col-12"
        },
        {
          "key": "customer_group",
          "label": "Customer Group",
          "type": "select",
          "value": "Regular",
          "placeholder": "",
          "options": [
            "Regular",
            "Wholesale",
            "Corporate"
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
        "target": "p32_addCustomerModal"
      },
      {
        "label": "Save Customer",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Customer profile created successfully.",
        "disabled": false,
        "target": "p32_addCustomerModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p32_feeCalculatorModal",
    "title": "Transaction Fee Calculator",
    "iconClass": "bi bi-calculator",
    "sizeClass": "",
    "content": {
      "notes": [
        "KES",
        "150",
        "9,850",
        "100",
        "9,900",
        "290",
        "9,710",
        "45",
        "9,955"
      ],
      "alerts": [
        {
          "text": "All fees are deducted gross before settlement. No hidden charges.",
          "tone": "info"
        }
      ],
      "stats": [],
      "fields": [
        {
          "key": "transaction_amount_kes",
          "label": "Transaction Amount (KES)",
          "type": "number",
          "value": "10000",
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
      "tables": [
        {
          "columns": [
            "Method",
            "MDR Rate",
            "Fee Deduction",
            "Net Settlement"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "PayBill",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "1.5%",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 150",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 9,850",
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
                  "text": "Till",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "1.0%",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 100",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 9,900",
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
                  "text": "Card (Visa/MC)",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "2.9%",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 290",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 9,710",
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
                  "text": "PesaLink",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "Fixed",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 45",
                  "strong": false,
                  "className": "",
                  "style": ""
                },
                {
                  "text": "KES 9,955",
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
        "target": "p32_feeCalculatorModal"
      }
    ]
  },
  {
    "id": "p32_exportReportModal",
    "title": "Export Collections Data",
    "iconClass": "bi bi-file-earmark-spreadsheet",
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
          "value": "Transaction Ledger",
          "placeholder": "",
          "options": [
            "Transaction Ledger",
            "Settlement History",
            "Customer Directory",
            "Disputes & Refunds Log"
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
          "value": "2025-06-01",
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
          "value": "CSV (For Excel/Accounting)",
          "placeholder": "",
          "options": [
            "CSV (For Excel/Accounting)",
            "PDF Summary"
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
        "target": "p32_exportReportModal"
      },
      {
        "label": "Generate Export",
        "showLabel": true,
        "iconClass": "bi bi-download",
        "variantClass": "pm-btn pm-btn-primary",
        "style": "",
        "kind": "process",
        "message": "Export generated and downloading to your device.",
        "disabled": false,
        "target": "p32_exportReportModal",
        "reference": ""
      }
    ]
  },
  {
    "id": "p32_healthCheckModal",
    "title": "System Health & Status",
    "iconClass": "bi bi-heart-pulse",
    "sizeClass": "",
    "content": {
      "notes": [],
      "alerts": [
        {
          "text": "All core payment rails are functioning normally. No major outages reported by PSPs in the last 24 hours.",
          "tone": "info"
        }
      ],
      "stats": [],
      "fields": [],
      "details": [],
      "items": [
        {
          "title": "M-Pesa API (PayBill/Till)",
          "subtitle": "Latency: 120ms",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": {
            "text": "Operational",
            "className": "pm-badge pm-badge-success",
            "iconClass": "",
            "style": ""
          }
        },
        {
          "title": "Card Gateway",
          "subtitle": "Latency: 450ms",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": {
            "text": "Operational",
            "className": "pm-badge pm-badge-success",
            "iconClass": "",
            "style": ""
          }
        },
        {
          "title": "PesaLink Switch",
          "subtitle": "Pending KYC",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": {
            "text": "Inactive",
            "className": "pm-badge pm-badge-warning",
            "iconClass": "",
            "style": ""
          }
        },
        {
          "title": "Settlement Engine",
          "subtitle": "Next batch at 4:00 PM",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": {
            "text": "Operational",
            "className": "pm-badge pm-badge-success",
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
        "target": "p32_healthCheckModal"
      }
    ]
  },
  {
    "id": "p32_profileModal",
    "title": "Admin Profile",
    "iconClass": "bi bi-person-circle",
    "sizeClass": "",
    "content": {
      "notes": [
        "Jane Doe",
        "Finance Admin · J.K. Enterprises",
        "JD",
        "Role",
        "Full Admin",
        "Last Login",
        "Today, 08:15 AM"
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
        "label": "Sign Out",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn pm-btn-danger",
        "style": "",
        "kind": "close",
        "message": "Sign Out selected.",
        "disabled": false,
        "target": "p32_profileModal"
      }
    ]
  },
  {
    "id": "p32_notificationsModal",
    "title": "Notifications (8)",
    "iconClass": "bi bi-bell",
    "sizeClass": "",
    "content": {
      "notes": [
        "Chargeback Received",
        "Visa ***4112 KES 12,500. Respond within 2 days.",
        "Refund Approval Required",
        "John Mark requested full refund KES 3,400.",
        "KYC Document Needed",
        "Upload CR12 for PayBill 512234 to avoid limits.",
        "API Keys Expiring",
        "Rotate LNMO Production keys in 3 days.",
        "Daily Settlement Cleared",
        "KES 206,850 deposited to Equity Bank yesterday."
      ],
      "alerts": [
        {
          "text": "Chargeback Received Visa ***4112 KES 12,500. Respond within 2 days.",
          "tone": "danger"
        },
        {
          "text": "Refund Approval Required John Mark requested full refund KES 3,400.",
          "tone": "warning"
        },
        {
          "text": "KYC Document Needed Upload CR12 for PayBill 512234 to avoid limits.",
          "tone": "info"
        },
        {
          "text": "API Keys Expiring Rotate LNMO Production keys in 3 days.",
          "tone": "purple"
        },
        {
          "text": "Daily Settlement Cleared KES 206,850 deposited to Equity Bank yesterday.",
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
        "label": "Mark all as read",
        "showLabel": true,
        "iconClass": "",
        "variantClass": "pm-btn",
        "style": "",
        "kind": "close",
        "message": "Mark all as read selected.",
        "disabled": false,
        "target": "p32_notificationsModal"
      }
    ]
  },
  {
    "id": "p32_attentionDetailModal",
    "title": "Action Items",
    "iconClass": "bi bi-exclamation-circle",
    "sizeClass": "",
    "content": {
      "notes": [],
      "alerts": [],
      "stats": [],
      "fields": [],
      "details": [],
      "items": [
        {
          "title": "Chargeback CB-01",
          "subtitle": "Visa ***4112",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": null,
          "action": {
            "label": "Defend",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm pm-btn-danger",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p32_disputeModal"
          }
        },
        {
          "title": "Refund RF-11",
          "subtitle": "Pending approval",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
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
            "target": "p32_refundModal"
          }
        },
        {
          "title": "KYC Update",
          "subtitle": "CR12 required",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": null,
          "action": {
            "label": "Upload",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p32_paybillConfigModal"
          }
        },
        {
          "title": "API Key Rotation",
          "subtitle": "Expires in 3 days",
          "value": "",
          "iconClass": "",
          "iconContainerClass": "",
          "iconContainerStyle": "",
          "badge": null,
          "action": {
            "label": "Rotate",
            "showLabel": true,
            "iconClass": "",
            "variantClass": "pm-btn pm-btn-sm",
            "style": "",
            "kind": "open",
            "message": "",
            "disabled": false,
            "target": "p32_apiConfigModal"
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
        "target": "p32_attentionDetailModal"
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
