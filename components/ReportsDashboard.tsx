
import React, { useState } from 'react';
import { Expense, Category, Budget } from '../types';

interface ReportsDashboardProps {
  expenses: Expense[];
  categories: Category[];
  budgets: Budget[];
  translations: any;
}

const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ expenses, categories, budgets, translations }) => {
  const [reportText, setReportText] = useState<string | null>(null);
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const categorySpending = categories.map(cat => {
    const spent = currentMonthExpenses
      .filter(e => e.category_id === cat.id)
      .reduce((acc, curr) => acc + curr.amount, 0);
    const budget = budgets.find(b => b.category_id === cat.id)?.amount || 0;
    return { ...cat, spent, budget };
  });

  const totalSpent = currentMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const grocerySpent = currentMonthExpenses
    .filter(e => e.category_id === 'groceries-default')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Pie Chart Logic
  const chartData = categorySpending
    .filter(c => c.spent > 0)
    .sort((a, b) => b.spent - a.spent);

  let cumulativePercent = 0;

  function getCoordinatesForPercent(percent: number) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  }

  const generateReport = () => {
    const monthName = now.toLocaleString('default', { month: 'long' });
    let text = `${translations.monthlyReportTitle} - ${monthName} ${currentYear}\n`;
    text += `--------------------------------\n`;
    text += `${translations.monthlyTotal}: $${totalSpent.toFixed(2)}\n\n`;
    text += `${translations.breakdownByCat}:\n`;
    
    chartData.forEach(cat => {
      text += `- ${cat.name}: $${cat.spent.toFixed(2)}\n`;
    });

    text += `\n${translations.generatedVia} SpendFlow`;
    setReportText(text);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-black text-gray-800">{translations.stats}</h2>
        <button 
          onClick={generateReport}
          className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-100 active:scale-95 transition-all"
        >
          {translations.generateReport}
        </button>
      </div>

      {reportText && (
        <div className="bg-indigo-900 text-indigo-100 p-6 rounded-[2rem] shadow-xl animate-in zoom-in-95 duration-300 relative">
          <button 
            onClick={() => setReportText(null)}
            className="absolute top-4 right-4 text-indigo-300 hover:text-white"
          >
            ✕
          </button>
          <pre className="whitespace-pre-wrap font-mono text-xs">{reportText}</pre>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(reportText);
              alert(translations.copiedToClipboard);
            }}
            className="mt-4 w-full py-2 bg-indigo-700 hover:bg-indigo-600 rounded-xl text-xs font-bold transition-all"
          >
            {translations.copyReport}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{translations.monthlyTotal}</p>
          <p className="text-3xl font-black text-emerald-600">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{translations.groceryShare}</p>
          <p className="text-3xl font-black text-indigo-600">${grocerySpent.toFixed(2)}</p>
          <p className="text-[10px] text-gray-400 mt-1">{((grocerySpent / totalSpent || 0) * 100).toFixed(1)}% {translations.ofTotal}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{translations.otherExpenses}</p>
          <p className="text-3xl font-black text-rose-500">${(totalSpent - grocerySpent).toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="text-xl font-black text-gray-800 mb-6 self-start">{translations.spendingBreakdown}</h3>
          {totalSpent > 0 ? (
            <div className="relative w-64 h-64">
              <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full">
                {chartData.map((cat, index) => {
                  const percent = cat.spent / totalSpent;
                  const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
                  cumulativePercent += percent;
                  const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
                  const largeArcFlag = percent > 0.5 ? 1 : 0;
                  const pathData = [
                    `M ${startX} ${startY}`,
                    `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                    `L 0 0`,
                  ].join(' ');

                  return (
                    <path
                      key={cat.id}
                      d={pathData}
                      fill={cat.color}
                      className="transition-all hover:opacity-80 cursor-pointer"
                    >
                      <title>{cat.name}: ${cat.spent.toFixed(2)}</title>
                    </path>
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                   <span className="text-[10px] font-bold text-gray-400 uppercase">{translations.totalShort}</span>
                   <span className="text-lg font-black text-gray-800">${totalSpent.toFixed(0)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 italic">{translations.noData}</div>
          )}
          
          <div className="mt-8 grid grid-cols-2 gap-2 w-full">
            {chartData.map(cat => (
              <div key={cat.id} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-[10px] font-bold text-gray-700 truncate">{cat.name}</span>
                <span className="text-[10px] font-black text-gray-900 ml-auto">${cat.spent.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-gray-800 mb-6">{translations.budgetOverview}</h3>
          <div className="space-y-6">
            {categorySpending.filter(c => c.budget > 0 || c.spent > 0).map(cat => (
              <div key={cat.id}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="text-sm font-bold text-gray-800">{cat.name}</span>
                    <span className="text-xs text-gray-400 ml-2">${cat.spent.toFixed(0)} {translations.spentShort}</span>
                  </div>
                  <span className="text-xs font-black text-gray-500">${cat.budget.toFixed(0)} {translations.budgetShort}</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${cat.spent > cat.budget && cat.budget > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ 
                      width: `${Math.min((cat.spent / (cat.budget || 1)) * 100, 100)}%`, 
                      backgroundColor: cat.spent <= cat.budget ? cat.color : undefined 
                    }}
                  />
                </div>
                {cat.spent > cat.budget && cat.budget > 0 && (
                  <p className="text-[10px] text-rose-500 font-bold mt-1 uppercase tracking-tighter">{translations.overBudgetBy} ${(cat.spent - cat.budget).toFixed(2)}</p>
                )}
              </div>
            ))}
            {categorySpending.filter(c => c.budget > 0 || c.spent > 0).length === 0 && (
              <div className="py-12 text-center text-gray-400 italic">{translations.noBudgetsSet}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
