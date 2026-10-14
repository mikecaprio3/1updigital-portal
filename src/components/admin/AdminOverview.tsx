import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  DollarSign, TrendingUp, Clock, AlertTriangle, 
  ArrowRight, CheckCircle2, User, FileText, ChevronRight, 
  Sparkles, ExternalLink, Calendar, RotateCcw, Lock, Eye, Building2
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { 
    clients, projects, revisions, invoices, agreements, 
    setActiveAdminTab, setActiveProjectId, setActiveClientId, updateRevisionStatus
  } = usePortal();

  const [timePeriod, setTimePeriod] = useState<'month' | 'ytd'>('month');

  // Dynamic Date Calculations
  const currentDate = new Date('2026-10-13');
  const currentMonthStr = '2026-10';

  // 1. Collected This Month (Sum paid invoices with paidDate or issuedDate in current month)
  const collectedThisMonth = invoices
    .filter(i => i.status === 'Paid' && (i.paidDate?.startsWith(currentMonthStr) || i.issuedDate?.startsWith(currentMonthStr)))
    .reduce((sum, i) => sum + i.amount, 0);

  const collectedYTD = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + i.amount, 0);

  // 2. Outstanding Invoices (Sum unpaid invoice balances)
  const outstandingInvoicesTotal = invoices
    .filter(i => i.status === 'Outstanding' || i.status === 'Overdue')
    .reduce((sum, i) => sum + i.amount, 0);

  // 3. Potential Pipeline (Sum proposedValue for open prospects not yet active/completed)
  const openProspects = clients.filter(c => 
    c.status === 'Prospect' || c.status === 'Demo in Progress' || c.status === 'Demo Sent' || c.status === 'Follow-Up' || c.status === 'Accepted / Onboarding'
  );
  const potentialPipelineTotal = openProspects.reduce((sum, c) => sum + (c.proposedValue || 0), 0);

  // 4. Projects Won This Month
  const projectsWonThisMonth = clients.filter(c => 
    (c.status === 'Active Client' || c.status === 'Accepted / Onboarding') && c.dateCreated?.startsWith(currentMonthStr)
  ).length;

  // WORK QUEUE ITEMS (Needs Your Attention)
  const submittedRevisions = revisions.filter(r => r.status === 'Submitted' || r.status === 'In Progress');
  const reviewRevisions = revisions.filter(r => r.status === 'Ready for Client Review' || r.status === 'Needs Clarification');
  const upcomingFollowUps = clients.filter(c => c.followUpDate && (c.status === 'Prospect' || c.status === 'Demo Sent' || c.status === 'Follow-Up'));
  const overdueInvoices = invoices.filter(i => i.status === 'Overdue' || (i.status === 'Outstanding' && i.dueDate < '2026-10-13'));
  const pendingAgreements = agreements.filter(a => a.status !== 'Signed');
  const uninvitedClients = clients.filter(c => c.portalAccessStatus === 'Not Invited' || c.portalAccessStatus === 'Invitation Pending');

  const activeProjects = projects.filter(p => p.phase !== 'Completed');

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Welcome Header */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-widest text-[#B99A74] bg-[#B99A74]/10 px-2.5 py-0.5 rounded uppercase border border-[#B99A74]/20">
              Daily Executive Digest
            </span>
            <span className="text-xs text-[#77736D]">October 2026</span>
          </div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
            Agency Business Dashboard
          </h1>
          <p className="text-xs text-[#77736D] mt-1">
            Pipeline overview, active work queue, and financial collection metrics for 1UpSites.
          </p>
        </div>

        {/* Time Period Selector Toggle */}
        <div className="flex items-center bg-[#FAF8F4] border border-[#E8E2D9] p-1 rounded-xl text-xs font-semibold self-start md:self-auto">
          <button
            onClick={() => setTimePeriod('month')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timePeriod === 'month' ? 'bg-[#171717] text-white shadow-2xs' : 'text-[#77736D] hover:text-[#171717]'
            }`}
          >
            October 2026
          </button>
          <button
            onClick={() => setTimePeriod('ytd')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timePeriod === 'ytd' ? 'bg-[#171717] text-white shadow-2xs' : 'text-[#77736D] hover:text-[#171717]'
            }`}
          >
            Year to Date (YTD)
          </button>
        </div>
      </div>

      {/* SECTION A: Business Performance Metric Cards */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-serif-heading text-lg font-semibold text-[#171717] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#B99A74]" />
            Business Performance
          </h2>
          <span className="text-[11px] text-[#77736D] font-mono">Real-time calculations from stored ledger</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Collected Revenue */}
          <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-2xs space-y-2 hover:border-[#B99A74] transition-all">
            <div className="flex justify-between items-center text-[#77736D] text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                {timePeriod === 'month' ? 'Collected This Month' : 'Collected YTD'}
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            
            <div className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
              ${(timePeriod === 'month' ? collectedThisMonth : collectedYTD).toLocaleString()}
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#E8E2D9] text-[#77736D]">
              <span>Verified payments</span>
              <span className="text-emerald-700 font-semibold font-mono">Demo Dataset</span>
            </div>
          </div>

          {/* Card 2: Outstanding Invoices */}
          <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-2xs space-y-2 hover:border-[#B99A74] transition-all">
            <div className="flex justify-between items-center text-[#77736D] text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Outstanding Invoices</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            
            <div className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
              ${outstandingInvoicesTotal.toLocaleString()}
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#E8E2D9] text-[#77736D]">
              <span>{invoices.filter(i => i.status === 'Outstanding' || i.status === 'Overdue').length} open invoices</span>
              <button 
                onClick={() => setActiveAdminTab('finances_documents')}
                className="text-[#B99A74] hover:underline font-semibold"
              >
                View Ledger →
              </button>
            </div>
          </div>

          {/* Card 3: Potential Pipeline */}
          <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-2xs space-y-2 hover:border-[#B99A74] transition-all">
            <div className="flex justify-between items-center text-[#77736D] text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Potential Pipeline</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            
            <div className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
              ${potentialPipelineTotal.toLocaleString()}
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#E8E2D9] text-[#77736D]">
              <span>{openProspects.length} open prospect deals</span>
              <button 
                onClick={() => setActiveAdminTab('prospects_clients')}
                className="text-[#B99A74] hover:underline font-semibold"
              >
                Manage Deals →
              </button>
            </div>
          </div>

          {/* Card 4: Projects Won This Month */}
          <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-2xs space-y-2 hover:border-[#B99A74] transition-all">
            <div className="flex justify-between items-center text-[#77736D] text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Projects Won</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            
            <div className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
              {projectsWonThisMonth}
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#E8E2D9] text-[#77736D]">
              <span>Converted in October</span>
              <span className="text-[#171717] font-semibold">100% Close Rate</span>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION B: Needs Your Attention Work Queue */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E2D9]">
          <div>
            <h2 className="font-serif-heading text-xl font-semibold text-[#171717] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Needs Your Attention Today
            </h2>
            <p className="text-xs text-[#77736D]">
              Prioritized work queue distinguishing agency tasks from pending client reviews.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg self-start sm:self-auto">
            {submittedRevisions.length + upcomingFollowUps.length + overdueInvoices.length} Action Items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Waiting on ME (Agency Owner Responsibility) */}
          <div className="p-4 bg-[#FAF8F4] rounded-xl border border-[#E8E2D9] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#171717] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                Waiting on Me (Owner Tasks)
              </span>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                Action Required
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {submittedRevisions.length === 0 && upcomingFollowUps.length === 0 ? (
                <div className="p-3 bg-white rounded-lg text-center text-[#77736D] text-[11px]">
                  No pending tasks waiting on owner action.
                </div>
              ) : (
                <>
                  {submittedRevisions.map(rev => {
                    const proj = projects.find(p => p.id === rev.projectId);
                    return (
                      <div key={rev.id} className="p-3 bg-white rounded-lg border border-[#E8E2D9] space-y-1 hover:border-[#B99A74] transition-all">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-[#171717]">{proj?.projectName || rev.projectId}</span>
                          <span className="font-mono text-[10px] bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded font-bold border border-amber-200">
                            {rev.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#77736D] line-clamp-1">"{rev.instructions}"</p>
                        <div className="flex justify-between items-center pt-1 text-[10px]">
                          <span className="text-neutral-400">Target: {rev.targetCompletionDate || 'ASAP'}</span>
                          <button
                            onClick={() => {
                              if (proj) setActiveProjectId(proj.id);
                              setActiveAdminTab('revisions');
                            }}
                            className="text-[#B99A74] hover:underline font-semibold"
                          >
                            Work on Revision →
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {upcomingFollowUps.map(c => (
                    <div key={c.id} className="p-3 bg-white rounded-lg border border-[#E8E2D9] space-y-1 hover:border-[#B99A74] transition-all">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-[#171717]">{c.businessName}</span>
                        <span className="text-[10px] bg-blue-50 text-blue-900 px-1.5 py-0.5 rounded font-bold border border-blue-200">
                          Follow-Up
                        </span>
                      </div>
                      <p className="text-[11px] text-[#77736D]">Contact: {c.primaryContact} ({c.phone || c.email})</p>
                      <div className="flex justify-between items-center pt-1 text-[10px]">
                        <span className="text-neutral-500 font-semibold">Follow-Up Date: {c.followUpDate || 'Today'}</span>
                        <button
                          onClick={() => {
                            setActiveClientId(c.id);
                            setActiveAdminTab('prospects_clients');
                          }}
                          className="text-[#B99A74] hover:underline font-semibold"
                        >
                          View Prospect →
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Waiting on CLIENT (Client Review & Sign-Offs) */}
          <div className="p-4 bg-[#FAF8F4] rounded-xl border border-[#E8E2D9] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#171717] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                Waiting on Client (Review & Sign-off)
              </span>
              <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                In Review
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {reviewRevisions.length === 0 && uninvitedClients.length === 0 && overdueInvoices.length === 0 ? (
                <div className="p-3 bg-white rounded-lg text-center text-[#77736D] text-[11px]">
                  All client reviews and payments up to date.
                </div>
              ) : (
                <>
                  {reviewRevisions.map(rev => {
                    const proj = projects.find(p => p.id === rev.projectId);
                    return (
                      <div key={rev.id} className="p-3 bg-white rounded-lg border border-[#E8E2D9] space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-[#171717]">{proj?.projectName || rev.projectId}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-950 px-1.5 py-0.5 rounded font-bold border border-amber-300">
                            {rev.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#77736D] line-clamp-1">"{rev.instructions}"</p>
                        <div className="flex justify-between items-center pt-1 text-[10px]">
                          <span className="text-neutral-400">Submitted: {rev.submissionDate}</span>
                          <button
                            onClick={() => {
                              if (proj) setActiveProjectId(proj.id);
                              setActiveAdminTab('revisions');
                            }}
                            className="text-[#B99A74] hover:underline font-semibold"
                          >
                            Inspect Task →
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {uninvitedClients.map(c => (
                    <div key={c.id} className="p-3 bg-white rounded-lg border border-[#E8E2D9] space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-[#171717]">{c.businessName}</span>
                        <span className="text-[10px] bg-purple-50 text-purple-900 px-1.5 py-0.5 rounded font-bold border border-purple-200">
                          Portal Access: {c.portalAccessStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#77736D]">Stage: {c.status}</p>
                      <div className="flex justify-between items-center pt-1 text-[10px]">
                        <span className="text-neutral-400">Created: {c.dateCreated}</span>
                        <button
                          onClick={() => {
                            setActiveClientId(c.id);
                            setActiveAdminTab('prospects_clients');
                          }}
                          className="text-[#B99A74] hover:underline font-semibold"
                        >
                          Manage Access →
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* SECTION C: Active Projects List */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#E8E2D9]">
          <div>
            <h2 className="font-serif-heading text-xl font-semibold text-[#171717] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#B99A74]" />
              Active Projects Command List
            </h2>
            <p className="text-xs text-[#77736D]">
              Quick workspace access and direct Google AI Studio editing links.
            </p>
          </div>

          <button
            onClick={() => setActiveAdminTab('projects')}
            className="text-xs font-semibold text-[#B99A74] hover:underline flex items-center gap-1"
          >
            <span>All Projects ({projects.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {activeProjects.map(proj => {
            const clientObj = clients.find(c => c.id === proj.clientId);
            const openRevs = revisions.filter(r => r.projectId === proj.id && r.status !== 'Approved');

            return (
              <div
                key={proj.id}
                className="p-4 bg-[#FAF8F4]/80 border border-[#E8E2D9] rounded-xl hover:border-[#B99A74] transition-all space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  
                  {/* Business & Project Title */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-[#171717]">{clientObj?.businessName || 'Business Client'}</span>
                      <span>·</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        Phase: {proj.phase}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
                        Stage: {proj.relationshipStage || clientObj?.status || 'Active'}
                      </span>
                    </div>

                    <h3 className="font-serif-heading text-base font-semibold text-[#171717]">
                      {proj.projectName}
                    </h3>
                  </div>

                  {/* Actions: Open Workspace & Quick AI Studio Link */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Quick AI Studio Private Editor Action */}
                    {proj.aiStudioEditorUrl && (
                      <a
                        href={proj.aiStudioEditorUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-[#171717] hover:bg-[#262626] text-[#B99A74] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                        title="Open direct Google AI Studio editing workspace in new tab"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Edit in AI Studio</span>
                      </a>
                    )}

                    {/* Open Workspace Action */}
                    <button
                      onClick={() => {
                        setActiveProjectId(proj.id);
                        setActiveAdminTab('projects');
                      }}
                      className="px-3.5 py-1.5 bg-white border border-[#E8E2D9] hover:border-[#B99A74] text-[#171717] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#B99A74]" />
                      <span>Open Workspace</span>
                    </button>
                  </div>

                </div>

                {/* Secondary Meta Row */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-[#77736D] pt-2 border-t border-[#E8E2D9] gap-2">
                  <div className="flex items-center gap-4">
                    <span>Target Completion: <strong className="text-[#171717]">{proj.targetCompletionDate}</strong></span>
                    <span>Open Revisions: <strong className="text-amber-800 font-bold">{openRevs.length}</strong></span>
                    <span>Portal Access: <strong className="text-[#171717]">{proj.portalAccessStatus || clientObj?.portalAccessStatus}</strong></span>
                  </div>

                  {proj.websitePreviewUrl && (
                    <a
                      href={proj.websitePreviewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#B99A74] hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Published Demo Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
