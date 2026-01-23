import { CurrencyTrio } from './CurrencyTrio';
import { Currency } from '@/lib/currency';

interface InputFieldProps {
  label: string;
  question?: string;
  value: number | string;
  onChange: (value: number) => void;
  placeholder?: string;
  required?: boolean;
  step?: string;
  min?: number;
  max?: number;
  currency?: Currency;
  showCurrencyTrio?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoCalculateNote?: string;
}

export function InputField({
  label,
  question,
  value,
  onChange,
  placeholder,
  required = false,
  step = '1',
  min,
  max,
  currency,
  showCurrencyTrio = false,
  disabled = false,
  readOnly = false,
  autoCalculateNote,
}: InputFieldProps) {
  const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <label className="font-semibold text-foreground text-sm">
          {label}
        </label>
        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
          required 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-secondary text-secondary-foreground'
        }`}>
          {required ? 'REQUIRED' : 'OPTIONAL'}
        </span>
      </div>
      {question && (
        <span className="text-xs text-muted-foreground italic mb-1.5">
          💡 "{question}"
        </span>
      )}
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        placeholder={placeholder}
        step={step}
        min={min}
        max={max}
        disabled={disabled}
        readOnly={readOnly}
        className={`px-3 py-2.5 border-2 border-border rounded-lg bg-background text-foreground transition-all focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 ${
          readOnly ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      />
      {showCurrencyTrio && currency && numValue > 0 && (
        <CurrencyTrio amount={numValue} currency={currency} />
      )}
      {autoCalculateNote && (
        <div className="mt-2 p-2.5 bg-success/10 border border-success rounded-md text-xs text-success">
          ✓ {autoCalculateNote}
        </div>
      )}
    </div>
  );
}
