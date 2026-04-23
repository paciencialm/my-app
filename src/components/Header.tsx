import React from 'react';
import { getFlagUrl } from '../utils/currencyUtils';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-5xl mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
          Global<span className="text-[#B5945E]">Rates</span>
        </h1>
      </div>
      <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-white/80 shadow-sm">
        <div className="flex -space-x-2">
          {['USD', 'EUR', 'GBP'].map(c => (
            <img key={c} src={getFlagUrl(c)} className="w-8 h-8 rounded-full border-2 border-white object-cover" alt={c} />
          ))}
        </div>
        <div className="h-6 w-px bg-slate-200 mx-2"></div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Updates</span>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      </div>
    </header>
  );
};
