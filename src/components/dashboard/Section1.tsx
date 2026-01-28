import { useState } from 'react';
import { CalculatorInputs, ClientType } from '@/hooks/useCalculator';
import { InputField } from './InputField';
import { ClientTypeCard } from './ClientTypeCard';
import { Currency } from '@/lib/currency';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Section1Props {
  inputs: CalculatorInputs;
  updateInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  currency: Currency;
  selectedClientType: ClientType;
  setSelectedClientType: (type: ClientType) => void;
}

const clientTypes: { type: ClientType; title: string }[] = [
  { type: 'saas', title: 'B2B SaaS' },
  { type: 'agency', title: 'Agency' },
  { type: 'industrial', title: 'Industrial / Manufacturing' },
  { type: 'consulting', title: 'Consulting / Prof Services' },
  { type: 'ecommerce', title: 'E-commerce / DTC' },
];

export function Section1({ inputs, updateInput, currency, selectedClientType, setSelectedClientType }: Section1Props) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-secondary">
        <span className="text-3xl">📋</span>
        <h2 className="text-2xl font-bold text-primary">Your Revenue Baseline</h2>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 mb-5 border-l-4 border-l-secondary">
        <span className="text-muted-foreground">
          Enter your current metrics below to analyze your revenue gap.
        </span>
      </div>

      {/* Business Model Selector */}
      <div className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20 border-l-4 border-l-success rounded-lg p-5 mb-6">
        <h4 className="text-success font-semibold mb-3 text-lg">Select Your Business Model</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {clientTypes.map((ct) => (
            <ClientTypeCard
              key={ct.type}
              type={ct.type}
              title={ct.title}
              selected={selectedClientType === ct.type}
              onSelect={() => setSelectedClientType(ct.type)}
            />
          ))}
        </div>
      </div>

      {/* Pro Tip */}
      <div className="bg-secondary/10 border border-secondary/20 border-l-4 border-l-secondary rounded-lg p-4 mb-6">
        <strong className="text-secondary">💡 Pro Tip:</strong>{' '}
        <span className="text-muted-foreground">
          When asking about Annual Average Contract Value, clarify:{' '}
          <strong className="text-foreground">"I mean the typical annual value of ONE client, not all clients combined."</strong>
        </span>
      </div>

      {/* Contract Value & Lifetime */}
      <h3 className="text-secondary font-semibold text-lg mt-6 mb-4">💰 Contract Value & Lifetime (Choose One Approach)</h3>
      <Tabs defaultValue="aacv" className="mb-5">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="aacv">Annual Value + Lifespan</TabsTrigger>
          <TabsTrigger value="tcv">Total Deal + Term</TabsTrigger>
        </TabsList>
        
        <TabsContent value="aacv">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="Annual Avg Contract Value (AACV)"
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
        </TabsContent>
        
        <TabsContent value="tcv">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="Total Contract Value (TCV)"
              question="What's the total value of a typical contract over its full duration?"
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
              value={inputs.contractDuration}
              onChange={(v) => updateInput('contractDuration', v)}
              placeholder="e.g., 3"
              step="0.5"
              required
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Growth & Pipeline */}
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

      {/* Current Pipeline Status */}
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

      {/* Client Acquisition & Performance */}
      <h3 className="text-secondary font-semibold text-lg mt-6 mb-4">📊 Client Acquisition & Performance</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <InputField
          label="Customers Acquired Last Year"
          question="How many new clients did you close in the last 12 months?"
          value={inputs.customersAcquired}
          onChange={(v) => updateInput('customersAcquired', v)}
          placeholder="e.g., 4"
          required
        />
        <InputField
          label="Current CAC (Cost-to-Acquire)"
          question="Do you track what it costs you to acquire one client?(including salaries, ads, tools, etc.)"
          value={inputs.currentCAC}
          onChange={(v) => updateInput('currentCAC', v)}
          placeholder="e.g., 625000"
          currency={currency}
          showCurrencyTrio
          required
        />
      </div>

      {/* Client Health & Retention */}
      <h3 className="text-secondary font-semibold text-lg mt-6 mb-4">⚠️ Client Health & Retention</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <InputField
          label="Active Clients (Current)"
          question="How many active client accounts do you have right now?"
          value={inputs.activeCustomers}
          onChange={(v) => updateInput('activeCustomers', v)}
          placeholder="e.g., 30"
          required
        />
        <InputField
          label="Annual Client Churn Rate %"
          question="What % of your clients typically churn or don't renew each year?"
          value={inputs.churnRate}
          onChange={(v) => updateInput('churnRate', v)}
          placeholder="e.g., 8"
          min={0}
          max={100}
          required
        />
      </div>
    </section>
  );
}
