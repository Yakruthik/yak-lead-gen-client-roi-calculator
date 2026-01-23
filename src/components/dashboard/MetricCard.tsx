import { cn } from '@/lib/utils';
import { CurrencyTrio } from './CurrencyTrio';
import { Currency } from '@/lib/currency';

interface MetricCardProps {
  label: string;
  value: string;
  description: string;
  highlight?: 'red' | 'green' | 'blue';
  showCompulsory?: boolean;
  currency?: Currency;
  rawAmount?: number;
  showCurrencyTrio?: boolean;
}

export function MetricCard({
  label,
  value,
  description,
  highlight,
  showCompulsory = false,
  currency,
  rawAmount,
  showCurrencyTrio = false,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'bg-card p-6 rounded-xl border-2 border-border transition-all hover:border-secondary hover:shadow-lg relative',
        highlight === 'green' && 'border-l-[6px] border-l-success bg-gradient-to-br from-success/10 to-transparent',
        highlight === 'red' && 'border-l-[6px] border-l-primary bg-gradient-to-br from-primary/10 to-transparent',
        highlight === 'blue' && 'border-l-[6px] border-l-secondary bg-gradient-to-br from-secondary/10 to-transparent'
      )}
    >
      {showCompulsory && (
        <span className="absolute top-2 right-2 text-[10px] bg-primary text-primary-foreground px-2 py-1 rounded font-bold">
          🔴 KEY METRIC
        </span>
      )}
      <div className={cn(
        'text-xs uppercase tracking-wider mb-2',
        showCompulsory ? 'text-primary font-semibold' : 'text-muted-foreground'
      )}>
        {label}
      </div>
      <div className={cn(
        'text-3xl font-bold mb-2',
        highlight === 'red' ? 'text-primary' : 
        highlight === 'green' ? 'text-success' : 
        highlight === 'blue' ? 'text-secondary' : 'text-foreground'
      )}>
        {value}
      </div>
      {showCurrencyTrio && currency && rawAmount !== undefined && (
        <CurrencyTrio amount={rawAmount} currency={currency} />
      )}
      <div className="text-sm text-muted-foreground leading-relaxed mt-2">
        {description}
      </div>
    </div>
  );
}
