import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { Agreement } from '../../types/portal';
import { FileText, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const AdminAgreements: React.FC = () => {
  const { agreements, projects, clients, updateAgreementStatus } = usePortal();

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B99A74] font-semibold block mb-1">
            Contractual Documents Hub
          </span>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
            Agreements & SOWs
          </h1>
        </div>
      </div>

      <div className="space-y-4">
        {agreements.map((agr) => {
          const proj = projects.find(p => p.id === agr.projectId);
          const client = proj ? clients.find(c => c.id === proj.clientId) : null;

          return (
            <div key={agr.id} className="bg-white border border-[#E8E2D9] rounded-xl p-6 shadow-2xs space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E2D9]">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#B99A74] tracking-wider block">{agr.documentType}</span>
                  <h3 className="font-serif-heading text-lg font-semibold text-[#171717]">{agr.title}</h3>
                  <span className="text-[#77736D] block">{client?.businessName} — {proj?.projectName}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-serif-heading font-semibold text-lg text-[#171717]">${agr.amount.toLocaleString()}</span>
                  <select
                    value={agr.status}
                    onChange={(e) => updateAgreementStatus(agr.id, e.target.value as Agreement['status'])}
                    className="bg-[#FAF8F4] text-[#171717] font-semibold text-xs border border-[#E8E2D9] rounded px-3 py-1.5 focus:outline-none"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Signed">Signed</option>
                  </select>
                </div>
              </div>

              <p className="text-[#77736D] leading-relaxed">{agr.summary}</p>

              <div className="bg-[#FAF8F4] p-4 rounded-lg border border-[#E8E2D9] space-y-2">
                <span className="font-semibold text-[#171717] block">Scope & Contractual Revision Terms:</span>
                <ul className="list-disc list-inside space-y-1 text-[#77736D]">
                  {agr.terms.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center text-[10px] text-neutral-400 pt-2 border-t border-[#E8E2D9]">
                <span>Sent Date: {agr.sentDate}</span>
                {agr.signedDate && <span>Signed Date: {agr.signedDate}</span>}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
