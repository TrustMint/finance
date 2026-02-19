import React, { useState } from 'react';
import { useStore } from '../store';
import { Icon } from './ui/Icons';
import { useModal } from './ModalProvider';

export const AddCategoryModal: React.FC = () => {
  const { addCategory } = useStore();
  const { hideModal } = useModal();
  
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('tag');
  const [newCatColor, setNewCatColor] = useState('#0A84FF');
  const [newCatType, setNewCatType] = useState<'expense'|'income'>('expense');

  const icons = ['shopping-cart', 'car', 'home', 'coffee', 'briefcase', 'laptop', 'gift', 'smartphone', 'music', 'shopping-bag', 'star', 'heart', 'smile'];
  const colors = ['#FF453A', '#FF9F0A', '#FFD60A', '#30D158', '#64D2FF', '#0A84FF', '#5E5CE6', '#BF5AF2', '#8E8E93'];

  const handleAdd = async () => {
      await addCategory({
          name: newCatName,
          icon: newCatIcon,
          color: newCatColor,
          type: newCatType
      });
      hideModal();
  };

  return (
      <div className="px-4">
          <h2 className="text-xl font-bold mb-6 px-2">Новая категория</h2>
          
          <div className="space-y-6">
              
              {/* Name Input */}
              <div>
                  <label className="text-xs text-secondary/60 font-bold uppercase mb-2 block ml-4">Название</label>
                  <input 
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    className="w-full bg-[#2C2C2E] rounded-[24px] p-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all"
                    placeholder="Например: Спорт"
                  />
              </div>

              {/* Type Toggle */}
              <div>
                  <label className="text-xs text-secondary/60 font-bold uppercase mb-2 block ml-4">Тип транзакции</label>
                  <div className="flex bg-[#2C2C2E] p-1.5 rounded-full">
                      <button onClick={() => setNewCatType('expense')} className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all ${newCatType === 'expense' ? 'bg-[#FF453A] text-white shadow-md' : 'text-secondary hover:text-white'}`}>Расход</button>
                      <button onClick={() => setNewCatType('income')} className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all ${newCatType === 'income' ? 'bg-[#30D158] text-white shadow-md' : 'text-secondary hover:text-white'}`}>Доход</button>
                  </div>
              </div>

              {/* Icon Selector */}
              <div>
                  <label className="text-xs text-secondary/60 font-bold uppercase mb-2 block ml-4">Иконка</label>
                  <div className="flex gap-3 overflow-x-auto pb-4 px-2 -mx-2 no-scrollbar">
                      {icons.map(icon => (
                          <button 
                            key={icon} 
                            onClick={() => setNewCatIcon(icon)} 
                            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${newCatIcon === icon ? 'bg-[#0A84FF] border-[#0A84FF] text-white scale-110 shadow-lg' : 'border-[#2C2C2E] bg-[#2C2C2E] text-secondary/50 hover:bg-[#3A3A3C]'}`}
                          >
                              <Icon name={icon} size={20} />
                          </button>
                      ))}
                  </div>
              </div>

              {/* Color Selector */}
              <div>
                  <label className="text-xs text-secondary/60 font-bold uppercase mb-2 block ml-4">Цвет метки</label>
                  <div className="flex gap-3 overflow-x-auto pb-4 px-2 -mx-2 no-scrollbar">
                      {colors.map(color => (
                          <button 
                            key={color} 
                            onClick={() => setNewCatColor(color)} 
                            className={`flex-shrink-0 w-10 h-10 rounded-full transition-all ${newCatColor === color ? 'ring-4 ring-white/20 scale-110' : 'hover:scale-105'}`} 
                            style={{
                                backgroundColor: color,
                                boxShadow: newCatColor === color ? `0 0 15px ${color}` : 'none'
                            }} 
                          />
                      ))}
                  </div>
              </div>

              <div className="pt-4 pb-6">
                  <button 
                    onClick={handleAdd} 
                    disabled={!newCatName}
                    className="w-full py-4 bg-[#0A84FF] rounded-[32px] font-bold text-[17px] text-white shadow-lg active:scale-95 transition-all hover:bg-[#007AFF] disabled:opacity-50 disabled:scale-100"
                   >
                    Создать категорию
                   </button>
              </div>
          </div>
      </div>
  );
};