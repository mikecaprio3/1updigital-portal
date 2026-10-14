import React, { useState } from 'react';
import { usePortal, NewProspectPayload } from '../../context/PortalContext';
import { ProspectStatus } from '../../types/portal';
import { X, Sparkles, Building2, ExternalLink, Lock, CheckCircle2, DollarSign, Calendar } from 'lucide-react';

interface NewProspectProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (projectId: string) => void;
}

export const NewProspectProjectModal: React.FC<NewProspectProjectModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { addProspectWithProject, setActiveAdminTab, setActiveProjectId } = usePortal();

  const [businessName, setBusinessName] = useState('');
  const [primaryContact, setPrimaryContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  
  const [aiStudioPublishedUrl, setAiStudioPublishedUrl] = useState('');
  const [aiStudioEditorUrl, setAiStudioEditorUrl] = useState('');

  const [proposedValue, setProposedValue] = useState<string>('');
  const [expectedCloseDate, setExpectedCloseDate] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [relationshipStage, setRelationshipStage] = useState<ProspectStatus>('Demo in Progress');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !projectName.trim()) return;

    const payload: NewProspectPayload = {
      businessName: businessName.trim(),
      primaryContact: primaryContact.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      projectName: projectName.trim(),
      projectDescription: projectDescription.trim() || undefined,
      aiStudioPublishedUrl: aiStudioPublishedUrl.trim() || 'https://ai.studio/',
      aiStudioEditorUrl: aiStudioEditorUrl.trim() || 'https://aistudio.google.com/',
      proposedValue: proposedValue ? parseFloat(proposedValue) : undefined,
      expectedCloseDate: expectedCloseDate || undefined,
      followUpDate: followUpDate || undefined,
      relationshipStage,
      notes: notes.trim() || undefined
    };

    const { projectId } = addProspectWithProject(payload);

    // Reset Form
    setBusinessName('');
    setPrimaryContact('');
    setEmail('');
    setPhone('');
    setProjectName('');
    setProjectDescription('');
    setAiStudioPublishedUrl('');
    setAiStudioEditorUrl('');
    setProposedValue('');
    setExpectedCloseDate('');
    setFollowUpDate('');
    setNotes('');

    onClose();

    if (onSuccess) {
      onSuccess(projectId);
    } else {
      setActiveAdminTab('prospects_clients');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-[#E8E2D9] shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-[#E8E2D9]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B99A74] bg-[#B99A74]/10 px-2.5 py-0.5 rounded border border-[#B99A74]/20">
                1UpSites Agency Workflow
              </span>
              <span className="text-xs text-[#77736D]">· Unified Onboarding</span>
            </div>
            <h2 className="font-serif-heading text-2xl font-semibold text-[#171717]">
              New Prospect / Project Setup
            </h2>
            <p className="text-xs text-[#77736D] mt-0.5">
              Create a new business lead and link their Google AI Studio demo website in one step. Portal access will remain disabled.
            </p>
          </div>

          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-[#171717] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* Section 1: Business & Contact Info */}
          <div className="space-y-3">
            <h3 className="font-serif-heading text-sm font-semibold text-[#171717] flex items-center gap-2 border-b border-[#E8E2D9] pb-1.5">
              <Building2 className="w-4 h-4 text-[#B99A74]" />
              1. Prospect & Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#171717] mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    if (!projectName) setProjectName(`${e.target.value} Website`);
                  }}
                  placeholder="e.g. That Hair Though Beauty Bar"
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">Primary Contact Name</label>
                <input
                  type="text"
                  value={primaryContact}
                  onChange={(e) => setPrimaryContact(e.target.value)}
                  placeholder="e.g. Chloe Bennett"
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">Contact Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="chloe@thathairthoughsalon.com"
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(203) 555-0188"
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none bg-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Project Details & Google AI Studio Links */}
          <div className="space-y-3">
            <h3 className="font-serif-heading text-sm font-semibold text-[#171717] flex items-center gap-2 border-b border-[#E8E2D9] pb-1.5">
              <ExternalLink className="w-4 h-4 text-[#B99A74]" />
              2. Project Details & Google AI Studio Links
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-[#171717] mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. That Hair Though Beauty Bar Website"
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Boutique salon digital showcase, treatment menu, appointment flow in North Haven, CT."
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none bg-white text-xs"
                ></textarea>
              </div>

              {/* TWO DISTINCT AI STUDIO URL FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#FAF8F4] rounded-xl border border-[#E8E2D9]">
                <div>
                  <label className="block font-semibold text-[#171717] mb-1 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                    Published Website URL (Public View)
                  </label>
                  <input
                    type="url"
                    value={aiStudioPublishedUrl}
                    onChange={(e) => setAiStudioPublishedUrl(e.target.value)}
                    placeholder="https://that-hair-though.ai.studio/"
                    className="w-full p-2 border border-[#E8E2D9] rounded-lg focus:border-[#B99A74] focus:outline-none bg-white text-xs font-mono text-neutral-800"
                  />
                  <span className="text-[10px] text-[#77736D] mt-1 block">Viewable published demo URL sent to prospect for review.</span>
                </div>

                <div>
                  <label className="block font-semibold text-[#171717] mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#B99A74]" />
                    AI Studio Editing Link — Private (Admin Only)
                  </label>
                  <input
                    type="url"
                    value={aiStudioEditorUrl}
                    onChange={(e) => setAiStudioEditorUrl(e.target.value)}
                    placeholder="https://aistudio.google.com/prompts/..."
                    className="w-full p-2 border border-[#E8E2D9] rounded-lg focus:border-[#B99A74] focus:outline-none bg-white text-xs font-mono text-neutral-800"
                  />
                  <span className="text-[10px] text-[#77736D] mt-1 block">Direct workspace link for making website edits in AI Studio. Never shown to client.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Commercial & Stage Details */}
          <div className="space-y-3">
            <h3 className="font-serif-heading text-sm font-semibold text-[#171717] flex items-center gap-2 border-b border-[#E8E2D9] pb-1.5">
              <DollarSign className="w-4 h-4 text-[#B99A74]" />
              3. Commercial Details & Pipeline Stage
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-[#171717] mb-1">Proposed Value ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[#77736D] font-bold">$</span>
                  <input
                    type="number"
                    value={proposedValue}
                    onChange={(e) => setProposedValue(e.target.value)}
                    placeholder="4800"
                    className="w-full pl-7 pr-3 py-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none bg-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">Relationship Stage</label>
                <select
                  value={relationshipStage}
                  onChange={(e) => setRelationshipStage(e.target.value as ProspectStatus)}
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none bg-white text-xs font-medium"
                >
                  <option value="Prospect">Prospect (Initial Inquiry)</option>
                  <option value="Demo in Progress">Demo in Progress (Building in AI Studio)</option>
                  <option value="Demo Sent">Demo Sent (Awaiting Feedback)</option>
                  <option value="Follow-Up">Follow-Up Required</option>
                  <option value="Accepted / Onboarding">Accepted / Onboarding</option>
                  <option value="Active Client">Active Client</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">Follow-Up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none bg-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#171717] mb-1">Internal Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Sent initial published link on Monday. Follow up on salon pricing menu."
                className="w-full p-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none bg-white text-xs"
              />
            </div>
          </div>

          {/* Portal Access Disclaimer */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-950">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[11px]">
              <strong className="font-semibold block text-amber-900">Portal Access Safety Policy:</strong>
              <p className="text-amber-800 leading-relaxed">
                Saving this prospect creates their record and project. Client portal access will remain strictly <strong className="text-amber-950">Disabled (Not Invited)</strong>. You can choose when to prepare an invitation once the deal is accepted.
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-[#E8E2D9] rounded-xl text-xs font-medium text-[#77736D] hover:text-[#171717]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#171717] hover:bg-[#262626] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#B99A74]" />
              Save Prospect & Project
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
