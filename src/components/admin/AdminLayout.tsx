import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { NewProspectProjectModal } from './NewProspectProjectModal';
import { 
  LayoutDashboard, Users, FolderKanban, RotateCcw, 
  CreditCard, Settings, Menu, X, Plus, Sparkles, UserPlus
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { 
    activeAdminTab, setActiveAdminTab, 
    revisions, invoices, projects, clients 
  } = usePortal();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNewProspectModal, setShowNewProspectModal] = useState(false);

  // Counts for badge notifications derived from real records
  const prospectFollowUpCount = clients.filter(c => 
    c.status === 'Prospect' || c.status === 'Demo in Progress' || c.status === 'Demo Sent' || c.status === 'Follow-Up'
  ).length;
  
  const activeProjectsCount = projects.filter(p => p.phase !== 'Completed').length;
  const openRevisionsCount = revisions.filter(r => r.status !== 'Approved').length;
  const outstandingInvoicesCount = invoices.filter(i => i.status === 'Outstanding' || i.status === 'Overdue').length;

  // 6 Primary Sidebar Destinations as requested by Section 1
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'prospects_clients', label: 'Prospects & Clients', icon: Users, badge: prospectFollowUpCount },
    { id: 'projects', label: 'Projects', icon: FolderKanban, badge: activeProjectsCount },
    { id: 'revisions', label: 'Revisions', icon: RotateCcw, badge: openRevisionsCount },
    { id: 'finances_documents', label: 'Finances & Documents', icon: CreditCard, badge: outstandingInvoicesCount },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <header className="bg-[#171717] text-white border-b border-[#333333] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-300 hover:text-white focus:outline-none"
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
                <span className="font-serif-heading font-semibold tracking-wide text-lg text-white block leading-none">
                  1UpSites
                </span>
                <span className="text-[10px] text-[#B99A74] tracking-widest uppercase font-medium">
                  Agency Command Center
                </span>
              </div>
            </div>
          </div>

          {/* Action & Admin Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewProspectModal(true)}
              className="px-3.5 py-1.5 bg-[#B99A74] hover:bg-[#a3835e] text-[#171717] text-xs font-semibold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">New Prospect / Project</span>
              <span className="sm:hidden">New</span>
            </button>

            <div className="h-4 w-px bg-neutral-800 hidden sm:block"></div>

            <div className="text-right hidden sm:block">
              <span className="text-xs font-semibold text-white block">Solo Agency Owner</span>
              <span className="text-[10px] text-[#B99A74] block">1UpSites Website Design</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-8">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-22 space-y-6">
            
            {/* Primary Action Button */}
            <button
              onClick={() => setShowNewProspectModal(true)}
              className="w-full py-3 px-4 bg-[#171717] hover:bg-[#262626] text-[#B99A74] border border-[#B99A74]/40 text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 group"
            >
              <Plus className="w-4 h-4 text-[#B99A74] group-hover:scale-110 transition-transform" />
              <span>New Prospect / Project</span>
            </button>

            {/* 6 Primary Nav Links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeAdminTab === item.id || 
                  (activeAdminTab === 'clients' && item.id === 'prospects_clients') ||
                  (activeAdminTab === 'invoices' && item.id === 'finances_documents') ||
                  (activeAdminTab === 'agreements' && item.id === 'finances_documents') ||
                  (activeAdminTab === 'activity' && item.id === 'finances_documents');

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveAdminTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive 
                        ? 'bg-[#171717] text-white shadow-xs font-semibold' 
                        : 'text-[#77736D] hover:text-[#171717] hover:bg-[#FAF8F4] border border-transparent hover:border-[#E8E2D9]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#B99A74]' : 'text-neutral-500'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-[#B99A74] text-[#171717]' : 'bg-neutral-200 text-neutral-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 lg:hidden flex">
            <div className="w-64 bg-[#171717] text-white h-full p-4 space-y-6 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#333333] mb-4">
                  <span className="font-serif-heading font-semibold text-lg text-[#B99A74]">1UpSites Admin</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-neutral-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowNewProspectModal(true);
                  }}
                  className="w-full py-2.5 mb-4 bg-[#B99A74] text-[#171717] text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Prospect / Project</span>
                </button>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeAdminTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveAdminTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive ? 'bg-[#B99A74] text-[#171717]' : 'text-neutral-300 hover:bg-[#262626]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-800 text-amber-300">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-[#333333] text-[11px] text-neutral-400">
                1UpSites Agency Command Center
              </div>
            </div>
          </div>
        )}

        {/* Central Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>

      {/* Global Unified New Prospect / Project Setup Modal */}
      <NewProspectProjectModal
        isOpen={showNewProspectModal}
        onClose={() => setShowNewProspectModal(false)}
      />

    </div>
  );
};
