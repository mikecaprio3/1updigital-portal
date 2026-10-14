import React from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { RoleSelectorBanner } from './components/RoleSelectorBanner';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminClients } from './components/admin/AdminClients';
import { AdminProjects } from './components/admin/AdminProjects';
import { AdminRevisions } from './components/admin/AdminRevisions';
import { AdminFinancesDocuments } from './components/admin/AdminFinancesDocuments';
import { AdminSettings } from './components/admin/AdminSettings';

// Client Components
import { ClientLayout } from './components/client/ClientLayout';
import { ClientMyWebsite } from './components/client/ClientMyWebsite';
import { ClientProjectFiles } from './components/client/ClientProjectFiles';
import { ClientDocumentsPayments } from './components/client/ClientDocumentsPayments';

const MainAppContent: React.FC = () => {
  const { role, activeAdminTab, activeClientTab } = usePortal();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#171717]">
      <RoleSelectorBanner />

      {role === 'admin' ? (
        <AdminLayout>
          {activeAdminTab === 'overview' && <AdminOverview />}
          {(activeAdminTab === 'prospects_clients' || activeAdminTab === 'clients') && <AdminClients />}
          {activeAdminTab === 'projects' && <AdminProjects />}
          {activeAdminTab === 'revisions' && <AdminRevisions />}
          {(activeAdminTab === 'finances_documents' || activeAdminTab === 'agreements' || activeAdminTab === 'invoices' || activeAdminTab === 'activity' || activeAdminTab === 'files') && <AdminFinancesDocuments />}
          {activeAdminTab === 'settings' && <AdminSettings />}
        </AdminLayout>
      ) : (
        <ClientLayout>
          {(activeClientTab === 'website' || activeClientTab === 'overview' || activeClientTab === 'revisions') && <ClientMyWebsite />}
          {activeClientTab === 'files' && <ClientProjectFiles />}
          {(activeClientTab === 'documents_payments' || activeClientTab === 'agreement' || activeClientTab === 'billing') && <ClientDocumentsPayments />}
        </ClientLayout>
      )}
    </div>
  );
};

export default function App() {
  return (
    <PortalProvider>
      <MainAppContent />
    </PortalProvider>
  );
}
