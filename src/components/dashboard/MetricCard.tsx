import { cn } from '@/lib/utils';
import { CurrencyTrio } from './CurrencyTrio';
import { Currency } from '@/lib/currency';

interface MetricCardProps {
  label: string;
  value: string;
  description: string;
  highlight?: 'red' | 'green' | 'blue' | 'yellow';
  showCompulsory?: boolean;
  currency?: Currency;
  rawAmount?: number;
  showCurrencyTrio?: boolean;
  tooltipContent?: string;
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
  tooltipContent,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'bg-card p-6 rounded-xl border-2 border-border transition-all hover:border-secondary hover:shadow-lg relative',
        highlight === 'green' && 'border-l-[6px] border-l-success bg-gradient-to-br from-success/10 to-transparent',
        highlight === 'red' && 'border-l-[6px] border-l-destructive bg-gradient-to-br from-destructive/10 to-transparent',
        highlight === 'blue' && 'border-l-[6px] border-l-secondary bg-gradient-to-br from-secondary/10 to-transparent',
        highlight === 'yellow' && 'border-l-[6px] border-l-warning bg-gradient-to-br from-warning/10 to-transparent'
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
        highlight === 'red' ? 'text-destructive' : 
        highlight === 'green' ? 'text-success' : 
        highlight === 'blue' ? 'text-secondary' : 
        highlight === 'yellow' ? 'text-warning' : 'text-foreground'
      )}>
        {value}
      </div>
      {tooltipContent && (
        <div className={cn(
          'text-xs font-semibold px-2 py-1 rounded inline-block mb-2',
          highlight === 'green' && 'bg-success/20 text-success',
          highlight === 'yellow' && 'bg-warning/20 text-warning',
          highlight === 'red' && 'bg-destructive/20 text-destructive'
        )}>
          {tooltipContent}
        </div>
      )}
      {showCurrencyTrio && currency && rawAmount !== undefined && (
        <CurrencyTrio amount={rawAmount} currency={currency} />
      )}
      <div className="text-sm text-muted-foreground leading-relaxed mt-2">
        {description}
      </div>
    </div>
  );
}
