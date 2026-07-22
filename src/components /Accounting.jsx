// src/components/Accounting.jsx
import React, { useState } from 'react';

export default function Accounting() {
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'income', title: 'ขายปลาหมอ/ปลาดุก', amount: 1500, date: '2026-04-20' },
    { id: 2, type: 'expense', title: 'ค่าอาหารสัตว์', amount: 800, date: '2026-04-19' }
  ]);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');

  const addTransaction = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newTx = {
      id: Date.now(),
      type,
      title,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0]
    };

    setTransactions([newTx, ...transactions]);
    setTitle('');
    setAmount('');
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="p-4 bg-gray-50 min-h-screen text-gray-800">
      <h1 className="text-2xl font-bold text-green-700 mb-4">💰 บัญชีฟาร์ม</h1>

      {/* สรุปยอดเงิน */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
          <p className="text-xs text-gray-400">รายรับรวม</p>
          <p className="text-xl font-bold text-green-600">+{totalIncome} ฿</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-red-100">
          <p className="text-xs text-gray-400">รายจ่ายรวม</p>
          <p className="text-xl font-bold text-red-600">-{totalExpense} ฿</p>
        </div>
      </div>

      {/* ฟอร์มบันทึกรายการ */}
      <form onSubmit={addTransaction} className="bg-white p-4 rounded-xl shadow-sm mb-6 space-y-3">
        <h3 className="font-semibold text-gray-700">✍️ บันทึกรายการใหม่</h3>
        <div>
          <label className="text-xs text-gray-500">ประเภท</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg text-sm bg-white"
          >
            <option value="income">รายรับ (Income)</option>
            <option value="expense">รายจ่าย (Expense)</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">รายการ</label>
          <input 
            type="text" 
            placeholder="เช่น ค่าปุ๋ย, ขายผลผลิต" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">จำนวนเงิน (บาท)</label>
          <input 
            type="number" 
            placeholder="0.00" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg text-sm"
          />
        </div>
        <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-lg font-medium text-sm">
          บันทึกข้อมูล
        </button>
      </form>

      {/* ประวัติรายการ */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-3">📋 ประวัติล่าสุด</h3>
        <div className="space-y-2">
          {transactions.map(t => (
            <div key={t.id} className="flex justify-between items-center p-2 border-b text-sm">
              <div>
                <p className="font-medium">{t.title}</p>
                <p className="text-xs text-gray-400">{t.date}</p>
              </div>
              <p className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {t.type === 'income' ? '+' : '-'}{t.amount} ฿
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
