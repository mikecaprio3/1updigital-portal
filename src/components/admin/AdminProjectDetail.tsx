import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Project, ProjectPhase, RevisionTask, RevisionStatus, FileCategory, Agreement, Invoice, PortalAccessStatus, ProspectStatus } from '../../types/portal';
import { InteractiveWebsitePreview } from '../InteractiveWebsitePreview';
import { 
  ArrowLeft, Layers, RotateCcw, FolderOpen, 
  Clock, FileText, CreditCard, CheckCircle2, 
  MessageSquare, Upload, Plus, Trash2, Edit3, Save, Sparkles, ExternalLink, Lock, Eye, Building2, ShieldCheck, X
} from 'lucide-react';

interface AdminProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export const AdminProjectDetail: React.FC<AdminProjectDetailProps> = ({ project, onBack }) => {
  const { 
    clients, updateProjectPhase, updateProjectNotes, updatePortalAccessStatus, updateAiStudioUrls,
    revisions, updateRevisionStatus, addRevisionComment, 
    files, addFile, deleteFile, 
    agreements, updateAgreementStatus, 
    invoices, addInvoice, updateInvoiceStatus 
  } = usePortal();

  const [activeTab, setActiveTab] = useState<'overview' | 'revisions' | 'files' | 'timeline' | 'agreement' | 'billing'>('overview');
  
  // Internal Notes Editing
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(project.internalNotes);

  // Edit AI Studio Links Modal
  const [showEditLinksModal, setShowEditLinksModal] = useState(false);
  const [editPublishedUrl, setEditPublishedUrl] = useState(project.aiStudioPublishedUrl || project.websitePreviewUrl || '');
  const [editEditorUrl, setEditEditorUrl] = useState(project.aiStudioEditorUrl || '');

  // New File Form State
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [newFileCategory, setNewFileCategory] = useState<FileCategory>('Client Photography');
  const [newFileName, setNewFileName] = useState('');

  // New Invoice Modal State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceTitle, setInvoiceTitle] = useState('Milestone Payment — 25%');
  const [invoiceAmount, setInvoiceAmount] = useState('2500');

  const client = clients.find(c => c.id === project.clientId);
  const projectRevisions = revisions.filter(r => r.projectId === project.id);
  const projectFiles = files.filter(f => f.projectId === project.id);
  const projectAgreements = agreements.filter(a => a.projectId === project.id);
  const projectInvoices = invoices.filter(i => i.projectId === project.id);

  const phasesList: ProjectPhase[] = [
    'Inquiry', 'Agreement', 'Design', 'Client Review', 
    'Final Approval', 'Payment', 'Launch', 'Completed'
  ];

  const handleSaveNotes = () => {
    updateProjectNotes(project.id, notesText);
    setEditingNotes(false);
  };

  const handleSaveLinks = (e: React.FormEvent) => {
    e.preventDefault();
    updateAiStudioUrls(project.id, editPublishedUrl, editEditorUrl);
    setShowEditLinksModal(false);
  };

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName) return;

    addFile({
      projectId: project.id,
      name: newFileName.endsWith('.png') || newFileName.endsWith('.jpg') || newFileName.endsWith('.pdf') ? newFileName : `${newFileName}.jpg`,
      category: newFileCategory,
      uploadedBy: '1UpSites Admin',
      size: '2.4 MB',
      type: 'image/jpeg',
      previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
      isTemporary: true
    });

    setNewFileName('');
    setShowFileUploadModal(false);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(invoiceAmount) || 1000;
    addInvoice({
      projectId: project.id,
      title: invoiceTitle,
      amount: amt,
      status: 'Outstanding',
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lineItems: [
        { description: invoiceTitle, qty: 1, unitPrice: amt, amount: amt }
      ]
    });
    setShowInvoiceModal(false);
  };

  const currentPortalAccess = project.portalAccessStatus || client?.portalAccessStatus || 'Not Invited';
  const currentSalesStage = project.relationshipStage || client?.status || 'Active Client';

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header & Executive Controls */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-2xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
          <div className="flex items-start gap-3">
            <button
              onClick={onBack}
              className="p-2 bg-[#FAF8F4] border border-[#E8E2D9] hover:border-[#B99A74] rounded-xl text-neutral-600 hover:text-[#171717] transition-colors mt-0.5 shrink-0"
              title="Return to Projects List"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-[#77736D] flex-wrap mb-1">
                <span className="font-bold text-[#171717]">{client?.businessName || 'Business Client'}</span>
                <span>·</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300">
                  Stage: {currentSalesStage}
                </span>
                <span>·</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                  currentPortalAccess === 'Active' ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                }`}>
                  <Lock className="w-3 h-3" /> Portal: {currentPortalAccess}
                </span>
              </div>

              <h1 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
                {project.projectName}
              </h1>
            </div>
          </div>

          {/* TWO PRIMARY DEDICATED GOOGLE AI STUDIO ACTIONS */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            
            {/* Action 1: Open in AI Studio (Admin Private Workspace Link) */}
            {project.aiStudioEditorUrl ? (
              <a
                href={project.aiStudioEditorUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-[#171717] hover:bg-[#262626] text-[#B99A74] font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 border border-[#B99A74]/30"
                title="Open private editing workspace in Google AI Studio"
              >
                <Lock className="w-4 h-4 text-[#B99A74]" />
                <span>Open in AI Studio</span>
              </a>
            ) : (
              <button
                onClick={() => setShowEditLinksModal(true)}
                className="px-3.5 py-2.5 bg-neutral-100 text-neutral-600 text-xs font-semibold rounded-xl border border-neutral-300 flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Configure AI Studio Link</span>
              </button>
            )}

            {/* Action 2: View Published Website (Public Review Link) */}
            <a
              href={project.aiStudioPublishedUrl || project.websitePreviewUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-[#B99A74] hover:bg-[#a3835e] text-[#171717] font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2"
              title="Open viewable published demo website in new tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Published Website</span>
            </a>

            <button
              onClick={() => setShowEditLinksModal(true)}
              className="p-2.5 bg-[#FAF8F4] border border-[#E8E2D9] hover:border-[#B99A74] rounded-xl text-neutral-600 hover:text-[#171717] transition-colors"
              title="Edit AI Studio URLs"
            >
              <Edit3 className="w-4 h-4 text-[#B99A74]" />
            </button>

          </div>
        </div>

        {/* Phase Selector & Meta Subbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#77736D]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#171717]">Delivery Phase:</span>
            <select
              value={project.phase}
              onChange={(e) => updateProjectPhase(project.id, e.target.value as ProjectPhase)}
              className="bg-[#FAF8F4] text-[#171717] font-semibold text-xs border border-[#E8E2D9] rounded-lg px-3 py-1 focus:outline-none focus:border-[#B99A74]"
            >
              {phasesList.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Target Completion: <strong className="text-[#171717]">{project.targetCompletionDate}</strong></span>
            <span>Support Window: <strong className="text-[#171717]">{project.revisionConfig.postLaunchSupportDays || 7} Days Post-Launch</strong></span>
          </div>
        </div>

      </div>

      {/* Workspace Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white border border-[#E8E2D9] rounded-xl overflow-x-auto text-xs font-medium shadow-2xs">
        {[
          { id: 'overview', label: 'Project Overview & Site Preview', icon: Layers },
          { id: 'revisions', label: `Client Revisions (${projectRevisions.length})`, icon: RotateCcw },
          { id: 'files', label: `Files (${projectFiles.length})`, icon: FolderOpen },
          { id: 'timeline', label: 'Timeline & Milestones', icon: Clock },
          { id: 'agreement', label: 'Agreements & Terms', icon: FileText },
          { id: 'billing', label: 'Billing & Invoices', icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap ${
                isActive ? 'bg-[#171717] text-white shadow-2xs font-semibold' : 'text-[#77736D] hover:text-[#171717]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B99A74]' : ''}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & WEBSITE PREVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Phase Stepper */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-2xs">
            <h3 className="text-xs uppercase tracking-wider text-[#77736D] font-semibold mb-3">Project Lifecycle Stage</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {phasesList.map((phaseName, index) => {
                const isCurrent = project.phase === phaseName;
                const isPast = phasesList.indexOf(project.phase) > index;
                return (
                  <div 
                    key={phaseName} 
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isCurrent 
                        ? 'bg-[#171717] text-white border-[#171717] shadow-xs' 
                        : isPast 
                        ? 'bg-[#FAF8F4] text-[#171717] border-[#E8E2D9]' 
                        : 'bg-white text-neutral-400 border-neutral-200'
                    }`}
                  >
                    <span className="text-[10px] block opacity-75 font-mono mb-0.5">Stage 0{index + 1}</span>
                    <span className="text-xs font-semibold block truncate">{phaseName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Live Website Preview Frame */}
          <InteractiveWebsitePreview project={project} />

          {/* Internal Notes & Contract Terms */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Notes Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-2xs space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-serif-heading text-base font-semibold text-[#171717]">
                  Internal Project Notes (Admin Only)
                </h3>
                {editingNotes ? (
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1 bg-[#171717] text-white text-xs rounded-lg hover:bg-[#262626] flex items-center gap-1 font-semibold"
                  >
                    <Save className="w-3 h-3 text-[#B99A74]" />
                    Save Notes
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingNotes(true)}
                    className="text-xs text-[#B99A74] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit Notes
                  </button>
                )}
              </div>

              {editingNotes ? (
                <textarea
                  rows={4}
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  className="w-full p-2.5 text-xs border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none"
                ></textarea>
              ) : (
                <p className="text-xs text-[#77736D] leading-relaxed bg-[#FAF8F4] p-3.5 rounded-xl border border-[#E8E2D9]">
                  {project.internalNotes}
                </p>
              )}
            </div>

            {/* Contractual Revisions Terms Summary */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-2xs space-y-3">
              <h3 className="font-serif-heading text-base font-semibold text-[#171717]">
                Contractual Terms & Revision Limits
              </h3>
              <div className="space-y-2 text-xs text-[#77736D]">
                <div className="flex justify-between p-2.5 bg-[#FAF8F4] rounded-xl border border-[#E8E2D9]">
                  <span>Included Revision Rounds:</span>
                  <strong className="text-[#171717]">{project.revisionConfig.includedRounds} Rounds</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-[#FAF8F4] rounded-xl border border-[#E8E2D9]">
                  <span>Active Round:</span>
                  <strong className="text-[#171717]">Round {project.revisionConfig.currentRound}</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-[#FAF8F4] rounded-xl border border-[#E8E2D9]">
                  <span>Post-Launch Support:</span>
                  <strong className="text-emerald-800 font-semibold">{project.revisionConfig.postLaunchSupportDays || 7} Days Included</strong>
                </div>
                <p className="text-[11px] text-neutral-500 pt-1">
                  {project.revisionConfig.agreementNote}
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: REVISIONS WORKSPACE */}
      {activeTab === 'revisions' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-2xs space-y-4">
            <div>
              <h2 className="font-serif-heading text-xl font-semibold text-[#171717]">
                Project Revision Task Queue
              </h2>
              <p className="text-xs text-[#77736D]">
                Tasks submitted by client for {project.projectName}. Round {project.revisionConfig.currentRound} of {project.revisionConfig.includedRounds}.
              </p>
            </div>

            <div className="space-y-4">
              {projectRevisions.length === 0 ? (
                <div className="text-center py-10 bg-[#FAF8F4] rounded-xl border border-[#E8E2D9] text-[#77736D] text-xs">
                  No revision requests submitted for this project yet.
                </div>
              ) : (
                projectRevisions.map((rev) => (
                  <div 
                    key={rev.id} 
                    className="p-4 bg-[#FAF8F4] border border-[#E8E2D9] rounded-xl space-y-3 text-xs"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-2 pb-2 border-b border-[#E8E2D9]">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-[#171717] text-xs">{rev.id}</span>
                          <span>·</span>
                          <span className="font-medium text-[#77736D]">{rev.webpage}</span>
                          <span>·</span>
                          <span className="text-neutral-500">{rev.section}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400">Submitted: {rev.submissionDate}</span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#77736D]">Status:</span>
                        <select
                          value={rev.status}
                          onChange={(e) => updateRevisionStatus(rev.id, e.target.value as RevisionStatus)}
                          className="bg-white text-[#171717] font-semibold text-xs border border-[#E8E2D9] rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#B99A74]"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Ready for Client Review">Ready for Client Review</option>
                          <option value="Approved">Approved</option>
                          <option value="Needs Clarification">Needs Clarification</option>
                        </select>
                      </div>
                    </div>

                    <p className="text-neutral-800 leading-relaxed font-medium">
                      "{rev.instructions}"
                    </p>

                    {rev.attachmentUrl && (
                      <div className="pt-2">
                        <span className="text-[10px] uppercase font-semibold text-neutral-400 block mb-1">Client Reference Image:</span>
                        <img src={rev.attachmentUrl} alt="Revision Reference" className="w-32 h-20 object-cover rounded-lg border border-[#E8E2D9]" />
                      </div>
                    )}

                    {/* Admin Response Box */}
                    <div className="pt-3 border-t border-[#E8E2D9] space-y-2 bg-white p-3.5 rounded-xl border">
                      <span className="font-semibold text-[#171717] text-xs block">Admin Response / Update Note:</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          defaultValue={rev.adminResponse || ''}
                          placeholder="Post an update for the client..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateRevisionStatus(rev.id, rev.status, e.currentTarget.value);
                              alert('Admin response updated!');
                            }
                          }}
                          className="flex-1 p-2 border border-[#E8E2D9] rounded-lg text-xs focus:border-[#B99A74] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Discussion Comments Thread */}
                    {rev.comments.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="text-[11px] font-semibold text-[#77736D]">Comments History:</span>
                        {rev.comments.map(c => (
                          <div key={c.id} className="p-2 bg-white rounded-lg border border-[#E8E2D9] text-[11px]">
                            <span className="font-semibold text-[#171717]">{c.authorName}: </span>
                            <span className="text-neutral-700">{c.message}</span>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FILES LIBRARY */}
      {activeTab === 'files' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-2xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif-heading text-xl font-semibold text-[#171717]">
                  Project File Repository
                </h2>
                <p className="text-xs text-[#77736D]">
                  Photography, vector brand decks, and specification documents.
                </p>
              </div>

              <button
                onClick={() => setShowFileUploadModal(true)}
                className="px-3.5 py-2 bg-[#171717] text-white hover:bg-[#262626] text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-[#B99A74]" />
                Upload File
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectFiles.map((file) => (
                <div key={file.id} className="bg-[#FAF8F4] border border-[#E8E2D9] rounded-xl p-4 space-y-3 relative group">
                  <div className="h-32 bg-neutral-200 rounded-lg overflow-hidden relative">
                    <img src={file.previewUrl} alt={file.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 bg-[#171717]/80 text-white text-[10px] px-2 py-0.5 rounded font-semibold">
                      {file.category}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <h4 className="font-semibold text-[#171717] truncate">{file.name}</h4>
                    <div className="flex justify-between text-[11px] text-[#77736D]">
                      <span>{file.size}</span>
                      <span>By {file.uploadedBy}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteFile(file.id)}
                    className="p-1 text-rose-500 hover:text-rose-700 transition-colors absolute top-2 right-2 bg-white/90 rounded border border-[#E8E2D9]"
                    title="Delete asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-2xs space-y-4">
          <h2 className="font-serif-heading text-xl font-semibold text-[#171717]">
            Project Milestones & Delivery Timeline
          </h2>

          <div className="space-y-3 text-xs">
            {[
              { stage: '1. Project Strategy & Google AI Studio Demo Build', date: project.startDate, completed: true },
              { stage: '2. SOW Contract Agreement & Proposal Review', date: '2026-09-18', completed: true },
              { stage: '3. Initial Design Frames & Interactive Preview', date: '2026-09-28', completed: true },
              { stage: '4. Client Review & Contractual Revision Round 1', date: '2026-10-15', completed: project.phase === 'Client Review' || project.phase === 'Final Approval' },
              { stage: '5. Formal Client Design Approval', date: '2026-10-22', completed: project.phase === 'Final Approval' || project.phase === 'Launch' },
              { stage: '6. DNS Launch & 7-Day Support Handover', date: project.targetCompletionDate, completed: project.phase === 'Completed' }
            ].map((m, idx) => (
              <div key={idx} className="p-3.5 bg-[#FAF8F4] border border-[#E8E2D9] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`w-4 h-4 ${m.completed ? 'text-emerald-600' : 'text-neutral-300'}`} />
                  <span className={`font-semibold ${m.completed ? 'text-[#171717]' : 'text-[#77736D]'}`}>{m.stage}</span>
                </div>
                <span className="font-mono text-[11px] text-[#77736D] bg-white px-2.5 py-0.5 rounded-lg border border-[#E8E2D9] font-medium">{m.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AGREEMENT */}
      {activeTab === 'agreement' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-2xs space-y-4">
          <h2 className="font-serif-heading text-xl font-semibold text-[#171717]">
            Statement of Work & Agreements
          </h2>

          {projectAgreements.map((agr) => (
            <div key={agr.id} className="p-5 bg-[#FAF8F4] border border-[#E8E2D9] rounded-2xl space-y-4 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#B99A74] tracking-wider block">{agr.documentType}</span>
                  <h3 className="font-serif-heading text-base font-semibold text-[#171717]">{agr.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#77736D]">Status:</span>
                  <select
                    value={agr.status}
                    onChange={(e) => updateAgreementStatus(agr.id, e.target.value as Agreement['status'])}
                    className="bg-white text-[#171717] font-semibold text-xs border border-[#E8E2D9] rounded-lg px-2.5 py-1"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Signed">Signed</option>
                  </select>
                </div>
              </div>

              <p className="text-[#77736D] leading-relaxed">{agr.summary}</p>

              <div className="bg-white p-3.5 rounded-xl border border-[#E8E2D9] space-y-1">
                <span className="font-semibold text-[#171717] block">Terms & Contractual Provisions:</span>
                <ul className="list-disc list-inside space-y-1 text-[#77736D]">
                  {agr.terms.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: BILLING & INVOICES */}
      {activeTab === 'billing' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-serif-heading text-xl font-semibold text-[#171717]">
                Project Invoices & Billing
              </h2>
              <p className="text-xs text-[#77736D]">
                Deposit and milestone invoices for {project.projectName}.
              </p>
            </div>

            <button
              onClick={() => setShowInvoiceModal(true)}
              className="px-3.5 py-2 bg-[#171717] text-white hover:bg-[#262626] text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#B99A74]" />
              Create Demo Invoice
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {projectInvoices.map((inv) => (
              <div key={inv.id} className="p-4 bg-[#FAF8F4] border border-[#E8E2D9] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-[#171717]">{inv.invoiceNumber}</span>
                    <span>·</span>
                    <span className="font-serif-heading font-semibold text-emerald-800 text-sm">${inv.amount.toLocaleString()}</span>
                  </div>
                  <h4 className="font-semibold text-[#171717]">{inv.title}</h4>
                  <span className="text-[10px] text-neutral-400">Due: {inv.dueDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={inv.status}
                    onChange={(e) => updateInvoiceStatus(inv.id, e.target.value as Invoice['status'])}
                    className="bg-white text-[#171717] font-semibold text-xs border border-[#E8E2D9] rounded-lg px-2.5 py-1"
                  >
                    <option value="Outstanding">Outstanding</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT AI STUDIO LINKS MODAL */}
      {showEditLinksModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E2D9] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8E2D9]">
              <h3 className="font-serif-heading text-lg font-semibold text-[#171717]">Edit Google AI Studio URLs</h3>
              <button onClick={() => setShowEditLinksModal(false)} className="text-neutral-400 hover:text-[#171717]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLinks} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#77736D] mb-1 font-semibold">Published Website URL (Public Review View)</label>
                <input
                  type="url"
                  required
                  value={editPublishedUrl}
                  onChange={(e) => setEditPublishedUrl(e.target.value)}
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[#77736D] mb-1 font-semibold">AI Studio Editing Link — Private (Admin Workspace Only)</label>
                <input
                  type="url"
                  value={editEditorUrl}
                  onChange={(e) => setEditEditorUrl(e.target.value)}
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setShowEditLinksModal(false)}
                  className="px-4 py-2 border border-[#E8E2D9] rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#171717] text-white text-xs font-semibold rounded-xl"
                >
                  Save Links
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      {showFileUploadModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E2D9] shadow-2xl space-y-4">
            <h3 className="font-serif-heading text-lg font-semibold text-[#171717]">Upload Project File</h3>
            <form onSubmit={handleFileUpload} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#77736D] mb-1 font-semibold">File Name *</label>
                <input
                  type="text"
                  required
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. Malibu_Living_Room_Hero.jpg"
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl text-xs focus:border-[#B99A74] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#77736D] mb-1 font-semibold">Category</label>
                <select
                  value={newFileCategory}
                  onChange={(e) => setNewFileCategory(e.target.value as FileCategory)}
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl text-xs focus:border-[#B99A74] focus:outline-none"
                >
                  <option value="Client Photography">Client Photography</option>
                  <option value="Branding & Logos">Branding & Logos</option>
                  <option value="Inspiration & References">Inspiration & References</option>
                  <option value="Documents">Documents</option>
                  <option value="Other Files">Other Files</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setShowFileUploadModal(false)}
                  className="px-4 py-2 border border-[#E8E2D9] rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#171717] text-white text-xs font-semibold rounded-xl"
                >
                  Save File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E2D9] shadow-2xl space-y-4">
            <h3 className="font-serif-heading text-lg font-semibold text-[#171717]">Create Demo Invoice</h3>
            <form onSubmit={handleCreateInvoice} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#77736D] mb-1 font-semibold">Invoice Title *</label>
                <input
                  type="text"
                  required
                  value={invoiceTitle}
                  onChange={(e) => setInvoiceTitle(e.target.value)}
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl text-xs focus:border-[#B99A74] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#77736D] mb-1 font-semibold">Amount ($) *</label>
                <input
                  type="number"
                  required
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl text-xs focus:border-[#B99A74] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 border border-[#E8E2D9] rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#171717] text-white text-xs font-semibold rounded-xl"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
