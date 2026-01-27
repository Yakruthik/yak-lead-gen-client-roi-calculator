import { CalculatorInputs, CalculatorOutputs } from '@/hooks/useCalculator';
import { InputField } from './InputField';
import { MetricCard } from './MetricCard';
import { Currency, formatCurrency, rates } from '@/lib/currency';

interface Section3Props {
  inputs: CalculatorInputs;
  outputs: CalculatorOutputs;
  updateInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  currency: Currency;
}

export function Section3({ inputs, outputs, updateInput, currency }: Section3Props) {
  const currencySymbol = rates[currency].symbol;
  
  // Dynamic helper text based on currency
  const costOfRevenueHelper = `You are spending ${outputs.costOfNewRevenue.toFixed(1)} cents to buy 1 ${currencySymbol} of future revenue.`;
  const roiHelper = `For every ${currencySymbol}1 invested, this is your expected return`;

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-secondary">
        <span className="text-3xl">💰</span>
        <h2 className="text-2xl font-bold text-primary">ROI & Investment Simulator</h2>
      </div>

      {/* Input Field */}
      <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 border-l-4 border-l-secondary rounded-lg p-5 mb-6">
        <InputField
          label="Hypothetical Monthly Marketing Budget"
          question="Enter a budget amount to test (e.g. 5000) to see if hiring an expert is worth the investment."
          value={inputs.hypotheticalBudget}
          onChange={(v) => updateInput('hypotheticalBudget', v)}
          placeholder="e.g., 50000"
          currency={currency}
          showCurrencyTrio
          required
        />
      </div>

      {/* Output Widgets */}
      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <MetricCard
          label="PROJECTED ANNUAL INVESTMENT"
          value={formatCurrency(outputs.projectedAnnualInvestment, currency)}
          description="Hypothetical Monthly Budget × 12"
          currency={currency}
          rawAmount={outputs.projectedAnnualInvestment}
          showCurrencyTrio
        />
        <MetricCard
          label="BREAKEVEN (DEALS NEEDED)"
          value={outputs.breakevenDeals + ' deals'}
          description="Deals required to cover the annual investment."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <MetricCard
          label="COST OF NEW REVENUE (%)"
          value={outputs.costOfNewRevenue.toFixed(1) + '%'}
          description={costOfRevenueHelper}
        />
        <MetricCard
          label="YOUR COST PER SQL MEETING"
          value={formatCurrency(outputs.costPerSQL, currency)}
          description="Hypothetical monthly budget ÷ Monthly gap in SQLs"
          currency={currency}
          rawAmount={outputs.costPerSQL}
          showCurrencyTrio
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <MetricCard
          label="NET REVENUE (AFTER MY COST)"
          value={formatCurrency(outputs.netRevenue, currency)}
          description="Client's Revenue Potential - Projected Annual Investment"
          highlight={outputs.netRevenue > 0 ? 'green' : 'red'}
          currency={currency}
          rawAmount={outputs.netRevenue}
          showCurrencyTrio
        />
        <MetricCard
          label="ROI RATIO"
          value={outputs.roiRatio + ':1'}
          description={roiHelper}
          highlight={parseFloat(outputs.roiRatio) >= 3 ? 'green' : parseFloat(outputs.roiRatio) >= 1 ? 'yellow' : 'red'}
        />
      </div>
    </section>
  );
}
