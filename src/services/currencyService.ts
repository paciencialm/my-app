export const fetchLatestRates = async (base: string) => {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const data = await res.json();
    if (data.result !== 'success') throw new Error(data['error-type'] || 'Failed to fetch rates');
    return data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Network connection failed');
  }
};

export const detectLocalCurrency = async () => {
  const res = await fetch('https://ipapi.co/json/');
  const data = await res.json();
  return data.currency;
};
