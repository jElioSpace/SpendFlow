
import React, { useState } from 'react';

interface PricePromptProps {
  itemName: string;
  defaultPrice?: number;
  onConfirm: (price: number, date: number) => void;
  onCancel: () => void;
}

const PricePrompt: React.FC<PricePromptProps> = ({ itemName, defaultPrice, onConfirm, onCancel }) => {
  const today = new Date().toISOString().split('T')[0];
  const [price, setPrice] = useState<string>(defaultPrice?.toString() || '');
  const [date, setDate] = useState<string>(today);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPrice = parseFloat(price) || 0;
    // Ensure the timestamp is set to the middle of the day in local time to avoid timezone shifts
    const selectedDate = new Date(date + 'T12:00:00').getTime();
    onConfirm(finalPrice, selectedDate);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Record Purchase</h2>
        <p className="text-gray-500 mb-6">Details for <span className="text-emerald-600 font-semibold">{itemName}</span></p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1 text-left">Price Paid</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
              <input 
                autoFocus
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all text-xl font-black text-gray-800"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1 text-left">Purchase Date</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold text-gray-700"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-95"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PricePrompt;
