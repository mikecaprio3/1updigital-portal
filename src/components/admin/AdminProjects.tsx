import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Project, ProjectPhase } from '../../types/portal';
import { AdminProjectDetail } from './AdminProjectDetail';
import { NewProspectProjectModal } from './NewProspectProjectModal';
import { 
  FolderKanban, Plus, Search, Filter, 
  ArrowRight, Clock, CheckCircle2, AlertCircle, X, ChevronRight, Layers, Lock, ExternalLink, Eye, Building2
} from 'lucide-react';

export const AdminProjects: React.FC = () => {
  const { 
    projects, clients, activeProjectId, setActiveProjectId, 
    revisions 
  } = usePortal();

  const [phaseFilter, setPhaseFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewProspectModal, setShowNewProspectModal] = useState(false);

  const phasesList: ProjectPhase[] = [
    'Inquiry', 'Agreement', 'Design', 'Client Review', 
    'Final Approval', 'Payment', 'Launch', 'Completed'
  ];

  const filteredProjects = projects.filter(p => {
    const matchesPhase = phaseFilter === 'ALL' || p.phase === phaseFilter;
    const client = clients.find(c => c.id === p.clientId);
    const matchesSearch = 
      p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client && client.businessName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPhase && matchesSearch;
  });

  // If a specific project is selected, render the Project Detail Workspace!
  if (activeProjectId) {
    const activeProject = projects.find(p => p.id === activeProjectId);
    if (activeProject) {
      return (
        <AdminProjectDetail 
          project={activeProject} 
          onBack={() => setActiveProjectId(null)} 
        />
      );
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B99A74] font-semibold block mb-1">
            Agency Workspaces
          </span>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
            Project Management
          </h1>
        </div>

        <button
          onClick={() => setShowNewProspectModal(true)}
          className="px-4 py-2.5 bg-[#171717] hover:bg-[#262626] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#B99A74]" />
          Create New Project / Prospect
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Phase Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white border border-[#E8E2D9] rounded-xl overflow-x-auto text-xs">
          <button
            onClick={() => setPhaseFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              phaseFilter === 'ALL' ? 'bg-[#171717] text-white' : 'text-[#77736D] hover:text-[#171717]'
            }`}
          >
            All Phases ({projects.length})
          </button>
          {phasesList.map(phase => {
            const count = projects.filter(p => p.phase === phase).length;
            if (count === 0 && phaseFilter !== phase) return null;
            return (
              <button
                key={phase}
                onClick={() => setPhaseFilter(phase)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  phaseFilter === phase ? 'bg-[#171717] text-white' : 'text-[#77736D] hover:text-[#171717]'
                }`}
              >
                {phase} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects or clients..."
            className="w-full bg-white border border-[#E8E2D9] rounded-xl pl-9 pr-3 py-2 text-xs text-[#171717] placeholder-neutral-400 focus:outline-none focus:border-[#B99A74]"
          />
        </div>

      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((proj) => {
          const client = clients.find(c => c.id === proj.clientId);
          const projRevisions = revisions.filter(r => r.projectId === proj.id);
          const openRevs = projRevisions.filter(r => r.status !== 'Approved');

          return (
            <div
              key={proj.id}
              className="bg-white border border-[#E8E2D9] rounded-2xl p-5 hover:border-[#B99A74] transition-all shadow-2xs space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs text-[#77736D] font-bold block">
                      {client?.businessName || 'Business Client'}
                    </span>
                    <h3 className="font-serif-heading text-lg font-semibold text-[#171717] group-hover:text-[#B99A74] transition-colors">
                      {proj.projectName}
                    </h3>
                  </div>

                  <span className="px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-bold bg-[#FAF8F4] text-[#171717] border border-[#E8E2D9] shrink-0">
                    {proj.phase}
                  </span>
                </div>

                <p className="text-xs text-[#77736D] line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              {/* Status Footer info & Google AI Studio Quick Actions */}
              <div className="pt-3 border-t border-[#E8E2D9] space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2 text-[#77736D] text-[11px]">
                  <div>
                    <span className="block text-neutral-400">Target Launch</span>
                    <strong className="text-[#171717]">{proj.targetCompletionDate}</strong>
                  </div>
                  <div>
                    <span className="block text-neutral-400">Revisions</span>
                    <strong className={openRevs.length > 0 ? 'text-amber-800' : 'text-emerald-800'}>
                      {openRevs.length} open
                    </strong>
                  </div>
                  <div>
                    <span className="block text-neutral-400">Portal Access</span>
                    <strong className="text-[#171717]">{proj.portalAccessStatus || client?.portalAccessStatus}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {/* Quick AI Studio Private Editor Action */}
                  {proj.aiStudioEditorUrl && (
                    <a
                      href={proj.aiStudioEditorUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-1/2 py-2 bg-[#171717] hover:bg-[#262626] text-[#B99A74] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      title="Open private Google AI Studio editing workspace"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Edit in AI Studio</span>
                    </a>
                  )}

                  <button
                    onClick={() => setActiveProjectId(proj.id)}
                    className={`${proj.aiStudioEditorUrl ? 'w-1/2' : 'w-full'} py-2 bg-[#FAF8F4] border border-[#E8E2D9] hover:border-[#B99A74] text-[#171717] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1 shadow-2xs`}
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B99A74]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global New Prospect / Project Modal Trigger */}
      <NewProspectProjectModal
        isOpen={showNewProspectModal}
        onClose={() => setShowNewProspectModal(false)}
      />

    </div>
  );
};
