import { CalculatorInputs, CalculatorOutputs, ClientType } from '@/hooks/useCalculator';
import { InputField } from './InputField';
import { MetricCard } from './MetricCard';
import { ClientTypeCard } from './ClientTypeCard';
import { Currency, formatCurrency, rates } from '@/lib/currency';

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

      {/* Pricing Recommendations */}
      <h3 className="text-success font-semibold text-lg mt-6 mb-4">💵 My Service Pricing Recommendation</h3>
      <div className="bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 border-l-4 border-l-warning rounded-lg p-4 mb-4">
        <div className="font-bold text-warning mb-1.5">📌 Suggested Monthly Retainer Range</div>
        <div className="text-muted-foreground">
          <strong className="text-foreground">
            Range: {formatCurrency(outputs.retainerLow, currency)} - {formatCurrency(outputs.retainerHigh, currency)} per month
          </strong>
          <br />
          <small>(Based on your {getClientTypeLabel(selectedClientType)} industry profile, 65% of recommended budget)</small>
        </div>
      </div>

      <div className="bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 border-l-4 border-l-warning rounded-lg p-4 mb-6">
        <div className="font-bold text-warning mb-1.5">📌 Suggested Per-Meeting Fee (PPA) Range</div>
        <div className="text-muted-foreground">
          <strong className="text-foreground">
            Range: {formatCurrency(outputs.ppaLow, currency)} - {formatCurrency(outputs.ppaHigh, currency)} per SQL meeting
          </strong>
          <br />
          <small>(35% of recommended budget)</small>
        </div>
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
