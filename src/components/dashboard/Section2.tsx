import { CalculatorInputs, CalculatorOutputs, ClientType } from '@/hooks/useCalculator';
import { InputField } from './InputField';
import { MetricCard } from './MetricCard';
import { ClientTypeCard } from './ClientTypeCard';
import { Currency, formatCurrency, rates } from '@/lib/currency';

// Industry ranges for explanation text
const INDUSTRY_RANGES = {
  saas: { low: 0.075, high: 0.175 },
  agency: { low: 0.05, high: 0.10 },
  industrial: { low: 0.03, high: 0.08 },
  consulting: { low: 0.06, high: 0.12 },
  ecommerce: { low: 0.02, high: 0.06 }
};

// Floor values in local currency (based on $1000 USD)
const FLOOR_VALUES: Record<Currency, number> = {
  USD: 1000,
  INR: 92000,
  AED: 3673
};
interface Section2Props {
  inputs: CalculatorInputs;
  outputs: CalculatorOutputs;
  updateInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  currency: Currency;
  selectedClientType: ClientType;
  setSelectedClientType: (type: ClientType) => void;
}

const clientTypes: { type: ClientType; title: string; range: string; reason: string }[] = [
  { type: 'saas', title: 'B2B SaaS', range: '7.5% – 17.5% of AACV', reason: 'High margins (80%+), can afford competitive CAC budgets' },
  { type: 'agency', title: 'B2B Service / Agency', range: '5% – 10% of AACV', reason: 'Lower margins (30-50%), tighter CAC budget constraints' },
  { type: 'industrial', title: 'Industrial / Manufacturing', range: '3% – 8% of AACV', reason: 'High AACVs (millions), low marketing maturity' },
  { type: 'consulting', title: 'Consulting / Prof Services', range: '6% – 12% of AACV', reason: 'Project-based revenue, need consistent pipeline' },
  { type: 'ecommerce', title: 'E-commerce / DTC', range: '2% – 6% of AACV', reason: 'Thin margins (10-25%), high volume, micro-CAC model' },
];

// CAC benchmarks by client type (from reference table)
const cacBenchmarks: Record<string, string> = {
  saas: 'Total Benchmark: 25-35% (includes salaries, ads, tools, etc.)',
  agency: 'Total Benchmark: 15-25% (includes salaries, ads, tools, etc.)',
  industrial: 'Total Benchmark: 5-15% (includes salaries, ads, tools, etc.)',
  consulting: 'Total Benchmark: 15-25% (includes salaries, ads, tools, etc.)',
  ecommerce: 'Total Benchmark: 10-20% (includes salaries, ads, tools, etc.)',
};

// LTV:CAC ratio hints by client type
const ltvCacHints: Record<string, string> = {
  saas: 'Healthy = 3:1 or higher. Below 2:1 = need to reduce CAC or improve retention',
  agency: 'Healthy = 4:1 or higher. Below 3:1 = need to reduce CAC or improve retention',
  industrial: 'Healthy = 4:1 or higher. Below 3:1 = need to reduce CAC or improve retention',
  consulting: 'Healthy = 3:1 to 5:1. Below 2.5:1 = need to reduce CAC or improve retention',
  ecommerce: 'Healthy = 5:1 or higher. Below 4:1 = need to reduce CAC or improve retention',
};

function getClientTypeLabel(type: ClientType): string {
  const labels: Record<string, string> = {
    saas: 'B2B SaaS',
    agency: 'B2B Service/Agency',
    industrial: 'Industrial/Manufacturing',
    consulting: 'Consulting/Prof Services',
    ecommerce: 'E-commerce/DTC'
  };
  return labels[type || 'saas'] || 'B2B SaaS';
}

export function Section2({ inputs, outputs, updateInput, currency, selectedClientType, setSelectedClientType }: Section2Props) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-secondary">
        <span className="text-3xl">📊</span>
        <h2 className="text-2xl font-bold text-primary">Section 2: Business Intelligence & Compulsory Callouts</h2>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 mb-5 border-l-4 border-l-secondary">
        🔴 <strong className="text-primary">KEY METRICS</strong> = Read these aloud to your client. They understand your value immediately.
      </div>

      {/* Client Type Selector from v5 */}
      <div className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20 border-l-4 border-l-success rounded-lg p-5 mb-6">
        <h4 className="text-success font-semibold mb-3 text-lg">🎯 Which Client Type Are You Speaking With?</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Select your prospect's industry to see pricing recommendations tailored to their CAC tolerance & margins:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {clientTypes.map((ct) => (
            <ClientTypeCard
              key={ct.type}
              type={ct.type}
              title={ct.title}
              range={ct.range}
              reason={ct.reason}
              selected={selectedClientType === ct.type}
              onSelect={() => setSelectedClientType(ct.type)}
            />
          ))}
        </div>
      </div>

      {/* Contract & Lifetime Value Analysis - Matching reference image */}
      <h3 className="text-success font-semibold text-lg mt-6 mb-4">💰 Contract & Lifetime Value</h3>
      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <MetricCard
          label="🔴 ANNUAL AVG CONTRACT VALUE (AACV)"
          value={formatCurrency(outputs.calculatedAacv, currency)}
          description="Avg annual revenue from ONE client (TCV ÷ Contract Years)"
          highlight="red"
          showCompulsory
          currency={currency}
          rawAmount={outputs.calculatedAacv}
          showCurrencyTrio
        />
        <MetricCard
          label="CLIENT LIFETIME VALUE (LTV)"
          value={formatCurrency(outputs.ltv, currency)}
          description="Total profit expected from one client over their lifespan (AACV × Lifetime)"
          currency={currency}
          rawAmount={outputs.ltv}
          showCurrencyTrio
        />
      </div>

      {/* CAC & Efficiency - Matching reference image */}
      <h3 className="text-success font-semibold text-lg mt-6 mb-4">🎯 CAC & Efficiency</h3>
      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <MetricCard
          label="CLIENT'S CURRENT ANNUAL CAC"
          value={formatCurrency(outputs.calculatedCAC, currency)}
          description="What they currently spend to acquire ONE client (S&M Budget ÷ Clients Acquired)"
          currency={currency}
          rawAmount={outputs.calculatedCAC}
          showCurrencyTrio
        />
        <MetricCard
          label="CAC AS % OF AACV"
          value={outputs.cacPercent.toFixed(1) + '%'}
          description={cacBenchmarks[selectedClientType || 'saas']}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <MetricCard
          label="LTV:CAC RATIO"
          value={outputs.ltvCacRatio + ':1'}
          description={ltvCacHints[selectedClientType || 'saas']}
        />
        <MetricCard
          label="🔴 PIPELINE VALUE PER MEETING"
          value={formatCurrency(outputs.valuePerMeeting, currency)}
          description="Each new SQL meeting is worth this much in potential AACV (AACV ÷ SQLs-Meetings-to-Win)"
          highlight="red"
          showCompulsory
          currency={currency}
          rawAmount={outputs.valuePerMeeting}
          showCurrencyTrio
        />
      </div>

      {/* Pipeline & Gap Analysis - Matching reference image */}
      <h3 className="text-success font-semibold text-lg mt-6 mb-4">🔧 Pipeline & Gap Analysis</h3>
      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <MetricCard
          label="TOTAL ANNUAL MEETINGS NEEDED"
          value={Math.round(outputs.totalMeetingsNeeded) + ' meetings/yr'}
          description="To hit growth target + replace churn (Target Deals × SQLs-Meetings-to-Win + Churn Deals × SQLs-Meetings-to-Win)"
        />
        <MetricCard
          label="🔴 MONTHLY GAP IN SQLS"
          value={outputs.monthlyGap.toFixed(1) + ' SQLs/mo'}
          description="Additional NEW Qualified First Meetings (SQLs) needed per month to hit target"
          highlight="red"
          showCompulsory
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <MetricCard
          label="CLIENT CHURN REVENUE LOSS (ANNUAL)"
          value={formatCurrency(outputs.churnRevenue, currency)}
          description="Revenue lost annually from client churn. Must replace to stay flat"
          currency={currency}
          rawAmount={outputs.churnRevenue}
          showCurrencyTrio
        />
        <MetricCard
          label="🔴 CLIENT'S REVENUE POTENTIAL (ANNUAL GAP)"
          value={formatCurrency(outputs.revenuePotential, currency)}
          description="Estimated new revenue if you fill the monthly SQL gap for one year"
          highlight="red"
          showCompulsory
          currency={currency}
          rawAmount={outputs.revenuePotential}
          showCurrencyTrio
        />
      </div>

      {/* Pricing Recommendations - 3 Tier System */}
      <h3 className="text-success font-semibold text-lg mt-6 mb-4">🤑 My Service Pricing Recommendation</h3>
      
      {/* Disqualification Warning */}
      {outputs.pricingTiers.disqualified && (
        <div className="bg-destructive/10 border border-destructive/20 border-l-4 border-l-destructive rounded-lg p-4 mb-4">
          <div className="font-bold text-destructive mb-1">⚠️ Disqualification Warning</div>
          <div className="text-sm text-destructive/80">
            {outputs.pricingTiers.disqualificationReason}
          </div>
        </div>
      )}

      {/* 3-Tier Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* Lite Tier */}
        <div className="bg-gradient-to-br from-muted/50 to-muted/30 border border-border rounded-lg p-4 relative">
          <div className="absolute top-2 right-2 bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">LITE</div>
          <div className="font-bold text-primary mb-2">{outputs.pricingTiers.lite.name}</div>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-muted-foreground">Monthly Retainer</span>
              <div className="text-lg font-semibold text-foreground">{formatCurrency(outputs.pricingTiers.lite.retainer, currency)}</div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Per-Meeting Fee (PPA)</span>
              <div className="text-lg font-semibold text-foreground">{formatCurrency(outputs.pricingTiers.lite.ppa, currency)}</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-3 border-t border-border pt-2">
            {outputs.pricingTiers.lite.description}
          </div>
          <div className="text-xs text-muted-foreground mt-1 italic">
            (30% Retainer / 70% PPA)
          </div>
        </div>

        {/* Standard Tier - Highlighted */}
        <div className="bg-gradient-to-br from-success/20 to-success/10 border-2 border-success rounded-lg p-4 relative ring-2 ring-success/30">
          <div className="absolute top-2 right-2 bg-success text-success-foreground text-xs px-2 py-0.5 rounded font-semibold">RECOMMENDED</div>
          <div className="font-bold text-success mb-2">{outputs.pricingTiers.standard.name}</div>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-muted-foreground">Monthly Retainer</span>
              <div className="text-lg font-semibold text-foreground">{formatCurrency(outputs.pricingTiers.standard.retainer, currency)}</div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Per-Meeting Fee (PPA)</span>
              <div className="text-lg font-semibold text-foreground">{formatCurrency(outputs.pricingTiers.standard.ppa, currency)}</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-3 border-t border-success/30 pt-2">
            {outputs.pricingTiers.standard.description}
          </div>
          <div className="text-xs text-muted-foreground mt-1 italic">
            (50% Retainer / 50% PPA)
          </div>
        </div>

        {/* Aggressive Tier */}
        <div className="bg-gradient-to-br from-warning/20 to-warning/10 border border-warning/30 rounded-lg p-4 relative">
          <div className="absolute top-2 right-2 bg-warning text-warning-foreground text-xs px-2 py-0.5 rounded">ENTERPRISE</div>
          <div className="font-bold text-warning mb-2">{outputs.pricingTiers.aggressive.name}</div>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-muted-foreground">Monthly Retainer</span>
              <div className="text-lg font-semibold text-foreground">{formatCurrency(outputs.pricingTiers.aggressive.retainer, currency)}</div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Per-Meeting Fee (PPA)</span>
              <div className="text-lg font-semibold text-foreground">{formatCurrency(outputs.pricingTiers.aggressive.ppa, currency)}</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-3 border-t border-warning/30 pt-2">
            {outputs.pricingTiers.aggressive.description}
          </div>
          <div className="text-xs text-muted-foreground mt-1 italic">
            (70% Retainer / 30% PPA)
          </div>
        </div>
      </div>

      {/* Pricing Algorithm Explanation */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6 text-sm">
        <div className="font-semibold text-primary mb-2">📊 How These Prices Are Calculated</div>
        <ul className="text-muted-foreground space-y-1 list-disc list-inside">
          <li><strong>Retainer Anchor:</strong> Based on {getClientTypeLabel(selectedClientType)} deal velocity ({outputs.monthlyGap > 0 ? 'adjusted for pipeline gap' : 'base rate'}) × industry CAC floor ({(INDUSTRY_RANGES[selectedClientType || 'saas'].low * 100).toFixed(1)}%)</li>
          <li><strong>PPA Calculation:</strong> 35% of max cost-per-meeting ({(INDUSTRY_RANGES[selectedClientType || 'saas'].high * 100).toFixed(1)}% ceiling) with volume discounts applied</li>
          <li><strong>Guardrails:</strong> 10% cheaper than current CAC, capped at 50% of S&M budget</li>
          <li><strong>Floor Protection:</strong> Minimum {formatCurrency(FLOOR_VALUES[currency], currency)} retainer to ensure service viability</li>
        </ul>
      </div>

      {/* Your Service Pricing */}
      <h3 className="text-success font-semibold text-lg mt-6 mb-4">💰 Your Service Pricing & ROI Impact</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <InputField
          label="Your Proposed Monthly Retainer"
          question="What monthly fee are you quoting?"
          value={inputs.yourRetainer}
          onChange={(v) => updateInput('yourRetainer', v)}
          placeholder="e.g., 60000"
          currency={currency}
          showCurrencyTrio
        />
        <InputField
          label="Your Per-Meeting Fee (PPA)"
          question="Optional: Fee per qualified SQL meeting"
          value={inputs.yourPPA}
          onChange={(v) => updateInput('yourPPA', v)}
          placeholder="e.g., 8000"
          currency={currency}
          showCurrencyTrio
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <MetricCard
          label="CLIENT ANNUAL COST (MY SERVICE)"
          value={formatCurrency(outputs.annualCost, currency)}
          description={`(Retainer × 12) + (PPA × Monthly Gap in SQLs × 12)`}
          highlight="blue"
          showCompulsory
          currency={currency}
          rawAmount={outputs.annualCost}
          showCurrencyTrio
        />
        <MetricCard
          label="BREAKEVEN (NUMBER OF CLIENTS)"
          value={outputs.breakeven + ' clients'}
          description={`Close just ${outputs.breakeven} deals to cover my entire annual fee. The rest is pure profit.`}
          highlight="blue"
          showCompulsory
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <MetricCard
          label="MY EFFECTIVE TAKE RATE"
          value={outputs.effectiveTakeRate.toFixed(1) + '%'}
          description="Of all the new revenue I generate, what % do I keep?"
          highlight={outputs.effectiveTakeRate < 15 ? 'green' : outputs.effectiveTakeRate <= 25 ? 'yellow' : 'red'}
          tooltipContent={
            outputs.effectiveTakeRate < 15 
              ? 'Healthy (Sustainable)' 
              : outputs.effectiveTakeRate <= 25 
                ? 'Aggressive (High Value)' 
                : 'Risk (Client Churn Likely)'
          }
        />
        <MetricCard
          label="MY COST PER SQL MEETING"
          value={formatCurrency(outputs.costPerSQL, currency)}
          description="Annual cost ÷ estimated SQL meetings provided"
          currency={currency}
          rawAmount={outputs.costPerSQL}
          showCurrencyTrio
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <MetricCard
          label="NET REVENUE (AFTER MY COST)"
          value={formatCurrency(outputs.netRevenue, currency)}
          description="New revenue from gap minus my annual cost"
          highlight="green"
          showCompulsory
          currency={currency}
          rawAmount={outputs.netRevenue}
          showCurrencyTrio
        />
        <MetricCard
          label="ROI RATIO"
          value={outputs.roi + 'x'}
          description={`For every ${rates[currency].symbol}1 spent on my service, you make this much revenue`}
          highlight="green"
          showCompulsory
        />
      </div>

      {/* Budget Health Check */}
      {outputs.budgetHealthStatus !== 'none' && (
        <div className={`p-4 rounded-lg border ${
          outputs.budgetHealthStatus === 'warning' 
            ? 'bg-destructive/10 border-destructive/20 text-destructive' 
            : 'bg-success/10 border-success/20 text-success'
        }`}>
          {outputs.budgetHealthStatus === 'warning' 
            ? '⚠️ Warning: Cost exceeds 50% of reported budget.'
            : '✅ Budget Safe: Fits within reported spend.'}
        </div>
      )}
    </section>
  );
}
