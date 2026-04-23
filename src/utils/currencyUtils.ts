export const getFlagUrl = (code: string) => {
  const mapping: Record<string, string> = {
    USD: 'us', EUR: 'eu', GBP: 'gb', JPY: 'jp', CAD: 'ca', AUD: 'au', CHF: 'ch', CNY: 'cn', INR: 'in', NZD: 'nz', 
    BRL: 'br', RUB: 'ru', KRW: 'kr', SGD: 'sg', HKD: 'hk', MXN: 'mx', IDR: 'id', TRY: 'tr', ZAR: 'za', PHP: 'ph',
    THB: 'th', MYR: 'my', VND: 'vn', ILS: 'il', DKK: 'dk', NOK: 'no', SEK: 'se', PLN: 'pl', HUF: 'hu', CZK: 'cz'
  };
  const countryCode = mapping[code] || 'un';
  return `https://flagcdn.com/w40/${countryCode}.png`;
};

export const PROVIDERS = [
  'Czarina Foreign Exchange',
  'Sanry’s Money Changer',
  'Tivoli Money Exchange',
  'Cebuana Lhuillier',
  'BDO Unibank (Foreign Exchange)'
];

export const FEE_TIERS = {
  2: {
    title: 'The "Budget Saver"',
    vibe: "I'm not in a rush, I just want the best deal.",
    bestFor: 'Students, casual users, or large transfers.'
  },
  5: {
    title: 'The "Steady Standard"',
    vibe: 'Give me the reliable middle ground.',
    bestFor: 'Monthly bills, regular subscriptions, or steady transfers.'
  },
  10: {
    title: 'The "Priority VIP"',
    vibe: 'Time is money—just get it done now.',
    bestFor: 'Emergencies, business-critical payments, or whales.'
  }
} as const;

export const POPULAR_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY'];
