import { cn } from '@/lib/utils';
import { ClientType } from '@/hooks/useCalculator';

interface ClientTypeCardProps {
  type: ClientType;
  title: string;
  range?: string;
  reason?: string;
  selected: boolean;
  onSelect: () => void;
}

export function ClientTypeCard({ title, range, reason, selected, onSelect }: ClientTypeCardProps) {
  // Simplified version without range/reason for client-facing calculator
  if (!range && !reason) {
    return (
      <button
        onClick={onSelect}
        className={cn(
          'p-3 rounded-lg border-2 text-center transition-all text-sm font-semibold',
          selected
            ? 'border-success bg-success/20 text-success'
            : 'border-border bg-card hover:border-success/50 hover:bg-success/5 text-muted-foreground hover:text-foreground'
        )}
      >
        {title}
      </button>
    );
  }

  // Full version with range and reason
  return (
    <div
      onClick={onSelect}
      className={cn(
        'bg-background border-2 border-border p-5 rounded-lg cursor-pointer transition-all text-center hover:border-secondary hover:shadow-lg hover:-translate-y-0.5',
        selected && 'border-primary bg-primary/15 shadow-lg shadow-primary/20'
      )}
    >
      <div className="font-bold text-foreground text-sm mb-1.5">{title}</div>
      <div className={cn(
        'text-sm font-bold mb-1.5',
        selected ? 'text-primary' : 'text-success'
      )}>
        {range}
      </div>
      <div className="text-xs text-muted-foreground leading-relaxed">{reason}</div>
    </div>
  );
}
