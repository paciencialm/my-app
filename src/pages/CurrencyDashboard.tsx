import React from 'react';
import { ArrowLeftRight, Star } from 'lucide-react';
import { useCurrency } from '../hooks/useCurrency';
import { CurrencySelector } from '../components/CurrencySelector';
import { Header } from '../components/Header';
import { Watchlist } from '../components/Watchlist';
import { PROVIDERS, FEE_TIERS } from '../utils/currencyUtils';

const CurrencyDashboard: React.FC = () => {
  const {
    amount, setAmount,
    fromCurrency, setFromCurrency,
    toCurrency, setToCurrency,
    rate, currencies,
    fee, setFee,
    selectedProvider, setSelectedProvider,
    trackedPairs, addTrackedPair, removeTrackedPair,
    isSwapping, handleSwap,
    feeAmount, totalPayout,
    error, clearError, retry
  } = useCurrency();

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center bg-[#f8fafc]">
      <Header />

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-card p-10 relative group bg-white rounded-[2rem] shadow-xl border border-white/50">
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                  <div>
                    <p className="text-xs font-black text-red-600 uppercase tracking-widest leading-none mb-1">Exchange Error</p>
                    <p className="text-sm font-bold text-red-500/80 leading-none">{error}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={retry} className="px-4 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200">Retry</button>
                  <button onClick={clearError} className="px-4 py-2 bg-white text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-50 transition-colors border border-red-100">Dismiss</button>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-bold text-slate-900">Currency Converter</h2>
              <button 
                onClick={addTrackedPair}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-[#B5945E] text-sm font-bold border border-slate-100"
              >
                <Star size={16} className="text-[#B5945E]" />
                Save Pair
              </button>
            </div>

            <div className="flex flex-col gap-4 relative">
              <div className="relative z-10 hover:z-50 focus-within:z-50 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-sm transition-all duration-300 focus-within:ring-4 ring-amber-100/50">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 block">Amount to send</label>
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="bg-transparent text-3xl font-black w-full outline-none text-slate-900 placeholder:text-slate-200"
                    placeholder="0.00"
                  />
                  <CurrencySelector
                    selected={fromCurrency}
                    onSelect={setFromCurrency}
                    currencies={currencies}
                  />
                </div>
              </div>

              <div className="flex justify-center -my-6 relative z-20">
                <button
                  onClick={handleSwap}
                  className={`p-4 bg-slate-900 text-white rounded-2xl shadow-2xl shadow-slate-900/20 transition-all duration-500 hover:scale-110 active:scale-95 ${isSwapping ? 'rotate-180' : ''}`}
                >
                  <ArrowLeftRight size={24} color="white" />
                </button>
              </div>

              <div className="relative z-10 hover:z-50 focus-within:z-50 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-sm transition-all duration-300 focus-within:ring-4 ring-amber-100/50">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 block">Recipient receives</label>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-3xl font-black text-slate-900/40">
                    {rate ? (amount * rate).toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'Loading...'}
                  </div>
                  <CurrencySelector
                    selected={toCurrency}
                    onSelect={setToCurrency}
                    currencies={currencies}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="text-2xl font-black text-slate-900 flex flex-wrap items-baseline gap-x-3">
                  <span>1.00 {fromCurrency} =</span>
                  <span className="text-[#B5945E]">{rate ? rate.toFixed(8) : '...'} {toCurrency}</span>
                </div>
                <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">Mid-market rate at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</p>
              </div>
              
              <div className="w-full md:w-64">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Choose Provider</label>
                <select 
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full bg-white p-3 rounded-xl outline-none border border-slate-100 font-bold text-sm text-slate-900 focus:ring-4 ring-amber-100/50 transition-all cursor-pointer shadow-sm"
                >
                  {PROVIDERS.map(p => (
                    <option key={p} value={p} className="text-slate-900 bg-white font-bold">
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row gap-4">
              <div className="flex-1 p-6 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl shadow-slate-900/20">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Payout</p>
                    <h3 className="text-2xl font-black">
                      {totalPayout.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-[#B5945E]">{toCurrency}</span>
                    </h3>
                    <p className="text-[9px] text-slate-500 font-bold mt-1">VIA {selectedProvider.toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>Rate: 1 {fromCurrency} = {rate ? rate.toFixed(4) : '...'} {toCurrency}</span>
                  <span>Fee: {fee}%</span>
                </div>
              </div>

              <div className="w-full md:w-64 p-6 bg-white border border-slate-100 rounded-[2.5rem] flex flex-col justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Service Fee</p>
                <p className="text-xl font-black text-slate-900 mb-1">
                  {feeAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurrency}
                </p>
                <div className="flex gap-1 mb-4">
                  {[2, 5, 10].map(f => (
                    <button 
                      key={f} 
                      onClick={() => setFee(f)}
                      className={`text-[10px] font-bold px-2 py-2 rounded-lg transition-all flex-1 ${fee === f ? 'bg-[#B5945E] text-white shadow-md shadow-[#B5945E]/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                      {f}%
                    </button>
                  ))}
                </div>

                <div className="bg-[#B5945E]/5 p-3 rounded-xl border border-[#B5945E]/10 animate-in fade-in slide-in-from-bottom-1 duration-300">
                  <p className="text-[10px] font-black text-[#B5945E] uppercase tracking-tighter mb-1">
                    {FEE_TIERS[fee as keyof typeof FEE_TIERS].title}
                  </p>
                  <p className="text-[10px] italic text-slate-500 leading-tight mb-2">
                    "{FEE_TIERS[fee as keyof typeof FEE_TIERS].vibe}"
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 leading-tight uppercase tracking-tighter">
                    Best for: {FEE_TIERS[fee as keyof typeof FEE_TIERS].bestFor}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Quick Market Overview</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['EUR', 'GBP', 'JPY', 'CAD'].filter(c => c !== fromCurrency && c !== toCurrency).slice(0, 4).map(code => {
                  return (
                    <div key={code} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group hover:border-[#B5945E]/30 transition-all cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <img src={`https://flagcdn.com/w40/${code === 'EUR' ? 'eu' : code === 'GBP' ? 'gb' : code === 'JPY' ? 'jp' : 'ca'}.png`} className="w-5 h-3.5 rounded-sm object-cover" alt="" />
                        <span className="text-[10px] font-black text-slate-900">{code}</span>
                      </div>
                      <p className="text-sm font-black text-slate-900">
                        {rate && currencies[code] ? ((amount * rate) / (rate / 0.85)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '---'}
                      </p>
                      <p className="text-[8px] font-bold text-[#B5945E] uppercase mt-1">Live Rate</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <Watchlist 
          pairs={trackedPairs}
          onRemove={removeTrackedPair}
          currentRate={rate}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
        />
      </main>

      <footer className="mt-16 w-full max-w-5xl py-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        <span>© 2026 SkillTest project</span>
      </footer>
    </div>
  );
};

export default CurrencyDashboard;
