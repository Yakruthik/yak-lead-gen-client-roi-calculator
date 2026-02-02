// Exchange rates - will be updated with real-time data
export const defaultRates = {
  INR: { symbol: '₹', toUSD: 1/92, toAED: 3.6725/92 },
  USD: { symbol: '$', toINR: 92, toAED: 3.6725 },
  AED: { symbol: 'د.إ', toINR: 92/3.6725, toUSD: 1/3.6725 }
};

// Store for live rates
let liveRates: typeof defaultRates | null = null;

export type Currency = 'INR' | 'USD' | 'AED';

// Fetch real-time rates from ExchangeRate-API (free tier: 1,500 requests/month)
export async function fetchLiveRates(): Promise<boolean> {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (!response.ok) throw new Error('Failed to fetch rates');
    
    const data = await response.json();
    const usdToInr = data.rates.INR;
    const usdToAed = data.rates.AED;
    
    liveRates = {
      INR: { symbol: '₹', toUSD: 1/usdToInr, toAED: usdToAed/usdToInr },
      USD: { symbol: '$', toINR: usdToInr, toAED: usdToAed },
      AED: { symbol: 'د.إ', toINR: usdToInr/usdToAed, toUSD: 1/usdToAed }
    };
    
    console.log('Live rates fetched:', { usdToInr, usdToAed });
    return true;
  } catch (error) {
    console.error('Failed to fetch live rates, using defaults:', error);
    return false;
  }
}

// Get current rates (live or default)
export function getRates() {
  return liveRates || defaultRates;
}

export function convertCurrency(amount: number, fromCur: Currency, toCur: Currency): number {
  const rates = getRates();
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
  const rates = getRates();
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
