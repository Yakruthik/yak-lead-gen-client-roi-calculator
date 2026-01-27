import { CalculatorOutputs, ClientType } from '@/hooks/useCalculator';
import { MetricCard } from './MetricCard';
import { Currency, formatCurrency } from '@/lib/currency';

interface Section2Props {
  outputs: CalculatorOutputs;
  currency: Currency;
  selectedClientType: ClientType;
}

// CAC benchmarks by client type
const cacBenchmarks: Record<string, string> = {
  saas: 'Total Benchmark: 25-35% (includes salaries, ads, tools, etc.)',
  agency: 'Total Benchmark: 15-25% (includes salaries, ads, tools, etc.)',
  industrial: 'Total Benchmark: 5-15% (includes salaries, ads, tools, etc.)',
  consulting: 'Total Benchmark: 15-25% (includes salaries, ads, tools, etc.)',
  ecommerce: 'Total Benchmark: 10-20% (includes salaries, ads, tools, etc.)',
};

// LTV:CAC ratio thresholds by client type
const ltvCacThresholds: Record<string, { min: number; hint: string }> = {
  saas: { min: 3, hint: 'Healthy = 3:1 or higher. Below 2:1 = need to reduce CAC or improve retention' },
  agency: { min: 4, hint: 'Healthy = 4:1 or higher. Below 3:1 = need to reduce CAC or improve retention' },
  industrial: { min: 4, hint: 'Healthy = 4:1 or higher. Below 3:1 = need to reduce CAC or improve retention' },
  consulting: { min: 3, hint: 'Healthy = 3:1 to 5:1. Below 2.5:1 = need to reduce CAC or improve retention' },
  ecommerce: { min: 5, hint: 'Healthy = 5:1 or higher. Below 4:1 = need to reduce CAC or improve retention' },
};

export function Section2({ outputs, currency, selectedClientType }: Section2Props) {
  const clientType = selectedClientType || 'saas';
  const { min: ltvCacMin, hint: ltvCacHint } = ltvCacThresholds[clientType];
  const ratioValue = parseFloat(outputs.ltvCacRatio) || 0;
  const isLtvCacHealthy = ratioValue >= ltvCacMin;
  const hasGap = outputs.monthlyGap > 0;

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-secondary">
        <span className="text-3xl">📊</span>
        <h2 className="text-2xl font-bold text-primary">Your Business Intelligence Report</h2>
      </div>

      {/* Subsection 2.1: Contract & Lifetime Value */}
      <h3 className="text-success font-semibold text-lg mt-6 mb-4">💰 Contract & Lifetime Value</h3>
      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <MetricCard
          label="ANNUAL AVG CONTRACT VALUE (AACV)"
          value={formatCurrency(outputs.calculatedAacv, currency)}
          description="Avg annual revenue from ONE client"
          currency={currency}
          rawAmount={outputs.calculatedAacv}
          showCurrencyTrio
        />
        <MetricCard
          label="CLIENT LIFETIME VALUE (LTV)"
          value={formatCurrency(outputs.ltv, currency)}
          description="Ballpark estimate – consider reducing CAC or improving retention"
          currency={currency}
          rawAmount={outputs.ltv}
          showCurrencyTrio
        />
      </div>

      {/* Subsection 2.2: CAC & Efficiency */}
      <h3 className="text-success font-semibold text-lg mt-6 mb-4">🎯 CAC & Efficiency</h3>
      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <MetricCard
          label="CURRENT ANNUAL CAC"
          value={formatCurrency(outputs.calculatedCAC, currency)}
          description="What you currently spend to acquire ONE client"
          currency={currency}
          rawAmount={outputs.calculatedCAC}
          showCurrencyTrio
        />
        <MetricCard
          label="CAC AS % OF AACV"
          value={outputs.cacPercent.toFixed(1) + '%'}
          description={cacBenchmarks[clientType]}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <MetricCard
          label="LTV:CAC RATIO"
          value={outputs.ltvCacRatio + ':1'}
          description={ltvCacHint}
          highlight={outputs.ltvCacRatio === '—' ? undefined : (isLtvCacHealthy ? 'green' : 'red')}
        />
        <MetricCard
          label="PIPELINE VALUE PER MEETING"
          value={formatCurrency(outputs.valuePerMeeting, currency)}
          description="Each new SQL meeting is potentially worth this much revenue"
          currency={currency}
          rawAmount={outputs.valuePerMeeting}
          showCurrencyTrio
        />
      </div>

      {/* Subsection 2.3: Pipeline & Gap Analysis */}
      <h3 className="text-success font-semibold text-lg mt-6 mb-4">🔧 Pipeline & Gap Analysis</h3>
      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <MetricCard
          label="TOTAL ANNUAL MEETINGS NEEDED"
          value={Math.round(outputs.totalMeetingsNeeded) + ' meetings/yr'}
          description="To hit growth target, requires x/year"
        />
        <MetricCard
          label="MONTHLY GAP IN SQLS"
          value={outputs.monthlyGap.toFixed(1) + ' SQLs/mo'}
          description="Additional qualified meetings needed per month to hit target"
          highlight={hasGap ? 'red' : 'green'}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <MetricCard
          label="CHURN REVENUE LOSS (ANNUAL)"
          value={formatCurrency(outputs.churnRevenue, currency)}
          description="Revenue lost annually from client churn. Must replace to stay flat"
          currency={currency}
          rawAmount={outputs.churnRevenue}
          showCurrencyTrio
        />
        <MetricCard
          label="CLIENT'S REVENUE POTENTIAL (ANNUAL GAP)"
          value={formatCurrency(outputs.revenuePotential, currency)}
          description="Estimated new revenue if you close all target clients next year"
          currency={currency}
          rawAmount={outputs.revenuePotential}
          showCurrencyTrio
        />
      </div>
    </section>
  );
}
