import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { Activity, Clock, ShieldAlert } from 'lucide-react';

export const AdminActivity: React.FC = () => {
  const { activityLogs, projects } = usePortal();

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B99A74] font-semibold block mb-1">
            Audit History Trail
          </span>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
            Project Activity Log
          </h1>
        </div>
      </div>

      <div className="bg-white border border-[#E8E2D9] rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#B99A74] bg-[#FAF8F4] p-2.5 rounded-lg border border-[#E8E2D9]">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>[DEMO RECORD] Timestamped audit history log of revisions, approvals, status updates, and uploaded assets.</span>
        </div>

        <div className="space-y-4">
          {activityLogs.map((log) => {
            const proj = projects.find(p => p.id === log.projectId);

            return (
              <div key={log.id} className="p-4 bg-[#FAF8F4] border border-[#E8E2D9] rounded-xl text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#171717]">{log.title}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>

                <p className="text-[#77736D] leading-relaxed">{log.description}</p>

                <div className="flex justify-between items-center text-[10px] text-[#B99A74] pt-1">
                  <span>Project: {proj?.projectName || 'Agency'}</span>
                  <span>Actor: <strong>{log.actor}</strong> ({log.actorRole})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
