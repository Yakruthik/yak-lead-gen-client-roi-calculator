import { Currency } from '@/lib/currency';
interface HeaderProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}
const YAK_LOGO_URL = "https://lh7-rt.googleusercontent.com/docsz/AD_4nXfAGz4QCKpSGVfMTllCPPcifdHv8TQCtj6xw4FkZGpgZgKVIhtbivIJmBNy2fDKuke1EHgUagQ4NB8Tlc_ubkjcMc3VLHWg8OG3iLNe8_prWkkyoqPjO1p_Cb9W6N-kUzrXtITI?key=5SGvejtudrr2dDXojHrXXkev";
export function Header({
  currency,
  onCurrencyChange
}: HeaderProps) {
  return <>
      <header className="text-center mb-10">
        <div className="mb-5 flex items-center justify-center gap-4">
          <img src={YAK_LOGO_URL} alt="YAK Logo" className="h-[71px] w-auto" />
          <h1 className="text-4xl font-bold text-primary inline-block">YAK AI-SDR Lead Gen - Client ROI Calculator</h1>
        </div>
        <p className="text-muted-foreground text-base">
          Data-driven discovery dashboard for AI consultants & sales leaders
        </p>
      </header>

      <div className="mb-8 text-center">
        <label htmlFor="currency" className="font-semibold text-foreground mr-3 text-lg">
          Select Your Currency:
        </label>
        <select id="currency" value={currency} onChange={e => onCurrencyChange(e.target.value as Currency)} className="px-4 py-2.5 text-base border-2 border-secondary rounded-lg bg-card text-foreground cursor-pointer transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-secondary">
          <option value="INR">🇮🇳 INR (₹)</option>
          <option value="USD">🇺🇸 USD ($)</option>
          <option value="AED">🇦🇪 AED (د.إ)</option>
        </select>
      </div>
    </>;
}