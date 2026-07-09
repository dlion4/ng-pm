import { Routes } from '@angular/router';
import { AuthSigninComponent } from './auth/login-hub/login-hub';
import { DashboardLayoutComponent } from './layouts/dashboard-personal/dashboard-layout/dashboard-layout';
import { DashboardDevLayoutComponent } from './layouts/dashboard-dev/dashboard-dev-layout/dashboard-dev-layout';
import { DashboardUtilityLayoutComponent } from './layouts/dashboard-utility/dashboard-utility-layout/dashboard-utility-layout';
// import { DashboardDevLayoutComponent } from './layouts/dashboard-dev/dashboard-dev-layout/dashboard-dev-layout';
import { DashboardCardsLayoutComponent } from './layouts/dashboard-cards/dashboard-cards-layout/dashboard-cards-layout';
import { DashboardBusinessLayoutComponent } from './layouts/dashboard-business/dashboard-business-layout/dashboard-business-layout';

// =============================================================================
// BUSINESS PORTAL ROUTES
// =============================================================================

export const businessPortalRoutes: Routes = [
    {
        path: 'business-portal',
        loadComponent: () => import('./layouts/dashboard-business/dashboard-business-layout/dashboard-business-layout').then(m => m.DashboardBusinessLayoutComponent),
        title: 'Business Portal — Paymo BAAS',
        children: [
            {
                path: '',
                redirectTo: 'business-dashboard',
                pathMatch: 'full'
            },
            {
                path: 'business-dashboard',
                loadComponent: () => import('./business-portal/business-dashboard/business-dashboard').then(m => m.BusinessDashboardComponent),
                title: 'Business Dashboard — Paymo BAAS'
            },
            {
                path: 'business-onboarding',
                loadComponent: () => import('./business-portal/business-onboarding/business-onboarding').then(m => m.BusinessOnboardingComponent),
                title: 'Business Onboarding — Paymo BAAS'
            },
            {
                path: 'accounts-payable',
                loadComponent: () => import('./business-portal/accounts-payable/accounts-payable').then(m => m.AccountsPayableComponent),
                title: 'Accounts Payable — Paymo BAAS'
            },
            {
                path: 'bulk-payments',
                loadComponent: () => import('./business-portal/bulk-payments/bulk-payments').then(m => m.BulkPaymentsComponent),
                title: 'Bulk Payments — Paymo BAAS'
            },
            {
                path: 'collections-merchant',
                loadComponent: () => import('./business-portal/collections-merchant/collections-merchant').then(m => m.CollectionsMerchantComponent),
                title: 'Collections & Merchant — Paymo BAAS'
            },
            {
                path: 'invoicing-billing',
                loadComponent: () => import('./business-portal/invoicing-billing/invoicing-billing').then(m => m.InvoicingBillingComponent),
                title: 'Invoicing & Billing — Paymo BAAS'
            },
            {
                path: 'virtual-accounts',
                loadComponent: () => import('./business-portal/virtual-accounts/virtual-accounts').then(m => m.VirtualAccountsComponent),
                title: 'Virtual Accounts — Paymo BAAS'
            },
            {
                path: 'treasury-management',
                loadComponent: () => import('./business-portal/treasury-management/treasury-management').then(m => m.TreasuryManagementComponent),
                title: 'Treasury Management — Paymo BAAS'
            },
            {
                path: 'finance-reporting',
                loadComponent: () => import('./business-portal/finance-reporting/financial-reporting').then(m => m.FinancialReportingComponent),
                title: 'Finance & Reporting — Paymo BAAS'
            },
            {
                path: 'payroll-compliance',
                loadComponent: () => import('./business-portal/payroll-compliance/payroll-compliance').then(m => m.PayrollComplianceComponent),
                title: 'Payroll & Compliance — Paymo BAAS'
            },
            {
                path: 'open-banking',
                loadComponent: () => import('./business-portal/open-banking/open-banking').then(m => m.OpenBankingComponent),
                title: 'Open Banking — Paymo BAAS'
            },
            {
                path: 'multi-currency',
                loadComponent: () => import('./business-portal/multi-currency/multi-currency').then(m => m.MultiCurrencyComponent),
                title: 'Multi-Currency — Paymo BAAS'
            },
            {
                path: 'support-disputes-refunds',
                loadComponent: () => import('./business-portal/support-disputes-refunds/support-disputes-refunds').then(m => m.SupportDisputesRefundsComponent),
                title: 'Support, Disputes & Refunds — Paymo BAAS'
            },
            {
                path: 'settings-account',
                loadComponent: () => import('./business-portal/settings-account/settings-account').then(m => m.SettingsAccountComponent),
                title: 'Settings & Account — Paymo BAAS'
            },
            {
                path: '**',
                redirectTo: 'business-dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
// =============================================================================
// PUBLIC ROUTES — No Authentication Required
// =============================================================================
export const authRoutes: Routes = [
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./auth/login-hub/login-hub').then(m => m.AuthSigninComponent),
                title: 'Sign In — Paymo BAAS'
            },
            {
                path: 'register',
                loadComponent: () => import('./auth/register-flow/register-flow').then(m => m.RegisterFlowComponent),
                title: 'Sign Up — Paymo BAAS'
            },
            {
                path: 'recovery',
                loadComponent: () => import('./auth/recovery/recovery').then(m => m.AccountRecoveryComponent),
                title: 'Account Recovery — Paymo BAAS'
            },
            {
                path: 'fraud-alerts',
                loadComponent: () => import('./auth/fraud-alerts/fraud-alerts').then(m => m.FraudAlertsComponent),
                title: 'Fraud Alerts — Paymo BAAS'
            },
            {
                path: 'mfa-challenge',
                loadComponent: () => import('./auth/mfa-challenge/mfa-challenge').then(m => m.MfaChallengeComponent),
                title: 'MFA Challenge — Paymo BAAS'
            },
            {
                path: 'security-center',
                loadComponent: () => import('./auth/security-center/security-center').then(m => m.SecurityCenterComponent),
                title: 'Security Center — Paymo BAAS'
            },
            {
                path: 'dashboard-selector',
                loadComponent: () => import('./auth/dashboard-selector/dashboard-selector').then(m => m.DashboardSelectorComponent),
                title: 'Dashboard Selector — Paymo BAAS'
            },
            {
                path: 'identity-verification',
                loadComponent: () => import('./auth/identity-verification/identity-verification').then(m => m.IdentityVerificationComponent),
                title: 'Identity Verification — Paymo BAAS'
            },
            {
                path: 'biometric-setup',
                loadComponent: () => import('./auth/biometric-setup/biometric-setup').then(m => m.BiometricSetupComponent),
                title: 'Biometric Setup — Paymo BAAS'
            },




            // 👑 FIX 1: Catch-all for "/auth" or "/auth/"
            // If someone goes to just "/auth", send them directly to "/auth/login"
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    }
];



// =============================================================================
// MAIN APPLICATION LAYOUT ROUTES
// =============================================================================
// const mainRoutes: Routes = [
//     {
//         path: '',
//         loadComponent: () => import('./layouts/home-layout/home-layout').then(m => m.HomeLayoutComponent),
//         children: [
//             {
//                 path: '',
//                 loadComponent: () => import('./home-layout/homepage/homepage').then(m => m.HomepageComponent),
//                 title: 'Paymo BAAS — The Financial Nervous System for Borderless Africa'
//             }
//         ]
//     }
// ];





export const transactionRoutes: Routes = [
    {
        path: 'transactions',
        loadComponent: () => import('./layouts/dashboard-personal/dashboard-layout/dashboard-layout').then(m => m.DashboardLayoutComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./layouts/dashboard-personal/dashboard-main/dashboard-main').then(m => m.DashboardMainComponent),
                title: 'Paymo BAAS — The Financial Nervous System for Borderless Africa'
            },
            {
                path: 'transfer-overview',
                loadComponent: () => import('./dashboard-core/transfer-overview/transfer-overview').then(m => m.TransferOverviewComponent),
                title: 'Paymo BAAS — The Financial Nervous System for Borderless Africa'
            },
            {
                path: 'initiate-transfer',
                loadComponent: () => import('./dashboard-core/initiate-transfer/initiate-transfer').then(m => m.InitiateTransferComponent),
                title: 'Paymo BAAS — The Financial Nervous System for Borderless Africa'
            },
            {
                path: 'transfer-management',
                loadComponent: () => import('./dashboard-core/transfer-management/transfer-management').then(m => m.TransferManagementComponent),
                title: 'Paymo BAAS — The Financial Nervous System for Borderless Africa'
            },
            {
                path: 'payment-rails',
                loadComponent: () => import('./dashboard-core/payment-rails/payment-rails').then(m => m.PaymentRailsComponent),
                title: 'Paymo BAAS — Payment Rails'
            },
            {
                path: 'liquidity-management',
                loadComponent: () => import('./dashboard-core/liquidity-management/liquidity-management').then(m => m.LiquidityManagementComponent),
                title: 'Paymo BAAS — The Financial Nervous System for Borderless Africa'
            },
            {
                path: 'reconciliation',
                loadComponent: () => import('./dashboard-core/reconciliation-center/reconciliation-center').then(m => m.ReconciliationCenterComponent),
                title: 'Paymo BAAS — The Financial Nervous System for Borderless Africa'
            },
            {
                path: 'transaction-analytics',
                loadComponent: () => import('./dashboard-core/transaction-analytics/transaction-analytics').then(m => m.TransactionAnalyticsComponent),
                title: 'Paymo BAAS — The Financial Nervous System for Borderless Africa'
            },
            {
                path: 'settlement-clearing',
                loadComponent: () => import('./dashboard-core/settlement-clearing/settlement-clearing').then(m => m.SettlementClearingComponent),
                title: 'Paymo BAAS — The Financial Nervous System for Borderless Africa'
            },
            {
                path: 'compliance',
                loadComponent: () => import('./dashboard-core/compliance-aml/compliance-aml').then(m => m.ComplianceAmlComponent),
                title: 'Paymo BAAS — The Financial Nervous System for Borderless Africa'
            },
            {
                path: 'mobile-money',
                loadComponent: () => import('./dashboard-core/mobile-money-hub/mobile-money-hub').then(m => m.MobileMoneyHubComponent),
                title: 'Paymo BAAS — The Financial Nervous System for Borderless Africa'
            },
            {
                path: 'governance',
                loadComponent: () => import('./dashboard-core/government-integration/government-integration').then(m => m.GovernmentComponent),
                title: 'Paymo BAAS — The Financial Nervous System for Borderless Africa'
            },
            {
                path: 'customer-account',
                loadComponent: () => import('./dashboard-core/customer-account/customer-account').then(m => m.CustomerAccountComponent),
                title: 'Paymo BAAS — The Financial Nervous System for Borderless Africa'
            },
            {
                path: 'fee-commission',
                loadComponent: () => import('./dashboard-core/fee-commission/fee-commission').then(m => m.FeeCommissionComponent),
                title: 'Paymo BAAS — The Financial Nervous System for Borderless Africa'
            },
            {
                path: 'dispute-chargeback',
                loadComponent: () => import('./dashboard-core/dispute-chargeback/dispute-chargeback').then(m => m.DisputeChargebackComponent),
                title: 'Paymo BAAS — The Financial Nervous System for Borderless Africa'
            },
            {
                path: 'account',
                loadComponent: () => import('./dashboard-core/account/account').then(m => m.AccountComponent),
                title: 'Paymo BAAS — The Financial Nervous System for Borderless Africa'
            },
            {
                path: 'system',
                loadComponent: () => import('./dashboard-core/system-health/system-health').then(m => m.SystemHealthComponent),
                title: 'Paymo BAAS — The Financial Nervous System for Borderless Africa'
            },
        ]
    },
     {
        path: '**',
        redirectTo: 'transfer-overview',
        pathMatch: 'full'
    }
];



export const utilitiesRoutes: Routes = [
    {
        path: 'utilities',
        loadComponent: () => import('./layouts/dashboard-utility/dashboard-utility-layout/dashboard-utility-layout').then(m => m.DashboardUtilityLayoutComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./layouts/dashboard-utility/dashboard-utility-main/dashboard-utility-main').then(m => m.DashboardUtilityMainComponent),
                title: 'Paymo BAAS — Utilities Command Center'
            },
            {
                path: 'command-center',
                loadComponent: () => import('./utilities/command-center/command-center').then(m => m.UtilitiesCommandCenterComponent),
                title: 'Paymo BAAS — Utilities Command Center'
            },
            {
                path: 'electricity',
                loadComponent: () => import('./utilities/electricity-management/electricity-management').then(m => m.ElectricityManagementComponent),
                title: 'Paymo BAAS — Electricity Management'
            },
            {
                path: 'water',
                loadComponent: () => import('./utilities/water-management/water-management').then(m => m.WaterManagementComponent),
                title: 'Paymo BAAS — Water Management'
            },
            {
                path: 'internet',
                loadComponent: () => import('./utilities/internet-connectivity/internet-connectivity').then(m => m.InternetManagementComponent),
                title: 'Paymo BAAS — Internet & Connectivity'
            },
            {
                path: 'airtime',
                loadComponent: () => import('./utilities/mobile-money-airtime/mobile-money-airtime').then(m => m.MobileMoneyHubComponent),
                title: 'Paymo BAAS — Mobile Money & Airtime Hub'
            },
            {
                path: 'settings',
                loadComponent: () => import('./utilities/settings-automation/settings-automation').then(m => m.UtilitySettingsComponent),
                title: 'Paymo BAAS — Utility Settings & Automation'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'command-center',
        pathMatch: 'full'
    }
];


// =============================================================================
// DEV PORTAL STANDALONE PAGE ROUTES
// =============================================================================

export const devPortalRoutes: Routes = [
  {
    path: 'dev-portal',
    loadComponent: () => import('./layouts/dashboard-dev/dashboard-dev-layout/dashboard-dev-layout').then(m => m.DashboardDevLayoutComponent),
    title: 'Dev Portal — PayMo BAAS',
    children: [
      {
        path: '',
        redirectTo: 'api-console',
        pathMatch: 'full'
      },
      {
        path: 'api-console',
        loadComponent: () => import('./dev-portal/api-console/api-console').then(m => m.ApiConsoleComponent),
        title: 'API Console — PayMo Dev Portal'
      },
      {
        path: 'compliance',
        loadComponent: () => import('./dev-portal/compliance/compliance').then(m => m.ComplianceComponent),
        title: 'Compliance — PayMo Dev Portal'
      },
      {
        path: 'analytics',
        loadComponent: () => import('./dev-portal/dev-dashboard/dev-dashboard').then(m => m.DevDashboardComponent),
        title: 'Dev Dashboard — PayMo Dev Portal'
      },
      {
        path: 'governance',
        loadComponent: () => import('./dev-portal/governance/governance').then(m => m.GovernanceComponent),
        title: 'Governance — PayMo Dev Portal'
      },
      {
        path: 'integration',
        loadComponent: () => import('./dev-portal/integration/integration').then(m => m.IntegrationComponent),
        title: 'Integration — PayMo Dev Portal'
      },
    //   {
    //     path: 'integration-health',
    //     loadComponent: () => import('./dev-portal/integration-health/integration-health').then(m => m.IntegrationHealthComponent),
    //     title: 'Integration Health — PayMo Dev Portal'
    //   },
      {
        path: 'manager',
        loadComponent: () => import('./dev-portal/manager/manager').then(m => m.ManagerComponent),
        title: 'Manager — PayMo Dev Portal'
      },
      {
        path: 'partner',
        loadComponent: () => import('./dev-portal/partner/partner').then(m => m.PartnerComponent),
        title: 'Partner — PayMo Dev Portal'
      },
      {
        path: 'production-access',
        loadComponent: () => import('./dev-portal/production-access/production-access').then(m => m.ProductionAccessComponent),
        title: 'Production Access — PayMo Dev Portal'
      },
      {
        path: 'sandbox-environment',
        loadComponent: () => import('./dev-portal/sandbox-environment/sandbox-environment').then(m => m.SandboxEnvironmentComponent),
        title: 'Sandbox Environment — PayMo Dev Portal'
      },
      {
        path: 'sdk',
        loadComponent: () => import('./dev-portal/sdks/sdks').then(m => m.SdksComponent),
        title: 'SDK — PayMo Dev Portal'
      },
      {
        path: 'support',
        loadComponent: () => import('./dev-portal/support/support').then(m => m.SupportComponent),
        title: 'Support — PayMo Dev Portal'
      },
      {
        path: 'tools',
        loadComponent: () => import('./dev-portal/tools/tools').then(m => m.ToolsComponent),
        title: 'Tools — PayMo Dev Portal'
      },
      {
        path: 'webhook',
        loadComponent: () => import('./dev-portal/webhook/webhooks').then(m => m.WebhooksComponent),
        title: 'Webhook — PayMo Dev Portal'
      },
      {
        path: '**',
        redirectTo: 'api-console',
        pathMatch: 'full'
      }
    ]
  }
];



// =============================================================================
// CARD HUB ROUTES
// =============================================================================

export const cardHubRoutes: Routes = [
    {
        path: 'cards-hub',
        loadComponent: () => import('./layouts/dashboard-cards/dashboard-cards-layout/dashboard-cards-layout').then(m => m.DashboardCardsLayoutComponent),
        children: [
            {
                path: '',
                redirectTo: 'business-cards',
                pathMatch: 'full'
            },
            {
                path: 'business-cards',
                loadComponent: () => import('./cards-hub/business-cards/business-cards').then(m => m.BusinessCardsComponent),
                title: 'Corporate & Business Cards — Paymo BAAS'
            },
            {
                path: 'card-admin',
                loadComponent: () => import('./cards-hub/card-admin/card-admin').then(m => m.CardAdminComponent),
                title: 'Card Administration — Paymo BAAS'
            },
            {
                path: 'card-analytics',
                loadComponent: () => import('./cards-hub/card-analytics/card-analytics').then(m => m.CardAnalyticsComponent),
                title: 'Card Analytics — Paymo BAAS'
            },
            {
                path: 'card-dashboard',
                loadComponent: () => import('./cards-hub/card-dashboard/card-dashboard').then(m => m.CardDashboardComponent),
                title: 'Card Dashboard — Paymo BAAS'
            },
            {
                path: 'card-security',
                loadComponent: () => import('./cards-hub/card-security/card-security').then(m => m.CardSecurityComponent),
                title: 'Card Security — Paymo BAAS'
            },
            {
                path: 'card-settings',
                loadComponent: () => import('./cards-hub/card-settings/card-settings').then(m => m.CardSettingsComponent),
                title: 'Card Settings — Paymo BAAS'
            },
            {
                path: 'physical-cards',
                loadComponent: () => import('./cards-hub/physical-cards/physical-cards').then(m => m.PhysicalCardsComponent),
                title: 'Physical Cards — Paymo BAAS'
            },
            {
                path: 'prepaid-card',
                loadComponent: () => import('./cards-hub/prepaid-card/prepaid-card').then(m => m.PrepaidCardComponent),
                title: 'Prepaid Card — Paymo BAAS'
            },
            {
                path: 'virtual-credit',
                loadComponent: () => import('./cards-hub/virtual-credit/virtual-credit').then(m => m.VirtualCreditComponent),
                title: 'Virtual Credit — Paymo BAAS'
            },
            {
                path: 'virtual-debit',
                loadComponent: () => import('./cards-hub/virtual-debit/virtual-debit').then(m => m.VirtualDebitComponent),
                title: 'Virtual Debit — Paymo BAAS'
            },
            {
                path: '**',
                redirectTo: 'card-dashboard',
                pathMatch: 'full'
            }
        ]
    }
];



// =============================================================================
// 👑 FIX 2: THE MASTER ROUTE COMBINER
// Angular only reads the array named "routes" exported at the bottom!
// =============================================================================
// =============================================================================
// 👑 FIX 2: THE MASTER ROUTE COMBINER
// Angular only reads the array named "routes" exported at the bottom!
// =============================================================================
export const routes: Routes = [
    ...authRoutes,           // Spreads out and registers auth paths first
    // ...mainRoutes,           // Spreads out homepage and structural paths second
    ...transactionRoutes,    // Spreads out transaction paths third
    ...utilitiesRoutes,      // Spreads out utilities paths fourth
    ...devPortalRoutes,      // Spreads out dev portal paths fifth
    ...cardHubRoutes,        // Spreads out card hub paths sixth
    ...businessPortalRoutes, // Spreads out business portal paths seventh

    // 👑 FIX 3: Global Catch-All Fallback Rule
    // If a user types a completely broken URL, safely redirect them home
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];


// export const routes: Routes = [

// {
//     path: '',
//     loadComponent: () => import('./home-layout/homepage/homepage').then(m => m.HomepageComponent),
//     title: 'Paymo BAAS — The Financial Nervous System for Borderless Africa'
// },
// {
//     path: 'platform',
//     loadComponent: () => import('./home-layout/platform-overview/platform-overview.component').then(m => m.PlatformOverviewComponent),
//     title: 'Platform — Paymo BAAS'
// },
// {
//     path: 'payments',
//     loadComponent: () => import('./home-layout/payments-infrastructure/payments-infrastructure.component').then(m => m.PaymentsInfrastructureComponent),
//     title: 'Payments Infrastructure — Paymo BAAS'
// },
// {
//     path: 'banking',
//     loadComponent: () => import('./home-layout/embedded-banking/embedded-banking.component').then(m => m.EmbeddedBankingComponent),
//     title: 'Embedded Banking — Paymo BAAS'
// },
// {
//     path: 'cross-border-fx',
//     loadComponent: () => import('./home-layout/cross-border-fx/cross-border-fx.component').then(m => m.CrossBorderFxComponent),
//     title: 'Cross-Border & FX Intelligence — Paymo BAAS'
// },
// {
//     path: 'global-transfers',
//     loadComponent: () => import('./home-layout/global-transfers/global-transfers.component').then(m => m.GlobalTransfersComponent),
//     title: 'Global Transfers & Remittance — Paymo BAAS'
// },
// {
//     path: 'compliance',
//     loadComponent: () => import('./home-layout/compliance-risk/compliance-risk.component').then(m => m.ComplianceRiskComponent),
//     title: 'Compliance & Risk Engine — Paymo BAAS'
// },
// {
//     path: 'developers',
//     loadComponent: () => import('./home-layout/developers-api/developers-api.component').then(m => m.DevelopersApiComponent),
//     title: 'Developers — Paymo BAAS'
//  },
// {
//     path: 'solutions',
//     children: [
//         {
//             path: '',
//             loadComponent: () => import('./home-layout/solutions-hub/solutions-hub.component').then(m => m.SolutionsHubComponent),
//             title: 'Solutions — Paymo BAAS'
//         },
//         {
//             path: 'fintech-neobanks',
//             loadComponent: () => import('./home-layout/solutions-fintech-neobanks/solutions-fintech-neobanks.component').then(m => m.SolutionsFintechNeobanksComponent),
//             title: 'Fintechs & Neobanks — Paymo BAAS'
//         },
//         {
//             path: 'ecommerce-marketplaces',
//             loadComponent: () => import('./home-layout/solutions-ecommerce-marketplaces/solutions-ecommerce-marketplaces.component').then(m => m.SolutionsEcommerceMarketplacesComponent),
//             title: 'E-commerce & Marketplaces — Paymo BAAS'
//         },
//         {
//             path: 'logistics-mobility',
//             loadComponent: () => import('./home-layout/solutions-logistics-mobility/solutions-logistics-mobility.component').then(m => m.SolutionsLogisticsMobilityComponent),
//             title: 'Logistics & Mobility — Paymo BAAS'
//         },
//         {
//             path: 'enterprise-treasury',
//             loadComponent: () => import('./home-layout/solutions-enterprise-treasury/solutions-enterprise-treasury.component').then(m => m.SolutionsEnterpriseTreasuryComponent),
//             title: 'Enterprise Treasury — Paymo BAAS'
//         },
//         {
//             path: 'ngo-development',
//             loadComponent: () => import('./home-layout/solutions-ngo-development/solutions-ngo-development.component').then(m => m.SolutionsNgoDevelopmentComponent),
//             title: 'NGOs & Development Finance — Paymo BAAS'
//         }
//     ]
// },
// {
//     path: 'pricing',
//     loadComponent: () => import('./home-layout/pricing/pricing.component').then(m => m.PricingComponent),
//     title: 'Pricing — Paymo BAAS'
// },
// {
//     path: 'coverage',
//     loadComponent: () => import('./home-layout/coverage-network/coverage-network.component').then(m => m.CoverageNetworkComponent),
//     title: 'Coverage & Network Map — Paymo BAAS'
// },
// {
//     path: 'trust',
//     loadComponent: () => import('./home-layout/security-trust/security-trust.component').then(m => m.SecurityTrustComponent),
//     title: 'Security & Trust Center — Paymo BAAS'
// },
// {
//     path: 'customers',
//     loadComponent: () => import('./home-layout/case-studies/case-studies.component').then(m => m.CaseStudiesComponent),
//     title: 'Case Studies — Paymo BAAS'
// },
// {
//     path: 'about',
//     loadComponent: () => import('./home-layout/about-company/about-company.component').then(m => m.AboutCompanyComponent),
//     title: 'About Paymo — Paymo BAAS'
// },
// {
//     path: 'resources',
//     loadComponent: () => import('./home-layout/blog-resources/blog-resources.component').then(m => m.BlogResourcesComponent),
//     title: 'Blog & Resources — Paymo BAAS'
// },
// {
//     path: 'contact',
//     loadComponent: () => import('./home-layout/contact-sales/contact-sales.component').then(m => m.ContactSalesComponent),
//     title: 'Contact — Paymo BAAS'
// },
// {
//     path: 'careers',
//     loadComponent: () => import('./home-layout/careers/careers.component').then(m => m.CareersComponent),
//     title: 'Careers — Paymo BAAS'
// },
// {
//     path: 'use-cases',
//     children: [
//         {
//             path: '',
//             loadComponent: () => import('./home-layout/use-cases-hub/use-cases-hub.component').then(m => m.UseCasesHubComponent),
//             title: 'Use Cases — Paymo BAAS'
//         },
//         {
//             path: 'pay-bills-utilities',
//             loadComponent: () => import('./home-layout/use-case-pay-bills/use-case-pay-bills.component').then(m => m.UseCasePayBillsComponent),
//             title: 'Pay Bills & Utilities — Paymo BAAS'
//         },
//         {
//             path: 'business-payments-offline-cash',
//             loadComponent: () => import('./home-layout/use-case-business-payments/use-case-business-payments.component').then(m => m.UseCaseBusinessPaymentsComponent),
//             title: 'Business Payments & Offline Cash — Paymo BAAS'
//         },
//         {
//             path: 'personal-fintech-startups',
//             loadComponent: () => import('./home-layout/use-case-personal-fintech/use-case-personal-fintech.component').then(m => m.UseCasePersonalFintechComponent),
//             title: 'Personal, Fintech & Startup Ecosystem — Paymo BAAS'
//         }
//     ]
// }
// ];

//



// =============================================================================
// SECURITY ROUTES — Authenticated User Access
// =============================================================================

// export const securityRoutes: Routes = [
//     {
//         path: 'security',
//         canActivate: [authGuard],
//         children: [
//             {
//                 path: '',
//                 loadComponent: () => import('./auth/security-center/security-center.component').then(m => m.SecurityCenterComponent),
//                 title: 'Security Center — Paymo BAAS'
//             },
//             {
//                 path: 'biometrics',
//                 loadComponent: () => import('./auth/biometric-setup/biometric-setup.component').then(m => m.BiometricSetupComponent),
//                 title: 'Biometric Setup — Paymo BAAS'
//             },
//             {
//                 path: 'alerts',
//                 loadComponent: () => import('./auth/fraud-alerts/fraud-alerts.component').then(m => m.FraudAlertsComponent),
//                 title: 'Security Alerts — Paymo BAAS'
//             }
//         ]
//     }
// ];

// =============================================================================
// DASHBOARD 1: BANK-TO-BANK TRANSACTIONS — Operations Team
// =============================================================================

// export const dashboardCoreRoutes: Routes = [
//     {
//         path: 'dashboard',
//         canActivate: [authGuard, roleGuard],
//         data: { roles: ['operations', 'admin', 'super-admin', 'treasury'] },
//         children: [
//             {
//                 path: '',
//                 redirectTo: 'overview',
//                 pathMatch: 'full'
//             },
//             {
//                 path: 'overview',
//                 loadComponent: () => import('./dashboard-core/transfer-overview/transfer-overview.component').then(m => m.TransferOverviewComponent),
//                 title: 'Transfer Overview — Paymo Operations'
//             },
//             {
//                 path: 'initiate-transfer',
//                 loadComponent: () => import('./dashboard-core/initiate-transfer/initiate-transfer.component').then(m => m.InitiateTransferComponent),
//                 title: 'Initiate Transfer — Paymo Operations'
//             },
//             {
//                 path: 'transfer-management',
//                 loadComponent: () => import('./dashboard-core/transfer-management/transfer-management.component').then(m => m.TransferManagementComponent),
//                 title: 'Transfer Management — Paymo Operations'
//             },
//             {
//                 path: 'payment-rails',
//                 loadComponent: () => import('./dashboard-core/payment-rails/payment-rails.component').then(m => m.PaymentRailsComponent),
//                 title: 'Payment Rails & Routing — Paymo Operations'
//             },
//             {
//                 path: 'liquidity',
//                 loadComponent: () => import('./dashboard-core/liquidity-management/liquidity-management.component').then(m => m.LiquidityManagementComponent),
//                 title: 'Liquidity & Float Management — Paymo Operations'
//             },
//             {
//                 path: 'reconciliation',
//                 loadComponent: () => import('./dashboard-core/reconciliation-center/reconciliation-center.component').then(m => m.ReconciliationCenterComponent),
//                 title: 'Reconciliation Center — Paymo Operations'
//             },
//             {
//                 path: 'settlement',
//                 loadComponent: () => import('./dashboard-core/settlement-clearing/settlement-clearing.component').then(m => m.SettlementClearingComponent),
//                 title: 'Settlement & Clearing — Paymo Operations'
//             },
//             {
//                 path: 'analytics',
//                 loadComponent: () => import('./dashboard-core/transaction-analytics/transaction-analytics.component').then(m => m.TransactionAnalyticsComponent),
//                 title: 'Transaction Analytics — Paymo Operations'
//             },
//             {
//                 path: 'compliance',
//                 loadComponent: () => import('./dashboard-core/compliance-aml/compliance-aml.component').then(m => m.ComplianceAmlComponent),
//                 title: 'Compliance & AML — Paymo Operations'
//             },
//             {
//                 path: 'api-integration',
//                 loadComponent: () => import('./dashboard-core/api-integration/api-integration.component').then(m => m.ApiIntegrationComponent),
//                 title: 'API & Integration Management — Paymo Operations'
//             },
//             {
//                 path: 'mobile-money',
//                 loadComponent: () => import('./dashboard-core/mobile-money-hub/mobile-money-hub.component').then(m => m.MobileMoneyHubComponent),
//                 title: 'Mobile Money & PSP Integration — Paymo Operations'
//             },
//             {
//                 path: 'government',
//                 loadComponent: () => import('./dashboard-core/government-integration/government-integration.component').then(m => m.GovernmentIntegrationComponent),
//                 title: 'Government Integration — Paymo Operations'
//             },
//             {
//                 path: 'fx',
//                 loadComponent: () => import('./dashboard-core/multi-currency-fx/multi-currency-fx.component').then(m => m.MultiCurrencyFxComponent),
//                 title: 'Multi-Currency & FX Management — Paymo Operations'
//             },
//             {
//                 path: 'customers',
//                 loadComponent: () => import('./dashboard-core/customer-account-mgmt/customer-account-mgmt.component').then(m => m.CustomerAccountMgmtComponent),
//                 title: 'Customer & Account Management — Paymo Operations'
//             },
//             {
//                 path: 'fees',
//                 loadComponent: () => import('./dashboard-core/fee-commission/fee-commission.component').then(m => m.FeeCommissionComponent),
//                 title: 'Fee & Commission Management — Paymo Operations'
//             },
//             {
//                 path: 'disputes',
//                 loadComponent: () => import('./dashboard-core/dispute-chargeback/dispute-chargeback.component').then(m => m.DisputeChargebackComponent),
//                 title: 'Dispute & Chargeback Management — Paymo Operations'
//             },
//             {
//                 path: 'system-health',
//                 loadComponent: () => import('./dashboard-core/system-health/system-health.component').then(m => m.SystemHealthComponent),
//                 title: 'System Health & Operations — Paymo Operations'
//             }
//         ]
//     }
// ];

// 