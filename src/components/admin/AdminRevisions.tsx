import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { RevisionStatus } from '../../types/portal';
import { 
  RotateCcw, Search, Filter, MessageSquare, 
  CheckCircle2, Clock, AlertCircle, Send, MapPin, ImageIcon, User
} from 'lucide-react';

export const AdminRevisions: React.FC = () => {
  const { 
    revisions, projects, clients, 
    updateRevisionStatus, addRevisionComment 
  } = usePortal();

  const [responsibilityFilter, setResponsibilityFilter] = useState<'ATTENTION' | 'IN_PROGRESS' | 'WAITING_CLIENT' | 'ALL'>('ATTENTION');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRevId, setSelectedRevId] = useState<string | null>(revisions[0]?.id || null);
  const [commentText, setCommentText] = useState('');

  const filteredRevisions = revisions.filter(rev => {
    const isOwnerActionNeeded = rev.status === 'Submitted' || rev.status === 'In Progress';
    const isWaitingOnClient = rev.status === 'Ready for Client Review' || rev.status === 'Needs Clarification';
    const isInProgress = rev.status === 'In Progress' || rev.status === 'Under Review';

    let matchesFilter = true;
    if (responsibilityFilter === 'ATTENTION') matchesFilter = isOwnerActionNeeded;
    if (responsibilityFilter === 'IN_PROGRESS') matchesFilter = isInProgress;
    if (responsibilityFilter === 'WAITING_CLIENT') matchesFilter = isWaitingOnClient;

    const proj = projects.find(p => p.id === rev.projectId);
    const client = proj ? clients.find(c => c.id === proj.clientId) : null;

    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      rev.id.toLowerCase().includes(query) ||
      rev.instructions.toLowerCase().includes(query) ||
      rev.webpage.toLowerCase().includes(query) ||
      (proj && proj.projectName.toLowerCase().includes(query)) ||
      (client && client.businessName.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  const selectedRevision = revisions.find(r => r.id === selectedRevId);
  const selectedProj = selectedRevision ? projects.find(p => p.id === selectedRevision.projectId) : null;
  const selectedClient = selectedProj ? clients.find(c => c.id === selectedProj.clientId) : null;

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRevId || !commentText.trim()) return;

    addRevisionComment(selectedRevId, 'admin', '1UpSites Team', commentText.trim());
    setCommentText('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B99A74] font-semibold block mb-1">
            Global Revision Command Queue
          </span>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
            Revision Management
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-[#E8E2D9] text-xs shadow-2xs">
          <span className="text-[#77736D]">Total Active Tasks:</span>
          <strong className="text-amber-800 font-bold">{revisions.filter(r => r.status !== 'Approved').length} Open</strong>
        </div>
      </div>

      {/* Responsibility Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-white border border-[#E8E2D9] rounded-xl overflow-x-auto text-xs font-semibold">
          {[
            { id: 'ATTENTION', label: 'Needs My Attention' },
            { id: 'IN_PROGRESS', label: 'In Progress' },
            { id: 'WAITING_CLIENT', label: 'Waiting on Client' },
            { id: 'ALL', label: 'All Tasks' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setResponsibilityFilter(filter.id as any)}
              className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                responsibilityFilter === filter.id ? 'bg-[#171717] text-white shadow-2xs' : 'text-[#77736D] hover:text-[#171717]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, business, or instruction..."
            className="w-full bg-white border border-[#E8E2D9] rounded-xl pl-9 pr-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#B99A74]"
          />
        </div>
      </div>

      {/* Main Grid with List & Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Revision List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredRevisions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#E8E2D9] p-6 text-xs text-[#77736D]">
              No revision tasks matching the selected filter.
            </div>
          ) : (
            filteredRevisions.map((rev) => {
              const proj = projects.find(p => p.id === rev.projectId);
              const client = proj ? clients.find(c => c.id === proj.clientId) : null;
              const isSelected = selectedRevId === rev.id;
              const isOwnerResponsibility = rev.status === 'Submitted' || rev.status === 'In Progress';

              return (
                <div
                  key={rev.id}
                  onClick={() => setSelectedRevId(rev.id)}
                  className={`p-4 bg-white border rounded-2xl transition-all cursor-pointer space-y-3 ${
                    isSelected ? 'border-[#B99A74] ring-2 ring-[#B99A74]/20 shadow-md' : 'border-[#E8E2D9] hover:border-[#B99A74] shadow-2xs'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 pb-2 border-b border-[#E8E2D9]">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono font-bold text-[#171717] text-xs">{rev.id}</span>
                        <span>·</span>
                        <span className="font-bold text-[#171717] text-xs">{client?.businessName}</span>
                        {rev.pinCoordinates && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-950 font-bold border border-amber-200 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-700" /> Pinned
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#77736D] block font-medium">{rev.webpage} — {rev.section}</span>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        isOwnerResponsibility ? 'bg-amber-100 text-amber-950 border border-amber-300' :
                        rev.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        'bg-neutral-100 text-neutral-800 border border-neutral-200'
                      }`}>
                        {rev.status}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {isOwnerResponsibility ? 'Responsibility: Owner' : 'Responsibility: Client'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-800 line-clamp-2 leading-relaxed">
                    "{rev.instructions}"
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-neutral-400 pt-1 border-t border-[#E8E2D9]">
                    <span>Round {rev.roundNumber}</span>
                    <span>Submitted: {rev.submissionDate}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Revision Inspector */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-2xs space-y-4 h-fit sticky top-22">
          {selectedRevision ? (
            <div className="space-y-4 text-xs">
              <div className="pb-3 border-b border-[#E8E2D9] flex justify-between items-start">
                <div>
                  <span className="font-mono font-bold text-base text-[#171717]">{selectedRevision.id}</span>
                  <span className="text-xs font-semibold text-[#171717] block">{selectedClient?.businessName}</span>
                </div>
                <select
                  value={selectedRevision.status}
                  onChange={(e) => updateRevisionStatus(selectedRevision.id, e.target.value as RevisionStatus)}
                  className="bg-[#FAF8F4] text-[#171717] font-semibold text-xs border border-[#E8E2D9] rounded-lg px-2.5 py-1 focus:outline-none"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Ready for Client Review">Ready for Client Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Needs Clarification">Needs Clarification</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">Webpage Target:</span>
                <p className="font-medium text-[#171717]">{selectedRevision.webpage} ({selectedRevision.section})</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">Requested Change:</span>
                <p className="p-3 bg-[#FAF8F4] rounded-xl border border-[#E8E2D9] text-[#171717] leading-relaxed">
                  {selectedRevision.instructions}
                </p>
              </div>

              {selectedRevision.attachmentUrl && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">Attached Photo Asset:</span>
                  <img src={selectedRevision.attachmentUrl} alt="Attachment" className="w-full h-36 object-cover rounded-xl border border-[#E8E2D9]" />
                </div>
              )}

              {/* Discussion Thread */}
              <div className="pt-3 border-t border-[#E8E2D9] space-y-2">
                <span className="font-semibold text-[#171717] block">Post Comment or Update:</span>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedRevision.comments.map(c => (
                    <div key={c.id} className="p-2.5 bg-[#FAF8F4] rounded-lg border border-[#E8E2D9] text-[11px]">
                      <span className="font-semibold text-[#171717]">{c.authorName}: </span>
                      <span className="text-[#77736D]">{c.message}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handlePostComment} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Type message to client..."
                    className="flex-1 p-2 border border-[#E8E2D9] rounded-xl text-xs focus:border-[#B99A74] focus:outline-none"
                  />
                  <button type="submit" className="p-2 bg-[#171717] text-white rounded-xl hover:bg-[#262626]">
                    <Send className="w-3.5 h-3.5 text-[#B99A74]" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#77736D] text-xs">
              Select a revision task from the left list to inspect details and respond.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
