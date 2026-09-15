import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { CreditCard, Copy, Check, Download, CheckCircle2 } from 'lucide-react';

export const StudentPayment: React.FC = () => {
  const { feeRecords, showToast, currentUser } = useLMS();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    showToast('Voucher ID copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadReceipt = (voucherId: string) => {
    showToast(`Downloading official fee receipt for voucher #${voucherId}...`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-blue-200">
            Tuition & Lab Dues Status
          </span>
          <h2 className="text-xl sm:text-2xl font-bold mt-1">All Dues Cleared</h2>
          <p className="text-xs text-blue-100 mt-1 max-w-md">
            Your monthly laboratory and instructional subsidies are fully up to date for the 2026 academic semester.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-xl text-center self-start sm:self-auto">
          <span className="text-[11px] uppercase font-semibold text-blue-100 block">Total Paid (2026)</span>
          <span className="text-2xl font-black">Rs: 4,000 /-</span>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-base">Fee History & Vouchers</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Student: {currentUser.name} ({currentUser.rollNumber})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/50 text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Month</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Voucher ID</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {feeRecords.map((fee) => (
                <tr key={fee.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-6 font-semibold text-slate-900">{fee.month}</td>
                  <td className="py-4 px-4 font-bold text-slate-800">Rs: {fee.amount} /-</td>
                  <td className="py-4 px-4 text-slate-600">{fee.type}</td>
                  <td className="py-4 px-4 text-slate-600">{fee.dueDate}</td>
                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-2 font-mono text-slate-800 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                      <span>{fee.voucherId}</span>
                      <button
                        onClick={() => handleCopy(fee.voucherId)}
                        className="text-slate-400 hover:text-slate-600 transition"
                      >
                        {copiedId === fee.voucherId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md font-bold text-[11px] uppercase tracking-wider">
                      {fee.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDownloadReceipt(fee.voucherId)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
