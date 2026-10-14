import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { RevisionTask } from '../../types/portal';
import { 
  RotateCcw, Plus, MessageSquare, CheckCircle2, 
  Upload, Sparkles, X, AlertCircle, Send, ArrowRight 
} from 'lucide-react';

export const ClientRevisions: React.FC = () => {
  const { 
    clients, activeClientId, projects, 
    revisions, addRevision, addRevisionComment, updateRevisionStatus 
  } = usePortal();

  const client = clients.find(c => c.id === activeClientId) || clients[0];
  const project = projects.find(p => p.clientId === client.id) || projects[0];
  const clientRevisions = revisions.filter(r => r.projectId === project?.id);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [activeRev, setActiveRev] = useState<RevisionTask | null>(clientRevisions[0] || null);
  const [commentInput, setCommentInput] = useState('');

  // Step Form State
  const [step, setStep] = useState(1);
  const [webpage, setWebpage] = useState('Homepage / Hero');
  const [section, setSection] = useState('Primary Headline & CTA');
  const [instructions, setInstructions] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  if (!project) {
    return (
      <div className="text-center py-12 text-[#77736D] text-xs">
        No project assigned to this client account.
      </div>
    );
  }

  const handleOpenModal = () => {
    setStep(1);
    setWebpage('Homepage / Hero');
    setSection('Header Navigation & Logo');
    setInstructions('');
    setAdditionalNotes('');
    setAttachmentUrl('');
    setShowSubmitModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructions) return;

    addRevision({
      projectId: project.id,
      webpage,
      section,
      instructions,
      additionalNotes,
      attachmentUrl: attachmentUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      status: 'Submitted',
      roundNumber: project.revisionConfig.currentRound
    });

    setShowSubmitModal(false);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRev || !commentInput) return;

    addRevisionComment(activeRev.id, 'client', client.primaryContact, commentInput);
    setCommentInput('');
  };

  const handleApproveWork = (revId: string) => {
    updateRevisionStatus(revId, 'Approved', 'Client approved this revision task.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header & Contractual Revision Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B99A74] font-semibold block mb-1">
            Website Revisions Portal
          </span>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
            Revisions & Changes
          </h1>
        </div>

        <button
          onClick={handleOpenModal}
          className="px-4 py-2.5 bg-[#171717] hover:bg-[#262626] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#B99A74]" />
          Request a Revision
        </button>
      </div>

      {/* Contract Revision Terms Box */}
      <div className="bg-white border border-[#E8E2D9] rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-[#171717] block">Contractual Revision Window Summary</span>
            <p className="text-[#77736D]">
              Your Statement of Work includes <strong>{project.revisionConfig.includedRounds} Revision Rounds</strong>. Currently active: <strong className="text-[#171717]">Round {project.revisionConfig.currentRound}</strong>.
            </p>
          </div>
          <span className="px-3 py-1 rounded bg-[#FAF8F4] font-mono text-[11px] border border-[#E8E2D9] text-[#171717] self-start sm:self-auto">
            {clientRevisions.length} total tasks submitted
          </span>
        </div>
      </div>

      {/* Main Grid: Revisions List & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Revision Cards */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-serif-heading text-base font-semibold text-[#171717]">Your Submitted Revision Tasks</h2>

          {clientRevisions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-[#E8E2D9] p-6 text-xs text-[#77736D]">
              No revision requests submitted yet. Click "Request a Revision" above to submit feedback on any webpage.
            </div>
          ) : (
            clientRevisions.map((rev) => {
              const isSelected = activeRev?.id === rev.id;

              return (
                <div
                  key={rev.id}
                  onClick={() => setActiveRev(rev)}
                  className={`p-4 bg-white border rounded-xl transition-all cursor-pointer space-y-3 ${
                    isSelected ? 'border-[#B99A74] ring-1 ring-[#B99A74]/30 shadow-md' : 'border-[#E8E2D9] hover:border-[#B99A74] shadow-2xs'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 pb-2 border-b border-[#E8E2D9]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-[#171717] text-xs">{rev.id}</span>
                        <span className="text-[#77736D]">·</span>
                        <span className="font-semibold text-[#171717] text-xs">{rev.webpage}</span>
                      </div>
                      <span className="text-[11px] text-[#77736D] block">{rev.section}</span>
                    </div>

                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      rev.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      rev.status === 'Ready for Client Review' ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300' :
                      rev.status === 'In Progress' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                      'bg-neutral-100 text-neutral-800 border border-neutral-200'
                    }`}>
                      {rev.status}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-800 font-medium leading-relaxed">
                    "{rev.instructions}"
                  </p>

                  {/* Admin update note if present */}
                  {rev.adminResponse && (
                    <div className="p-2.5 bg-[#FAF8F4] rounded border border-[#E8E2D9] text-[11px] text-[#171717]">
                      <strong className="text-[#B99A74]">1UpSites Update: </strong> {rev.adminResponse}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[10px] text-neutral-400 pt-1">
                    <span>Submitted: {rev.submissionDate}</span>
                    <span className="text-[#B99A74] font-medium">{rev.comments.length} comment(s)</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Task Details & Discussion Thread */}
        <div className="bg-white border border-[#E8E2D9] rounded-xl p-5 shadow-2xs space-y-4 h-fit sticky top-22">
          {activeRev ? (
            <div className="space-y-4 text-xs">
              <div className="pb-3 border-b border-[#E8E2D9] flex justify-between items-center">
                <div>
                  <span className="font-mono font-bold text-sm text-[#171717]">{activeRev.id}</span>
                  <span className="text-[11px] text-[#77736D] block">{activeRev.webpage}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FAF8F4] text-[#171717] border border-[#E8E2D9]">
                  {activeRev.status}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">Requested Changes:</span>
                <p className="p-3 bg-[#FAF8F4] rounded border border-[#E8E2D9] text-[#171717] leading-relaxed">
                  {activeRev.instructions}
                </p>
              </div>

              {activeRev.adminResponse && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#B99A74] block mb-1">Developer Response:</span>
                  <p className="p-3 bg-amber-50/60 rounded border border-amber-200 text-[#171717] leading-relaxed">
                    {activeRev.adminResponse}
                  </p>
                </div>
              )}

              {/* Action Button: Mark Completed / Approved */}
              {activeRev.status === 'Ready for Client Review' && (
                <button
                  onClick={() => handleApproveWork(activeRev.id)}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve Completed Work
                </button>
              )}

              {/* Discussion Thread */}
              <div className="pt-3 border-t border-[#E8E2D9] space-y-2">
                <span className="font-semibold text-[#171717] block">Message 1UpSites Team:</span>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {activeRev.comments.length === 0 ? (
                    <span className="text-neutral-400 text-[11px] italic block">No comments yet.</span>
                  ) : (
                    activeRev.comments.map(c => (
                      <div key={c.id} className="p-2.5 bg-[#FAF8F4] rounded border border-[#E8E2D9] text-[11px]">
                        <span className="font-semibold text-[#171717]">{c.authorName}: </span>
                        <span className="text-[#77736D]">{c.message}</span>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendComment} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Type a message or clarification..."
                    className="flex-1 p-2 border border-[#E8E2D9] rounded text-xs focus:border-[#B99A74] focus:outline-none"
                  />
                  <button type="submit" className="p-2 bg-[#171717] text-white rounded hover:bg-[#262626]">
                    <Send className="w-3.5 h-3.5 text-[#B99A74]" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-[#77736D] text-xs">
              Select a revision task to inspect or add comments.
            </div>
          )}
        </div>

      </div>

      {/* Step-by-Step Revision Submission Wizard Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E2D9] space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8E2D9]">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#B99A74] tracking-wider block">Submit Feedback Task</span>
                <h2 className="font-serif-heading text-lg font-semibold text-[#171717]">Website Revision Form</h2>
              </div>
              <button onClick={() => setShowSubmitModal(false)} className="text-neutral-400 hover:text-[#171717]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#171717] mb-1">1. Which webpage needs changing? *</label>
                <select
                  value={webpage}
                  onChange={(e) => setWebpage(e.target.value)}
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-lg focus:border-[#B99A74] focus:outline-none text-xs"
                >
                  <option value="Homepage / Hero Section">Homepage / Hero Section</option>
                  <option value="Property Listings Grid">Property Listings Grid</option>
                  <option value="Product Collection Page">Product Collection Page</option>
                  <option value="Agent Inquiry Form">Agent Inquiry Form</option>
                  <option value="Header Navigation & Footer">Header Navigation & Footer</option>
                  <option value="Mobile Menu Layout">Mobile Menu Layout</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">2. Which section on the page? *</label>
                <input
                  type="text"
                  required
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="e.g. Featured Listings Carousel or Contact Button"
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-lg focus:border-[#B99A74] focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">3. What should be changed? *</label>
                <textarea
                  required
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Please describe clearly what needs changing or updating..."
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-lg focus:border-[#B99A74] focus:outline-none text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">4. Supporting image or screenshot URL (Optional)</label>
                <input
                  type="text"
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  placeholder="Paste URL or reference image link..."
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-lg focus:border-[#B99A74] focus:outline-none text-xs"
                />
              </div>

              <div className="p-3 bg-[#FAF8F4] rounded-lg border border-[#E8E2D9] text-[11px] text-[#77736D]">
                Your revision will be assigned a unique task ID (`REV-104`) and forwarded directly to 1UpSites engineering queue.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 border border-[#E8E2D9] rounded-lg font-medium text-[#77736D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#171717] hover:bg-[#262626] text-white font-semibold rounded-lg"
                >
                  Submit Revision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
