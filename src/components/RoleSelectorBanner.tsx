import React from 'react';
import { usePortal } from '../context/PortalContext';
import { ShieldAlert, User, Shield, RefreshCw, Eye } from 'lucide-react';

export const RoleSelectorBanner: React.FC = () => {
  const { 
    role, setRole, 
    clients, activeClientId, setActiveClientId, 
    resetToDemoData 
  } = usePortal();

  return (
    <div className="bg-[#171717] text-[#FAF8F4] border-b border-[#B99A74]/30 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-sm select-none z-50">
      <div className="flex items-center gap-2 font-medium">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#B99A74]/20 text-[#B99A74] text-[11px] uppercase tracking-wider font-semibold border border-[#B99A74]/30">
          <Eye className="w-3 h-3" />
          Prototype Environment
        </span>
        <span className="hidden sm:inline text-neutral-400">
          1UpSites Client & Project Management Portal
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Role Switcher */}
        <div className="flex items-center bg-[#262626] p-0.5 rounded-lg border border-[#333333]">
          <button
            onClick={() => setRole('admin')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              role === 'admin' 
                ? 'bg-[#B99A74] text-[#171717] shadow-xs' 
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin View
          </button>
          <button
            onClick={() => setRole('client')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              role === 'client' 
                ? 'bg-[#B99A74] text-[#171717] shadow-xs' 
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Client View
          </button>
        </div>

        {/* Client Persona Selector when in Client Mode */}
        {role === 'client' && (
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 hidden md:inline">Viewing as:</span>
            <select
              value={activeClientId}
              onChange={(e) => setActiveClientId(e.target.value)}
              className="bg-[#262626] text-white border border-[#333333] rounded px-2 py-1 text-xs focus:outline-none focus:border-[#B99A74]"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.businessName} ({c.primaryContact})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Reset Demo Data Button */}
        <button
          onClick={() => {
            if (confirm('Reset prototype state to default sample data?')) {
              resetToDemoData();
            }
          }}
          title="Reset sample data in LocalStorage"
          className="flex items-center gap-1 text-neutral-400 hover:text-amber-300 transition-colors px-2 py-1 rounded hover:bg-white/5"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="hidden lg:inline">Reset Demo</span>
        </button>
      </div>
    </div>
  );
};
