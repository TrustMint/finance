import React from 'react';
import { useStore } from '../store';
import { GlassCard } from '../components/ui/GlassCard';
import { Icon } from '../components/ui/Icons';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { useModal } from '../components/ModalProvider';
import { AddTransactionModal } from '../components/AddTransactionModal';

export const Dashboard: React.FC = () => {
  const { transactions, categories } = useStore();
  const { showModal } = useModal();

  const totalBalance = transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);

  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  // Chart data (Last 14 days)
  const chartData = transactions.slice(0, 14).reverse().map((t, i) => ({
    name: i,
    amount: t.type === 'income' ? t.amount : -t.amount,
    date: new Date(t.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
  }));

  const handleOpenAdd = () => {
      showModal(<AddTransactionModal />);
  };

  return (
    <div className="space-y-6 md:space-y-8 pt-2">
      {/* Modified Header: Date Left, Add Button Right Edge */}
      <div className="flex justify-between items-center px-1">
        <div>
          <p className="text-secondary/60 text-[13px] font-semibold uppercase tracking-widest">
            {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        
        {/* Add Button positioned at the very right edge */}
        <button 
            onClick={handleOpenAdd}
            className="w-10 h-10 bg-[#0A84FF] rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 active:scale-90 transition-transform"
        >
            <Icon name="plus" size={24} strokeWidth={3} />
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Cards) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Balance Card */}
          <GlassCard className="p-8 relative overflow-hidden !bg-gradient-to-br from-[#1C1C1E] via-[#2C2C2E] to-[#1C1C1E] border border-white/10 min-h-[220px] flex flex-col justify-center transform transition-all hover:scale-[1.01] duration-500">
            {/* Background Blurs */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#0A84FF]/20 blur-[80px] rounded-full pointer-events-none mix-blend-screen animate-pulse"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#5E5CE6]/20 blur-[80px] rounded-full pointer-events-none mix-blend-screen"></div>

            <div className="relative z-10">
              <span className="text-secondary/80 font-medium text-lg">Общий баланс</span>
              <div className="mt-2 flex items-baseline gap-2">
                <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-2xl">
                  {totalBalance.toLocaleString('ru-RU')}
                </h2>
                <span className="text-2xl md:text-3xl font-medium text-secondary/60">₽</span>
              </div>
            </div>

            <div className="relative z-10 mt-8 flex gap-4 md:gap-8">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-[#30D158]/10 flex items-center justify-center border border-[#30D158]/20 text-[#30D158] shadow-[0_0_10px_rgba(48,209,88,0.2)]">
                   <Icon name="trending-down" size={20} className="rotate-180" />
                 </div>
                 <div>
                   <p className="text-xs text-secondary/60 font-bold uppercase tracking-wider">Доходы</p>
                   <p className="text-lg font-bold text-white">+{income.toLocaleString('ru-RU')} ₽</p>
                 </div>
              </div>
              <div className="w-px bg-white/10 h-10 self-center"></div>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-[#FF453A]/10 flex items-center justify-center border border-[#FF453A]/20 text-[#FF453A] shadow-[0_0_10px_rgba(255,69,58,0.2)]">
                   <Icon name="trending-down" size={20} />
                 </div>
                 <div>
                   <p className="text-xs text-secondary/60 font-bold uppercase tracking-wider">Расходы</p>
                   <p className="text-lg font-bold text-white">-{expense.toLocaleString('ru-RU')} ₽</p>
                 </div>
              </div>
            </div>
          </GlassCard>

          {/* Chart Section */}
          <GlassCard className="p-6 h-[300px] flex flex-col">
             <h3 className="font-bold text-lg mb-4 text-white/90">Динамика баланса</h3>
             <div className="flex-1 w-full min-h-0 relative -ml-2"> {/* Fix overflow and margin */}
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#0A84FF" stopOpacity={0}/>
                      </linearGradient>
                      {/* Glow Filter for 3D Line Effect */}
                      <filter id="glow" height="300%" width="300%" x="-100%" y="-100%">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <XAxis 
                        dataKey="date" 
                        hide 
                        axisLine={false} 
                        tickLine={false} 
                    />
                    <Tooltip 
                      cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                      contentStyle={{ 
                          backgroundColor: 'rgba(28, 28, 30, 0.85)', 
                          backdropFilter: 'blur(12px)', 
                          border: '0.5px solid rgba(255,255,255,0.15)', 
                          borderRadius: '16px', 
                          color: '#fff',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                          padding: '12px'
                      }}
                      itemStyle={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}
                      labelStyle={{ display: 'none' }}
                      formatter={(value: any) => [`${value.toLocaleString()} ₽`, '']}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#0A84FF" 
                        strokeWidth={4} 
                        fillOpacity={1} 
                        fill="url(#colorAmt)" 
                        filter="url(#glow)"
                        strokeLinecap="round"
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </GlassCard>

        </div>

        {/* Right Column (Recent Transactions) */}
        <div className="lg:col-span-1">
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="font-bold text-xl">Последние</h3>
            <button className="text-[#0A84FF] text-sm font-semibold hover:text-white transition-colors">Все</button>
          </div>

          <div className="space-y-3">
            {transactions.length === 0 ? (
                <div className="text-center py-10 text-secondary/40">
                    <Icon name="list" size={40} className="mx-auto mb-2 opacity-20"/>
                    <p>Нет операций</p>
                </div>
            ) : (
                transactions.slice(0, 6).map(t => {
                const cat = categories.find(c => c.id === t.category_id) || categories[0];
                return (
                    <GlassCard key={t.id} className="p-4 flex items-center justify-between group hover:bg-white/5 transition-colors cursor-pointer border-transparent hover:border-white/10 active:scale-[0.98]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[18px] flex items-center justify-center shadow-inner text-white" 
                             style={{ backgroundColor: `${cat?.color}20`, color: cat?.color }}>
                        <Icon name={cat?.icon || 'dollar'} size={24} />
                        </div>
                        <div>
                        <p className="font-bold text-[15px] mb-0.5">{cat?.name}</p>
                        <p className="text-xs text-secondary/60 font-medium">
                            {t.description || new Date(t.date).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}
                        </p>
                        </div>
                    </div>
                    <div className={`font-bold text-[16px] tracking-tight ${t.type === 'income' ? 'text-[#30D158]' : 'text-white'}`}>
                        {t.type === 'income' ? '+' : '-'}{Math.abs(t.amount).toLocaleString('ru-RU')} ₽
                    </div>
                    </GlassCard>
                );
                })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};