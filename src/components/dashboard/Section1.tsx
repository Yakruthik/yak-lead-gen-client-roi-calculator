import { CalculatorInputs } from '@/hooks/useCalculator';
import { InputField } from './InputField';
import { Currency } from '@/lib/currency';

interface Section1Props {
  inputs: CalculatorInputs;
  updateInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  currency: Currency;
}

export function Section1({ inputs, updateInput, currency }: Section1Props) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-secondary">
        <span className="text-3xl">📋</span>
        <h2 className="text-2xl font-bold text-primary">Section 1: Discovery Questions</h2>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 mb-5 border-l-4 border-l-secondary">
        <strong className="text-primary">🎯 Ask these questions naturally.</strong>{' '}
        <span className="text-muted-foreground">
          Enter values in your selected currency. All calculations auto-update.
        </span>
      </div>

      {/* ACV Mode Toggle */}
      <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 border-l-4 border-l-secondary rounded-lg p-5 mb-5">
        <h4 className="text-secondary font-semibold mb-3">💰 Contract Value & Lifetime (Choose One Approach)</h4>
        <div className="flex gap-3 mb-4 flex-wrap">
          <button
            className={`px-4 py-2.5 border-2 border-secondary rounded-lg font-semibold text-sm transition-all ${
              inputs.acvMode === 'acv' 
                ? 'bg-secondary text-secondary-foreground' 
                : 'bg-transparent text-secondary hover:bg-secondary/10'
            }`}
            onClick={() => updateInput('acvMode', 'acv')}
          >
            Annual Avg Value
          </button>
          <button
            className={`px-4 py-2.5 border-2 border-secondary rounded-lg font-semibold text-sm transition-all ${
              inputs.acvMode === 'tcv' 
                ? 'bg-secondary text-secondary-foreground' 
                : 'bg-transparent text-secondary hover:bg-secondary/10'
            }`}
            onClick={() => updateInput('acvMode', 'tcv')}
          >
            Total Deal + Term
          </button>
        </div>

        {inputs.acvMode === 'acv' ? (
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="Annual Average Contract Value (AACV)"
              question="What's the typical annual revenue you get from one client?"
              value={inputs.aacv}
              onChange={(v) => updateInput('aacv', v)}
              placeholder="e.g., 5000000"
              required
              currency={currency}
              showCurrencyTrio
            />
            <InputField
              label="Client Lifetime (Years)"
              question="How long does a typical client stay with you?"
              value={inputs.customerLifetime}
              onChange={(v) => updateInput('customerLifetime', v)}
              placeholder="e.g., 3"
              step="0.5"
              required
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="Total Contract Value (TCV)"
              question="What's the total deal size for a typical contract?"
              value={inputs.tcv}
              onChange={(v) => updateInput('tcv', v)}
              placeholder="e.g., 15000000"
              required
              currency={currency}
              showCurrencyTrio
            />
            <InputField
              label="Contract Duration (Years)"
              question="How long is the typical contract term?"
              value={inputs.contractTerm}
              onChange={(v) => updateInput('contractTerm', v)}
              placeholder="e.g., 3"
              step="0.5"
              required
            />
          </div>
        )}
      </div>

      <h3 className="text-secondary font-semibold text-lg mt-6 mb-4">🎯 Growth & Pipeline</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <InputField
          label="New Clients Target (Annual)"
          question="How many new clients are you targeting this year?"
          value={inputs.newClientTarget}
          onChange={(v) => updateInput('newClientTarget', v)}
          placeholder="e.g., 10"
          required
        />
        <InputField
          label="Current SQLs-Meetings-to-Win Ratio"
          question="In average, how many qualified first meetings (SQLs) do you currently take to close ONE deal? (e.g. If you close 1 in 5, enter 5) Note: It's SQL meets not Generic ICP meets"
          value={inputs.sqlsPerWin}
          onChange={(v) => updateInput('sqlsPerWin', v)}
          placeholder="e.g., 5"
          required
        />
      </div>

      <h3 className="text-secondary font-semibold text-lg mt-6 mb-4">📞 Current Pipeline Status</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <InputField
          label="Current New SQL Meetings per Month"
          question="How many new qualified first meetings are you currently booking each month?"
          value={inputs.currentSQLMeetings}
          onChange={(v) => updateInput('currentSQLMeetings', v)}
          placeholder="e.g., 4"
          required
        />
        <InputField
          label="Current Annual S&M Spend"
          question="What's your total annual sales & marketing budget?(including salaries, ads, tools, etc.)"
          value={inputs.smBudget}
          onChange={(v) => updateInput('smBudget', v)}
          placeholder="e.g., 2500000"
          currency={currency}
          showCurrencyTrio
        />
      </div>

      <h3 className="text-secondary font-semibold text-lg mt-6 mb-4">📊 Client Acquisition & Performance</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <InputField
          label="Clients Acquired Last Year"
          question="How many new clients did you close in the last 12 months?[If Zero, then leave empty]"
          value={inputs.customersAcquired}
          onChange={(v) => updateInput('customersAcquired', v)}
          placeholder="e.g., 4"
        />
        <InputField
          label="Current CAC (Cost-to-Acquire)"
          question="Do you track what it costs you to acquire one client?(including salaries, ads, tools, etc.) [If NO, then leave empty]"
          value={inputs.currentCAC}
          onChange={(v) => updateInput('currentCAC', v)}
          placeholder="e.g., 625000"
          currency={currency}
          showCurrencyTrio
        />
      </div>

      <h3 className="text-secondary font-semibold text-lg mt-6 mb-4">⚠️ Client Health & Retention</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <InputField
          label="Active Clients Number(Current)"
          question="How many active client logo accounts do you have right now?"
          value={inputs.activeCustomers}
          onChange={(v) => updateInput('activeCustomers', v)}
          placeholder="e.g., 30"
          required
        />
        <InputField
          label="Annual Client Logo Churn Rate %"
          question="What % of your client logos typically churn or don't renew each year?"
          value={inputs.churnRate}
          onChange={(v) => updateInput('churnRate', v)}
          placeholder="e.g., 8"
          min={0}
          max={100}
          required
        />
      </div>

      <div className="bg-secondary/10 border border-secondary/20 border-l-4 border-l-secondary rounded-lg p-4 mt-5">
        <strong className="text-secondary">💡 Pro Tip:</strong>{' '}
        <span className="text-muted-foreground">
          When asking about Annual Average Contract Value, clarify:{' '}
          <strong className="text-foreground">"I mean the typical annual value of ONE client, not all clients combined."</strong>
        </span>
      </div>
    </section>
  );
}
