
import React, { useState, useEffect } from 'react';
import { GroceryItem, SmartSuggestion, AppView, Category, Expense, Budget, Language } from './types';
import { PlusIcon, EditIcon, SparklesIcon, ListIcon, ReceiptIcon, ChartIcon, SettingsIcon, GlobeIcon, UserIcon, InfoIcon } from './components/Icons';
import GroceryItemCard from './components/GroceryItemCard';
import SmartSuggestionsPanel from './components/SmartSuggestionsPanel';
import ExpenseHistory from './components/ExpenseHistory';
import PricePrompt from './components/PricePrompt';
import ReportsDashboard from './components/ReportsDashboard';
import SettingsManager from './components/SettingsManager';
import GeneralExpenseForm from './components/GeneralExpenseForm';
import { getSmartSuggestions, autoCategorize } from './services/geminiService';
import { supabase } from './services/supabaseClient';
import { Auth } from './components/Auth';

const TRANSLATIONS = {
  en: {
    spend: 'Spend',
    list: 'List',
    stats: 'Stats',
    setup: 'Setup',
    groceryList: 'Grocery List',
    expenses: 'Expenses',
    quickLog: 'Quick Log Expense',
    monthlyTotal: 'Monthly Total',
    groceryShare: 'Grocery Share',
    ofTotal: 'of total',
    otherExpenses: 'Other Expenses',
    spendingBreakdown: 'Spending Breakdown',
    budgetOverview: 'Budget Overview',
    generateReport: 'Generate Report',
    monthlyReportTitle: 'Monthly Expense Report',
    breakdownByCat: 'Breakdown by Category',
    generatedVia: 'Generated via',
    copiedToClipboard: 'Report copied to clipboard!',
    copyReport: 'Copy Report',
    noData: 'No spending data yet',
    spentShort: 'spent',
    budgetShort: 'budget',
    overBudgetBy: 'Over budget by',
    noBudgetsSet: 'Set budgets in Settings to track progress',
    totalShort: 'Total',
    logout: 'Logout',
    profile: 'Profile',
    accountSettings: 'Account Settings',
    signedInAs: 'Signed in as',
    appInfo: 'App Info',
    aboutTitle: 'About SpendFlow',
    aboutDesc: 'Manage what to buy and track what you spend — all in one place.',
    keyFeatures: 'Key Features',
    features: [
      "Add and manage grocery items with optional notes.",
      "Mark items as purchased and record actual price.",
      "Automatic expense creation from grocery purchases.",
      "Track all personal expenses beyond groceries.",
      "Custom expense categories.",
      "Expense history with filtering and search.",
      "Spending summaries and reports.",
      "Budget tracking and spending insights.",
      "Persistent data storage."
    ],
    poweredBy: "Powered by jElio ⚡"
  },
  mm: {
    spend: 'အသုံးစရိတ်',
    list: 'ကုန်စုံစာရင်း',
    stats: 'အစီရင်ခံစာ',
    setup: 'ဆက်တင်များ',
    groceryList: 'ကုန်စုံဝယ်ယူရန်စာရင်း',
    expenses: 'အသုံးစရိတ်မှတ်တမ်း',
    quickLog: 'အသုံးစရိတ်အသစ်ထည့်ရန်',
    monthlyTotal: 'တစ်လတာ စုစုပေါင်း',
    groceryShare: 'ကုန်စုံဖိုး ဝေစု',
    ofTotal: '၏ စုစုပေါင်း',
    otherExpenses: 'အခြား အသုံးစရိတ်များ',
    spendingBreakdown: 'အသုံးစရိတ် ခွဲခြမ်းစိတ်ဖြာချက်',
    budgetOverview: 'ဘတ်ဂျက် အခြေအနေ',
    generateReport: 'အစီရင်ခံစာ ထုတ်ရန်',
    monthlyReportTitle: 'လစဉ် အသုံးစရိတ် အစီရင်ခံစာ',
    breakdownByCat: 'ကဏ္ဍအလိုက် ခွဲခြမ်းချက်',
    generatedVia: 'မှ ထုတ်ပေးသည်',
    copiedToClipboard: 'အစီရင်ခံစာကို ကူးယူပြီးပါပြီ!',
    copyReport: 'အစီရင်ခံစာကို ကူးယူရန်',
    noData: 'အချက်အလက် မရှိသေးပါ',
    spentShort: 'သုံးပြီး',
    budgetShort: 'ဘတ်ဂျက်',
    overBudgetBy: 'ဘတ်ဂျက်ကျော်လွန်မှု -',
    noBudgetsSet: 'ဆက်တင်တွင် ဘတ်ဂျက်များ သတ်မှတ်ပေးပါ',
    totalShort: 'စုစုပေါင်း',
    logout: 'ထွက်ရန်',
    profile: 'ပရိုဖိုင်',
    accountSettings: 'အကောင့် ဆက်တင်များ',
    signedInAs: 'အကောင့်ဝင်ထားသူ -',
    appInfo: 'အက်ပ်အကြောင်း',
    aboutTitle: 'SpendFlow အကြောင်း',
    aboutDesc: 'ဝယ်ယူရန်စာရင်းနှင့် အသုံးစရိတ်များကို တစ်နေရာတည်းတွင် စီမံခန့်ခွဲပါ။',
    keyFeatures: 'အဓိက လုပ်ဆောင်ချက်များ',
    features: [
      "ကုန်စုံစာရင်းများ ထည့်သွင်းစီမံနိုင်သည်။",
      "ဝယ်ယူပြီးပါက ဈေးနှုန်းမှတ်တမ်းတင်နိုင်သည်။",
      "အလိုအလျောက် အသုံးစရိတ်စာရင်းသို့ ထည့်ပေးသည်။",
      "အခြား အသုံးစရိတ်များကိုလည်း မှတ်တမ်းတင်နိုင်သည်။",
      "စိတ်ကြိုက် ကဏ္ဍများ သတ်မှတ်နိုင်သည်။",
      "မှတ်တမ်းများကို ရှာဖွေစစ်ဆေးနိုင်သည်။",
      "အသုံးစရိတ် အစီရင်ခံစာများ ကြည့်နိုင်သည်။",
      "ဘတ်ဂျက် သတ်မှတ်ချက်များကို စစ်ဆေးနိုင်သည်။",
      "အချက်အလက်များကို သိမ်းဆည်းပေးထားသည်။"
    ],
    poweredBy: "jElio ⚡ မှ ပံ့ပိုးသည်"
  }
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'groceries-default', name: 'Groceries', color: '#10b981' },
  { id: 'dining-default', name: 'Food & Dining', color: '#f59e0b' },
  { id: 'transport-default', name: 'Transport', color: '#3b82f6' },
  { id: 'bills-default', name: 'Bills', color: '#ef4444' },
  { id: 'shopping-default', name: 'Shopping', color: '#8b5cf6' },
  { id: 'other-default', name: 'Other', color: '#64748b' }
];

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  
  const [currentView, setCurrentView] = useState<AppView>('expenses');
  const [lang, setLang] = useState<Language>('en');
  const [showProfile, setShowProfile] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const [nameInput, setNameInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showNotification, setShowNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [pricePromptItem, setPricePromptItem] = useState<GroceryItem | null>(null);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    const fetchData = async () => {
      const [listRes, expRes, catRes, budRes] = await Promise.all([
        supabase.from('grocery_items').select('*').order('created_at', { ascending: false }),
        supabase.from('expenses').select('*').order('date', { ascending: false }),
        supabase.from('categories').select('*'),
        supabase.from('budgets').select('*')
      ]);
      if (listRes.data) setItems(listRes.data);
      if (expRes.data) setExpenses(expRes.data);
      if (catRes.data && catRes.data.length > 0) setCategories([...DEFAULT_CATEGORIES, ...catRes.data]);
      if (budRes.data) setBudgets(budRes.data);
    };
    fetchData();
    const channels = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'grocery_items' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'budgets' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, fetchData)
      .subscribe();
    return () => { supabase.removeChannel(channels); };
  }, [session]);

  const triggerNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setShowNotification({ message, type });
    setTimeout(() => setShowNotification(null), 3000);
  };

  const handleAddItem = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!nameInput.trim() || !session) return;
    const estPrice = parseFloat(priceInput) || null;
    if (editingId) {
      const { error } = await supabase.from('grocery_items').update({ 
        name: nameInput.trim(), note: noteInput.trim(), estimated_price: estPrice 
      }).eq('id', editingId);
      if (!error) { setEditingId(null); triggerNotification('Item updated'); }
    } else {
      const { data, error } = await supabase.from('grocery_items').insert([{
        name: nameInput.trim(), note: noteInput.trim(), estimated_price: estPrice, user_id: session.user.id
      }]).select();
      if (data && !error) {
        triggerNotification(`Added ${nameInput}`);
        autoCategorize(nameInput).then(async (cat) => {
          await supabase.from('grocery_items').update({ category: cat }).eq('id', data[0].id);
        });
      }
    }
    setNameInput(''); setNoteInput(''); setPriceInput('');
  };

  const handleConfirmPurchase = async (actualPrice: number, purchaseDate: number) => {
    if (!pricePromptItem || !session) return;
    await supabase.from('expenses').insert([{
      name: pricePromptItem.name, amount: actualPrice, date: purchaseDate, category_id: 'groceries-default',
      note: pricePromptItem.note, linked_grocery_id: pricePromptItem.id, user_id: session.user.id
    }]);
    await supabase.from('grocery_items').update({ 
      is_purchased: true, actual_price: actualPrice, purchased_at: purchaseDate 
    }).eq('id', pricePromptItem.id);
    setPricePromptItem(null);
    triggerNotification(`Logged $${actualPrice.toFixed(2)} in Groceries`);
  };

  const handleAddGeneralExpense = async (data: { name: string, amount: number, category_id: string, note: string, date: number }) => {
    if (!session) return;
    await supabase.from('expenses').insert([{ ...data, user_id: session.user.id }]);
    triggerNotification('Expense recorded');
  };

  const addFromSuggestion = async (name: string) => {
    if (!session) return;
    const { data } = await supabase.from('grocery_items').insert([{ name, user_id: session.user.id }]).select();
    if (data) {
      setSuggestions(prev => prev.filter(s => s.name !== name));
      triggerNotification(`Added ${name}`);
      autoCategorize(name).then(async (cat) => {
        await supabase.from('grocery_items').update({ category: cat }).eq('id', data[0].id);
      });
    }
  };

  if (!session) return <Auth />;

  const activeItems = items.filter(i => !i.is_purchased);

  return (
    <div className="min-h-screen pb-32 bg-[#F8FAFC]">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('expenses')}>
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-200">S</div>
            <h1 className="text-xl font-black text-gray-800 tracking-tight hidden sm:block">SpendFlow</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
             {/* Desktop Navigation */}
             <div className="hidden md:flex bg-gray-100 p-1 rounded-xl">
                {[
                  { id: 'expenses', icon: <ReceiptIcon />, label: t.spend },
                  { id: 'list', icon: <ListIcon />, label: t.list },
                  { id: 'reports', icon: <ChartIcon />, label: t.stats },
                  { id: 'settings', icon: <SettingsIcon />, label: t.setup }
                ].map(v => (
                  <button 
                    key={v.id}
                    onClick={() => setCurrentView(v.id as AppView)}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 text-xs font-bold ${currentView === v.id ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400'}`}
                  >
                    {v.icon} <span>{v.label}</span>
                  </button>
                ))}
             </div>
             
             <div className="h-6 w-[1px] bg-gray-100 hidden md:block" />

             {/* Language Toggle */}
             <button 
               onClick={() => setLang(lang === 'en' ? 'mm' : 'en')}
               className="flex items-center gap-1 p-2 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-500 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100"
               title="Change Language"
             >
               <GlobeIcon />
               <span className="text-[10px] font-black uppercase tracking-tighter">{lang === 'en' ? 'EN' : 'MM'}</span>
             </button>

             {/* Profile Management */}
             <button 
               onClick={() => setShowProfile(!showProfile)}
               className={`p-2 rounded-xl transition-all ${showProfile ? 'bg-emerald-500 text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-emerald-50'}`}
               title={t.profile}
             >
               <UserIcon />
             </button>

             {/* App Info */}
             <button 
               onClick={() => setShowInfo(true)}
               className="p-2 bg-gray-50 text-gray-500 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all"
               title={t.appInfo}
             >
               <InfoIcon />
             </button>
          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowProfile(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-slide-up">
            <h3 className="text-xl font-black text-gray-800 mb-2">{t.accountSettings}</h3>
            <div className="bg-gray-50 p-4 rounded-2xl mb-6">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.signedInAs}</p>
              <p className="text-sm font-bold text-gray-700 truncate">{session.user.email}</p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => supabase.auth.signOut()}
                className="w-full py-4 bg-rose-50 text-rose-600 font-bold rounded-2xl hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                {t.logout}
              </button>
              <button 
                onClick={() => setShowProfile(false)}
                className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowInfo(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl animate-slide-up my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-emerald-200">S</div>
               <div>
                  <h3 className="text-2xl font-black text-gray-800">{t.aboutTitle}</h3>
                  <p className="text-sm font-bold text-emerald-600">v1.0.0</p>
               </div>
            </div>
            <p className="text-gray-500 font-medium leading-relaxed mb-8">
              {t.aboutDesc}
            </p>
            
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">{t.keyFeatures}</h4>
            <div className="grid grid-cols-1 gap-3 mb-10">
               {t.features.map((f: string, idx: number) => (
                 <div key={idx} className="flex gap-3 items-start bg-gray-50 p-3 rounded-xl">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                       <PlusIcon />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 leading-tight">{f}</span>
                 </div>
               ))}
            </div>

            <div className="text-center">
               <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.poweredBy}</p>
               <button 
                onClick={() => setShowInfo(false)}
                className="mt-6 w-full py-4 bg-gray-800 text-white font-bold rounded-2xl hover:bg-black transition-all"
               >
                 Got it
               </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 mt-8">
        {pricePromptItem && (
          <PricePrompt itemName={pricePromptItem.name} defaultPrice={pricePromptItem.estimated_price} onConfirm={handleConfirmPurchase} onCancel={() => setPricePromptItem(null)} />
        )}
        {showNotification && (
          <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-white font-bold shadow-2xl z-[60] transition-all duration-300 ${showNotification.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>{showNotification.message}</div>
        )}

        {currentView === 'expenses' && (
          <>
            <GeneralExpenseForm categories={categories} onAdd={handleAddGeneralExpense} />
            <ExpenseHistory expenses={expenses} categories={categories} onDelete={async (id) => await supabase.from('expenses').delete().eq('id', id)} />
          </>
        )}

        {currentView === 'list' && (
          <>
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
              <h2 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-tighter">{editingId ? 'Edit List Item' : 'New Shopping Item'}</h2>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex-grow">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Item Name</label>
                    <input type="text" placeholder="e.g. Avocado" value={nameInput} onChange={e => setNameInput(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" required />
                  </div>
                  <div className="flex-grow">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Estimated $</label>
                    <input type="number" step="0.01" placeholder="4.50" value={priceInput} onChange={e => setPriceInput(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-black" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Note</label>
                    <input type="text" placeholder="Organic, ripe..." value={noteInput} onChange={e => setNoteInput(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
                <button type="submit" disabled={!nameInput.trim()} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-100 disabled:opacity-50">
                   {editingId ? 'Save Changes' : 'Add to Shopping List'}
                </button>
              </form>
            </section>
            
            <button 
              onClick={() => {
                if (items.length === 0) return triggerNotification('Add items for AI suggestions', 'error');
                setIsSuggesting(true);
                getSmartSuggestions(items).then(res => { setSuggestions(res); setIsSuggesting(false); });
              }}
              className={`mb-4 flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold transition-all ${isSuggesting ? 'animate-pulse' : 'hover:bg-indigo-100'}`}
            >
              <SparklesIcon /> Get AI Suggestions
            </button>

            <SmartSuggestionsPanel suggestions={suggestions} onAdd={addFromSuggestion} isLoading={isSuggesting} />
            <div className="space-y-1">
              {activeItems.map(item => (
                <GroceryItemCard 
                  key={item.id} 
                  item={item} 
                  onToggle={() => setPricePromptItem(item)} 
                  onDelete={async (id) => await supabase.from('grocery_items').delete().eq('id', id)} 
                  onEdit={i => { setEditingId(i.id); setNameInput(i.name); setNoteInput(i.note || ''); setPriceInput(i.estimated_price?.toString() || ''); }} 
                />
              ))}
              {activeItems.length === 0 && (
                <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
                   <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"><ListIcon /></div>
                   <h3 className="text-lg font-bold text-gray-800">Your shopping list is clear!</h3>
                </div>
              )}
            </div>
          </>
        )}

        {currentView === 'reports' && <ReportsDashboard expenses={expenses} categories={categories} budgets={budgets} translations={t} />}

        {currentView === 'settings' && (
          <SettingsManager 
            categories={categories} 
            budgets={budgets} 
            onAddCategory={async (n, c) => await supabase.from('categories').insert([{ name: n, color: c, user_id: session.user.id }])} 
            onDeleteCategory={async (id) => await supabase.from('categories').delete().eq('id', id)} 
            onUpdateBudget={async (id, amt) => {
              const existing = budgets.find(b => b.category_id === id);
              if (existing) await supabase.from('budgets').update({ amount: amt }).eq('category_id', id);
              else await supabase.from('budgets').insert([{ category_id: id, amount: amt, user_id: session.user.id }]);
            }}
          />
        )}

        <footer className="mt-16 pb-8 text-center">
            <p className="text-xs font-black text-gray-300 uppercase tracking-widest">{t.poweredBy}</p>
        </footer>
      </main>

      {/* Mobile Bar - Bottom Tabs */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white/90 backdrop-blur-lg border-t border-gray-100 px-6 py-4 flex justify-around items-center z-50">
        {[
          { id: 'expenses', icon: <ReceiptIcon />, label: t.spend },
          { id: 'list', icon: <ListIcon />, label: t.list },
          { id: 'reports', icon: <ChartIcon />, label: t.stats },
          { id: 'settings', icon: <SettingsIcon />, label: t.setup }
        ].map(tab => (
          <button key={tab.id} onClick={() => setCurrentView(tab.id as AppView)} className={`flex flex-col items-center gap-1 ${currentView === tab.id ? 'text-emerald-600' : 'text-gray-400'}`}>
            <div className={`p-2 rounded-xl transition-all ${currentView === tab.id ? 'bg-emerald-50 shadow-sm' : 'bg-transparent'}`}>{tab.icon}</div>
            <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
