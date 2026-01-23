import { CalculatorInputs } from '@/hooks/useCalculator';
import { InputField } from './InputField';
import { Currency } from '@/lib/currency';

interface Section1Props {
  inputs: CalculatorInputs;
  updateInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  currency: Currency;
  grrRequired: number;
}

export function Section1({ inputs, updateInput, currency, grrRequired }: Section1Props) {
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
          label="SQLs-to-Win Ratio"
          question="What is your close rate? For every 10 qualified leads you speak to, how many actually become paying clients?"
          value={inputs.sqlsPerWin}
          onChange={(v) => updateInput('sqlsPerWin', v)}
          placeholder="e.g., 2 out of 10"
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
          question="What's your total annual sales & marketing budget?"
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
          question="How many new clients did you close in the last 12 months?"
          value={inputs.customersAcquired}
          onChange={(v) => updateInput('customersAcquired', v)}
          placeholder="e.g., 4"
        />
        <InputField
          label="Current CAC (Cost-to-Acquire)"
          question="Do you track what it costs you to acquire one client?"
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
          label="Gross Retention Rate (GRR) %"
          question="What % of your client revenue stayed with you (excluding expansion)?"
          value={inputs.grr}
          onChange={(v) => updateInput('grr', v)}
          placeholder="e.g., 92"
          min={0}
          max={100}
          required
        />
        <InputField
          label="Active Clients (Current)"
          question="How many active client accounts do you have right now?"
          value={inputs.activeCustomers}
          onChange={(v) => updateInput('activeCustomers', v)}
          placeholder="e.g., 30"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <InputField
          label="Annual Client Churn Rate %"
          question="What % of your clients typically churn or don't renew each year?"
          value={inputs.churnRate}
          onChange={(v) => updateInput('churnRate', v)}
          placeholder="e.g., 8"
          min={0}
          max={100}
          required
          autoCalculateNote="Auto-calculated from GRR, but override if known"
        />
        <div className="flex flex-col">
          <label className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
            GRR Required (Based on Lifetime)
            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-success text-success-foreground">
              CALCULATED
            </span>
          </label>
          <span className="text-xs text-muted-foreground italic mb-1.5">
            💡 Based on your Client Lifetime: 100 - (100 ÷ Lifetime)
          </span>
          <div className="px-3 py-2.5 border-2 border-success/50 rounded-lg bg-success/10 text-success font-bold">
            {grrRequired.toFixed(1)}%
          </div>
        </div>
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
