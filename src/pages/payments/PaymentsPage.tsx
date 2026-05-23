import React, { useState } from 'react';
import {
  CreditCard, ArrowUpRight, ArrowDownLeft, RefreshCw,
  Wallet, TrendingUp, Clock, CheckCircle, XCircle, Plus
} from 'lucide-react';

type TransactionStatus = 'Completed' | 'Pending' | 'Failed';
type TransactionType = 'deposit' | 'withdrawal' | 'transfer';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  sender: string;
  receiver: string;
  status: TransactionStatus;
  date: string;
  note?: string;
}

const initialTransactions: Transaction[] = [
  { id: '1', type: 'deposit', amount: 50000, sender: 'Ali Khan (Investor)', receiver: 'You', status: 'Completed', date: '2024-02-15', note: 'Seed funding round 1' },
  { id: '2', type: 'transfer', amount: 15000, sender: 'You', receiver: 'Sara Ahmed', status: 'Completed', date: '2024-02-12', note: 'Deal payment' },
  { id: '3', type: 'withdrawal', amount: 8000, sender: 'You', receiver: 'Bank Account', status: 'Completed', date: '2024-02-10', note: 'Monthly withdrawal' },
  { id: '4', type: 'deposit', amount: 25000, sender: 'Zara Investments', receiver: 'You', status: 'Pending', date: '2024-02-08', note: 'Series A funding' },
  { id: '5', type: 'transfer', amount: 5000, sender: 'You', receiver: 'Ahmed Corp', status: 'Failed', date: '2024-02-05', note: 'Contract payment' },
  { id: '6', type: 'deposit', amount: 100000, sender: 'Nexus Fund', receiver: 'You', status: 'Completed', date: '2024-01-28', note: 'Investment milestone' },
];

const statusConfig = {
  Completed: { color: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} /> },
  Pending: { color: 'bg-yellow-100 text-yellow-700', icon: <Clock size={12} /> },
  Failed: { color: 'bg-red-100 text-red-700', icon: <XCircle size={12} /> },
};

const typeConfig = {
  deposit: { color: 'text-green-600', bg: 'bg-green-50', icon: <ArrowDownLeft size={16} />, label: 'Deposit' },
  withdrawal: { color: 'text-red-600', bg: 'bg-red-50', icon: <ArrowUpRight size={16} />, label: 'Withdrawal' },
  transfer: { color: 'text-blue-600', bg: 'bg-blue-50', icon: <RefreshCw size={16} />, label: 'Transfer' },
};

export const PaymentsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'fund'>('overview');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>('deposit');
  const [form, setForm] = useState({ amount: '', receiver: '', note: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Wallet balance
  const walletBalance = transactions.reduce((acc, t) => {
    if (t.status !== 'Completed') return acc;
    if (t.type === 'deposit') return acc + t.amount;
    if (t.type === 'withdrawal' || t.type === 'transfer') return acc - t.amount;
    return acc;
  }, 0);

  const totalDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'Completed').reduce((a, t) => a + t.amount, 0);
  const totalWithdrawals = transactions.filter(t => t.type === 'withdrawal' && t.status === 'Completed').reduce((a, t) => a + t.amount, 0);
  const pendingAmount = transactions.filter(t => t.status === 'Pending').reduce((a, t) => a + t.amount, 0);

  const openModal = (type: TransactionType) => {
    setModalType(type);
    setForm({ amount: '', receiver: '', note: '' });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!form.amount || isNaN(Number(form.amount))) return;
    const newTx: Transaction = {
      id: Date.now().toString(),
      type: modalType,
      amount: Number(form.amount),
      sender: modalType === 'deposit' ? (form.receiver || 'External') : 'You',
      receiver: modalType === 'deposit' ? 'You' : (form.receiver || 'Recipient'),
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      note: form.note,
    };
    setTransactions([newTx, ...transactions]);
    setShowModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Fund deal flow
  const [fundForm, setFundForm] = useState({ entrepreneur: '', amount: '', dealName: '' });
  const [fundSuccess, setFundSuccess] = useState(false);

  const handleFundDeal = () => {
    if (!fundForm.amount || !fundForm.entrepreneur) return;
    const newTx: Transaction = {
      id: Date.now().toString(),
      type: 'transfer',
      amount: Number(fundForm.amount),
      sender: 'You (Investor)',
      receiver: fundForm.entrepreneur,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      note: `Deal funding: ${fundForm.dealName}`,
    };
    setTransactions([newTx, ...transactions]);
    setFundSuccess(true);
    setFundForm({ entrepreneur: '', amount: '', dealName: '' });
    setTimeout(() => setFundSuccess(false), 3000);
  };

  const filteredTransactions = filterStatus === 'All'
    ? transactions
    : transactions.filter(t => t.status === filterStatus);

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your wallet, transactions and deals</p>
        </div>
        {showSuccess && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm">
            <CheckCircle size={16} /> Transaction submitted successfully!
          </div>
        )}
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Wallet size={18} className="opacity-80" />
              <p className="text-sm opacity-80">Wallet Balance</p>
            </div>
            <p className="text-3xl sm:text-4xl font-bold">${walletBalance.toLocaleString()}</p>
            <p className="text-xs opacity-70 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => openModal('deposit')}
              className="flex items-center gap-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              <ArrowDownLeft size={16} /> Deposit
            </button>
            <button
              onClick={() => openModal('withdrawal')}
              className="flex items-center gap-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              <ArrowUpRight size={16} /> Withdraw
            </button>
            <button
              onClick={() => openModal('transfer')}
              className="flex items-center gap-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              <RefreshCw size={16} /> Transfer
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-green-50 rounded-lg"><ArrowDownLeft size={14} className="text-green-600" /></div>
            <p className="text-xs text-gray-500">Total Deposits</p>
          </div>
          <p className="text-xl font-bold text-green-600">${totalDeposits.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-red-50 rounded-lg"><ArrowUpRight size={14} className="text-red-600" /></div>
            <p className="text-xs text-gray-500">Total Withdrawn</p>
          </div>
          <p className="text-xl font-bold text-red-600">${totalWithdrawals.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-yellow-50 rounded-lg"><Clock size={14} className="text-yellow-600" /></div>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <p className="text-xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['overview', 'history', 'fund'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition capitalize ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {tab === 'overview' ? '📊 Overview' : tab === 'history' ? '📋 History' : '🤝 Fund Deal'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Recent Transactions</h2>
            <button onClick={() => setActiveTab('history')} className="text-xs text-blue-600 hover:underline">View all</button>
          </div>
          <div className="divide-y divide-gray-50">
            {transactions.slice(0, 4).map(tx => (
              <div key={tx.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition">
                <div className={`p-2 rounded-xl ${typeConfig[tx.type].bg}`}>
                  <span className={typeConfig[tx.type].color}>{typeConfig[tx.type].icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{tx.note || typeConfig[tx.type].label}</p>
                  <p className="text-xs text-gray-400">{tx.sender} → {tx.receiver} · {tx.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 justify-end ${statusConfig[tx.status].color}`}>
                    {statusConfig[tx.status].icon} {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Transaction History</h2>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
          </div>

          {/* Table — desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Type</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Note</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Sender</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Receiver</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-1.5 ${typeConfig[tx.type].color}`}>
                        {typeConfig[tx.type].icon}
                        <span className="text-xs font-medium">{typeConfig[tx.type].label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{tx.note || '—'}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs">{tx.sender}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs">{tx.receiver}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold text-sm ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit ${statusConfig[tx.status].color}`}>
                        {statusConfig[tx.status].icon} {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards — mobile */}
          <div className="sm:hidden divide-y divide-gray-50">
            {filteredTransactions.map(tx => (
              <div key={tx.id} className="p-4 flex items-start gap-3">
                <div className={`p-2 rounded-xl flex-shrink-0 ${typeConfig[tx.type].bg}`}>
                  <span className={typeConfig[tx.type].color}>{typeConfig[tx.type].icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900">{tx.note || typeConfig[tx.type].label}</p>
                    <p className={`text-sm font-bold flex-shrink-0 ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{tx.sender} → {tx.receiver}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-gray-400">{tx.date}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${statusConfig[tx.status].color}`}>
                      {statusConfig[tx.status].icon} {tx.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fund Deal Tab */}
      {activeTab === 'fund' && (
        <div className="max-w-lg">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <TrendingUp size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Fund a Deal</h2>
                <p className="text-xs text-gray-500">Investor → Entrepreneur transfer simulation</p>
              </div>
            </div>

            {fundSuccess && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm">
                <CheckCircle size={16} /> Deal funding submitted! Status: Pending review.
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Entrepreneur Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sara Ahmed"
                  value={fundForm.entrepreneur}
                  onChange={e => setFundForm({ ...fundForm, entrepreneur: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Deal / Startup Name</label>
                <input
                  type="text"
                  placeholder="e.g. TechStart Series A"
                  value={fundForm.dealName}
                  onChange={e => setFundForm({ ...fundForm, dealName: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Investment Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={fundForm.amount}
                    onChange={e => setFundForm({ ...fundForm, amount: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Summary */}
              {fundForm.amount && fundForm.entrepreneur && (
                <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-blue-800 mb-2">Transaction Summary</p>
                  <div className="flex justify-between text-xs text-blue-700">
                    <span>From</span><span className="font-medium">You (Investor)</span>
                  </div>
                  <div className="flex justify-between text-xs text-blue-700">
                    <span>To</span><span className="font-medium">{fundForm.entrepreneur}</span>
                  </div>
                  <div className="flex justify-between text-xs text-blue-700">
                    <span>Deal</span><span className="font-medium">{fundForm.dealName || '—'}</span>
                  </div>
                  <div className="flex justify-between text-xs text-blue-700 pt-2 border-t border-blue-200">
                    <span className="font-semibold">Amount</span>
                    <span className="font-bold text-blue-900">${Number(fundForm.amount).toLocaleString()}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleFundDeal}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Submit Funding
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-5 w-full sm:max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 capitalize">
                {modalType === 'deposit' ? '💰 Deposit Funds' : modalType === 'withdrawal' ? '🏦 Withdraw Funds' : '💸 Transfer Funds'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {modalType !== 'deposit' && (
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    {modalType === 'withdrawal' ? 'Bank / Account' : 'Recipient Name'}
                  </label>
                  <input
                    type="text"
                    placeholder={modalType === 'withdrawal' ? 'e.g. HBL Bank Account' : 'e.g. Sara Ahmed'}
                    value={form.receiver}
                    onChange={e => setForm({ ...form, receiver: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              {modalType === 'deposit' && (
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Sender Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ali Khan"
                    value={form.receiver}
                    onChange={e => setForm({ ...form, receiver: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Note (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Seed funding"
                  value={form.note}
                  onChange={e => setForm({ ...form, note: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm hover:bg-blue-700 transition font-medium">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};