import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Invoice } from '../../types/portal';
import { CreditCard, CheckCircle2, DollarSign, Download, ShieldAlert, X } from 'lucide-react';

export const ClientBilling: React.FC = () => {
  const { clients, activeClientId, projects, invoices } = usePortal();

  const client = clients.find(c => c.id === activeClientId) || clients[0];
  const project = projects.find(p => p.clientId === client.id) || projects[0];
  const clientInvoices = invoices.filter(i => i.projectId === project?.id);

  const [selectedReceipt, setSelectedReceipt] = useState<Invoice | null>(null);

  if (!project) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="pb-4 border-b border-[#E8E2D9]">
        <span className="text-xs uppercase tracking-widest text-[#B99A74] font-semibold block mb-1">
          Financial Records
        </span>
        <h1 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
          Invoices & Billing
        </h1>
      </div>

      {/* Stripe Notice */}
      <div className="bg-[#FAF8F4] border border-[#B99A74]/50 rounded-xl p-4 flex items-start gap-3 text-xs text-[#171717]">
        <ShieldAlert className="w-5 h-5 text-[#B99A74] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="font-semibold block">Secure Payment Gateway Placeholder</strong>
          <p className="text-[#77736D]">
            Production billing integrates directly with Stripe Checkout for encrypted payment processing. No actual financial transactions are processed in this prototype preview.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#E8E2D9] rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#171717]">
            <thead className="bg-[#FAF8F4] border-b border-[#E8E2D9] text-[11px] uppercase tracking-wider text-[#77736D]">
              <tr>
                <th className="px-4 py-3 font-semibold">Invoice #</th>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Due Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {clientInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#FAF8F4]/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#171717]">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 font-medium text-[#171717]">{inv.title}</td>
                  <td className="px-4 py-3 font-serif-heading font-semibold text-sm">${inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-[#77736D]">{inv.dueDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedReceipt(inv)}
                      className="px-3 py-1 bg-white border border-[#E8E2D9] hover:border-[#B99A74] rounded text-xs font-medium text-[#171717]"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Styled Demonstration Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E2D9] shadow-2xl space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-[#E8E2D9]">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#B99A74] tracking-wider block">1UpSites Invoice Receipt</span>
                <h3 className="font-serif-heading text-lg font-semibold text-[#171717]">{selectedReceipt.invoiceNumber}</h3>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-neutral-400 hover:text-[#171717]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#FAF8F4] rounded-lg border border-[#E8E2D9] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#77736D]">Billed To:</span>
                  <strong className="text-[#171717]">{client.businessName} ({client.primaryContact})</strong>
                </div>
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

              <div className="flex justify-between items-center p-3 bg-[#171717] text-white rounded-lg">
                <span className="font-semibold text-xs">Total Amount Due</span>
                <span className="font-serif-heading font-semibold text-base text-[#B99A74]">${selectedReceipt.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-full py-2 bg-[#FAF8F4] border border-[#E8E2D9] rounded-lg text-xs font-medium text-[#171717]"
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
