import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { InteractiveWebsitePreview } from '../InteractiveWebsitePreview';
import { 
  Sparkles, CheckCircle2, MessageSquarePlus, 
  Upload, FileText, CreditCard, Clock, ArrowRight, ShieldCheck 
} from 'lucide-react';

export const ClientDashboard: React.FC = () => {
  const { 
    clients, activeClientId, projects, revisions, 
    invoices, setActiveClientTab, recordClientDesignApproval 
  } = usePortal();

  const client = clients.find(c => c.id === activeClientId) || clients[0];
  const project = projects.find(p => p.clientId === client.id) || projects[0];
  const clientRevisions = revisions.filter(r => r.projectId === project?.id);
  const openRevisions = clientRevisions.filter(r => r.status !== 'Approved');
  const outstandingInvoices = invoices.filter(i => i.projectId === project?.id && (i.status === 'Outstanding' || i.status === 'Overdue'));

  const [showApprovalConfirmationModal, setShowApprovalConfirmationModal] = useState(false);

  if (!project) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-[#E8E2D9] p-8 text-[#77736D]">
        No active website project found for {client.businessName}.
      </div>
    );
  }

  const handleConfirmApproval = () => {
    recordClientDesignApproval(project.id);
    setShowApprovalConfirmationModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Personalized Greeting Card */}
      <div className="bg-[#171717] text-white rounded-2xl p-6 sm:p-8 border border-[#333333] shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#B99A74]/20 text-[#B99A74] text-[10px] uppercase font-semibold tracking-wider border border-[#B99A74]/30">
              Project Status: {project.phase}
            </span>
            <span className="text-neutral-400 text-xs">·</span>
            <span className="text-neutral-400 text-xs">Target Launch: {project.targetCompletionDate}</span>
          </div>

          <h1 className="font-serif-heading text-2xl sm:text-3xl font-medium leading-tight">
            Welcome, {client.primaryContact}!
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Here is the latest live build for <strong className="text-white font-semibold">{project.projectName}</strong>. Review your design below, submit revision requests, or sign off on approval.
          </p>

          {/* Prominent Quick Action Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => setActiveClientTab('revisions')}
              className="px-3.5 py-2 bg-[#B99A74] text-[#171717] font-semibold text-xs rounded-lg hover:bg-[#a3835e] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <MessageSquarePlus className="w-4 h-4" />
              Request a Revision
            </button>

            <button
              onClick={() => setShowApprovalConfirmationModal(true)}
              className="px-3.5 py-2 bg-white text-[#171717] font-semibold text-xs rounded-lg hover:bg-neutral-100 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Approve Current Design
            </button>

            <button
              onClick={() => setActiveClientTab('files')}
              className="px-3.5 py-2 bg-[#262626] text-white hover:bg-[#333333] font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-[#333333]"
            >
              <Upload className="w-4 h-4 text-[#B99A74]" />
              Upload Photos / Assets
            </button>
          </div>
        </div>
      </div>

      {/* Outstanding Actions Banner if any */}
      {(openRevisions.length > 0 || outstandingInvoices.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {openRevisions.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between text-xs text-amber-900">
              <div className="space-y-0.5">
                <strong className="font-semibold block">{openRevisions.length} Active Revision Request(s)</strong>
                <p className="text-amber-800 text-[11px]">1UpSites team is currently implementing your requested changes.</p>
              </div>
              <button
                onClick={() => setActiveClientTab('revisions')}
                className="px-3 py-1.5 bg-amber-900 text-white rounded font-medium shrink-0"
              >
                View Status →
              </button>
            </div>
          )}

          {outstandingInvoices.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-900">
              <div className="space-y-0.5">
                <strong className="font-semibold block">Outstanding Milestone Invoice</strong>
                <p className="text-emerald-800 text-[11px]">${outstandingInvoices[0].amount.toLocaleString()} due by {outstandingInvoices[0].dueDate}.</p>
              </div>
              <button
                onClick={() => setActiveClientTab('billing')}
                className="px-3 py-1.5 bg-emerald-900 text-white rounded font-medium shrink-0"
              >
                View Invoice →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Primary Feature: Interactive Website Previewer */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-serif-heading text-xl font-semibold text-[#171717]">
            Your Website Preview
          </h2>
          <span className="text-xs text-[#77736D]">
            Switch between Desktop & Mobile views below
          </span>
        </div>

        <InteractiveWebsitePreview 
          project={project} 
          isClientView={true}
          onRequestRevision={() => setActiveClientTab('revisions')}
          onApproveDesign={() => setShowApprovalConfirmationModal(true)}
        />
      </div>

      {/* Project Milestone Roadmap */}
      <div className="bg-white border border-[#E8E2D9] rounded-xl p-6 shadow-2xs space-y-4">
        <h3 className="font-serif-heading text-lg font-semibold text-[#171717]">
          Your Project Roadmap
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#FAF8F4] border border-[#E8E2D9] rounded-lg space-y-1">
            <span className="text-[10px] uppercase text-[#77736D] font-mono">Stage 1</span>
            <strong className="block text-[#171717]">Agreement & Strategy</strong>
            <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3 h-3" /> Completed
            </span>
          </div>

          <div className="p-3 bg-[#FAF8F4] border border-[#E8E2D9] rounded-lg space-y-1">
            <span className="text-[10px] uppercase text-[#77736D] font-mono">Stage 2</span>
            <strong className="block text-[#171717]">Custom Web Design</strong>
            <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3 h-3" /> Completed
            </span>
          </div>

          <div className="p-3 bg-[#171717] text-white rounded-lg space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#B99A74] font-mono">Stage 3 (Active)</span>
            <strong className="block text-white">Client Review & Revisions</strong>
            <span className="text-amber-300 font-medium text-[11px]">In Progress</span>
          </div>

          <div className="p-3 bg-[#FAF8F4] border border-[#E8E2D9] rounded-lg space-y-1">
            <span className="text-[10px] uppercase text-neutral-400 font-mono">Stage 4</span>
            <strong className="block text-neutral-600">Final Launch & Handover</strong>
            <span className="text-neutral-400 text-[11px]">Target: {project.targetCompletionDate}</span>
          </div>
        </div>
      </div>

      {/* Approval Modal Confirmation */}
      {showApprovalConfirmationModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-[#E8E2D9] shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h3 className="font-serif-heading text-xl font-semibold text-[#171717]">
              Approve Website Design?
            </h3>

            <p className="text-xs text-[#77736D] leading-relaxed">
              By confirming, you formally approve the current website design iteration for <strong className="text-[#171717]">{project.projectName}</strong>. This signals to 1UpSites that design review is complete and ready for final launch preparation.
            </p>

            <div className="p-3 bg-[#FAF8F4] rounded-lg border border-[#E8E2D9] text-[11px] text-neutral-500 text-left">
              Note: This prototype action records a formal approval timestamp in the project activity trail.
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowApprovalConfirmationModal(false)}
                className="w-1/2 py-2.5 border border-[#E8E2D9] rounded-lg text-xs font-medium text-[#77736D]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApproval}
                className="w-1/2 py-2.5 bg-[#171717] text-white text-xs font-semibold rounded-lg hover:bg-[#262626]"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
