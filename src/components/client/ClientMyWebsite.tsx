import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { InteractiveWebsitePreview } from '../InteractiveWebsitePreview';
import { GuidedDomainSetupModal } from './GuidedDomainSetupModal';
import { RevisionTask, PinCoordinates, ProjectFile } from '../../types/portal';
import { 
  Sparkles, CheckCircle2, MessageSquarePlus, 
  MapPin, Upload, Image as ImageIcon, Send, X, ArrowRight, ShieldCheck, 
  FileCheck, Folder, Search, MousePointerClick, Edit3, Globe, Clock, Check
} from 'lucide-react';

export const ClientMyWebsite: React.FC = () => {
  const { 
    clients, activeClientId, projects, 
    revisions, files, folders, addRevision, addFile, 
    addRevisionComment, updateRevisionStatus, recordClientDesignApproval 
  } = usePortal();

  const client = clients.find(c => c.id === activeClientId) || clients[0];
  const project = projects.find(p => p.clientId === client.id) || projects[0];
  
  const clientRevisions = revisions.filter(r => r.projectId === project?.id);
  const projectFiles = files.filter(f => f.projectId === project?.id);
  const projectFolders = folders.filter(f => f.projectId === project?.id);

  // Revision Modal State
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionMethod, setRevisionMethod] = useState<'pin' | 'describe'>('describe');
  
  const [pinnedCoords, setPinnedCoords] = useState<PinCoordinates | null>(null);
  const [targetWebpage, setTargetWebpage] = useState('Homepage / Hero Section');
  const [targetSection, setTargetSection] = useState('Hero Headline & CTA');
  const [instructionsText, setInstructionsText] = useState('');
  
  // Shared Asset Selection in Revision Form
  const [attachFileMode, setAttachFileMode] = useState<'none' | 'existing' | 'upload'>('none');
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [newUploadFileName, setNewUploadFileName] = useState('');
  const [assetFolderFilter, setAssetFolderFilter] = useState<string>('ALL');
  const [assetSearch, setAssetSearch] = useState('');

  // Selected Revision Task for inline discussion
  const [selectedRevisionId, setSelectedRevisionId] = useState<string | null>(clientRevisions[0]?.id || null);
  const [inlineComment, setInlineComment] = useState('');

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);

  if (!project) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-[#E8E2D9] p-8 text-[#77736D] text-xs">
        No active website project found.
      </div>
    );
  }

  // Method A: Clicked pinned location directly on the site preview frame
  const handlePinLocationClick = (coords: PinCoordinates, webpage: string, section: string) => {
    setRevisionMethod('pin');
    setPinnedCoords(coords);
    setTargetWebpage(webpage);
    setTargetSection(section);
    setShowRevisionModal(true);
  };

  // Method B: Open Revision Modal via "Describe a Change" or "Request a Change" button
  const handleOpenDescribeModal = () => {
    setRevisionMethod('describe');
    setPinnedCoords(null);
    setTargetWebpage('Homepage / Hero Section');
    setTargetSection('');
    setInstructionsText('');
    setAttachFileMode('none');
    setSelectedFileId('');
    setNewUploadFileName('');
    setShowRevisionModal(true);
  };

  // Submit Revision
  const handleSubmitRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructionsText.trim()) return;

    let attachedIds: string[] = [];
    let attachmentUrl: string | undefined = undefined;

    if (attachFileMode === 'existing' && selectedFileId) {
      attachedIds = [selectedFileId];
      const chosenFile = projectFiles.find(f => f.id === selectedFileId);
      if (chosenFile) attachmentUrl = chosenFile.previewUrl;
    } else if (attachFileMode === 'upload' && newUploadFileName.trim()) {
      // Auto-add new photo to Project Files as a shared asset!
      const newFileId = `file-${Date.now()}`;
      const newFileObj: ProjectFile = {
        id: newFileId,
        projectId: project.id,
        name: newUploadFileName.endsWith('.jpg') || newUploadFileName.endsWith('.png') ? newUploadFileName : `${newUploadFileName}.jpg`,
        category: 'Client Photography',
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: 'Client',
        size: '5.2 MB',
        type: 'image/jpeg',
        previewUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
        isTemporary: true
      };
      addFile(newFileObj);
      attachedIds = [newFileId];
      attachmentUrl = newFileObj.previewUrl;
    }

    addRevision({
      projectId: project.id,
      webpage: targetWebpage,
      section: targetSection || 'General Page Feedback',
      instructions: instructionsText,
      pinCoordinates: revisionMethod === 'pin' && pinnedCoords ? pinnedCoords : undefined,
      attachedFileIds: attachedIds.length > 0 ? attachedIds : undefined,
      attachmentUrl,
      status: 'Submitted',
      roundNumber: project.revisionConfig.currentRound
    });

    setInstructionsText('');
    setNewUploadFileName('');
    setShowRevisionModal(false);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRevisionId || !inlineComment) return;

    addRevisionComment(selectedRevisionId, 'client', client.primaryContact, inlineComment);
    setInlineComment('');
  };

  const selectedRevTask = clientRevisions.find(r => r.id === selectedRevisionId);

  // Filtered files for Project Files selector modal inside revision form
  const selectorFilteredFiles = projectFiles.filter(f => {
    const matchesFolder = assetFolderFilter === 'ALL' || f.folderId === assetFolderFilter;
    const matchesSearch = f.name.toLowerCase().includes(assetSearch.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const domainConfig = project.domainConfig;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Essential Header Bar */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-amber-50 text-amber-900 font-bold text-[10px] uppercase tracking-wider border border-amber-200">
              Stage: {project.phase}
            </span>
            <span>·</span>
            <span className="text-xs text-[#77736D] font-medium">
              Contract Round {project.revisionConfig.currentRound} of {project.revisionConfig.includedRounds}
            </span>
          </div>

          <h1 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
            {project.projectName}
          </h1>
        </div>

        {/* Flexible Primary Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {domainConfig?.initiated && (
            <button
              onClick={() => setShowDomainModal(true)}
              className="px-4 py-2.5 bg-[#FAF8F4] border border-[#E8E2D9] hover:border-[#B99A74] text-[#171717] font-semibold text-xs rounded-xl transition-all shadow-2xs flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-[#B99A74]" />
              <span>Connect Domain</span>
            </button>
          )}

          <button
            onClick={handleOpenDescribeModal}
            className="px-4 py-2.5 bg-[#B99A74] hover:bg-[#a3835e] text-[#171717] font-semibold text-xs rounded-xl transition-all shadow-2xs flex items-center gap-2"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Describe a Change
          </button>

          <button
            onClick={() => setShowApprovalModal(true)}
            className="px-4 py-2.5 bg-[#171717] hover:bg-[#262626] text-white font-semibold text-xs rounded-xl transition-all shadow-2xs flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[#B99A74]" />
            Approve Design
          </button>
        </div>
      </div>

      {/* DOMAIN CONNECTION GUIDANCE TASK BANNER */}
      {domainConfig?.initiated && (
        <div className="bg-white border border-[#B99A74]/50 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B99A74] bg-[#B99A74]/10 px-2 py-0.5 rounded border border-[#B99A74]/20">
                Action Item: Production Domain Setup
              </span>
              <span className="text-xs text-[#77736D] font-mono">{domainConfig.domainName}</span>
            </div>

            <h3 className="font-serif-heading text-lg font-semibold text-[#171717]">
              {domainConfig.dnsSetupStatus === 'Verified' ? 'Domain DNS Connection Verified Live!' :
               domainConfig.dnsSetupStatus === 'Client Completed' ? 'DNS Changes Submitted — Awaiting Verification' :
               'Connect Your Custom Production Domain'}
            </h3>

            <p className="text-xs text-[#77736D] leading-relaxed">
              {domainConfig.dnsSetupStatus === 'Verified' 
                ? 'Your website is connected and live on your custom domain.' 
                : '1UpSites has prepared step-by-step DNS setup instructions for your domain.'}
            </p>
          </div>

          <button
            onClick={() => setShowDomainModal(true)}
            className="px-5 py-2.5 bg-[#171717] hover:bg-[#262626] text-[#B99A74] font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <Globe className="w-4 h-4 text-[#B99A74]" />
            <span>{domainConfig.dnsSetupStatus === 'Verified' ? 'View Domain Details' : 'Open Domain Guide'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Feature: Interactive Website Preview with Pinning Capability */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-serif-heading text-lg font-semibold text-[#171717] flex items-center gap-2">
            Interactive Website Preview
          </h2>
          <span className="text-xs text-[#77736D] hidden sm:inline">
            Use <strong>Pin a Change</strong> to mark an area or <strong>Describe a Change</strong> for text updates
          </span>
        </div>

        <InteractiveWebsitePreview 
          project={project} 
          revisions={clientRevisions}
          isClientView={true}
          selectedRevisionId={selectedRevisionId}
          onSelectRevision={(id) => setSelectedRevisionId(id)}
          onPinLocationClick={handlePinLocationClick}
          onRequestRevision={handleOpenDescribeModal}
          onApproveDesign={() => setShowApprovalModal(true)}
        />
      </div>

      {/* Revision Requests & Status Section */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E2D9]">
          <div>
            <h2 className="font-serif-heading text-xl font-semibold text-[#171717]">
              Submitted Revisions & Progress
            </h2>
            <p className="text-xs text-[#77736D]">
              Track changes, inspect pinned annotations, or reply to developer notes.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 bg-[#FAF8F4] border border-[#E8E2D9] rounded-lg text-[#171717] self-start sm:self-auto">
            {clientRevisions.filter(r => r.status !== 'Approved').length} Open Tasks
          </span>
        </div>

        {/* List & Detail Discussion Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Revision List (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            {clientRevisions.length === 0 ? (
              <div className="text-center py-10 bg-[#FAF8F4] rounded-xl border border-[#E8E2D9] text-[#77736D] text-xs">
                No revision requests submitted yet. Click "Describe a Change" or "Pin a Change" to get started.
              </div>
            ) : (
              clientRevisions.map((rev) => {
                const isSelected = selectedRevisionId === rev.id;
                const linkedFiles = projectFiles.filter(f => rev.attachedFileIds?.includes(f.id));

                return (
                  <div
                    key={rev.id}
                    onClick={() => setSelectedRevisionId(rev.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                      isSelected 
                        ? 'bg-white border-[#B99A74] ring-1 ring-[#B99A74]/30 shadow-md' 
                        : 'bg-[#FAF8F4]/80 border-[#E8E2D9] hover:border-[#B99A74] shadow-2xs'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 pb-2 border-b border-[#E8E2D9]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs text-[#171717]">{rev.id}</span>
                        {rev.pinCoordinates ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-900 font-bold border border-amber-200 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-700" /> Pinned ({rev.pinCoordinates.x}%, {rev.pinCoordinates.y}%)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-neutral-100 text-neutral-800 font-semibold border border-neutral-200 flex items-center gap-1">
                            <Edit3 className="w-3 h-3 text-neutral-500" /> Page: {rev.webpage}
                          </span>
                        )}
                      </div>

                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        rev.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        rev.status === 'Ready for Client Review' ? 'bg-amber-100 text-amber-950 border border-amber-300' :
                        'bg-[#171717] text-white'
                      }`}>
                        {rev.status}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-800 font-medium leading-relaxed">
                      "{rev.instructions}"
                    </p>

                    {/* Shared Asset Thumbnail Indicator */}
                    {linkedFiles.length > 0 && (
                      <div className="flex items-center gap-2 p-2 bg-white rounded border border-[#E8E2D9] text-[11px] text-[#77736D]">
                        <ImageIcon className="w-3.5 h-3.5 text-[#B99A74] shrink-0" />
                        <span>Attached Asset: <strong className="text-[#171717] font-medium">{linkedFiles[0].name}</strong></span>
                      </div>
                    )}

                    {rev.adminResponse && (
                      <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-200 text-[11px] text-[#171717]">
                        <strong className="text-[#B99A74]">1UpSites Developer Note:</strong> {rev.adminResponse}
                      </div>
                    )}

                    <div className="flex justify-between items-center text-[10px] text-neutral-400 pt-1">
                      <span>Submitted: {rev.submissionDate}</span>
                      {rev.status === 'Ready for Client Review' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateRevisionStatus(rev.id, 'Approved', 'Approved by client.');
                          }}
                          className="px-2.5 py-1 bg-emerald-700 text-white rounded font-semibold text-[10px] hover:bg-emerald-800"
                        >
                          Approve Change
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Conversation Thread & Inspector */}
          <div className="bg-[#FAF8F4] border border-[#E8E2D9] rounded-xl p-4 space-y-4 h-fit">
            {selectedRevTask ? (
              <div className="space-y-3 text-xs">
                <div className="pb-2 border-b border-[#E8E2D9] flex justify-between items-center">
                  <span className="font-mono font-bold text-sm text-[#171717]">{selectedRevTask.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-white text-[#171717] border border-[#E8E2D9]">
                    {selectedRevTask.status}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">Target Section:</span>
                  <p className="font-semibold text-[#171717]">{selectedRevTask.webpage} {selectedRevTask.section ? `— ${selectedRevTask.section}` : ''}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">Requested Change:</span>
                  <p className="p-2.5 bg-white rounded border border-[#E8E2D9] text-[#171717] leading-relaxed">
                    {selectedRevTask.instructions}
                  </p>
                </div>

                {/* Conversation Thread */}
                <div className="pt-2 border-t border-[#E8E2D9] space-y-2">
                  <span className="font-semibold text-[#171717] block">Message 1UpSites Team:</span>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedRevTask.comments.map(c => (
                      <div key={c.id} className="p-2 bg-white rounded border border-[#E8E2D9] text-[11px]">
                        <span className="font-semibold text-[#171717]">{c.authorName}: </span>
                        <span className="text-[#77736D]">{c.message}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendComment} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={inlineComment}
                      onChange={(e) => setInlineComment(e.target.value)}
                      placeholder="Type a response..."
                      className="flex-1 p-2 bg-white border border-[#E8E2D9] rounded text-xs focus:border-[#B99A74] focus:outline-none"
                    />
                    <button type="submit" className="p-2 bg-[#171717] text-white rounded hover:bg-[#262626]">
                      <Send className="w-3.5 h-3.5 text-[#B99A74]" />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-[#77736D] text-xs">
                Select a revision task to reply or inspect details.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* REVISION REQUEST FORM MODAL */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E2D9] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8E2D9]">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#B99A74] tracking-wider block">
                  {revisionMethod === 'pin' ? 'Visual Location Pin' : 'Describe Website Change'}
                </span>
                <h2 className="font-serif-heading text-lg font-semibold text-[#171717]">Request a Website Change</h2>
              </div>
              <button onClick={() => setShowRevisionModal(false)} className="text-neutral-400 hover:text-[#171717]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRevision} className="space-y-4 text-xs">
              {/* Method Indicator */}
              {revisionMethod === 'pin' && pinnedCoords ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-amber-950">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-700" />
                    <div>
                      <span className="font-semibold block text-xs">Pinned Area on Preview</span>
                      <span className="text-[11px] text-amber-800 font-mono">Location: ({pinnedCoords.x}%, {pinnedCoords.y}%)</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setRevisionMethod('describe')} 
                    className="text-[10px] underline text-amber-900 font-semibold"
                  >
                    Remove Pin
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-[#FAF8F4] border border-[#E8E2D9] rounded-xl flex items-center gap-2 text-[#77736D]">
                  <Edit3 className="w-4 h-4 text-[#B99A74] shrink-0" />
                  <span>Submitting a general text/copy change. No image upload or website pin is required.</span>
                </div>
              )}

              {/* Webpage Selector Dropdown */}
              <div>
                <label className="block font-semibold text-[#171717] mb-1">Target Webpage *</label>
                <select
                  value={targetWebpage}
                  onChange={(e) => setTargetWebpage(e.target.value)}
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-lg focus:border-[#B99A74] focus:outline-none text-xs bg-white"
                >
                  <option value="Homepage / Hero Section">Homepage / Hero Section</option>
                  <option value="Property Listings Grid">Property Listings Grid</option>
                  <option value="Product Collection Page">Product Collection Page</option>
                  <option value="Agent Inquiry Form">Agent Inquiry Form</option>
                  <option value="Contact Page & Hours">Contact Page & Hours</option>
                  <option value="Header Navigation & Footer">Header Navigation & Footer</option>
                </select>
              </div>

              {/* Optional Section Name */}
              <div>
                <label className="block font-semibold text-[#171717] mb-1">Specific Section (Optional)</label>
                <input
                  type="text"
                  value={targetSection}
                  onChange={(e) => setTargetSection(e.target.value)}
                  placeholder="e.g. Hero Subtitle or Thursday Closing Time"
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-lg focus:border-[#B99A74] focus:outline-none text-xs"
                />
              </div>

              {/* Universally Required Description */}
              <div>
                <label className="block font-semibold text-[#171717] mb-1">Describe Requested Change *</label>
                <textarea
                  required
                  rows={3}
                  value={instructionsText}
                  onChange={(e) => setInstructionsText(e.target.value)}
                  placeholder="e.g. Please update our Thursday closing time from 5 PM to 6 PM."
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-lg focus:border-[#B99A74] focus:outline-none text-xs"
                ></textarea>
              </div>

              {/* Optional Asset Attachment */}
              <div className="space-y-3 p-3 bg-[#FAF8F4] rounded-xl border border-[#E8E2D9]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#171717] block">Attach Photo or Media (Optional)</span>
                  <span className="text-[10px] text-[#77736D]">Optional field</span>
                </div>
                
                <div className="flex items-center gap-3 text-[11px]">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="attachMode"
                      checked={attachFileMode === 'none'}
                      onChange={() => setAttachFileMode('none')}
                    />
                    <span>No Attachment Needed</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="attachMode"
                      checked={attachFileMode === 'existing'}
                      onChange={() => setAttachFileMode('existing')}
                    />
                    <span>Choose From Project Files</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="attachMode"
                      checked={attachFileMode === 'upload'}
                      onChange={() => setAttachFileMode('upload')}
                    />
                    <span>Upload New File</span>
                  </label>
                </div>

                {attachFileMode === 'existing' && (
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={assetFolderFilter}
                        onChange={(e) => setAssetFolderFilter(e.target.value)}
                        className="p-2 bg-white border border-[#E8E2D9] rounded-lg text-xs"
                      >
                        <option value="ALL">All Folders ({projectFolders.length})</option>
                        {projectFolders.map(fold => (
                          <option key={fold.id} value={fold.id}>
                            📁 {fold.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={assetSearch}
                        onChange={(e) => setAssetSearch(e.target.value)}
                        placeholder="Filter filenames..."
                        className="p-2 bg-white border border-[#E8E2D9] rounded-lg text-xs"
                      />
                    </div>

                    <select
                      value={selectedFileId}
                      onChange={(e) => setSelectedFileId(e.target.value)}
                      className="w-full p-2 bg-white border border-[#E8E2D9] rounded-lg text-xs font-medium"
                    >
                      <option value="">Select a file from library...</option>
                      {selectorFilteredFiles.map(f => {
                        const fold = projectFolders.find(fold => fold.id === f.folderId);
                        return (
                          <option key={f.id} value={f.id}>
                            {fold ? `[${fold.name}] ` : ''}{f.name} ({f.category})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                {attachFileMode === 'upload' && (
                  <input
                    type="text"
                    required={attachFileMode === 'upload'}
                    value={newUploadFileName}
                    onChange={(e) => setNewUploadFileName(e.target.value)}
                    placeholder="Enter file name (e.g. Thursday_Hours_Sign.jpg)"
                    className="w-full p-2.5 bg-white border border-[#E8E2D9] rounded-lg text-xs"
                  />
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setShowRevisionModal(false)}
                  className="px-4 py-2 border border-[#E8E2D9] rounded-lg font-medium text-[#77736D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#171717] hover:bg-[#262626] text-white font-semibold rounded-lg"
                >
                  Submit Change Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approval Confirmation Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E2D9] shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h3 className="font-serif-heading text-xl font-semibold text-[#171717]">
              Approve Website Design?
            </h3>

            <p className="text-xs text-[#77736D] leading-relaxed">
              Formally record design approval for <strong className="text-[#171717]">{project.projectName}</strong>. This moves the project into final launch preparation.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="w-1/2 py-2.5 border border-[#E8E2D9] rounded-lg text-xs font-medium text-[#77736D]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  recordClientDesignApproval(project.id);
                  setShowApprovalModal(false);
                }}
                className="w-1/2 py-2.5 bg-[#171717] text-white text-xs font-semibold rounded-lg hover:bg-[#262626]"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GUIDED DOMAIN SETUP WIZARD MODAL */}
      <GuidedDomainSetupModal
        isOpen={showDomainModal}
        onClose={() => setShowDomainModal(false)}
        project={project}
      />

    </div>
  );
};
