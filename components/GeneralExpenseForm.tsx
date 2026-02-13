
import React, { useState } from 'react';
import { Category } from '../types';

interface GeneralExpenseFormProps {
  categories: Category[];
  onAdd: (expense: { name: string, amount: number, categoryId: string, note: string, date: number }) => void;
}

const GeneralExpenseForm: React.FC<GeneralExpenseFormProps> = ({ categories, onAdd }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !categoryId) return;
    onAdd({
      name,
      amount: parseFloat(amount),
      categoryId,
      note,
      date: Date.now()
    });
    setName('');
    setAmount('');
    setNote('');
  };

  return (
    <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8 animate-in zoom-in-95 duration-300">
      <h2 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-tighter">Quick Log Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">What did you buy?</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Starbucks, Uber, Rent..." 
              className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">How much?</label>
            <input 
              type="number" 
              step="0.01"
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              placeholder="0.00" 
              className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-black"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Category</label>
            <select 
              value={categoryId} 
              onChange={e => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-gray-700"
            >
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Notes (Optional)</label>
            <input 
              type="text" 
              value={note} 
              onChange={e => setNote(e.target.value)} 
              placeholder="Add more detail..." 
              className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <button 
          type="submit"
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-100 transition-all active:scale-[0.98] mt-2"
        >
          Save Expense
        </button>
      </form>
    </section>
  );
};

export default GeneralExpenseForm;
