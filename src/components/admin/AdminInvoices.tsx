import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Invoice } from '../../types/portal';
import { CreditCard, Plus, DollarSign, CheckCircle2, Clock, AlertCircle, X, ShieldAlert } from 'lucide-react';

export const AdminInvoices: React.FC = () => {
  const { invoices, projects, clients, addInvoice, updateInvoiceStatus } = usePortal();

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [title, setTitle] = useState('Final Milestone Payment — 50%');
  const [amount, setAmount] = useState('4750');

  const totalOutstanding = invoices
    .filter(i => i.status === 'Outstanding' || i.status === 'Overdue')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPaid = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount) || 1000;
    addInvoice({
      projectId,
      title,
      amount: amt,
      status: 'Outstanding',
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lineItems: [{ description: title, qty: 1, unitPrice: amt, amount: amt }]
    });
    setShowInvoiceModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B99A74] font-semibold block mb-1">
            Financial & Payment Overview
          </span>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
            Invoices & Billing
          </h1>
        </div>

        <button
          onClick={() => setShowInvoiceModal(true)}
          className="px-4 py-2 bg-[#171717] hover:bg-[#262626] text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-2 shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#B99A74]" />
          Create Demo Invoice
        </button>
      </div>

      {/* Stripe Placeholder Banner */}
      <div className="bg-[#FAF8F4] border border-[#B99A74]/50 rounded-xl p-4 flex items-start gap-3 text-xs text-[#171717]">
        <ShieldAlert className="w-5 h-5 text-[#B99A74] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="font-semibold block">Production Payment Gateway Placeholder</strong>
          <p className="text-[#77736D]">
            All transactions and invoices in this prototype demonstrate invoice generation, line-item breakdowns, and payment status updates. Production integration connects to Stripe Checkout with encrypted webhooks.
          </p>
        </div>
      </div>

      {/* Totals cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E8E2D9] shadow-2xs space-y-1">
          <span className="text-xs font-medium text-[#77736D]">Total Outstanding Balance</span>
          <div className="text-2xl font-serif-heading font-semibold text-rose-700">
            ${totalOutstanding.toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8E2D9] shadow-2xs space-y-1">
          <span className="text-xs font-medium text-[#77736D]">Total Paid to Date</span>
          <div className="text-2xl font-serif-heading font-semibold text-emerald-700">
            ${totalPaid.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white border border-[#E8E2D9] rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#171717]">
            <thead className="bg-[#FAF8F4] border-b border-[#E8E2D9] text-[11px] uppercase tracking-wider text-[#77736D]">
              <tr>
                <th className="px-4 py-3 font-semibold">Invoice #</th>
                <th className="px-4 py-3 font-semibold">Client & Project</th>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Due Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {invoices.map((inv) => {
                const proj = projects.find(p => p.id === inv.projectId);
                const client = proj ? clients.find(c => c.id === proj.clientId) : null;

                return (
                  <tr key={inv.id} className="hover:bg-[#FAF8F4]/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#171717]">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold block">{client?.businessName}</span>
                      <span className="text-[10px] text-neutral-400">{proj?.projectName}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#171717]">{inv.title}</td>
                    <td className="px-4 py-3 font-serif-heading font-semibold text-sm">${inv.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-[#77736D]">{inv.dueDate}</td>
                    <td className="px-4 py-3">
                      <select
                        value={inv.status}
                        onChange={(e) => updateInvoiceStatus(inv.id, e.target.value as Invoice['status'])}
                        className={`font-semibold text-xs border rounded px-2 py-1 focus:outline-none ${
                          inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          inv.status === 'Outstanding' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        <option value="Outstanding">Outstanding</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-[#E8E2D9] shadow-2xl space-y-4">
            <h3 className="font-serif-heading text-lg font-semibold text-[#171717]">Create Demo Invoice</h3>
            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#77736D] mb-1">Project</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full p-2 border border-[#E8E2D9] rounded focus:border-[#B99A74] focus:outline-none"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.projectName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#77736D] mb-1">Invoice Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-[#E8E2D9] rounded focus:border-[#B99A74] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#77736D] mb-1">Amount ($)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border border-[#E8E2D9] rounded focus:border-[#B99A74] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-3 py-1.5 border border-[#E8E2D9] rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-[#171717] text-white rounded font-medium">
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
