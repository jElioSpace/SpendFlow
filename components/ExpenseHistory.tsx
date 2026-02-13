
import React, { useState } from 'react';
import { Expense, Category } from '../types';
import { TrashIcon } from './Icons';

interface ExpenseHistoryProps {
  expenses: Expense[];
  categories: Category[];
  onDelete: (id: string) => void;
}

const ExpenseHistory: React.FC<ExpenseHistoryProps> = ({ expenses, categories, onDelete }) => {
  const [filterText, setFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState<'date' | 'amount'>('date');

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(filterText.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || e.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortOrder === 'date') return b.date - a.date;
    return b.amount - a.amount;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <input 
          type="text"
          placeholder="Search descriptions..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="w-full md:flex-grow px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
        />
        <select 
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="w-full md:w-48 px-4 py-3 bg-gray-50 rounded-xl outline-none font-bold text-gray-700"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <button 
          onClick={() => setSortOrder(prev => prev === 'date' ? 'amount' : 'date')}
          className="w-full md:w-auto px-6 py-3 bg-emerald-50 text-emerald-600 font-bold rounded-xl whitespace-nowrap"
        >
          Sort by {sortOrder === 'date' ? 'Amount' : 'Date'}
        </button>
      </div>

      <div className="space-y-3">
        {filteredExpenses.map(expense => {
          const cat = categories.find(c => c.id === expense.categoryId);
          return (
            <div key={expense.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white" style={{ backgroundColor: cat?.color || '#cbd5e1' }}>
                {cat?.name.charAt(0)}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-800 truncate">{expense.name}</h4>
                  <span className="text-[9px] font-black uppercase text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                    {cat?.name || 'Other'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                   <span>{new Date(expense.date).toLocaleDateString()}</span>
                   {expense.note && <span>• {expense.note}</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-lg text-gray-900">${expense.amount.toFixed(2)}</div>
                <button 
                  onClick={() => onDelete(expense.id)}
                  className="text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-rose-50 rounded"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          );
        })}

        {filteredExpenses.length === 0 && (
           <div className="py-20 text-center text-gray-400 italic">No expenses found matching your filters.</div>
        )}
      </div>
    </div>
  );
};

export default ExpenseHistory;
