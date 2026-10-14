import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Invoice, Agreement, ActivityLog } from '../../types/portal';
import { 
  CreditCard, FileText, ShieldAlert, CheckCircle2, Clock, 
  DollarSign, Plus, Download, Search, Filter, Activity, X, Building2
} from 'lucide-react';

export const AdminFinancesDocuments: React.FC = () => {
  const { 
    invoices, agreements, activityLogs, projects, clients, 
    addInvoice, updateInvoiceStatus, updateAgreementStatus 
  } = usePortal();

  const [activeSubtab, setActiveSubtab] = useState<'invoices' | 'agreements' | 'payments' | 'activity'>('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<Invoice | null>(null);

  // New Invoice Modal
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [targetProjectId, setTargetProjectId] = useState(projects[0]?.id || '');
  const [invoiceTitle, setInvoiceTitle] = useState('Milestone Payment');
  const [invoiceAmount, setInvoiceAmount] = useState('3500');

  // Metrics
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.amount, 0);
  const totalCollected = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const totalOutstanding = invoices.filter(i => i.status === 'Outstanding' || i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0);

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(invoiceAmount) || 1000;
    addInvoice({
      projectId: targetProjectId,
      title: invoiceTitle,
      amount: amt,
      status: 'Outstanding',
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      lineItems: [
        { description: invoiceTitle, qty: 1, unitPrice: amt, amount: amt }
      ]
    });
    setShowInvoiceModal(false);
  };

  const filteredInvoices = invoices.filter(i => {
    const proj = projects.find(p => p.id === i.projectId);
    const client = proj ? clients.find(c => c.id === proj.clientId) : null;
    const query = searchQuery.toLowerCase();
    return (
      i.invoiceNumber.toLowerCase().includes(query) ||
      i.title.toLowerCase().includes(query) ||
      (proj && proj.projectName.toLowerCase().includes(query)) ||
      (client && client.businessName.toLowerCase().includes(query))
    );
  });

  const filteredAgreements = agreements.filter(a => {
    const proj = projects.find(p => p.id === a.projectId);
    const client = proj ? clients.find(c => c.id === proj.clientId) : null;
    const query = searchQuery.toLowerCase();
    return (
      a.title.toLowerCase().includes(query) ||
      (proj && proj.projectName.toLowerCase().includes(query)) ||
      (client && client.businessName.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B99A74] font-semibold block mb-1">
            Financial & Legal Records
          </span>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
            Finances & Documents
          </h1>
        </div>

        {/* Subtab Toggle Buttons */}
        <div className="flex items-center bg-[#171717] p-1 rounded-xl shadow-2xs self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveSubtab('invoices')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeSubtab === 'invoices' ? 'bg-[#B99A74] text-[#171717]' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Invoices ({invoices.length})
          </button>
          <button
            onClick={() => setActiveSubtab('agreements')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeSubtab === 'agreements' ? 'bg-[#B99A74] text-[#171717]' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Agreements ({agreements.length})
          </button>
          <button
            onClick={() => setActiveSubtab('payments')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeSubtab === 'payments' ? 'bg-[#B99A74] text-[#171717]' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setActiveSubtab('activity')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeSubtab === 'activity' ? 'bg-[#B99A74] text-[#171717]' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Activity Audit
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#77736D]">Total Collected</span>
          <div className="font-serif-heading text-2xl font-semibold text-emerald-800">${totalCollected.toLocaleString()}</div>
          <span className="text-[11px] text-[#77736D]">Verified paid invoices</span>
        </div>

        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#77736D]">Outstanding Balance</span>
          <div className="font-serif-heading text-2xl font-semibold text-amber-800">${totalOutstanding.toLocaleString()}</div>
          <span className="text-[11px] text-[#77736D]">Awaiting client payment</span>
        </div>

        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#77736D]">Total Invoiced</span>
          <div className="font-serif-heading text-2xl font-semibold text-[#171717]">${totalInvoiced.toLocaleString()}</div>
          <span className="text-[11px] text-[#77736D]">Across all projects</span>
        </div>
      </div>

      {/* SUBTAB 1: INVOICES */}
      {activeSubtab === 'invoices' && (
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search invoices or clients..."
                className="w-full bg-white border border-[#E8E2D9] rounded-xl pl-9 pr-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#B99A74]"
              />
            </div>

            <button
              onClick={() => setShowInvoiceModal(true)}
              className="px-4 py-2 bg-[#171717] hover:bg-[#262626] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#B99A74]" />
              Create Demo Invoice
            </button>
          </div>

          <div className="bg-white border border-[#E8E2D9] rounded-2xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#171717]">
                <thead className="bg-[#FAF8F4] border-b border-[#E8E2D9] text-[11px] uppercase tracking-wider text-[#77736D]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Invoice #</th>
                    <th className="px-4 py-3 font-semibold">Client / Business</th>
                    <th className="px-4 py-3 font-semibold">Title</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Due Date</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D9]">
                  {filteredInvoices.map((inv) => {
                    const proj = projects.find(p => p.id === inv.projectId);
                    const client = proj ? clients.find(c => c.id === proj.clientId) : null;

                    return (
                      <tr key={inv.id} className="hover:bg-[#FAF8F4]/80 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-[#171717]">{inv.invoiceNumber}</td>
                        <td className="px-4 py-3 font-bold text-[#171717]">{client?.businessName || 'Business Client'}</td>
                        <td className="px-4 py-3 text-[#77736D] max-w-xs truncate">{inv.title}</td>
                        <td className="px-4 py-3 font-serif-heading font-semibold text-sm">${inv.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-[#77736D]">{inv.dueDate}</td>
                        <td className="px-4 py-3">
                          <select
                            value={inv.status}
                            onChange={(e) => updateInvoiceStatus(inv.id, e.target.value as any)}
                            className="bg-[#FAF8F4] border border-[#E8E2D9] rounded-lg px-2 py-1 font-bold text-[11px]"
                          >
                            <option value="Paid">Paid</option>
                            <option value="Outstanding">Outstanding</option>
                            <option value="Overdue">Overdue</option>
                            <option value="Draft">Draft</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedReceipt(inv)}
                            className="px-3 py-1 bg-[#171717] text-white rounded-lg font-semibold text-[11px] hover:bg-[#262626]"
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 2: AGREEMENTS */}
      {activeSubtab === 'agreements' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAgreements.map((agr) => {
              const proj = projects.find(p => p.id === agr.projectId);
              const client = proj ? clients.find(c => c.id === proj.clientId) : null;

              return (
                <div key={agr.id} className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-2xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#B99A74]">{agr.documentType}</span>
                      <h3 className="font-serif-heading text-base font-semibold text-[#171717]">{agr.title}</h3>
                      <span className="text-xs font-semibold text-[#77736D]">{client?.businessName}</span>
                    </div>

                    <select
                      value={agr.status}
                      onChange={(e) => updateAgreementStatus(agr.id, e.target.value as any)}
                      className="bg-[#FAF8F4] border border-[#E8E2D9] rounded-lg px-2 py-1 text-xs font-bold"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Signed">Signed</option>
                    </select>
                  </div>

                  <p className="text-xs text-[#77736D] leading-relaxed">{agr.summary}</p>

                  <div className="p-3 bg-[#FAF8F4] rounded-xl border border-[#E8E2D9] text-xs space-y-1">
                    <span className="font-semibold text-[#171717] block">Terms:</span>
                    <ul className="list-disc list-inside text-[#77736D] space-y-0.5 text-[11px]">
                      {agr.terms.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: PAYMENTS LOG */}
      {activeSubtab === 'payments' && (
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-2xs space-y-4 text-xs">
          <h2 className="font-serif-heading text-lg font-semibold text-[#171717]">Payments Received Log</h2>
          <div className="space-y-3">
            {invoices.filter(i => i.status === 'Paid').map(inv => {
              const proj = projects.find(p => p.id === inv.projectId);
              const client = proj ? clients.find(c => c.id === proj.clientId) : null;

              return (
                <div key={inv.id} className="p-4 bg-[#FAF8F4] border border-[#E8E2D9] rounded-xl flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-[#171717] font-mono">{inv.invoiceNumber}</strong>
                      <span>·</span>
                      <strong className="text-emerald-800 font-serif-heading text-base">${inv.amount.toLocaleString()}</strong>
                    </div>
                    <span className="text-[#77736D]">{client?.businessName} — {inv.title}</span>
                  </div>

                  <span className="text-[11px] font-mono text-neutral-500">Paid Date: {inv.paidDate || inv.issuedDate}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 4: ACTIVITY AUDIT TRAIL */}
      {activeSubtab === 'activity' && (
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-2xs space-y-4 text-xs">
          <h2 className="font-serif-heading text-lg font-semibold text-[#171717]">Agency Activity Audit History</h2>
          <div className="space-y-2">
            {activityLogs.map(log => (
              <div key={log.id} className="p-3 bg-[#FAF8F4] rounded-xl border border-[#E8E2D9] flex justify-between items-start">
                <div>
                  <span className="font-semibold text-[#171717] block">{log.title}</span>
                  <span className="text-[#77736D]">{log.description}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-neutral-400 block">{new Date(log.timestamp).toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-[#B99A74]">{log.actor} ({log.actorRole})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E2D9] shadow-2xl space-y-4">
            <h3 className="font-serif-heading text-lg font-semibold text-[#171717]">Create Demo Invoice</h3>
            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#77736D] mb-1">Target Project *</label>
                <select
                  value={targetProjectId}
                  onChange={(e) => setTargetProjectId(e.target.value)}
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl font-medium"
                >
                  {projects.map(p => {
                    const c = clients.find(cli => cli.id === p.clientId);
                    return (
                      <option key={p.id} value={p.id}>
                        {c?.businessName || p.projectName} — {p.projectName}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#77736D] mb-1">Invoice Title *</label>
                <input
                  type="text"
                  required
                  value={invoiceTitle}
                  onChange={(e) => setInvoiceTitle(e.target.value)}
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#77736D] mb-1">Amount ($) *</label>
                <input
                  type="number"
                  required
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-xl font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 border border-[#E8E2D9] rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#171717] text-white font-semibold rounded-xl">
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styled Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E2D9] shadow-2xl space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-[#E8E2D9]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#B99A74]">1UpSites Invoice Receipt</span>
                <h3 className="font-serif-heading text-lg font-semibold text-[#171717]">{selectedReceipt.invoiceNumber}</h3>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-neutral-400 hover:text-[#171717]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#FAF8F4] rounded-xl border border-[#E8E2D9] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#77736D]">Issued Date:</span>
                  <strong className="text-[#171717]">{selectedReceipt.issuedDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#77736D]">Payment Status:</span>
                  <strong className={selectedReceipt.status === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}>{selectedReceipt.status}</strong>
                </div>
              </div>

              <div>
                <span className="font-semibold text-[#171717] block mb-2">Line Items</span>
                {selectedReceipt.lineItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between p-2.5 border-b border-[#E8E2D9]">
                    <span className="text-[#171717]">{item.description}</span>
                    <span className="font-serif-heading font-semibold">${item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center p-3 bg-[#171717] text-white rounded-xl">
                <span className="font-semibold text-xs">Total Amount</span>
                <span className="font-serif-heading font-semibold text-base text-[#B99A74]">${selectedReceipt.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-full py-2 bg-[#FAF8F4] border border-[#E8E2D9] rounded-xl text-xs font-medium text-[#171717]"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
