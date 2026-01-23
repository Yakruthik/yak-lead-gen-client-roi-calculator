// Exchange rates (Jan 2026)
export const rates = {
  INR: { symbol: '₹', toUSD: 0.01155, toAED: 0.04239 },
  USD: { symbol: '$', toINR: 86.54, toAED: 3.67 },
  AED: { symbol: 'د.إ', toINR: 23.58, toUSD: 0.272 }
};

export type Currency = 'INR' | 'USD' | 'AED';

export function convertCurrency(amount: number, fromCur: Currency, toCur: Currency): number {
  if (fromCur === toCur) return amount;
  if (fromCur === 'INR' && toCur === 'USD') return amount * rates.INR.toUSD;
  if (fromCur === 'INR' && toCur === 'AED') return amount * rates.INR.toAED;
  if (fromCur === 'USD' && toCur === 'INR') return amount * rates.USD.toINR;
  if (fromCur === 'USD' && toCur === 'AED') return amount * rates.USD.toAED;
  if (fromCur === 'AED' && toCur === 'INR') return amount * rates.AED.toINR;
  if (fromCur === 'AED' && toCur === 'USD') return amount * rates.AED.toUSD;
  return amount;
}

export function formatCurrency(amount: number, currency: Currency): string {
  if (!amount || isNaN(amount) || !isFinite(amount)) return '—';
  const abs = Math.abs(amount);
  const symbol = rates[currency].symbol;
  
  if (currency === 'INR') {
    // Indian format: Crores and Lakhs
    if (abs >= 10000000) {
      return symbol + (amount / 10000000).toFixed(2) + 'Cr';
    } else if (abs >= 100000) {
      return symbol + (amount / 100000).toFixed(2) + 'L';
    } else if (abs >= 1000) {
      return symbol + (amount / 1000).toFixed(1) + 'K';
    }
    return symbol + Math.round(amount);
  } else {
    // USD and AED: Thousands and Millions
    if (abs >= 1000000) {
      return symbol + (amount / 1000000).toFixed(2) + 'M';
    } else if (abs >= 1000) {
      return symbol + (amount / 1000).toFixed(1) + 'k';
    }
    return symbol + Math.round(amount);
  }
}

export function getOtherCurrencies(current: Currency): Currency[] {
  return (['INR', 'USD', 'AED'] as Currency[]).filter(c => c !== current);
}
