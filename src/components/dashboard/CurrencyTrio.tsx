import { Currency, convertCurrency, formatCurrency, getOtherCurrencies } from '@/lib/currency';

interface CurrencyTrioProps {
  amount: number;
  currency: Currency;
}

export function CurrencyTrio({ amount, currency }: CurrencyTrioProps) {
  const otherCurrencies = getOtherCurrencies(currency);
  
  return (
    <div className="grid grid-cols-3 gap-1.5 mt-1.5 text-xs text-muted-foreground">
      {otherCurrencies.map((cur) => (
        <div 
          key={cur} 
          className="px-2 py-1 bg-background rounded border border-border text-center"
        >
          {formatCurrency(convertCurrency(amount, currency, cur), cur)}
        </div>
      ))}
    </div>
  );
}
