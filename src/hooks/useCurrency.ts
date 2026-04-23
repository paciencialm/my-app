import { useState, useEffect, useCallback } from 'react';
import { fetchLatestRates, detectLocalCurrency } from '../services/currencyService';
import type { TrackedPair } from '../types/currency';

export const useCurrency = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('PHP');
  const [rate, setRate] = useState<number | null>(null);
  const [currencies, setCurrencies] = useState<Record<string, string>>({});
  const [fee, setFee] = useState<number>(2);
  const [selectedProvider, setSelectedProvider] = useState<string>('Czarina Foreign Exchange');
  const [trackedPairs, setTrackedPairs] = useState<TrackedPair[]>([]);
  const [isSwapping, setIsSwapping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Geo-detection
  useEffect(() => {
    detectLocalCurrency()
      .then(currency => {
        if (currency && currency !== 'USD') setFromCurrency(currency);
      })
      .catch(err => console.error('Geo-detection failed:', err));
  }, []);

  useEffect(() => {
    fetchLatestRates('USD')
      .then(data => {
        const codes = Object.keys(data.rates);
        const nameMap: Record<string, string> = {
          USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', PHP: 'Philippine Peso',
          JPY: 'Japanese Yen', CAD: 'Canadian Dollar', AUD: 'Australian Dollar'
        };
        const mapped: Record<string, string> = {};
        codes.forEach(c => { mapped[c] = nameMap[c] || c; });
        setCurrencies(mapped);
      })
      .catch(() => {
        setCurrencies({ USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', PHP: 'Philippine Peso' });
      });
  }, []);

  const fetchData = useCallback(async () => {
    if (!fromCurrency || !toCurrency) return;
    if (fromCurrency === toCurrency) {
      setRate(1);
      setError(null);
      return;
    }
    try {
      const data = await fetchLatestRates(fromCurrency);
      if (data.rates[toCurrency]) {
        setRate(data.rates[toCurrency]);
        setError(null);
      } else {
        throw new Error(`Unsupported currency: ${toCurrency}`);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to update rates');
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const clearError = () => setError(null);

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setFromCurrency(toCurrency);
      setToCurrency(fromCurrency);
      setIsSwapping(false);
    }, 300);
  };

  const addTrackedPair = () => {
    const id = `${fromCurrency}-${toCurrency}`;
    if (!trackedPairs.find((p) => p.id === id)) {
      setTrackedPairs([...trackedPairs, { id, from: fromCurrency, to: toCurrency }]);
    }
  };

  const removeTrackedPair = (id: string) => {
    setTrackedPairs(trackedPairs.filter((p) => p.id !== id));
  };

  const convertedAmount = rate ? amount * rate : 0;
  const feeAmount = (convertedAmount * fee) / 100;
  const totalPayout = convertedAmount + feeAmount;

  return {
    amount, setAmount,
    fromCurrency, setFromCurrency,
    toCurrency, setToCurrency,
    rate, currencies,
    fee, setFee,
    selectedProvider, setSelectedProvider,
    trackedPairs, addTrackedPair, removeTrackedPair,
    isSwapping, handleSwap,
    convertedAmount, feeAmount, totalPayout,
    error, clearError, retry: fetchData
  };
};
