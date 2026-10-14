import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Project, DomainRegistrar, DnsRecordInstruction } from '../../types/portal';
import { 
  Globe, ShieldCheck, CheckCircle2, Clock, AlertTriangle, 
  Copy, Check, ArrowRight, ArrowLeft, ExternalLink, HelpCircle, 
  X, Lock, Upload, Sparkles, AlertCircle
} from 'lucide-react';

interface GuidedDomainSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const GuidedDomainSetupModal: React.FC<GuidedDomainSetupModalProps> = ({ isOpen, onClose, project }) => {
  const { markClientDnsCompleted, submitClientDomainHelpRequest } = usePortal();

  const domainConfig = project.domainConfig || {
    initiated: true,
    domainName: 'thathairthoughsalon.com',
    registrar: 'GoDaddy',
    dnsProvider: 'GoDaddy DNS',
    hostingProvider: 'Google AI Studio / Cloud Run',
    isNewDomain: false,
    retainRegistrar: true,
    connectionMethod: 'DNS Update (A/CNAME)',
    dnsSetupStatus: 'Initiated',
    technicalVerificationStatus: 'Pending',
    sslStatus: 'Provisioning',
    instructions: [
      {
        id: 'dns-1',
        recordType: 'A',
        hostName: '@',
        requiredValue: '216.239.32.21',
        ttl: '3600',
        action: 'Add',
        explanation: 'Points your root domain (@) to Google web hosting servers.',
        warningNote: 'Do NOT touch or delete your MX or SPF records! Your business email will stay 100% active.'
      },
      {
        id: 'dns-2',
        recordType: 'CNAME',
        hostName: 'www',
        requiredValue: 'ghs.googlehosted.com',
        ttl: '3600',
        action: 'Add',
        explanation: 'Points www.thathairthoughsalon.com to your root domain.'
      }
    ],
    checklist: []
  };

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedRegistrar, setSelectedRegistrar] = useState<DomainRegistrar>(domainConfig.registrar || 'GoDaddy');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Help Request State
  const [showHelpForm, setShowHelpForm] = useState(false);
  const [helpMessage, setHelpMessage] = useState('');
  const [screenshotFileName, setScreenshotFileName] = useState('');
  const [helpSubmitted, setHelpSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmCompletion = () => {
    markClientDnsCompleted(project.id);
    setCurrentStep(4); // Move to Propagation & Verification step
  };

  const handleSendHelpRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpMessage.trim()) return;

    submitClientDomainHelpRequest(project.id, helpMessage, screenshotFileName ? `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400` : undefined);
    setHelpSubmitted(true);
    setTimeout(() => {
      setShowHelpForm(false);
      setHelpSubmitted(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-[#E8E2D9] shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-[#E8E2D9]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B99A74] bg-[#B99A74]/10 px-2.5 py-0.5 rounded border border-[#B99A74]/20">
                1UpSites Guided Launch
              </span>
              <span className="text-xs text-[#77736D]">Step {currentStep} of 4</span>
            </div>

            <h2 className="font-serif-heading text-2xl font-semibold text-[#171717] flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#B99A74]" />
              Connect Your Production Domain
            </h2>
          </div>

          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-[#171717]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Stepper Progress Bar */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { step: 1, label: '1. Domain & Provider' },
            { step: 2, label: '2. Provider Guide' },
            { step: 3, label: '3. DNS Records' },
            { step: 4, label: '4. Verification' }
          ].map(s => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`p-2 rounded-xl border text-[11px] font-semibold transition-all ${
                currentStep === s.step 
                  ? 'bg-[#171717] text-white border-[#171717] shadow-xs' 
                  : currentStep > s.step 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-[#FAF8F4] text-[#77736D] border-[#E8E2D9]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* STEP 1: CONFIRM DOMAIN & PROVIDER */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#FAF8F4] border border-[#E8E2D9] rounded-xl space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#B99A74] block">Confirmed Production Domain</span>
              <div className="font-serif-heading text-xl font-bold text-[#171717] font-mono">
                {domainConfig.domainName}
              </div>
              <p className="text-[#77736D] text-[11px]">
                This is the custom web address where your new website will be published live.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-[#171717]">Which provider holds or manages your domain?</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'GoDaddy', 'Hostinger', 'Squarespace', 'Cloudflare', 'Namecheap', 'Other / Not Sure'
                ].map(prov => (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => setSelectedRegistrar(prov as DomainRegistrar)}
                    className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                      selectedRegistrar === prov 
                        ? 'border-[#B99A74] bg-[#FAF8F4] text-[#171717] ring-1 ring-[#B99A74]/30' 
                        : 'border-[#E8E2D9] text-[#77736D] hover:bg-neutral-50'
                    }`}
                  >
                    <span>{prov}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#E8E2D9]">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 bg-[#171717] text-white hover:bg-[#262626] font-semibold rounded-xl flex items-center gap-2"
              >
                <span>Continue to Provider Guide</span>
                <ArrowRight className="w-4 h-4 text-[#B99A74]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROVIDER-SPECIFIC STEP-BY-STEP VISUAL GUIDE */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 font-medium">
              Step-by-step guidance for <strong>{selectedRegistrar}</strong>:
            </div>

            {/* Provider Visual Diagrams & Steps */}
            <div className="space-y-3">
              <div className="p-3.5 bg-[#FAF8F4] rounded-xl border border-[#E8E2D9] space-y-1">
                <span className="font-bold text-[#171717] block">Step A: Log into {selectedRegistrar}</span>
                <p className="text-[#77736D] leading-relaxed">
                  Sign into your {selectedRegistrar} account dashboard and navigate to <strong>My Products</strong> or <strong>Domains</strong>.
                </p>
              </div>

              <div className="p-3.5 bg-[#FAF8F4] rounded-xl border border-[#E8E2D9] space-y-1">
                <span className="font-bold text-[#171717] block">Step B: Open DNS Management</span>
                <p className="text-[#77736D] leading-relaxed">
                  Click on <strong>{domainConfig.domainName}</strong> and select <strong>DNS Management</strong>, <strong>Manage DNS</strong>, or <strong>DNS Records</strong>.
                </p>
              </div>

              <div className="p-3.5 bg-[#FAF8F4] rounded-xl border border-[#E8E2D9] space-y-1">
                <span className="font-bold text-[#171717] block">Step C: Locate Record Settings</span>
                <p className="text-[#77736D] leading-relaxed">
                  Look for the <strong>A Record</strong> (Host @) and <strong>CNAME Record</strong> (Host www) listed under DNS Records.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-[#E8E2D9]">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 border border-[#E8E2D9] rounded-xl text-[#77736D]"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 bg-[#171717] text-white hover:bg-[#262626] font-semibold rounded-xl flex items-center gap-2"
              >
                <span>View Exact DNS Records</span>
                <ArrowRight className="w-4 h-4 text-[#B99A74]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: EXACT DNS RECORD CARDS & COPY BUTTONS */}
        {currentStep === 3 && (
          <div className="space-y-4 text-xs">
            
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#171717]">
                Requested DNS Records for {domainConfig.domainName}:
              </span>
              <button
                onClick={() => setShowHelpForm(!showHelpForm)}
                className="text-[#B99A74] hover:underline font-semibold flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Need 1UpSites Help?
              </button>
            </div>

            {/* Help Request Form Overlay */}
            {showHelpForm && (
              <form onSubmit={handleSendHelpRequest} className="p-4 bg-[#FAF8F4] border border-[#B99A74]/50 rounded-xl space-y-3 animate-fade-in">
                <div className="flex justify-between items-center">
                  <strong className="text-[#171717] font-semibold">Request 1UpSites Assistance</strong>
                  <button type="button" onClick={() => setShowHelpForm(false)} className="text-neutral-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* SAFETY WARNING */}
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-950 text-[11px] font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  <p>
                    <strong className="block text-rose-900">Privacy & Security Reminder:</strong>
                    Do NOT share your account passwords, 2FA security codes, or auth codes. If attaching a screenshot, please redact sensitive login details.
                  </p>
                </div>

                <textarea
                  rows={2}
                  required
                  value={helpMessage}
                  onChange={(e) => setHelpMessage(e.target.value)}
                  placeholder="Tell us what provider screen you are viewing or ask any question..."
                  className="w-full p-2.5 bg-white border border-[#E8E2D9] rounded-lg text-xs"
                ></textarea>

                <div className="flex justify-between items-center">
                  <input
                    type="text"
                    value={screenshotFileName}
                    onChange={(e) => setScreenshotFileName(e.target.value)}
                    placeholder="Optional screenshot filename (e.g. godaddy_dns.png)"
                    className="p-2 bg-white border border-[#E8E2D9] rounded-lg text-xs w-64"
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#171717] text-white font-semibold rounded-lg hover:bg-[#262626]"
                  >
                    Send Help Note
                  </button>
                </div>

                {helpSubmitted && (
                  <span className="text-emerald-700 font-semibold block text-[11px]">
                    Help note submitted! 1UpSites will inspect your project records.
                  </span>
                )}
              </form>
            )}

            {/* DNS Records List with 1-Click Copy */}
            <div className="space-y-3">
              {domainConfig.instructions.map((inst) => (
                <div key={inst.id} className="p-4 bg-white border border-[#E8E2D9] rounded-xl shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E8E2D9]">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-[#171717] text-[#B99A74] font-mono font-bold text-xs">
                        Type: {inst.recordType}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#171717]">
                        Host: {inst.hostName}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(inst.requiredValue, inst.id)}
                      className="px-3 py-1 bg-[#FAF8F4] hover:bg-neutral-200 border border-[#E8E2D9] text-[#171717] font-semibold text-[11px] rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                    >
                      {copiedId === inst.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#B99A74]" />}
                      <span>{copiedId === inst.id ? 'Copied Value!' : 'Copy Target Value'}</span>
                    </button>
                  </div>

                  <div className="p-2.5 bg-[#FAF8F4] rounded-lg border border-[#E8E2D9] font-mono text-xs text-neutral-900 break-all">
                    {inst.requiredValue}
                  </div>

                  <p className="text-[#77736D] text-[11px] leading-relaxed">{inst.explanation}</p>

                  {inst.warningNote && (
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-950 font-medium text-[11px]">
                      ⚠️ {inst.warningNote}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-[11px] leading-relaxed">
              <strong className="font-semibold block text-amber-900">Email Safety Protection:</strong>
              Your existing business email service is hosted separately on MX records. Updating these web A/CNAME records <strong className="text-amber-950">will NOT disrupt your business email</strong>.
            </div>

            <div className="flex justify-between pt-4 border-t border-[#E8E2D9]">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 border border-[#E8E2D9] rounded-xl text-[#77736D]"
              >
                Back
              </button>

              <button
                onClick={handleConfirmCompletion}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl flex items-center gap-2 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>I've Updated My DNS Records</span>
              </button>
            </div>

          </div>
        )}

        {/* STEP 4: PROPAGATION & VERIFICATION TRACKER */}
        {currentStep === 4 && (
          <div className="space-y-4 text-xs text-center py-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6 animate-spin" />
            </div>

            <h3 className="font-serif-heading text-xl font-semibold text-[#171717]">
              DNS Changes Submitted — Propagation in Progress
            </h3>

            <p className="text-[#77736D] max-w-md mx-auto leading-relaxed text-xs">
              Thank you! Your DNS confirmation has been recorded in the 1UpSites project workspace. Technical propagation usually takes between 15 minutes and 24 hours depending on TTL settings.
            </p>

            <div className="p-4 bg-[#FAF8F4] rounded-2xl border border-[#E8E2D9] text-left max-w-md mx-auto space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#77736D]">Domain Target:</span>
                <strong className="text-[#171717] font-mono">{domainConfig.domainName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#77736D]">Technical Status:</span>
                <strong className="text-blue-700 font-bold">{domainConfig.technicalVerificationStatus}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#77736D]">SSL Certificate:</span>
                <strong className="text-neutral-800 font-bold">{domainConfig.sslStatus}</strong>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#171717] text-white hover:bg-[#262626] font-semibold rounded-xl text-xs"
              >
                Return to Portal
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
