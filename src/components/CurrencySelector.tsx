import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { getFlagUrl, POPULAR_CURRENCIES } from '../utils/currencyUtils';

interface CurrencySelectorProps {
  selected: string;
  onSelect: (code: string) => void;
  currencies: Record<string, string>;
  onOpenChange?: (open: boolean) => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  selected, 
  onSelect, 
  currencies, 
  onOpenChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCurrencies = Object.entries(currencies).filter(
    ([code, name]) => 
      code.toLowerCase().includes(search.toLowerCase()) || 
      name.toLowerCase().includes(search.toLowerCase())
  );

  const popular = filteredCurrencies.filter(([code]) => POPULAR_CURRENCIES.includes(code));
  const others = filteredCurrencies.filter(([code]) => !POPULAR_CURRENCIES.includes(code));

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-brand-950 p-1.5 rounded-xl hover:bg-brand-800 transition-all shadow-md active:scale-95 group border border-white/10"
      >
        <img src={getFlagUrl(selected)} className="w-8 h-5.5 rounded-lg object-cover" alt={selected} />
        <ChevronDown size={14} className={`ml-1.5 mr-1 text-brand-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-6 w-84 bg-white rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-brand-100 z-[100] overflow-hidden animate-in fade-in zoom-in duration-300 origin-top-right">
          <div className="p-5 border-b border-brand-50 bg-brand-50/30 rounded-t-[2.5rem]">
            <div className="relative flex items-center">
              <Search className="absolute left-5 text-brand-400 pointer-events-none" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="Search currencies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white pl-14 pr-4 py-4 rounded-2xl outline-none focus:ring-4 ring-accent/10 transition-all font-semibold text-brand-950 placeholder:text-brand-300 shadow-sm border border-brand-100"
              />
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-3 space-y-1">
            {popular.length > 0 && (
              <div className="mb-4">
                <p className="px-4 py-2 text-[10px] font-black text-brand-300 uppercase tracking-[0.2em]">Popular</p>
                {popular.map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => {
                      onSelect(code);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                      selected === code ? 'bg-brand-950 text-white shadow-lg' : 'hover:bg-brand-50 text-brand-700 hover:translate-x-1'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={getFlagUrl(code)} className="w-10 h-7 rounded-lg object-cover shadow-md border border-white/20" alt="" />
                        {selected === code && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-brand-950"></div>
                        )}
                      </div>
                      <div className="text-left">
                        <p className={`font-black text-sm leading-none mb-1 ${selected === code ? 'text-white' : 'text-brand-950'}`}>{code}</p>
                        <p className={`text-xs font-medium truncate w-32 ${selected === code ? 'text-brand-300' : 'text-brand-400'}`}>{name}</p>
                      </div>
                    </div>
                    {selected === code && <Check size={18} className="text-accent" />}
                  </button>
                ))}
              </div>
            )}

            <div>
              <p className="px-4 py-2 text-[10px] font-black text-brand-300 uppercase tracking-[0.2em]">All Currencies</p>
              {others.map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => {
                    onSelect(code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                    selected === code ? 'bg-brand-950 text-white shadow-lg' : 'hover:bg-brand-50 text-brand-700 hover:translate-x-1'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img src={getFlagUrl(code)} className="w-10 h-7 rounded-lg object-cover shadow-md border border-white/20" alt="" />
                    <div className="text-left">
                      <p className={`font-black text-sm leading-none mb-1 ${selected === code ? 'text-white' : 'text-brand-950'}`}>{code}</p>
                      <p className={`text-xs font-medium truncate w-32 ${selected === code ? 'text-brand-300' : 'text-brand-400'}`}>{name}</p>
                    </div>
                  </div>
                  {selected === code && <Check size={18} className="text-accent" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
