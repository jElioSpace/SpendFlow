
import React, { useState } from 'react';
import { Category, Budget } from '../types';
import { TrashIcon, PlusIcon } from './Icons';

interface SettingsManagerProps {
  categories: Category[];
  budgets: Budget[];
  onAddCategory: (name: string, color: string) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateBudget: (categoryId: string, amount: number) => void;
}

const SettingsManager: React.FC<SettingsManagerProps> = ({ categories, budgets, onAddCategory, onDeleteCategory, onUpdateBudget }) => {
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#10b981');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim(), newCatColor);
    setNewCatName('');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <h3 className="text-xl font-black text-gray-800 mb-6">Manage Categories</h3>
        <form onSubmit={handleAdd} className="flex gap-4 mb-8">
          <input 
            type="text" 
            placeholder="Category Name" 
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            className="flex-grow px-4 py-3 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input 
            type="color" 
            value={newCatColor}
            onChange={e => setNewCatColor(e.target.value)}
            className="w-12 h-12 border-none rounded-xl cursor-pointer bg-transparent"
          />
          <button type="submit" className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-100">
            <PlusIcon />
          </button>
        </form>

        <div className="space-y-3">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="font-bold text-gray-700">{cat.name}</span>
              </div>
              {!cat.id.includes('-default') && (
                <button onClick={() => onDeleteCategory(cat.id)} className="text-rose-500 p-2 hover:bg-rose-100 rounded-lg transition-colors">
                  <TrashIcon />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <h3 className="text-xl font-black text-gray-800 mb-6">Monthly Budgets</h3>
        <div className="space-y-4">
          {categories.map(cat => {
            const budget = budgets.find(b => b.categoryId === cat.id)?.amount || 0;
            return (
              <div key={cat.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="flex-grow font-bold text-gray-700">{cat.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-bold">$</span>
                  <input 
                    type="number"
                    value={budget || ''}
                    onChange={e => onUpdateBudget(cat.id, parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-24 px-3 py-2 bg-white border border-gray-100 rounded-lg text-right font-black text-gray-800 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default SettingsManager;
