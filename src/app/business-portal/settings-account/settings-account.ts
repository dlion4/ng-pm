import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NgClass } from '@angular/common';

type StatusKey = 'success' | 'warning' | 'danger' | 'active' | 'verified' | 'pending' | 'live' | 'paused';
interface FlowConfig { labels: string[]; closeOnDone?: boolean; doneMessage: string; }
interface TeamMember { name: string; email: string; role: string; department: string; limit: string; mfa: string; mfaStatus: StatusKey; lastLogin: string; }
interface ApiKey { name: string; environment: string; created: string; lastUsed: string; status: StatusKey; statusLabel: string; }
interface BankAccount { bank: string; accountName: string; accountNumber: string; branch: string; status: StatusKey; statusLabel: string; }
interface ComplianceDeadline { deadline: string; regulator: string; report: string; status: StatusKey; statusLabel: string; actionLabel: string; actionMessage: string; }
interface AuditLog { timestamp: string; user: string; action: string; details: string; ip: string; }
interface RoleRow { name: string; description: string; approvalLimit: string; users: number; }
interface BranchRow { name: string; location: string; manager: string; employees: number; collectionsMtd: string; status: StatusKey; statusLabel: string; }
interface SettingsMockData { teamMembers: TeamMember[]; apiKeys: ApiKey[]; bankAccounts: BankAccount[]; complianceDeadlines: ComplianceDeadline[]; auditLogs: AuditLog[]; roles: RoleRow[]; branches: BranchRow[]; }

@Component({ selector:'app-settings-account', standalone:true, imports:[NgClass], templateUrl:'./settings-account.html', styleUrl:'./settings-account.css', changeDetection:ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None })
export class SettingsAccountComponent {
  readonly mockData: SettingsMockData = {
    teamMembers: [
      { name:'James Kamau', email:'james.k@company.co.ke', role:'Owner', department:'—', limit:'Unlimited', mfa:'On', mfaStatus:'success', lastLogin:'Today 09:12' },
      { name:'Mary Wanjiku', email:'mary.w@company.co.ke', role:'Finance Admin', department:'Finance', limit:'KES 2M', mfa:'On', mfaStatus:'success', lastLogin:'Today 08:40' },
      { name:'Peter Otieno', email:'peter.o@company.co.ke', role:'HR Manager', department:'HR', limit:'KES 750K', mfa:'On', mfaStatus:'success', lastLogin:'Yesterday' },
      { name:'Amina Yusuf', email:'amina.y@company.co.ke', role:'Branch Manager', department:'Operations', limit:'KES 500K', mfa:'Pending', mfaStatus:'warning', lastLogin:'2 days ago' },
      { name:'Brian Kariuki', email:'brian.k@company.co.ke', role:'Viewer', department:'Audit', limit:'Read only', mfa:'Off', mfaStatus:'danger', lastLogin:'5 days ago' },
    ],
    apiKeys: [
      { name:'Production Key', environment:'Live', created:'12 Jan 2025', lastUsed:'Today 08:45', status:'active', statusLabel:'Active' },
      { name:'Sandbox Key', environment:'Test', created:'02 Mar 2025', lastUsed:'Yesterday', status:'active', statusLabel:'Active' },
    ],
    bankAccounts: [
      { bank:'Equity Bank', accountName:'J.K. Holdings Ltd', accountNumber:'0123456789', branch:'Westlands', status:'verified', statusLabel:'Verified' },
      { bank:'KCB Bank', accountName:'J.K. Holdings Ltd', accountNumber:'9988776655', branch:'Upper Hill', status:'verified', statusLabel:'Verified' },
      { bank:'Co-op Bank', accountName:'J.K. Collections', accountNumber:'1122334455', branch:'CBD', status:'pending', statusLabel:'Pending' },
    ],
    complianceDeadlines: [
      { deadline:'05 Jul 2025', regulator:'KRA', report:'TCC Renewal', status:'warning', statusLabel:'9 days', actionLabel:'Upload', actionMessage:'TCC renewal reminder set.' },
      { deadline:'09 Jul 2025', regulator:'NSSF', report:'Monthly Return', status:'warning', statusLabel:'13 days', actionLabel:'Generate', actionMessage:'NSSF return generated and submitted.' },
      { deadline:'09 Jul 2025', regulator:'SHIF', report:'Contribution', status:'warning', statusLabel:'13 days', actionLabel:'Submit', actionMessage:'SHIF contribution submitted.' },
      { deadline:'15 Jul 2025', regulator:'NITA', report:'Training Levy', status:'active', statusLabel:'18 days', actionLabel:'Generate', actionMessage:'NITA return generated.' },
      { deadline:'31 Jul 2025', regulator:'KRA', report:'P10 Report', status:'active', statusLabel:'34 days', actionLabel:'Download', actionMessage:'P10 report generated and ready for download.' },
    ],
    auditLogs: [
      { timestamp:'27 Jun 09:15', user:'James K.', action:'Profile Updated', details:'Trading name changed', ip:'41.204.12.45' },
      { timestamp:'27 Jun 08:52', user:'Mary W.', action:'API Key Used', details:'Payment initiation endpoint', ip:'102.68.11.91' },
      { timestamp:'26 Jun 17:40', user:'Peter O.', action:'Payroll Approval', details:'June payroll approved', ip:'41.204.12.48' },
      { timestamp:'26 Jun 14:05', user:'System', action:'Webhook Retry', details:'Invoice paid webhook retried', ip:'10.0.0.12' },
      { timestamp:'25 Jun 11:30', user:'Amina Y.', action:'Branch Updated', details:'Mombasa branch activated', ip:'102.68.12.11' },
      { timestamp:'24 Jun 16:00', user:'Brian K.', action:'Report Viewed', details:'Compliance score report', ip:'41.90.20.17' },
    ],
    roles: [
      { name:'Owner', description:'Full access including bank management', approvalLimit:'Unlimited', users:1 },
      { name:'Finance Admin', description:'Payments, invoices, reports', approvalLimit:'KES 2M', users:3 },
      { name:'HR Manager', description:'Payroll and employee management', approvalLimit:'KES 750K', users:2 },
      { name:'Branch Manager', description:'Branch operations and collections', approvalLimit:'KES 500K', users:4 },
      { name:'Viewer', description:'Read-only access to reports', approvalLimit:'None', users:5 },
    ],
    branches: [
      { name:'Head Office', location:'Westlands, Nairobi', manager:'James K.', employees:28, collectionsMtd:'KES 12.4M', status:'active', statusLabel:'Active' },
      { name:'Mombasa Branch', location:'Nyali, Mombasa', manager:'Amina Y.', employees:12, collectionsMtd:'KES 4.8M', status:'active', statusLabel:'Active' },
      { name:'Kisumu Branch', location:'Milimani, Kisumu', manager:'Peter O.', employees:8, collectionsMtd:'KES 2.1M', status:'active', statusLabel:'Active' },
      { name:'Eldoret Branch', location:'CBD, Eldoret', manager:'Mary W.', employees:5, collectionsMtd:'KES 980K', status:'pending', statusLabel:'Pending' },
    ],
  };
  readonly flows: Record<string, FlowConfig> = { kyc:{labels:['Type','Upload','Done'],closeOnDone:true,doneMessage:'KYC/KYB document submitted successfully.'}, invite:{labels:['Details','Permissions','Done'],closeOnDone:true,doneMessage:'Team invitation sent successfully.'} };
  readonly steps: Record<string, number> = { kyc:1, invite:1 };
  readonly tabs: Record<string,string> = { sec:'policy', api:'keys', comp:'calendar' };
  readonly openModals=new Set<string>(); toastMessage='';
  openModal(id:string):void{ this.openModals.clear(); this.openModals.add(id); this.resetFlowsForModal(id); }
  closeModal(id:string):void{ this.openModals.delete(id); this.resetFlowsForModal(id); }
  closeAllModals():void{ this.openModals.clear(); }
  isModalOpen(id:string):boolean{ return this.openModals.has(id); }
  hasOpenModal():boolean{ return this.openModals.size>0; }
  currentStep(flow:string):number{ return this.steps[flow]??1; }
  isStep(flow:string,step:number):boolean{ return this.currentStep(flow)===step; }
  stepperItems(flow:string):Array<{index:number;label:string;last:boolean}>{ const labels=this.flows[flow]?.labels??[]; return labels.map((label,i)=>({index:i+1,label,last:i===labels.length-1})); }
  nextFlow(flow:string,total=this.flows[flow]?.labels.length??1):void{ const next=Math.min((this.steps[flow]??1)+1,total); this.steps[flow]=next; if(next>=total){ this.notify(this.flows[flow]?.doneMessage||'Flow completed.'); const modal={kyc:'kycModal',invite:'userInviteModal'}[flow]; if(modal) window.setTimeout(()=>this.closeModal(modal),650); } }
  activeTab(prefix:string):string{ return this.tabs[prefix]??''; }
  switchTab(prefix:string,key:string,event?:Event):void{ this.tabs[prefix]=key; this.activatePill(event); }
  activatePill(event?:Event):void{ const target=event?.currentTarget as HTMLElement|null; const parent=target?.parentElement; parent?.querySelectorAll('.pill').forEach(p=>p.classList.remove('active')); target?.classList.add('active'); }
  selectBox(event:Event):void{ const box=event.currentTarget as HTMLElement|null; const row=box?.closest('.row'); row?.querySelectorAll<HTMLElement>('.border').forEach(item=>{item.style.borderColor=''; item.style.background='';}); if(box){box.style.borderColor='var(--pm-primary)'; box.style.background='rgba(79,70,229,.04)';} }
  processAction(modalId:string,message:string,ref=''):void{ this.notify(ref?`${message} Reference: ${ref}`:message); if(modalId) this.closeModal(modalId); }
  statusBadgeClass(status:string):string{ const s=status.toLowerCase(); if(['success','active','verified','live'].includes(s)) return 'B-s'; if(['warning','pending','paused'].includes(s)) return 'B-w'; if(['danger'].includes(s)) return 'B-d'; return 'B-s'; }
  moveFocus(event:Event):void{ const input=event.target as HTMLInputElement|null; if(input?.value?.length===1) (input.nextElementSibling as HTMLElement|null)?.focus(); }
  notify(message:string):void{ this.toastMessage=message||'Action completed.'; }
  clearToast():void{ this.toastMessage=''; }
  private resetFlowsForModal(id:string):void{ const map:Record<string,string[]>={ kycModal:['kyc'], userInviteModal:['invite'] }; for(const flow of map[id]??[]) this.steps[flow]=1; }
}
