import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  Monitor, FolderOpen, FileText, Menu, X, Sparkles 
} from 'lucide-react';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const { 
    clients, activeClientId, 
    activeClientTab, setActiveClientTab,
    projects, revisions 
  } = usePortal();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const client = clients.find(c => c.id === activeClientId) || clients[0];
  const clientProject = projects.find(p => p.clientId === client.id) || projects[0];
  const openRevisionsCount = revisions.filter(r => r.projectId === clientProject?.id && r.status !== 'Approved').length;

  const navItems = [
    { id: 'website', label: 'My Website', icon: Monitor, badge: openRevisionsCount },
    { id: 'files', label: 'Project Files', icon: FolderOpen },
    { id: 'documents_payments', label: 'Documents & Payments', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col font-sans">
      
      {/* Top Client Header */}
      <header className="bg-[#171717] text-white border-b border-[#333333] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Client Welcome */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-2.5">
              <img 
                src="/logo1.png" 
                alt="1UpSites Logo" 
                className="h-8 w-auto max-w-[130px] object-contain shrink-0" 
              />
              <div>
                <span className="font-serif-heading font-semibold tracking-wide text-base text-white block leading-none">
                  1UpSites Client Portal
                </span>
                <span className="text-[10px] text-[#B99A74] tracking-widest uppercase font-medium">
                  {client?.businessName || 'Client Workspace'}
                </span>
              </div>
            </div>
          </div>

          {/* Client Avatar / Name */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-semibold text-white block">{client?.primaryContact}</span>
              <span className="text-[10px] text-neutral-400 block">{client?.email}</span>
            </div>
            {client?.avatarUrl ? (
              <img src={client.avatarUrl} alt={client.primaryContact} className="w-8 h-8 rounded-full object-cover border border-[#B99A74]" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#B99A74] text-[#171717] font-bold flex items-center justify-center text-xs">
                {client?.primaryContact?.charAt(0) || 'C'}
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Simplified 3-Tab Secondary Navigation Subbar */}
      <div className="bg-white border-b border-[#E8E2D9] shadow-2xs sticky top-16 z-30 hidden md:block">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeClientTab === item.id || (activeClientTab === 'overview' && item.id === 'website');
            return (
              <button
                key={item.id}
                onClick={() => setActiveClientTab(item.id)}
                className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                  isActive 
                    ? 'border-[#B99A74] text-[#171717] bg-[#FAF8F4]/50' 
                    : 'border-transparent text-[#77736D] hover:text-[#171717]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#B99A74]' : 'text-neutral-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    {item.badge} open
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden flex">
          <div className="w-72 bg-[#171717] text-white h-full p-5 space-y-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#333333] mb-4">
                <span className="font-serif-heading font-semibold text-[#B99A74]">1UpSites Client Portal</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-neutral-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeClientTab === item.id || (activeClientTab === 'overview' && item.id === 'website');
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveClientTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold ${
                        isActive ? 'bg-[#B99A74] text-[#171717]' : 'text-neutral-300 hover:bg-[#262626]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-950">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#333333] text-[11px] text-neutral-400">
              1UpSites — Level up your online presence.
            </div>
          </div>
        </div>
      )}

      {/* Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

    </div>
  );
};
