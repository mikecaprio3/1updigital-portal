import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  Project, ProjectDomainConfig, DnsRecordInstruction, 
  DomainRegistrar, ConnectionMethod, DnsSetupStatus, TechnicalVerificationStatus, SslStatus 
} from '../../types/portal';
import { 
  Globe, ShieldCheck, CheckCircle2, Clock, AlertTriangle, 
  Plus, Trash2, Edit3, Lock, ExternalLink, RefreshCw, Send, Copy, FileText, Check, HelpCircle
} from 'lucide-react';

interface AdminDomainLaunchWorkspaceProps {
  project: Project;
}

export const AdminDomainLaunchWorkspace: React.FC<AdminDomainLaunchWorkspaceProps> = ({ project }) => {
  const { 
    updateProjectDomainConfig, addDnsInstruction, deleteDnsInstruction, 
    toggleLaunchChecklistItem 
  } = usePortal();

  const domainConfig: ProjectDomainConfig = project.domainConfig || {
    initiated: false,
    domainName: 'thathairthoughsalon.com',
    registrar: 'GoDaddy',
    dnsProvider: 'GoDaddy DNS',
    hostingProvider: 'Google AI Studio / Cloud Run',
    isNewDomain: false,
    retainRegistrar: true,
    connectionMethod: 'DNS Update (A/CNAME)',
    dnsSetupStatus: 'Not Started',
    technicalVerificationStatus: 'Pending',
    sslStatus: 'Pending',
    instructions: [],
    checklist: []
  };

  // Form Editing State
  const [domainName, setDomainName] = useState(domainConfig.domainName);
  const [registrar, setRegistrar] = useState<DomainRegistrar>(domainConfig.registrar);
  const [dnsProvider, setDnsProvider] = useState(domainConfig.dnsProvider);
  const [hostingProvider, setHostingProvider] = useState(domainConfig.hostingProvider);
  const [connectionMethod, setConnectionMethod] = useState<ConnectionMethod>(domainConfig.connectionMethod);
  const [dnsSetupStatus, setDnsSetupStatus] = useState<DnsSetupStatus>(domainConfig.dnsSetupStatus);
  const [technicalVerificationStatus, setTechnicalVerificationStatus] = useState<TechnicalVerificationStatus>(domainConfig.technicalVerificationStatus);
  const [sslStatus, setSslStatus] = useState<SslStatus>(domainConfig.sslStatus);
  const [targetLaunchDate, setTargetLaunchDate] = useState(domainConfig.targetLaunchDate || project.targetCompletionDate);

  // New DNS Instruction Modal State
  const [showDnsModal, setShowDnsModal] = useState(false);
  const [newRecordType, setNewRecordType] = useState<'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX'>('A');
  const [newHostName, setNewHostName] = useState('@');
  const [newRequiredValue, setNewRequiredValue] = useState('216.239.32.21');
  const [newTtl, setNewTtl] = useState('3600');
  const [newAction, setNewAction] = useState<'Add' | 'Edit' | 'Remove'>('Add');
  const [newExplanation, setNewExplanation] = useState('Points root domain (@) to Google web hosting servers.');
  const [newWarningNote, setNewWarningNote] = useState('Do NOT delete or edit MX/SPF records to keep your business email active!');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSaveDomainSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProjectDomainConfig(project.id, {
      initiated: true,
      domainName: domainName.trim(),
      registrar,
      dnsProvider: dnsProvider.trim(),
      hostingProvider: hostingProvider.trim(),
      connectionMethod,
      dnsSetupStatus,
      technicalVerificationStatus,
      sslStatus,
      targetLaunchDate
    });
    alert('Domain & Launch Settings Saved!');
  };

  const handleAddDnsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequiredValue.trim()) return;

    addDnsInstruction(project.id, {
      recordType: newRecordType,
      hostName: newHostName.trim() || '@',
      requiredValue: newRequiredValue.trim(),
      ttl: newTtl.trim() || '3600',
      action: newAction,
      explanation: newExplanation.trim() || 'Required DNS routing record.',
      warningNote: newWarningNote.trim() || undefined
    });

    setShowDnsModal(false);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      
      {/* Top Launch Status Banner */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-widest text-[#B99A74] bg-[#B99A74]/10 px-2.5 py-0.5 rounded uppercase border border-[#B99A74]/20">
              Technical Readiness Hub
            </span>
            <span className="text-xs text-[#77736D]">Target Launch: {domainConfig.targetLaunchDate || project.targetCompletionDate}</span>
          </div>
          <h2 className="font-serif-heading text-2xl font-semibold text-[#171717] flex items-center gap-2">
            <Globe className="w-6 h-6 text-[#B99A74]" />
            Domain Setup & DNS Launch Workspace
          </h2>
          <p className="text-xs text-[#77736D] mt-0.5">
            Configure production DNS instructions, guide the client through setup, and execute launch verification.
          </p>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-2.5 bg-[#FAF8F4] border border-[#E8E2D9] rounded-xl text-center">
            <span className="text-[10px] uppercase text-[#77736D] font-semibold block">DNS Setup</span>
            <strong className={`text-xs font-bold ${
              domainConfig.dnsSetupStatus === 'Verified' ? 'text-emerald-700' :
              domainConfig.dnsSetupStatus === 'Client Completed' ? 'text-blue-700' : 'text-amber-800'
            }`}>
              {domainConfig.dnsSetupStatus}
            </strong>
          </div>

          <div className="p-2.5 bg-[#FAF8F4] border border-[#E8E2D9] rounded-xl text-center">
            <span className="text-[10px] uppercase text-[#77736D] font-semibold block">Verification</span>
            <strong className={`text-xs font-bold ${
              domainConfig.technicalVerificationStatus === 'Verified Live' ? 'text-emerald-700' : 'text-amber-800'
            }`}>
              {domainConfig.technicalVerificationStatus}
            </strong>
          </div>

          <div className="p-2.5 bg-[#FAF8F4] border border-[#E8E2D9] rounded-xl text-center">
            <span className="text-[10px] uppercase text-[#77736D] font-semibold block">SSL / HTTPS</span>
            <strong className={`text-xs font-bold ${
              domainConfig.sslStatus === 'Active & Secure' ? 'text-emerald-700' : 'text-neutral-700'
            }`}>
              {domainConfig.sslStatus}
            </strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Domain Config Form + Launch Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Domain & Provider Settings (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Settings Form */}
          <form onSubmit={handleSaveDomainSettings} className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8E2D9]">
              <h3 className="font-serif-heading text-base font-semibold text-[#171717]">
                1. Domain & Registrar Profile
              </h3>
              
              <button
                type="submit"
                className="px-4 py-2 bg-[#171717] hover:bg-[#262626] text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
              >
                Save Settings
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#171717] mb-1">Production Domain Name *</label>
                <input
                  type="text"
                  required
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  placeholder="e.g. thathairthoughsalon.com"
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">Domain Registrar</label>
                <select
                  value={registrar}
                  onChange={(e) => setRegistrar(e.target.value as DomainRegistrar)}
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none bg-white text-xs font-medium"
                >
                  <option value="GoDaddy">GoDaddy</option>
                  <option value="Hostinger">Hostinger</option>
                  <option value="Squarespace">Squarespace</option>
                  <option value="Cloudflare">Cloudflare</option>
                  <option value="Namecheap">Namecheap</option>
                  <option value="Google Domains / Porkbun">Google Domains / Porkbun</option>
                  <option value="Other / Not Sure">Other / Not Sure</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">DNS Manager / Provider</label>
                <input
                  type="text"
                  value={dnsProvider}
                  onChange={(e) => setDnsProvider(e.target.value)}
                  placeholder="e.g. GoDaddy DNS or Cloudflare"
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">Web Hosting Target</label>
                <input
                  type="text"
                  value={hostingProvider}
                  onChange={(e) => setHostingProvider(e.target.value)}
                  placeholder="e.g. Google AI Studio / Cloud Run"
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">Connection Method</label>
                <select
                  value={connectionMethod}
                  onChange={(e) => setConnectionMethod(e.target.value as ConnectionMethod)}
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none bg-white text-xs font-medium"
                >
                  <option value="DNS Update (A/CNAME)">DNS Record Update (A/CNAME)</option>
                  <option value="Nameserver Change">Nameserver Delegation</option>
                  <option value="Domain Transfer">Domain Transfer (Rare)</option>
                  <option value="Not Applicable">Not Applicable</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">DNS Setup Status</label>
                <select
                  value={dnsSetupStatus}
                  onChange={(e) => setDnsSetupStatus(e.target.value as DnsSetupStatus)}
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none bg-white text-xs font-bold"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="Initiated">Initiated (Instructions Sent to Client)</option>
                  <option value="Client Completed">Client Completed — Pending Verification</option>
                  <option value="Verified">Verified & Active</option>
                  <option value="Issue / Attention Needed">Issue / Needs Attention</option>
                  <option value="Not Applicable">Not Applicable</option>
                </select>
              </div>
            </div>
          </form>

          {/* DNS Instructions Card Builder */}
          <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8E2D9]">
              <div>
                <h3 className="font-serif-heading text-base font-semibold text-[#171717]">
                  2. Required DNS Record Instructions Card
                </h3>
                <p className="text-xs text-[#77736D]">
                  Verified DNS records displayed in the client's portal domain setup wizard.
                </p>
              </div>

              <button
                onClick={() => setShowDnsModal(true)}
                className="px-3.5 py-2 bg-[#171717] text-white hover:bg-[#262626] text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#B99A74]" />
                Add Record Instruction
              </button>
            </div>

            <div className="space-y-3">
              {domainConfig.instructions.length === 0 ? (
                <div className="text-center py-8 bg-[#FAF8F4] rounded-xl border border-[#E8E2D9] text-[#77736D] text-xs">
                  No DNS record instructions configured. Click "Add Record Instruction" to create verified A or CNAME instructions for the client.
                </div>
              ) : (
                domainConfig.instructions.map((inst) => (
                  <div key={inst.id} className="p-4 bg-[#FAF8F4] border border-[#E8E2D9] rounded-xl space-y-2 relative">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#171717] text-white font-mono font-bold text-[10px]">
                          {inst.recordType}
                        </span>
                        <span className="font-bold text-[#171717] font-mono text-xs">
                          Host: {inst.hostName}
                        </span>
                        <span className="text-neutral-400">→</span>
                        <span className="font-bold text-emerald-800 font-mono text-xs bg-white px-2 py-0.5 rounded border border-[#E8E2D9]">
                          {inst.requiredValue}
                        </span>
                      </div>

                      <button
                        onClick={() => deleteDnsInstruction(project.id, inst.id)}
                        className="p-1 text-rose-500 hover:text-rose-700"
                        title="Delete instruction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-[#77736D] leading-relaxed">{inst.explanation}</p>

                    {inst.warningNote && (
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-950 font-medium flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>{inst.warningNote}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Email Safety & Propagation Disclaimer */}
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-blue-950 text-[11px]">
              <strong className="font-semibold block text-blue-900">Email Safety & Propagation Rules:</strong>
              <p className="text-blue-800 leading-relaxed">
                Instructions explicitly instruct clients <strong className="text-blue-950">never to touch MX or SPF records</strong>, ensuring their existing Google Workspace or Microsoft 365 business email is uninterrupted.
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: Launch Readiness Checklist (1 col) */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-2xs space-y-4 h-fit sticky top-22">
          <div className="pb-3 border-b border-[#E8E2D9]">
            <h3 className="font-serif-heading text-base font-semibold text-[#171717] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#B99A74]" />
              Technical Launch Checklist
            </h3>
            <p className="text-[#77736D] text-[11px]">
              {domainConfig.checklist.filter(c => c.completed).length} of {domainConfig.checklist.length} checks completed.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            {domainConfig.checklist.map((item) => (
              <label
                key={item.id}
                onClick={() => toggleLaunchChecklistItem(project.id, item.id)}
                className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                  item.completed ? 'bg-emerald-50/50 border-emerald-200 text-[#171717]' : 'bg-[#FAF8F4] border-[#E8E2D9] text-[#77736D] hover:border-[#B99A74]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => {}} // Managed by onClick
                  className="mt-0.5 rounded text-[#171717] focus:ring-[#B99A74]"
                />
                <span className={`text-[11px] font-medium leading-tight ${item.completed ? 'line-through text-neutral-500' : 'text-[#171717]'}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E8E2D9] text-[10px] text-neutral-400">
            Note: Technical verification is independent of client submission confirmation.
          </div>
        </div>

      </div>

      {/* ADD DNS INSTRUCTION MODAL */}
      {showDnsModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E2D9] shadow-2xl space-y-4">
            <h3 className="font-serif-heading text-lg font-semibold text-[#171717]">Add DNS Record Instruction</h3>
            
            <form onSubmit={handleAddDnsSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#77736D] mb-1 font-semibold">Record Type</label>
                  <select
                    value={newRecordType}
                    onChange={(e) => setNewRecordType(e.target.value as any)}
                    className="w-full p-2 border border-[#E8E2D9] rounded-lg font-mono font-bold bg-white"
                  >
                    <option value="A">A Record</option>
                    <option value="CNAME">CNAME Record</option>
                    <option value="AAAA">AAAA Record</option>
                    <option value="TXT">TXT Record</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#77736D] mb-1 font-semibold">Host / Name</label>
                  <input
                    type="text"
                    required
                    value={newHostName}
                    onChange={(e) => setNewHostName(e.target.value)}
                    placeholder="e.g. @ or www"
                    className="w-full p-2 border border-[#E8E2D9] rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#77736D] mb-1 font-semibold">Required Target Value *</label>
                <input
                  type="text"
                  required
                  value={newRequiredValue}
                  onChange={(e) => setNewRequiredValue(e.target.value)}
                  placeholder="e.g. 216.239.32.21 or ghs.googlehosted.com"
                  className="w-full p-2 border border-[#E8E2D9] rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-[#77736D] mb-1 font-semibold">Plain-English Explanation</label>
                <input
                  type="text"
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="Points root domain to Google Cloud web servers."
                  className="w-full p-2 border border-[#E8E2D9] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[#77736D] mb-1 font-semibold">Warning Note (Optional)</label>
                <input
                  type="text"
                  value={newWarningNote}
                  onChange={(e) => setNewWarningNote(e.target.value)}
                  placeholder="Do NOT edit MX records to protect business email."
                  className="w-full p-2 border border-[#E8E2D9] rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setShowDnsModal(false)}
                  className="px-4 py-2 border border-[#E8E2D9] rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#171717] text-white font-semibold text-xs rounded-lg">
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
