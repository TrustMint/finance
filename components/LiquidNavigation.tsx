import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './ui/Icons';

interface LiquidNavigationProps {
    onOpenAdd: () => void;
}

export const LiquidNavigation: React.FC<LiquidNavigationProps> = ({ onOpenAdd }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    const triggerHaptic = () => {
        try {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(10);
            }
        } catch (e) {}
    };

    const handleNavigate = (path: string) => {
        if (currentPath === path) {
             const scrollContainer = document.querySelector('.view-scroll-container');
             if (scrollContainer) {
                 scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
             } else {
                 window.scrollTo({ top: 0, behavior: 'smooth' });
             }
             return;
        }
        triggerHaptic();
        navigate(path);
    };

    const NavItem = ({ path, icon, label }: { path: string, icon: string, label: string }) => {
        const isActive = currentPath === path;

        return (
            <button
                onClick={() => handleNavigate(path)}
                className="flex-1 flex flex-col items-center justify-center h-full relative group pt-2 pb-1"
                style={{ WebkitTapHighlightColor: 'transparent' }}
            >
                <div 
                    className={`transition-all duration-300 ease-out mb-1 ${
                        isActive ? 'text-[#0A84FF] -translate-y-0.5' : 'text-white/40 translate-y-0.5'
                    }`}
                >
                    <Icon name={icon} size={24} />
                </div>
                
                <span 
                    className={`text-[10px] font-bold tracking-wide transition-colors duration-300 ${
                        isActive ? 'text-[#0A84FF]' : 'text-white/40'
                    }`}
                >
                    {label}
                </span>
            </button>
        )
    }

    const glassStyle: React.CSSProperties = {
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        border: '0.5px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.6)',
    };

    return (
        <div className="md:hidden">
            {/* Floating Add Button - Glass Circle */}
            <div className="fixed bottom-[calc(84px+env(safe-area-inset-bottom)+12px)] left-1/2 -translate-x-1/2 z-[101]">
                <button
                    onClick={() => { triggerHaptic(); onOpenAdd(); }}
                    className="w-16 h-16 rounded-full flex items-center justify-center active:scale-90 transition-transform duration-200"
                    style={{
                        ...glassStyle,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)', 
                        borderRadius: '50%'
                    }}
                >
                    <div className="bg-[#0A84FF] w-12 h-12 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(10,132,255,0.4)]">
                         <Icon name="plus" size={28} />
                    </div>
                </button>
            </div>

            {/* Navigation Panel */}
            <div className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none">
                <div
                    className="w-full pointer-events-auto"
                    style={{
                        ...glassStyle,
                        borderBottom: 'none',
                        borderTopLeftRadius: '32px',
                        borderTopRightRadius: '32px',
                        paddingBottom: 'env(safe-area-inset-bottom)',
                        height: 'calc(84px + env(safe-area-inset-bottom))'
                    }}
                >
                    <div className="flex items-center justify-between h-[84px] px-6">
                        <NavItem path="/" icon="dashboard" label="Главная" />
                        <NavItem path="/transactions" icon="list" label="Счета" />
                        {/* Spacer for the button */}
                        <div className="w-8" />
                        <NavItem path="/analytics" icon="chart" label="Отчеты" />
                        <NavItem path="/settings" icon="settings" label="Меню" />
                    </div>
                </div>
            </div>
        </div>
    );
};