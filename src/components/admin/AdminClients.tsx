import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Client, ProspectStatus, PortalAccessStatus } from '../../types/portal';
import { 
  Users, Plus, Search, Mail, Phone, Calendar, 
  FolderKanban, Edit3, ChevronRight, X, UserCheck, 
  Lock, ExternalLink, ShieldCheck, DollarSign, CheckCircle2, Building2, Eye, Sparkles
} from 'lucide-react';

export const AdminClients: React.FC = () => {
  const { 
    clients, projects, activeClientId, setActiveClientId, 
    updateClient, updatePortalAccessStatus, updateProspectStatus, updateAiStudioUrls,
    setActiveAdminTab, setActiveProjectId 
  } = usePortal();

  const [filterStage, setFilterStage] = useState<'ALL' | 'PROSPECTS' | 'ACTIVE' | 'COMPLETED' | 'LOST'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected client for Profile Drawer / Modal
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    clients.find(c => c.id === activeClientId) || clients[0] || null
  );

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);

  // Edit State
  const [editBusinessName, setEditBusinessName] = useState('');
  const [editPrimaryContact, setEditPrimaryContact] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editStatus, setEditStatus] = useState<ProspectStatus>('Prospect');
  const [editProposedValue, setEditProposedValue] = useState<string>('');
  const [editFollowUpDate, setEditFollowUpDate] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editPublishedUrl, setEditPublishedUrl] = useState('');
  const [editEditorUrl, setEditEditorUrl] = useState('');

  // Filter Logic
  const filteredClients = clients.filter(c => {
    const isProspect = c.status === 'Prospect' || c.status === 'Demo in Progress' || c.status === 'Demo Sent' || c.status === 'Follow-Up' || c.status === 'Accepted / Onboarding';
    const isActive = c.status === 'Active Client';
    const isCompleted = c.status === 'Completed';
    const isLost = c.status === 'Lost / Declined';

    let matchesFilter = true;
    if (filterStage === 'PROSPECTS') matchesFilter = isProspect;
    if (filterStage === 'ACTIVE') matchesFilter = isActive;
    if (filterStage === 'COMPLETED') matchesFilter = isCompleted;
    if (filterStage === 'LOST') matchesFilter = isLost;

    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      c.businessName.toLowerCase().includes(query) ||
      c.primaryContact.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      (c.phone && c.phone.includes(query));

    return matchesFilter && matchesSearch;
  });

  const handleOpenEdit = (clientObj: Client) => {
    setSelectedClient(clientObj);
    setEditBusinessName(clientObj.businessName);
    setEditPrimaryContact(clientObj.primaryContact);
    setEditEmail(clientObj.email);
    setEditPhone(clientObj.phone);
    setEditStatus(clientObj.status);
    setEditProposedValue(clientObj.proposedValue ? clientObj.proposedValue.toString() : '');
    setEditFollowUpDate(clientObj.followUpDate || '');
    setEditNotes(clientObj.notes || '');
    setEditPublishedUrl(clientObj.aiStudioPublishedUrl || '');
    setEditEditorUrl(clientObj.aiStudioEditorUrl || '');
    setShowEditModal(true);
  };

  const handleSaveEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    updateClient(selectedClient.id, {
      businessName: editBusinessName,
      primaryContact: editPrimaryContact,
      email: editEmail,
      phone: editPhone,
      status: editStatus,
      proposedValue: editProposedValue ? parseFloat(editProposedValue) : undefined,
      followUpDate: editFollowUpDate || undefined,
      notes: editNotes || undefined,
      aiStudioPublishedUrl: editPublishedUrl || undefined,
      aiStudioEditorUrl: editEditorUrl || undefined
    });

    const linkedProj = projects.find(p => p.clientId === selectedClient.id);
    if (linkedProj) {
      updateAiStudioUrls(linkedProj.id, editPublishedUrl, editEditorUrl);
    }

    setShowEditModal(false);
  };

  const handleTogglePortalAccess = (clientId: string, newAccess: PortalAccessStatus) => {
    updatePortalAccessStatus(clientId, newAccess);
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient({ ...selectedClient, portalAccessStatus: newAccess });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B99A74] font-semibold block mb-1">
            Agency Relationship Management
          </span>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
            Prospects & Clients Directory
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold px-3 py-1 bg-[#FAF8F4] border border-[#E8E2D9] rounded-lg text-[#171717]">
            {clients.length} Total Businesses
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        
        {/* Segmented Category Buttons */}
        <div className="flex items-center gap-1 p-1 bg-white border border-[#E8E2D9] rounded-xl overflow-x-auto text-xs">
          {[
            { id: 'ALL', label: 'All Businesses' },
            { id: 'PROSPECTS', label: 'Open Prospects' },
            { id: 'ACTIVE', label: 'Active Clients' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'LOST', label: 'Archived / Lost' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStage(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                filterStage === tab.id ? 'bg-[#171717] text-white shadow-2xs' : 'text-[#77736D] hover:text-[#171717]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search business, contact, or email..."
            className="w-full bg-white border border-[#E8E2D9] rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#B99A74]"
          />
        </div>

      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-[#E8E2D9] p-6 text-xs text-[#77736D]">
            No prospects or clients matching criteria. Use "New Prospect / Project" above to create one.
          </div>
        ) : (
          filteredClients.map((client) => {
            const linkedProject = projects.find(p => p.clientId === client.id);
            const isProspect = client.status === 'Prospect' || client.status === 'Demo in Progress' || client.status === 'Demo Sent' || client.status === 'Follow-Up' || client.status === 'Accepted / Onboarding';

            return (
              <div
                key={client.id}
                className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-2xs hover:border-[#B99A74] transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  
                  {/* Card Header: Badges */}
                  <div className="flex justify-between items-start gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      isProspect ? 'bg-amber-100 text-amber-950 border border-amber-300' :
                      client.status === 'Active Client' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      'bg-neutral-100 text-neutral-800 border border-neutral-200'
                    }`}>
                      {client.status}
                    </span>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                      client.portalAccessStatus === 'Active' ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' :
                      client.portalAccessStatus === 'Invitation Pending' ? 'bg-amber-50 text-amber-900 border border-amber-200' :
                      'bg-neutral-100 text-neutral-600 border border-neutral-200'
                    }`}>
                      <Lock className="w-3 h-3 shrink-0" /> Portal: {client.portalAccessStatus}
                    </span>
                  </div>

                  {/* Business & Contact Name */}
                  <div>
                    <h3 className="font-serif-heading text-lg font-semibold text-[#171717] group-hover:text-[#B99A74] transition-colors">
                      {client.businessName}
                    </h3>
                    <span className="text-xs text-[#77736D] block font-medium">
                      Contact: {client.primaryContact}
                    </span>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-1 text-xs text-[#77736D]">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{client.email || 'No email saved'}</span>
                    </div>
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Commercial Value & Follow Up */}
                  <div className="p-3 bg-[#FAF8F4] rounded-xl border border-[#E8E2D9] space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#77736D]">Proposed Value:</span>
                      <strong className="font-serif-heading text-sm text-[#171717]">
                        {client.proposedValue ? `$${client.proposedValue.toLocaleString()}` : 'Custom SOW'}
                      </strong>
                    </div>

                    {client.followUpDate && (
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[#77736D]">Follow-Up Date:</span>
                        <strong className="text-amber-800 font-semibold">{client.followUpDate}</strong>
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  {linkedProject && (
                    <div className="text-xs space-y-1 pt-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#77736D] block">Associated Project</span>
                      <div className="p-2 bg-white rounded-lg border border-[#E8E2D9] font-medium text-[#171717]">
                        {linkedProject.projectName} (Phase: {linkedProject.phase})
                      </div>
                    </div>
                  )}

                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[#E8E2D9] flex flex-wrap items-center justify-between gap-2 text-xs">
                  
                  <button
                    onClick={() => handleOpenEdit(client)}
                    className="px-3 py-1.5 bg-[#FAF8F4] hover:bg-neutral-200 border border-[#E8E2D9] text-[#171717] font-semibold rounded-lg transition-colors flex items-center gap-1.5 text-[11px]"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#B99A74]" />
                    <span>Edit Profile</span>
                  </button>

                  {linkedProject && (
                    <button
                      onClick={() => {
                        setActiveProjectId(linkedProject.id);
                        setActiveAdminTab('projects');
                      }}
                      className="px-3 py-1.5 bg-[#171717] hover:bg-[#262626] text-white font-semibold rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <span>Workspace</span>
                      <ChevronRight className="w-3 h-3 text-[#B99A74]" />
                    </button>
                  )}

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* EDIT PROSPECT / CLIENT MODAL */}
      {showEditModal && selectedClient && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-[#E8E2D9] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-3 border-b border-[#E8E2D9]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#B99A74]">Business Profile Manager</span>
                <h3 className="font-serif-heading text-xl font-semibold text-[#171717]">{selectedClient.businessName}</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-neutral-400 hover:text-[#171717]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#77736D] mb-1 font-semibold">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={editBusinessName}
                    onChange={(e) => setEditBusinessName(e.target.value)}
                    className="w-full p-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#77736D] mb-1 font-semibold">Primary Contact Name</label>
                  <input
                    type="text"
                    value={editPrimaryContact}
                    onChange={(e) => setEditPrimaryContact(e.target.value)}
                    className="w-full p-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#77736D] mb-1 font-semibold">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full p-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#77736D] mb-1 font-semibold">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-2.5 border border-[#E8E2D9] rounded-xl focus:border-[#B99A74] focus:outline-none"
                  />
                </div>
              </div>

              {/* Relationship Stage & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#FAF8F4] rounded-xl border border-[#E8E2D9]">
                <div>
                  <label className="block text-[#77736D] mb-1 font-semibold">Relationship Stage</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as ProspectStatus)}
                    className="w-full p-2 border border-[#E8E2D9] rounded-lg text-xs font-semibold bg-white"
                  >
                    <option value="Prospect">Prospect</option>
                    <option value="Demo in Progress">Demo in Progress</option>
                    <option value="Demo Sent">Demo Sent</option>
                    <option value="Follow-Up">Follow-Up</option>
                    <option value="Accepted / Onboarding">Accepted / Onboarding</option>
                    <option value="Active Client">Active Client</option>
                    <option value="Completed">Completed</option>
                    <option value="Lost / Declined">Lost / Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#77736D] mb-1 font-semibold">Proposed Price ($)</label>
                  <input
                    type="number"
                    value={editProposedValue}
                    onChange={(e) => setEditProposedValue(e.target.value)}
                    className="w-full p-2 border border-[#E8E2D9] rounded-lg text-xs font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[#77736D] mb-1 font-semibold">Follow-Up Date</label>
                  <input
                    type="date"
                    value={editFollowUpDate}
                    onChange={(e) => setEditFollowUpDate(e.target.value)}
                    className="w-full p-2 border border-[#E8E2D9] rounded-lg text-xs bg-white"
                  />
                </div>
              </div>

              {/* PORTAL ACCESS CONTROL IN PROFILE */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-2 text-amber-950">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-amber-700" />
                    Client Portal Access Management
                  </span>
                  <span className="font-bold text-xs font-mono bg-white px-2 py-0.5 rounded border border-amber-300">
                    {selectedClient.portalAccessStatus}
                  </span>
                </div>

                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Explicitly grant access when prospect accepts project terms.
                </p>

                <div className="flex gap-2 pt-1">
                  {selectedClient.portalAccessStatus !== 'Active' ? (
                    <button
                      type="button"
                      onClick={() => handleTogglePortalAccess(selectedClient.id, 'Active')}
                      className="px-3 py-1.5 bg-[#171717] text-[#B99A74] font-semibold text-[11px] rounded-lg hover:bg-[#262626]"
                    >
                      Enable Portal Access (Demo)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleTogglePortalAccess(selectedClient.id, 'Revoked')}
                      className="px-3 py-1.5 bg-rose-700 text-white font-semibold text-[11px] rounded-lg hover:bg-rose-800"
                    >
                      Revoke Access
                    </button>
                  )}
                </div>
              </div>

              {/* Google AI Studio URLs */}
              <div className="space-y-2">
                <div>
                  <label className="block text-[#77736D] mb-1 font-semibold">Published Website URL (Public View)</label>
                  <input
                    type="url"
                    value={editPublishedUrl}
                    onChange={(e) => setEditPublishedUrl(e.target.value)}
                    placeholder="https://that-hair-though-beauty-bar-north-haven-ct-salon.ai.studio/"
                    className="w-full p-2 border border-[#E8E2D9] rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#77736D] mb-1 font-semibold">AI Studio Editing Link — Private (Admin Only)</label>
                  <input
                    type="url"
                    value={editEditorUrl}
                    onChange={(e) => setEditEditorUrl(e.target.value)}
                    placeholder="https://aistudio.google.com/prompts/..."
                    className="w-full p-2 border border-[#E8E2D9] rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#77736D] mb-1 font-semibold">Internal Notes</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-2 border border-[#E8E2D9] rounded-lg text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-[#E8E2D9] rounded-lg text-xs font-medium text-[#77736D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#171717] text-white text-xs font-semibold rounded-lg hover:bg-[#262626]"
                >
                  Save Profile Updates
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
