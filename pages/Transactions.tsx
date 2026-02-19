import React, { useMemo, useState } from 'react';
import { useStore } from '../store';
import { Icon } from '../components/ui/Icons';
import { Transaction } from '../types';

export const Transactions: React.FC = () => {
  const { transactions, categories, deleteTransaction } = useStore();
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    let filtered = transactions;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(t => 
            t.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            categories.find(c => c.id === t.category_id)?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    const groups: Record<string, Transaction[]> = {};
    const today = new Date().toLocaleDateString('ru-RU');
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('ru-RU');

    filtered.forEach(t => {
      const txDate = new Date(t.date).toLocaleDateString('ru-RU');
      let dateKey = new Date(t.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
      
      if (txDate === today) dateKey = 'Сегодня';
      else if (txDate === yesterday) dateKey = 'Вчера';
      
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(t);
    });
    return groups;
  }, [transactions, filterType, searchTerm]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm('Удалить операцию?')) {
        deleteTransaction(id);
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-0 animate-fade-in relative">
      {/* Header */}
      <div className="flex justify-between items-center z-20 sticky top-0 bg-black/80 backdrop-blur-xl py-2 -mx-4 px-4 md:mx-0 md:px-0 border-b border-white/5">
        <h1 className="text-3xl font-bold tracking-tight">Счета</h1>
        <div className="flex gap-3">
            <div className="relative group">
                 <input 
                    type="text" 
                    placeholder="Поиск..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`bg-[#1C1C1E] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none transition-all duration-300 ${searchTerm ? 'w-48 bg-[#2C2C2E]' : 'w-10 focus:w-48 bg-transparent border-transparent focus:bg-[#2C2C2E] focus:border-white/10'}`}
                 />
                 <Icon name="search" size={18} className="absolute left-3 top-2.5 text-secondary/60 pointer-events-none"/>
            </div>
            <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 active:scale-95 ${showFilters ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg' : 'bg-[#1C1C1E] border-white/10 text-secondary hover:bg-[#2C2C2E]'}`}
            >
                <Icon name="filter" size={18}/>
            </button>
        </div>
      </div>

      {/* Filters Panel (Collapsible) */}
      <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-48 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
        <div className="bg-[#1C1C1E] rounded-[24px] p-5 space-y-4 shadow-xl mx-1">
             <div className="flex bg-[#2C2C2E] p-1.5 rounded-full">
                {(['all', 'expense', 'income'] as const).map(ft => (
                <button
                    key={ft}
                    onClick={() => setFilterType(ft)}
                    className={`flex-1 py-2 text-xs font-bold rounded-full uppercase tracking-wide transition-all ${filterType === ft ? 'bg-[#636366] text-white shadow' : 'text-secondary/60 hover:text-white'}`}
                >
                    {ft === 'all' ? 'Все' : ft === 'expense' ? 'Расходы' : 'Доходы'}
                </button>
                ))}
            </div>
        </div>
      </div>

      {/* List - iOS Settings Style Grouped List */}
      <div className="space-y-8">
        {Object.entries(groupedTransactions).map(([date, txs]) => (
          <div key={date}>
            <h3 className="text-[13px] text-secondary/50 font-semibold uppercase tracking-widest mb-2 ml-4 sticky top-14 z-10">{date}</h3>
            
            {/* The Group Container matching SettingsUI ProfileBlock */}
            <div className="bg-[#1C1C1E] rounded-[24px] overflow-hidden">
              {txs.map((t, index) => {
                const cat = categories.find(c => c.id === t.category_id) || categories[0];
                const isLast = index === txs.length - 1;
                
                return (
                  <div key={t.id} className="relative group">
                    <div className="flex items-center justify-between p-4 bg-[#1C1C1E] active:bg-[#2C2C2E] transition-colors relative z-10">
                        {/* Left: Icon & Text */}
                        <div className="flex items-center gap-4">
                            {/* Icon Container matching MenuRow style */}
                            <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center shrink-0 relative overflow-hidden bg-[#171717]">
                                {/* Glare Effects */}
                                <div className="absolute inset-0 rounded-[10px] pointer-events-none z-10 shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.1)] opacity-50"></div>
                                
                                <Icon name={cat?.icon || 'dollar'} size={20} color={cat?.color} />
                            </div>
                            
                            <div>
                                <p className="font-semibold text-[16px] text-white leading-snug">{cat?.name}</p>
                                <p className="text-[13px] text-secondary/50 font-medium">
                                    {t.description || (t.type === 'expense' ? 'Расход' : 'Доход')}
                                </p>
                            </div>
                        </div>

                        {/* Right: Amount */}
                        <div className={`font-bold text-[17px] tracking-tight ${t.type === 'income' ? 'text-[#30D158]' : 'text-white'}`}>
                            {t.type === 'income' ? '+' : '−'}{t.amount.toLocaleString('ru-RU')} ₽
                        </div>
                    </div>
                    
                    {/* Separator Line (Inset) */}
                    {!isLast && (
                         <div className="absolute bottom-0 left-[68px] right-0 h-[0.5px] bg-[#38383A]"></div>
                    )}
                    
                    {/* Delete Action (Hidden usually, visible on logic if implemented swiping) */}
                    {/* Simplified for tap-hold or explicit delete button if needed, 
                        but standard iOS is swipe. Here we add a subtle X on hover for desktop */}
                     <button 
                        onClick={(e) => handleDelete(t.id, e)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#FF453A] opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-[#1C1C1E]"
                     >
                        <Icon name="trash" size={20} />
                     </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {Object.keys(groupedTransactions).length === 0 && (
            <div className="text-center py-20 opacity-50">
                <Icon name="search" size={48} className="mx-auto mb-4 text-secondary/20"/>
                <p className="text-secondary font-medium">Ничего не найдено</p>
            </div>
        )}
      </div>
    </div>
  );
};