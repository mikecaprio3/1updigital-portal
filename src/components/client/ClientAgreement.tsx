import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ClientAgreement: React.FC = () => {
  const { clients, activeClientId, projects, agreements } = usePortal();

  const client = clients.find(c => c.id === activeClientId) || clients[0];
  const project = projects.find(p => p.clientId === client.id) || projects[0];
  const clientAgreements = agreements.filter(a => a.projectId === project?.id);

  if (!project) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="pb-4 border-b border-[#E8E2D9]">
        <span className="text-xs uppercase tracking-widest text-[#B99A74] font-semibold block mb-1">
          Contractual Documents
        </span>
        <h1 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
          Statement of Work & Agreement
        </h1>
      </div>

      <div className="space-y-4">
        {clientAgreements.map((agr) => (
          <div key={agr.id} className="bg-white border border-[#E8E2D9] rounded-xl p-6 shadow-2xs space-y-4 text-xs">
            <div className="flex justify-between items-start pb-3 border-b border-[#E8E2D9]">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#B99A74] tracking-wider block">{agr.documentType}</span>
                <h3 className="font-serif-heading text-lg font-semibold text-[#171717]">{agr.title}</h3>
              </div>

              <span className={`px-3 py-1 rounded text-xs font-semibold ${
                agr.status === 'Signed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800'
              }`}>
                Status: {agr.status}
              </span>
            </div>

            <p className="text-[#77736D] leading-relaxed">{agr.summary}</p>

            <div className="bg-[#FAF8F4] p-4 rounded-lg border border-[#E8E2D9] space-y-2">
              <span className="font-semibold text-[#171717] block">Terms & Contractual Revision Window:</span>
              <ul className="list-disc list-inside space-y-1 text-[#77736D]">
                {agr.terms.map((term, idx) => (
                  <li key={idx}>{term}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between items-center text-[11px] text-neutral-400 pt-2 border-t border-[#E8E2D9]">
              <span>Sent Date: {agr.sentDate}</span>
              {agr.signedDate && <span>Signed Date: {agr.signedDate}</span>}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
