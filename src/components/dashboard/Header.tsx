import { useState, useEffect } from 'react';
import { Currency, getRatesMetadata, isUsingLiveRates, fetchLiveRates } from '@/lib/currency';
import { RefreshCw } from 'lucide-react';
import yakLogo from '@/assets/yak-logo.png';

interface HeaderProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export function Header({
  currency,
  onCurrencyChange
}: HeaderProps) {
  const [ratesInfo, setRatesInfo] = useState<{ usdToInr: number; usdToAed: number; fetchedAt: Date } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Check for rates metadata on mount and whenever it might change
    const checkRates = () => {
      const metadata = getRatesMetadata();
      if (metadata) {
        setRatesInfo(metadata);
      }
    };
    
    checkRates();
    // Re-check after a short delay to catch initial fetch
    const timer = setTimeout(checkRates, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefreshRates = async () => {
    setIsRefreshing(true);
    await fetchLiveRates();
    const metadata = getRatesMetadata();
    if (metadata) {
      setRatesInfo(metadata);
    }
    setIsRefreshing(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  return <>
      <header className="text-center mb-10">
        <div className="mb-5 flex items-center justify-center gap-4">
          <img src={yakLogo} alt="YAK Logo" className="h-[71px] w-auto" />
          <h1 className="text-4xl font-bold text-primary inline-block">YAK AI-SDR Lead Gen - Client ROI Calculator</h1>
        </div>
        <p className="text-muted-foreground text-base">
          Data-driven discovery dashboard for AI consultants & sales leaders
        </p>
      </header>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-3 px-4 py-2.5 border-2 border-secondary rounded-lg bg-card">
          <label htmlFor="currency" className="font-semibold text-foreground text-lg">
            Currency:
          </label>
          <select 
            id="currency" 
            value={currency} 
            onChange={e => onCurrencyChange(e.target.value as Currency)} 
            className="px-3 py-1.5 text-base border border-border rounded bg-background text-foreground cursor-pointer transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="INR">🇮🇳 INR (₹)</option>
            <option value="USD">🇺🇸 USD ($)</option>
            <option value="AED">🇦🇪 AED (د.إ)</option>
          </select>
        </div>

        {ratesInfo && (
          <div className="flex items-center gap-3 px-4 py-2.5 border-2 border-secondary rounded-lg bg-card text-sm">
            <span className="text-muted-foreground">Live rates:</span>
            <span className="font-semibold text-foreground">
              1 USD = {ratesInfo.usdToInr.toFixed(2)} INR = {ratesInfo.usdToAed.toFixed(4)} AED
            </span>
            <button
              onClick={handleRefreshRates}
              disabled={isRefreshing}
              className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
              title="Refresh rates"
            >
              <RefreshCw className={`h-4 w-4 text-muted-foreground ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <span className="text-muted-foreground text-xs">
              @ {formatTime(ratesInfo.fetchedAt)}
            </span>
          </div>
        )}
      </div>
    </>;
}