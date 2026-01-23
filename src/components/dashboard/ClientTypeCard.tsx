import { cn } from '@/lib/utils';
import { ClientType } from '@/hooks/useCalculator';

interface ClientTypeCardProps {
  type: ClientType;
  title: string;
  range: string;
  reason: string;
  selected: boolean;
  onSelect: () => void;
}

export function ClientTypeCard({ title, range, reason, selected, onSelect }: ClientTypeCardProps) {
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
