import { Component, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-homepage',
  standalone: true,
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css']
})
export class HomepageComponent implements AfterViewInit, OnDestroy {
  private fxInterval: any = null;
  private liveCounterInterval: any = null;
  private scrollObserver: IntersectionObserver | null = null;
  private lastPlanText = 'Your rollout summary will appear here.';

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.initFxTicker();
    this.initLiveCounter();
    this.initProblemToggle();
    this.initStackLayers();
    this.initUseCases();
    this.initCoverageFilter();
    this.initCodeSwitcher();
    this.initCopyButtons();
    this.initDownloadButtons();
    this.initPlanGenerator();
    this.initRevealObserver();
    this.initYear();
  }

  ngOnDestroy(): void {
    if (this.fxInterval) clearInterval(this.fxInterval);
    if (this.liveCounterInterval) clearInterval(this.liveCounterInterval);
    if (this.scrollObserver) this.scrollObserver.disconnect();
  }

  // ========== FX DATA & RENDERING ==========
  private fxData = [
    { pair: 'USD / NGN', value: 1536.42, delta: 0.48, points: [20, 28, 24, 31, 34, 29, 36, 40] },
    { pair: 'USD / KES', value: 129.16, delta: -0.21, points: [34, 32, 31, 33, 29, 27, 30, 28] },
    { pair: 'USD / GHS', value: 15.08, delta: 0.18, points: [16, 19, 17, 21, 23, 22, 25, 27] },
    { pair: 'EUR / XOF', value: 655.96, delta: 0.09, points: [24, 26, 25, 26, 29, 30, 31, 32] }
  ];

  private sparklineSvg(points: number[], idSuffix: number): string {
    const w = 220;
    const h = 36;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const span = max - min || 1;
    const gradientId = `sparkGradient-${idSuffix}`;
    const coords = points.map((point, index) => {
      const x = (index / (points.length - 1)) * w;
      const y = h - ((point - min) / span) * (h - 4) - 2;
      return `${x},${y}`;
    }).join(' ');
    return `
      <svg viewBox="0 0 ${w} ${h}" class="sparkline" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#10b981" />
            <stop offset="100%" stop-color="#059669" />
          </linearGradient>
        </defs>
        <polyline fill="none" stroke="url(#${gradientId})" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${coords}"></polyline>
      </svg>`;
  }

  private renderFx(): void {
    const wrap = document.getElementById('fxTicker');
    if (!wrap) return;
    wrap.innerHTML = this.fxData.map((item, index) => {
      const deltaClass = item.delta >= 0 ? 'up' : 'down';
      const deltaArrow = item.delta >= 0 ? '↗' : '↘';
      return `
        <div class="glass-card fx-card">
          <div class="fx-label">${item.pair}</div>
          <div class="fx-value">${item.value.toFixed(2)}</div>
          <div class="fx-delta ${deltaClass}">${deltaArrow} ${Math.abs(item.delta).toFixed(2)}%</div>
          ${this.sparklineSvg(item.points, index)}
        </div>
      `;
    }).join('');
  }

  private updateFx(): void {
    this.fxData.forEach(item => {
      const shift = (Math.random() - 0.5) * item.value * 0.0016;
      item.value += shift;
      item.delta = (Math.random() - 0.45) * 0.9;
      item.points = item.points.slice(1);
      item.points.push(Math.max(10, item.points[item.points.length - 1] + (Math.random() * 8 - 4)));
    });
    this.renderFx();
  }

  private initFxTicker(): void {
    this.renderFx();
    this.fxInterval = setInterval(() => this.updateFx(), 3600);
  }

  // ========== LIVE COUNTER ==========
  private initLiveCounter(): void {
    let liveCount = 1284320;
    const counterEl = document.getElementById('liveCounter');
    if (!counterEl) return;
    this.liveCounterInterval = setInterval(() => {
      liveCount += Math.floor(Math.random() * 9) + 3;
      counterEl.textContent = liveCount.toLocaleString();
    }, 1400);
  }

  // ========== PROBLEM TOGGLE ==========
  private initProblemToggle(): void {
    document.querySelectorAll('[data-problem]').forEach(btn => {
      this.renderer.listen(btn, 'click', () => {
        const mode = (btn as HTMLElement).dataset['problem'];
        document.querySelectorAll('[data-problem]').forEach(b => b.classList.toggle('active', (b as HTMLElement).dataset['problem'] === mode));
        const beforeEl = document.getElementById('problemBefore');
        const afterEl = document.getElementById('problemAfter');
        if (beforeEl) beforeEl.classList.toggle('active', mode === 'before');
        if (afterEl) afterEl.classList.toggle('active', mode === 'after');
      });
    });
  }

  // ========== STACK LAYERS ==========
  private stackData: Record<string, any> = {
    global: {
      title: 'Global rails',
      text: 'Bank transfers and card push networks connect Paymo to global payout corridors without forcing teams to rebuild treasury and compliance per route.',
      chips: ['SWIFT', 'SEPA', 'ACH', 'FedWire', 'CHAPS', 'Visa Direct', 'Mastercard Send']
    },
    africa: {
      title: 'African local rails',
      text: 'Deep local coverage spans mobile money, domestic bank transfers, ACH networks, and market-specific clearing systems across priority African corridors.',
      chips: ['M-Pesa', 'MTN MoMo', 'Airtel Money', 'Orange Money', 'Wave', 'GhIPSS', 'NIBSS', 'PesaLink']
    },
    banking: {
      title: 'Embedded banking',
      text: 'Virtual accounts, sub-accounts, wallets, and programmable balances let platforms launch branded finance products without building a ledger stack from scratch.',
      chips: ['Virtual accounts', 'Sub-ledgers', 'Wallets', 'Interest-ready balances', 'Account naming', 'Balance segregation']
    },
    intelligence: {
      title: 'Intelligence layer',
      text: 'FX timing, treasury balancing, fraud signals, and route-quality decisions sit above the rails so capital and reliability both improve with scale.',
      chips: ['Dynamic FX', 'Smart routing', 'Cash forecasting', 'Fraud detection', 'Liquidity signals', 'Failure recovery']
    },
    compliance: {
      title: 'Compliance shield',
      text: 'KYC, KYB, sanctions, AML monitoring, and reporting workflows are embedded into onboarding and transaction flows for pan-African expansion.',
      chips: ['KYC', 'KYB', 'AML', 'Sanctions', 'Monitoring', 'Regulatory reporting']
    }
  };

  private updateStack(layerKey: string): void {
    const data = this.stackData[layerKey];
    if (!data) return;
    const titleEl = document.getElementById('stackTitle');
    const textEl = document.getElementById('stackText');
    const chipsEl = document.getElementById('stackChips');
    if (titleEl) titleEl.textContent = data.title;
    if (textEl) textEl.textContent = data.text;
    if (chipsEl) chipsEl.innerHTML = data.chips.map((chip: string) => `<span class="data-chip">${chip}</span>`).join('');
    document.querySelectorAll('.stack-layer').forEach(btn => btn.classList.toggle('active', (btn as HTMLElement).dataset['layer'] === layerKey));
  }

  private initStackLayers(): void {
    document.querySelectorAll('.stack-layer').forEach(btn => {
      this.renderer.listen(btn, 'click', () => this.updateStack((btn as HTMLElement).dataset['layer'] || 'global'));
    });
    this.updateStack('global');
  }

  // ========== USE CASES ==========
  private useCases: Record<string, any> = {
    neobank: {
      title: 'Launch a digital bank in 90 days.',
      description: 'Combine virtual accounts, cards, compliance, customer wallets, and treasury routing in one rollout path without building core banking primitives from scratch.',
      bullets: ['White-label account journeys and onboarding flows.', 'Wallet and ledger infrastructure for retail or SME balances.', 'Programmatic cards, transfers, and payout controls.'],
      metrics: ['90-day launch path', 'Accounts + cards', 'Built-in compliance']
    },
    payroll: {
      title: 'Pay teams across markets with one payroll rail.',
      description: 'Run payroll and contractor disbursements across multiple countries with local payout options, smart FX timing, and centralized reconciliation.',
      bullets: ['Local-currency payouts and account or wallet delivery.', 'Bulk payment APIs and scheduled disbursement windows.', 'Finance-grade ledger exports for payroll reconciliation.'],
      metrics: ['Bulk payout ready', 'Local-currency delivery', 'Reconciliation built in']
    },
    ecommerce: {
      title: 'Accept locally, settle intelligently.',
      description: 'Collect with mobile money or bank transfers, then route settlement using the best treasury and payout options for each market.',
      bullets: ['Single integration for multi-market checkout.', 'Unified events for collections, refunds, and merchant settlement.', 'Better payout continuity through route fallback logic.'],
      metrics: ['One checkout layer', 'Unified settlement', 'Fallback routing']
    },
    treasury: {
      title: 'Turn treasury from a spreadsheet into a system.',
      description: 'Track positions, convert on stronger windows, route to the best rail, and view reconciliation outputs from one control plane.',
      bullets: ['FX window optimization and liquidity awareness.', 'Balance segmentation across currencies and entities.', 'Operational alerting around route health and float exposure.'],
      metrics: ['FX intelligence', 'Balance orchestration', 'Operator control']
    },
    remittance: {
      title: 'Build a remittance superapp with rail depth.',
      description: 'Support bank deposit, wallet, and mobile money delivery while maintaining compliance controls and payout visibility end to end.',
      bullets: ['Cash-out flexibility across rail types.', 'Identity and monitoring controls inside the flow.', 'Event-level status for customer support and operations teams.'],
      metrics: ['Wallet + bank delivery', 'Customer support traceability', 'Compliance embedded']
    },
    supplier: {
      title: 'Run supplier payments from one dashboard layer.',
      description: 'Move funds to local suppliers, international vendors, and service partners using a single payout workflow and ledger-backed finance controls.',
      bullets: ['Bulk supplier payouts and approval logic.', 'Global and local route support from one stack.', 'Audit-ready records for AP teams and treasury operators.'],
      metrics: ['AP workflow ready', 'Local + global reach', 'Audit-grade records']
    }
  };

  private updateCase(caseKey: string): void {
    const data = this.useCases[caseKey];
    if (!data) return;
    const titleEl = document.getElementById('caseTitle');
    const descEl = document.getElementById('caseDescription');
    const bulletsEl = document.getElementById('caseBullets');
    const metricsEl = document.getElementById('caseMetrics');
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.description;
    if (bulletsEl) bulletsEl.innerHTML = data.bullets.map((item: string) => `<li><span class="icon-badge"><i class="bi bi-check2"></i></span><span>${item}</span></li>`).join('');
    if (metricsEl) metricsEl.innerHTML = data.metrics.map((item: string) => `<div class="mini-stat"><strong>${item}</strong></div>`).join('');
    document.querySelectorAll('.orbit-node').forEach(btn => btn.classList.toggle('active', (btn as HTMLElement).dataset['case'] === caseKey));
  }

  private initUseCases(): void {
    document.querySelectorAll('.orbit-node').forEach(btn => {
      this.renderer.listen(btn, 'click', () => this.updateCase((btn as HTMLElement).dataset['case'] || 'neobank'));
    });
    this.updateCase('neobank');
  }

  // ========== COVERAGE FILTER ==========
  private initCoverageFilter(): void {
    document.querySelectorAll('.coverage-filter').forEach(btn => {
      this.renderer.listen(btn, 'click', () => {
        const region = (btn as HTMLElement).dataset['region'] || 'all';
        document.querySelectorAll('.coverage-filter').forEach(b => b.classList.toggle('active', (b as HTMLElement).dataset['region'] === region));
        document.querySelectorAll('.coverage-card').forEach(card => {
          const match = region === 'all' || (card as HTMLElement).dataset['region'] === region;
          card.classList.toggle('hidden-region', !match);
        });
      });
    });
  }

  // ========== CODE SWITCHER ==========
  private codeSamples: Record<string, string> = {
    curl: `curl --request POST https://sandbox.paymo.africa/v1/payouts\
  --header "Authorization: Bearer pk_sandbox_paymo" \
  --header "Content-Type: application/json" \
  --data '{
    "reference": "payroll_2026_08_001",
    "currency": "KES",
    "amount": 125000,
    "destination": {
      "type": "mobile_money",
      "provider": "mpesa",
      "phone": "+254700000000"
    },
    "compliance_profile": "standard_business",
    "narration": "Monthly payroll settlement"
  }'`,
    node: `import Paymo from 'paymo-baas';

const client = new Paymo({
  apiKey: 'pk_sandbox_paymo',
  environment: 'sandbox'
});

const payout = await client.payouts.create({
  reference: 'supplier_run_2026_08_001',
  currency: 'NGN',
  amount: 2500000,
  destination: {
    type: 'bank_account',
    bankCode: '999',
    accountNumber: '0123456789',
    accountName: 'Lagos Parts Ltd'
  },
  settlementPreference: 'best_available_route'
});

console.log(payout.status);`,
    js: `const payload = {
  reference: 'merchant_settlement_2026_08_001',
  currency: 'GHS',
  amount: 54000,
  destination: {
    type: 'wallet',
    network: 'momo',
    identifier: 'merchant_wallet_001'
  },
  metadata: {
    routeStrategy: 'smart_fx_window'
  }
};

fetch('https://sandbox.paymo.africa/v1/payouts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer pk_sandbox_paymo',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
}).then(res => res.json()).then(console.log);`
  };

  private setCode(type: string): void {
    document.querySelectorAll('.code-tab').forEach(btn => btn.classList.toggle('active', (btn as HTMLElement).dataset['code'] === type));
    const outputEl = document.getElementById('codeOutput');
    if (outputEl) outputEl.textContent = this.codeSamples[type] || '';
  }

  private initCodeSwitcher(): void {
    document.querySelectorAll('.code-tab').forEach(btn => {
      this.renderer.listen(btn, 'click', () => this.setCode((btn as HTMLElement).dataset['code'] || 'curl'));
    });
    this.setCode('curl');
  }

  // ========== COPY & DOWNLOAD HELPERS ==========
  private async copyText(text: string, successLabel: string, targetButton: HTMLElement | null): Promise<void> {
    const setSuccessState = () => {
      if (targetButton && successLabel) {
        const original = targetButton.innerHTML;
        targetButton.innerHTML = successLabel;
        setTimeout(() => { targetButton.innerHTML = original; }, 1400);
      }
    };
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setSuccessState();
        return;
      }
      const helper = document.createElement('textarea');
      helper.value = text;
      helper.setAttribute('readonly', '');
      helper.style.position = 'absolute';
      helper.style.left = '-9999px';
      document.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
      setSuccessState();
    } catch (error) {
      console.error('Clipboard copy failed', error);
    }
  }

  private downloadFile(filename: string, content: string, mime: string): void {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  private initCopyButtons(): void {
    const copyCodeBtn = document.getElementById('copyCode');
    if (copyCodeBtn) {
      this.renderer.listen(copyCodeBtn, 'click', () => {
        const codeOutput = document.getElementById('codeOutput');
        if (codeOutput) { void this.copyText(codeOutput.textContent || '', 'Copied', copyCodeBtn as HTMLElement); }
      });
    }

    const copyBaseUrlBtn = document.getElementById('copyBaseUrl');
    if (copyBaseUrlBtn) {
      this.renderer.listen(copyBaseUrlBtn, 'click', () => { void this.copyText('https://sandbox.paymo.africa/v1', 'Copied', copyBaseUrlBtn as HTMLElement); });
    }

    const panelCopyBaseUrlBtn = document.getElementById('panelCopyBaseUrl');
    if (panelCopyBaseUrlBtn) {
      this.renderer.listen(panelCopyBaseUrlBtn, 'click', () => { void this.copyText('https://sandbox.paymo.africa/v1', 'Copied', panelCopyBaseUrlBtn as HTMLElement); });
    }

    const copyPlanBtn = document.getElementById('copyPlan');
    if (copyPlanBtn) {
      this.renderer.listen(copyPlanBtn, 'click', () => { void this.copyText(this.lastPlanText, 'Copied', copyPlanBtn as HTMLElement); });
    }
  }

  private initDownloadButtons(): void {
    const postmanStarter = {
      info: { name: 'Paymo BAAS Starter Collection', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' },
      item: [
        {
          name: 'Create payout',
          request: {
            method: 'POST',
            header: [
              { key: 'Authorization', value: 'Bearer pk_sandbox_paymo' },
              { key: 'Content-Type', value: 'application/json' }
            ],
            url: { raw: 'https://sandbox.paymo.africa/v1/payouts', protocol: 'https', host: ['sandbox', 'paymo', 'africa'], path: ['v1', 'payouts'] },
            body: { mode: 'raw', raw: JSON.stringify({ reference: 'sample_payout_001', currency: 'KES', amount: 5000, destination: { type: 'mobile_money', provider: 'mpesa', phone: '+254700000000' } }, null, 2) }
          }
        },
        {
          name: 'Create virtual account',
          request: {
            method: 'POST',
            header: [
              { key: 'Authorization', value: 'Bearer pk_sandbox_paymo' },
              { key: 'Content-Type', value: 'application/json' }
            ],
            url: { raw: 'https://sandbox.paymo.africa/v1/accounts/virtual', protocol: 'https', host: ['sandbox', 'paymo', 'africa'], path: ['v1', 'accounts', 'virtual'] },
            body: { mode: 'raw', raw: JSON.stringify({ customer_id: 'cust_001', currency: 'USD', label: 'Marketplace collections' }, null, 2) }
          }
        }
      ]
    };

    const capabilityBrief = `PAYMO BAAS — HOMEPAGE CAPABILITY BRIEF

Positioning:
The financial nervous system for borderless Africa.

Core promise:
Build, bank, and move money across Africa and the world from a single API.

Key platform layers:
1. Global rails
2. African local rails
3. Embedded banking
4. Intelligence layer
5. Compliance shield

Primary homepage sections:
- Dynamic hero
- Problem / before vs after
- Unified platform stack
- Use case constellation
- Live network coverage
- Product modules
- Developer experience
- Security and trust center
- FAQ and final CTA

Primary audiences:
- Fintechs and neobanks
- E-commerce and marketplaces
- Payroll and supplier operations
- Enterprise treasury teams
- Remittance builders

Design language:
Dark neon glassmorphism, cyan/blue glow edges, bold typography, layered cards, operational flow visuals.`;

    const downloadPostmanBtn = document.getElementById('downloadPostman');
    if (downloadPostmanBtn) {
      this.renderer.listen(downloadPostmanBtn, 'click', () => this.downloadFile('paymo-baas-starter.json', JSON.stringify(postmanStarter, null, 2), 'application/json'));
    }

    const panelDownloadStarterBtn = document.getElementById('panelDownloadStarter');
    if (panelDownloadStarterBtn) {
      this.renderer.listen(panelDownloadStarterBtn, 'click', () => this.downloadFile('paymo-baas-starter.json', JSON.stringify(postmanStarter, null, 2), 'application/json'));
    }

    const downloadBriefTopBtn = document.getElementById('downloadBriefTop');
    if (downloadBriefTopBtn) {
      this.renderer.listen(downloadBriefTopBtn, 'click', () => this.downloadFile('paymo-capability-brief.txt', capabilityBrief, 'text/plain'));
    }

    const downloadBriefBottomBtn = document.getElementById('downloadBriefBottom');
    if (downloadBriefBottomBtn) {
      this.renderer.listen(downloadBriefBottomBtn, 'click', () => this.downloadFile('paymo-capability-brief.txt', capabilityBrief, 'text/plain'));
    }
  }

  // ========== PLAN GENERATOR ==========
  private generatePlan(): string {
    const useCaseEl = document.getElementById('planUseCase') as HTMLSelectElement | null;
    const marketsEl = document.getElementById('planMarkets') as HTMLSelectElement | null;
    const settlementEl = document.getElementById('planSettlement') as HTMLSelectElement | null;
    const deliveryEl = document.getElementById('planDelivery') as HTMLSelectElement | null;

    const useCase = useCaseEl?.value || 'Neobank launch';
    const markets = marketsEl?.value || '2';
    const settlement = settlementEl?.value || 'local payout speed';
    const delivery = deliveryEl?.value || 'API-first integration';

    const html = `
      <small class="text-info text-uppercase d-block mb-2" style="letter-spacing:0.16em;">Generated rollout summary</small>
      <h3 class="display-font fs-4 mb-3">${useCase} across ${markets}</h3>
      <p class="text-muted-paymo mb-3">Recommended model: <strong class="text-white">${delivery}</strong>. Prioritize <strong class="text-white">${settlement}</strong> as the lead success metric while launching Paymo through a staged regional rollout.</p>
      <ul class="bullet-list mb-0">
        <li><span class="icon-badge"><i class="bi bi-1-circle"></i></span><span>Phase 1: activate collections, payout routes, ledgering, and compliance policies in the first core markets.</span></li>
        <li><span class="icon-badge"><i class="bi bi-2-circle"></i></span><span>Phase 2: enable treasury balancing, FX routing, and route fallback logic as transaction volume grows.</span></li>
        <li><span class="icon-badge"><i class="bi bi-3-circle"></i></span><span>Phase 3: expand into branded account experiences, card issuance, or deeper white-label rollout where relevant.</span></li>
      </ul>
    `;
    const planOutput = document.getElementById('planOutput');
    if (planOutput) planOutput.innerHTML = html;
    return `Paymo rollout summary

Use case: ${useCase}
Markets: ${markets}
Priority: ${settlement}
Delivery: ${delivery}

Recommended sequence:
1. Launch core rails, compliance, and ledgering.
2. Add treasury balancing and FX-aware routing.
3. Expand into branded accounts, cards, or white-label products as needed.`;
  }

  private initPlanGenerator(): void {
    const generatePlanBtn = document.getElementById('generatePlan');
    if (generatePlanBtn) {
      this.renderer.listen(generatePlanBtn, 'click', () => {
        this.lastPlanText = this.generatePlan();
      });
    }
  }

  // ========== REVEAL OBSERVER ==========
  private initRevealObserver(): void {
    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          this.scrollObserver?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    document.querySelectorAll('.reveal').forEach(el => this.scrollObserver?.observe(el));
  }

  // ========== YEAR ==========
  private initYear(): void {
    const yearEl = document.getElementById('yearNow');
    if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
  }
}