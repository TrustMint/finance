import React, { useState } from 'react';
import { useStore } from '../store';
import { Icon } from './ui/Icons';
import { TransactionType } from '../types';
import { useModal } from './ModalProvider';

export const AddTransactionModal: React.FC = () => {
  const { categories, addTransaction } = useStore();
  const { hideModal } = useModal();
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    setSaving(true);
    await addTransaction({
      amount: parseFloat(amount),
      currency: 'RUB',
      category_id: categoryId,
      date: new Date(date).toISOString(),
      type,
      description
    });
    setSaving(false);
    hideModal();
  };

  return (
    <div className="px-4">
        <h2 className="text-xl font-bold tracking-tight mb-6 px-2">Новая операция</h2>

        {/* Type Switcher - Full Rounded */}
        <div className="flex bg-[#2C2C2E] p-1.5 rounded-full mb-8">
          <button 
            className={`flex-1 py-3.5 rounded-full text-[15px] font-bold transition-all duration-300 ${type === 'expense' ? 'bg-[#FF453A] text-white shadow-lg' : 'text-secondary/60 hover:text-white'}`}
            onClick={() => setType('expense')}
          >
            💸 Расход
          </button>
          <button 
            className={`flex-1 py-3.5 rounded-full text-[15px] font-bold transition-all duration-300 ${type === 'income' ? 'bg-[#30D158] text-white shadow-lg' : 'text-secondary/60 hover:text-white'}`}
            onClick={() => setType('income')}
          >
            💰 Доход
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount - Large Rounded Block */}
          <div className="bg-[#2C2C2E]/50 rounded-[32px] p-6 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group focus-within:bg-[#2C2C2E]/80 transition-colors">
            <label className="text-xs text-secondary/60 uppercase tracking-wide font-bold mb-2">Сумма</label>
            <div className="flex items-center justify-center gap-1 relative z-10">
                <input 
                    type="number" 
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0"
                    autoFocus
                    className="bg-transparent border-none text-5xl font-extrabold text-white placeholder-white/10 focus:outline-none focus:ring-0 text-center w-full max-w-[200px]"
                    step="0.01"
                />
                <span className="text-3xl font-bold text-secondary/50 absolute -right-8 top-1/2 -translate-y-1/2">₽</span>
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="text-xs text-secondary/60 mb-3 block uppercase tracking-wide font-bold ml-4">Категория</label>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 px-2 -mx-2">
              {categories.filter(c => c.type === 'both' || c.type === type).map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex-shrink-0 flex flex-col items-center gap-3 p-2 pb-3 min-w-[76px] rounded-[28px] border-2 transition-all duration-200 ${categoryId === cat.id ? 'bg-[#2C2C2E] border-[#0A84FF] scale-105 shadow-lg' : 'border-transparent hover:bg-[#2C2C2E]/50'}`}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white transition-transform" style={{ backgroundColor: `${cat.color}40`, color: cat.color }}>
                    <Icon name={cat.icon} size={22} />
                  </div>
                  <span className={`text-[11px] text-center truncate w-full font-semibold ${categoryId === cat.id ? 'text-white' : 'text-secondary/70'}`}>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#2C2C2E]/50 rounded-[24px] px-4 py-3.5 border border-white/5 flex flex-col justify-center">
                <label className="text-[10px] text-secondary/60 uppercase font-bold mb-1">Дата</label>
                <input 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-transparent text-white focus:outline-none text-sm font-semibold font-mono" 
                />
            </div>
             <button type="button" className="bg-[#2C2C2E]/50 rounded-[24px] px-4 py-3.5 border border-white/5 flex items-center justify-center gap-2 hover:bg-[#2C2C2E] transition-colors active:scale-95">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Icon name="camera" size={16} className="text-white"/>
                </div>
                <span className="text-sm font-semibold text-secondary">Скан чека</span>
            </button>
          </div>

          {/* Description */}
          <div className="bg-[#2C2C2E]/50 rounded-[24px] p-1 border border-white/5">
             <input 
              type="text" 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Комментарий..."
              className="w-full bg-transparent border-none text-white placeholder-white/20 focus:outline-none text-[15px] font-medium px-5 py-4"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 pb-6">
            <button 
                type="submit" 
                disabled={saving}
                className="w-full bg-[#0A84FF] text-white py-4 rounded-[32px] font-bold text-[17px] shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all hover:bg-[#007AFF] disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {saving ? 'Сохранение...' : (
                    <>
                        <Icon name="check" size={20} strokeWidth={3} />
                        <span>Добавить операцию</span>
                    </>
                )}
            </button>
          </div>
        </form>
    </div>
  );
};