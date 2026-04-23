import React from 'react';
import { Star, Trash2 } from 'lucide-react';
import type { TrackedPair } from '../types/currency';
import { getFlagUrl } from '../utils/currencyUtils';

interface WatchlistProps {
  pairs: TrackedPair[];
  onRemove: (id: string) => void;
  currentRate: number | null;
  fromCurrency: string;
  toCurrency: string;
}

export const Watchlist: React.FC<WatchlistProps> = ({ 
  pairs, 
  onRemove, 
  currentRate, 
  fromCurrency, 
  toCurrency 
}) => {
  return (
    <aside className="lg:col-span-4 flex flex-col gap-6">
      <div className="glass-card p-8 flex-1 flex flex-col bg-white rounded-[2rem] shadow-xl border border-white/50">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-slate-900">Watchlist</h3>
          <span className="bg-amber-100 text-[#B5945E] text-[10px] font-black px-2 py-1 rounded-full uppercase">Live</span>
        </div>

        <div className="flex-1 space-y-4">
          {pairs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-200 mb-4">
                <Star size={32} />
              </div>
              <p className="text-sm text-slate-500 font-bold leading-tight">No tracked pairs yet</p>
              <p className="text-xs text-slate-400 mt-2">Save pairs to monitor them here</p>
            </div>
          ) : (
            pairs.map((pair) => (
              <div 
                key={pair.id}
                className="group relative bg-white/40 hover:bg-white p-5 rounded-3xl border border-slate-100 transition-all hover:scale-[1.02] cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <img src={getFlagUrl(pair.from)} className="w-6 h-6 rounded-full border-2 border-white object-cover" alt="" />
                      <img src={getFlagUrl(pair.to)} className="w-6 h-6 rounded-full border-2 border-white object-cover" alt="" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{pair.from} to {pair.to}</p>
                      <p className="text-lg font-black text-slate-900">
                        {currentRate && pair.from === fromCurrency && pair.to === toCurrency ? currentRate.toFixed(4) : '---'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRemove(pair.id); }}
                    className="p-2 text-slate-200 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};
